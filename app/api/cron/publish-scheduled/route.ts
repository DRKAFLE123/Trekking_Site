import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload/payload.config";

export const dynamic = "force-dynamic";

// Publishes blog drafts whose "Publish on" date has passed. Called hourly by
// .github/workflows/publish-scheduled.yml. Takes no input and only publishes what an
// editor already scheduled, so it is safe to leave unauthenticated and to call twice.
export async function GET() {
  const payload = await getPayload({ config });
  const now = new Date();
  const due = await payload.find({
    collection: "blogPosts",
    draft: true,
    depth: 0,
    limit: 20,
    overrideAccess: true,
    where: { scheduledPublishAt: { less_than_equal: now.toISOString() } },
  });

  const published: string[] = [];
  const failed: string[] = [];
  for (const doc of due.docs as any[]) {
    if (doc._status !== "draft") continue;
    try {
      const live = await payload
        .findByID({ collection: "blogPosts", id: doc.id, depth: 0, draft: false, overrideAccess: true })
        .catch(() => null);
      const wasLive = (live as any)?._status === "published";
      const { id, createdAt, updatedAt, ...data } = doc;
      // The whole draft is sent: a bare status change would not carry the draft's content.
      await payload.update({
        collection: "blogPosts",
        id,
        depth: 0,
        draft: false,
        overrideAccess: true,
        data: {
          ...data,
          _status: "published",
          status: "published",
          scheduledPublishAt: null,
          // A first publish is dated today; an edit to a live post keeps its original date.
          publishedAt: wasLive ? doc.publishedAt : now.toISOString(),
        },
      });
      published.push(doc.slug);
    } catch (err: any) {
      failed.push(doc.slug);
      payload.logger.error({ msg: "Scheduled publish failed", slug: doc.slug, err: err?.message });
    }
  }

  return NextResponse.json({ published, failed }, { headers: { "Cache-Control": "no-store" } });
}
