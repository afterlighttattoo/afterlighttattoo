"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PortfolioImage } from "@/app/data/artists";
import { ArtworkLightbox } from "./ArtworkLightbox";

function isPreloaded(index: number, activeIndex: number, length: number) {
  return index === activeIndex || index === (activeIndex - 1 + length) % length || index === (activeIndex + 1) % length;
}

function needsContainedPresentation(image: PortfolioImage) {
  return image.width * image.height < 500_000;
}

export function FeaturedArtworkCarousel({ images }: { images: PortfolioImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const pointerStartXRef = useRef<number | null>(null);
  const ignoreClickRef = useRef(false);
  const imageButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

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
    if (images.length < 2 || hovered || focusWithin || userPaused || pageHidden || reducedMotion || lightboxIndex !== null) return;
    const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % images.length), 5500);
    return () => window.clearTimeout(timer);
  }, [activeIndex, focusWithin, hovered, images.length, lightboxIndex, pageHidden, reducedMotion, userPaused]);

  if (!images.length) return null;

  const active = images[activeIndex];

  const selectSlide = (index: number) => {
    const nextIndex = (index + images.length) % images.length;
    setUserPaused(true);
    setActiveIndex(nextIndex);
    setAnnouncement(`Showing artwork ${nextIndex + 1} of ${images.length} by ${images[nextIndex].artistName}.`);
  };

  const openLightbox = () => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
    setUserPaused(true);
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
      >
        <div className="featured-carousel-stage">
          <button
            ref={imageButtonRef}
            className="featured-carousel-image"
            type="button"
            onClick={openLightbox}
            onPointerDown={(event) => { pointerStartXRef.current = event.clientX; }}
            onPointerUp={(event) => {
              if (pointerStartXRef.current === null) return;
              const delta = event.clientX - pointerStartXRef.current;
              pointerStartXRef.current = null;
              if (Math.abs(delta) < 45) return;
              ignoreClickRef.current = true;
              selectSlide(delta > 0 ? activeIndex - 1 : activeIndex + 1);
            }}
            onPointerCancel={() => { pointerStartXRef.current = null; }}
            aria-label={`Open full image: ${active.alt}`}
          >
            {images.map((image, index) => isPreloaded(index, activeIndex, images.length) ? (
              <Image
                className={`${index === activeIndex ? "is-active" : ""} ${needsContainedPresentation(image) ? "is-contained" : ""}`.trim()}
                key={`${image.artistSlug}-${image.filename}`}
                unoptimized
                src={image.src}
                alt={index === activeIndex ? image.alt : ""}
                width={image.width}
                height={image.height}
                loading="eager"
                draggable={false}
                sizes="100vw"
                aria-hidden={index !== activeIndex}
              />
            ) : null)}
          </button>
        </div>

        <div className="featured-carousel-shade" aria-hidden="true" />

        <div className="featured-carousel-copy">
          <p className="hero-kicker">Custom artwork.</p>
          <h1 id="hero-title">Made permanent.</h1>
          <p>Thoughtful designs. Expert craftsmanship.<br />Made after the light.</p>
          <div className="hero-actions">
            <Link className="button button-gold" href="/booking">Book a Consultation</Link>
            <Link className="text-link" href="/artists">View Artists <span aria-hidden="true">→</span></Link>
          </div>
        </div>

        <div className="featured-carousel-credit">
          <Link href={`/artists/${active.artistSlug}`}>{active.artistName}</Link>
          <Link className="text-link" href="/gallery">View Full Gallery <span aria-hidden="true">→</span></Link>
        </div>

        <button className="featured-carousel-arrow featured-carousel-prev" type="button" onClick={() => selectSlide(activeIndex - 1)} aria-label="Show previous artwork">
          <ChevronLeft aria-hidden="true" size={25} />
        </button>
        <button className="featured-carousel-arrow featured-carousel-next" type="button" onClick={() => selectSlide(activeIndex + 1)} aria-label="Show next artwork">
          <ChevronRight aria-hidden="true" size={25} />
        </button>

        <button
          className="featured-carousel-toggle"
          type="button"
          onClick={() => setUserPaused((paused) => !paused)}
          aria-label={userPaused ? "Play artwork slideshow" : "Pause artwork slideshow"}
          aria-pressed={userPaused}
        >
          {userPaused ? <Play aria-hidden="true" size={16} /> : <Pause aria-hidden="true" size={16} />}
        </button>
        <span className="featured-carousel-count" aria-hidden="true">{activeIndex + 1} / {images.length}</span>
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
