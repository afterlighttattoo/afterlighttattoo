import Link from "next/link";

export function BrandMark({ footer = false }: { footer?: boolean }) {
  return (
    <Link className={`brand-mark${footer ? " brand-mark-footer" : ""}`} href="/" aria-label="After Light Tattoo home">
      <span className="brand-symbol" aria-hidden="true">
        <span className="brand-crescent" />
        <span className="brand-star">✦</span>
      </span>
      <span className="brand-words">
        <span>After Light</span>
        <small>Tattoo</small>
      </span>
    </Link>
  );
}
