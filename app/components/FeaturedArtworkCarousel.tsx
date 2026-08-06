"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PortfolioImage } from "@/app/data/artists";
import { ArtworkLightbox } from "./ArtworkLightbox";

function isPreloaded(index: number, activeIndex: number, length: number) {
  return index === activeIndex || index === (activeIndex - 1 + length) % length || index === (activeIndex + 1) % length;
}

export function FeaturedArtworkCarousel({ images }: { images: PortfolioImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const pointerStartXRef = useRef<number | null>(null);
  const ignoreClickRef = useRef(false);
  const imageButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const active = images[activeIndex];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageHidden(document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (images.length < 2 || hovered || focusWithin || manualPause || pageHidden || reducedMotion || lightboxIndex !== null) return;
    const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % images.length), 5500);
    return () => window.clearTimeout(timer);
  }, [activeIndex, focusWithin, hovered, images.length, lightboxIndex, manualPause, pageHidden, reducedMotion]);

  if (!images.length) return null;

  const selectSlide = (index: number) => {
    const nextIndex = (index + images.length) % images.length;
    setManualPause(true);
    setActiveIndex(nextIndex);
    setAnnouncement(`Showing artwork ${nextIndex + 1} of ${images.length} by ${images[nextIndex].artistName}.`);
  };

  const openLightbox = () => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
    setManualPause(true);
    returnFocusRef.current = imageButtonRef.current;
    setLightboxIndex(activeIndex);
  };

  return (
    <>
      <div
        className="featured-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured tattoo artwork"
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            selectSlide(activeIndex - 1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            selectSlide(activeIndex + 1);
          }
        }}
        onPointerDown={(event) => {
          pointerStartXRef.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (pointerStartXRef.current === null) return;
          const delta = event.clientX - pointerStartXRef.current;
          pointerStartXRef.current = null;
          if (Math.abs(delta) < 45) return;
          ignoreClickRef.current = true;
          selectSlide(delta > 0 ? activeIndex - 1 : activeIndex + 1);
        }}
        onPointerCancel={() => { pointerStartXRef.current = null; }}
      >
        <button ref={imageButtonRef} className="featured-carousel-image" type="button" onClick={openLightbox} aria-label={`Open full image: ${active.alt}`}>
          {images.map((image, index) => isPreloaded(index, activeIndex, images.length) ? (
            <Image
              className={index === activeIndex ? "is-active" : ""}
              key={`${image.artistSlug}-${image.filename}`}
              unoptimized
              src={image.src}
              alt={index === activeIndex ? image.alt : ""}
              width={image.width}
              height={image.height}
              loading="eager"
              draggable={false}
              sizes="(max-width: 760px) calc(100vw - 28px), (max-width: 1180px) 55vw, 650px"
              aria-hidden={index !== activeIndex}
            />
          ) : null)}
          <span className="featured-carousel-expand" aria-hidden="true"><Maximize2 size={17} /></span>
        </button>

        <div className="featured-carousel-bar">
          <div className="featured-carousel-credit">
            <span>Tattoo by</span>
            <Link href={`/artists/${active.artistSlug}`}>{active.artistName}</Link>
          </div>
          <div className="featured-carousel-actions">
            <span className="featured-carousel-count" aria-hidden="true">{activeIndex + 1} / {images.length}</span>
            <button type="button" onClick={() => selectSlide(activeIndex - 1)} aria-label="Show previous artwork"><ChevronLeft aria-hidden="true" size={21} /></button>
            <button type="button" onClick={() => selectSlide(activeIndex + 1)} aria-label="Show next artwork"><ChevronRight aria-hidden="true" size={21} /></button>
          </div>
        </div>
        <Link className="featured-carousel-gallery" href="/gallery">View Full Gallery</Link>
        <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
      </div>

      {lightboxIndex !== null && (
        <ArtworkLightbox
          images={images}
          activeIndex={lightboxIndex}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          returnFocusRef={returnFocusRef}
        />
      )}
    </>
  );
}
