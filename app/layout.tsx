import type { Metadata } from "next";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { studio } from "@/app/data/studio";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(studio.siteUrl),
  title: {
    default: "After Light Tattoo | Tattoo Studio in White Oak, PA",
    template: "%s | After Light Tattoo",
  },
  description: "Explore custom tattoo work from the artists at After Light Tattoo in White Oak, Pennsylvania. View artist portfolios and request a consultation.",
  alternates: { canonical: "/" },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: studio.name,
    title: "After Light Tattoo | Tattoo Studio in White Oak, PA",
    description: "Explore custom tattoo work from the artists at After Light Tattoo in White Oak, Pennsylvania.",
    url: studio.siteUrl,
    images: [{
      url: "/images/branding/after-light-tattoo-logo.png",
      width: 600,
      height: 600,
      alt: "After Light Tattoo logo",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "After Light Tattoo | White Oak, PA",
    description: "View artist portfolios and request a custom tattoo consultation.",
    images: ["/images/branding/after-light-tattoo-logo.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  name: studio.name,
  url: studio.siteUrl,
  image: `${studio.siteUrl}/images/branding/after-light-tattoo-logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: studio.address.street,
    addressLocality: studio.address.city,
    addressRegion: studio.address.region,
    postalCode: studio.address.postalCode,
    addressCountry: studio.address.country,
  },
  sameAs: [studio.social.facebook, studio.social.instagram],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <div id="main-content">{children}</div>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
