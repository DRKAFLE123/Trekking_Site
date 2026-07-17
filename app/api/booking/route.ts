import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { sendEmail, getPremiumEmailTemplate, NOTIFY_TO, NOTIFY_BCC } from "@/lib/email";
import { verifyRecaptchaDetailed, recaptchaHint } from "@/lib/recaptcha";
import { apiErrorBody } from "@/lib/api-error";

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

    // Verify reCAPTCHA — surface the specific reason so failures are
    // diagnosable (missing secret on host vs expired token vs bad token).
    const recaptcha = await verifyRecaptchaDetailed(body.recaptchaToken);
    if (!recaptcha.success) {
      return NextResponse.json(
        { error: recaptchaHint(recaptcha.reason), reason: recaptcha.reason },
        { status: 400 }
      );
    }

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
          type: "booking_enquiry",
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

      // Send Emails — admin notification to company inbox + client Gmail,
      // owner BCC'd. Customer always gets their acknowledgement.
      {
        await sendEmail({
          to: NOTIFY_TO,
          bcc: NOTIFY_BCC,
          replyTo: email,
          subject: `New Trek Inquiry: ${tripTitle}`,
          html: getPremiumEmailTemplate(
            "Trek Inquiry",
            `New Inquiry for ${tripTitle}`,
            `
            <table class="data-table">
              <tbody>
                <tr><th>Name</th><td>${name}</td></tr>
                <tr><th>Email</th><td>${email}</td></tr>
                <tr><th>Travelers</th><td>${guests || 1}</td></tr>
                <tr><th>Start Date</th><td>${date || 'Flexible'}</td></tr>
              </tbody>
            </table>
            <div class="info-box">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; color: #3D3D3D;">${message || 'Standard inquiry.'}</p>
            </div>
            `,
            email
          ),
        });

        await sendEmail({
          to: email,
          subject: `Your Inquiry for ${tripTitle} - Nature Heaven Treks`,
          html: getPremiumEmailTemplate(
            "Trek Inquiry",
            `Hello ${name},`,
            `
            <p>Thank you for your interest in the <strong>${tripTitle}</strong>.</p>
            <p>We have received your inquiry and our team is reviewing your requirements. We will get back to you with a detailed response shortly.</p>
            <br />
            <p>Best regards,<br/><strong>The Nature Heaven Treks Team</strong></p>
            `
          ),
        });
      }

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
      paymentMethod: rawPaymentMethod,
      paymentId: rawPaymentId,
      passportUrl,
      paymentProofUrl,
      arrivalDate,
      addons
    } = body;

    // Optional upgrades chosen at checkout. Their cost is already inside
    // totalPrice; this is the itemised record of what the traveller actually
    // ordered so the team knows what to arrange.
    const selectedAddons: { title: string; pricePerPerson: number; total: number }[] =
      Array.isArray(addons) ? addons : [];
    const addonsSummary = selectedAddons
      .map((a) => `${a.title} ($${a.pricePerPerson}/pp = $${a.total})`)
      .join(", ");

    const paymentMethod = paymentType === "pay_later" ? null : rawPaymentMethod;
    const paymentId = paymentType === "pay_later" ? null : rawPaymentId;

    // Payment methods whose capture this server has actually verified against a
    // live gateway. Deliberately EMPTY: no gateway is wired up yet. PayPal is a
    // manual paypal.me link and bank_transfer is a manual SWIFT wire, so the
    // client telling us "I chose PayPal" is not evidence that money moved.
    //
    // Anything absent from this list stays unpaid/pending until staff verify the
    // payment proof by hand. Add a method here ONLY once its capture is
    // confirmed server-side (gateway callback/webhook), never before — otherwise
    // travellers get confirmed, paid-marked bookings for free.
    const GATEWAY_VERIFIED_METHODS: string[] = [];
    const isPaymentVerified =
      paymentType !== "pay_later" &&
      !!paymentMethod &&
      GATEWAY_VERIFIED_METHODS.includes(paymentMethod);

    // Validate checkout data
    if (!trekSlug || !startDate || !endDate || !travelers || !customerDetails || !totalPrice) {
      return NextResponse.json({ error: "Missing required checkout specifications" }, { status: 400 });
    }

    if (paymentType !== "pay_later" && !paymentMethod) {
      return NextResponse.json({ error: "Missing payment method" }, { status: 400 });
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
        paymentStatus: isPaymentVerified ? "paid" : "unpaid",
        bookingStatus: isPaymentVerified ? "confirmed" : "pending",
        adminRemarks: [
          paymentType === "pay_later"
            ? "System checkout via website (Book Now, Pay Later - 0%)"
            : `System checkout via website using ${paymentMethod?.toUpperCase()} with ${paymentType}`,
          arrivalDate ? `Arrival date: ${arrivalDate}` : null,
          addonsSummary ? `Upgrades: ${addonsSummary}` : null,
          passportUrl ? `Passport document: ${passportUrl}` : null,
          paymentProofUrl ? `Payment proof: ${paymentProofUrl}` : null,
        ].filter(Boolean).join(" | "),
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
          // Amount *due* for this booking — not amount received. Until a gateway
          // confirms capture the status below stays "pending", so this reads as
          // the outstanding balance rather than a collected payment.
          amount: paymentType === "pay_later" ? 0 : (paymentType === "advance_10" ? Math.round(totalPrice * 0.1) : totalPrice),
          method: paymentMethod,
          status: isPaymentVerified ? "success" : "pending",
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

    // Send Emails — admin notification goes to the company inbox + client
    // Gmail, with the owner BCC'd. Customer always gets their confirmation.
    {
      await sendEmail({
        to: NOTIFY_TO,
        bcc: NOTIFY_BCC,
        replyTo: customerDetails.email,
        subject: `New Booking Created: ${bookingId} for ${trek.title}`,
        html: getPremiumEmailTemplate(
          "New Trek Booking",
          `New Booking: ${bookingId}`,
          `
          <table class="data-table">
            <tbody>
              <tr><th>Trek</th><td>${trek.title}</td></tr>
              <tr><th>Customer</th><td>${customerDetails.firstName} ${customerDetails.lastName}</td></tr>
              <tr><th>Email</th><td>${customerDetails.email}</td></tr>
              <tr><th>Dates</th><td>${startDate} to ${endDate}</td></tr>
              ${arrivalDate ? `<tr><th>Arrival Date</th><td>${arrivalDate}</td></tr>` : ""}
              <tr><th>Travelers</th><td>${travelersCount}</td></tr>
              ${selectedAddons.length > 0 ? `<tr><th>Upgrades</th><td>${selectedAddons.map((a) => `${a.title} &mdash; $${a.pricePerPerson}/pp &times; ${travelersCount} = <strong>$${a.total}</strong>`).join("<br />")}</td></tr>` : ""}
              <tr><th>Payment Method</th><td>${paymentMethod}</td></tr>
              <tr><th>Total Price</th><td>$${totalPrice}</td></tr>
              ${passportUrl ? `<tr><th>Passport Document</th><td><a href="${passportUrl}" target="_blank" rel="noopener noreferrer">View / download passport</a></td></tr>` : ""}
              ${paymentProofUrl ? `<tr><th>Payment Proof</th><td><a href="${paymentProofUrl}" target="_blank" rel="noopener noreferrer">View / download payment proof</a></td></tr>` : ""}
            </tbody>
          </table>
          `,
          customerDetails.email
        ),
      });

      await sendEmail({
        to: customerDetails.email,
        subject: `Booking Confirmation: ${trek.title} - ${bookingId}`,
        html: getPremiumEmailTemplate(
          "Booking Confirmation",
          `Hello ${customerDetails.firstName},`,
          `
          <p>Thank you for booking with Nature Heaven Treks!</p>
          <p>Your booking for <strong>${trek.title}</strong> has been received.</p>
          <div class="info-box">
            <p><strong>Booking Reference:</strong> ${bookingId}</p>
            <p><strong>Dates:</strong> ${startDate} to ${endDate}</p>
            <p><strong>Travelers:</strong> ${travelersCount}</p>
            ${selectedAddons.length > 0 ? `<p><strong>Upgrades:</strong> ${selectedAddons.map((a) => `${a.title} ($${a.total})`).join(", ")}</p>` : ""}
          </div>
          <p>We will contact you shortly with further details and preparation instructions.</p>
          <br />
          <p>Best regards,<br/><strong>The Nature Heaven Treks Team</strong></p>
          `
        ),
      });
    }

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
    return NextResponse.json(apiErrorBody(error, "Failed to process booking reservation", "Booking"), { status: 500 });
  }
}
