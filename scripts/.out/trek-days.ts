import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => {
  const p = await getPayload({ config });
  const d = (await p.findByID({ collection: "treks", id: Number(process.env.TREK), depth: 0, overrideAccess: true })) as any;
  for (const [k, v] of Object.entries(d)) if (Array.isArray(v) && v.length) console.log(`## ${k} (${v.length}): ` + v.map((x: any) => typeof x === "object" ? (x.title ?? x.day ?? x.question ?? x.item ?? x.text ?? JSON.stringify(x).slice(0, 80)) : x).join(" | ").slice(0, 1500));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
