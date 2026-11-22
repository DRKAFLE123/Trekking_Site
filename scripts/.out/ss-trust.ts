import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => { const p = await getPayload({ config }); const s = (await p.find({ collection: "siteSettings", depth: 0, limit: 1, overrideAccess: true })).docs[0] as any;
  const pick = Object.fromEntries(Object.entries(s).filter(([k]) => /trust|review|rating|platform|social|trip/i.test(k))); console.log(JSON.stringify(pick, null, 1).slice(0, 3000)); process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
