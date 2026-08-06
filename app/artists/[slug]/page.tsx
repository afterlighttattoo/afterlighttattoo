import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
    title: `${artist.name} | Tattoo Artist in White Oak, PA`,
    description: `Explore tattoo work by ${artist.name} at After Light Tattoo in White Oak, Pennsylvania, and request a consultation.`,
    alternates: { canonical: `/artists/${artist.slug}` },
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
          <Image unoptimized src={artist.profileImage.src} alt={artist.profileAlt} width={artist.profileImage.width} height={artist.profileImage.height} priority sizes="(max-width: 760px) 100vw, 42vw" />
        </div>
        <div className="artist-profile-copy">
          <p className="eyebrow">After Light Tattoo</p>
          <h1>{artist.name}</h1>
          {artist.bio && <p className="profile-bio">{artist.bio}</p>}
          {artist.specialties.length > 0 && (
            <div className="profile-meta"><span>Specialties</span><p>{artist.specialties.join(" · ")}</p></div>
          )}
          {artist.socialLinks.instagram && (
            <a className="text-link" href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${artist.name} on Instagram in a new tab`}>Instagram</a>
          )}
          <div className="button-row">
            <Link className="button button-gold" href={artist.bookingLink}>Book With {artist.name.split(" ")[0]}</Link>
            <a className="text-link" href="#portfolio">View Work</a>
          </div>
        </div>
      </section>

      <section className="featured-work section-block" id="portfolio" aria-labelledby="portfolio-heading">
        <div className="section-shell">
          <SectionHeading eyebrow={`${artist.name} portfolio`} title="Tattoo work." id="portfolio-heading" />
          <PortfolioGrid images={artist.portfolioImages} />
        </div>
      </section>
      <PageCta title={`Book with ${artist.name}`} description="Share your concept, placement, references, and availability to request a consultation." />
    </main>
  );
}
