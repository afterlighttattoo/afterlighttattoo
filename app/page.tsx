import Link from "next/link";
import { ArtistCard } from "@/app/components/ArtistCard";
import { ExternalActions } from "@/app/components/ExternalActions";
import { FeaturedArtworkCarousel } from "@/app/components/FeaturedArtworkCarousel";
import { artists, carouselArtwork } from "@/app/data/artists";
import { studio } from "@/app/data/studio";

export default function Home() {
  return (
    <main>
      <section className="home-hero" aria-labelledby="hero-title">
        <FeaturedArtworkCarousel images={carouselArtwork} />
      </section>

      <section className="home-artists" aria-labelledby="artists-heading">
        <div className="section-shell home-artists-inner">
          <div className="home-artists-heading">
            <h2 id="artists-heading">Our Artists</h2>
            <Link className="text-link" href="/artists">View All Artists <span aria-hidden="true">→</span></Link>
          </div>
          <div className="artist-grid">
            {artists.map((artist, index) => <ArtistCard artist={artist} index={index} key={artist.slug} />)}
          </div>
        </div>
      </section>

      <section className="home-booking" aria-labelledby="booking-heading">
        <div className="section-shell home-booking-inner">
          <div className="home-booking-copy">
            <h2 id="booking-heading">Ready to start your next piece?</h2>
            <p>Let&apos;s create something meaningful together.</p>
          </div>
          <Link className="button button-gold home-booking-button" href="/booking">Book a Consultation</Link>
          <div className="home-contact">
            <address>
              {studio.address.street}<br />
              {studio.address.city}, {studio.address.region} {studio.address.postalCode}
            </address>
            <ExternalActions directions />
          </div>
        </div>
      </section>
    </main>
  );
}
