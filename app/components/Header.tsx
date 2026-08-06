"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { ExternalActions } from "./ExternalActions";

const navigation = [
  ["Home", "/"],
  ["Artists", "/artists"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Book", "/booking"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner section-shell">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <Link className="button button-small button-gold header-book" href="/booking">Book a consultation</Link>
        <button className="mobile-menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-menu">
          <nav className="section-shell" aria-label="Mobile navigation">
            {navigation.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
            <Link className="button button-gold" href="/booking" onClick={() => setOpen(false)}>Book a consultation</Link>
            <ExternalActions />
          </nav>
        </div>
      )}
    </header>
  );
}
