import { getPayload } from "payload";
import crypto from "crypto";
import config from "../../payload/payload.config";
// Step 4: Everest posts -> enquiry links. Saved as DRAFTS on top of the live posts (Aryan publishes). DRY=1 prints only.
const DRY = process.env.DRY === "1";
const S = "https://natureheaventreks.com";
const nid = () => crypto.randomBytes(12).toString("hex");
const txt = (text: string, format = 0) => ({ mode: "normal", text, type: "text", style: "", detail: 0, format, version: 1 });
const link = (path: string, text: string) => ({ id: nid(), type: "link", fields: { url: S + path, newTab: false, linkType: "custom" }, format: "", indent: 0, version: 3, direction: null, children: [txt(text)] });
const para = (...children: any[]) => ({ type: "paragraph", children, direction: "ltr", format: "", indent: 0, version: 1, textFormat: 0, textStyle: "" });
const h = (tag: string, s: string) => ({ type: "heading", tag, children: [txt(s)], direction: "ltr", format: "", indent: 0, version: 1 });
const card = (trek: number, customOneLiner: string) => ({ type: "block", fields: { id: nid(), trek, blockName: "", blockType: "trekCardBlock", customOneLiner, headline: "", buttonText: "View Trek Details" }, format: "", version: 2 });
const plain = (n: any): string => n.text ?? (n.children || []).map(plain).join("");
const EBC = 1, VIEW = 38, HELI = 24;

const jobs: Record<number, { relatedTreks: number[]; edit: (k: any[]) => void }> = {
  27: { relatedTreks: [EBC, VIEW, HELI], edit: (k) => {
    const faq = k.findIndex((n) => n.type === "heading" && /Frequently Asked/i.test(plain(n))); if (faq < 0) throw new Error("27: no FAQ");
    k.splice(faq, 0,
      h("h3", "Seeing Everest for Yourself"),
      para(txt("You don't have to climb Everest to stand beneath it. The "), link("/trips/everest-base-camp-trek", "Everest Base Camp trek"),
        txt(" takes about two weeks and reaches Kala Patthar (5,545m), the classic viewpoint for the summit Michael reached in 1999. With less time, the 7-day "),
        link("/trips/everest-view-trek", "Everest View trek"), txt(" walks to Namche Bazaar and the Everest View Hotel (3,880m), and an "),
        link("/trips/everest-base-camp-heli-tour", "Everest Base Camp helicopter tour"), txt(" flies from Kathmandu to Kala Patthar and back in a morning.")),
      card(EBC, "Walk to Everest Base Camp and Kala Patthar on a private 14-day trek."));
  } },
  21: { relatedTreks: [HELI, EBC, VIEW], edit: (k) => {
    const cards = k.map((n, i) => [n, i] as const).filter(([n]) => n.type === "block" && n.fields.blockType === "trekCardBlock");
    const a = cards.find(([n]) => n.fields.trek === EBC), b = cards.find(([n]) => n.fields.trek === 4);
    if (!a || !b) throw new Error("21: cards not found");
    k[a[1]] = card(HELI, "See Everest up close in one morning: fly from Kathmandu to Kala Patthar and back.");
    k[b[1]] = card(VIEW, "Walk to Namche Bazaar and the Everest View Hotel in 7 days, with no high passes.");
  } },
  61: { relatedTreks: [EBC, VIEW, HELI, 63], edit: () => {} },
};

(async () => {
  const p = await getPayload({ config });
  for (const [ids, job] of Object.entries(jobs)) {
    const id = Number(ids);
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true, draft: true })) as any;
    if (d._status !== "published") throw new Error(`${id} already has a draft on top; stop`);
    job.edit(d.body.root.children);
    console.log(id, "relatedTreks", JSON.stringify(d.relatedTreks), "->", JSON.stringify(job.relatedTreks), "| blocks:", d.body.root.children.filter((n: any) => n.type === "block").map((n: any) => `${n.fields.blockType}:${n.fields.trek ?? ""}`).join(" "));
    if (!DRY) await p.update({ collection: "blogPosts", id, draft: true, overrideAccess: true, depth: 0, data: { body: d.body, relatedTreks: job.relatedTreks } as any });
  }
  process.exit(0);
})().catch((e) => { console.error(e.message, JSON.stringify(e.data?.errors)); process.exit(1); });
