import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => { const p = await getPayload({ config }); const r = await p.find({ collection: "blogPosts", where: { scheduledPublishAt: { exists: true } }, draft: true, limit: 50, depth: 0, overrideAccess: true });
  for (const d of r.docs as any[]) if (d.scheduledPublishAt) console.log(d.id, d._status, d.scheduledPublishAt, d.slug, "| blocks", d.body.root.children.filter((n: any) => n.type === "block").length, "| tags", (d.tags || []).length); process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
