"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { Artist } from "@/app/data/artists";

type Errors = Record<string, string>;

const formSubmitEndpoint = "https://formsubmit.co/afterlighttattoo2026@outlook.com";
const productionUrl = "https://afterlighttattoo.afterlighttattoo.workers.dev";

export function BookingForm({ artists, initialArtist = "" }: { artists: Artist[]; initialArtist?: string }) {
  const [preferredArtist, setPreferredArtist] = useState(initialArtist);
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Errors = {};
    const requiredFields: Array<[string, string, string]> = [
      ["Full Name", "fullName", "Enter your full name."],
      ["email", "email", "Enter your email address."],
      ["Phone", "phone", "Enter your phone number."],
      ["Preferred Artist", "preferredArtist", "Choose an artist or ask for a recommendation."],
      ["Tattoo Concept", "concept", "Tell us about your tattoo concept."],
      ["Placement", "placement", "Enter your preferred placement."],
      ["Approximate Size", "size", "Enter an approximate size."],
      ["Color Preference", "finish", "Choose black-and-gray, color, or undecided."],
      ["Budget", "budget", "Enter a comfortable budget range."],
      ["Availability", "availability", "Tell us when you are generally available."],
    ];

    requiredFields.forEach(([fieldName, errorKey, message]) => {
      if (!String(data.get(fieldName) ?? "").trim()) nextErrors[errorKey] = message;
    });

    const email = String(data.get("email") ?? "");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address.";

    const file = data.get("attachment");
    if (file instanceof File && file.size > 10 * 1024 * 1024) nextErrors.references = "Reference images must be 10 MB or smaller.";
    if (!data.get("Consent")) nextErrors.consent = "Confirm consent before submitting.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      event.preventDefault();
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
    }
  }

  const error = (name: string) => errors[name] ? <p className="field-error" id={`${name}-error`}>{errors[name]}</p> : null;
  const describedBy = (name: string) => errors[name] ? `${name}-error` : undefined;

  return (
    <form
      className="booking-form"
      id="consultation-form"
      action={formSubmitEndpoint}
      method="POST"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="_subject" value="New After Light Tattoo Consultation Request" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={`${productionUrl}/thank-you`} />
      <input type="hidden" name="_url" value={`${productionUrl}/booking`} />
      <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="form-heading">
        <h2>Request a consultation.</h2>
        <p>Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.</p>
      </div>

      <fieldset className="form-section">
        <legend><span>01</span> Contact information</legend>
        <div className="form-grid">
          <div className="field-group">
            <label htmlFor="fullName">Full name <span>*</span></label>
            <input id="fullName" name="Full Name" autoComplete="name" required aria-invalid={!!errors.fullName} aria-describedby={describedBy("fullName")} />
            {error("fullName")}
          </div>
          <div className="field-group">
            <label htmlFor="email">Email <span>*</span></label>
            <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={describedBy("email")} />
            {error("email")}
          </div>
          <div className="field-group">
            <label htmlFor="phone">Phone number <span>*</span></label>
            <input id="phone" name="Phone" type="tel" autoComplete="tel" required aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} />
            {error("phone")}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend><span>02</span> Tattoo idea</legend>
        <div className="form-grid">
          <div className="field-group field-wide">
            <label htmlFor="concept">Tattoo concept <span>*</span></label>
            <textarea id="concept" name="Tattoo Concept" rows={5} required placeholder="Describe the subject, mood, and details you want the artist to consider." aria-invalid={!!errors.concept} aria-describedby={describedBy("concept")} />
            {error("concept")}
          </div>
          <div className="field-group">
            <label htmlFor="placement">Placement <span>*</span></label>
            <input id="placement" name="Placement" required placeholder="Example: outer forearm" aria-invalid={!!errors.placement} aria-describedby={describedBy("placement")} />
            {error("placement")}
          </div>
          <div className="field-group">
            <label htmlFor="size">Approximate size <span>*</span></label>
            <input id="size" name="Approximate Size" required placeholder="Dimensions or an object for scale" aria-invalid={!!errors.size} aria-describedby={describedBy("size")} />
            {error("size")}
          </div>
          <fieldset className="field-group field-wide choice-field" aria-invalid={!!errors.finish} aria-describedby={describedBy("finish")}>
            <legend>Black-and-gray or color? <span>*</span></legend>
            <label><input type="radio" name="Color Preference" value="Black-and-gray" required /> Black-and-gray</label>
            <label><input type="radio" name="Color Preference" value="Color" /> Color</label>
            <label><input type="radio" name="Color Preference" value="Undecided" /> Undecided</label>
            {error("finish")}
          </fieldset>
          <div className="field-group">
            <label htmlFor="budget">Budget range <span>*</span></label>
            <input id="budget" name="Budget" required placeholder="Your comfortable range" aria-invalid={!!errors.budget} aria-describedby={describedBy("budget")} />
            {error("budget")}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend><span>03</span> Artist and scheduling</legend>
        <div className="form-grid">
          <div className="field-group">
            <label htmlFor="preferredArtist">Preferred artist <span>*</span></label>
            <select id="preferredArtist" name="Preferred Artist" required value={preferredArtist} onChange={(event) => setPreferredArtist(event.target.value)} aria-invalid={!!errors.preferredArtist} aria-describedby={describedBy("preferredArtist")}>
              <option value="">Choose an artist</option>
              <option value="recommendation">I&apos;d like a recommendation</option>
              {artists.map((artist) => <option value={artist.slug} key={artist.slug}>{artist.name}</option>)}
            </select>
            {error("preferredArtist")}
          </div>
          <div className="field-group">
            <label htmlFor="availability">Availability <span>*</span></label>
            <input id="availability" name="Availability" required placeholder="Days, times, and general timeframe" aria-invalid={!!errors.availability} aria-describedby={describedBy("availability")} />
            {error("availability")}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend><span>04</span> References and details</legend>
        <div className="form-grid">
          <div className="field-group field-wide file-field">
            <label htmlFor="references">Reference image <small>Optional · JPG, PNG, WEBP, or AVIF · 10 MB max</small></label>
            <input id="references" name="attachment" type="file" accept="image/jpeg,image/png,image/webp,image/avif" aria-invalid={!!errors.references} aria-describedby={describedBy("references")} />
            {error("references")}
          </div>
          <div className="field-group field-wide">
            <label htmlFor="details">Additional details</label>
            <textarea id="details" name="Additional Details" rows={4} placeholder="Share scheduling context, cover-up details, accessibility needs, or questions." />
          </div>
        </div>
      </fieldset>

      <label className="consent-field">
        <input name="Consent" value="Yes" type="checkbox" required aria-invalid={!!errors.consent} aria-describedby={describedBy("consent")} />
        <span>I consent to After Light Tattoo using the information in this request to contact me about a consultation. I have reviewed the <Link href="/privacy">privacy policy</Link>. <strong>*</strong></span>
      </label>
      {error("consent")}

      <p className="booking-disclaimer">Submitting this form does not guarantee an appointment. The studio will contact you to discuss artist availability, pricing, any required deposit, and next steps.</p>
      <button className="button button-gold submit-button" type="submit">Submit Consultation Request</button>
    </form>
  );
}
