"use client";

import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { IconCheck, IconSend } from "./B2BIcons";

const BUSINESS_TYPES = [
  "Tour operator",
  "Travel agency",
  "Destination management company (DMC)",
  "Online travel platform",
  "Adventure club / association",
  "Corporate / school group organiser",
  "Travel content creator",
  "Other",
];
const PRODUCTS = ["Classic treks", "Restricted-area treks", "Peak climbing", "Expeditions (8,000 m)", "Cultural & city tours", "Tibet & Bhutan", "Jungle safari", "Adventure sports"];
const VOLUMES = ["Just starting with Nepal", "1–20 travelers", "21–100 travelers", "101–500 travelers", "500+ travelers"];
const MODELS = ["Net rates (we sell, you operate)", "Commission on referrals", "White-label (our service, your brand)", "Not sure yet"];
const YEARS = ["Less than 1 year", "1–3 years", "4–10 years", "More than 10 years"];

type Fields = {
  company: string; businessType: string; website: string; country: string;
  contactName: string; jobTitle: string; email: string; phone: string;
  yearsInBusiness: string; volume: string; model: string; message: string;
};
const EMPTY: Fields = { company: "", businessType: "", website: "", country: "", contactName: "", jobTitle: "", email: "", phone: "", yearsInBusiness: "", volume: "", model: "", message: "" };

const REQUIRED: Partial<Record<keyof Fields, (v: string) => string | null>> = {
  company: (v) => (v.trim() ? null : "Enter your company name."),
  businessType: (v) => (v ? null : "Choose the type of business."),
  country: (v) => (v.trim() ? null : "Enter the country you are based in."),
  contactName: (v) => (v.trim() ? null : "Enter the contact person's name."),
  email: (v) => (/^\S+@\S+\.\S+$/.test(v.trim()) ? null : "Enter a valid business email, e.g. name@company.com."),
  phone: (v) => (v.replace(/\D/g, "").length >= 7 ? null : "Enter a phone or WhatsApp number with country code."),
  website: (v) => (!v.trim() || /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(v.trim()) ? null : "Enter a valid website, e.g. www.yourcompany.com."),
};

const LABEL = "block text-sm font-bold text-[#1a2e1f] mb-1.5";
const INPUT = "w-full rounded-xl border bg-white px-4 py-3 text-base text-[#1A1A2E] placeholder:text-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition";

export default function B2BPartnerForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [products, setProducts] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const captcha = useRef<ReCAPTCHA>(null);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const check = (k: keyof Fields) => () => {
    const err = REQUIRED[k]?.(f[k]) ?? null;
    setErrors((p) => ({ ...p, [k]: err || undefined }));
  };
  const field = (k: keyof Fields) => ({
    id: `p-${k}`,
    name: k,
    value: f[k],
    onChange: set(k),
    onBlur: check(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `p-${k}-err` : undefined,
    className: `${INPUT} ${errors[k] ? "border-red-400" : "border-[#D4D4D4]"}`,
  });
  const err = (k: keyof Fields) =>
    errors[k] ? <p id={`p-${k}-err`} className="mt-1.5 text-sm font-semibold text-red-700">{errors[k]}</p> : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const found: Partial<Record<keyof Fields, string>> = {};
    (Object.keys(REQUIRED) as (keyof Fields)[]).forEach((k) => {
      const m = REQUIRED[k]!(f[k]);
      if (m) found[k] = m;
    });
    setErrors(found);
    const first = (Object.keys(found) as (keyof Fields)[])[0];
    if (first) {
      document.getElementById(`p-${first}`)?.focus();
      return;
    }
    if (!token) {
      setServerError('Please tick "I\'m not a robot" before sending.');
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, products, recaptchaToken: token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send your inquiry.");
      setStatus("sent");
      try {
        (window as any).gtag?.("event", "generate_lead", { form: "b2b_partner" });
      } catch {}
    } catch (e2: any) {
      setStatus("error");
      setServerError(e2.message || "Could not send your inquiry. Please try again.");
      try { captcha.current?.reset(); } catch {}
      setToken(null);
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-center text-center gap-4 py-10 px-4">
        <IconCheck className="h-14 w-14 text-[#2E7D32]" />
        <h3 className="font-serif text-2xl font-black text-[#1a2e1f]">Thank you, {f.contactName.split(" ")[0]}!</h3>
        <p className="text-base text-[#3D3D3D] max-w-md">
          We have received the details for <strong>{f.company}</strong>. Our partnerships team will reply to{" "}
          <strong>{f.email}</strong> within 24 hours with net rates, partnership terms and sample itineraries.
        </p>
        <a href="https://wa.me/9779851218358" target="_blank" rel="noopener noreferrer" className="text-[#2E7D32] font-bold underline underline-offset-4">
          Need it sooner? Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-5">
        <legend className="font-serif text-lg font-black text-[#1a2e1f] mb-1">Your company</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="p-company" className={LABEL}>Company name <span className="text-red-600" aria-hidden="true">*</span></label>
            <input {...field("company")} type="text" autoComplete="organization" required />
            {err("company")}
          </div>
          <div>
            <label htmlFor="p-businessType" className={LABEL}>Business type <span className="text-red-600" aria-hidden="true">*</span></label>
            <select {...field("businessType")} required>
              <option value="">Select…</option>
              {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            {err("businessType")}
          </div>
          <div>
            <label htmlFor="p-website" className={LABEL}>Website</label>
            <input {...field("website")} type="url" inputMode="url" placeholder="www.yourcompany.com" autoComplete="url" />
            {err("website")}
          </div>
          <div>
            <label htmlFor="p-country" className={LABEL}>Country <span className="text-red-600" aria-hidden="true">*</span></label>
            <input {...field("country")} type="text" autoComplete="country-name" required />
            {err("country")}
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="font-serif text-lg font-black text-[#1a2e1f] mb-1">Contact person</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="p-contactName" className={LABEL}>Full name <span className="text-red-600" aria-hidden="true">*</span></label>
            <input {...field("contactName")} type="text" autoComplete="name" required />
            {err("contactName")}
          </div>
          <div>
            <label htmlFor="p-jobTitle" className={LABEL}>Job title</label>
            <input {...field("jobTitle")} type="text" autoComplete="organization-title" placeholder="e.g. Product Manager" />
          </div>
          <div>
            <label htmlFor="p-email" className={LABEL}>Business email <span className="text-red-600" aria-hidden="true">*</span></label>
            <input {...field("email")} type="email" inputMode="email" autoComplete="email" required />
            {err("email")}
          </div>
          <div>
            <label htmlFor="p-phone" className={LABEL}>Phone / WhatsApp <span className="text-red-600" aria-hidden="true">*</span></label>
            <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="+44 7700 900123" required />
            {err("phone")}
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="font-serif text-lg font-black text-[#1a2e1f] mb-1">
          Partnership details <span className="font-sans text-sm font-semibold text-[#6B6B6B]">(optional, helps us quote faster)</span>
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="p-yearsInBusiness" className={LABEL}>Years in business</label>
            <select {...field("yearsInBusiness")}>
              <option value="">Select…</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="p-volume" className={LABEL}>Travelers to Nepal per year</label>
            <select {...field("volume")}>
              <option value="">Select…</option>
              {VOLUMES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="p-model" className={LABEL}>Preferred model</label>
            <select {...field("model")}>
              <option value="">Select…</option>
              {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div role="group" aria-labelledby="p-products-label">
          <span id="p-products-label" className={LABEL}>Trips you want to sell</span>
          <div className="flex flex-wrap gap-2.5">
            {PRODUCTS.map((p) => {
              const on = products.includes(p);
              return (
                <label key={p} className={`cursor-pointer select-none rounded-full border px-4 py-2.5 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-[#2E7D32]/30 ${on ? "bg-[#1a2e1f] border-[#1a2e1f] text-white" : "bg-white border-[#D4D4D4] text-[#3D3D3D] hover:border-[#2E7D32]"}`}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => setProducts((cur) => (on ? cur.filter((x) => x !== p) : [...cur, p]))}
                  />
                  {on && <span aria-hidden="true">✓ </span>}{p}
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="p-message" className={LABEL}>Tell us about your clients and plans</label>
          <textarea {...field("message")} rows={4} placeholder="Group sizes, seasons, trips you have in mind, how you sell today…" />
        </div>
      </fieldset>

      <div className="flex flex-col items-start gap-4">
        <ReCAPTCHA
          ref={captcha}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "dummy_key"}
          onChange={(t) => { setToken(t); setServerError(null); }}
          onExpired={() => setToken(null)}
        />
        {serverError && (
          <p role="alert" className="text-sm font-semibold text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3 w-full">{serverError}</p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-[#8f6618] hover:bg-[#74520f] px-8 py-4 text-[19px] font-black uppercase tracking-wide text-white shadow-lg transition disabled:opacity-60 cursor-pointer"
        >
          {status === "sending" ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Sending…</>
          ) : (
            <><IconSend className="h-5 w-5" /> Send partnership inquiry</>
          )}
        </button>
        <p className="text-sm text-[#6B6B6B]">We reply within 24 hours. Your details are only used to answer this inquiry.</p>
      </div>
    </form>
  );
}
