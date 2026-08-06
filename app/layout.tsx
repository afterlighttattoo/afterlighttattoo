import type { Metadata } from "next";
import { headers } from "next/headers";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { studio } from "@/app/data/studio";
import "./globals.css";

async function requestOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const origin = await requestOrigin();
  return {
    metadataBase: new URL(origin),
    title: {
      default: "After Light Tattoo | Custom Tattoo Studio",
      template: "%s | After Light Tattoo",
    },
    description: "Professional custom tattooing in a clean, welcoming studio. Explore artist portfolios and request a consultation with After Light Tattoo.",
    icons: {
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
    openGraph: {
      type: "website",
      siteName: "After Light Tattoo",
      title: "After Light Tattoo | Art That Lives Beyond the Light",
      description: "Custom tattooing by four artists in a professional, welcoming studio.",
      url: origin,
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "After Light Tattoo — Art That Lives Beyond the Light" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "After Light Tattoo",
      description: "Art that lives beyond the light.",
      images: [`${origin}/og.png`],
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const origin = await requestOrigin();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: studio.name,
    url: origin,
    image: `${origin}/og.png`,
    ...(studio.contact.email ? { email: studio.contact.email } : {}),
    ...(studio.contact.phone ? { telephone: studio.contact.phone } : {}),
    ...(studio.address.street ? {
      address: {
        "@type": "PostalAddress",
        streetAddress: studio.address.street,
        addressLocality: studio.address.city,
        addressRegion: studio.address.region,
        postalCode: studio.address.postalCode,
        addressCountry: studio.address.country,
      },
    } : {}),
  };

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
