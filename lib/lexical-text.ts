/**
 * Flatten Payload Lexical rich text (or a legacy plain string) into an array
 * of paragraphs. Lists become "• item" lines; headings become their own
 * paragraph. Used where markup can't be rendered, e.g. the PDF brochure.
 */
export function lexicalToParagraphs(body: any): string[] {
  if (!body) return [];
  if (typeof body === "string") return body.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);

  const out: string[] = [];
  const text = (node: any): string =>
    !node
      ? ""
      : node.type === "text"
      ? node.text || ""
      : node.type === "linebreak"
      ? "\n"
      : Array.isArray(node.children)
      ? node.children.map(text).join("")
      : "";

  const walk = (node: any) => {
    if (!node) return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (node.root) return walk(node.root.children);
    switch (node.type) {
      case "paragraph":
      case "heading":
      case "quote": {
        const t = text(node).trim();
        if (t) out.push(t);
        return;
      }
      case "list":
        (node.children || []).forEach((li: any) => {
          const t = text(li).trim();
          if (t) out.push(`• ${t}`);
        });
        return;
      default:
        if (Array.isArray(node.children)) walk(node.children);
    }
  };
  walk(body);
  return out;
}
