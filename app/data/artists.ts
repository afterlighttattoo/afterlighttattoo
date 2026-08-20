import type { StaticImageData } from "next/image";

import joshProfile from "@/images/josh-mann/josh-mann.jpeg";
import amandaProfile from "@/images/amanda-simonich/amanda.jpeg";
import alyProfile from "@/images/aly-wisler/aly.jpeg";

export type PortfolioImage = {
  id?: string;
  src: string;
  fullSrc?: string;
  width: number;
  height: number;
  fullWidth?: number;
  fullHeight?: number;
  alt: string;
  artistName: string;
  artistSlug: string;
  filename: string;
  featured?: boolean;
  homepagePrepared?: boolean;
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

function portfolio(artistName: string, artistSlug: string, artworkDirectory: string, files: Array<[string, number, number]>): PortfolioImage[] {
  return files.map(([filename, width, height], index) => ({
    src: `${artworkDirectory}/${filename}`,
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
    artworkDirectory: "/images/rob-duncan/new-artwork",
    portfolioImages: portfolio("Rob Duncan", "rob-duncan", "/images/rob-duncan/new-artwork", [
      ["rob-1.jpg", 1536, 2048], ["rob-2.jpg", 1536, 2048], ["rob-3.jpg", 1536, 2048],
      ["rob-5.jpg", 1536, 2048], ["rob-6.jpg", 1536, 2048], ["rob-7.jpg", 1536, 2048],
      ["rob-8.jpg", 1536, 2048], ["rob-9.jpg", 1536, 2048], ["rob-10.jpg", 1536, 2048],
      ["rob-11.jpg", 1536, 2048], ["rob-12.jpg", 1536, 2048], ["rob-13.jpg", 1536, 2048],
      ["rob-14.jpg", 1536, 2048], ["rob-15.jpg", 1536, 2048], ["rob-16.jpg", 1536, 2048],
      ["rob-17.jpg", 1536, 2048], ["rob-18.jpg", 1536, 2048], ["rob-19.jpg", 1536, 2048],
      ["rob-20.jpg", 1536, 2048], ["rob-21.jpg", 1536, 2048], ["rob-22.jpg", 1536, 2048],
      ["rob-23.jpg", 1536, 2048], ["rob-24.jpg", 1536, 2048], ["rob-25.jpg", 1536, 2048],
      ["rob-26.jpg", 1536, 2048], ["rob-27.jpg", 1536, 2048], ["rob-28.jpg", 1536, 2048],
      ["rob-29.jpg", 1536, 2048], ["rob-30.jpg", 1536, 2048], ["rob-31.jpg", 1536, 2048],
      ["rob-32.jpg", 1536, 2048], ["rob-33.jpg", 1536, 2048], ["rob-34.jpg", 1536, 2048],
      ["rob-35.jpg", 736, 1000], ["rob-36.jpg", 736, 1000], ["rob-37.jpg", 736, 1000],
      ["rob-38.jpg", 1536, 2048], ["ron-4.jpg", 1536, 2048],
    ]),
    bio: `My name is Rob Duncan. I was born in Jeannette, Pennsylvania, spent much of my childhood in Lancaster, and moved back to the area in 2006.

I’ve been professionally tattooing since 2017, specializing in Neo-Traditional, American Traditional, and pop-culture-inspired tattoos. I especially enjoy creating pieces with bold lines, strong designs, and bright, vibrant color.

After years of growing as an artist and building my career, I’m proud to begin the next chapter by opening After Light Tattoo. Creating a shop of my own has given me the opportunity to build a space centered around great artwork, creativity, and making every client feel comfortable and welcome.

For me, tattooing is about more than putting artwork on skin. I love taking someone’s idea—whether it’s meaningful, nostalgic, weird, or completely original—and turning it into something they’re excited to wear for life.

I’m always working to grow as an artist, push my creativity, and make every tattoo better than the last.`,
    specialties: ["Neo-Traditional", "American Traditional", "Pop-Culture"],
    homepageSpecialties: ["Neo-Traditional", "American Traditional", "Pop-Culture"],
    socialLinks: { instagram: "" },
    bookingLink: "/booking?artist=rob-duncan",
  },
  {
    name: "Josh Mann",
    slug: "josh-mann",
    profileImage: imageAsset(joshProfile, 277, 600),
    profileAlt: "Josh Mann tattooing a client",
    artworkDirectory: "/images/josh-mann/new-artwork",
    portfolioImages: portfolio("Josh Mann", "josh-mann", "/images/josh-mann/new-artwork", [
      ["jm-1.jpg", 1536, 2048], ["jm-2.jpg", 1536, 2048], ["jm-3.jpg", 1536, 2048],
      ["jm-4.jpg", 1536, 2048], ["jm-5.jpg", 1536, 2048], ["jm-6.jpg", 1536, 2048],
      ["jm-7.jpg", 736, 1000], ["jm-8.jpg", 1179, 1572], ["jm-9.jpg", 1536, 2048],
      ["jm-10.jpg", 1536, 2048], ["jm-11.jpg", 1536, 2048], ["jm-12.jpg", 1536, 2048],
      ["jm-13.jpg", 1536, 2048], ["jm-14.jpg", 1536, 2048], ["jm-15.jpg", 1536, 2048],
      ["jm-16.jpg", 1536, 2048], ["jm-17.jpg", 1536, 2048], ["jm-19.jpg", 639, 892],
      ["jm-20.jpg", 1536, 2048], ["jm-21.jpg", 2048, 1365],
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
    artworkDirectory: "/images/amanda-simonich/new-artwork",
    portfolioImages: portfolio("Amanda Simonich", "amanda-simonich", "/images/amanda-simonich/new-artwork", [
      ["am-1.jpg", 1440, 1440], ["am-2.jpg", 1440, 1796], ["am-3.jpg", 1440, 1440],
      ["am-4.jpg", 1440, 1444], ["am-5.jpg", 1440, 1440], ["am-6.jpg", 982, 982],
      ["am-7.jpg", 956, 956], ["am-8.jpg", 1028, 1028], ["am-9.jpg", 1179, 1165],
      ["am-10.jpg", 1990, 2048], ["am-11.jpg", 1040, 1065], ["am-12.jpg", 1930, 2048],
      ["am-13.jpg", 1179, 1140], ["am-14.jpg", 1440, 1641], ["am-15.jpg", 1178, 1171],
      ["am-16.jpg", 1440, 1440], ["am-17.jpg", 1440, 1453], ["am-18.jpg", 1440, 1800],
      ["am-19.jpg", 1440, 1602], ["am-20.jpg", 1440, 1539], ["am-21.jpg", 1440, 1511],
      ["am-22.jpg", 1440, 1440], ["am-23.jpg", 1385, 1385], ["am-24.jpg", 1293, 1293],
      ["am-25.jpg", 1440, 1440], ["am-26.jpg", 1366, 1366], ["am-27.jpg", 852, 852],
      ["am-28.jpg", 1234, 1234], ["am-29.jpg", 1440, 1440], ["am-30.jpg", 1291, 1291],
      ["am-31.jpg", 1491, 1491], ["am-32.jpg", 1440, 1440],
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
    artworkDirectory: "/images/aly-wisler/new-artwork2",
    portfolioImages: portfolio("Aly Wisler", "aly-wisler", "/images/aly-wisler/new-artwork2", [
      ["095b9bfb-523f-4507-8424-2f172c41a78d.jpg", 1536, 2048],
      ["17cb1cab-4e8f-4539-a31e-d8a061f9bf6b.jpg", 1536, 2048],
      ["24e043cf-a774-442c-a441-7cf429189dd6.jpg", 1536, 2048],
      ["29219d62-ce5f-46dd-9b86-42144b8f3473.jpg", 1536, 2048],
      ["5a89e3f6-7b82-47a8-9910-a28ae04fff99.jpg", 1536, 2048],
      ["8f798ba7-42a6-445b-b7e5-d5012f474eda.jpg", 1536, 2048],
      ["935b0b96-66e1-4344-b9f4-ae21de34cc5c.jpg", 2048, 1310],
      ["ab511802-8424-4688-9e62-966d30da4131.jpg", 1536, 2048],
      ["aly-2.jpg", 1440, 1457], ["aly-4.jpg", 1440, 1618], ["aly-5.jpg", 1440, 1513],
      ["aly-6.jpg", 1440, 1538], ["aly-7.jpg", 1440, 1534], ["aly-8.jpg", 1440, 1440],
      ["aly-9.jpg", 1440, 1501], ["aly-11.jpg", 1536, 2048],
      ["cfc95ae4-60c8-4830-b963-7f33f7922638.jpg", 1536, 2048],
      ["f90a58c8-7448-4720-9968-86a0964d211e.jpg", 1536, 2048],
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
