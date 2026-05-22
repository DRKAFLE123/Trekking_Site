import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaRegClock } from "react-icons/fa";
// Data fetching handled via internal API routes
// Query definitions moved to API layer
import { BlogPost } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { renderLexical } from "@/lib/lexical-renderer";


export const revalidate = 60; // Revalidate every minute

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: "blogPosts",
    where: { slug: { equals: slug } },
    depth: 1,
  });
  const blog = (res.docs[0] || null) as unknown as BlogPost | null;

  if (!blog) {
    return {
      title: "Article Not Found | Nature Heaven Trekking & Expedition",
    };
  }

  return {
    title: `${blog.title} | Nature Heaven Chronicles`,
    description: blog.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: "blogPosts",
    where: { slug: { equals: slug } },
    depth: 1,
  });
  const blog = (res.docs[0] || null) as unknown as BlogPost | null;

  if (!blog) {
    notFound();
  }



  return (
    <div className="bg-[#fcfbfa] min-h-screen pt-28 md:pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-light tracking-wider uppercase mb-8 mr-auto"
        >
          <FaArrowLeft />
          <span>Back to All Articles</span>
        </Link>

        {/* Header content */}
        <div className="max-w-4xl mb-8">
          <span className="bg-secondary text-primary font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full w-fit">
            {blog.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-primary leading-tight mt-4 mb-6">
            {blog.title}
          </h1>

          {/* Meta Details */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-charcoal/70 border-t border-b border-primary/5 py-4">
            {/* Author info */}
            {blog.author && (
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-primary/10 border border-secondary/25">
                  {blog.author.photo ? (
                    <Image
                      src={blog.author.photo}
                      alt={blog.author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <FaUser className="h-4 w-4 m-2 text-primary" />
                  )}
                </div>
                <span>
                  By <strong className="text-primary font-bold">{blog.author.name}</strong>
                </span>
              </div>
            )}

            <div className="h-4 w-px bg-primary/10 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-secondary" />
              <span>
                Published:{" "}
                <strong className="text-primary font-semibold">
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </span>
            </div>

            {blog.readTime && (
              <>
                <div className="h-4 w-px bg-primary/10 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <FaRegClock className="text-secondary" />
                  <span>
                    Read time: <strong className="text-primary font-semibold">{blog.readTime}</strong>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cover Photo */}
        {blog.coverImage && (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-secondary/15 shadow-lg mb-12">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        {/* Main Grid: Body Content vs Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Body */}
          <article className="lg:col-span-2 bg-white border border-secondary/10 shadow-lg rounded-2xl p-6 md:p-10 prose prose-emerald max-w-none">
            {renderLexical(blog.body)}
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-8 lg:sticky lg:top-28">
            {/* Author Profile Card */}
            {blog.author && (
              <div className="bg-white border border-secondary/10 shadow-md rounded-2xl p-6 flex flex-col gap-4 text-center">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-primary/10 border-2 border-secondary mx-auto">
                  {blog.author.photo ? (
                    <Image
                      src={blog.author.photo}
                      alt={blog.author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <FaUser className="h-10 w-10 m-5 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary text-base">{blog.author.name}</h4>
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Himalayan Leader</span>
                </div>
                {blog.author.bio && (
                  <p className="text-xs text-charcoal/70 leading-relaxed border-t border-primary/5 pt-3">
                    {blog.author.bio}
                  </p>
                )}
              </div>
            )}

            {/* Related Treks Card Widget */}
            {blog.relatedTreks && blog.relatedTreks.length > 0 && (
              <div className="bg-white border border-secondary/10 shadow-md rounded-2xl p-6 flex flex-col gap-4">
                <h4 className="font-serif font-bold text-primary text-base border-b border-primary/5 pb-2 flex items-center gap-2">
                  <span>🏔️</span>
                  <span>Related Treks</span>
                </h4>
                <div className="flex flex-col gap-4">
                  {blog.relatedTreks.map((relTrek, idx) => {
                    const price = relTrek.discountedPrice || relTrek.price;
                    return (
                      <Link
                        key={idx}
                        href={`/trips/${relTrek.slug}`}
                        className="group flex gap-3.5 hover:bg-bgOffWhite/30 p-2 rounded-xl transition duration-300 border border-transparent hover:border-secondary/15"
                      >
                        {relTrek.heroImage && (
                          <div className="relative h-16 w-20 rounded-lg overflow-hidden shrink-0 bg-primary/10">
                            <Image
                              src={relTrek.heroImage}
                              alt={relTrek.title}
                              fill
                              className="object-cover group-hover:scale-105 transition"
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-1 overflow-hidden">
                          <h5 className="font-serif font-bold text-primary group-hover:text-secondary transition text-xs md:text-sm leading-snug truncate">
                            {relTrek.title}
                          </h5>
                          <div className="flex items-center gap-3 text-[10px] text-charcoal/70">
                            <span>{relTrek.duration} Days</span>
                            <span>•</span>
                            <span className="font-bold text-primary">${price} USD</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
    </div>
  );
}
