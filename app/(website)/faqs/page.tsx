import React from "react";
import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import FAQsPageClient from "./FAQsPageClient";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) | Nature Heaven Trekking & Expedition",
  description: "Get answers to your questions about trekking in Nepal. Learn about visa processes, physical fitness, travel insurance, and packing lists.",
};

const DEFAULT_FAQS = [
  {
    category: "Before Your Trek",
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
    category: "Health & Safety",
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
    category: "Costs & Booking",
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
  let mappedFAQs: any[] = [];

  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "faqs",
      limit: 100,
      depth: 1,
    });

    const docs = res.docs;
    if (docs && docs.length > 0) {
      // Group FAQs by category name
      const groups: Record<string, any[]> = {};
      docs.forEach((doc: any) => {
        const cat = doc.category || "General";
        if (!groups[cat]) {
          groups[cat] = [];
        }
        groups[cat].push({
          q: doc.question,
          a: extractLexicalText(doc.answer),
        });
      });

      mappedFAQs = Object.keys(groups).map(category => ({
        category,
        faqs: groups[category],
      }));
    }
  } catch (err: any) {
    console.warn("[FAQs Page] Failed to query faqs from CMS:", err.message);
  }

  // Fallback to default faqs if database has no FAQs
  const displayFAQs = mappedFAQs.length > 0 ? mappedFAQs : DEFAULT_FAQS;

  return <FAQsPageClient initialFAQs={displayFAQs} />;
}
