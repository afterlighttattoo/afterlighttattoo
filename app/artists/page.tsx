import type { Metadata } from "next";
import { ArtistCard } from "@/app/components/ArtistCard";
import { PageCta } from "@/app/components/PageCta";
import { PageIntro } from "@/app/components/PageIntro";
import { artists } from "@/app/data/artists";

export const metadata: Metadata = {
  title: "Artists",
  description: "Meet the four artists at After Light Tattoo and explore their individual tattoo portfolios.",
};

export default function ArtistsPage() {
  return (
    <main>
      <PageIntro
        eyebrow="The artists"
        title="Four perspectives. One shared standard."
        description="Get to know the artists of After Light Tattoo, explore each portfolio, and choose the creative perspective that feels right for your piece."
      />
      <section className="section-shell section-block artist-listing" aria-label="After Light Tattoo artists">
        <div className="artist-grid">
          {artists.map((artist, index) => <ArtistCard artist={artist} index={index} key={artist.slug} />)}
        </div>
        <aside className="owner-note">
          <span>Owner action</span>
          <p>Artist biographies, preferred styles, and social links are clearly marked placeholders and should be completed before launch.</p>
        </aside>
      </section>
      <PageCta eyebrow="Find your artist" title="See a connection in the work?" description="Share your idea and preferred artist. The studio will follow up about creative fit and availability." />
    </main>
  );
}
