export const galleryArtists = [
  { name: "Rob Duncan", slug: "rob-duncan" },
  { name: "Josh Mann", slug: "josh-mann" },
  { name: "Amanda Simonich", slug: "amanda-simonich" },
  { name: "Aly Wisler", slug: "aly-wisler" },
] as const;

export type GalleryArtistSlug = (typeof galleryArtists)[number]["slug"];
export type GalleryVariant = "thumb" | "full" | "slideshow";

export type GalleryManifestItem = {
  id: string;
  artistSlug: GalleryArtistSlug;
  originalName: string;
  thumbKey: string;
  fullKey: string;
  slideshowKey: string;
  thumbWidth: number;
  thumbHeight: number;
  fullWidth: number;
  fullHeight: number;
  slideshowWidth: 1800;
  slideshowHeight: 1200;
  featured: boolean;
  createdAt: string;
  sortOrder: number;
};

export type PublicGalleryImage = {
  id: string;
  artistName: string;
  artistSlug: GalleryArtistSlug;
  originalName: string;
  thumbUrl: string;
  fullUrl: string;
  slideshowUrl: string;
  thumbWidth: number;
  thumbHeight: number;
  fullWidth: number;
  fullHeight: number;
  slideshowWidth: 1800;
  slideshowHeight: 1200;
  featured: boolean;
  createdAt: string;
  sortOrder: number;
};

export type GalleryArtistPayload = {
  artistName: string;
  artistSlug: GalleryArtistSlug;
  manifestExists: boolean;
  images: PublicGalleryImage[];
};

export type PublicGalleryPayload = {
  artists: GalleryArtistPayload[];
};

export function isGalleryArtistSlug(value: string): value is GalleryArtistSlug {
  return galleryArtists.some((artist) => artist.slug === value);
}

export function getGalleryArtistName(slug: GalleryArtistSlug) {
  return galleryArtists.find((artist) => artist.slug === slug)?.name ?? slug;
}
