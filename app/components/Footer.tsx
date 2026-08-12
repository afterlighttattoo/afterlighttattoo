import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { ExternalActions } from "./ExternalActions";
import { studio } from "@/app/data/studio";

const exploreLinks = [
  ["Artists", "/artists"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Aftercare", "/aftercare"],
  ["FAQ", "/faq"],
  ["Book a Consultation", "/booking"],
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-top">
        <div className="footer-brand">
          <BrandMark footer />
          <p>{studio.tagline}</p>
        </div>

        <div className="footer-col">
          <h3>Visit</h3>
          <address>
            {studio.address.street}<br />
            {studio.address.city}, {studio.address.region} {studio.address.postalCode}
          </address>
          <ExternalActions directions />
        </div>

        <div className="footer-col">
          <h3>Hours</h3>
          <ul className="footer-hours">
            {studio.hours.map((entry) => (
              <li key={entry.days}>
                <span>{entry.days}</span>
                <span>{entry.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>Explore</h3>
          <nav className="footer-explore" aria-label="Footer navigation">
            {exploreLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
        </div>
      </div>

      <div className="section-shell footer-bottom">
        <span>© {new Date().getFullYear()} After Light Tattoo</span>
        <Link href="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  );
}
