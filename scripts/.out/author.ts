import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => { const p = await getPayload({ config }); const a = (await p.findByID({ collection: "teamMembers", id: 38, depth: 0, overrideAccess: true })) as any; const { photo, ...r } = a; console.log(JSON.stringify(r).slice(0, 900)); process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
