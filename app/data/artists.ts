import type { StaticImageData } from "next/image";

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
import aly01 from "@/images/aly-wisler/new-artwork/095b9bfb-523f-4507-8424-2f172c41a78d.jpg";
import aly02 from "@/images/aly-wisler/new-artwork/17cb1cab-4e8f-4539-a31e-d8a061f9bf6b.jpg";
import aly03 from "@/images/aly-wisler/new-artwork/24e043cf-a774-442c-a441-7cf429189dd6.jpg";
import aly04 from "@/images/aly-wisler/new-artwork/29219d62-ce5f-46dd-9b86-42144b8f3473.jpg";
import aly05 from "@/images/aly-wisler/new-artwork/5a89e3f6-7b82-47a8-9910-a28ae04fff99.jpg";
import aly06 from "@/images/aly-wisler/new-artwork/8f798ba7-42a6-445b-b7e5-d5012f474eda.jpg";
import aly07 from "@/images/aly-wisler/new-artwork/935b0b96-66e1-4344-b9f4-ae21de34cc5c.jpg";
import aly08 from "@/images/aly-wisler/new-artwork/ab511802-8424-4688-9e62-966d30da4131.jpg";
import aly09 from "@/images/aly-wisler/new-artwork/cfc95ae4-60c8-4830-b963-7f33f7922638.jpg";
import aly10 from "@/images/aly-wisler/new-artwork/f90a58c8-7448-4720-9968-86a0964d211e.jpg";

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
  bio: string | null;
  specialties: string[];
  homepageSpecialties: string[];
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
    profileImage: { src: "/images/rob-duncan/rob.png", width: 350, height: 543 },
    profileAlt: "Rob Duncan tattooing a client",
    artworkDirectory: "/images/rob-duncan/artwork",
    portfolioImages: portfolio("Rob Duncan", "rob-duncan", [
      ["10484.jpg.jpeg", rob01, 450, 600], ["20250921_155116.jpg.jpeg", rob02, 450, 600], ["20251023_150239.jpg.jpeg", rob03, 450, 600],
      ["20251025_194354.jpg.jpeg", rob04, 450, 600], ["20251026_184209.jpg.jpeg", rob05, 450, 600], ["20251110_180942.jpg.jpeg", rob06, 450, 600],
      ["20251122_210948.jpg.jpeg", rob07, 450, 600], ["20251123_172212.jpg.jpeg", rob08, 450, 600], ["20251204_152424.jpg.jpeg", rob09, 450, 600],
      ["20260104_130214.jpg.jpeg", rob10, 450, 600], ["20260117_193829.jpg.jpeg", rob11, 450, 600], ["20260517_113825.jpg.jpeg", rob12, 1536, 2048],
      ["20260614_173305.jpg.jpeg", rob13, 450, 600], ["20260629_132754.jpg.jpeg", rob14, 450, 600],
    ]),
    bio: null,
    specialties: [],
    homepageSpecialties: [],
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
    bio: `Art has been a part of my life for as long as I can remember. I grew up in a household with a father who was an incredible artist and well known locally for his work. Watching him create had a huge influence on me, and from a young age, I was always drawing, coloring, and filling pages—and sometimes walls—with color.

As I got older, I became heavily drawn to graffiti and the world of cartoons. I loved the bold colors, exaggerated characters, and personality that cartoons could bring to a piece. Eventually, I began combining those influences with graffiti, developing a style that felt uniquely my own.

As my love for art continued to grow, I eventually found my way into tattooing. It gave me a new canvas to explore the styles and ideas I had been developing for years, allowing me to combine my love of graffiti, cartoons, and illustration into artwork that people can carry with them forever.

Today, I love creating tattoos with bright colors, bold imagery, and plenty of personality. One of my favorite things to do is turn people’s pets into characters that capture their unique personalities.

Outside of tattooing, I enjoy graffiti black book sessions, creating large murals, painting on canvas, and designing tattoo flash with paint markers.

Whether I’m working on skin, paper, or a large-scale piece of artwork, my goal is always the same: to create something dope that people can connect with and never forget.`,
    specialties: ["Color", "Illustrative", "Cartoon-inspired", "Graffiti-inspired", "Bold imagery", "Character designs", "Custom pet character tattoos"],
    homepageSpecialties: ["Color", "Illustrative", "Cartoon"],
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
    bio: `I have eight years of experience tattooing in Pittsburgh and the surrounding areas. I specialize primarily in black and gray realism, illustrative, floral, geometric, and fine-line tattoos.

My goal is to work with every client throughout the creative process to design a custom, lasting piece of art that they’ll be proud to wear for years to come.`,
    specialties: ["Black and gray realism", "Illustrative", "Floral", "Geometric", "Fine-line"],
    homepageSpecialties: ["Black & Gray", "Floral", "Fine-Line"],
    socialLinks: { instagram: "" },
    bookingLink: "/booking?artist=amanda-simonich",
  },
  {
    name: "Aly Wisler",
    slug: "aly-wisler",
    profileImage: imageAsset(alyProfile, 640, 640),
    profileAlt: "Portrait of tattoo artist Aly Wisler",
    artworkDirectory: "/images/aly-wisler/new-artwork",
    portfolioImages: portfolio("Aly Wisler", "aly-wisler", [
      ["095b9bfb-523f-4507-8424-2f172c41a78d.jpg", aly01, 1536, 2048],
      ["17cb1cab-4e8f-4539-a31e-d8a061f9bf6b.jpg", aly02, 1536, 2048],
      ["24e043cf-a774-442c-a441-7cf429189dd6.jpg", aly03, 1536, 2048],
      ["29219d62-ce5f-46dd-9b86-42144b8f3473.jpg", aly04, 1536, 2048],
      ["5a89e3f6-7b82-47a8-9910-a28ae04fff99.jpg", aly05, 1536, 2048],
      ["8f798ba7-42a6-445b-b7e5-d5012f474eda.jpg", aly06, 1536, 2048],
      ["935b0b96-66e1-4344-b9f4-ae21de34cc5c.jpg", aly07, 2048, 1310],
      ["ab511802-8424-4688-9e62-966d30da4131.jpg", aly08, 1536, 2048],
      ["cfc95ae4-60c8-4830-b963-7f33f7922638.jpg", aly09, 1536, 2048],
      ["f90a58c8-7448-4720-9968-86a0964d211e.jpg", aly10, 1536, 2048],
    ]),
    bio: `Hello! My name is Aly, and I’ve been tattooing for about five years. I began my tattoo journey in Brookline, learning under Gregory Tepper, and completed my apprenticeship in a little over a year.

While I’ve continued to grow throughout my career, I feel like the last two years have pushed me especially far as an artist and taught me so much about my craft.

I’ve always leaned toward fine-line tattooing, but I try not to put myself into a box. I love experimenting with different styles and keeping things fresh. Doing the same thing every day would get boring, and fortunately, tattooing gives me the opportunity to constantly change it up.

From black and gray micro-realism to bright, bold neo-traditional pieces, I love the variety and the opportunity to create something different for every client.`,
    specialties: ["Fine-line", "Black and gray micro-realism", "Neo-traditional", "Color", "Black and gray"],
    homepageSpecialties: ["Fine-Line", "Micro-Realism", "Neo-Traditional"],
    socialLinks: { instagram: "" },
    bookingLink: "/booking?artist=aly-wisler",
  },
];

export const allArtwork = artists.flatMap((artist) => artist.portfolioImages);

const longestPortfolio = Math.max(...artists.map((artist) => artist.portfolioImages.length));

const slideshowPortfolios = artists.map((artist) =>
  artist.portfolioImages
    .map((image, originalIndex) => ({ image, originalIndex }))
    .sort((a, b) => (b.image.width * b.image.height) - (a.image.width * a.image.height) || a.originalIndex - b.originalIndex)
    .map(({ image }) => image),
);

export const carouselArtwork = Array.from({ length: longestPortfolio }, (_, imageIndex) =>
  slideshowPortfolios
    .map((portfolioImages) => portfolioImages[imageIndex])
    .filter((image): image is PortfolioImage => Boolean(image)),
).flat();

export function getArtist(slug: string) {
  return artists.find((artist) => artist.slug === slug);
}
