import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => {
  const p = await getPayload({ config });
  const d = (await p.findByID({ collection: "blogPosts", id: Number(process.env.ID), depth: 0, overrideAccess: true })) as any;
  for (const i of process.env.N!.split(",").map(Number)) console.log(i, JSON.stringify(d.body.root.children[i].children?.map((c: any) => c.type === "text" ? [c.format, c.text] : [c.type, c.fields?.url, c.children?.map((x: any) => x.text).join("")])));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
