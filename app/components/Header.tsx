import Link from "next/link";
import { BrandMark } from "./BrandMark";

const navigation = [
  ["Home", "/"], ["Artists", "/artists"], ["Gallery", "/gallery"], ["About", "/about"], ["Booking", "/booking"],
];

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner section-shell">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <Link className="button button-small button-gold header-book" href="/booking">Book now <span aria-hidden="true">↗</span></Link>
        <details className="mobile-nav">
          <summary aria-label="Open navigation"><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            <Link className="button button-gold" href="/booking">Book now</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
