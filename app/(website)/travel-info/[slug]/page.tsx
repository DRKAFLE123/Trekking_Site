import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaChevronRight, FaInfoCircle, FaMapMarkerAlt, FaHeadset, FaEnvelope } from "react-icons/fa";
import { renderLexical } from "@/lib/lexical-renderer";

async function getPageData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/pages/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch page data: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error in getPageData:", error);
    return null;
  }
}

async function getPagesList() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/pages?limit=20`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageData(slug);
  if (!page) return { title: "Page Not Found | Nature Heaven Treks" };

  return {
    title: page.seoTitle || `${page.title} | Travel Info | Nature Heaven Treks`,
    description: page.seoDescription || page.excerpt || `Information about ${page.title} for traveling in Nepal.`,
  };
}

export default async function TravelInfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageData(slug);
  if (!page) notFound();

  const allPages = await getPagesList();

  return (
    <div className="bg-[#f8f5f0] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-[#1a2e1f]">
        {page.heroImage?.url ? (
          <Image
            src={page.heroImage.url}
            alt={page.heroImage.alt || page.title}
            fill
            className="object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 opacity-40 bg-[url('/pattern-leaf.png')] bg-repeat"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1f] via-transparent to-black/30"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
            <FaInfoCircle className="text-[#c8922a]" />
            Travel Information
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
          <Link href="/" className="hover:text-[#2E7D32] transition">Home</Link>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <span className="text-gray-400">Travel Info</span>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <span className="font-semibold text-[#1a2e1f]">{page.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
              <article className="prose prose-lg max-w-none 
                prose-headings:font-serif prose-headings:text-[#1a2e1f] 
                prose-h2:text-2xl prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3 prose-h2:mb-6
                prose-h3:text-xl prose-h3:text-[#2E7D32]
                prose-p:text-[#4A4A4A] prose-p:leading-relaxed
                prose-a:text-[#c8922a] prose-a:font-semibold hover:prose-a:text-[#b07820]
                prose-li:text-[#4A4A4A] prose-li:marker:text-[#c8922a]
                prose-strong:text-[#1a2e1f]
                prose-img:rounded-xl prose-img:shadow-md"
              >
                {renderLexical(page.content)}
              </article>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[350px] shrink-0 space-y-8">
            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-serif text-xl font-bold text-[#1a2e1f] mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#c8922a]" /> More Topics
              </h3>
              <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {allPages.map((p: any) => (
                  <li key={p.slug}>
                    <Link 
                      href={`/travel-info/${p.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        p.slug === page.slug 
                          ? 'bg-[#1a2e1f] text-white' 
                          : 'text-[#4A4A4A] hover:bg-gray-50 hover:text-[#c8922a]'
                      }`}
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

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
          </aside>
        </div>
      </div>
    </div>
  );
}
