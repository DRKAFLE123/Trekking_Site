import { getPayload } from "payload";
import config from "../../payload/payload.config";
// ALTS='618=text|616=text' — only for photos that have been looked at.
(async () => { const p = await getPayload({ config }); for (const pair of process.env.ALTS!.split("|")) { const [id, alt] = [pair.slice(0, pair.indexOf("=")), pair.slice(pair.indexOf("=") + 1)]; await p.update({ collection: "media", id: Number(id), data: { alt }, overrideAccess: true, depth: 0 }); console.log("alt", id, "=", alt); } process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
