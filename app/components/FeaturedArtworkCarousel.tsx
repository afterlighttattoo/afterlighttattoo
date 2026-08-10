"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from "lucide-react";
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
  const [userPaused, setUserPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const pointerStartXRef = useRef<number | null>(null);
  const ignoreClickRef = useRef(false);
  const imageButtonRef = useRef<HTMLButtonElement>(null);
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null);
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

  const openLightbox = (returnTarget: HTMLElement | null) => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
    setUserPaused(true);
    returnFocusRef.current = returnTarget;
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
        <div className="featured-carousel-copy">
          <p className="hero-kicker">Custom artwork.</p>
          <h1 id="hero-title">Made permanent.</h1>
          <p>Thoughtful designs. Expert craftsmanship.<br />Made after the light.</p>
          <div className="hero-actions">
            <Link className="button button-gold" href="/booking">Book a Consultation</Link>
            <Link className="text-link" href="/artists">View Artists <span aria-hidden="true">→</span></Link>
          </div>
          <div className="hero-meaning">
            <p className="hero-meaning-label">The meaning behind After Light</p>
            <p className="hero-meaning-copy">After Light represents what we carry with us after a moment has passed—the memories, experiences, growth, and stories that become part of who we are. Tattoos give those stories a permanent place to live.</p>
          </div>
        </div>

        <div className="featured-carousel-gallery">
          <div className="featured-carousel-gallery-top">
            <Link className="text-link" href="/gallery">View Full Gallery <span aria-hidden="true">→</span></Link>
            <button
              ref={fullscreenButtonRef}
              className="featured-carousel-fullscreen"
              type="button"
              onClick={() => openLightbox(fullscreenButtonRef.current)}
              aria-label={`Open full image: ${active.alt}`}
            >
              <Maximize2 aria-hidden="true" size={17} />
            </button>
          </div>

          <div className="featured-carousel-stage">
            <button
              ref={imageButtonRef}
              className="featured-carousel-image"
              type="button"
              onClick={() => openLightbox(imageButtonRef.current)}
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
                <span
                  className={`featured-carousel-slide ${index === activeIndex ? "is-active" : ""}`.trim()}
                  key={`${image.artistSlug}-${image.filename}`}
                  aria-hidden={index !== activeIndex}
                >
                  <Image
                    className="artwork-backdrop"
                    unoptimized
                    src={image.src}
                    alt=""
                    width={image.width}
                    height={image.height}
                    loading="eager"
                    draggable={false}
                    sizes="(max-width: 760px) 100vw, 60vw"
                    aria-hidden="true"
                  />
                  <Image
                    className="artwork-foreground"
                    unoptimized
                    src={image.src}
                    alt={index === activeIndex ? image.alt : ""}
                    width={image.width}
                    height={image.height}
                    loading="eager"
                    draggable={false}
                    sizes="(max-width: 760px) 100vw, 60vw"
                  />
                </span>
              ) : null)}
            </button>
          </div>

          <div className="featured-carousel-bar">
            <div className="featured-carousel-credit">
              <span>Tattoo by</span>
              <Link href={`/artists/${active.artistSlug}`}>{active.artistName}</Link>
            </div>
            <div className="featured-carousel-controls">
              <button
                className="featured-carousel-toggle"
                type="button"
                onClick={() => setUserPaused((paused) => !paused)}
                aria-label={userPaused ? "Play artwork slideshow" : "Pause artwork slideshow"}
                aria-pressed={userPaused}
              >
                {userPaused ? <Play aria-hidden="true" size={15} /> : <Pause aria-hidden="true" size={15} />}
              </button>
              <span className="featured-carousel-count" aria-hidden="true">{activeIndex + 1} / {images.length}</span>
              <button className="featured-carousel-arrow" type="button" onClick={() => selectSlide(activeIndex - 1)} aria-label="Show previous artwork">
                <ChevronLeft aria-hidden="true" size={22} />
              </button>
              <button className="featured-carousel-arrow" type="button" onClick={() => selectSlide(activeIndex + 1)} aria-label="Show next artwork">
                <ChevronRight aria-hidden="true" size={22} />
              </button>
            </div>
          </div>
        </div>

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
