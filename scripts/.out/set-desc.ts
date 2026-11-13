import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Set metaDescription on a DRAFT post: ID=99 DESC="..."
(async () => { const p = await getPayload({ config }); const id = Number(process.env.ID); const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, draft: true, overrideAccess: true })) as any;
  await p.update({ collection: "blogPosts", id, depth: 0, draft: true, overrideAccess: true, data: { seo: { ...(d.seo || {}), metaDescription: process.env.DESC } } as any }); console.log(id, process.env.DESC!.length); process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
