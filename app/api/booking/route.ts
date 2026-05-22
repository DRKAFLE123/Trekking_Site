import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload/payload.config";

// Helper to generate a random uppercase alphanumeric string
function generateBookingId(trekSlug: string): string {
  const code = trekSlug.slice(0, 3).toUpperCase();
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `STT-${code}-${randomNum}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = await getPayload({ config });

    // ----------------------------------------------------
    // INQUIRY FLOW (If travelers array is missing or empty)
    // ----------------------------------------------------
    if (!body.travelers || !Array.isArray(body.travelers) || body.travelers.length === 0) {
      const { name, email, date, guests, message, tripTitle, totalCost } = body;

      if (!name || !email || !tripTitle) {
        return NextResponse.json(
          { error: "Please fill out all required fields: Name, Email, Trip Title." },
          { status: 400 }
        );
      }

      // Find the trek to associate
      const treksRes = await payload.find({
        collection: "treks",
        where: { title: { equals: tripTitle } },
        depth: 0,
        limit: 1,
      });

      let trekId = null;
      if (treksRes.docs.length > 0) {
        trekId = treksRes.docs[0].id;
      } else {
        // Search by slug fallback
        const treksResSlug = await payload.find({
          collection: "treks",
          where: { slug: { equals: tripTitle.toLowerCase().replace(/\s+/g, "-") } },
          depth: 0,
          limit: 1,
        });
        if (treksResSlug.docs.length > 0) {
          trekId = treksResSlug.docs[0].id;
        }
      }

      if (!trekId) {
        return NextResponse.json({ error: `Trek package '${tripTitle}' not found in database.` }, { status: 404 });
      }

      // Create inquiry
      const inquiry = await payload.create({
        collection: "inquiries",
        data: {
          name,
          email,
          phone: body.phone || "",
          country: body.country || "",
          trek: trekId,
          startDate: date ? date : undefined,
          travelers: guests || 1,
          message: message || "Standard inquiry.",
          status: "new",
        },
      });

      console.log(`[INQUIRY SAVED TO DATABASE] ID: ${inquiry.id}`);

      return NextResponse.json(
        { message: "Enquiry submitted successfully.", inquiryId: inquiry.id },
        { status: 200 }
      );
    }

    // ----------------------------------------------------
    // BOOKING SYSTEM FLOW (Multi-step checkout reservation)
    // ----------------------------------------------------
    const {
      trekSlug,
      departureId,
      startDate,
      endDate,
      travelersCount,
      travelers,
      customerDetails,
      basePrice,
      discount,
      tax,
      totalPrice,
      paymentType,
      paymentMethod,
      paymentId
    } = body;

    // Validate checkout data
    if (!trekSlug || !startDate || !endDate || !travelers || !customerDetails || !totalPrice) {
      return NextResponse.json({ error: "Missing required checkout specifications" }, { status: 400 });
    }

    // Find the trek
    const trekRes = await payload.find({
      collection: "treks",
      where: { slug: { equals: trekSlug } },
      depth: 0,
      limit: 1,
    });

    const trek = trekRes.docs[0];
    if (!trek) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    // Generate Booking ID
    const bookingId = generateBookingId(trekSlug);

    // Save Booking in Database
    const booking = await payload.create({
      collection: "bookings",
      data: {
        bookingId,
        trek: trek.id,
        departure: departureId || undefined,
        startDate,
        endDate,
        travelersCount,
        travelers,
        customerDetails,
        basePrice,
        discount: discount || 0,
        tax: tax || 0,
        totalPrice,
        paymentType,
        paymentStatus: paymentMethod === "bank_transfer" ? "unpaid" : "paid",
        bookingStatus: paymentMethod === "bank_transfer" ? "pending" : "confirmed",
        adminRemarks: `System checkout via website using ${paymentMethod.toUpperCase()}`,
      },
    });

    // Write log entry in payments table
    let paymentRecord = null;
    if (paymentMethod) {
      paymentRecord = await payload.create({
        collection: "payments",
        data: {
          booking: booking.id,
          paymentId: paymentId || `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
          amount: paymentType === "advance_10" ? Math.round(totalPrice * 0.1) : totalPrice,
          method: paymentMethod,
          status: paymentMethod === "bank_transfer" ? "pending" : "success",
          transactionDetails: JSON.stringify({
            checkoutTime: new Date().toISOString(),
            paymentType,
            payerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
            payerEmail: customerDetails.email,
          }),
        },
      });
    }

    // Adjust departure seat counts if associated
    if (departureId) {
      const departure = await payload.findByID({
        collection: "departures",
        id: departureId,
        depth: 0,
      });

      if (departure) {
        const newBooked = (departure.bookedSeats || 0) + travelersCount;
        const newAvailable = Math.max(0, (departure.availableSeats || 16) - travelersCount);
        let newStatus: 'available' | 'limited' | 'sold_out' = 'available';

        if (newAvailable === 0) {
          newStatus = 'sold_out';
        } else if (newAvailable <= 4) {
          newStatus = 'limited';
        }

        await payload.update({
          collection: "departures",
          id: departureId,
          data: {
            bookedSeats: newBooked,
            availableSeats: newAvailable,
            status: newStatus,
          },
        });
      }
    }

    console.log(`[BOOKING SYSTEM SUCCESS]
      Booking ID: ${bookingId}
      Trek: ${trek.title}
      Customer: ${customerDetails.firstName} ${customerDetails.lastName}
      Payment Method: ${paymentMethod}
      Total Paid: $${paymentRecord ? paymentRecord.amount : 0} USD
    `);

    return NextResponse.json({
      success: true,
      bookingId,
      totalPrice,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      bookingRef: booking.id,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Booking API checkout error:", error);
    return NextResponse.json({ error: error.message || "Failed to process booking reservation" }, { status: 500 });
  }
}
