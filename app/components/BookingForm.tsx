"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { Artist } from "@/app/data/artists";

type Errors = Record<string, string>;

export function BookingForm({ artists, initialArtist = "" }: { artists: Artist[]; initialArtist?: string }) {
  const [preferredArtist, setPreferredArtist] = useState(initialArtist);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Errors = {};
    const requiredFields: Array<[string, string]> = [
      ["fullName", "Enter your full name."], ["email", "Enter your email address."], ["phone", "Enter your phone number."],
      ["preferredArtist", "Choose an artist or ask for a recommendation."], ["concept", "Tell us about your tattoo concept."],
      ["placement", "Enter your preferred placement."], ["size", "Enter an approximate size."],
      ["finish", "Choose black-and-gray, color, or undecided."], ["budget", "Enter a comfortable budget range."],
      ["availability", "Tell us when you are generally available."],
    ];
    requiredFields.forEach(([field, message]) => { if (!String(data.get(field) ?? "").trim()) nextErrors[field] = message; });
    const email = String(data.get("email") ?? "");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    const file = data.get("references");
    if (file instanceof File && file.size > 10 * 1024 * 1024) nextErrors.references = "Reference images must be 10 MB or smaller.";
    if (!data.get("consent")) nextErrors.consent = "Confirm consent before submitting.";
    setErrors(nextErrors);
    setSubmitted(false);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    form.reset();
    setPreferredArtist("");
    setSubmitted(true);
  }

  const error = (name: string) => errors[name] ? <p className="field-error" id={`${name}-error`}>{errors[name]}</p> : null;
  const describedBy = (name: string) => errors[name] ? `${name}-error` : undefined;

  return (
    <form className="booking-form" id="consultation-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <p className="eyebrow">Consultation request</p>
        <h2>Tell us about your idea.</h2>
        <p>Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.</p>
      </div>

      <div className="form-status owner-note" role="note">
        <span>Owner action</span>
        <p>Form delivery and reference-image storage must be connected before launch. This preview validates entries but does not transmit or retain customer information.</p>
      </div>
      {submitted && <div className="success-message" role="status"><strong>Your form is complete.</strong> This website preview has validated the request, but delivery is not connected yet.</div>}

      <div className="form-grid">
        <div className="field-group">
          <label htmlFor="fullName">Full name <span>*</span></label>
          <input id="fullName" name="fullName" autoComplete="name" aria-invalid={!!errors.fullName} aria-describedby={describedBy("fullName")} />
          {error("fullName")}
        </div>
        <div className="field-group">
          <label htmlFor="email">Email <span>*</span></label>
          <input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy("email")} />
          {error("email")}
        </div>
        <div className="field-group">
          <label htmlFor="phone">Phone number <span>*</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} />
          {error("phone")}
        </div>
        <div className="field-group">
          <label htmlFor="preferredArtist">Preferred artist <span>*</span></label>
          <select id="preferredArtist" name="preferredArtist" value={preferredArtist} onChange={(event) => setPreferredArtist(event.target.value)} aria-invalid={!!errors.preferredArtist} aria-describedby={describedBy("preferredArtist")}>
            <option value="">Choose an artist</option>
            <option value="recommendation">I’d like a recommendation</option>
            {artists.map((artist) => <option value={artist.slug} key={artist.slug}>{artist.name}</option>)}
          </select>
          {error("preferredArtist")}
        </div>
        <div className="field-group field-wide">
          <label htmlFor="concept">Tattoo concept <span>*</span></label>
          <textarea id="concept" name="concept" rows={5} placeholder="Describe the subject, mood, meaningful details, and anything you want the artist to consider." aria-invalid={!!errors.concept} aria-describedby={describedBy("concept")} />
          {error("concept")}
        </div>
        <div className="field-group">
          <label htmlFor="placement">Preferred placement <span>*</span></label>
          <input id="placement" name="placement" placeholder="Example: outer forearm" aria-invalid={!!errors.placement} aria-describedby={describedBy("placement")} />
          {error("placement")}
        </div>
        <div className="field-group">
          <label htmlFor="size">Approximate size <span>*</span></label>
          <input id="size" name="size" placeholder="Dimensions or a familiar object for scale" aria-invalid={!!errors.size} aria-describedby={describedBy("size")} />
          {error("size")}
        </div>
        <fieldset className="field-group field-wide choice-field" aria-invalid={!!errors.finish} aria-describedby={describedBy("finish")}>
          <legend>Black-and-gray or color? <span>*</span></legend>
          <label><input type="radio" name="finish" value="black-and-gray" /> Black-and-gray</label>
          <label><input type="radio" name="finish" value="color" /> Color</label>
          <label><input type="radio" name="finish" value="undecided" /> Undecided</label>
          {error("finish")}
        </fieldset>
        <div className="field-group">
          <label htmlFor="budget">Budget range <span>*</span></label>
          <input id="budget" name="budget" placeholder="Your comfortable range" aria-invalid={!!errors.budget} aria-describedby={describedBy("budget")} />
          {error("budget")}
        </div>
        <div className="field-group">
          <label htmlFor="availability">Availability <span>*</span></label>
          <input id="availability" name="availability" placeholder="Days, times, and general timeframe" aria-invalid={!!errors.availability} aria-describedby={describedBy("availability")} />
          {error("availability")}
        </div>
        <div className="field-group field-wide file-field">
          <label htmlFor="references">Reference images <small>Optional · JPG, PNG, WEBP, or AVIF · 10 MB max</small></label>
          <input id="references" name="references" type="file" accept="image/jpeg,image/png,image/webp,image/avif" aria-invalid={!!errors.references} aria-describedby={describedBy("references")} />
          {error("references")}
        </div>
        <div className="field-group field-wide">
          <label htmlFor="details">Additional details</label>
          <textarea id="details" name="details" rows={4} placeholder="Share accessibility needs, scheduling context, cover-up details, or questions for the studio." />
        </div>
      </div>

      <label className="consent-field">
        <input name="consent" type="checkbox" aria-invalid={!!errors.consent} aria-describedby={describedBy("consent")} />
        <span>I consent to After Light Tattoo using the information in this request to contact me about a consultation. I have reviewed the <Link href="/privacy">privacy policy</Link>. <strong>*</strong></span>
      </label>
      {error("consent")}

      <p className="booking-disclaimer">Submitting this form does not guarantee an appointment. The studio will contact you to discuss artist availability, pricing, any required deposit, and next steps.</p>
      <button className="button button-gold submit-button" type="submit">Submit consultation request <span aria-hidden="true">↗</span></button>
    </form>
  );
}
