import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-bottom">
        <span>© {new Date().getFullYear()} After Light Tattoo</span>
        <Link href="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  );
}
