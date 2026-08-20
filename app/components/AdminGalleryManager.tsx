"use client";

import Image from "next/image";
import { AlertCircle, Check, ImagePlus, Trash2, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { galleryArtists, type GalleryArtistPayload, type GalleryArtistSlug, type PublicGalleryImage } from "@/app/data/gallery";

const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ACCEPTED_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

type PreparedVariant = { blob: Blob; width: number; height: number };
type UploadStatus = "ready" | "processing" | "uploading" | "success" | "error";
type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  artistSlug: GalleryArtistSlug;
  featured: boolean;
  progress: number;
  status: UploadStatus;
  message: string;
};

type AdminGalleryResponse = GalleryArtistPayload & { ok: boolean; error?: string };

function canvasBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not prepare image.")), "image/webp", quality);
  });
}

function drawContained(
  context: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  inset = 1,
) {
  const scale = Math.min(1, (targetWidth * inset) / sourceWidth, (targetHeight * inset) / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  context.drawImage(source, (targetWidth - width) / 2, (targetHeight - height) / 2, width, height);
}

async function createResizedVariant(bitmap: ImageBitmap, maximumDimension: number, quality: number): Promise<PreparedVariant> {
  const scale = Math.min(1, maximumDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("This browser could not prepare the image.");
  context.fillStyle = "#050505";
  context.fillRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  return { blob: await canvasBlob(canvas, quality), width, height };
}

async function createSlideshowVariant(bitmap: ImageBitmap): Promise<PreparedVariant> {
  const width = 1800;
  const height = 1200;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("This browser could not prepare the slideshow image.");

  context.fillStyle = "#050505";
  context.fillRect(0, 0, width, height);
  const coverScale = Math.max(width / bitmap.width, height / bitmap.height) * 1.08;
  const backdropWidth = bitmap.width * coverScale;
  const backdropHeight = bitmap.height * coverScale;
  context.save();
  context.filter = "blur(28px) brightness(0.42)";
  context.globalAlpha = 0.62;
  context.drawImage(bitmap, (width - backdropWidth) / 2, (height - backdropHeight) / 2, backdropWidth, backdropHeight);
  context.restore();
  context.fillStyle = "rgba(5, 5, 5, 0.34)";
  context.fillRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  drawContained(context, bitmap, bitmap.width, bitmap.height, width, height, 0.9);
  return { blob: await canvasBlob(canvas, 0.88), width, height };
}

async function responseError(response: Response) {
  try {
    const payload = await response.json() as { error?: string };
    return payload.error || "The request could not be completed.";
  } catch {
    return "The request could not be completed.";
  }
}

async function fetchArtistArtwork(slug: GalleryArtistSlug) {
  const response = await fetch(`/admin/api/gallery?artist=${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!response.ok) throw new Error(await responseError(response));
  return response.json() as Promise<AdminGalleryResponse>;
}

function isAcceptedFile(file: File) {
  return (ACCEPTED_TYPES.has(file.type) || (!file.type && ACCEPTED_EXTENSIONS.test(file.name))) && ACCEPTED_EXTENSIONS.test(file.name);
}

export function AdminGalleryManager() {
  const [artistSlug, setArtistSlug] = useState<GalleryArtistSlug>("rob-duncan");
  const [artwork, setArtwork] = useState<PublicGalleryImage[]>([]);
  const [manifestExists, setManifestExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [batchMessage, setBatchMessage] = useState("");
  const [dropActive, setDropActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PublicGalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef(new Set<string>());
  const deleteCancelRef = useRef<HTMLButtonElement>(null);

  const loadArtwork = useCallback(async (slug: GalleryArtistSlug) => {
    setLoading(true);
    setLoadError("");
    try {
      const payload = await fetchArtistArtwork(slug);
      setArtwork(payload.images);
      setManifestExists(payload.manifestExists);
    } catch (error) {
      setArtwork([]);
      setLoadError(error instanceof Error ? error.message : "Could not load artwork.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchArtistArtwork(artistSlug)
      .then((payload) => {
        if (!active) return;
        setArtwork(payload.images);
        setManifestExists(payload.manifestExists);
        setLoadError("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setArtwork([]);
        setLoadError(error instanceof Error ? error.message : "Could not load artwork.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [artistSlug]);

  useEffect(() => {
    if (deleteTarget) deleteCancelRef.current?.focus();
  }, [deleteTarget]);

  useEffect(() => () => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const updateUpload = (id: string, update: Partial<UploadItem>) => {
    setUploads((current) => current.map((item) => item.id === id ? { ...item, ...update } : item));
  };

  const addFiles = (files: File[]) => {
    const next: UploadItem[] = [];
    const errors: string[] = [];
    for (const file of files) {
      if (!isAcceptedFile(file)) {
        errors.push(`${file.name}: Unsupported image type.`);
        continue;
      }
      if (file.size > MAX_SOURCE_BYTES) {
        errors.push(`${file.name}: Image is too large. The limit is 30 MB.`);
        continue;
      }
      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.add(previewUrl);
      next.push({
        id: crypto.randomUUID(),
        file,
        previewUrl,
        artistSlug,
        featured: true,
        progress: 0,
        status: "ready",
        message: "Ready to upload",
      });
    }
    if (next.length) setUploads((current) => [...current, ...next]);
    setBatchMessage(errors.join(" "));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeUpload = (id: string) => {
    setUploads((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
        previewUrlsRef.current.delete(item.previewUrl);
      }
      return current.filter((entry) => entry.id !== id);
    });
  };

  const uploadItem = async (item: UploadItem) => {
    let bitmap: ImageBitmap | null = null;
    const uploadedVariants: string[] = [];
    try {
      updateUpload(item.id, { status: "processing", progress: 5, message: "Preparing image…" });
      bitmap = await createImageBitmap(item.file, { imageOrientation: "from-image" });
      const thumb = await createResizedVariant(bitmap, 960, 0.82);
      updateUpload(item.id, { progress: 12 });
      const full = await createResizedVariant(bitmap, 2400, 0.91);
      updateUpload(item.id, { progress: 20 });
      const slideshow = await createSlideshowVariant(bitmap);
      const variants = [
        { name: "thumb", data: thumb },
        { name: "full", data: full },
        { name: "slideshow", data: slideshow },
      ] as const;

      updateUpload(item.id, { status: "uploading", progress: 24, message: "Uploading…" });
      for (let index = 0; index < variants.length; index += 1) {
        const variant = variants[index];
        const response = await fetch(`/admin/api/gallery/upload/${item.artistSlug}/${item.id}/${variant.name}`, {
          method: "PUT",
          headers: { "Content-Type": "image/webp" },
          body: variant.data.blob,
        });
        if (!response.ok) throw new Error(await responseError(response));
        uploadedVariants.push(variant.name);
        updateUpload(item.id, { progress: 24 + ((index + 1) * 20) });
      }

      const finalize = await fetch("/admin/api/gallery/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          artistSlug: item.artistSlug,
          originalName: item.file.name,
          featured: item.featured,
          thumbWidth: thumb.width,
          thumbHeight: thumb.height,
          fullWidth: full.width,
          fullHeight: full.height,
        }),
      });
      if (!finalize.ok) throw new Error(await responseError(finalize));
      updateUpload(item.id, { status: "success", progress: 100, message: "Upload completed." });
      return true;
    } catch (error) {
      await Promise.allSettled(uploadedVariants.map((variant) => fetch(
        `/admin/api/gallery/upload/${item.artistSlug}/${item.id}/${variant}`,
        { method: "DELETE" },
      )));
      updateUpload(item.id, {
        status: "error",
        message: error instanceof Error ? error.message : "Upload failed. Try again.",
      });
      return false;
    } finally {
      bitmap?.close();
    }
  };

  const uploadAll = async () => {
    const ready = uploads.filter((item) => item.status === "ready" || item.status === "error");
    if (!ready.length || isUploading) return;
    setIsUploading(true);
    setBatchMessage("");
    let completed = 0;
    for (const item of ready) {
      if (await uploadItem(item)) completed += 1;
    }
    setBatchMessage(completed === ready.length ? "Upload completed." : `${completed} of ${ready.length} images uploaded successfully.`);
    setIsUploading(false);
    await loadArtwork(artistSlug);
  };

  const toggleFeatured = async (image: PublicGalleryImage) => {
    const nextValue = !image.featured;
    setArtwork((current) => current.map((item) => item.id === image.id ? { ...item, featured: nextValue } : item));
    try {
      const response = await fetch(`/admin/api/gallery/${image.artistSlug}/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: nextValue }),
      });
      if (!response.ok) throw new Error(await responseError(response));
    } catch (error) {
      setArtwork((current) => current.map((item) => item.id === image.id ? { ...item, featured: image.featured } : item));
      setLoadError(error instanceof Error ? error.message : "Could not update image. Try again.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      const response = await fetch(`/admin/api/gallery/${deleteTarget.artistSlug}/${deleteTarget.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(await responseError(response));
      setArtwork((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not delete image. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-manager">
      <div className="admin-toolbar">
        <label htmlFor="admin-artist">Artist</label>
        <select id="admin-artist" value={artistSlug} onChange={(event) => {
          setLoading(true);
          setLoadError("");
          setArtistSlug(event.target.value as GalleryArtistSlug);
        }} disabled={isUploading}>
          {galleryArtists.map((artist) => <option value={artist.slug} key={artist.slug}>{artist.name}</option>)}
        </select>
      </div>

      <section className="admin-panel" aria-labelledby="current-artwork-heading">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 id="current-artwork-heading">Current Artwork</h2>
          </div>
          <span>{artwork.length} {artwork.length === 1 ? "image" : "images"}</span>
        </div>

        {loadError && <p className="admin-alert admin-alert-error" role="alert"><AlertCircle aria-hidden="true" size={18} />{loadError}</p>}
        {loading ? (
          <p className="admin-loading" role="status">Loading artwork…</p>
        ) : !manifestExists ? (
          <p className="admin-migration-note">This artist is still using the existing website gallery. Upload the complete collection in one batch when you&apos;re ready to manage it here.</p>
        ) : artwork.length === 0 ? (
          <p className="admin-loading">This artist&apos;s gallery is empty.</p>
        ) : (
          <div className="admin-artwork-grid">
            {artwork.map((image) => (
              <article className="admin-artwork-card" key={image.id}>
                <div className="admin-artwork-image">
                  <Image unoptimized src={image.thumbUrl} alt={`Tattoo artwork by ${image.artistName}`} width={image.thumbWidth} height={image.thumbHeight} sizes="(max-width: 560px) 50vw, 240px" />
                </div>
                <div className="admin-artwork-controls">
                  <label className="admin-feature-toggle">
                    <input type="checkbox" checked={image.featured} onChange={() => void toggleFeatured(image)} />
                    <span>Include in homepage slideshow</span>
                  </label>
                  <button className="admin-delete-button" type="button" onClick={() => setDeleteTarget(image)}>
                    <Trash2 aria-hidden="true" size={17} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-panel admin-upload-panel" aria-labelledby="add-artwork-heading">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">Add to portfolio</p>
            <h2 id="add-artwork-heading">Add Artwork</h2>
          </div>
        </div>

        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
        />
        <button
          className={`admin-dropzone${dropActive ? " is-active" : ""}`}
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(event) => { event.preventDefault(); setDropActive(true); }}
          onDragOver={(event) => { event.preventDefault(); setDropActive(true); }}
          onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropActive(false); }}
          onDrop={(event) => {
            event.preventDefault();
            setDropActive(false);
            addFiles(Array.from(event.dataTransfer.files));
          }}
        >
          <UploadCloud aria-hidden="true" size={28} />
          <strong>Choose or drop tattoo photographs</strong>
          <span>JPG, PNG, or WebP · up to 30 MB each · multiple images welcome</span>
        </button>

        {uploads.length > 0 && (
          <div className="admin-upload-queue">
            <div className="admin-upload-summary">
              <p>{uploads.length} {uploads.length === 1 ? "image" : "images"} selected</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}><ImagePlus aria-hidden="true" size={17} /> Add more</button>
            </div>
            <div className="admin-preview-grid">
              {uploads.map((item) => (
                <article className={`admin-preview-card is-${item.status}`} key={item.id}>
                  <div className="admin-preview-image">
                    {/* A local object URL is used only for the administrator's pre-upload preview. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.previewUrl} alt={`Preview of ${item.file.name}`} />
                    {item.status === "success" && <span className="admin-preview-success"><Check aria-hidden="true" size={18} /></span>}
                  </div>
                  <div className="admin-preview-body">
                    <strong title={item.file.name}>{item.file.name}</strong>
                    <span>{galleryArtists.find((artist) => artist.slug === item.artistSlug)?.name}</span>
                    <label className="admin-feature-toggle">
                      <input
                        type="checkbox"
                        checked={item.featured}
                        disabled={item.status !== "ready" && item.status !== "error"}
                        onChange={(event) => updateUpload(item.id, { featured: event.target.checked })}
                      />
                      <span>Include in homepage slideshow</span>
                    </label>
                    <div className="admin-progress" aria-label={`${item.progress}% uploaded`}>
                      <span style={{ width: `${item.progress}%` }} />
                    </div>
                    <p className={item.status === "error" ? "is-error" : ""}>{item.message}</p>
                  </div>
                  {(item.status === "ready" || item.status === "error") && (
                    <button className="admin-preview-remove" type="button" onClick={() => removeUpload(item.id)} aria-label={`Remove ${item.file.name}`}>
                      <X aria-hidden="true" size={16} />
                    </button>
                  )}
                </article>
              ))}
            </div>
            <button className="button button-gold admin-upload-button" type="button" onClick={() => void uploadAll()} disabled={isUploading || !uploads.some((item) => item.status === "ready" || item.status === "error")}>
              {isUploading ? "Uploading…" : `Upload ${uploads.filter((item) => item.status === "ready" || item.status === "error").length || ""} ${uploads.filter((item) => item.status === "ready" || item.status === "error").length === 1 ? "Image" : "Images"}`}
            </button>
          </div>
        )}
        {batchMessage && <p className={`admin-alert${batchMessage.includes("successfully") && !batchMessage.startsWith("0") || batchMessage === "Upload completed." ? " admin-alert-success" : " admin-alert-error"}`} role="status">{batchMessage}</p>}
      </section>

      {deleteTarget && (
        <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !deleting) setDeleteTarget(null); }}>
          <div className="admin-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
            <h2 id="delete-title">Delete this artwork?</h2>
            <p id="delete-description">This will remove it from the artist&apos;s portfolio, the main gallery, and the homepage slideshow.</p>
            <div className="button-row">
              <button ref={deleteCancelRef} className="button button-outline" type="button" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button className="button button-danger" type="button" onClick={() => void confirmDelete()} disabled={deleting}>{deleting ? "Deleting…" : "Delete Artwork"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
