"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { PortfolioImage } from "@/app/data/artists";

export function PortfolioGrid({ images, compact = false }: { images: PortfolioImage[]; compact?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : images[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((activeIndex + 1) % images.length);
      if (event.key === "ArrowLeft") setActiveIndex((activeIndex - 1 + images.length) % images.length);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeIndex, images.length]);

  return (
    <>
      <div className={`portfolio-grid${compact ? " portfolio-grid-compact" : ""}`}>
        {images.map((image, index) => (
          <button className="portfolio-item" key={`${image.artistSlug}-${image.filename}-${index}`} type="button" onClick={() => setActiveIndex(index)} aria-label={`Open ${image.alt}`}>
            <Image unoptimized src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" sizes="(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 25vw" />
            <span className="portfolio-overlay">
              <span>{image.artistName}</span>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${active.artistName} portfolio image`} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setActiveIndex(null);
        }}>
          <button className="lightbox-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Close image">×</button>
          {images.length > 1 && <button className="lightbox-arrow lightbox-prev" type="button" onClick={() => setActiveIndex((activeIndex! - 1 + images.length) % images.length)} aria-label="Previous image">←</button>}
          <figure>
            <Image unoptimized src={active.src} alt={active.alt} width={active.width} height={active.height} sizes="100vw" />
            <figcaption><span>{active.artistName}</span><small>{activeIndex! + 1} / {images.length}</small></figcaption>
          </figure>
          {images.length > 1 && <button className="lightbox-arrow lightbox-next" type="button" onClick={() => setActiveIndex((activeIndex! + 1) % images.length)} aria-label="Next image">→</button>}
        </div>
      )}
    </>
  );
}
