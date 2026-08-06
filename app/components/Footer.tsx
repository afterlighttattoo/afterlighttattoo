import Link from "next/link";
import { ownerPlaceholders, studio } from "@/app/data/studio";
import { BrandMark } from "./BrandMark";

const valueOrPlaceholder = (value: string, placeholder: string) => value || placeholder;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div className="footer-brand">
          <BrandMark footer />
          <p>Custom artwork, made with care in a professional and welcoming studio.</p>
          <div className="social-row">
            {studio.social.instagram ? <a href={studio.social.instagram}>Instagram</a> : <span>{ownerPlaceholders.instagram}</span>}
            {studio.social.facebook ? <a href={studio.social.facebook}>Facebook</a> : <span>{ownerPlaceholders.facebook}</span>}
          </div>
        </div>
        <div>
          <h2>Visit</h2>
          <p>{valueOrPlaceholder(studio.address.street, ownerPlaceholders.address)}</p>
          <p>{studio.hours.length ? studio.hours.join(" · ") : ownerPlaceholders.hours}</p>
        </div>
        <div>
          <h2>Contact</h2>
          <p>{valueOrPlaceholder(studio.contact.phone, ownerPlaceholders.phone)}</p>
          <p>{valueOrPlaceholder(studio.contact.email, ownerPlaceholders.email)}</p>
        </div>
        <div>
          <h2>Explore</h2>
          <nav aria-label="Footer navigation">
            <Link href="/artists">Artists</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/about">About</Link>
            <Link href="/booking">Booking</Link>
            <Link href="/privacy">Privacy policy</Link>
          </nav>
        </div>
      </div>
      <div className="section-shell footer-bottom">
        <span>© {new Date().getFullYear()} After Light Tattoo</span>
        <span>Custom tattooing · By consultation</span>
      </div>
    </footer>
  );
}
