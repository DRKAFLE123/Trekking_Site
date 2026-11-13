import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Search media by alt/filename/url regex: Q="guide|porter"
(async () => { const p = await getPayload({ config }); const r = await p.find({ collection: "media", limit: 2000, depth: 0, overrideAccess: true }); const re = new RegExp(process.env.Q!, "i");
  for (const m of r.docs as any[]) { const s = `${m.alt || ""} ${m.filename || ""} ${m.url || ""}`; if (re.test(s)) console.log(m.id, "|", (m.alt || "").slice(0, 70), "|", (m.url || "").split("/upload/")[1]); } process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
