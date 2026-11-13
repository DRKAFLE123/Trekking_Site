import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => { const p = await getPayload({ config }); const s = (await p.find({ collection: "siteSettings", depth: 0, limit: 1, overrideAccess: true })).docs[0] as any;
  const walk = (o: any, path: string) => { if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) walk(v, path + "." + k); else if (typeof o === "string" && o.includes(process.env.N!)) console.log(path, "=", o.slice(0, 120)); }; walk(s, "ss"); process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
