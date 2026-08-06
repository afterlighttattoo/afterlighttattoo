import Link from "next/link";
import { studio } from "@/app/data/studio";
import { BrandMark } from "./BrandMark";
import { ExternalActions } from "./ExternalActions";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div className="footer-brand">
          <BrandMark footer />
        </div>
        <div className="footer-address">
          <h2>{studio.name}</h2>
          <address>{studio.address.street}<br />{studio.address.city}, {studio.address.region} {studio.address.postalCode}</address>
          <ExternalActions directions />
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link href="/artists">Artists</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/about">About</Link>
          <Link href="/booking">Booking</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </nav>
      </div>
      <div className="section-shell footer-bottom">
        <span>© {new Date().getFullYear()} After Light Tattoo</span>
        <span>White Oak, Pennsylvania</span>
      </div>
    </footer>
  );
}
