// CMS "pages" docs whose content was merged into a better page (the old URLs 301 in next.config.mjs).
// Menus and lists link straight to the new home, and the sitemap leaves the old URL out.
export const MERGED_PAGES: Record<string, string> = {
  "travel-insurance": "/blogs/travel-insurance-for-trekking-in-nepal",
};

export const travelInfoHref = (slug: string) => MERGED_PAGES[slug] ?? `/travel-info/${slug}`;
