import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => { const p = await getPayload({ config }); for (const c of ["footerSettings"]) { const r = await p.find({ collection: c as any, depth: 0, limit: 1, overrideAccess: true }); const d = r.docs[0] as any; console.log(c, JSON.stringify(Object.fromEntries(Object.entries(d || {}).filter(([k]) => /assoc|affil|member/i.test(k))))); }
  const s = (await p.find({ collection: "siteSettings", depth: 0, limit: 1, overrideAccess: true })).docs[0] as any; console.log("why", JSON.stringify(Object.fromEntries(Object.entries(s).filter(([k]) => /why|feature|highlight|benefit/i.test(k)))).slice(0, 800)); process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
