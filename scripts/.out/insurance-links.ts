import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Point post links at the merged insurance guide (post 54); remove post 54's link to itself. DRY=1 prints only.
const NEW = "https://natureheaventreks.com/blogs/travel-insurance-for-trekking-in-nepal";
const OLD = [/^https:\/\/natureheaventreks\.com\/travel-insurance\/?$/, /^\/travel-insurance\/?$/, /^https:\/\/natureheaventreks\.com\/travel-info\/travel-insurance\/?$/, /^\/travel-info\/travel-insurance\/?$/];
const fix = (n: any, self: boolean): number => { let c = 0; if (!n.children) return 0;
  n.children = n.children.flatMap((k: any) => { if (k.type === "link" && OLD.some((r) => r.test(k.fields?.url || ""))) { c++; if (self) return k.children; k.fields.url = NEW; return [k]; } c += fix(k, self); return [k]; });
  return c; };
(async () => {
  const p = await getPayload({ config });
  for (const id of [89, 85, 64, 59, 54]) {
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true, draft: true })) as any;
    if (d._status !== "published") { console.log(id, "has a draft on top: skipped"); continue; }
    const c = fix(d.body.root, id === 54);
    console.log(id, d.slug, "links fixed:", c);
    if (c && process.env.DRY !== "1") await p.update({ collection: "blogPosts", id, depth: 0, overrideAccess: true, data: { _status: "published", body: d.body } as any });
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
