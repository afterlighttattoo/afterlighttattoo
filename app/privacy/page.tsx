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
        <h2>Consultation requests</h2>
        <p>Information submitted through the consultation form is used to review your request and contact you about a potential appointment.</p>
        <p>Form submissions are delivered through FormSubmit, a third-party form-processing service. Review the <a className="text-link" href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener noreferrer">FormSubmit privacy policy</a> for information about its processing practices.</p>
        <ExternalActions />
      </section>
    </main>
  );
}
