import type { Metadata } from "next";
import { ExternalActions } from "@/app/components/ExternalActions";
import { PageIntro } from "@/app/components/PageIntro";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for After Light Tattoo website visitors and consultation requests.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main>
      <PageIntro eyebrow="Privacy" title="Privacy policy." description="Information about consultation requests and this website." />
      <section className="section-shell section-block narrow-copy">
        <h2>Online consultation delivery</h2>
        <p>The online consultation form currently validates entries in your browser but does not transmit or store submitted information on a server.</p>
        <p>A complete privacy policy will be published before online consultation delivery is enabled. Until then, contact the studio through its official social profiles if you need help.</p>
        <ExternalActions />
      </section>
    </main>
  );
}
