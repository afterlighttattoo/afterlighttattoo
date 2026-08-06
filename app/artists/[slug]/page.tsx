import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageCta } from "@/app/components/PageCta";
import { PortfolioGrid } from "@/app/components/PortfolioGrid";
import { SectionHeading } from "@/app/components/SectionHeading";
import { artists, getArtist } from "@/app/data/artists";

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return {};
  return {
    title: artist.name,
    description: `Explore custom tattoo work by ${artist.name} at After Light Tattoo and request a consultation.`,
  };
}

export default async function ArtistProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();

  return (
    <main>
      <section className="artist-profile-hero section-shell">
        <div className="artist-profile-image">
          <Image unoptimized src={artist.profileImage.src} alt={artist.profileAlt} width={artist.profileImage.width} height={artist.profileImage.height} priority sizes="(max-width: 820px) 100vw, 42vw" />
          <span className="profile-orbit" aria-hidden="true" />
        </div>
        <div className="artist-profile-copy">
          <p className="eyebrow">After Light artist</p>
          <h1>{artist.name}</h1>
          <p className="profile-bio">{artist.bio}</p>
          <div className="profile-details">
            <div>
              <span>Preferred styles</span>
              {artist.specialties.map((specialty) => <p key={specialty}>{specialty}</p>)}
            </div>
            <div>
              <span>Social</span>
              {artist.socialLinks.instagram ? <a href={artist.socialLinks.instagram}>Instagram ↗</a> : <p>Instagram link — add before launch</p>}
            </div>
            <div>
              <span>Booking</span>
              <p>Consultation details and artist availability are confirmed directly by the studio.</p>
            </div>
          </div>
          <div className="button-row">
            <Link className="button button-gold" href={artist.bookingLink}>Book with {artist.name.split(" ")[0]} <span aria-hidden="true">↗</span></Link>
            <a className="button button-ghost" href="#portfolio">View portfolio <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section className="work-section section-block" id="portfolio" aria-labelledby="portfolio-heading">
        <div className="section-shell">
          <SectionHeading
            eyebrow={`${artist.name} · Portfolio`}
            title="Selected work."
            description={`All ${artist.portfolioImages.length} images below belong exclusively to ${artist.name}’s supplied portfolio.`}
            id="portfolio-heading"
          />
          <PortfolioGrid images={artist.portfolioImages} />
        </div>
      </section>
      <PageCta eyebrow={`Book with ${artist.name}`} title="Have a piece in mind?" description="Share your concept, placement, references, and availability to begin the consultation process." />
    </main>
  );
}
