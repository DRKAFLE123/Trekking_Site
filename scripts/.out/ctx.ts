import { getPayload } from "payload";
import config from "../../payload/payload.config";
// Show nodes containing NEEDLE in posts IDS, with link URLs.
(async () => {
  const p = await getPayload({ config });
  const N = process.env.NEEDLE!;
  for (const id of process.env.IDS!.split(",").map(Number)) {
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true })) as any;
    d.body.root.children.forEach((n: any, i: number) => { const s = JSON.stringify(n); if (s.includes(N)) console.log(id, i, n.type, s.slice(Math.max(0, s.indexOf(N) - 250), s.indexOf(N) + 120)); });
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
