import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => { const p = await getPayload({ config }); for (const id of process.env.IDS!.split(",").map(Number)) { const t = (await p.findByID({ collection: "treks", id, depth: 0, overrideAccess: true })) as any; console.log(id, t.slug, t.duration, t.discountedPrice); } process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
