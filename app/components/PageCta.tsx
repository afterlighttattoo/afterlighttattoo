import Link from "next/link";

export function PageCta({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-cta">
      <span className="cta-crescent" aria-hidden="true" />
      <div className="section-shell page-cta-inner">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div>
          <p>{description}</p>
          <Link className="button button-gold" href="/booking">Request a consultation <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </section>
  );
}
