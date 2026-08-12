"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { ExternalActions } from "./ExternalActions";

const leftNavigation = [
  ["Home", "/"],
  ["Artists", "/artists"],
  ["Gallery", "/gallery"],
  ["Aftercare", "/aftercare"],
];

const rightNavigation = [
  ["FAQ", "/faq"],
  ["About", "/about"],
  ["Book a Consultation", "/booking"],
];

const navigation = [...leftNavigation, ...rightNavigation];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    document.body.classList.add("mobile-menu-open");
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("mobile-menu-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="mobile-header-brand"><BrandMark /></div>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <div className="desktop-nav-side desktop-nav-left">
            {leftNavigation.map(([label, href]) => (
              <Link href={href} key={href} aria-current={isActive(href) ? "page" : undefined}>{label}</Link>
            ))}
          </div>
          <Link className="desktop-header-logo" href="/" aria-label="After Light Tattoo home">
            <Image unoptimized src="/images/branding/after-light-tattoo-logo.png" alt="" width={600} height={600} priority />
          </Link>
          <div className="desktop-nav-side desktop-nav-right">
            {rightNavigation.map(([label, href]) => (
              <Link className={href === "/booking" ? "nav-book" : undefined} href={href} key={href} aria-current={isActive(href) ? "page" : undefined}>{label}</Link>
            ))}
          </div>
        </nav>
        <button ref={menuButtonRef} className="mobile-menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-menu">
          <nav className="section-shell" aria-label="Mobile navigation">
            {navigation.map(([label, href]) => (
              <Link className={href === "/booking" ? "mobile-book-link" : undefined} href={href} key={href} onClick={() => setOpen(false)} aria-current={isActive(href) ? "page" : undefined}>
                {label}
              </Link>
            ))}
            <ExternalActions />
          </nav>
        </div>
      )}
    </header>
  );
}
