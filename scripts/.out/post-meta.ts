import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => {
  const p = await getPayload({ config });
  const d = (await p.findByID({ collection: "blogPosts", id: Number(process.env.ID), depth: 0, overrideAccess: true })) as any;
  console.log(JSON.stringify({ title: d.title, excerpt: d.excerpt, category: d.category, cover: d.coverImage, tags: d.tags?.map((t: any) => t.tag), relatedTreks: d.relatedTreks, author: d.author, uploads: d.body.root.children.filter((n: any) => n.type === "upload").map((n: any) => n.value) }));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
