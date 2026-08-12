import type { Metadata } from "next";
import { BookingForm } from "@/app/components/BookingForm";
import { ExternalActions } from "@/app/components/ExternalActions";
import { PageIntro } from "@/app/components/PageIntro";
import { artists } from "@/app/data/artists";
import { studio } from "@/app/data/studio";

export const metadata: Metadata = {
  title: "Book a Tattoo Consultation | White Oak, PA",
  description: "Request a tattoo consultation with After Light Tattoo at 1055 Lincoln Way in White Oak, Pennsylvania.",
  alternates: { canonical: "/booking" },
};

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ artist?: string }> }) {
  const { artist: requestedArtist } = await searchParams;
  const initialArtist = requestedArtist && artists.some((artist) => artist.slug === requestedArtist) ? requestedArtist : "";
  return (
    <main>
      <PageIntro eyebrow="Booking" title="Start your consultation." description="Share your tattoo idea, preferred artist, placement, and availability with the studio." />
      <section className="section-shell section-block booking-layout">
        <BookingForm artists={artists} initialArtist={initialArtist} />
        <aside className="booking-sidebar">
          <p className="eyebrow">Visit the studio</p>
          <h2>{studio.name}</h2>
          <address>{studio.address.street}<br />{studio.address.city}, {studio.address.region} {studio.address.postalCode}</address>
          <ul className="about-hours">
            {studio.hours.map((entry) => <li key={entry.days}><span>{entry.days}</span>{entry.time}</li>)}
          </ul>
          <ExternalActions directions className="booking-actions" />
        </aside>
      </section>
    </main>
  );
}
