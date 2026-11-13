import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Clean-up C (13 Nov): post 21 heading-like paragraphs -> h3, drop empty promo line; post 61 unlink irrelevant outbound links.
const plain = (n: any): string => n.text ?? (n.children || []).map(plain).join("");
const H = ["The Height of Mount Everest", "How tall is Mount Everest?", "What happens to air at such a high altitude?", "Why Do Helicopters Need Air to Fly?",
  "How do helicopter blades work?", "Why does thin air make it harder for helicopters to fly?", "Challenges of Flying a Helicopter on Mount Everest",
  "Less Air Makes Lifting Off Difficult", "Engines Struggle to Get Enough Power", "Strong Winds Can Push the Helicopter",
  "Has a Helicopter Ever Landed on Mount Everest?", "Yes! A Pilot Landed a Helicopter on the Top in 2005."];
const UNLINK = ["saaq.gouv.qc.ca", "quora.com"];
const unlink = (n: any): number => { let c = 0; if (!n.children) return 0;
  n.children = n.children.flatMap((k: any) => { if (k.type === "link" && UNLINK.some((u) => k.fields?.url?.includes(u))) { c++; return k.children; } c += unlink(k); return [k]; }); return c; };
(async () => {
  const p = await getPayload({ config });
  const d21 = (await p.findByID({ collection: "blogPosts", id: 21, depth: 0, overrideAccess: true, draft: true })) as any;
  if (d21._status !== "published") throw new Error("21 has a draft on top");
  let k = d21.body.root.children, n = 0;
  k = k.filter((x: any) => plain(x).trim() !== "Fly on Top of Mount Everest with Nature Heaven Treks and Expedition");
  for (let i = 0; i < k.length; i++) if (k[i].type === "paragraph" && H.includes(plain(k[i]).trim())) { k[i] = { type: "heading", tag: "h3", children: k[i].children.map((c: any) => ({ ...c, format: 0 })), direction: "ltr", format: "", indent: 0, version: 1 }; n++; }
  d21.body.root.children = k;
  console.log("21 headings", n, "of", H.length, "| nodes", k.length);
  if (n !== H.length) throw new Error("heading count mismatch; nothing written");
  const d61 = (await p.findByID({ collection: "blogPosts", id: 61, depth: 0, overrideAccess: true, draft: true })) as any;
  if (d61._status !== "published") throw new Error("61 has a draft on top");
  const u = unlink(d61.body.root); console.log("61 unlinked", u);
  if (process.env.DRY === "1") process.exit(0);
  await p.update({ collection: "blogPosts", id: 21, depth: 0, overrideAccess: true, data: { _status: "published", body: d21.body } as any });
  if (u) await p.update({ collection: "blogPosts", id: 61, depth: 0, overrideAccess: true, data: { _status: "published", body: d61.body } as any });
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
