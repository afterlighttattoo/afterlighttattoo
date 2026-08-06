import Link from "next/link";
import Image from "next/image";
import type { Artist } from "@/app/data/artists";

export function ArtistCard({ artist, index = 0 }: { artist: Artist; index?: number }) {
  return (
    <article className="artist-card">
      <Link className="artist-card-image" href={`/artists/${artist.slug}`} aria-label={`View ${artist.name}'s portfolio`}>
        <Image
          unoptimized
          src={artist.profileImage.src}
          alt={artist.profileAlt}
          width={artist.profileImage.width}
          height={artist.profileImage.height}
          loading={index > 1 ? "lazy" : "eager"}
          sizes="(max-width: 560px) calc(100vw - 28px), (max-width: 1100px) 50vw, 25vw"
        />
        <span className="artist-card-number" aria-hidden="true">0{index + 1}</span>
      </Link>
      <div className="artist-card-body">
        <p className="card-kicker">Resident artist</p>
        <h3><Link href={`/artists/${artist.slug}`}>{artist.name}</Link></h3>
        <p>{artist.bio}</p>
        <p className="specialty-line"><span>Focus</span>{artist.specialties[0]}</p>
        <div className="artist-card-actions">
          <Link className="text-link" href={`/artists/${artist.slug}`}>View portfolio <span aria-hidden="true">→</span></Link>
          <Link className="text-link muted-link" href={artist.bookingLink}>Book with {artist.name.split(" ")[0]}</Link>
        </div>
      </div>
    </article>
  );
}
