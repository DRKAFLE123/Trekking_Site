import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Clean-up B (13 Nov): old-domain link text in posts 72, 79, 86; WhatsApp QR link in post 21 -> company number.
const fixText = (n: any): number => { let c = 0; if (n.type === "text" && n.text === "https://natureheaventrek.com/") { n.text = "natureheaventreks.com"; c++; }
  if (n.type === "link" && n.fields?.url === "https://wa.me/qr/PGHTP6DWQ362H1") { n.fields.url = "https://wa.me/9779851218358"; c++; }
  for (const k of n.children || []) c += fixText(k); return c; };
(async () => {
  const p = await getPayload({ config });
  for (const id of [72, 79, 86, 21]) {
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true, draft: true })) as any;
    if (d._status !== "published") throw new Error(`${id} has a draft on top`);
    const c = fixText(d.body.root);
    console.log(id, "fixed", c);
    if (c) await p.update({ collection: "blogPosts", id, depth: 0, overrideAccess: true, data: { _status: "published", body: d.body } as any });
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
