// Compare the full SEO head of two origins on every page type, so a change can't silently remove tags.
//   node scripts/.out/head-diff.mjs http://localhost:3124 https://natureheaventreks.com
//   node scripts/.out/head-diff.mjs --save snap.json https://natureheaventreks.com    (baseline)
//   node scripts/.out/head-diff.mjs https://natureheaventreks.com file:snap.json      (compare to baseline)
import fs from "fs";
const SAVE = process.argv[2] === "--save" ? process.argv[3] : null;
const [A, B] = SAVE ? [process.argv[4], process.argv[4]] : process.argv.slice(2);
const PATHS = ["/", "/trips", "/blogs", "/faqs", "/gallery", "/video-gallery", "/about-us", "/why-us", "/our-team", "/csr", "/legal-documents", "/privacy-policy", "/terms-and-condition", "/plan-a-trip", "/b2b-partners", "/private-treks", "/packing-list", "/blogs/travel-insurance-for-trekking-in-nepal", "/visa-info", "/upcoming-departures", "/contact-us", "/countries", "/countries/nepal", "/regions", "/regions/everest", "/trips/poon-hill-trek", "/blogs/rhododendron-forest-nepal", "/blogs/mardi-himal-trek-cost", "/travel-info/trekking-permits-and-fees"];
const dec = (s) => (s || "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const attr = (t, n) => (t.match(new RegExp(`\\b${n}="([^"]*)"`)) || [])[1];
const head = async (origin, p) => {
  if (origin.startsWith("file:")) return JSON.parse(fs.readFileSync(origin.slice(5), "utf8"))[p];
  const r = await fetch(`${origin}${p}?x=${Date.now()}`, { redirect: "manual" });
  const h = await r.text(); const m = { status: String(r.status), title: dec((h.match(/<title>([^<]*)/) || [])[1]) };
  for (const [t] of h.matchAll(/<meta\b[^>]*>/g)) { const k = attr(t, "property") || attr(t, "name"); if (k && /^(description|robots|og:|twitter:|article:)/.test(k)) { const key = m[k] ? k + "+" : k; m[key] = dec(attr(t, "content")); } }
  m.canonical = attr((h.match(/<link[^>]*rel="canonical"[^>]*>/) || [""])[0], "href") || "";
  m.h1 = String((h.match(/<h1\b/g) || []).length);
  m.jsonld = [...new Set([...h.matchAll(/"@type":"([A-Za-z]+)"/g)].map((x) => x[1]))].sort().join(",");
  m.icons = [...h.matchAll(/<link[^>]*rel="[^"]*icon[^"]*"[^>]*>/g)].map((x) => attr(x[0], "href")).join(",");
  return m;
};
const norm = (v, o) => (v || "").split(o).join("").replace(/\?[^ ]*$/, "");
if (SAVE) { const o = {}; for (const p of PATHS) o[p] = await head(A, p); fs.writeFileSync(SAVE, JSON.stringify(o, null, 1)); console.log("saved", Object.keys(o).length, "pages; og counts:", Object.entries(o).map(([k, v]) => k + "=" + Object.keys(v).filter((x) => x.startsWith("og:")).length).join(" ")); process.exit(0); }
let lost = 0, gained = 0, changed = 0;
for (const p of PATHS) {
  let a, b; try { a = await head(A, p); b = await head(B, p); } catch (e) { console.log("ERR", p, e.message); continue; }
  const out = [];
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (k === "jsonld" || k === "icons") { if (a[k] !== b[k]) out.push(`  ${k}: new[${a[k]}] live[${b[k]}]`); continue; }
    const na = norm(a[k], A), nb = norm(b[k], B).replace("https://natureheaventreks.com", "");
    const n2 = na.replace("https://natureheaventreks.com", "");
    if (n2 === nb) continue;
    if (a[k] === undefined) { lost++; out.push(`  LOST ${k}: ${nb.slice(0, 70)}`); }
    else if (b[k] === undefined) { gained++; out.push(`  gained ${k}`); }
    else { changed++; out.push(`  CHANGED ${k}: new[${n2.slice(0, 60)}] live[${nb.slice(0, 60)}]`); }
  }
  const og = Object.keys(a).filter((k) => k.startsWith("og:")).length;
  console.log(`${p}  status ${a.status}/${b.status}  og:${og} h1:${a.h1} ${out.length ? "\n" + out.join("\n") : "(same)"}`);
}
console.log(`\nSUMMARY pages ${PATHS.length} | LOST ${lost} | gained ${gained} | changed ${changed}`);
