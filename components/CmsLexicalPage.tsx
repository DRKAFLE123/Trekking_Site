import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { renderLexical } from "@/lib/lexical-renderer";

interface CmsLexicalPageProps {
  page: {
    title: string;
    slug?: string;
    excerpt?: string;
    heroImage?: any;
    content?: any;
  };
}

// Renders a CMS-managed page (visa-info, packing-list, etc.) using the same
// hero + Lexical-body chrome as /why-us. Used by the four static info pages
// as their dynamic branch when a matching CMS document exists.
export default function CmsLexicalPage({ page }: CmsLexicalPageProps) {
  const heroImageUrl = (page.heroImage as any)?.url;

  return (
    <div className="bg-[#fcfbfa] min-h-screen pt-24 md:pt-32 pb-16">
      {/* Hero */}
      <section className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {heroImageUrl ? (
            <div className="relative w-full aspect-[16/6] rounded-2xl overflow-hidden shadow-xl border border-secondary/15">
              <Image
                src={heroImageUrl}
                alt={(page.heroImage as any)?.alt || page.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 80vw"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight max-w-3xl">
                  {page.title}
                </h1>
                {page.excerpt && (
                  <p className="text-sm md:text-base text-white/85 mt-3 max-w-2xl font-light leading-relaxed">
                    {page.excerpt}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center max-w-3xl mx-auto py-10">
              <h1 className="font-serif text-3xl md:text-5xl font-black text-primary leading-tight">
                {page.title}
              </h1>
              {page.excerpt && (
                <p className="text-sm md:text-base text-charcoal/75 mt-4 leading-relaxed font-light">
                  {page.excerpt}
                </p>
              )}
              <div className="h-0.5 w-16 bg-secondary mx-auto mt-6" />
            </div>
          )}
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-4xl mx-auto px-4 md:px-6 mt-6 mb-2">
        <ol className="flex items-center gap-2 text-xs text-charcoal/60">
          <li>
            <Link href="/" className="hover:text-secondary transition">Home</Link>
          </li>
          <FaChevronRight className="text-[8px]" />
          <li className="font-semibold text-[#1a2e1f] truncate max-w-[60vw]">{page.title}</li>
        </ol>
      </nav>

      {/* Body */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 mt-6">
        <article className="prose max-w-none prose-headings:font-serif prose-headings:text-primary prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-black prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-bold prose-p:text-charcoal/85 prose-p:leading-relaxed prose-p:font-light prose-a:text-secondary prose-a:font-semibold hover:prose-a:underline prose-li:text-charcoal/85 prose-li:font-light prose-strong:text-primary">
          {renderLexical(page.content)}
        </article>
      </section>
    </div>
  );
}
