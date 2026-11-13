import { getPayload } from "payload";
import crypto from "crypto";
import config from "../../payload/payload.config";
// Add one link to post 95 after the "alternatives" list in posts 92 and 94 (published, no draft on top). DRY=1 prints only.
const S = "https://natureheaventreks.com";
const txt = (text: string) => ({ mode: "normal", text, type: "text", style: "", detail: 0, format: 0, version: 1 });
const plain = (n: any): string => n.text ?? (n.children || []).map(plain).join("");
const sentence = () => ({ type: "paragraph", direction: "ltr", format: "", indent: 0, version: 1, textFormat: 0, textStyle: "", children: [
  txt("Comparing routes for your dates? Our guide to the "),
  { id: crypto.randomBytes(12).toString("hex"), type: "link", fields: { url: S + "/blogs/best-treks-in-nepal-in-december", newTab: false, linkType: "custom" }, format: "", indent: 0, version: 3, direction: null, children: [txt("best treks in Nepal in December")] },
  txt(" compares seven routes by altitude and night temperature.") ] });
const ANCHOR: Record<number, string> = { 92: "The full trek is not the right choice", 94: "If the forecast looks bad, or you want less risk" };
(async () => {
  const p = await getPayload({ config });
  for (const [ids, start] of Object.entries(ANCHOR)) {
    const id = Number(ids);
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true, draft: true })) as any;
    if (d._status !== "published") throw new Error(`${id} has a draft on top; stop`);
    const k = d.body.root.children;
    if (JSON.stringify(k).includes("/blogs/best-treks-in-nepal-in-december")) { console.log(id, "already links to 95"); continue; }
    const i = k.findIndex((n: any) => plain(n).startsWith(start)); if (i < 0 || k[i + 1]?.type !== "list") throw new Error(`${id}: anchor/list not found`);
    k.splice(i + 2, 0, sentence());
    console.log(id, "insert after list at", i + 1, "| next:", plain(k[i + 3] || {}).slice(0, 60));
    if (process.env.DRY !== "1") await p.update({ collection: "blogPosts", id, depth: 0, overrideAccess: true, data: { _status: "published", body: d.body } as any });
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
