import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => {
  const p = await getPayload({ config });
  for (const id of process.env.IDS!.split(",").map(Number)) {
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true })) as any;
    d.body.root.children.forEach((n: any, i: number) => n.type === "block" && console.log(id, i, JSON.stringify(n.fields).slice(0, 300)));
  }
  for (const s of ["everest-base-camp-heli-tour", "everest-view-trek", "everest-base-camp-trek"]) {
    const t = (await p.find({ collection: "treks", where: { slug: { equals: s } }, depth: 0, limit: 1, overrideAccess: true })).docs[0] as any;
    console.log("trek", s, "id", t?.id, "price", t?.price, t?.discountedPrice, "days", t?.duration);
  }
  for (const id of [4, 63]) { const t = (await p.findByID({ collection: "treks", id, depth: 0, overrideAccess: true })) as any; console.log("trek", id, t.slug); }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
