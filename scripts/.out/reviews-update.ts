import { getPayload } from "payload";
import config from "../../payload/payload.config";
// 22 Nov: real review data. Google 4.9 (15) from the Business Profile (Aryan's screenshot); TripAdvisor "Certificate of
// Excellence" badge removed (programme retired 2020); TAAN footer badge -> our member profile. DRY=1 prints only.
const GBP = "https://www.google.com/maps/search/?api=1&query=Nature+Heaven+Treks+and+Expedition+Thamel+Kathmandu";
(async () => {
  const p = await getPayload({ config });
  const s = (await p.find({ collection: "siteSettings", depth: 0, limit: 1, overrideAccess: true })).docs[0] as any;
  const platforms = s.reviewPlatforms.map((r: any) => {
    if (r.name === "Google Reviews") return { ...r, rating: "4.9", reviewsCount: "15 Google reviews", badgeText: null, stars: 5, url: r.url || GBP };
    if (r.name === "TripAdvisor" && r.badgeText === "Certificate of Excellence") return { ...r, badgeText: null };
    return r;
  });
  console.log(JSON.stringify(platforms.map((r: any) => [r.name, r.rating, r.reviewsCount, r.badgeText, r.url ? "url" : "-"])));
  const f = (await p.find({ collection: "footerSettings" as any, depth: 0, limit: 1, overrideAccess: true })).docs[0] as any;
  const aff = f.affiliations.map((a: any) => (a.name === "TAAN" ? { ...a, url: "https://www.taan.org.np/members/2152" } : a));
  console.log(JSON.stringify(aff.map((a: any) => [a.name, a.url])));
  if (process.env.DRY === "1") process.exit(0);
  await p.update({ collection: "siteSettings", id: s.id, depth: 0, overrideAccess: true, data: { reviewPlatforms: platforms } as any });
  await p.update({ collection: "footerSettings" as any, id: f.id, depth: 0, overrideAccess: true, data: { affiliations: aff } as any });
  console.log("saved");
  process.exit(0);
})().catch((e) => { console.error(e.message, JSON.stringify(e.data?.errors)); process.exit(1); });
