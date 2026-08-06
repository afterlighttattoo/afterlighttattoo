import Image from "next/image";
import Link from "next/link";
import type { Artist } from "@/app/data/artists";

export function ArtistCard({ artist, index = 0 }: { artist: Artist; index?: number }) {
  return (
    <article className="artist-card">
      <Link className="artist-card-image" href={`/artists/${artist.slug}`} aria-label={`View tattoo work by ${artist.name}`}>
        <Image
          unoptimized
          src={artist.profileImage.src}
          alt={artist.profileAlt}
          width={artist.profileImage.width}
          height={artist.profileImage.height}
          loading={index > 1 ? "lazy" : "eager"}
          sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 960px) 50vw, 25vw"
        />
      </Link>
      <div className="artist-card-body">
        <h3><Link href={`/artists/${artist.slug}`}>{artist.name}</Link></h3>
        {artist.specialties.length > 0 && <p className="artist-specialty">{artist.specialties.join(" · ")}</p>}
        <Link className="text-link" href={`/artists/${artist.slug}`}>View Work</Link>
      </div>
    </article>
  );
}
