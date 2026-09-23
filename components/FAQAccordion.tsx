"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Faq } from "@/types";
import { renderLexical } from "@/lib/lexical-renderer";
import { motion, AnimatePresence } from "framer-motion";

interface FAQAccordionProps {
  faqs: Faq[];
  /** 2 = side-by-side columns on desktop (homepage); 1 = single stack (default). */
  columns?: 1 | 2;
}

// Simple helper to serialize Lexical content to plain text for JSON-LD schema
function serializeToPlainText(body: any): string {
  if (!body) return "";
  if (typeof body === "string") return body;

  try {
    if (body.root && body.root.children) {
      return body.root.children
        .map((node: any) => {
          if (node.children) {
            return node.children.map((c: any) => c.text || "").join("");
          }
          return "";
        })
        .filter(Boolean)
        .join(" ");
    }

    if (Array.isArray(body)) {
      return body
        .map((block: any) => {
          if (block.children) {
            return block.children.map((c: any) => c.text || "").join("");
          }
          return "";
        })
        .filter(Boolean)
        .join(" ");
    }
  } catch (e) {
    console.error("Error serializing FAQ text for schema", e);
  }

  return "";
}

export default function FAQAccordion({ faqs, columns = 1 }: FAQAccordionProps) {
  const faqList = faqs || [];
  const validFaqs = faqList.filter(
    (faq) =>
      faq &&
      faq.question &&
      faq.question.trim().length > 0 &&
      faq.answer &&
      (typeof faq.answer === "string" || (typeof faq.answer === "object" && Object.keys(faq.answer).length > 0))
  );

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": validFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": serializeToPlainText(faq.answer),
      },
    })),
  };

  // Two columns are two independent stacks (not CSS columns), so an answer
  // expanding on the left never reflows the items on the right. Items are
  // dealt in reading order: 1st/3rd/5th left, 2nd/4th/6th right.
  const stacks: { faq: Faq; idx: number }[][] =
    columns === 2
      ? [validFaqs.filter((_, i) => i % 2 === 0).map((faq, i) => ({ faq, idx: i * 2 })),
         validFaqs.filter((_, i) => i % 2 === 1).map((faq, i) => ({ faq, idx: i * 2 + 1 }))]
      : [validFaqs.map((faq, idx) => ({ faq, idx }))];

  return (
    <div className={columns === 2 ? "grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto items-start" : "flex flex-col gap-4 max-w-3xl mx-auto"}>
      {/* Inject JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />

      {stacks.map((stack, s) => (
      <div key={s} className="flex flex-col gap-4">
      {stack.map(({ faq, idx }) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={faq.id || faq._id || idx}
            className="border border-secondary/15 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow transition-all duration-300"
          >
            {/* Header / Button */}
            <button
              onClick={() => toggleAccordion(idx)}
              className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none transition group"
            >
              <span className="font-serif font-bold text-primary text-sm md:text-base group-hover:text-secondary transition duration-300 pr-4">
                {faq.question}
              </span>
              <span
                className={`p-1.5 rounded-full bg-primary/5 text-secondary transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-180 bg-secondary/10" : ""
                }`}
              >
                <FaChevronDown className="h-3 w-3" />
              </span>
            </button>

            {/* Answer Content with Framer Motion height animation */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-secondary/10"
                >
                  <div className="px-6 py-4 bg-bgOffWhite/30">
                    {renderLexical(faq.answer)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      </div>
      ))}
    </div>
  );
}

