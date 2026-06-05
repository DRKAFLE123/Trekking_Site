import React from "react";
import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import CmsLexicalPage from "@/components/CmsLexicalPage";
import PackingListStatic from "./PackingListStatic";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Trekking Packing List | Nature Heaven Trekking & Expedition",
  description:
    "Comprehensive packing checklist for trekking in Nepal, from base layers and footwear to permits and personal medication.",
};

async function getCmsPage() {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "pages",
      where: { slug: { equals: "packing-list" } },
      depth: 2,
      limit: 1,
      overrideAccess: true,
    });
    return res.docs[0] || null;
  } catch {
    return null;
  }
}

export default async function PackingListPage() {
  const cmsPage = await getCmsPage();
  if (cmsPage) {
    return <CmsLexicalPage page={cmsPage as any} />;
  }
  return <PackingListStatic />;
}
