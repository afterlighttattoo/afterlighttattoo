import Image from "next/image";
import Link from "next/link";
import { ArtistCard } from "@/app/components/ArtistCard";
import { ExternalActions } from "@/app/components/ExternalActions";
import { FeaturedArtworkCarousel } from "@/app/components/FeaturedArtworkCarousel";
import { SectionHeading } from "@/app/components/SectionHeading";
import { artists, carouselArtwork } from "@/app/data/artists";
import { studio } from "@/app/data/studio";

export default function Home() {
  return (
    <main>
      <section className="home-hero section-shell" aria-labelledby="hero-title">
        <div className="home-hero-copy">
          <Image
            className="hero-logo"
            unoptimized
            src="/images/branding/after-light-tattoo-logo.png"
            alt="After Light Tattoo"
            width={600}
            height={600}
            priority
          />
          <h1 id="hero-title">Custom artwork. Made permanent.</h1>
          <p>Meet the artists of After Light Tattoo and find the right creative direction for your next piece.</p>
          <div className="hero-actions">
            <Link className="button button-gold" href="/booking">Book a Consultation</Link>
            <Link className="text-link" href="/artists">View Artists</Link>
          </div>
        </div>
        <FeaturedArtworkCarousel images={carouselArtwork} />
      </section>

      <section className="section-shell section-block home-artists" aria-labelledby="artists-heading">
        <SectionHeading eyebrow="Artists" title="Find your artist." id="artists-heading" link={{ href: "/artists", label: "All Artists" }} />
        <div className="artist-grid">
          {artists.map((artist, index) => <ArtistCard artist={artist} index={index} key={artist.slug} />)}
        </div>
      </section>

      <section className="home-booking section-shell" aria-labelledby="booking-heading">
        <div>
          <p className="eyebrow">Book a consultation</p>
          <h2 id="booking-heading">Ready to start your next piece?</h2>
          <p>Share your idea and preferred artist to begin the consultation process.</p>
          <Link className="button button-gold" href="/booking">Request a Consultation</Link>
        </div>
        <div className="home-contact">
          <address>
            <strong>{studio.name}</strong><br />
            {studio.address.street}<br />
            {studio.address.city}, {studio.address.region} {studio.address.postalCode}
          </address>
          <ExternalActions directions />
        </div>
      </section>
    </main>
  );
}
