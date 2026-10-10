/**
 * Step 4: copy the best old natureheaventrek.com articles into the CMS (blogPosts), same slugs.
 *
 *   npx esbuild scripts/migrate-old-blogs.ts --bundle --platform=node --format=esm --packages=external --outfile=scripts/.out/migrate-old-blogs.mjs
 *   node --env-file=.env scripts/.out/migrate-old-blogs.mjs <wordpress-export.xml> [--dry] [--only=slug]
 *
 * - WP HTML -> Lexical (same node shapes the admin editor writes), junk stripped (contact blocks, shortcodes, duplicate title)
 * - links to the old domain rewritten through seo-proposal/redirect-map.csv (410 targets unlinked)
 * - a few contextual internal links, 2-3 trek cards, the standard CTA banner, relatedTreks
 * - images: original file from the old site -> WebP (max 1600px, q78) -> media library; reused when already there;
 *   articles with fewer than 3 images are topped up from the existing library
 * Re-runnable: existing posts (by slug) are updated, uploaded images are cached in scripts/.out/migrate-media-cache.json.
 */
import { getPayload } from "payload";
import config from "../payload/payload.config";
import { Window } from "happy-dom";
import sharp from "sharp";
import fs from "fs";
import crypto from "crypto";
import parseWp from "./.out/redir/wp.js";

const XML = process.argv[2];
const DRY = process.argv.includes("--dry");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").slice(7);
const SITE = "https://natureheaventreks.com";
const AUTHOR = 38; // Krishna Ghimire, author of every current post
const CACHE_FILE = "scripts/.out/migrate-media-cache.json";
const CTA = { headline: "Want to Plan Your Holiday in Nepal?", buttonText: "Make Inquiry Now", whatsappNumber: "+977-9851218358" };

const MIGRATE = fs.readFileSync("seo-proposal/redirect-map.csv", "utf8").trim().split("\n").slice(1)
  .map((l) => l.split(",")).filter((c) => c[2] === "MIGRATE").map((c) => c[0].slice(1));
const REDIRECTS: Record<string, [string, string]> = {};
for (const l of fs.readFileSync("seo-proposal/redirect-map.csv", "utf8").trim().split("\n").slice(1)) {
  const [from, to, action] = l.split(",");
  REDIRECTS[from] = [to, action];
}

// phrase -> internal URL (first match per article only, max LINKS_PER_POST)
const LINKS: [RegExp, string][] = [
  [/\bEverest Base Camp Trek\b/i, "/trips/everest-base-camp-trek"],
  [/\bEverest Three Passes\b|\bThree Passes Trek\b/i, "/trips/everest-three-passes-trek"],
  [/\bGokyo (Lakes?|Valley|Ri) Trek\b/i, "/trips/gokyo-ri-trek"],
  [/\bAnnapurna Base Camp Trek\b/i, "/trips/annapurna-base-camp-trek"],
  [/\bAnnapurna Circuit Trek\b/i, "/trips/annapurna-circuit-trek"],
  [/\bTilicho Lake\b/i, "/trips/annapurna-circuit-trek-with-tilicho-lake"],
  [/\bManaslu Circuit Trek\b/i, "/trips/manaslu-circuit-trek"],
  [/\bTsum Valley Trek\b/i, "/trips/tsum-valley-trek"],
  [/\bLangtang Valley Trek\b/i, "/trips/langtang-valley-trek"],
  [/\bGosaikunda\b/i, "/trips/gosainkunda-trek"],
  [/\bPoon Hill\b/i, "/trips/poon-hill-trek"],
  [/\bMardi Himal\b/i, "/trips/mardi-himal-trek"],
  [/\bIsland Peak\b/i, "/trips/island-peak-climbing"],
  [/\bMera Peak\b/i, "/trips/mera-peak-climbing"],
  [/\bLobuche East\b/i, "/trips/lobuche-east-peak-climbing"],
  [/\bUpper Mustang\b/i, "/trips/upper-mustang-trek"],
  [/\bNar Phu\b/i, "/trips/nar-phu-valley-trek"],
  [/\bKanchenjunga Base Camp\b/i, "/trips/kangchenjunga-base-camp-trek"],
  [/\bMakalu Base Camp\b/i, "/trips/makalu-base-camp-trek"],
  [/\bAma Dablam\b/i, "/trips/ama-dablam-expedition"],
  [/\bMount Kailash\b|\bKailash\b/i, "/trips/kailash-and-lake-mansarovar-yatra"],
  [/\bChitwan National Park\b/i, "/trips/chitwan-national-park"],
  [/\baltitude sickness\b/i, "/blogs/how-to-prevent-altitude-sickness-while-trekking-in-nepal"],
  [/\bacclimati[sz]ation\b/i, "/travel-info/altitude-acclimatization"],
  [/\btravel insurance\b/i, "/blogs/travel-insurance-for-trekking-in-nepal"],
  [/\btrekking permits?\b/i, "/travel-info/trekking-permits-and-fees"],
  [/\bpacking list\b/i, "/packing-list"],
  [/\bEverest region\b/i, "/regions/everest"],
  [/\bAnnapurna region\b/i, "/regions/annapurna"],
  [/\bLangtang region\b/i, "/regions/langtang"],
  [/\bManaslu region\b/i, "/regions/manaslu"],
  [/\bpeak climbing\b/i, "/regions/peak-climbing-in-nepal"],
  [/\bprivate treks?\b/i, "/private-treks"],
];
const LINKS_PER_POST = 6;

// trek-card candidates: phrase -> trek slug
const CARDS: [RegExp, string][] = [
  [/Everest Base Camp|\bEBC\b|Kala Patthar|Gorak Shep/gi, "everest-base-camp-trek"],
  [/Three Passes|Kongma La|Renjo La/gi, "everest-three-passes-trek"],
  [/Gokyo|Cho La/gi, "gokyo-ri-trek"],
  [/Island Peak/gi, "island-peak-climbing-ebc-trek"],
  [/Mera Peak/gi, "mera-peak-climbing"],
  [/Lobuche/gi, "lobuche-east-peak-climbing"],
  [/Ama Dablam/gi, "ama-dablam-expedition"],
  [/Everest Expedition|summit Everest|climb(ing)? (Mount )?Everest/gi, "everest-expedition"],
  [/Annapurna Base Camp|\bABC\b/gi, "annapurna-base-camp-trek"],
  [/Annapurna Circuit|Thorong La/gi, "annapurna-circuit-trek"],
  [/Tilicho/gi, "annapurna-circuit-trek-with-tilicho-lake"],
  [/Poon Hill|Ghorepani|Rhododendron/gi, "poon-hill-trek"],
  [/Mardi Himal/gi, "mardi-himal-trek"],
  [/Manaslu|Larkya/gi, "manaslu-circuit-trek"],
  [/Tsum/gi, "tsum-valley-trek"],
  [/Langtang|Kyanjin/gi, "langtang-valley-trek"],
  [/Gosaikunda/gi, "langtang-valley-with-gosaikunda-trek"],
  [/Upper Mustang|Lo Manthang/gi, "upper-mustang-trek"],
  [/Tibet|Lhasa/gi, "tibet-everest-base-camp-tour"],
  [/Kailash/gi, "kailash-and-lake-mansarovar-yatra"],
  [/Kathmandu|Bhaktapur|Patan|temple|stupa/gi, "kathmandu-valley-world-heritage-sites-tour"],
  [/bungee|bungy/gi, "pokhara-bungee-jumping"],
];

const CATEGORY_TRAVEL = /clothing|culture|souvenir|prayer|temple|rhododendron|flora|monaster|tibet|bungee/;

// ---------- helpers ----------
const lid = () => crypto.randomBytes(12).toString("hex");
const text = (t: string, format = 0) => ({ mode: "normal", text: t, type: "text", style: "", detail: 0, format, version: 1 });
const para = (children: any[]) => ({ type: "paragraph", format: "", indent: 0, version: 1, children, direction: null, textStyle: "", textFormat: 0 });
const heading = (tag: string, t: string) => ({ tag, type: "heading", format: "", indent: 0, version: 1, children: [text(t)], direction: null });
const link = (url: string, children: any[]) => ({ id: lid(), type: "link", fields: { url, newTab: !url.startsWith(SITE), linkType: "custom" }, format: "", indent: 0, version: 3, children, direction: null });
const upload = (id: number) => ({ id: lid(), type: "upload", value: id, fields: null, format: "", version: 3, relationTo: "media" });
const block = (fields: any) => ({ type: "block", fields: { id: lid(), blockName: "", ...fields }, format: "", version: 2 });
const clean = (s: string) => s.replace(/ /g, " ").replace(/\s+/g, " ");
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const fileKey = (u: string) => norm(decodeURIComponent(u.split("/").pop()!.replace(/\.[a-z0-9]+$/i, "").replace(/-\d+x\d+$/, "").replace(/-scaled$/, "")));
const humanize = (u: string) => decodeURIComponent(u.split("/").pop()!.replace(/\.[a-z0-9]+$/i, "").replace(/-\d+x\d+$/, "").replace(/-scaled$/, ""))
  .replace(/[-_]+/g, " ").replace(/\b\d+$/, "").replace(/\s+/g, " ").trim();

function rewriteHref(href: string): string | null {
  const m = href.match(/^https?:\/\/(www\.)?natureheaventrek\.com(\/[^?#]*)?/i);
  if (!m) return /^(https?:|mailto:)/i.test(href) && !/wa\.me|whatsapp/i.test(href) ? href : null;
  let p = (m[2] || "/").replace(/\/$/, "") || "/";
  if (p.startsWith("/wp-content/")) return null;
  const r = REDIRECTS[p];
  if (!r || r[1] === "410") return null;
  return SITE + (r[0] === "/" ? "" : r[0]);
}

// ---------- HTML -> Lexical ----------
function inline(node: any, format = 0, out: any[] = []): any[] {
  for (const n of node.childNodes) {
    if (n.nodeType === 3) {
      const t = clean(n.textContent || "");
      if (t) out.push(text(t, format));
    } else if (n.nodeType === 1) {
      const tag = n.tagName.toLowerCase();
      if (tag === "br") out.push({ type: "linebreak", version: 1 });
      else if (tag === "strong" || tag === "b") inline(n, format | 1, out);
      else if (tag === "em" || tag === "i") inline(n, format | 2, out);
      else if (tag === "u") inline(n, format | 8, out);
      else if (tag === "a") {
        const href = rewriteHref(n.getAttribute("href") || "");
        const kids = inline(n, format);
        if (href && kids.length) out.push(link(href, kids));
        else out.push(...kids);
      } else if (tag !== "img" && tag !== "script" && tag !== "style") inline(n, format, out);
    }
  }
  return out;
}
const trimInline = (kids: any[]) => {
  while (kids[0]?.type === "linebreak") kids.shift();
  while (kids[kids.length - 1]?.type === "linebreak") kids.pop();
  if (kids[0]?.type === "text") kids[0].text = kids[0].text.replace(/^\s+/, "");
  const last = kids[kids.length - 1];
  if (last?.type === "text") last.text = last.text.replace(/\s+$/, "");
  return kids.filter((k) => k.type !== "text" || k.text);
};

const JUNK = /call\s*\/\s*whatsapp|whatsapp\s*:|^\s*e-?mail\s*:|^\s*address\s*:|^\s*website\s*:|pakjonal|info@natureheaventrek|natureheaventrek@gmail|^\s*(phone|mobile)\s*:/i;

type Img = { src: string; alt: string };
function htmlToBlocks(html: string, title: string) {
  const win = new Window();
  const doc = win.document;
  html = html
    .replace(/<!--[^]*?-->/g, "")
    .replace(/\[caption[^\]]*\]([^]*?)\[\/caption\]/g, (_, inner) => (inner.match(/<img[^>]*>/) || [""])[0])
    .replace(/\[\/?[a-z_]+[^\]]*\]/g, "");
  doc.body.innerHTML = html;
  const out: any[] = [];
  const imgs: Img[] = [];
  const pushImg = (el: any) => {
    const src = el.getAttribute("src") || "";
    if (!/wp-content\/uploads/.test(src)) return;
    imgs.push({ src, alt: clean(el.getAttribute("alt") || "") });
    out.push({ __img: imgs.length - 1 });
  };
  const walk = (parent: any) => {
    for (const n of parent.childNodes) {
      if (n.nodeType === 3) {
        const t = clean(n.textContent || "").trim();
        if (t) out.push(para([text(t)]));
        continue;
      }
      if (n.nodeType !== 1) continue;
      const tag = n.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) {
        const t = clean(n.textContent || "").trim().replace(/:$/, "");
        if (t) out.push({ __h: Number(tag[1]), t });
        n.querySelectorAll("img").forEach(pushImg);
      } else if (tag === "p") {
        n.querySelectorAll("img").forEach(pushImg);
        const kids = trimInline(inline(n));
        const plain = kids.map((k: any) => k.text || (k.children || []).map((c: any) => c.text).join("")).join("");
        if (!kids.length || !plain.trim() || JUNK.test(plain)) continue;
        const lead = kids[0];
        if (lead.type === "text" && lead.format & 1 && kids.length > 1 && lead.text.trim().length < 100 && (/[?:]$|^\d+\.\s/.test(lead.text.trim()) || (/\S$/.test(lead.text) && kids[1]?.type === "text" && /^[A-Z]/.test(kids[1].text)))) {
          out.push({ __h: 99, t: lead.text.trim().replace(/:$/, "") }); // sub-heading, resolved below
          const rest = trimInline(kids.slice(1));
          if (rest.length) out.push(para(rest));
        } else out.push(para(kids));
      } else if (tag === "img") pushImg(n);
      else if (tag === "ul" || tag === "ol") out.push(list(n));
      else if (tag === "blockquote") {
        const kids = trimInline(inline(n));
        if (kids.length) out.push({ type: "quote", format: "", indent: 0, version: 1, children: kids, direction: null });
      } else if (tag === "table") out.push(table(n));
      else if (tag === "figure" || tag === "div" || tag === "section" || tag === "span" || tag === "center") walk(n);
    }
  };
  walk(doc.body);
  win.close();

  // drop a leading heading that repeats the title
  const firstH = out.findIndex((b) => b.__h);
  if (firstH >= 0 && firstH < 3 && norm(out[firstH].t).slice(0, 25) === norm(title).slice(0, 25)) out.splice(firstH, 1);
  // heading hierarchy: top level used in the article becomes h2
  const levels = out.filter((b) => b.__h && b.__h !== 99).map((b) => b.__h);
  const cnt: Record<number, number> = {};
  levels.forEach((l) => (cnt[l] = (cnt[l] || 0) + 1));
  const top = Math.min(...levels.filter((l) => cnt[l] >= 2), 99) === 99 ? Math.min(...levels) : Math.min(...levels.filter((l) => cnt[l] >= 2));
  // lone headings above the main level at the very start are title/intro labels: drop them
  for (let i = 0; i < Math.min(out.length, 4); i++) if (out[i]?.__h && out[i].__h !== 99 && out[i].__h < top) { out.splice(i, 1); i--; }
  out.forEach((b) => { if (b.__h && b.__h !== 99 && b.__h < top) b.__h = top; });
  const shift = levels.length ? top - 2 : 0;
  let current = 2;
  const blocks = out.map((b) => {
    if (!b.__h) return b;
    const lvl = b.__h === 99 ? current + 1 : Math.min(6, Math.max(2, b.__h - shift));
    if (b.__h !== 99) current = lvl;
    return heading("h" + Math.min(6, lvl), b.t);
  });
  // drop empty sections: a heading directly followed by a same-or-higher heading
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i], n = blocks[i + 1];
    if (b.type === "heading" && (!n || (n.type === "heading" && Number(n.tag[1]) <= Number(b.tag[1])))) blocks.splice(i, 1);
  }
  // no skipped levels (h2 -> h4 becomes h2 -> h3)
  let prev = 1;
  for (const b of blocks) if (b.type === "heading") { const l = Math.min(Number(b.tag[1]), prev + 1); b.tag = "h" + l; prev = l; }
  return { blocks, imgs };
}

function list(el: any): any {
  const ordered = el.tagName.toLowerCase() === "ol";
  const items: any[] = [];
  let i = 1;
  for (const li of el.children) {
    if (li.tagName.toLowerCase() !== "li") continue;
    const nested = [...li.children].filter((c: any) => /^(ul|ol)$/i.test(c.tagName));
    nested.forEach((c: any) => c.remove());
    const kids = trimInline(inline(li));
    if (kids.length) items.push({ type: "listitem", value: i++, format: "", indent: 0, version: 1, children: kids, direction: null });
    for (const c of nested) items.push({ type: "listitem", value: i++, format: "", indent: 0, version: 1, children: [list(c)], direction: null });
  }
  return { tag: ordered ? "ol" : "ul", type: "list", start: 1, format: "", indent: 0, version: 1, children: items, listType: ordered ? "number" : "bullet", direction: null };
}

function table(el: any): any {
  const rows: any[] = [];
  el.querySelectorAll("tr").forEach((tr: any, ri: number) => {
    const cells: any[] = [];
    tr.querySelectorAll("th,td").forEach((td: any) => {
      const head = td.tagName.toLowerCase() === "th" || (ri === 0 && !!el.querySelector("thead"));
      const kids = trimInline(inline(td));
      cells.push({ type: "tablecell", format: "", indent: 0, version: 1, headerState: head ? 1 : 0, colSpan: 1, rowSpan: 1, backgroundColor: null, children: [para(kids.length ? kids : [text("")])], direction: null });
    });
    if (cells.length) rows.push({ type: "tablerow", format: "", indent: 0, version: 1, height: null, children: cells, direction: null });
  });
  return { type: "table", format: "", indent: 0, version: 1, children: rows, direction: null };
}

// contextual internal links: wrap first occurrence in plain paragraph text
function addLinks(blocks: any[], selfSlug: string) {
  const used = new Set<string>();
  blocks.forEach((b) => b.type === "paragraph" && b.children.forEach((c: any) => c.type === "link" && used.add(c.fields.url)));
  let added = 0;
  for (const [re, path] of LINKS) {
    if (added >= LINKS_PER_POST) break;
    const url = SITE + path;
    if (used.has(url) || path.endsWith("/" + selfSlug)) continue;
    outer: for (const b of blocks) {
      if (b.type !== "paragraph") continue;
      for (let i = 0; i < b.children.length; i++) {
        const c = b.children[i];
        if (c.type !== "text") continue;
        const m = c.text.match(re);
        if (!m) continue;
        const at = m.index!;
        const parts = [
          at ? text(c.text.slice(0, at), c.format) : null,
          link(url, [text(m[0], c.format)]),
          at + m[0].length < c.text.length ? text(c.text.slice(at + m[0].length), c.format) : null,
        ].filter(Boolean);
        b.children.splice(i, 1, ...parts);
        used.add(url);
        added++;
        break outer;
      }
    }
  }
  return added;
}

// ---------- images ----------
const cache: Record<string, number> = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) : {};
async function fetchOriginal(src: string): Promise<Buffer | null> {
  const https = src.replace(/^http:/, "https:");
  const candidates = [https.replace(/-\d+x\d+(\.[a-z]+)$/i, "$1"), https];
  for (const u of candidates) {
    try {
      const r = await fetch(u);
      if (r.ok && /image/.test(r.headers.get("content-type") || "")) return Buffer.from(await r.arrayBuffer());
    } catch {}
  }
  return null;
}

let payload: any;
let library: any[] = [];
const libByKey: Record<string, any> = {};
const stats = { uploaded: 0, reused: 0, failed: 0, savedKB: 0 };

async function mediaFor(src: string, alt: string, category: string): Promise<number | null> {
  const key = fileKey(src);
  if (cache[key]) { stats.reused++; return cache[key]; }
  if (libByKey[key]) { stats.reused++; return (cache[key] = libByKey[key].id); }
  if (DRY) return -1;
  const buf = await fetchOriginal(src);
  if (!buf) { stats.failed++; console.warn("  image not found:", src); return null; }
  const webp = await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
  const name = humanize(src).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) + ".webp";
  const doc = await payload.create({
    collection: "media",
    data: { alt: alt.slice(0, 180), category },
    file: { data: webp, mimetype: "image/webp", name, size: webp.length },
    overrideAccess: true,
  });
  stats.uploaded++;
  stats.savedKB += Math.round((buf.length - webp.length) / 1024);
  cache[key] = doc.id;
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1));
  return doc.id;
}

// pick library photos for an article by topic words in alt/filename
function libraryPicks(topicWords: string[], exclude: Set<number>, n: number) {
  const scored = library
    .filter((m) => /image\/(jpeg|png|webp)/.test(m.mimeType || "") && !exclude.has(m.id) && ["gallery_photos", "trek_covers"].includes(m.category))
    .map((m) => {
      const hay = ((m.alt || "") + " " + (m.filename || "")).toLowerCase();
      return { m, s: topicWords.reduce((s, w) => s + (hay.includes(w) ? 1 : 0), 0) };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, n).map((x) => x.m);
}

// ---------- main ----------
(async () => {
  const wp = parseWp(XML);
  payload = await getPayload({ config });
  library = (await payload.find({ collection: "media", limit: 5000, depth: 0, overrideAccess: true })).docs;
  for (const m of library) if (m.filename) libByKey[fileKey(m.filename)] = m;
  const treks = (await payload.find({ collection: "treks", limit: 500, depth: 0, overrideAccess: true })).docs;
  const trekBySlug: Record<string, any> = Object.fromEntries(treks.map((t: any) => [t.slug, t]));

  const report: any[] = [];
  for (const slug of MIGRATE) {
    if (ONLY && slug !== ONLY) continue;
    const p = wp.posts[slug];
    if (!p) { console.warn("NOT IN XML", slug); continue; }
    const title = clean(p.title).replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "’").replace(/&quot;/g, '"').trim();
    const { blocks, imgs } = htmlToBlocks(p.html, title);
    const plain = blocks.map((b: any) => JSON.stringify(b)).join(" ");

    // images in body
    const usedMedia = new Set<number>();
    const seenKeys = new Set<string>();
    const body: any[] = [];
    for (const b of blocks) {
      if (b.__img === undefined) { body.push(b); continue; }
      const im = imgs[b.__img];
      const key = fileKey(im.src);
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      const alt = !im.alt || norm(im.alt) === norm(title) ? humanize(im.src) : im.alt;
      const id = await mediaFor(im.src, alt, "uncategorized");
      if (id) { body.push(upload(id)); usedMedia.add(id); }
    }

    // cover: featured image, else first body image, else best library match
    const EXTRA_TOPIC: Record<string, string[]> = { "bungee-jumping-in-nepal": ["pokhara", "bungee", "kusma", "adventure"], "nepal-souvenirs": ["kathmandu", "thamel", "bhaktapur", "patan", "durbar"] };
    const topic = (EXTRA_TOPIC[slug] || []).concat(title.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3 && !["nepal", "trek", "what", "with", "need", "does", "best", "time", "your", "from"].includes(w)));
    let cover: number | null = null;
    const thumbUrl = wp.att[p.meta._thumbnail_id];
    if (thumbUrl) cover = await mediaFor(thumbUrl, title, "blog_covers");
    if (!cover) cover = body.find((b) => b.type === "upload")?.value ?? null;
    if (!cover) cover = libraryPicks(topic, usedMedia, 1)[0]?.id ?? null;

    const dup = body.findIndex((b) => b.type === "upload" && b.value === cover);
    if (dup >= 0 && dup < 3) body.splice(dup, 1);

    // top up to 3 body images from the existing library, placed before headings that have no image nearby
    const have = body.filter((b) => b.type === "upload").length;
    if (have < 3) {
      const picks = libraryPicks(topic, new Set([...usedMedia, cover || 0]), 3 - have);
      let h2s = body.map((b, i) => (b.type === "heading" && b.tag === "h2" ? i : -1)).filter((i) => i > 0);
      if (h2s.length < 3) h2s = body.map((b, i) => (b.type === "heading" ? i : -1)).filter((i) => i > 0);
      const slots = h2s.filter((i) => body[i - 1]?.type !== "upload" && body[i + 1]?.type !== "upload");
      picks.forEach((m, k) => {
        const at = slots[Math.floor(((k + 1) * slots.length) / (picks.length + 1))];
        if (at !== undefined) { body.splice(at + 1 + k, 0, upload(m.id)); usedMedia.add(m.id); }
      });
    }

    const linksAdded = addLinks(body, slug);

    // trek cards
    const GENERIC = new Set(["tibet-everest-base-camp-tour", "kathmandu-valley-world-heritage-sites-tour", "everest-base-camp-trek"]);
    const scores = CARDS.map(([re, s]) => {
      const inTitle = new RegExp(re.source, "i").test(title);
      return { s, n: (plain.match(re) || []).length + (inTitle ? 100 : 0), inTitle };
    }).filter((x) => trekBySlug[x.s] && (x.inTitle || x.n >= (GENERIC.has(x.s) ? 6 : 3)));
    const seen = new Set<string>();
    const picks = scores.sort((a, b) => b.n - a.n).filter((x) => !seen.has(x.s) && seen.add(x.s)).slice(0, plain.length > 40000 ? 3 : 2);
    if (!picks.length) picks.push({ s: CATEGORY_TRAVEL.test(slug) ? "kathmandu-valley-world-heritage-sites-tour" : "everest-base-camp-trek", n: 0, inTitle: false });
    const h2At = body.map((b, i) => (b.type === "heading" ? i : -1)).filter((i) => i > 0);
    picks.forEach((x, k) => {
      const at = h2At[Math.min(h2At.length - 1, Math.floor(((k + 1) * h2At.length) / (picks.length + 1)))] ?? body.length;
      const t = trekBySlug[x.s];
      body.splice(at + k, 0, block({ blockType: "trekCardBlock", trek: t.id, customOneLiner: t.title.replace(/\s*[-–]\s*\d+\s*Days?$/i, "") }));
    });

    // CTA before the FAQ section, else at the end
    const faq = body.findIndex((b) => b.type === "heading" && /faq|frequently asked/i.test(b.children[0].text));
    body.splice(faq > 0 ? faq : body.length, 0, block({ blockType: "ctaBlock", ...CTA }));

    const metaTitle = clean((p.meta.rank_math_title || title).replace(/%[a-z_]+%/g, "").trim()) || title;
    const firstPara = body.find((b) => b.type === "paragraph")?.children.map((c: any) => c.text || c.children?.map((x: any) => x.text).join("")).join("") || "";
    let desc = clean((p.meta.rank_math_description || "").replace(/%[a-z_]+%/g, "")).trim();
    if (desc.length < 80) desc = firstPara;
    desc = desc.length > 160 ? desc.slice(0, 157).replace(/\s+\S*$/, "") + "..." : desc;

    const data: any = {
      title, slug,
      body: { root: { type: "root", format: "", indent: 0, version: 1, children: body, direction: null } },
      excerpt: desc,
      seo: { metaTitle: metaTitle.length > 65 ? title : metaTitle, metaDescription: desc, metaImage: cover },
      coverImage: cover,
      status: "published", _status: "published",
      publishedAt: new Date(p.date.replace(" ", "T") + "Z").toISOString(),
      author: AUTHOR,
      category: CATEGORY_TRAVEL.test(slug) ? "Travel Info" : "Trekking",
      tags: [...new Set([...(p.tags || []), p.meta.rank_math_focus_keyword].filter(Boolean).map((t: string) => clean(t).trim()))].slice(0, 6).map((tag) => ({ tag })),
      relatedTreks: picks.map((x) => trekBySlug[x.s].id),
    };

    const row = { slug, title, images: body.filter((b) => b.type === "upload").length, cards: picks.map((x) => x.s).join("+"), links: linksAdded, headings: body.filter((b) => b.type === "heading").length, cover: !!cover };
    report.push(row);
    console.log(JSON.stringify(row));
    if (DRY) { fs.writeFileSync(`scripts/.out/dry-${slug}.json`, JSON.stringify(data, null, 1)); continue; }
    if (!cover) { console.warn("  SKIP (no cover image)", slug); continue; }

    const existing = await payload.find({ collection: "blogPosts", where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true, draft: true });
    if (existing.docs[0]) await payload.update({ collection: "blogPosts", id: existing.docs[0].id, data, overrideAccess: true, draft: false });
    else await payload.create({ collection: "blogPosts", data, overrideAccess: true, draft: false });
  }
  fs.writeFileSync("scripts/.out/migrate-report.json", JSON.stringify({ stats, report }, null, 1));
  console.log("IMAGES", stats);
  process.exit(0);
})().catch((e) => { console.error("FAIL", e); process.exit(1); });
