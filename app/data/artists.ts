import type { StaticImageData } from "next/image";

import robProfile from "@/images/rob-duncan/rob.PNG";
import rob01 from "@/images/rob-duncan/artwork/10484.jpg.jpeg";
import rob02 from "@/images/rob-duncan/artwork/20250921_155116.jpg.jpeg";
import rob03 from "@/images/rob-duncan/artwork/20251023_150239.jpg.jpeg";
import rob04 from "@/images/rob-duncan/artwork/20251025_194354.jpg.jpeg";
import rob05 from "@/images/rob-duncan/artwork/20251026_184209.jpg.jpeg";
import rob06 from "@/images/rob-duncan/artwork/20251110_180942.jpg.jpeg";
import rob07 from "@/images/rob-duncan/artwork/20251122_210948.jpg.jpeg";
import rob08 from "@/images/rob-duncan/artwork/20251123_172212.jpg.jpeg";
import rob09 from "@/images/rob-duncan/artwork/20251204_152424.jpg.jpeg";
import rob10 from "@/images/rob-duncan/artwork/20260104_130214.jpg.jpeg";
import rob11 from "@/images/rob-duncan/artwork/20260117_193829.jpg.jpeg";
import rob12 from "@/images/rob-duncan/artwork/20260517_113825.jpg.jpeg";
import rob13 from "@/images/rob-duncan/artwork/20260614_173305.jpg.jpeg";
import rob14 from "@/images/rob-duncan/artwork/20260629_132754.jpg.jpeg";

import joshProfile from "@/images/josh-mann/josh-mann.jpeg";
import josh01 from "@/images/josh-mann/artwork/Screenshot_20260720_195524_Messages.jpg.jpeg";
import josh02 from "@/images/josh-mann/artwork/Screenshot_20260720_195527_Messages.jpg.jpeg";
import josh03 from "@/images/josh-mann/artwork/Screenshot_20260720_195530_Messages.jpg.jpeg";
import josh04 from "@/images/josh-mann/artwork/Screenshot_20260720_195534_Messages.jpg.jpeg";
import josh05 from "@/images/josh-mann/artwork/Screenshot_20260720_195538_Messages.jpg.jpeg";
import josh06 from "@/images/josh-mann/artwork/Screenshot_20260720_195541_Messages.jpg.jpeg";
import josh07 from "@/images/josh-mann/artwork/Screenshot_20260720_195545_Messages.jpg.jpeg";
import josh08 from "@/images/josh-mann/artwork/Screenshot_20260720_195548_Messages.jpg.jpeg";
import josh09 from "@/images/josh-mann/artwork/Screenshot_20260720_195551_Messages.jpg.jpeg";
import josh10 from "@/images/josh-mann/artwork/Screenshot_20260720_195554_Messages.jpg.jpeg";
import josh11 from "@/images/josh-mann/artwork/Screenshot_20260720_195557_Messages.jpg.jpeg";

import amandaProfile from "@/images/amanda-simonich/amanda.jpeg";
import amanda01 from "@/images/amanda-simonich/artwork/IMG_20260720_202040.jpg.jpeg";
import amanda02 from "@/images/amanda-simonich/artwork/IMG_20260720_202049.jpg.jpeg";
import amanda03 from "@/images/amanda-simonich/artwork/IMG_20260720_202051.jpg.jpeg";
import amanda04 from "@/images/amanda-simonich/artwork/IMG_20260720_202056.jpg.jpeg";
import amanda05 from "@/images/amanda-simonich/artwork/Screenshot_20260720_202259_Messages.jpg.jpeg";
import amanda06 from "@/images/amanda-simonich/artwork/Screenshot_20260720_202301_Messages.jpg.jpeg";
import amanda07 from "@/images/amanda-simonich/artwork/Screenshot_20260720_202304_Messages.jpg.jpeg";
import amanda08 from "@/images/amanda-simonich/artwork/Screenshot_20260720_202306_Messages.jpg.jpeg";

import alyProfile from "@/images/aly-wisler/aly.jpeg";
import aly01 from "@/images/aly-wisler/artwork/10651.jpg.jpeg";
import aly02 from "@/images/aly-wisler/artwork/10652.jpg.jpeg";
import aly03 from "@/images/aly-wisler/artwork/10653.jpg.jpeg";
import aly04 from "@/images/aly-wisler/artwork/10654.jpg.jpeg";
import aly05 from "@/images/aly-wisler/artwork/10655.jpg.jpeg";
import aly06 from "@/images/aly-wisler/artwork/10656.jpg.jpeg";
import aly07 from "@/images/aly-wisler/artwork/10657.jpg.jpeg";
import aly08 from "@/images/aly-wisler/artwork/10658.jpg.jpeg";
import aly09 from "@/images/aly-wisler/artwork/10659.jpg.jpeg";
import aly10 from "@/images/aly-wisler/artwork/10660.jpg.jpeg";

export type PortfolioImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  artistName: string;
  artistSlug: string;
  filename: string;
};

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
};

export type Artist = {
  name: string;
  slug: string;
  profileImage: ImageAsset;
  profileAlt: string;
  artworkDirectory: string;
  portfolioImages: PortfolioImage[];
  bio: string;
  specialties: string[];
  socialLinks: { instagram: string };
  bookingLink: string;
};

function source(image: StaticImageData | string) {
  return typeof image === "string" ? image : image.src;
}

function imageAsset(image: StaticImageData | string, width: number, height: number): ImageAsset {
  return { src: source(image), width, height };
}

function portfolio(artistName: string, artistSlug: string, files: Array<[string, StaticImageData | string, number, number]>): PortfolioImage[] {
  return files.map(([filename, image, width, height], index) => ({
    src: source(image),
    width,
    height,
    alt: `Custom tattoo by ${artistName}, portfolio image ${index + 1}`,
    artistName,
    artistSlug,
    filename,
  }));
}

export const artists: Artist[] = [
  {
    name: "Rob Duncan",
    slug: "rob-duncan",
    profileImage: imageAsset(robProfile, 350, 543),
    profileAlt: "Rob Duncan tattooing a client",
    artworkDirectory: "/images/rob-duncan/artwork",
    portfolioImages: portfolio("Rob Duncan", "rob-duncan", [
      ["10484.jpg.jpeg", rob01, 450, 600], ["20250921_155116.jpg.jpeg", rob02, 450, 600], ["20251023_150239.jpg.jpeg", rob03, 450, 600],
      ["20251025_194354.jpg.jpeg", rob04, 450, 600], ["20251026_184209.jpg.jpeg", rob05, 450, 600], ["20251110_180942.jpg.jpeg", rob06, 450, 600],
      ["20251122_210948.jpg.jpeg", rob07, 450, 600], ["20251123_172212.jpg.jpeg", rob08, 450, 600], ["20251204_152424.jpg.jpeg", rob09, 450, 600],
      ["20260104_130214.jpg.jpeg", rob10, 450, 600], ["20260117_193829.jpg.jpeg", rob11, 450, 600], ["20260517_113825.jpg.jpeg", rob12, 1536, 2048],
      ["20260614_173305.jpg.jpeg", rob13, 450, 600], ["20260629_132754.jpg.jpeg", rob14, 450, 600],
    ]),
    bio: "Artist biography coming soon. Add Rob’s background, creative approach, and the kind of collaboration clients can expect before launch.",
    specialties: ["Preferred tattoo styles — add before launch"],
    socialLinks: { instagram: "" },
    bookingLink: "/booking?artist=rob-duncan",
  },
  {
    name: "Josh Mann",
    slug: "josh-mann",
    profileImage: imageAsset(joshProfile, 277, 600),
    profileAlt: "Josh Mann tattooing a client",
    artworkDirectory: "/images/josh-mann/artwork",
    portfolioImages: portfolio("Josh Mann", "josh-mann", [
      ["Screenshot_20260720_195524_Messages.jpg.jpeg", josh01, 277, 600], ["Screenshot_20260720_195527_Messages.jpg.jpeg", josh02, 277, 600],
      ["Screenshot_20260720_195530_Messages.jpg.jpeg", josh03, 945, 2048], ["Screenshot_20260720_195534_Messages.jpg.jpeg", josh04, 945, 2048],
      ["Screenshot_20260720_195538_Messages.jpg.jpeg", josh05, 277, 600], ["Screenshot_20260720_195541_Messages.jpg.jpeg", josh06, 277, 600],
      ["Screenshot_20260720_195545_Messages.jpg.jpeg", josh07, 277, 600], ["Screenshot_20260720_195548_Messages.jpg.jpeg", josh08, 277, 600],
      ["Screenshot_20260720_195551_Messages.jpg.jpeg", josh09, 277, 600], ["Screenshot_20260720_195554_Messages.jpg.jpeg", josh10, 277, 600],
      ["Screenshot_20260720_195557_Messages.jpg.jpeg", josh11, 945, 2048],
    ]),
    bio: "Artist biography coming soon. Add Josh’s background, creative approach, and the kind of collaboration clients can expect before launch.",
    specialties: ["Preferred tattoo styles — add before launch"],
    socialLinks: { instagram: "" },
    bookingLink: "/booking?artist=josh-mann",
  },
  {
    name: "Amanda Simonich",
    slug: "amanda-simonich",
    profileImage: imageAsset(amandaProfile, 401, 600),
    profileAlt: "Amanda Simonich tattooing a client",
    artworkDirectory: "/images/amanda-simonich/artwork",
    portfolioImages: portfolio("Amanda Simonich", "amanda-simonich", [
      ["IMG_20260720_202040.jpg.jpeg", amanda01, 599, 600], ["IMG_20260720_202049.jpg.jpeg", amanda02, 600, 593],
      ["IMG_20260720_202051.jpg.jpeg", amanda03, 482, 600], ["IMG_20260720_202056.jpg.jpeg", amanda04, 600, 595],
      ["Screenshot_20260720_202259_Messages.jpg.jpeg", amanda05, 945, 2048], ["Screenshot_20260720_202301_Messages.jpg.jpeg", amanda06, 277, 600],
      ["Screenshot_20260720_202304_Messages.jpg.jpeg", amanda07, 277, 600], ["Screenshot_20260720_202306_Messages.jpg.jpeg", amanda08, 277, 600],
    ]),
    bio: "Artist biography coming soon. Add Amanda’s background, creative approach, and the kind of collaboration clients can expect before launch.",
    specialties: ["Preferred tattoo styles — add before launch"],
    socialLinks: { instagram: "" },
    bookingLink: "/booking?artist=amanda-simonich",
  },
  {
    name: "Aly Wisler",
    slug: "aly-wisler",
    profileImage: imageAsset(alyProfile, 640, 640),
    profileAlt: "Portrait of tattoo artist Aly Wisler",
    artworkDirectory: "/images/aly-wisler/artwork",
    portfolioImages: portfolio("Aly Wisler", "aly-wisler", [
      ["10651.jpg.jpeg", aly01, 360, 480], ["10652.jpg.jpeg", aly02, 240, 320], ["10653.jpg.jpeg", aly03, 240, 320], ["10654.jpg.jpeg", aly04, 240, 320],
      ["10655.jpg.jpeg", aly05, 240, 320], ["10656.jpg.jpeg", aly06, 240, 320], ["10657.jpg.jpeg", aly07, 240, 320], ["10658.jpg.jpeg", aly08, 480, 308],
      ["10659.jpg.jpeg", aly09, 240, 320], ["10660.jpg.jpeg", aly10, 240, 320],
    ]),
    bio: "Artist biography coming soon. Add Aly’s background, creative approach, and the kind of collaboration clients can expect before launch.",
    specialties: ["Preferred tattoo styles — add before launch"],
    socialLinks: { instagram: "" },
    bookingLink: "/booking?artist=aly-wisler",
  },
];

export const allArtwork = artists.flatMap((artist) => artist.portfolioImages);

export const featuredArtwork = [
  artists[0].portfolioImages[13],
  artists[2].portfolioImages[0],
  artists[3].portfolioImages[7],
  artists[1].portfolioImages[0],
  artists[0].portfolioImages[11],
  artists[2].portfolioImages[2],
  artists[3].portfolioImages[4],
  artists[1].portfolioImages[6],
];

export function getArtist(slug: string) {
  return artists.find((artist) => artist.slug === slug);
}
