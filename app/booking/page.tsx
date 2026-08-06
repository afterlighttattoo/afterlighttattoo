import type { Metadata } from "next";
import { BookingForm } from "@/app/components/BookingForm";
import { PageIntro } from "@/app/components/PageIntro";
import { artists } from "@/app/data/artists";
import { ownerPlaceholders, studio } from "@/app/data/studio";

export const metadata: Metadata = {
  title: "Booking & Contact",
  description: "Request a custom tattoo consultation with one of the four artists at After Light Tattoo.",
};

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ artist?: string }> }) {
  const { artist: requestedArtist } = await searchParams;
  const initialArtist = requestedArtist && artists.some((artist) => artist.slug === requestedArtist) ? requestedArtist : "";
  return (
    <main>
      <PageIntro
        eyebrow="Booking & contact"
        title="Bring us the first spark."
        description="Share as much detail as you can. A thoughtful request helps the studio understand your idea, recommend the right artist, and plan the next conversation."
      />
      <section className="section-shell section-block booking-layout">
        <BookingForm artists={artists} initialArtist={initialArtist} />
        <aside className="booking-sidebar">
          <div>
            <p className="eyebrow">Studio details</p>
            <h2>Visit & connect.</h2>
            <dl className="contact-list">
              <div><dt>Address</dt><dd>{studio.address.street || ownerPlaceholders.address}</dd></div>
              <div><dt>Phone</dt><dd>{studio.contact.phone || ownerPlaceholders.phone}</dd></div>
              <div><dt>Email</dt><dd>{studio.contact.email || ownerPlaceholders.email}</dd></div>
              <div><dt>Hours</dt><dd>{studio.hours.length ? studio.hours.join(" · ") : ownerPlaceholders.hours}</dd></div>
              <div><dt>Instagram</dt><dd>{studio.social.instagram || ownerPlaceholders.instagram}</dd></div>
              <div><dt>Facebook</dt><dd>{studio.social.facebook || ownerPlaceholders.facebook}</dd></div>
              <div><dt>Directions</dt><dd>{studio.mapsUrl || ownerPlaceholders.maps}</dd></div>
            </dl>
          </div>
          <div className="policy-card">
            <p className="eyebrow">Before you book</p>
            <dl>
              <div><dt>Deposit</dt><dd>{studio.policy.deposit || ownerPlaceholders.deposit}</dd></div>
              <div><dt>Cancellation</dt><dd>{studio.policy.cancellation || ownerPlaceholders.cancellation}</dd></div>
              <div><dt>Age & ID</dt><dd>{studio.policy.ageAndId || ownerPlaceholders.ageAndId}</dd></div>
            </dl>
          </div>
        </aside>
      </section>
    </main>
  );
}
