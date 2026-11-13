import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Print plain text of blog posts (IDS="21,44") or trek itinerary (TREK=54).
const t = (n: any): string => n.text ?? (n.children || []).map(t).join(n.type === "root" ? "\n" : "") + (["paragraph", "heading", "listitem"].includes(n.type) ? "\n" : "");
(async () => {
  const p = await getPayload({ config });
  for (const id of (process.env.IDS || "").split(",").filter(Boolean)) {
    const d = (await p.findByID({ collection: "blogPosts", id: Number(id), depth: 0, overrideAccess: true })) as any;
    console.log(`\n===== ${id} ${d.slug} (${t(d.body.root).split(/\s+/).length} words)\n${t(d.body.root)}`);
  }
  if (process.env.TREK) {
    const d = (await p.findByID({ collection: "treks", id: Number(process.env.TREK), depth: 0, overrideAccess: true })) as any;
    const { itinerary, ...rest } = d;
    console.log(Object.entries(rest).filter(([k, v]) => typeof v !== "object" || v === null).map(([k, v]) => `${k}: ${String(v).slice(0, 160)}`).join("\n"));
    (itinerary || []).forEach((x: any) => console.log(`Day ${x.day ?? ""}: ${x.title}`));
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
