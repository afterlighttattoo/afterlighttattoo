import type { Metadata } from "next";
import { ManagedGalleryExplorer } from "@/app/components/ManagedGallery";
import { PageCta } from "@/app/components/PageCta";
import { PageIntro } from "@/app/components/PageIntro";
import { artists } from "@/app/data/artists";

export const metadata: Metadata = {
  title: "Tattoo Gallery | White Oak, PA",
  description: "Explore custom tattoo work from the artists at After Light Tattoo in White Oak, Pennsylvania.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <main>
      <PageIntro
        eyebrow="The work"
        title="Tattoo gallery."
        description="Browse work from all four After Light artists. Filter by artist and open any image to see the complete piece."
      />
      <section className="section-shell section-block gallery-section" aria-label="Tattoo portfolio gallery">
        <ManagedGalleryExplorer artists={artists} />
      </section>
      <PageCta title="Ready to create something of your own?" description="Send your idea to the studio and start a conversation with the artist whose work fits your vision." />
    </main>
  );
}
