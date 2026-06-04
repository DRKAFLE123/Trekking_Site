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
  let mappedFAQs: any[] = [];

  try {
    const payload = await getPayload({ config });
    
    // 1. Fetch standalone FAQs
    const faqsRes = await payload.find({
      collection: "faqs",
      limit: 150,
      depth: 1,
      sort: "order",
    });

    // 2. Fetch all treks to get trek-nested FAQs
    const treksRes = await payload.find({
      collection: "treks",
      limit: 150,
      depth: 1,
    });

    const groups: Record<string, any[]> = {};

    // 3. Process standalone FAQs
    const FAQ_CATEGORY_LABELS: Record<string, string> = {
      general: 'Basic Information',
      prep_fitness: 'Physical Readiness & Training',
      permits: 'Entry permit',
      insurance_visa: 'Assurance and Travel permit',
      guides_staff: 'Himalayan Guide & Support Team',
      accommodation_facilities: 'Where You Stay & What’s Included',
      food_drinks: 'Meals and Refreshments',
      weather_seasons: 'Weather Patterns & Seasonal Changes',
      health_safety: 'Health Protection & Safety',
      packing_gear: 'Equipment & Packing List',
      booking_payments: 'Trip Booking & Payment Policy',
      transportation_flights: 'Flights & Ground Transport',
      'everest': 'Everest Region',
      'annapurna': 'Annapurna Region',
      'manaslu': 'Manaslu Region',
      'langtang': 'Langtang Region',
      'ganesh-himal': 'Ganesh Himal Region',
      'mustang': 'Mustang Region',
      'kanchenjunga': 'Kanchenjunga Region',
      'makalu': 'Makalu Region',
      'dolpa': 'Dolpa Region',
      'tour-in-nepal': 'Tour in Nepal',
      'expedition-in-nepal': 'Expedition in Nepal',
      'peak-climbing-in-nepal': 'Peak Climbing in Nepal',
      'jungle-safari-in-nepal': 'Jungle Safari in Nepal',
      'river-rafting-in-nepal': 'River Rafting in Nepal',
      'bungee-jumping-in-nepal': 'Bungee Jumping in Nepal',
      'paragliding-in-nepal': 'Paragliding in Nepal',
    };

    if (faqsRes.docs && faqsRes.docs.length > 0) {
      faqsRes.docs.forEach((doc: any) => {
        const catKey = doc.category || "general";
        const catLabel = FAQ_CATEGORY_LABELS[catKey] || catKey;
        if (!groups[catLabel]) {
          groups[catLabel] = [];
        }
        groups[catLabel].push({
          q: doc.question,
          a: extractLexicalText(doc.answer),
        });
      });
    }

    // 4. Process Trek-nested FAQs
    if (treksRes.docs && treksRes.docs.length > 0) {
      treksRes.docs.forEach((trek: any) => {
        if (trek.faqs && trek.faqs.length > 0) {
          // Get the region name as the category label
          let regLabel = "General Trek Info";
          if (trek.region) {
            if (typeof trek.region === 'object') {
              regLabel = trek.region.name || "General Trek Info";
            } else {
              regLabel = String(trek.region);
            }
          }

          // Format category label
          if (FAQ_CATEGORY_LABELS[regLabel.toLowerCase()]) {
            regLabel = FAQ_CATEGORY_LABELS[regLabel.toLowerCase()];
          }

          if (!groups[regLabel]) {
            groups[regLabel] = [];
          }

          trek.faqs.forEach((faq: any) => {
            // Avoid adding identical question/answer duplicates
            const exists = groups[regLabel].some(
              (item) => item.q.trim().toLowerCase() === faq.question.trim().toLowerCase()
            );
            if (!exists) {
              groups[regLabel].push({
                q: faq.question,
                a: extractLexicalText(faq.answer),
              });
            }
          });
        }
      });
    }

    // Remove empty groups
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    // 5. Sort categories: general categories first, then alphabetically for regions
    const CATEGORY_WEIGHTS: Record<string, number> = {
      'Basic Information': 1,
      'Physical Readiness & Training': 2,
      'Entry permit': 3,
      'Assurance and Travel permit': 4,
      'Himalayan Guide & Support Team': 5,
      'Where You Stay & What’s Included': 6,
      'Meals and Refreshments': 7,
      'Weather Patterns & Seasonal Changes': 8,
      'Health Protection & Safety': 9,
      'Equipment & Packing List': 10,
      'Trip Booking & Payment Policy': 11,
      'Flights & Ground Transport': 12,
    };

    const sortedCategories = Object.keys(groups).sort((catA, catB) => {
      const weightA = CATEGORY_WEIGHTS[catA] || 100;
      const weightB = CATEGORY_WEIGHTS[catB] || 100;
      
      if (weightA !== weightB) {
        return weightA - weightB;
      }
      return catA.localeCompare(catB);
    });

    mappedFAQs = sortedCategories.map(category => ({
      category,
      faqs: groups[category],
    }));

  } catch (err: any) {
    console.warn("[FAQs Page] Failed to query faqs from CMS:", err.message);
  }

  // Fallback to default faqs if database has no FAQs at all
  const displayFAQs = mappedFAQs.length > 0 ? mappedFAQs : DEFAULT_FAQS;

  return <FAQsPageClient initialFAQs={displayFAQs} />;
}
