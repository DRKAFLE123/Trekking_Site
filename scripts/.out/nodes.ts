import { getPayload } from "payload";
import config from "../../payload/payload.config";
const t = (n: any): string => n.text ?? (n.children || []).map(t).join("");
(async () => {
  const p = await getPayload({ config });
  const d = (await p.findByID({ collection: "blogPosts", id: Number(process.env.ID), depth: 0, overrideAccess: true })) as any;
  d.body.root.children.forEach((n: any, i: number) => console.log(i, n.type + (n.tag ? ":" + n.tag : ""), JSON.stringify(t(n).slice(0, 90))));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
