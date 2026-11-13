import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Publish the latest draft of each post now (same logic as /api/cron/publish-scheduled). IDS="90,95" node --env-file=.env publish-now.mjs
(async () => {
  const p = await getPayload({ config });
  const now = new Date().toISOString();
  for (const id of process.env.IDS!.split(",").map(Number)) {
    const doc = (await p.findByID({ collection: "blogPosts", id, depth: 0, draft: true, overrideAccess: true })) as any;
    if (doc._status !== "draft") { console.log(id, "no draft on top, skipped"); continue; }
    const live = (await p.findByID({ collection: "blogPosts", id, depth: 0, draft: false, overrideAccess: true }).catch(() => null)) as any;
    const wasLive = live?._status === "published";
    const { id: _i, createdAt, updatedAt, ...data } = doc;
    await p.update({ collection: "blogPosts", id, depth: 0, draft: false, overrideAccess: true,
      data: { ...data, _status: "published", status: "published", scheduledPublishAt: null, publishedAt: wasLive ? doc.publishedAt : now } });
    const a = (await p.findByID({ collection: "blogPosts", id, depth: 0, draft: true, overrideAccess: true })) as any;
    console.log(id, a.slug, "->", a._status, "| publishedAt", a.publishedAt?.slice(0, 10), "| blocks", a.body.root.children.filter((n: any) => n.type === "block").length, "| relatedTreks", JSON.stringify(a.relatedTreks));
  }
  process.exit(0);
})().catch((e) => { console.error(e.message, JSON.stringify(e.data?.errors)); process.exit(1); });
