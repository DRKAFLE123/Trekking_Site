import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendEmail, getPremiumEmailTemplate } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, country, startDate, travelers, trek, message, recaptchaToken } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 400 });
    }

    const payload = await getPayload({ config });
    const inquiry = await payload.create({
      collection: "inquiries",
      data: {
        name,
        email,
        phone: phone || "",
        country: country || "",
        startDate: startDate || undefined,
        travelers: travelers || 1,
        trek: trek ? (isNaN(Number(trek)) ? trek : Number(trek)) : undefined,
        message,
        status: "new",
      },
    });

    // Fetch Trek Title for the Email
    let trekTitle = "Not Specified";
    if (trek) {
      try {
        const trekDoc = await payload.findByID({
          collection: "treks",
          id: isNaN(Number(trek)) ? trek : Number(trek),
          depth: 0,
        });
        if (trekDoc) {
          trekTitle = trekDoc.title;
        }
      } catch (e) {
        console.error("Error fetching trek title:", e);
      }
    }

    // Send Emails
    const adminEmail = process.env.CONTACT_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        replyTo: email,
        subject: `New Custom Trip Plan Request from ${name}`,
        html: getPremiumEmailTemplate(
          "Custom Trip Plan Request",
          "New Trip Plan Request",
          `
          <table class="data-table">
            <tbody>
              <tr><th>Name</th><td>${name}</td></tr>
              <tr><th>Email</th><td>${email}</td></tr>
              <tr><th>Phone</th><td>${phone || 'N/A'}</td></tr>
              <tr><th>Country</th><td>${country || 'N/A'}</td></tr>
              <tr><th>Start Date</th><td>${startDate || 'Flexible'}</td></tr>
              <tr><th>Travelers</th><td>${travelers}</td></tr>
              <tr><th>Base Package</th><td>${trekTitle}</td></tr>
            </tbody>
          </table>
          <div class="info-box">
            <p><strong>Custom Requirements:</strong></p>
            <pre style="white-space: pre-wrap; font-family: inherit; margin-top: 10px; color: #3D3D3D;">${message}</pre>
          </div>
          `,
          email
        ),
      });

      await sendEmail({
        to: email,
        subject: "Your Custom Trip Plan Request - Nature Heaven Treks",
        html: getPremiumEmailTemplate(
          "Custom Trip Plan Request",
          `Hello ${name},`,
          `
          <p>Thank you for requesting a custom travel plan with Nature Heaven Treks.</p>
          <p>Our experts will carefully review your requirements and design a tailored itinerary and quotation.</p>
          <p>Expect to receive your detailed travel outline within 6 to 12 hours.</p>
          <br />
          <p>Best regards,<br/><strong>The Nature Heaven Treks Team</strong></p>
          `
        ),
      });
    }

    return NextResponse.json(
      { message: "Custom plan request submitted successfully.", inquiryId: inquiry.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Plan Trip API error:", error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
