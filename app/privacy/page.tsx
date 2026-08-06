import type { Metadata } from "next";
import { PageIntro } from "@/app/components/PageIntro";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for After Light Tattoo website visitors and consultation requests.",
};

export default function PrivacyPage() {
  return (
    <main>
      <PageIntro eyebrow="Privacy" title="Privacy policy." description="This page is reserved for the studio’s approved privacy policy." />
      <section className="section-shell section-block narrow-copy">
        <div className="owner-note"><span>Owner action</span><p>Provide a privacy policy that accurately describes the studio’s contact-form provider, reference-image storage, retention period, analytics, cookies, and contact method for privacy requests before enabling submissions.</p></div>
        <h2>No policy details have been invented.</h2>
        <p>The consultation form remains in preview mode and does not currently transmit or retain submitted information. Replace this placeholder with reviewed policy text before connecting form delivery.</p>
      </section>
    </main>
  );
}
