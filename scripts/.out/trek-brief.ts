import { getPayload } from "payload";
import config from "../../payload/payload.config";
(async () => {
  const p = await getPayload({ config });
  for (const slug of process.env.SLUGS!.split(",")) {
    const t = (await p.find({ collection: "treks", where: { slug: { equals: slug } }, depth: 0, limit: 1, overrideAccess: true })).docs[0] as any;
    console.log(`\n${t.id} ${slug} | ${t.title} | ${t.duration}d | price ${t.price}/${t.discountedPrice} | max ${t.maxAltitude} | ${t.difficulty} | start ${t.startPoint} end ${t.endPoint}`);
    (t.dayByDayItinerary || []).forEach((d: any, i: number) => console.log(`  D${i + 1} ${d.title}`));
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
