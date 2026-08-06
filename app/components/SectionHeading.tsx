import Link from "next/link";

export function SectionHeading({ eyebrow, title, description, id, link }: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
      <div className="section-heading-side">
        {description && <p>{description}</p>}
        {link && <Link className="text-link" href={link.href}>{link.label} <span aria-hidden="true">→</span></Link>}
      </div>
    </div>
  );
}
