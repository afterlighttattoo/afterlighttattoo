"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import type { PortfolioImage } from "@/app/data/artists";

type ArtworkLightboxProps = {
  images: PortfolioImage[];
  activeIndex: number;
  onChange: (index: number) => void;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function ArtworkLightbox({ images, activeIndex, onChange, onClose, returnFocusRef }: ArtworkLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const onChangeRef = useRef(onChange);
  const onCloseRef = useRef(onClose);
  const active = images[activeIndex];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    onChangeRef.current = onChange;
    onCloseRef.current = onClose;
  }, [activeIndex, onChange, onClose]);

  useEffect(() => {
    const returnTarget = returnFocusRef?.current;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onChangeRef.current((activeIndexRef.current + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onChangeRef.current((activeIndexRef.current - 1 + images.length) % images.length);
      }
      if (event.key === "Tab") {
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKey);
    closeButtonRef.current?.focus();
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKey);
      window.setTimeout(() => returnTarget?.focus(), 0);
    };
  }, [images.length, returnFocusRef]);

  return (
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${active.artistName} portfolio image`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button ref={closeButtonRef} className="lightbox-close" type="button" onClick={onClose} aria-label="Close image">
        <X aria-hidden="true" size={20} />
      </button>
      {images.length > 1 && (
        <button className="lightbox-arrow lightbox-prev" type="button" onClick={() => onChange((activeIndex - 1 + images.length) % images.length)} aria-label="Previous image">
          <ChevronLeft aria-hidden="true" size={22} />
        </button>
      )}
      <figure>
        <Image unoptimized src={active.src} alt={active.alt} width={active.width} height={active.height} sizes="100vw" />
        <figcaption>
          <Link href={`/artists/${active.artistSlug}`}>View {active.artistName}</Link>
          <small>{activeIndex + 1} / {images.length}</small>
        </figcaption>
      </figure>
      {images.length > 1 && (
        <button className="lightbox-arrow lightbox-next" type="button" onClick={() => onChange((activeIndex + 1) % images.length)} aria-label="Next image">
          <ChevronRight aria-hidden="true" size={22} />
        </button>
      )}
    </div>
  );
}
