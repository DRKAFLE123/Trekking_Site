import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendEmail, getPremiumEmailTemplate } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, recaptchaToken } = body;

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill out all required fields: Name, Email, Subject, Message." },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Save to Payload Database
    const payload = await getPayload({ config });
    const inquiry = await payload.create({
      collection: "inquiries",
      data: {
        name,
        email,
        message: `[Subject: ${subject}]\n\n${message}`,
        status: "new",
      },
    });

    console.log(`[CONTACT INQUIRY SAVED TO DB] ID: ${inquiry.id}`);

    // Send Emails
    const adminEmail = process.env.CONTACT_EMAIL;
    if (adminEmail) {
      // Admin Notification
      await sendEmail({
        to: adminEmail,
        replyTo: email,
        subject: `New Contact Message from ${name}: ${subject}`,
        html: getPremiumEmailTemplate(
          "General Contact Inquiry",
          "New Contact Inquiry",
          `
          <table class="data-table">
            <tbody>
              <tr><th>Name</th><td>${name}</td></tr>
              <tr><th>Email</th><td>${email}</td></tr>
              <tr><th>Subject</th><td>${subject}</td></tr>
            </tbody>
          </table>
          <div class="info-box">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          `,
          email
        ),
      });

      // Customer Auto-reply
      await sendEmail({
        to: email,
        subject: "We have received your message - Nature Heaven Treks",
        html: getPremiumEmailTemplate(
          "General Contact Inquiry",
          `Hello ${name},`,
          `
          <p>Thank you for contacting Nature Heaven Treks.</p>
          <p>We have successfully received your message regarding "<strong>${subject}</strong>".</p>
          <p>One of our team members will review your message and get back to you within 6 to 12 hours.</p>
          <br />
          <p>Best regards,<br/><strong>The Nature Heaven Treks Team</strong></p>
          `
        ),
      });
    }

    return NextResponse.json(
      { message: "Contact message submitted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your message." },
      { status: 500 }
    );
  }
}
