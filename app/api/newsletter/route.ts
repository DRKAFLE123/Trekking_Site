import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendEmail, getPremiumEmailTemplate } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, recaptchaToken } = body;

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
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

    console.log(`[NEWSLETTER SUBSCRIBE] Email: ${email}`);

    // Send Welcome Email
    await sendEmail({
      to: email,
      subject: "Welcome to Nature Heaven Treks",
      html: getPremiumEmailTemplate(
        "Newsletter Subscription",
        "Welcome to Nature Heaven Treks!",
        `
        <p>Thank you for subscribing to our newsletter.</p>
        <p>We are excited to share our latest high Himalayan adventures, exclusive travel tips, and special offers with you.</p>
        <p>Stay tuned for our upcoming updates!</p>
        <br />
        <p>Best regards,<br/><strong>The Nature Heaven Treks Team</strong></p>
        `
      ),
    });

    // Notify Admin
    const adminEmail = process.env.CONTACT_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
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
      { message: "Successfully subscribed to our newsletter." },
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
