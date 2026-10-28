import type { Metadata } from "next";
import { cache } from "react";
import { getPayload } from "payload";
import config from "@/payload/payload.config";

// Google title/description come from the CMS; the values in page code are only a fallback for
// an empty CMS field. Sources: a page's own CMS document (companyPages / pages: seoTitle,
// seoDescription) or, for pages with no document, Site Settings → Page SEO (by path).

type Seo = { title?: string | null; description?: string | null };

const getPageSeoList = cache(async (): Promise<{ path: string; metaTitle?: string; metaDescription?: string }[]> => {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({ collection: "siteSettings", limit: 1, depth: 0, select: { pageSeo: true } as any });
    return ((res.docs[0] as any)?.pageSeo || []) as any[];
  } catch {
    return [];
  }
});

const getDocSeo = cache(async (collection: "companyPages" | "pages", slug: string): Promise<Seo> => {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, select: { seoTitle: true, seoDescription: true } as any });
    const d = res.docs[0] as any;
    return { title: d?.seoTitle, description: d?.seoDescription };
  } catch {
    return {};
  }
});

function merge(base: Metadata, seo: Seo): Metadata {
  const title = seo.title?.trim() || undefined;
  const description = seo.description?.trim() || undefined;
  if (!title && !description) return base;
  const t = title ? { absolute: title } : base.title;
  return {
    ...base,
    title: t,
    description: description ?? base.description,
    openGraph: base.openGraph ? { ...base.openGraph, ...(title && { title }), ...(description && { description }) } : base.openGraph,
    twitter: base.twitter ? { ...base.twitter, ...(title && { title }), ...(description && { description }) } : base.twitter,
  };
}

/** Metadata for a page with no CMS document of its own: Site Settings → Page SEO row for `path`. */
export async function pageSeoMetadata(path: string, base: Metadata): Promise<Metadata> {
  const row = (await getPageSeoList()).find((r) => r.path?.trim().replace(/\/$/, "") === path.replace(/\/$/, ""));
  return merge(base, { title: row?.metaTitle, description: row?.metaDescription });
}

/** Metadata for a page backed by a companyPages / pages document with seoTitle / seoDescription. */
export async function docSeoMetadata(collection: "companyPages" | "pages", slug: string, base: Metadata): Promise<Metadata> {
  return merge(base, await getDocSeo(collection, slug));
}
