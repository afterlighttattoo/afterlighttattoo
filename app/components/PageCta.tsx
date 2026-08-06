import Link from "next/link";

export function PageCta({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <section className="page-cta">
      <div className="section-shell page-cta-inner">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <Link className="button button-gold" href="/booking">Request a Consultation</Link>
      </div>
    </section>
  );
}
