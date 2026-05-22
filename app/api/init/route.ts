import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("[Init API] Initializing Payload...");
  try {
    const payload = await getPayload({ config });
    console.log("[Init API] Payload initialized successfully!");
    return NextResponse.json({ 
      initialized: true,
      message: "Database schema synchronized successfully." 
    });
  } catch (err) {
    console.error("[Init API] Initialization error:", err);
    return NextResponse.json({ 
      error: err.message, 
      stack: err.stack 
    }, { status: 500 });
  }
}
