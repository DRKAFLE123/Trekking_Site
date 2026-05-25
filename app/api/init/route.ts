import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("[Init API] Initializing Payload...");
  const env = process.env as any;
  const envKey = "NODE_ENV";
  const originalNodeEnv = env[envKey];
  try {
    // Temporarily set NODE_ENV to development so Drizzle adapter runs pushDevSchema
    env[envKey] = "development";
    const payload = await getPayload({ config });
    // Restore original NODE_ENV immediately after initialization
    env[envKey] = originalNodeEnv;
    console.log("[Init API] Payload initialized successfully!");

    // Check if the specific admin user exists
    const usersResult = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: "admin@natureheaventrek.com",
        },
      },
    });

    const seeded = true;
    let seededData: { email: string; name: string; role: string } | null = null;

    if (usersResult.totalDocs === 0) {
      console.log("[Init API] Admin user not found. Creating default admin...");
      const seededUser = await payload.create({
        collection: "users",
        data: {
          email: "admin@natureheaventrek.com",
          password: "AdminPassword123!",
          name: "System Admin",
          role: "admin",
        },
      });
      seededData = {
        email: seededUser.email,
        name: seededUser.name,
        role: seededUser.role as string,
      };
      console.log("[Init API] Default admin user created successfully!");
    } else {
      console.log("[Init API] Admin user exists. Forcing password reset...");
      const updatedUser = await payload.update({
        collection: "users",
        id: usersResult.docs[0].id,
        data: {
          password: "AdminPassword123!",
        },
      });
      seededData = {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role as string,
      };
      console.log("[Init API] Admin password reset successfully!");
    }

    return NextResponse.json({ 
      initialized: true,
      seeded,
      seededUser: seededData,
      message: "Database schema synchronized and admin password forcefully reset to AdminPassword123!" 
    });
  } catch (err: any) {
    // Restore original NODE_ENV in case of error
    const env = process.env as any;
    const envKey = "NODE_ENV";
    env[envKey] = originalNodeEnv;
    console.error("[Init API] Initialization error:", err);
    return NextResponse.json({ 
      error: err.message, 
      stack: err.stack 
    }, { status: 500 });
  }
}
