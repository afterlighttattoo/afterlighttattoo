import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found section-shell">
      <p className="eyebrow">404 · Beyond the light</p>
      <h1>This page has faded from view.</h1>
      <p>The address may have changed, or the page may no longer exist.</p>
      <Link className="button button-gold" href="/">Return home</Link>
    </main>
  );
}
