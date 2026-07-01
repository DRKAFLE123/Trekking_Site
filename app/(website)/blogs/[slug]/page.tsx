import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { renderLexical, extractHeadings } from "@/lib/lexical-renderer";
import cloudinaryLoader, { getMediaUrl } from "@/lib/cloudinary-loader";
import BlogDetailClient from "@/components/BlogDetailClient";

export const revalidate = 60; // Revalidate every minute

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "blogPosts",
      where: { slug: { equals: slug } },
      depth: 1,
    });
    const blog = (res.docs[0] || null) as any;

    if (!blog) {
      return {
        title: "Article Not Found | Nature Heaven Trekking & Expedition",
      };
    }

    // Determine fallback social share image
    const rawImage = getMediaUrl(blog.seo?.metaImage) || getMediaUrl(blog.coverImage);
    let metaImageUrl = "";
    if (rawImage) {
      metaImageUrl = cloudinaryLoader({ src: rawImage, width: 1200 });
    } else {
      metaImageUrl = "/opengraph-image"; // brand-generated 1200x630 fallback
    }

    const title = blog.seo?.metaTitle || `${blog.title} | Nature Heaven Chronicles`;
    const description = blog.seo?.metaDescription || blog.excerpt;
    const openGraphImages = metaImageUrl ? [{ url: metaImageUrl, alt: blog.title }] : [];

    return {
      title,
      description,
      alternates: { canonical: `/blogs/${blog.slug}` },
      openGraph: {
        title,
        description,
        type: "article",
        url: `/blogs/${blog.slug}`,
        images: openGraphImages,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: metaImageUrl ? [metaImageUrl] : [],
      },
    };
  } catch (err: any) {
    return {
      title: "Nature Heaven Chronicles | Nature Heaven Trekking & Expedition",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let blog: BlogPost | null = null;
  let allBlogs: BlogPost[] = [];
  let siteSettings: any = null;
  let blogSettings: any = null;

  try {
    const payload = await getPayload({ config });
    const [res, siteSettingsRes, allBlogsRes, blogSettingsRes] = await Promise.all([
      payload.find({
        collection: "blogPosts",
        where: { slug: { equals: slug } },
        depth: 2,
      }),
      payload.find({
        collection: "siteSettings",
        depth: 1,
      }),
      payload.find({
        collection: "blogPosts",
        depth: 1,
        limit: 100,
      }),
      payload.find({
        collection: "blogSettings",
        depth: 2,
      })
    ]);

    blog = (res.docs[0] || null) as unknown as BlogPost | null;
    siteSettings = siteSettingsRes.docs[0] || null;
    allBlogs = allBlogsRes.docs as unknown as BlogPost[];
    blogSettings = blogSettingsRes.docs[0] || null;
  } catch (err: any) {
    console.warn("[Blog Detail Page] Failed to query blog details:", err.message);
  }

  // Fallback to empty list if the database is empty
  const blogsList = allBlogs && allBlogs.length > 0 ? allBlogs : [];

  if (!blog) {
    notFound();
  }

  const headings = extractHeadings(blog.body);
  // Wrap in <> </> so the returned array becomes a single stable ReactNode.
  // Passing a raw array from server → client component triggers "key" warnings.
  const bodyContent = <>{renderLexical(blog.body)}</>;

  // Remodeled to display as a premium full-width grid below the article!
  const relatedTreksCard = blog.relatedTreks && blog.relatedTreks.length > 0 ? (
    <div className="bg-white border border-secondary/15 shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-6 mt-8">
      <h4 className="font-serif font-black text-primary text-lg border-b border-primary/5 pb-3 flex items-center gap-2">
        <span>🏔️</span>
        <span>Recommended Trips for You</span>
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {blog.relatedTreks.map((relTrek, idx) => {
          const price = relTrek.discountedPrice || relTrek.price;
          const trekHeroUrl = getMediaUrl(relTrek.heroImage);
          return (
            <Link
              key={idx}
              href={`/trips/${relTrek.slug}`}
              className="group flex flex-col bg-[#fdfdfc] hover:bg-white border border-secondary/10 hover:border-secondary/20 shadow-sm hover:shadow-md rounded-xl overflow-hidden transition-all duration-300"
            >
              {trekHeroUrl && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary/10">
                  <Image
                    src={trekHeroUrl}
                    alt={relTrek.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-4 flex flex-col gap-2 justify-between grow">
                <h5 className="font-serif font-bold text-primary group-hover:text-secondary transition text-sm leading-snug line-clamp-2">
                  {relTrek.title}
                </h5>
                <div className="flex items-center justify-between text-xs text-charcoal/70 border-t border-primary/5 pt-3 mt-1">
                  <span>{relTrek.duration} Days</span>
                  <span className="font-bold text-emerald-700">${price} USD</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  ) : null;

  // Calculate Next, Previous, and Similar blogs dynamically
  const currentIndex = blogsList.findIndex(b => b.slug === slug);
  const prevBlog = currentIndex > 0 ? blogsList[currentIndex - 1] : null;
  const nextBlog = currentIndex < blogsList.length - 1 ? blogsList[currentIndex + 1] : null;
  const similarBlogs = blogsList.filter(b => b.slug !== slug).slice(0, 3);

  // Calculate Other Blogs written by the same author
  const authorName = blog.author?.name || "Summit Guide";
  const otherBlogsByAuthor = blogsList
    .filter(b => b.slug !== slug && (b.author?.name || "Summit Guide").toLowerCase() === authorName.toLowerCase())
    .slice(0, 3);

  // Expert Contact info
  const expertWhatsApp = siteSettings?.headerSettings?.expertWhatsApp || "+977 9851218358";
  const expertName = siteSettings?.headerSettings?.expertName || "Kafle";

  return (
    <BlogDetailClient
      blog={blog}
      headings={headings}
      bodyContent={bodyContent}
      relatedTreksCard={relatedTreksCard}
      prevBlog={prevBlog}
      nextBlog={nextBlog}
      similarBlogs={similarBlogs}
      otherBlogsByAuthor={otherBlogsByAuthor}
      expertWhatsApp={expertWhatsApp}
      expertName={expertName}
      blogSettings={blogSettings}
    />
  );
}
