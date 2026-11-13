import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => {
  const p = await getPayload({ config });
  for (const id of process.env.IDS!.split(",").map(Number)) {
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true })) as any;
    const urls: string[] = []; const w = (n: any) => { if (n.type === "link") urls.push(n.fields?.url); if (n.type === "block") urls.push("BLOCK:" + n.fields?.blockType + ":" + n.fields?.trek); (n.children || []).forEach(w); }; w(d.body.root);
    console.log(id, "relatedTreks:", JSON.stringify(d.relatedTreks), "| links:", urls.join(" "));
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
