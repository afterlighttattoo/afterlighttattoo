"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { artists } from "@/app/data/artists";
import { BrandMark } from "./BrandMark";
import { ExternalActions } from "./ExternalActions";
import { NavDropdown } from "./NavDropdown";

const studioLinks = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Aftercare", href: "/aftercare" },
];

type DesktopMenu = "artists" | "studio" | null;
type MobileSection = "artists" | "studio" | null;

export function Header() {
  const [open, setOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<DesktopMenu>(null);
  const [mobileSection, setMobileSection] = useState<MobileSection>(null);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  // Close any open menu whenever the route changes (React's recommended
  // "adjust state during render" pattern, rather than an effect).
  const [previousPathname, setPreviousPathname] = useState(pathname);
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setOpenDesktopMenu(null);
    setOpen(false);
    setMobileSection(null);
  }

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setMobileSection(null);
      menuButtonRef.current?.focus();
    };
    document.body.classList.add("mobile-menu-open");
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("mobile-menu-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openDesktopMenuNow = (id: Exclude<DesktopMenu, null>) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDesktopMenu(id);
  };
  const scheduleCloseDesktopMenu = () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setOpenDesktopMenu(null), 150);
  };
  const closeDesktopMenuNow = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDesktopMenu(null);
  };

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileSection(null);
  };
  const toggleMobileSection = (id: Exclude<MobileSection, null>) => {
    setMobileSection((current) => (current === id ? null : id));
  };

  const isHomeActive = pathname === "/";
  const isArtistsActive = pathname.startsWith("/artists");
  const isGalleryActive = pathname.startsWith("/gallery");
  const isStudioActive = studioLinks.some((link) => pathname.startsWith(link.href));
  const isBookingActive = pathname.startsWith("/booking");

  const artistDropdownItems = [
    { label: "All Artists", href: "/artists", active: pathname === "/artists" },
    ...artists.map((artist) => ({
      label: artist.name,
      href: `/artists/${artist.slug}`,
      active: pathname === `/artists/${artist.slug}`,
    })),
  ];
  const studioDropdownItems = studioLinks.map((link) => ({ ...link, active: pathname === link.href }));

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="mobile-header-brand"><BrandMark /></div>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <div className="desktop-nav-side desktop-nav-left">
            <Link href="/" aria-current={isHomeActive ? "page" : undefined}>Home</Link>
            <NavDropdown
              label="Artists"
              href="/artists"
              active={isArtistsActive}
              items={artistDropdownItems}
              isOpen={openDesktopMenu === "artists"}
              onOpen={() => openDesktopMenuNow("artists")}
              onScheduleClose={scheduleCloseDesktopMenu}
              onCloseNow={closeDesktopMenuNow}
            />
            <Link href="/gallery" aria-current={isGalleryActive ? "page" : undefined}>Gallery</Link>
          </div>
          <Link className="desktop-header-logo" href="/" aria-label="After Light Tattoo home">
            <Image unoptimized src="/images/branding/after-light-tattoo-logo.png" alt="" width={600} height={600} priority />
          </Link>
          <div className="desktop-nav-side desktop-nav-right">
            <NavDropdown
              label="Studio"
              active={isStudioActive}
              items={studioDropdownItems}
              isOpen={openDesktopMenu === "studio"}
              onOpen={() => openDesktopMenuNow("studio")}
              onScheduleClose={scheduleCloseDesktopMenu}
              onCloseNow={closeDesktopMenuNow}
            />
            <Link className="nav-book" href="/booking" aria-current={isBookingActive ? "page" : undefined}>Book a Consultation</Link>
          </div>
        </nav>
        <button ref={menuButtonRef} className="mobile-menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-menu">
          <nav className="section-shell mobile-nav" aria-label="Mobile navigation">
            <Link href="/" onClick={closeMobileMenu} aria-current={isHomeActive ? "page" : undefined}>Home</Link>

            <div className="mobile-nav-group">
              <button type="button" className="mobile-nav-toggle" aria-expanded={mobileSection === "artists"} aria-controls="mobile-artists-panel" aria-current={isArtistsActive ? "page" : undefined} onClick={() => toggleMobileSection("artists")}>
                Artists
                <ChevronDown aria-hidden="true" size={16} className={mobileSection === "artists" ? "mobile-nav-caret is-open" : "mobile-nav-caret"} />
              </button>
              {mobileSection === "artists" && (
                <div className="mobile-nav-sublist" id="mobile-artists-panel">
                  {artistDropdownItems.map((item) => (
                    <Link href={item.href} key={item.href} onClick={closeMobileMenu} aria-current={item.active ? "page" : undefined}>{item.label}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/gallery" onClick={closeMobileMenu} aria-current={isGalleryActive ? "page" : undefined}>Gallery</Link>

            <div className="mobile-nav-group">
              <button type="button" className="mobile-nav-toggle" aria-expanded={mobileSection === "studio"} aria-controls="mobile-studio-panel" aria-current={isStudioActive ? "page" : undefined} onClick={() => toggleMobileSection("studio")}>
                Studio
                <ChevronDown aria-hidden="true" size={16} className={mobileSection === "studio" ? "mobile-nav-caret is-open" : "mobile-nav-caret"} />
              </button>
              {mobileSection === "studio" && (
                <div className="mobile-nav-sublist" id="mobile-studio-panel">
                  {studioDropdownItems.map((item) => (
                    <Link href={item.href} key={item.href} onClick={closeMobileMenu} aria-current={item.active ? "page" : undefined}>{item.label}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link className="mobile-book-link" href="/booking" onClick={closeMobileMenu} aria-current={isBookingActive ? "page" : undefined}>Book a Consultation</Link>
            <ExternalActions />
          </nav>
        </div>
      )}
    </header>
  );
}
