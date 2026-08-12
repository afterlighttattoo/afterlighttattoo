import type { Metadata } from "next";
import { AlertTriangle, Droplet, Droplets, Hand, Wind } from "lucide-react";
import { PageCta } from "@/app/components/PageCta";
import { PageIntro } from "@/app/components/PageIntro";

export const metadata: Metadata = {
  title: "Tattoo Aftercare",
  description: "After Light Tattoo's aftercare guide: how to clean, moisturize, and protect a new tattoo while it heals, and when to seek medical care.",
  alternates: { canonical: "/aftercare" },
};

const steps = [
  { icon: Droplet, title: "Clean", description: "Wash hands and tattoo gently." },
  { icon: Wind, title: "Dry", description: "Pat dry. Let it air dry briefly." },
  { icon: Droplets, title: "Moisturize", description: "Use a very thin fragrance-free layer." },
  { icon: Hand, title: "Leave It", description: "No picking, soaking, or rubbing." },
];

export default function AftercarePage() {
  return (
    <main>
      <PageIntro
        eyebrow="Aftercare"
        title="Heal it right."
        description="Follow this guide to help your new tattoo heal well. Always follow any specific instructions your artist gave you at your appointment."
      />

      <section className="section-shell section-block aftercare-page">
        <div className="aftercare-steps">
          {steps.map(({ icon: Icon, title, description }) => (
            <div className="aftercare-step" key={title}>
              <Icon aria-hidden="true" size={20} />
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          ))}
        </div>

        <div className="aftercare-columns">
          <div className="aftercare-column">
            <div className="aftercare-block">
              <h3>Bandage care</h3>
              <ul>
                <li>Adhesive / second-skin: leave on for the time your artist instructed. Remove if leaking, badly lifted, or contaminated.</li>
                <li>Clear fluid, ink, or plasma under the film can be normal early on.</li>
                <li>To remove: wash hands, wet the film in a warm shower, then slowly stretch and peel it back along the skin — not straight upward.</li>
                <li>Wash, pat dry with a clean disposable paper towel, air dry briefly, then apply a very thin layer of fragrance-free moisturizer.</li>
                <li>Remove and contact your artist if significant redness, blistering, or an itchy adhesive-area rash develops.</li>
                <li>Traditional bandage: keep it on for the time instructed, then remove with clean hands. Do not repeatedly re-wrap with household plastic wrap unless instructed.</li>
              </ul>
            </div>
            <div className="aftercare-block">
              <h3>Cleaning + moisturizing</h3>
              <ul>
                <li>Wash hands first. Gently wash with lukewarm water and mild fragrance-free soap using clean fingertips — no washcloths, loofahs, or scrubbing.</li>
                <li>Rinse and pat dry with a clean disposable paper towel. Wash about 2–3 times daily while fresh and whenever dirty or heavily sweaty.</li>
                <li>Once dry, use only a very thin layer of fragrance-free lotion or artist-recommended aftercare. Do not keep it greasy or smothered.</li>
              </ul>
            </div>
          </div>

          <div className="aftercare-column">
            <div className="aftercare-block">
              <h3>Normal healing</h3>
              <ul>
                <li>Mild redness, warmth, tenderness, swelling, and a small amount of clear or plasma fluid can occur early.</li>
                <li>Flaking, peeling, dryness, and itching are common. Do not pick, scratch, or pull flakes or scabs.</li>
                <li>Surface healing commonly settles in roughly 2–4 weeks; deeper layers continue healing afterward.</li>
              </ul>
            </div>
            <div className="aftercare-block">
              <h3>Avoid while healing</h3>
              <ul>
                <li><strong>No soaking</strong> — no pools, hot tubs, baths, lakes, rivers, or ocean swimming until healed.</li>
                <li><strong>No picking</strong> — do not scratch, peel, shave over, or pick scabs and flakes.</li>
                <li><strong>Limit sun</strong> — keep fresh tattoos out of direct sun. Once fully healed, use sunscreen.</li>
                <li><strong>Reduce friction</strong> — avoid tight or dirty clothing and repeated rubbing.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="aftercare-medical">
          <AlertTriangle aria-hidden="true" size={22} />
          <div>
            <h3>When to get medical help</h3>
            <p>Seek medical advice promptly if redness, swelling, warmth, or pain is worsening, or for pus, foul-smelling drainage, red streaking, significant spreading redness, fever or chills, or feeling ill. For trouble breathing or face or throat swelling, seek emergency care. A tattoo artist cannot diagnose an infection.</p>
            <p><strong>Questions?</strong> Contact your artist and include a clear photo. For a suspected infection, allergic reaction, or another medical concern, contact a qualified healthcare professional.</p>
          </div>
        </div>
      </section>

      <PageCta eyebrow="Still healing" title="Have a question about your tattoo?" description="Reach out to your artist directly, or check the FAQ for common healing and booking questions." />
    </main>
  );
}
