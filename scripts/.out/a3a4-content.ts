import { getPayload } from "payload";
import config from "../../payload/payload.config";
// A3/A4 (13 Nov): post 48 becomes the one "best time to visit Nepal" page; links to retired posts 40 and 8 re-pointed. DRY=1 prints only.
const S = "https://natureheaventreks.com";
const plain = (n: any): string => n.text ?? (n.children || []).map(plain).join("");
const MAP: Record<string, string> = {
  "best-time-to-visit-nepal-season-by-season-guide": S + "/blogs/best-time-to-visit-nepal",
  "culture-festivals-himalayan-trails-nepal": S + "/travel-info/know-festival-in-nepal",
};
const relink = (n: any): number => { let c = 0; if (n.type === "link") for (const [k, v] of Object.entries(MAP)) if ((n.fields?.url || "").includes("/blogs/" + k)) { n.fields.url = v; c++; } for (const x of n.children || []) c += relink(x); return c; };
(async () => {
  const p = await getPayload({ config });
  const DRY = process.env.DRY === "1";
  // Post 48: drop the duplicate in-body H1 and the empty heading/paragraph at the end; title and SEO.
  const d = (await p.findByID({ collection: "blogPosts", id: 48, depth: 0, overrideAccess: true, draft: true })) as any;
  if (d._status !== "published") throw new Error("48 has a draft on top");
  const before = d.body.root.children.length;
  d.body.root.children = d.body.root.children.filter((n: any) => !(n.type === "heading" && n.tag === "h1") && !(n.type === "heading" && !plain(n).trim()));
  while (d.body.root.children.length && d.body.root.children.at(-1).type === "paragraph" && !plain(d.body.root.children.at(-1)).trim()) d.body.root.children.pop();
  const title = "Best Time to Visit Nepal: Month-by-Month Weather & Trekking Guide";
  const metaTitle = "Best Time to Visit Nepal: Month-by-Month Weather Guide";
  const metaDescription = "Best time to visit Nepal month by month: weather by season, the best months for each trek, Kathmandu, Pokhara and Chitwan, and how to avoid crowds.";
  console.log("48 nodes", before, "->", d.body.root.children.length, "|", metaTitle.length, metaDescription.length);
  if (!DRY) await p.update({ collection: "blogPosts", id: 48, depth: 0, overrideAccess: true, data: { _status: "published", title, body: d.body, seo: { ...(d.seo || {}), metaTitle, metaDescription } } as any });
  for (const id of [52, 56]) {
    const x = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true, draft: true })) as any;
    if (x._status !== "published") { console.log(id, "has a draft on top: skipped"); continue; }
    const c = relink(x.body.root); console.log(id, "relinked", c);
    if (c && !DRY) await p.update({ collection: "blogPosts", id, depth: 0, overrideAccess: true, data: { _status: "published", body: x.body } as any });
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
