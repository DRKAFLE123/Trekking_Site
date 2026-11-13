import { getPayload } from "payload";
import fs from "fs";
import crypto from "crypto";
import config from "../../payload/payload.config";
// Creates a blog post DRAFT in the CMS from a reviewed markdown file (seo-plan/posts/*.md).
// Reads the "CMS fields" table and the body between the H1 and "## Sources checked".
// Supports: ## / ### headings, paragraphs with **bold**, *italic* and [links](url), - and 1. lists, | tables |,
// and image placement rules given in IMAGES below. DRY=1 prints the plan without writing.
//   FILE=seo-plan/posts/x.md DRY=1 node --env-file=.env scripts/.out/md-to-draft.mjs
const DRY = process.env.DRY === "1";
const FILE = process.env.FILE!;
const S = "https://natureheaventreks.com";
const md = fs.readFileSync(FILE, "utf8").replace(/\r/g, "");

// ---- CMS fields from the review table
const field = (name: string) => (md.match(new RegExp(`^\\| ${name}[^|]*\\| (.+?) \\|$`, "m")) || [])[1]?.trim();
const title = field("Title \\(H1\\)")!, slug = field("Slug")!, metaTitle = field("SEO title")!, metaDescription = field("SEO description")!;
const category = field("Category")!, excerpt = field("Excerpt")!;
const coverId = Number((field("Cover image") || "").match(/#(\d+)/)?.[1]);
// inline images: "#605 after \"altitude profile\" table — alt \"...\"; #607 in \"hardest part\" section — alt ..."
const IMAGES = [...(field("Inline images") || "").matchAll(/#(\d+) (after|in) "([^"]+)"[^—]*— alt "([^"]+)"/g)].map((m) => ({ id: Number(m[1]), where: m[2], key: m[3].toLowerCase(), alt: m[4] }));

// ---- body
const body = md.slice(md.indexOf("\n# " + title) + 1).split("\n## Sources checked")[0].split("\n").slice(1);

const nid = () => crypto.randomBytes(12).toString("hex");
const txt = (text: string, format = 0) => ({ mode: "normal", text, type: "text", style: "", detail: 0, format, version: 1 });
const link = (url: string, children: any[]) => ({ id: nid(), type: "link", fields: { url, newTab: !url.startsWith(S), linkType: "custom" }, format: "", indent: 0, version: 3, direction: null, children });
// inline markdown: **bold**, *italic*, [text](url)
function inline(s: string): any[] {
  const out: any[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(txt(s.slice(last, m.index)));
    if (m[1]) out.push(link(m[2], inline(m[1])));
    else if (m[3]) out.push(txt(m[3], 1));
    else out.push(txt(m[4], 2));
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(txt(s.slice(last)));
  return out;
}
const para = (s: string) => ({ type: "paragraph", children: inline(s), direction: "ltr", format: "", indent: 0, version: 1, textFormat: 0, textStyle: "" });
const heading = (tag: string, s: string) => ({ type: "heading", tag, children: inline(s), direction: "ltr", format: "", indent: 0, version: 1 });
const list = (tag: "ul" | "ol", items: string[]) => ({ type: "list", tag, listType: tag === "ul" ? "bullet" : "number", start: 1, format: "", indent: 0, version: 1, direction: "ltr",
  children: items.map((it, i) => ({ type: "listitem", value: i + 1, format: "", indent: 0, version: 1, direction: "ltr", children: inline(it) })) });
const cell = (s: string, header: boolean) => ({ type: "tablecell", format: "", indent: 0, colSpan: 1, rowSpan: 1, version: 1, headerState: header ? 1 : 0, backgroundColor: null, direction: null, children: [para(s)] });
const table = (rows: string[][]) => ({ type: "table", format: "", indent: 0, version: 1, direction: null,
  children: rows.map((r, i) => ({ type: "tablerow", format: "", height: null, indent: 0, version: 1, direction: null, children: r.map((c) => cell(c, i === 0)) })) });
const upload = (id: number) => ({ id: nid(), type: "upload", value: id, fields: null, format: "", version: 3, relationTo: "media" });

const nodes: any[] = [];
let i = 0, lastH2 = "", lastTableH2 = "";
const placed = new Set<number>();
const placeAfterTable = () => { for (const im of IMAGES) if (im.where === "after" && !placed.has(im.id) && lastH2.includes(im.key)) { nodes.push(upload(im.id)); placed.add(im.id); } };
while (i < body.length) {
  const line = body[i];
  if (!line.trim() || line.trim() === "---") { i++; continue; }
  if (line.startsWith("## ")) { lastH2 = line.slice(3).toLowerCase(); nodes.push(heading("h2", line.slice(3))); i++;
    for (const im of IMAGES) if (im.where === "in" && !placed.has(im.id) && lastH2.includes(im.key)) { nodes.push(upload(im.id)); placed.add(im.id); }
    continue; }
  if (line.startsWith("### ")) { nodes.push(heading("h3", line.slice(4))); i++; continue; }
  if (line.startsWith("|")) {
    const rows: string[][] = [];
    while (i < body.length && body[i].startsWith("|")) { const cells = body[i].slice(1, -1).split("|").map((c) => c.trim()); if (!cells.every((c) => /^-+$/.test(c))) rows.push(cells); i++; }
    if (rows[0].every((c) => !c)) rows.shift(); // "| | |" header row = no header
    nodes.push(table(rows)); placeAfterTable(); continue;
  }
  if (/^- /.test(line) || /^\d+\. /.test(line)) {
    const ol = /^\d+\. /.test(line); const items: string[] = [];
    while (i < body.length && (/^- /.test(body[i]) || /^\d+\. /.test(body[i]) || /^ {2,}\S/.test(body[i]))) {
      if (/^ {2,}\S/.test(body[i])) items[items.length - 1] += " " + body[i].trim(); else items.push(body[i].replace(/^(- |\d+\. )/, ""));
      i++;
    }
    nodes.push(list(ol ? "ol" : "ul", items)); continue;
  }
  // paragraph: join wrapped lines
  const buf: string[] = [];
  while (i < body.length && body[i].trim() && !/^(#|\||- |\d+\. |---)/.test(body[i])) { buf.push(body[i].trim()); i++; }
  nodes.push(para(buf.join(" ")));
}
const root = { root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr", children: nodes } };
const words = nodes.length ? JSON.stringify(root).match(/"text":"([^"]*)"/g)!.map((m) => m.length).reduce((a, b) => a + b, 0) : 0;
console.log(`title: ${title}\nslug: ${slug}\nseo: ${metaTitle} (${metaTitle.length}) | ${metaDescription} (${metaDescription.length})\ncategory: ${category} | cover: #${coverId} | inline images placed: ${[...placed].join(", ")} of ${IMAGES.map((x) => x.id).join(", ")}`);
const count: Record<string, number> = {}; const w = (x: any) => { count[x.type] = (count[x.type] || 0) + 1; (x.children || []).forEach(w); }; w(root.root);
console.log("nodes:", JSON.stringify(count));
const missing = IMAGES.filter((im) => !placed.has(im.id)); if (missing.length) console.log("WARNING images not placed:", missing.map((m) => m.key).join("; "));

(async () => {
  const payload = await getPayload({ config });
  const exists = await payload.find({ collection: "blogPosts", where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true, draft: true });
  if (exists.docs.length) {
    const ex = exists.docs[0] as any;
    if (process.env.UPDATE === String(ex.id) && (ex._status === "draft" || process.env.ON_TOP === "1")) { // refresh a DRAFT, or ON_TOP=1: save a draft on top of a live post
      if (!DRY) await payload.update({ collection: "blogPosts", id: ex.id, depth: 0, draft: true, overrideAccess: true,
        data: { title, body: root, excerpt, coverImage: coverId, seo: { ...(ex.seo || {}), metaTitle, metaDescription, metaImage: coverId } } as any });
      console.log(`${DRY ? "DRY would update" : "UPDATED"} draft id ${ex.id}`); process.exit(0);
    }
    console.log("ALREADY EXISTS id", ex.id, "- not creating twice (set UPDATE=<id> to refresh a draft)"); process.exit(0);
  }
  for (const im of IMAGES) { // set alt text on library images used inline (only if currently a trek-name alt)
    const m = (await payload.findByID({ collection: "media", id: im.id, depth: 0, overrideAccess: true })) as any;
    console.log(`media #${im.id} alt: "${m.alt}" -> "${im.alt}"`);
    if (!DRY) await payload.update({ collection: "media", id: im.id, data: { alt: im.alt }, overrideAccess: true, depth: 0 });
  }
  if (DRY) { console.log("DRY: nothing written"); process.exit(0); }
  const doc = (await payload.create({ collection: "blogPosts", overrideAccess: true, depth: 0, draft: true, data: {
    title, slug, body: root, excerpt, category, coverImage: coverId, author: 38, status: "draft", _status: "draft",
    seo: { metaTitle, metaDescription, metaImage: coverId },
  } as any })) as any;
  console.log(`CREATED draft id ${doc.id} _status=${doc._status} → admin: ${S}/admin/collections/blogPosts/${doc.id}`);
  process.exit(0);
})().catch((e) => { console.error(e.message, JSON.stringify(e.data?.errors)); process.exit(1); });
