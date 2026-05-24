import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("[Init API] Initializing Payload...");
  try {
    const payload = await getPayload({ config });
    console.log("[Init API] Payload initialized successfully!");

    // Check if any users exist in the database
    const usersResult = await payload.find({
      collection: "users",
      limit: 1,
    });

    let seeded = false;
    let seededData: { email: string; name: string; role: string } | null = null;

    if (usersResult.totalDocs === 0) {
      console.log("[Init API] No users found. Seeding default admin user...");
      const seededUser = await payload.create({
        collection: "users",
        data: {
          email: "admin@natureheaventrek.com",
          password: "AdminPassword123!",
          name: "System Admin",
          role: "admin",
        },
      });
      seeded = true;
      seededData = {
        email: seededUser.email,
        name: seededUser.name,
        role: seededUser.role as string,
      };
      console.log("[Init API] Default admin user created successfully!");
    } else {
      console.log("[Init API] Users already exist. Skipping seed.");
    }

    return NextResponse.json({ 
      initialized: true,
      seeded,
      seededUser: seededData,
      message: seeded 
        ? "Database schema synchronized and default admin user seeded successfully." 
        : "Database schema synchronized successfully. Admin user already exists." 
    });
  } catch (err: any) {
    console.error("[Init API] Initialization error:", err);
    return NextResponse.json({ 
      error: err.message, 
      stack: err.stack 
    }, { status: 500 });
  }
}
