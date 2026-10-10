import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { sendEmail, getPremiumEmailTemplate, NOTIFY_TO, NOTIFY_BCC } from "@/lib/email";
import { verifyRecaptcha } from "@/lib/recaptcha";

// B2B partner inquiries from /b2b-partners. Stored as an inquiry (type b2b_partner)
// so the team works them in the same admin list as every other lead.

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const BUSINESS_TYPES = ["Tour operator", "Travel agency", "Destination management company (DMC)", "Online travel platform", "Adventure club / association", "Corporate / school group organiser", "Travel content creator", "Other"];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!(await verifyRecaptcha(body.recaptchaToken))) {
      return NextResponse.json({ error: "reCAPTCHA check failed. Please tick the box and try again." }, { status: 400 });
    }

    const f = {
      company: str(body.company, 160),
      businessType: str(body.businessType, 80),
      website: str(body.website, 200),
      country: str(body.country, 80),
      contactName: str(body.contactName, 120),
      jobTitle: str(body.jobTitle, 120),
      email: str(body.email, 160).toLowerCase(),
      phone: str(body.phone, 40),
      yearsInBusiness: str(body.yearsInBusiness, 40),
      volume: str(body.volume, 60),
      products: Array.isArray(body.products) ? body.products.map((p: unknown) => str(p, 60)).filter(Boolean).slice(0, 12) : [],
      model: str(body.model, 60),
      message: str(body.message, 3000),
    };

    const missing = [
      !f.company && "company name",
      !BUSINESS_TYPES.includes(f.businessType) && "business type",
      !f.country && "country",
      !f.contactName && "contact name",
      !/^\S+@\S+\.\S+$/.test(f.email) && "a valid business email",
      !f.phone && "phone / WhatsApp",
    ].filter(Boolean);
    if (missing.length) {
      return NextResponse.json({ error: `Please add ${missing.join(", ")}.` }, { status: 400 });
    }
    if (f.website && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(f.website)) {
      return NextResponse.json({ error: "Please enter a valid website address, e.g. www.yourcompany.com." }, { status: 400 });
    }

    const rows: [string, string][] = [
      ["Company", f.company],
      ["Business type", f.businessType],
      ["Website", f.website || "—"],
      ["Country", f.country],
      ["Contact", f.jobTitle ? `${f.contactName} (${f.jobTitle})` : f.contactName],
      ["Email", f.email],
      ["Phone / WhatsApp", f.phone],
      ["Years in business", f.yearsInBusiness || "—"],
      ["Expected travelers to Nepal / year", f.volume || "—"],
      ["Interested in", f.products.length ? f.products.join(", ") : "—"],
      ["Preferred partnership", f.model || "—"],
    ];
    const summary = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + (f.message ? `\n\nMessage:\n${f.message}` : "");

    const payload = await getPayload({ config });
    await payload.create({
      collection: "inquiries",
      data: {
        type: "b2b_partner",
        name: `${f.contactName} — ${f.company}`,
        email: f.email,
        phone: f.phone,
        country: f.country,
        subject: `B2B partner: ${f.company} (${f.businessType})`,
        message: summary,
        status: "new",
      } as any,
      overrideAccess: true,
    });

    const table = `<table class="data-table"><tbody>${rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table>`;
    await sendEmail({
      to: NOTIFY_TO,
      bcc: NOTIFY_BCC,
      replyTo: f.email,
      subject: `New B2B partner inquiry: ${f.company} (${f.country})`,
      html: getPremiumEmailTemplate(
        "B2B Partner Inquiry",
        "New B2B Partner Inquiry",
        `${table}${f.message ? `<div class="info-box"><p><strong>Message:</strong></p><p style="white-space: pre-wrap;">${esc(f.message)}</p></div>` : ""}`,
        f.email
      ),
    });
    await sendEmail({
      to: f.email,
      subject: "Your B2B partnership inquiry — Nature Heaven Treks & Expedition",
      html: getPremiumEmailTemplate(
        "B2B Partner Inquiry",
        `Hello ${esc(f.contactName)},`,
        `<p>Thank you for your interest in partnering with Nature Heaven Treks &amp; Expedition.</p>
         <p>We have received the details for <strong>${esc(f.company)}</strong>. Our partnerships team will reply within 24 hours with net rates, partnership terms and sample itineraries for the trips you are interested in.</p>
         <p>For anything urgent, message us on WhatsApp: +977-9851218358.</p>
         <br /><p>Best regards,<br/><strong>The Nature Heaven Treks Team</strong></p>`
      ),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Partner API error:", error);
    return NextResponse.json({ error: "Something went wrong sending your inquiry. Please try again or email info@natureheaventreks.com." }, { status: 500 });
  }
}
