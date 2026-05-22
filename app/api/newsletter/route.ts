import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    console.log(`[NEWSLETTER SUBSCRIBE] Email: ${email}`);

    // In a real application, you would connect to Mailchimp, ConvertKit, Sanity, etc.
    // E.g. await client.create({ _type: 'newsletterSubscriber', email, subscribedAt: new Date().toISOString() })

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
