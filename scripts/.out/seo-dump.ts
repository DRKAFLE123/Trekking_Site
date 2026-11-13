import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Print title + SEO fields for blog slugs / trek slugs. BLOGS="a,b" TREKS="c" node --env-file=.env seo-dump.mjs
(async () => {
  const p = await getPayload({ config });
  for (const [col, list] of [["blogPosts", process.env.BLOGS], ["treks", process.env.TREKS]] as const)
    for (const slug of (list || "").split(",").filter(Boolean)) {
      const d = (await p.find({ collection: col as any, where: { slug: { contains: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any;
      if (!d) { console.log("NOT FOUND", col, slug); continue; }
      console.log(`\n[${col} ${d.id}] ${d.slug}\n  title: ${d.title}\n  seo: ${JSON.stringify(d.seo ?? { t: d.seoTitle, d: d.seoDescription })}\n  status: ${d._status ?? "-"}`);
    }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
