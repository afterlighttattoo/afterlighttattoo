import Image from "next/image";
import Link from "next/link";

export function BrandMark({ footer = false }: { footer?: boolean }) {
  const src = footer
    ? "/images/branding/after-light-tattoo-logo.png"
    : "/images/branding/after-light-mark.png";

  return (
    <Link className={`brand-mark${footer ? " brand-mark-footer" : ""}`} href="/" aria-label="After Light Tattoo home">
      <Image
        unoptimized
        src={src}
        alt={footer ? "After Light Tattoo" : ""}
        width={footer ? 600 : 330}
        height={footer ? 600 : 330}
        priority={!footer}
      />
    </Link>
  );
}
