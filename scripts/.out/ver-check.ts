import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => {
  const p = await getPayload({ config });
  for (const id of (process.env.IDS || "").split(",").map(Number)) {
    const v = await p.findVersions({ collection: "blogPosts", where: { parent: { equals: id } }, sort: "-updatedAt", limit: 3, depth: 0, overrideAccess: true });
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true, draft: true })) as any;
    console.log(id, "latest:", d._status, "| versions:", v.docs.map((x: any) => `${x.version._status}@${x.updatedAt.slice(0, 16)}${x.latest ? "*" : ""}`).join(", "));
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
