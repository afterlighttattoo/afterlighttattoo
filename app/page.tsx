import Image from "next/image";
import Link from "next/link";
import { ArtistCard } from "@/app/components/ArtistCard";
import { ExternalActions } from "@/app/components/ExternalActions";
import { PortfolioGrid } from "@/app/components/PortfolioGrid";
import { artists, homepageFeaturedArtwork } from "@/app/data/artists";
import { studio } from "@/app/data/studio";

export default function Home() {
  const heroArtwork = artists[2].portfolioImages[0];

  return (
    <main>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="section-shell home-hero-inner">
          <div className="home-hero-copy">
            <p className="hero-kicker">Custom artwork.</p>
            <h1 id="hero-title">Made permanent.</h1>
            <p>Thoughtful designs. Expert craftsmanship.<br />Made after the light.</p>
            <div className="hero-actions">
              <Link className="button button-gold" href="/booking">Book a Consultation</Link>
              <Link className="text-link" href="/artists">View Artists <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <figure className="home-hero-art">
            <Image
              unoptimized
              src={heroArtwork.src}
              alt={heroArtwork.alt}
              width={heroArtwork.width}
              height={heroArtwork.height}
              priority
              sizes="(max-width: 760px) 100vw, 56vw"
            />
            <figcaption>
              <Link href={`/artists/${heroArtwork.artistSlug}`}>{heroArtwork.artistName}</Link>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="home-featured-work" aria-labelledby="featured-work-heading">
        <div className="section-shell home-featured-work-inner">
          <div className="home-section-heading">
            <h2 id="featured-work-heading">Featured Work</h2>
            <Link className="text-link" href="/gallery">View Full Gallery <span aria-hidden="true">→</span></Link>
          </div>
          <PortfolioGrid images={homepageFeaturedArtwork} />
        </div>
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
