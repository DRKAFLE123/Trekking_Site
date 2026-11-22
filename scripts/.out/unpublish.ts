import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Unpublish posts whose URLs now 301 elsewhere (keeps the content as a draft; reversible). IDS="40,8"
(async () => {
  const p = await getPayload({ config });
  for (const id of process.env.IDS!.split(",").map(Number)) {
    await p.update({ collection: "blogPosts", id, depth: 0, overrideAccess: true, data: { _status: "draft", status: "draft" } as any });
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true })) as any;
    console.log(id, d.slug, "->", d._status);
  }
  process.exit(0);
})().catch((e) => { console.error(e.message, JSON.stringify(e.data?.errors)); process.exit(1); });
