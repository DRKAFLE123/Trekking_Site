"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Faq } from "@/types";
import { renderLexical } from "@/lib/lexical-renderer";
import { motion, AnimatePresence } from "framer-motion";

interface FAQAccordionProps {
  faqs: Faq[];
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

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
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

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      {/* Inject JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />

      {validFaqs.map((faq, idx) => {
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
  );
}

