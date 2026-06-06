import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight, FaInfoCircle, FaMapMarkerAlt, FaHeadset, FaEnvelope, FaCompass } from "react-icons/fa";
import { renderLexical } from "@/lib/lexical-renderer";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import ScrollSpyTOC from "@/components/ScrollSpyTOC";
import TermsAccordion from "./TermsAccordion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms & Conditions | Nature Heaven Trekking & Expedition",
  description:
    "Read the booking terms and conditions for Nature Heaven Trekking & Expedition. Learn about deposits, cancellation policies, and traveler responsibility.",
};

async function getPageData() {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "companyPages",
      where: {
        slug: {
          equals: "terms-and-condition",
        },
      },
      depth: 2,
    });
    if (result.docs.length === 0) return null;
    return result.docs[0];
  } catch (error) {
    console.error("Error in getPageData:", error);
    return null;
  }
}

async function getPagesList() {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "companyPages",
      limit: 20,
      depth: 0,
    });
    return result.docs;
  } catch (error) {
    console.error("Error in getPagesList:", error);
    return [];
  }
}

function parseTermsContent(content: any) {
  const introNodes: any[] = [];
  const sections: { title: string; contentElement: React.ReactNode }[] = [];

  if (!content || !content.root || !Array.isArray(content.root.children)) {
    return { introNodes, sections };
  }

  let currentSectionNodes: any[] = [];
  let currentSectionTitle = "";

  for (const node of content.root.children) {
    if (node.type === "heading" && node.tag === "h3") {
      // Flush previous section
      if (currentSectionTitle) {
        sections.push({
          title: currentSectionTitle,
          contentElement: renderLexical({ root: { type: "root", children: currentSectionNodes } }),
        });
      }

      const titleText =
        node.children
          ?.filter((c: any) => c.type === "text")
          ?.map((c: any) => c.text)
          ?.join("") || "Section";

      currentSectionTitle = titleText;
      currentSectionNodes = [];
    } else {
      if (currentSectionTitle) {
        currentSectionNodes.push(node);
      } else {
        introNodes.push(node);
      }
    }
  }

  // Flush the final section
  if (currentSectionTitle) {
    sections.push({
      title: currentSectionTitle,
      contentElement: renderLexical({ root: { type: "root", children: currentSectionNodes } }),
    });
  }

  return { introNodes, sections };
}

export default async function TermsPage() {
  const page = await getPageData();

  if (!page) {
    return (
      <div className="bg-[#fcfbfa] min-h-screen pt-24 md:pt-32 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-primary mb-4">Terms &amp; Conditions</h1>
          <p className="text-charcoal/80">
            Please ensure the Terms &amp; Conditions are seeded in the CMS admin panel.
          </p>
        </div>
      </div>
    );
  }

  const allPages = await getPagesList();
  const { introNodes, sections } = parseTermsContent(page.content);

  return (
    <div className="bg-[#f8f5f0] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-[#1a2e1f]">
        {(page.heroImage as any)?.url ? (
          <Image
            src={(page.heroImage as any).url}
            alt={(page.heroImage as any).alt || page.title}
            fill
            className="object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 opacity-40 bg-[url('/pattern-leaf.png')] bg-repeat"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1f] via-transparent to-black/30"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-24 md:pt-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
            <FaCompass className="text-[#c8922a]" />
            Company Profile &amp; Ethics
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="text-white/90 text-sm md:text-base max-w-2xl font-sans drop-shadow">
              {page.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-[#6B6B6B] mb-8 font-sans overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-[#2E7D32] transition">
            Home
          </Link>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <span className="text-gray-400">Company</span>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <span className="font-semibold text-[#1a2e1f]">{page.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Intro Section */}
            {introNodes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <article
                  className="prose prose-lg max-w-none 
                    prose-headings:font-serif prose-headings:text-[#1a2e1f] 
                    prose-h2:text-2xl prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3 prose-h2:mb-6
                    prose-p:text-[#4A4A4A] prose-p:leading-relaxed
                    prose-strong:text-[#1a2e1f]"
                >
                  {renderLexical({ root: { type: "root", children: introNodes } })}
                </article>
              </div>
            )}

            {/* Accordion Component */}
            {sections.length > 0 && <TermsAccordion sections={sections} />}

            {/* Downloadable Documents / PDFs Section */}
            {page.documents && page.documents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1a2e1f] mb-6 flex items-center gap-2">
                  <FaInfoCircle className="text-[#c8922a]" /> Downloadable Credentials &amp; Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {page.documents.map((doc: any) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 bg-[#fbfbfc] border border-gray-100 rounded-xl hover:border-[#c8922a] hover:bg-[#f0f6fa] hover:shadow-sm transition duration-300"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-100 transition">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <span className="font-sans text-sm font-bold text-[#1a2e1f] truncate group-hover:text-[#c8922a] transition">
                            {doc.filename}
                          </span>
                          <span className="text-[11px] text-gray-400 font-sans mt-0.5 capitalize">
                            {doc.mimeType?.split("/")[1] || "PDF Document"}
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-400 group-hover:text-[#c8922a] shrink-0 transition pl-4">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[350px] shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* ScrollSpy Table of Contents */}
              <ScrollSpyTOC />

              {/* Quick Links */}
              {allPages.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-serif text-xl font-bold text-[#1a2e1f] mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#c8922a]" /> Company Info
                  </h3>
                  <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {allPages.map((p: any) => {
                      const isStatic = [
                        "about-us",
                        "why-us",
                        "csr",
                        "our-team",
                        "terms-and-condition",
                        "privacy-policy",
                        "legal-documents",
                      ].includes(p.slug);
                      const href = isStatic ? `/${p.slug}` : `/company/${p.slug}`;
                      return (
                        <li key={p.slug}>
                          <Link
                            href={href}
                            className={`block px-3 py-2 rounded-lg text-sm font-semibold transition ${
                              p.slug === page.slug
                                ? "bg-[#1a2e1f] text-white"
                                : "text-[#4A4A4A] hover:bg-gray-50 hover:text-[#c8922a]"
                            }`}
                          >
                            {p.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Need Help CTA */}
              <div className="bg-gradient-to-br from-[#1a2e1f] to-[#2E7D32] rounded-2xl p-6 text-white text-center shadow-lg">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <FaHeadset className="text-3xl text-[#c8922a]" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Need Expert Advice?</h3>
                <p className="text-sm text-white/80 mb-6 font-sans">
                  Our travel experts are here to help you plan your perfect Himalayan adventure.
                </p>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 bg-[#c8922a] hover:bg-[#b07820] text-white w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition shadow-md hover:shadow-lg"
                >
                  <FaEnvelope /> Contact Us
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
