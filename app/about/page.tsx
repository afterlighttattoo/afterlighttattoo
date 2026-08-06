import type { Metadata } from "next";
import { PageCta } from "@/app/components/PageCta";
import { PageIntro } from "@/app/components/PageIntro";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the custom-art philosophy and professional client experience at After Light Tattoo.",
};

export default function AboutPage() {
  return (
    <main>
      <PageIntro
        eyebrow="About After Light"
        title="Artwork with intention. An experience built on trust."
        description="After Light Tattoo is presented as a custom studio where strong artwork, thoughtful collaboration, and a professional client experience belong together."
      />

      <section className="section-shell section-block about-story">
        <div>
          <p className="eyebrow">Story & philosophy</p>
          <h2 className="display-small">The meaning behind After Light is yours to tell.</h2>
        </div>
        <div className="prose-column">
          <div className="owner-note"><span>Owner story needed</span><p>Add the studio’s founding story, the meaning of the name, and the philosophy that brings this team together before launch.</p></div>
          <p>What is already clear is the studio’s focus: custom tattoo work developed through conversation, executed with care, and presented in a setting where clients can feel comfortable asking questions.</p>
          <p>This page intentionally avoids inventing dates, credentials, or milestones that have not been supplied.</p>
        </div>
      </section>

      <section className="values-band">
        <div className="section-shell values-grid">
          <article>
            <span aria-hidden="true">✦</span>
            <p className="eyebrow">01 · Custom artwork</p>
            <h2>Made for the person wearing it.</h2>
            <p>Each request begins with the client’s concept, references, placement, and goals so the final direction can be developed as a custom piece.</p>
          </article>
          <article>
            <span aria-hidden="true">◒</span>
            <p className="eyebrow">02 · Professional practice</p>
            <h2>Clean, careful, and transparent.</h2>
            <p>The studio’s specific sanitation practices, certifications, and safety policies should be supplied here before launch; none have been assumed.</p>
          </article>
          <article>
            <span aria-hidden="true">✧</span>
            <p className="eyebrow">03 · Respectful experience</p>
            <h2>A welcoming space for every conversation.</h2>
            <p>Clear communication and a respectful consultation process help clients understand the next step and feel comfortable throughout the experience.</p>
          </article>
        </div>
      </section>

      <section className="section-shell section-block studio-photos" aria-labelledby="studio-heading">
        <div className="section-heading">
          <div><p className="eyebrow">Inside the studio</p><h2 id="studio-heading">The space behind the work.</h2></div>
          <p>Replace these frames with exterior, reception, and tattooing-area photography when studio images are available.</p>
        </div>
        <div className="studio-photo-grid">
          <div><span>01</span><p>Studio exterior photo<br /><small>Placeholder — image needed</small></p></div>
          <div><span>02</span><p>Reception / welcome area<br /><small>Placeholder — image needed</small></p></div>
          <div><span>03</span><p>Tattooing area<br /><small>Placeholder — image needed</small></p></div>
        </div>
      </section>
      <PageCta eyebrow="Meet the artists" title="The studio is the setting. The artists make it personal." description="Explore each portfolio and find the creative point of view that fits your next piece." />
    </main>
  );
}
