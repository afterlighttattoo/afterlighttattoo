"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { PortfolioImage } from "@/app/data/artists";
import { ArtworkLightbox } from "./ArtworkLightbox";

export function PortfolioGrid({ images, compact = false }: { images: PortfolioImage[]; compact?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <div className={`portfolio-grid${compact ? " portfolio-grid-compact" : ""}`}>
        {images.map((image, index) => (
          <button
            className="portfolio-item"
            key={`${image.artistSlug}-${image.filename}-${index}`}
            type="button"
            onClick={(event) => {
              returnFocusRef.current = event.currentTarget;
              setActiveIndex(index);
            }}
            aria-label={`Open ${image.alt}`}
          >
            <Image unoptimized src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" sizes="(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 25vw" />
            <span className="portfolio-overlay"><span>{image.artistName}</span></span>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <ArtworkLightbox
          images={images}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
          returnFocusRef={returnFocusRef}
        />
      )}
    </>
  );
}
