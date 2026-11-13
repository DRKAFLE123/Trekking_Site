import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => {
  const p = await getPayload({ config });
  for (const id of process.env.IDS!.split(",").map(Number)) { const m = (await p.findByID({ collection: "media", id, depth: 0, overrideAccess: true })) as any; console.log(id, "|", m.alt, "|", m.cloudinaryPublicId ?? m.publicId ?? "", "|", m.url ?? m.cloudinaryUrl ?? ""); }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
