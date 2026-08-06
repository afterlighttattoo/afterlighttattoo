import type { Metadata } from "next";
import { ArtistCard } from "@/app/components/ArtistCard";
import { PageCta } from "@/app/components/PageCta";
import { PageIntro } from "@/app/components/PageIntro";
import { artists } from "@/app/data/artists";

export const metadata: Metadata = {
  title: "Tattoo Artists in White Oak, PA",
  description: "Meet the four artists at After Light Tattoo in White Oak, Pennsylvania, and explore their individual tattoo portfolios.",
  alternates: { canonical: "/artists" },
};

export default function ArtistsPage() {
  return (
    <main>
      <PageIntro eyebrow="Artists" title="Meet the artists." description="Explore each portfolio and find the creative direction that fits your next piece." />
      <section className="section-shell section-block artist-listing" aria-label="After Light Tattoo artists">
        <div className="artist-grid">
          {artists.map((artist, index) => <ArtistCard artist={artist} index={index} key={artist.slug} />)}
        </div>
      </section>
      <PageCta title="Have an artist in mind?" description="Tell us about your tattoo idea and request a consultation." />
    </main>
  );
}
