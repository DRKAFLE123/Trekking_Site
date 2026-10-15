const SITE_URL = "https://natureheaventreks.com";

// One JSON-LD <script>. `<` is escaped so CMS text can't close the tag.
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

// BreadcrumbList from Home through the given trail, e.g. [["Regions", "/regions"], ["Everest Region", "/regions/everest"]].
export function BreadcrumbJsonLd({ trail }: { trail: [name: string, path: string][] }) {
  const items = [["Home", "/"], ...trail].map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${SITE_URL}${path === "/" ? "" : path}`,
  }));
  return <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items }} />;
}

// Meta descriptions over ~160 chars get cut by Google; trim long CMS text at a word boundary.
export const clipDescription = (s: string, max = 158) =>
  !s || s.length <= max ? s : s.slice(0, s.lastIndexOf(" ", max - 1)).replace(/[\s,;:.–-]+$/, "") + "…";
