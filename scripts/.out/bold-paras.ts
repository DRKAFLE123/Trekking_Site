import { getPayload } from "payload";
import config from "../../payload/payload.config";
// List paragraphs that look like headings: all text bold, short, no final period.
const plain = (n: any): string => n.text ?? (n.children || []).map(plain).join("");
const texts = (n: any): any[] => n.type === "text" ? [n] : (n.children || []).flatMap(texts);
(async () => {
  const p = await getPayload({ config });
  for (const id of process.env.IDS!.split(",").map(Number)) {
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true })) as any;
    d.body.root.children.forEach((n: any, i: number) => { if (n.type !== "paragraph") return; const t = plain(n).trim(); const ts = texts(n).filter((x) => x.text.trim());
      if (t && t.length < 90 && !/[.:]$/.test(t) && ts.length && ts.every((x) => x.format & 1)) console.log(id, i, JSON.stringify(t)); });
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
