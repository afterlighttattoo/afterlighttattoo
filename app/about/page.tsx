import type { Metadata } from "next";
import Link from "next/link";
import { ExternalActions } from "@/app/components/ExternalActions";
import { PageCta } from "@/app/components/PageCta";
import { PageIntro } from "@/app/components/PageIntro";
import { studio } from "@/app/data/studio";

export const metadata: Metadata = {
  title: "About Our Tattoo Studio in White Oak, PA",
  description: "After Light Tattoo is a custom tattoo studio in White Oak, Pennsylvania, focused on original artwork and a professional, welcoming experience.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <PageIntro eyebrow="About" title="Custom tattooing in White Oak." description="After Light Tattoo brings four artists together in a professional studio focused on custom artwork and a welcoming client experience." />
      <section className="section-shell section-block about-overview">
        <article>
          <h2>Artwork made for you.</h2>
          <p>Every consultation starts with your idea, placement, references, and goals. The artists use that direction to develop work for the person wearing it.</p>
        </article>
        <article>
          <h2>A professional, respectful experience.</h2>
          <p>Clear communication and a thoughtful consultation process help clients understand the next step and feel comfortable throughout the experience.</p>
        </article>
        <div className="about-location">
          <p className="eyebrow">Visit the studio</p>
          <address><strong>{studio.name}</strong><br />{studio.address.street}<br />{studio.address.city}, {studio.address.region} {studio.address.postalCode}</address>
          <ExternalActions directions />
          <Link className="text-link" href="/artists">Meet the Artists</Link>
        </div>
      </section>
      <PageCta title="Ready to talk about your next tattoo?" description="Tell us what you have in mind and request a consultation with the studio." />
    </main>
  );
}
