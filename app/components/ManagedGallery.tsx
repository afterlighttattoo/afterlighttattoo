"use client";

import { useEffect, useMemo, useState } from "react";
import type { Artist, PortfolioImage } from "@/app/data/artists";
import type { GalleryArtistPayload, PublicGalleryImage, PublicGalleryPayload } from "@/app/data/gallery";
import { FeaturedArtworkCarousel } from "./FeaturedArtworkCarousel";
import { GalleryExplorer } from "./GalleryExplorer";
import { PortfolioGrid } from "./PortfolioGrid";

function asGridImage(image: PublicGalleryImage): PortfolioImage {
  return {
    id: image.id,
    src: image.thumbUrl,
    fullSrc: image.fullUrl,
    width: image.thumbWidth,
    height: image.thumbHeight,
    fullWidth: image.fullWidth,
    fullHeight: image.fullHeight,
    alt: `Custom tattoo by ${image.artistName}`,
    artistName: image.artistName,
    artistSlug: image.artistSlug,
    filename: `${image.id}.webp`,
    featured: image.featured,
  };
}

function asSlideshowImage(image: PublicGalleryImage): PortfolioImage {
  return {
    ...asGridImage(image),
    src: image.slideshowUrl,
    width: image.slideshowWidth,
    height: image.slideshowHeight,
    homepagePrepared: true,
  };
}

function roundRobin(imageLists: PortfolioImage[][]) {
  const longest = Math.max(0, ...imageLists.map((images) => images.length));
  return Array.from({ length: longest }, (_, index) => imageLists.map((images) => images[index]).filter(Boolean)).flat();
}

function useGalleryPayload(artistSlug?: string) {
  const [payload, setPayload] = useState<PublicGalleryPayload | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const query = artistSlug ? `?artist=${encodeURIComponent(artistSlug)}` : "";
    fetch(`/api/gallery${query}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Gallery request failed");
        return response.json() as Promise<PublicGalleryPayload>;
      })
      .then(setPayload)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setPayload(null);
      });
    return () => controller.abort();
  }, [artistSlug]);

  return payload;
}

function resolvedArtistImages(artist: Artist, managed: GalleryArtistPayload | undefined) {
  return managed?.manifestExists ? managed.images.map(asGridImage) : artist.portfolioImages;
}

export function ManagedFeaturedArtworkCarousel({ artists, fallbackImages }: { artists: Artist[]; fallbackImages: PortfolioImage[] }) {
  const payload = useGalleryPayload();
  const images = useMemo(() => {
    if (!payload) return fallbackImages;
    const lists = artists.map((artist) => {
      const managed = payload.artists.find((entry) => entry.artistSlug === artist.slug);
      if (!managed?.manifestExists) {
        return artist.portfolioImages
          .map((image, originalIndex) => ({ image, originalIndex }))
          .sort((a, b) => (b.image.width * b.image.height) - (a.image.width * a.image.height) || a.originalIndex - b.originalIndex)
          .map(({ image }) => image);
      }
      return managed.images.filter((image) => image.featured).map(asSlideshowImage);
    });
    return roundRobin(lists);
  }, [artists, fallbackImages, payload]);

  return <FeaturedArtworkCarousel images={images} />;
}

export function ManagedGalleryExplorer({ artists }: { artists: Artist[] }) {
  const payload = useGalleryPayload();
  const images = useMemo(() => {
    if (!payload) return artists.flatMap((artist) => artist.portfolioImages);
    return artists.flatMap((artist) => resolvedArtistImages(
      artist,
      payload.artists.find((entry) => entry.artistSlug === artist.slug),
    ));
  }, [artists, payload]);

  return <GalleryExplorer artists={artists} images={images} />;
}

export function ManagedPortfolioGrid({ artist, compact = false }: { artist: Artist; compact?: boolean }) {
  const payload = useGalleryPayload(artist.slug);
  const images = useMemo(
    () => resolvedArtistImages(artist, payload?.artists[0]),
    [artist, payload],
  );
  return <PortfolioGrid images={images} compact={compact} />;
}
