import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
import {
  galleryArtists,
  getGalleryArtistName,
  isGalleryArtistSlug,
  type GalleryArtistPayload,
  type GalleryArtistSlug,
  type GalleryManifestItem,
  type GalleryVariant,
  type PublicGalleryImage,
  type PublicGalleryPayload,
} from "../app/data/gallery";

export interface GalleryEnv {
  GALLERY_BUCKET?: R2Bucket;
  TEAM_DOMAIN?: string;
  POLICY_AUD?: string;
}

type ManifestRead = {
  exists: boolean;
  items: GalleryManifestItem[];
  valid: boolean;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VARIANTS: GalleryVariant[] = ["thumb", "full", "slideshow"];
const MAX_UPLOAD_BYTES: Record<GalleryVariant, number> = {
  thumb: 4 * 1024 * 1024,
  full: 14 * 1024 * 1024,
  slideshow: 10 * 1024 * 1024,
};
const MANIFEST_CACHE_CONTROL = "no-store";
const MEDIA_CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400";
const jwksByTeamDomain = new Map<string, JWTVerifyGetKey>();

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", MANIFEST_CACHE_CONTROL);
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function errorResponse(status: number, message: string, headers?: HeadersInit) {
  return json({ ok: false, error: message }, { status, headers });
}

function methodNotAllowed(allowed: string[]) {
  return errorResponse(405, "Method not allowed.", { Allow: allowed.join(", ") });
}

function manifestKey(artistSlug: GalleryArtistSlug) {
  return `manifests/${artistSlug}.json`;
}

function objectKey(artistSlug: GalleryArtistSlug, variant: GalleryVariant, id: string) {
  return `artists/${artistSlug}/${variant}/${id}.webp`;
}

function isGalleryVariant(value: string): value is GalleryVariant {
  return VARIANTS.includes(value as GalleryVariant);
}

function isPositiveDimension(value: unknown, maximum: number) {
  return Number.isInteger(value) && Number(value) > 0 && Number(value) <= maximum;
}

function normalizeOriginalName(value: unknown) {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[\\/\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return cleaned ? cleaned.slice(0, 180) : null;
}

function isManifestItem(value: unknown, artistSlug: GalleryArtistSlug): value is GalleryManifestItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<GalleryManifestItem>;
  return (
    typeof item.id === "string" && UUID_PATTERN.test(item.id) &&
    item.artistSlug === artistSlug &&
    typeof item.originalName === "string" && item.originalName.length > 0 && item.originalName.length <= 180 &&
    item.thumbKey === objectKey(artistSlug, "thumb", item.id) &&
    item.fullKey === objectKey(artistSlug, "full", item.id) &&
    item.slideshowKey === objectKey(artistSlug, "slideshow", item.id) &&
    isPositiveDimension(item.thumbWidth, 1000) &&
    isPositiveDimension(item.thumbHeight, 1000) &&
    isPositiveDimension(item.fullWidth, 2400) &&
    isPositiveDimension(item.fullHeight, 2400) &&
    item.slideshowWidth === 1800 &&
    item.slideshowHeight === 1200 &&
    typeof item.featured === "boolean" &&
    typeof item.createdAt === "string" && !Number.isNaN(Date.parse(item.createdAt)) &&
    Number.isFinite(item.sortOrder)
  );
}

function sortManifest(items: GalleryManifestItem[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt));
}

async function readManifest(bucket: R2Bucket, artistSlug: GalleryArtistSlug): Promise<ManifestRead> {
  const object = await bucket.get(manifestKey(artistSlug));
  if (!object) return { exists: false, items: [], valid: true };

  try {
    const parsed = await object.json<unknown>();
    if (!Array.isArray(parsed) || !parsed.every((item) => isManifestItem(item, artistSlug))) {
      console.error(`[gallery] Invalid manifest for ${artistSlug}.`);
      return { exists: true, items: [], valid: false };
    }
    return { exists: true, items: sortManifest(parsed), valid: true };
  } catch {
    console.error(`[gallery] Could not parse manifest for ${artistSlug}.`);
    return { exists: true, items: [], valid: false };
  }
}

async function writeManifest(bucket: R2Bucket, artistSlug: GalleryArtistSlug, items: GalleryManifestItem[]) {
  await bucket.put(manifestKey(artistSlug), JSON.stringify(sortManifest(items)), {
    httpMetadata: { contentType: "application/json" },
  });
}

function publicImage(item: GalleryManifestItem): PublicGalleryImage {
  const base = `/media/${item.artistSlug}`;
  return {
    id: item.id,
    artistName: getGalleryArtistName(item.artistSlug),
    artistSlug: item.artistSlug,
    originalName: item.originalName,
    thumbUrl: `${base}/thumb/${item.id}.webp`,
    fullUrl: `${base}/full/${item.id}.webp`,
    slideshowUrl: `${base}/slideshow/${item.id}.webp`,
    thumbWidth: item.thumbWidth,
    thumbHeight: item.thumbHeight,
    fullWidth: item.fullWidth,
    fullHeight: item.fullHeight,
    slideshowWidth: item.slideshowWidth,
    slideshowHeight: item.slideshowHeight,
    featured: item.featured,
    createdAt: item.createdAt,
    sortOrder: item.sortOrder,
  };
}

async function publicArtistPayload(bucket: R2Bucket, artistSlug: GalleryArtistSlug): Promise<GalleryArtistPayload> {
  const manifest = await readManifest(bucket, artistSlug);
  return {
    artistName: getGalleryArtistName(artistSlug),
    artistSlug,
    manifestExists: manifest.exists,
    images: manifest.items.map(publicImage),
  };
}

async function authenticateAccess(request: Request, env: GalleryEnv): Promise<Response | null> {
  const teamDomain = env.TEAM_DOMAIN?.trim().replace(/\/+$/, "");
  const audience = env.POLICY_AUD?.trim();
  if (!teamDomain || !audience) {
    return errorResponse(403, "Administrative access is not configured.");
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) {
    return errorResponse(401, "Authentication required.", { "WWW-Authenticate": "Bearer" });
  }

  try {
    let jwks = jwksByTeamDomain.get(teamDomain);
    if (!jwks) {
      jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
      jwksByTeamDomain.set(teamDomain, jwks);
    }
    await jwtVerify(token, jwks, { issuer: teamDomain, audience });
    return null;
  } catch {
    return errorResponse(403, "Authentication expired or invalid. Please sign in again.");
  }
}

function getBucket(env: GalleryEnv) {
  return env.GALLERY_BUCKET ?? null;
}

async function handlePublicGallery(request: Request, env: GalleryEnv) {
  if (request.method !== "GET") return methodNotAllowed(["GET"]);
  const bucket = getBucket(env);
  if (!bucket) return errorResponse(503, "Gallery storage is temporarily unavailable.");

  const artist = new URL(request.url).searchParams.get("artist");
  if (artist !== null && !isGalleryArtistSlug(artist)) {
    return errorResponse(400, "Unknown artist.");
  }

  try {
    const slugs = artist ? [artist] : galleryArtists.map((entry) => entry.slug);
    const payload: PublicGalleryPayload = {
      artists: await Promise.all(slugs.map((slug) => publicArtistPayload(bucket, slug))),
    };
    return json(payload);
  } catch {
    return errorResponse(500, "Could not load gallery artwork.");
  }
}

async function handleMedia(request: Request, env: GalleryEnv, artistValue: string, variantValue: string, filename: string) {
  if (request.method !== "GET" && request.method !== "HEAD") return methodNotAllowed(["GET", "HEAD"]);
  if (!isGalleryArtistSlug(artistValue) || !isGalleryVariant(variantValue)) return errorResponse(404, "Image not found.");
  const match = /^([0-9a-f-]+)\.webp$/i.exec(filename);
  if (!match || !UUID_PATTERN.test(match[1])) return errorResponse(404, "Image not found.");
  const bucket = getBucket(env);
  if (!bucket) return errorResponse(503, "Gallery storage is temporarily unavailable.");

  const object = request.method === "HEAD"
    ? await bucket.head(objectKey(artistValue, variantValue, match[1].toLowerCase()))
    : await bucket.get(objectKey(artistValue, variantValue, match[1].toLowerCase()));
  if (!object) return errorResponse(404, "Image not found.");

  const etag = object.httpEtag;
  if (request.headers.get("If-None-Match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag, "Cache-Control": MEDIA_CACHE_CONTROL } });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", "image/webp");
  headers.set("Cache-Control", MEDIA_CACHE_CONTROL);
  headers.set("ETag", etag);
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(request.method === "HEAD" ? null : (object as R2ObjectBody).body, { headers });
}

async function handleAdminList(request: Request, env: GalleryEnv) {
  if (request.method !== "GET") return methodNotAllowed(["GET"]);
  const artist = new URL(request.url).searchParams.get("artist");
  if (!artist || !isGalleryArtistSlug(artist)) return errorResponse(400, "Select a valid artist.");
  const bucket = getBucket(env);
  if (!bucket) return errorResponse(503, "Gallery storage is unavailable.");

  try {
    const manifest = await readManifest(bucket, artist);
    if (!manifest.valid) return errorResponse(500, "This artist's gallery data needs attention before it can be edited.");
    return json({ ok: true, ...(await publicArtistPayload(bucket, artist)) });
  } catch {
    return errorResponse(500, "Could not load the artist's artwork.");
  }
}

async function handleVariantUpload(
  request: Request,
  env: GalleryEnv,
  artistValue: string,
  idValue: string,
  variantValue: string,
) {
  if (request.method !== "PUT" && request.method !== "DELETE") return methodNotAllowed(["PUT", "DELETE"]);
  if (!isGalleryArtistSlug(artistValue) || !UUID_PATTERN.test(idValue) || !isGalleryVariant(variantValue)) {
    return errorResponse(400, "Invalid upload path.");
  }
  const bucket = getBucket(env);
  if (!bucket) return errorResponse(503, "Gallery storage is unavailable.");
  const id = idValue.toLowerCase();
  const key = objectKey(artistValue, variantValue, id);

  const manifest = await readManifest(bucket, artistValue);
  if (!manifest.valid) return errorResponse(500, "This artist's gallery data needs attention before uploads can be changed.");
  if (manifest.items.some((item) => item.id === id)) {
    return errorResponse(409, "Published artwork cannot be changed through the temporary upload path.");
  }

  if (request.method === "DELETE") {
    await bucket.delete(key);
    return json({ ok: true });
  }

  if (request.headers.get("Content-Type")?.split(";", 1)[0].trim().toLowerCase() !== "image/webp") {
    return errorResponse(415, "Upload must be a WebP image.");
  }
  if (!request.body) return errorResponse(400, "Image data is missing.");

  const declaredSize = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declaredSize) && declaredSize > MAX_UPLOAD_BYTES[variantValue]) {
    return errorResponse(413, "Processed image is too large.");
  }

  try {
    const stored = await bucket.put(key, request.body, {
      httpMetadata: { contentType: "image/webp", cacheControl: MEDIA_CACHE_CONTROL },
      customMetadata: { artistSlug: artistValue, artworkId: id, variant: variantValue },
    });
    if (stored.size === 0 || stored.size > MAX_UPLOAD_BYTES[variantValue]) {
      await bucket.delete(key);
      return errorResponse(stored.size === 0 ? 400 : 413, stored.size === 0 ? "Image data is missing." : "Processed image is too large.");
    }
    return json({ ok: true, variant: variantValue, size: stored.size }, { status: 201 });
  } catch {
    return errorResponse(500, "Could not upload this image. Try again.");
  }
}

async function deleteUploadedVariants(bucket: R2Bucket, artistSlug: GalleryArtistSlug, id: string) {
  await bucket.delete(VARIANTS.map((variant) => objectKey(artistSlug, variant, id)));
}

async function handleFinalize(request: Request, env: GalleryEnv) {
  if (request.method !== "POST") return methodNotAllowed(["POST"]);
  const bucket = getBucket(env);
  if (!bucket) return errorResponse(503, "Gallery storage is unavailable.");

  let input: Record<string, unknown>;
  try {
    input = await request.json<Record<string, unknown>>();
  } catch {
    return errorResponse(400, "Upload details are invalid.");
  }

  const artistValue = input.artistSlug;
  const idValue = input.id;
  const originalName = normalizeOriginalName(input.originalName);
  if (
    typeof artistValue !== "string" || !isGalleryArtistSlug(artistValue) ||
    typeof idValue !== "string" || !UUID_PATTERN.test(idValue) ||
    !originalName || typeof input.featured !== "boolean" ||
    !isPositiveDimension(input.thumbWidth, 1000) || !isPositiveDimension(input.thumbHeight, 1000) ||
    !isPositiveDimension(input.fullWidth, 2400) || !isPositiveDimension(input.fullHeight, 2400)
  ) {
    return errorResponse(400, "Upload details are invalid.");
  }

  const id = idValue.toLowerCase();
  try {
    const objects = await Promise.all(VARIANTS.map((variant) => bucket.head(objectKey(artistValue, variant, id))));
    if (objects.some((object) => !object || object.httpMetadata?.contentType !== "image/webp")) {
      await deleteUploadedVariants(bucket, artistValue, id);
      return errorResponse(409, "The upload was incomplete. Please try this image again.");
    }

    const manifest = await readManifest(bucket, artistValue);
    if (!manifest.valid) {
      await deleteUploadedVariants(bucket, artistValue, id);
      return errorResponse(500, "This artist's gallery data needs attention before new artwork can be added.");
    }
    if (manifest.items.some((item) => item.id === id)) return errorResponse(409, "This artwork has already been added.");
    const maxSortOrder = manifest.items.reduce((maximum, item) => Math.max(maximum, item.sortOrder), 0);
    const item: GalleryManifestItem = {
      id,
      artistSlug: artistValue,
      originalName,
      thumbKey: objectKey(artistValue, "thumb", id),
      fullKey: objectKey(artistValue, "full", id),
      slideshowKey: objectKey(artistValue, "slideshow", id),
      thumbWidth: Number(input.thumbWidth),
      thumbHeight: Number(input.thumbHeight),
      fullWidth: Number(input.fullWidth),
      fullHeight: Number(input.fullHeight),
      slideshowWidth: 1800,
      slideshowHeight: 1200,
      featured: input.featured,
      createdAt: new Date().toISOString(),
      sortOrder: maxSortOrder + 100,
    };
    await writeManifest(bucket, artistValue, [...manifest.items, item]);
    return json({ ok: true, image: publicImage(item) }, { status: 201 });
  } catch {
    return errorResponse(500, "Could not finish this upload. Try again.");
  }
}

async function handleArtworkMutation(request: Request, env: GalleryEnv, artistValue: string, idValue: string) {
  if (request.method !== "PATCH" && request.method !== "DELETE") return methodNotAllowed(["PATCH", "DELETE"]);
  if (!isGalleryArtistSlug(artistValue) || !UUID_PATTERN.test(idValue)) return errorResponse(400, "Invalid artwork.");
  const bucket = getBucket(env);
  if (!bucket) return errorResponse(503, "Gallery storage is unavailable.");
  const id = idValue.toLowerCase();

  try {
    const manifest = await readManifest(bucket, artistValue);
    if (!manifest.valid) return errorResponse(500, "This artist's gallery data needs attention before it can be edited.");
    const index = manifest.items.findIndex((item) => item.id === id);
    if (index < 0) return errorResponse(404, "Artwork not found.");

    if (request.method === "PATCH") {
      let input: { featured?: unknown };
      try {
        input = await request.json<{ featured?: unknown }>();
      } catch {
        return errorResponse(400, "Update details are invalid.");
      }
      if (typeof input.featured !== "boolean") return errorResponse(400, "Featured setting must be true or false.");
      const updated = { ...manifest.items[index], featured: input.featured };
      const items = [...manifest.items];
      items[index] = updated;
      await writeManifest(bucket, artistValue, items);
      return json({ ok: true, image: publicImage(updated) });
    }

    const items = manifest.items.filter((item) => item.id !== id);
    await writeManifest(bucket, artistValue, items);
    await deleteUploadedVariants(bucket, artistValue, id);
    return json({ ok: true });
  } catch {
    return errorResponse(500, request.method === "DELETE" ? "Could not delete image. Try again." : "Could not update image. Try again.");
  }
}

async function handleAdminApi(request: Request, env: GalleryEnv, pathname: string) {
  if (pathname === "/admin/api/gallery") return handleAdminList(request, env);
  if (pathname === "/admin/api/gallery/finalize") return handleFinalize(request, env);

  const uploadMatch = /^\/admin\/api\/gallery\/upload\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(pathname);
  if (uploadMatch) return handleVariantUpload(request, env, uploadMatch[1], uploadMatch[2], uploadMatch[3]);

  const artworkMatch = /^\/admin\/api\/gallery\/([^/]+)\/([^/]+)$/.exec(pathname);
  if (artworkMatch) return handleArtworkMutation(request, env, artworkMatch[1], artworkMatch[2]);
  return errorResponse(404, "Administrative endpoint not found.");
}

export async function handleGalleryRequest(request: Request, env: GalleryEnv): Promise<Response | null> {
  const { pathname } = new URL(request.url);

  if (pathname === "/api/gallery") return handlePublicGallery(request, env);

  const mediaMatch = /^\/media\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(pathname);
  if (mediaMatch) return handleMedia(request, env, mediaMatch[1], mediaMatch[2], mediaMatch[3]);

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const authFailure = await authenticateAccess(request, env);
    if (authFailure) return authFailure;
    if (pathname.startsWith("/admin/api/")) return handleAdminApi(request, env, pathname);
  }

  return null;
}
