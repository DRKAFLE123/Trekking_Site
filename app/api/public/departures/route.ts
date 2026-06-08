import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { apiErrorBody } from "@/lib/api-error";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trekSlug = searchParams.get("slug");

    const payload = await getPayload({ config });

    if (!trekSlug) {
      const todayStr = new Date().toISOString().split("T")[0];
      const departuresRes = await payload.find({
        collection: "departures",
        sort: "startDate",
        depth: 2,
        limit: 15,
        where: {
          startDate: {
            greater_than_equal: todayStr,
          },
          status: {
            not_equals: 'cancelled',
          },
        },
      });
      return NextResponse.json({ departures: departuresRes.docs }, { status: 200 });
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

    // Find existing departures
    const departuresRes = await payload.find({
      collection: "departures",
      where: { trek: { equals: trek.id } },
      sort: "startDate",
      depth: 0,
      limit: 100,
    });

    let departuresList = departuresRes.docs;

    return NextResponse.json({ departures: departuresList }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      apiErrorBody(error, "Failed to fetch departures", "Departures"),
      { status: 500 },
    );
  }
}
