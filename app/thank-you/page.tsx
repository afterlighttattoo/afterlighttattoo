import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Consultation Request Sent",
  description: "Your consultation request has been sent to After Light Tattoo.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="thank-you-page section-shell">
      <p className="eyebrow">Request received</p>
      <h1>Thank you.</h1>
      <p>Your consultation request has been sent to After Light Tattoo.</p>
      <p>The studio will contact you regarding your request.</p>
      <div className="button-row">
        <Link className="button button-gold" href="/">Return Home</Link>
        <Link className="button button-ghost" href="/artists">View Artists</Link>
      </div>
    </main>
  );
}
