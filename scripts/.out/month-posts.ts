import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => {
  const p = await getPayload({ config });
  const r = await p.find({ collection: "blogPosts", where: { and: [{ _status: { equals: "published" } }, { publishedAt: { greater_than_equal: "2026-10-01T00:00:00Z" } }] }, sort: "publishedAt", limit: 100, depth: 0, overrideAccess: true });
  for (const d of r.docs as any[]) console.log(d.id, d.publishedAt.slice(0, 10), "created", d.createdAt.slice(0, 10), d.slug);
  const drafts = await p.find({ collection: "blogPosts", where: { _status: { equals: "draft" } }, limit: 50, depth: 0, overrideAccess: true, draft: true });
  console.log("drafts:", drafts.docs.map((d: any) => d.id + ":" + d.slug).join(", "));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
