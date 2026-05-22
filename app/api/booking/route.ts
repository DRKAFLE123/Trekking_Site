import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, date, guests, message, tripTitle, totalCost } = body;

    // Validate inputs
    if (!name || !email || !date || !guests || !tripTitle) {
      return NextResponse.json(
        { error: "Please fill out all required fields: Name, Email, Date, Guests." },
        { status: 400 }
      );
    }

    if (guests < 1) {
      return NextResponse.json(
        { error: "Number of guests must be at least 1." },
        { status: 400 }
      );
    }

    console.log(`[BOOKING ENQUIRY RECEIVED]
      Trip: ${tripTitle}
      Name: ${name}
      Email: ${email}
      Start Date: ${date}
      Guests: ${guests}
      Est. Cost: $${totalCost} USD
      Custom Message: ${message || "None"}
    `);

    // In a real application, you would send an email via SendGrid, saving to Database or Sanity, etc.
    // e.g. client.create({ _type: 'bookingEnquiry', name, email, date, guests, tripTitle, message })

    return NextResponse.json(
      { message: "Enquiry submitted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
