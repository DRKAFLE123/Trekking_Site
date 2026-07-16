import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { sendEmail, getPremiumEmailTemplate, NOTIFY_TO, NOTIFY_BCC } from "@/lib/email";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, recaptchaToken } = body;

    // reCAPTCHA is optional here (newsletter widget lives in the footer on
    // every page, so a visible challenge would hurt UX). When a token is
    // sent we still verify it; otherwise the IP rate-limit in middleware.ts
    // protects this endpoint from abuse.
    if (recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
      if (!isValidRecaptcha) {
        return NextResponse.json(
          { error: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Save newsletter subscriber to inquiries collection
    const payload = await getPayload({ config });
    await payload.create({
      collection: "inquiries",
      data: {
        type: "newsletter",
        name: "Newsletter Subscriber",
        email,
        message: "Subscribed via website newsletter form.",
        status: "new",
      },
    });

    console.log(`[NEWSLETTER SUBSCRIBE] Email: ${email}`);

    // Fetch blogSettings to retrieve PDF file link if configured
    let pdfUrl: string | null = null;
    try {
      const blogSettingsRes = await payload.find({
        collection: "blogSettings",
        depth: 1,
      });
      const blogSettings = blogSettingsRes.docs[0] || null;
      const pdfFile = blogSettings?.guideSettings?.pdfFile;
      if (pdfFile && typeof pdfFile === 'object') {
        pdfUrl = pdfFile.url || null;
      } else if (pdfFile) {
        // If it's just an ID, fetch the media document
        const mediaDoc = await payload.findByID({
          collection: "media",
          id: pdfFile,
          depth: 0,
        });
        pdfUrl = mediaDoc?.url || null;
      }
    } catch (e: any) {
      console.warn("Failed to fetch blogSettings or pdfFile for welcome email:", e.message);
    }

    // Build Welcome Email HTML content
    let emailHtml = `
      <p>Thank you for subscribing to our newsletter.</p>
      <p>We are excited to share our latest high Himalayan adventures, exclusive travel tips, and special offers with you.</p>
    `;

    if (pdfUrl) {
      emailHtml += `
        <p>As promised, here is the link to download your free travel guide:</p>
        <p style="margin: 22px 0;">
          <a href="${pdfUrl}" target="_blank" style="background-color: #c8922a; color: #1a3c2e; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">
            📥 Download Free Travel Guide (PDF)
          </a>
        </p>
        <p style="font-size: 11px; color: #6b7280; margin-top: 10px;">If the button above does not work, copy and paste this URL into your browser: <br/><a href="${pdfUrl}" style="color: #c8922a;">${pdfUrl}</a></p>
      `;
    }

    emailHtml += `
      <p>Stay tuned for our upcoming updates!</p>
      <br />
      <p>Best regards,<br/><strong>The Nature Heaven Treks Team</strong></p>
    `;

    // Send Welcome Email
    await sendEmail({
      to: email,
      subject: "Welcome to Nature Heaven Treks",
      html: getPremiumEmailTemplate(
        "Newsletter Subscription",
        "Welcome to Nature Heaven Treks!",
        emailHtml
      ),
    });

    // Notify Admin — company inbox + client Gmail, owner BCC'd.
    {
      await sendEmail({
        to: NOTIFY_TO,
        bcc: NOTIFY_BCC,
        replyTo: email,
        subject: "New Newsletter Subscriber",
        html: getPremiumEmailTemplate(
          "Newsletter Subscription",
          "New Subscriber",
          `<p>A new user has subscribed to the newsletter: <strong>${email}</strong></p>`,
          email
        ),
      });
    }

    return NextResponse.json(
      { 
        message: "Successfully subscribed to our newsletter.",
        pdfUrl: pdfUrl 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
