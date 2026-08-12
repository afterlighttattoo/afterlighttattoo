import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageCta } from "@/app/components/PageCta";
import { PageIntro } from "@/app/components/PageIntro";
import { studio } from "@/app/data/studio";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about booking, pricing, deposits, walk-ins, age requirements, and visiting After Light Tattoo in White Oak, PA.",
  alternates: { canonical: "/faq" },
};

type FaqItem = { question: string; answer: ReactNode };
type FaqGroup = { title: string; items: FaqItem[] };

const faqGroups: FaqGroup[] = [
  {
    title: "Booking & consultations",
    items: [
      {
        question: "How do I book a consultation?",
        answer: <p>Fill out the <Link className="text-link" href="/booking">consultation request form</Link> with your idea, placement, size, and availability. The studio will follow up to discuss artist availability, pricing, and next steps.</p>,
      },
      {
        question: "Do you take walk-ins?",
        answer: <p>Appointments are preferred, and walk-ins are welcome when an artist has availability. Booking ahead is the best way to guarantee time with a specific artist.</p>,
      },
      {
        question: "Can I choose which artist I work with?",
        answer: <p>Yes. Browse each artist&apos;s work on the <Link className="text-link" href="/artists">Artists</Link> page or the <Link className="text-link" href="/gallery">Gallery</Link>, then list your preferred artist on the booking form — or ask for a recommendation based on your idea.</p>,
      },
      {
        question: "What happens if I need to reschedule or cancel?",
        answer: <p>Contact the studio as soon as possible. Because deposits are non-refundable, canceling or rescheduling with little notice may mean forfeiting it, so reach out directly to talk through your options.</p>,
      },
    ],
  },
  {
    title: "Pricing & payment",
    items: [
      {
        question: "How much will my tattoo cost?",
        answer: <p>Pricing depends on size, detail, placement, and artist. Share a comfortable budget range on the consultation form and the studio will discuss specific pricing with you directly.</p>,
      },
      {
        question: "Do you require a deposit?",
        answer: <p>Yes. A non-refundable deposit is required to book an appointment and is applied toward the final cost of your tattoo.</p>,
      },
      {
        question: "What payment methods do you accept?",
        answer: <p>Cash, credit and debit cards, and Apple Pay / tap-to-pay.</p>,
      },
    ],
  },
  {
    title: "Before your appointment",
    items: [
      {
        question: "How old do I need to be to get tattooed?",
        answer: <p>You must be 18 or older, with a valid photo ID. No exceptions.</p>,
      },
      {
        question: "What should I bring to my appointment?",
        answer: <p>A valid photo ID, any reference images you haven&apos;t already shared, and comfortable clothing that gives easy access to the area being tattooed. Eating beforehand is a good idea.</p>,
      },
      {
        question: "Does it hurt?",
        answer: <p>Tattoos involve some discomfort, and it varies by placement, size, and personal tolerance. Your artist can talk through what to expect for your specific piece during the consultation.</p>,
      },
    ],
  },
  {
    title: "Healing & aftercare",
    items: [
      {
        question: "How do I take care of my new tattoo?",
        answer: <p>Follow the studio&apos;s full <Link className="text-link" href="/aftercare">aftercare guide</Link>, and always defer to any specific instructions your artist gives you at your appointment.</p>,
      },
      {
        question: "Do you do touch-ups?",
        answer: <p>Once your tattoo is fully healed, contact your artist directly to discuss whether a touch-up is needed.</p>,
      },
    ],
  },
  {
    title: "Visiting the studio",
    items: [
      {
        question: "What are your hours?",
        answer: (
          <ul>
            {studio.hours.map((entry) => <li key={entry.days}>{entry.days}: {entry.time}</li>)}
          </ul>
        ),
      },
      {
        question: "Where are you located?",
        answer: <p>{studio.address.street}, {studio.address.city}, {studio.address.region} {studio.address.postalCode}. See the <Link className="text-link" href="/about">About</Link> page for directions.</p>,
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main>
      <PageIntro
        eyebrow="FAQ"
        title="Frequently asked questions."
        description="Answers to common questions about booking, pricing, and visiting the studio. Don't see what you need? Send it along with your consultation request."
      />

      <section className="section-shell section-block faq-page">
        {faqGroups.map((group) => (
          <div className="faq-group" key={group.title}>
            <h2>{group.title}</h2>
            <div className="faq-list">
              {group.items.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary>{item.question}</summary>
                  <div className="faq-answer">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>

      <PageCta title="Didn't find your answer?" description="Send your question along with your consultation request and the studio will get back to you." />
    </main>
  );
}
