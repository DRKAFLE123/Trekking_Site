"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { BlogPost } from "@/types";
import { getMediaUrl } from "@/lib/cloudinary-loader";


interface BlogsPageContentProps {
  blogs: BlogPost[];
}

export default function BlogsPageContent({ blogs }: BlogsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(blogs.map((b) => b.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const titleLower = (blog.title || "").toLowerCase();
      const excerptLower = (blog.excerpt || "").toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        titleLower.includes(searchLower) ||
        excerptLower.includes(searchLower);
      const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary mb-4">Himalayan Chronicles</h1>
        <p className="text-sm md:text-base text-charcoal/70">
          Pro-trekking tips, gear checklists, altitude adaptation guidelines, and mountain guides diaries straight from Everest, Annapurna, and Manaslu leaders.
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 pb-6 border-b border-secondary/15">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-secondary text-primary border border-secondary shadow-md"
                  : "bg-white border border-secondary/25 text-charcoal hover:bg-secondary/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-white border border-secondary/20 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-secondary text-charcoal"
          />
          <FaSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5" />
        </div>
      </div>

      {/* Blogs Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="group flex flex-col bg-white rounded-xl overflow-hidden border border-secondary/10 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Cover image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary/10">
                {blog.coverImage && (
                  <Image
                    src={getMediaUrl(blog.coverImage)}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-secondary text-primary font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full">
                  {blog.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col justify-between grow">
                <div className="flex flex-col gap-2.5">
                  {/* Meta */}
                  <div className="flex items-center gap-2 text-[10px] text-muted tracking-wider uppercase font-semibold">
                    <span>
                      {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="font-serif font-bold text-primary group-hover:text-secondary transition text-base md:text-lg leading-snug line-clamp-2">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h3>

                  <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-bold mt-4 hover:text-secondary group/link transition"
                >
                  <span>Read Full Article</span>
                  <span className="group-hover/link:translate-x-1 transition duration-300">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-secondary/10 rounded-2xl p-8 flex flex-col items-center gap-3">
          <span className="text-4xl">📝</span>
          <h3 className="font-serif font-bold text-lg text-primary">No blog articles match your criteria</h3>
          <p className="text-xs text-charcoal/70 max-w-xs mx-auto">
            Try resetting your search query or choosing another category pill above.
          </p>
        </div>
      )}
    </div>
  );
}
