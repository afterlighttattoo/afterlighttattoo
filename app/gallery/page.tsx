import type { Metadata } from "next";
import { GalleryExplorer } from "@/app/components/GalleryExplorer";
import { PageCta } from "@/app/components/PageCta";
import { PageIntro } from "@/app/components/PageIntro";
import { allArtwork, artists } from "@/app/data/artists";

export const metadata: Metadata = {
  title: "Tattoo Gallery",
  description: "Explore 43 tattoo portfolio images from the four artists at After Light Tattoo, filtered by artist.",
};

export default function GalleryPage() {
  return (
    <main>
      <PageIntro
        eyebrow="The work"
        title="A living gallery."
        description="Browse the supplied portfolios from all four After Light artists. Filter by artist and open any image to see the complete, uncropped work."
      />
      <section className="section-shell section-block gallery-section" aria-label="Tattoo portfolio gallery">
        <GalleryExplorer artists={artists} images={allArtwork} />
      </section>
      <PageCta eyebrow="Your turn" title="Ready to create something of your own?" description="Send your idea to the studio and start a conversation with the artist whose work fits your vision." />
    </main>
  );
}
