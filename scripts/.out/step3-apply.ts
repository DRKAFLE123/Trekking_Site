import { getPayload } from "payload";
import crypto from "crypto";
import config from "../../payload/payload.config";
// Step 3 (approved 13 Nov): titles/descriptions for trek 54, posts 21 and 44 + body fixes. DRY=1 prints only.
const DRY = process.env.DRY === "1";
const S = "https://natureheaventreks.com";
const nid = () => crypto.randomBytes(12).toString("hex");
const txt = (text: string, format = 0) => ({ mode: "normal", text, type: "text", style: "", detail: 0, format, version: 1 });
const link = (url: string, text: string) => ({ id: nid(), type: "link", fields: { url, newTab: !url.startsWith(S), linkType: "custom" }, format: "", indent: 0, version: 3, direction: null, children: [txt(text)] });
const para = (...children: any[]) => ({ type: "paragraph", children, direction: "ltr", format: "", indent: 0, version: 1, textFormat: 0, textStyle: "" });
const h = (tag: string, s: string) => ({ type: "heading", tag, children: [txt(s)], direction: "ltr", format: "", indent: 0, version: 1 });
const cell = (s: any[], header: boolean) => ({ type: "tablecell", format: "", indent: 0, colSpan: 1, rowSpan: 1, version: 1, headerState: header ? 1 : 0, backgroundColor: null, direction: null, children: [para(...s)] });
const table = (rows: any[][][]) => ({ type: "table", format: "", indent: 0, version: 1, direction: null, children: rows.map((r, i) => ({ type: "tablerow", format: "", height: null, indent: 0, version: 1, direction: null, children: r.map((c) => cell(c, i === 0)) })) });
const plain = (n: any): string => n.text ?? (n.children || []).map(plain).join("");
const at = (kids: any[], start: string) => { const i = kids.findIndex((n) => plain(n).trim().startsWith(start)); if (i < 0) throw new Error("not found: " + start); return i; };
const ONK = "https://english.onlinekhabar.com/?p=596492";

function edit21(k: any[]) {
  k[at(k, "On May 14, 2005, a French pilot")] = para(txt("On May 14, 2005, a French pilot named Didier Delsalle flew a special helicopter all the way to the summit of Mount Everest. He stayed at the very top for a few minutes before flying back down, and he landed there again the next day. He is still the only pilot to have landed a helicopter on Everest's summit."));
  const ti = at(k, "The Everest Base Camp Helicopter Tour"); const tour = k[ti];
  k[ti] = para(txt("The highest helicopter landing ever made is on Everest's summit itself: 8,848m (29,029ft), by Didier Delsalle in 2005. The absolute altitude record is higher still: on 21 June 1972, French pilot Jean Boulet flew an Aérospatiale SA 315B Lama to 12,442m (40,820ft). Rescue and tour helicopters in Nepal normally work far lower, usually below about 6,000 to 7,000m."));
  k[at(k, "Without insurance, the cost")] = para(txt("A shared seat on an Everest Base Camp helicopter tour from Kathmandu usually costs about US$1,000 to US$1,500 per person, while chartering the whole helicopter usually starts at around US$4,500. The price depends on your starting point and the size of your group. Helicopter rescues are also common in the Everest region, especially among trekkers and climbers heading for peaks like Lobuche and Mera Peak."));
  k.splice(at(k, "A shared seat on an Everest") + 1, 0, h("h3", "Can you take a helicopter tour to Everest?"), tour);
  const dup = k.findIndex((n) => plain(n) === " Fly on Top of Mount Everest with Nature Heaven Treks and Expedition"); if (dup < 0) throw new Error("dup heading"); k.splice(dup, 1);
  k[at(k, "Nature Heaven Trek and Expedition Nepal is renowned")] = para(txt("Nature Heaven Treks & Expedition is renowned for its exceptional service and meticulous attention to detail. We guide trekkers on unforgettable adventures through the majestic peaks and gentle hills of the Himalayas."));
  const about = k[at(k, "About Nature Heaven Trek and Expedition")]; about.children[0].children[0].text = "About Nature Heaven Treks & Expedition";
  for (const s of ["Email: info@natureheaventrek.com", "Website: https://natureheaventrek.com/"]) k.splice(at(k, s), 1);
}

function edit44(k: any[]) {
  k[0].children[0].text = k[0].children[0].text.replace("Hundreds of lives have been lost, and search-and-rescue operations are still ongoing.", "Hundreds of lives were lost.");
  k.splice(1, 0,
    h("h2", "Latest status (13 November 2026)"),
    para(txt("Most of Nepal was never affected, and the two trekking regions that were hit have reopened with new access arrangements:")),
    table([
      [[txt("Area")], [txt("Status")], [txt("Source")]],
      [[txt("Kathmandu, Pokhara, Chitwan")], [txt("Not affected by the flood; operating normally.")], [txt("Nepal Tourism Board, Aug 2026")]],
      [[txt("Everest and Annapurna regions")], [txt("No flood closures reported.")], [txt("TAAN status notice, Aug 2026")]],
      [[txt("Langtang Valley and Gosaikunda")], [txt("Open. Treks start from Dhunche or Thulo Syabru, because the road and bridge at Syabrubesi were damaged.")], [link(ONK, "TAAN advisory, reported 23 Oct"), txt("; Onlinekhabar, 29 Oct")]],
      [[txt("Manaslu Circuit")], [txt("Reopened from Machha Khola after partial repairs, with a short bypass near Yaru Bagar. TAAN advises care.")], [txt("TAAN advisory, 23 Oct")]],
      [[txt("Tsum Valley")], [txt("Closed on 23 Oct after a bridge collapse; reopening was expected within about a week. Check before booking.")], [txt("TAAN advisory, 23 Oct")]],
    ]),
    para(txt("Separately, Cyclone Arnab led the authorities to pause high-altitude trekking from 29 to 31 October; that pause has ended. For December plans, see our "), link(S + "/blogs/best-treks-in-nepal-in-december", "best treks in Nepal in December"), txt(".")),
  );
  k[at(k, "The one region that does need real caution is Langtang")] = para(
    txt("Langtang was the trekking region hit hardest, because its usual gateway, Syabrubesi in Rasuwa district, sits in the flood zone. The trail above Syabrubesi survived. In late October, TAAN declared the "), link(S + "/regions/langtang", "Langtang region"),
    txt(", Kyanjin and Gosaikunda open again: treks now drive via Trishuli and Betrawati to Dhunche or Thulo Syabru, then walk through Bamboo and Lama Hotel to Kyanjin. The Syabrubesi road was still being repaired in early November, so confirm the start point and lodges with your agency."));
  k.splice(at(k, "Langtang was the trekking region hit hardest") + 1, 0, para(txt("Manaslu had its own flood damage along the Budhi Gandaki in September and October, which closed parts of the trail. TAAN's 23 October advisory says the Manaslu Circuit to Larke Pass has reopened after partial repairs, starting from Machha Khola via Jagat, and advises trekkers to take care. Tsum Valley was still closed at that date.")));
  const c = k[at(k, "If you're visiting an unaffected tourist area")]; c.children[1].text = " (Kathmandu, Pokhara, Chitwan, Everest, Annapurna), there's currently no flood-specific reason to cancel. Just keep checking conditions as your departure date approaches.";
  k[at(k, "Nepal floods 2026 travel safety depends heavily")] = para(txt("Nepal floods 2026 travel safety depends heavily on where you are traveling. The worst-hit area, the Bhote Koshi and Trishuli river corridor in Rasuwa, Nuwakot and Dhading, still needs care while repairs continue. Kathmandu, Pokhara, Chitwan and the Everest and Annapurna trekking regions were not affected, and Langtang and Manaslu reopened in October 2026 on adjusted routes. Wherever you go, monitor weather, transport and official updates before and during your trip."));
  k[at(k, "Most of the country is safe and operating normally")] = para(txt("Yes, for most of the country. Kathmandu, Pokhara, Chitwan, Everest and Annapurna were not affected. The Bhote Koshi/Trishuli corridor in Rasuwa, Nuwakot and Dhading is still under repair, so check road status before travelling there."));
  k[at(k, "Are Nepal's trekking routes open after the floods?")] = para(txt("Are Nepal's trekking routes open after the floods?", 1), txt(" Yes. Everest and Annapurna were never affected. Langtang and Gosaikunda reopened in late October via Dhunche or Thulo Syabru, and the Manaslu Circuit reopened after partial repairs. Tsum Valley was still closed on 23 October."));
  k[at(k, "For most regions, yes")] = para(txt("For most regions, yes. Check route-specific conditions with your guide, as you would for any Himalayan trek. For Langtang and Manaslu, ask about the current start point and which lodges are open before you book."));
  k[at(k, "Only if your itinerary runs directly")] = para(txt("Only if your plans depend on Syabrubesi, the Trishuli road corridor or Tsum Valley. Langtang and Manaslu treks now run on adjusted routes. For everywhere else, monitor conditions but proceed as planned."));
}

(async () => {
  const p = await getPayload({ config });
  const jobs: [number, (k: any[]) => void, string, string][] = [
    [21, edit21, "Can a Helicopter Fly to the Top of Mount Everest? Yes, Once", "Only one pilot has landed a helicopter on Everest's summit: Didier Delsalle, in May 2005. Why it is so hard, how high rescues reach, and Everest heli tours."],
    [44, edit44, "Is Nepal Safe to Visit After the 2026 Floods? Nov Update", "Kathmandu, Pokhara, Everest and Annapurna were not affected. Langtang and Manaslu reopened in October 2026. The latest status by region, and what to check."],
  ];
  for (const [id, fn, metaTitle, metaDescription] of jobs) {
    const d = (await p.findByID({ collection: "blogPosts", id, depth: 0, overrideAccess: true, draft: true })) as any;
    if (d._status !== "published") throw new Error(`${id} has a newer draft; stop`);
    const before = d.body.root.children.length; fn(d.body.root.children);
    console.log(`${id}: nodes ${before} -> ${d.body.root.children.length} | ${metaTitle} (${metaTitle.length}) | desc ${metaDescription.length}`);
    if (DRY) { d.body.root.children.forEach((n: any, i: number) => { const t = plain(n); if (/Delsalle|shared seat|Boulet|helicopter tour to|About Nature|Latest status|Langtang was|Manaslu had|Tsum|reopened|natureheaventrek\.com|gmail/.test(t)) console.log("  ", i, t.slice(0, 140)); }); continue; }
    await p.update({ collection: "blogPosts", id, overrideAccess: true, depth: 0, data: { _status: "published", body: d.body, seo: { ...(d.seo || {}), metaTitle, metaDescription } } as any });
  }
  const t1 = "Bhutan & Nepal Itinerary 14 Days: Tiger's Nest to Pokhara", t2 = "A 14-day private tour: 5 days in Kathmandu and Pokhara, then 9 in Bhutan (Thimphu, Punakha, Paro) with the Tiger's Nest hike. Day-by-day plan and price.";
  console.log(`trek 54: ${t1} (${t1.length}) | desc ${t2.length}`);
  if (!DRY) await p.update({ collection: "treks", id: 54, overrideAccess: true, depth: 0, data: { metaTitle: t1, metaDescription: t2 } as any });
  process.exit(0);
})().catch((e) => { console.error(e.message, JSON.stringify(e.data?.errors)); process.exit(1); });
