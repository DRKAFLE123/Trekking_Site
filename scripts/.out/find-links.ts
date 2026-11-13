import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Find CMS documents whose JSON mentions any of NEEDLES (comma list).
(async () => {
  const p = await getPayload({ config });
  const needles = process.env.NEEDLES!.split(",");
  for (const col of ["blogPosts", "treks", "travelInfo", "pages", "regions", "siteSettings"]) {
    let r: any; try { r = await p.find({ collection: col as any, limit: 1000, depth: 0, overrideAccess: true }); } catch { continue; }
    for (const d of r.docs) { const s = JSON.stringify(d); const hits = needles.filter((n) => s.includes(n)); if (hits.length) console.log(col, d.id, d.slug ?? "", "->", hits.map((h) => `${h} x${s.split(h).length - 1}`).join(", ")); }
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
