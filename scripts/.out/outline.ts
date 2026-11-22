import { getPayload } from "payload";
import config from "../../payload/payload.config";
const plain = (n: any): string => n.text ?? (n.children || []).map(plain).join("");
(async () => { const p = await getPayload({ config }); for (const slug of process.env.SLUGS!.split(",")) { const d = (await p.find({ collection: "blogPosts", where: { slug: { equals: slug } }, depth: 0, limit: 1, overrideAccess: true })).docs[0] as any;
  const k = d.body.root.children; console.log(`\n== ${d.id} ${slug} | ${plain(d.body.root).split(/\s+/).length} words | pub ${d.publishedAt?.slice(0,10)} | ${d.seo?.metaTitle}`); k.filter((n: any) => n.type === "heading").forEach((n: any) => console.log("  ", n.tag, plain(n).slice(0, 80))); if (process.env.FULL) console.log(plain(d.body.root).slice(0, 1500)); } process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
