import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill out all required fields: Name, Email, Subject, Message." },
        { status: 400 }
      );
    }

    console.log(`[CONTACT INQUIRY RECEIVED]
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `);

    // In a real application, you would send an email or store in a DB
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
