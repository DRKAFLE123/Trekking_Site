import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => { const p = await getPayload({ config }); const t = (await p.findByID({ collection: "treks", id: Number(process.env.ID), depth: 0, overrideAccess: true })) as any;
  const pts = (arr: any[]) => (arr || []).map((s: any) => `[${s.heading}] ` + (s.points || []).map((x: any) => x.point ?? x.text ?? x.item ?? JSON.stringify(x)).join(" / ")).join("\n");
  console.log("INCLUDED\n" + pts(t.inclusions) + "\nEXCLUDED\n" + pts(t.exclusions)); process.exit(0); })().catch((e) => { console.error(e.message); process.exit(1); });
