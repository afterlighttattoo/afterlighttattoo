import Link from "next/link";
import Image from "next/image";
import { ArtistCard } from "@/app/components/ArtistCard";
import { PageCta } from "@/app/components/PageCta";
import { PortfolioGrid } from "@/app/components/PortfolioGrid";
import { SectionHeading } from "@/app/components/SectionHeading";
import { artists, featuredArtwork } from "@/app/data/artists";

export default function Home() {
  return (
    <main>
      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-stars" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">After Light Tattoo · Custom Studio</p>
          <h1 id="hero-title">Art that lives <em>beyond the light.</em></h1>
          <p className="hero-lede">
            Professional custom tattooing in a clean, welcoming studio—built
            around thoughtful collaboration and artwork made for the person
            wearing it.
          </p>
          <div className="button-row">
            <Link className="button button-gold" href="/booking">
              Book a consultation <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button button-ghost" href="/artists">
              Meet the artists <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-note">
            <span className="star-mark" aria-hidden="true">✦</span>
            <span>Four artists. One studio. Custom work from first idea to final line.</span>
          </div>
        </div>

        <div className="hero-art" aria-label="Featured tattoo work">
          {featuredArtwork.slice(0, 3).map((image, index) => (
            <figure className={`hero-frame hero-frame-${index + 1}`} key={`hero-${index}`}>
              <Image
                unoptimized
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority={index === 0}
                sizes="(max-width: 560px) 64vw, (max-width: 820px) 50vw, 28vw"
              />
              <figcaption>{image.artistName}</figcaption>
            </figure>
          ))}
          <span className="orbit orbit-one" aria-hidden="true" />
          <span className="orbit orbit-two" aria-hidden="true" />
        </div>
      </section>

      <section className="intro-band">
        <div className="section-shell intro-grid">
          <p className="eyebrow">The studio</p>
          <div>
            <h2 className="display-small">Made personal.<br />Made to endure.</h2>
          </div>
          <div className="intro-copy">
            <p>
              After Light Tattoo brings custom artwork, careful craft, and a
              respectful client experience together under one roof. Every piece
              begins with a conversation and develops through collaboration.
            </p>
            <Link className="text-link" href="/about">Our approach <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="section-shell section-block" aria-labelledby="artists-heading">
        <SectionHeading
          eyebrow="Resident artists"
          title="Meet the hands behind the work."
          description="Explore each artist’s portfolio, then request a consultation with the person whose work speaks to you."
          id="artists-heading"
          link={{ href: "/artists", label: "View all artists" }}
        />
        <div className="artist-grid">
          {artists.map((artist, index) => (
            <ArtistCard artist={artist} index={index} key={artist.slug} />
          ))}
        </div>
      </section>

      <section className="work-section section-block" aria-labelledby="work-heading">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Selected work"
            title="Every piece tells its own story."
            description="A selection of recent work from the After Light artists. Open any piece to see the complete image."
            id="work-heading"
            link={{ href: "/gallery", label: "Explore the full gallery" }}
          />
          <PortfolioGrid images={featuredArtwork.slice(0, 8)} compact />
        </div>
      </section>

      <section className="section-shell section-block process" aria-labelledby="process-heading">
        <SectionHeading
          eyebrow="The process"
          title="From spark to skin."
          description="A clear, collaborative path from your first idea to the day of your appointment."
          id="process-heading"
        />
        <ol className="process-grid">
          <li>
            <span>01</span>
            <h3>Share your idea</h3>
            <p>Send your concept, placement, size, references, and preferred artist through the consultation form.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Connect with the studio</h3>
            <p>The studio reviews your request and follows up to discuss fit, availability, pricing, and any deposit.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Shape the artwork</h3>
            <p>Your artist develops a custom direction around the agreed concept, body placement, and session plan.</p>
          </li>
          <li>
            <span>04</span>
            <h3>Make it permanent</h3>
            <p>Arrive prepared for your confirmed appointment and leave with artwork created specifically for you.</p>
          </li>
        </ol>
      </section>

      <PageCta
        eyebrow="Begin your piece"
        title="Your next tattoo starts with a conversation."
        description="Tell us what you have in mind. We’ll help you find the right artist and next step."
      />
    </main>
  );
}
