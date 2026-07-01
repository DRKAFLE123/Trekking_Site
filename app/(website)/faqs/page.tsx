import React from "react";
import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import FAQsPageClient from "./FAQsPageClient";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) | Nature Heaven Trekking & Expedition",
  description: "Get answers to your questions about trekking in Nepal. Learn about visa processes, physical fitness, travel insurance, and packing lists.",
  alternates: { canonical: "/faqs" },
};

const DEFAULT_FAQS = [
  {
    category: "Basic Information",
    faqs: [
      {
        q: "What is the best time of year to trek in Nepal?",
        a: "The two prime trekking seasons are Spring (March–May) and Autumn (September–November). Both seasons offer stable weather and clear mountain views. Autumn is post-monsoon with crystal-clear skies.",
      },
      {
        q: "How physically fit do I need to be for an EBC Trek?",
        a: "The Everest Base Camp Trek is rated as moderately difficult. You should be comfortable walking 5–7 hours daily. Begin cardio training 2–3 months before departure.",
      },
      {
        q: "Do I need a guide for trekking in Nepal?",
        a: "Yes, a licensed guide is mandatory for most national parks and restricted areas. Nature Heaven provides certified native guides for all packages.",
      },
      {
        q: "What permits do I need for the Everest Base Camp Trek?",
        a: "You require two permits: (1) Sagarmatha National Park Entry Permit, and (2) Khumbu Pasang Lhamu Municipality Tourism Fee. Both are arranged by us.",
      },
    ],
  },
  {
    category: "Health Protection & Safety",
    faqs: [
      {
        q: "What is Acute Mountain Sickness (AMS) and how do you prevent it?",
        a: "AMS is a condition caused by reduced oxygen. Prevention: ascend slowly, stay hydrated, avoid alcohol, and consider preventative Diamox. Our guides carry oximeters.",
      },
      {
        q: "Is travel insurance mandatory?",
        a: "Yes — comprehensive travel insurance covering high-altitude trekking (up to 6,000m) and helicopter rescue is mandatory for all clients.",
      },
    ],
  },
  {
    category: "Trip Booking & Payment Policy",
    faqs: [
      {
        q: "What does the package price include?",
        a: "Includes: airport transfers, Lukla flights, permits, accommodation, three meals daily during trek, guide, porters, and office taxes.",
      },
      {
        q: "What is the deposit amount to book?",
        a: "We require a 10% advance deposit to confirm your booking and hold dates. Balance can be paid upon arrival in Kathmandu.",
      },
    ],
  },
];

// Helper to extract text from Lexical format
function extractLexicalText(body: any): string {
  if (!body) return "";
  if (typeof body === 'string') return body;
  
  if (body.root && body.root.children) {
    return extractNodesText(body.root.children);
  }
  
  if (Array.isArray(body)) {
    return body.map((block: any) => {
      if (block.children) {
        return extractNodesText(block.children);
      }
      return "";
    }).filter(Boolean).join(" ");
  }
  
  return "";
}

function extractNodesText(nodes: any[]): string {
  return nodes.map((node) => {
    if (node.type === 'text') {
      return node.text || "";
    }
    if (node.children) {
      return extractNodesText(node.children);
    }
    return "";
  }).join(" ");
}

export default async function FAQsPage() {
  const faqs: any[] = [];
  let treks: any[] = [];

  try {
    const payload = await getPayload({ config });
    
    // 1. Fetch standalone FAQs
    const faqsRes = await payload.find({
      collection: "faqs",
      limit: 500,
      depth: 1,
      sort: "order",
    });

    // 2. Fetch all treks
    const treksRes = await payload.find({
      collection: "treks",
      limit: 300,
      depth: 0,
    });

    treks = treksRes.docs.map((t: any) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
    }));

    // 3. Process standalone FAQs
    if (faqsRes.docs && faqsRes.docs.length > 0) {
      faqsRes.docs.forEach((doc: any) => {
        const trekIds = (doc.treks || []).map((t: any) => typeof t === 'object' ? t.id : t);
        faqs.push({
          id: doc.id || `faq-standalone-${Math.random()}`,
          q: doc.question,
          a: extractLexicalText(doc.answer),
          category: doc.category || "general",
          isFeatured: !!doc.isFeatured,
          showOnAllTreks: !!doc.showOnAllTreks,
          trekIds: trekIds,
        });
      });
    }

    // 4. Process Trek-nested FAQs
    if (treksRes.docs && treksRes.docs.length > 0) {
      treksRes.docs.forEach((trek: any) => {
        if (trek.faqs && trek.faqs.length > 0) {
          trek.faqs.forEach((faq: any, idx: number) => {
            faqs.push({
              id: `faq-nested-${trek.id}-${idx}`,
              q: faq.question,
              a: extractLexicalText(faq.answer),
              category: faq.category || "general",
              isFeatured: !!faq.isFeatured,
              showOnAllTreks: false,
              trekIds: [trek.id],
            });
          });
        }
      });
    }
  } catch (err: any) {
    console.warn("[FAQs Page] Failed to query faqs from CMS:", err.message);
  }

  // Fallback to defaults if database has no FAQs at all
  if (faqs.length === 0) {
    DEFAULT_FAQS.forEach((cat) => {
      cat.faqs.forEach((faq, i) => {
        faqs.push({
          id: `default-${cat.category}-${i}`,
          q: faq.q,
          a: faq.a,
          category: "general",
          isFeatured: false,
          showOnAllTreks: true,
          trekIds: [],
        });
      });
    });
  }

  return <FAQsPageClient faqs={faqs} treks={treks} />;
}
