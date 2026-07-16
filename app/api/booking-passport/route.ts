import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { apiErrorBody } from "@/lib/api-error";

// Public endpoint used by the booking flow to upload the lead traveler's
// passport scan BEFORE the booking is created. Requiring a real document
// upload is the anti-spam gate — bots filling name/email/phone can't easily
// attach a genuine passport, so it filters out junk submissions.
//
// Accepts a single PDF / JPG / PNG up to 5 MB, stores it on Cloudinary under
// a private-ish folder, and returns the secure URL which the booking then
// records + emails to the operations team.

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    "summit-trail-trekking",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No file was uploaded." },
        { status: 400 },
      );
    }

    const blob = file as File;

    if (!ALLOWED.has(blob.type)) {
      return NextResponse.json(
        { error: "Only PDF, JPG, or PNG files are allowed." },
        { status: 400 },
      );
    }
    if (blob.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 5 MB." },
        { status: 400 },
      );
    }

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "File storage is not configured. Please contact us to book." },
        { status: 500 },
      );
    }

    const buffer = Buffer.from(await blob.arrayBuffer());
    const dataUri = `data:${blob.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "booking-passports",
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
      // Keep these out of any transformation/listing surfaces.
      type: "upload",
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      filename: blob.name,
    });
  } catch (error: any) {
    return NextResponse.json(
      apiErrorBody(error, "Failed to upload the passport file. Please try again.", "BookingPassport"),
      { status: 500 },
    );
  }
}
