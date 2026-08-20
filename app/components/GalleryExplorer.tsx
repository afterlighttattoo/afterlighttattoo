"use client";

import { useState } from "react";
import type { Artist, PortfolioImage } from "@/app/data/artists";
import { PortfolioGrid } from "./PortfolioGrid";

export function GalleryExplorer({ artists, images }: { artists: Artist[]; images: PortfolioImage[] }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? images : images.filter((image) => image.artistSlug === filter);
  return (
    <div>
      <div className="gallery-toolbar" aria-label="Filter portfolio by artist">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")} type="button">All work <span>{images.length}</span></button>
        {artists.map((artist) => (
          <button className={filter === artist.slug ? "active" : ""} onClick={() => setFilter(artist.slug)} type="button" key={artist.slug}>
            {artist.name} <span>{images.filter((image) => image.artistSlug === artist.slug).length}</span>
          </button>
        ))}
      </div>
      <p className="gallery-count" aria-live="polite">Showing {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}</p>
      <PortfolioGrid images={filtered} />
    </div>
  );
}
