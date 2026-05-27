"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaClock, FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BlogPost } from "@/types";
import { getMediaUrl } from "@/lib/cloudinary-loader";

interface BlogsPageContentProps {
  blogs: BlogPost[];
  siteSettings?: any;
}

const POSTS_PER_PAGE = 6;

export default function BlogsPageContent({ blogs, siteSettings }: BlogsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const gridSectionRef = useRef<HTMLDivElement>(null);

  // Normalize and clean up published blogs
  const publishedBlogs = useMemo(() => {
    return (blogs || []).filter((b) => b.title && b.slug);
  }, [blogs]);

  // Extract unique categories dynamically and compute counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { All: publishedBlogs.length };
    publishedBlogs.forEach((blog) => {
      if (blog.category) {
        counts[blog.category] = (counts[blog.category] || 0) + 1;
      }
    });
    return counts;
  }, [publishedBlogs]);

  const categories = useMemo(() => {
    return Object.keys(categoriesWithCounts);
  }, [categoriesWithCounts]);

  // Filtered blogs based on search and category
  const filteredBlogs = useMemo(() => {
    return publishedBlogs.filter((blog) => {
      const titleLower = (blog.title || "").toLowerCase();
      const excerptLower = (blog.excerpt || "").toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        titleLower.includes(searchLower) ||
        excerptLower.includes(searchLower);
      const matchesCategory =
        selectedCategory === "All" || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [publishedBlogs, searchQuery, selectedCategory]);

  // Reset page when search or category changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Determine if we should show the Spotlight Featured post
  // Only show when page is 1, category is 'All', and there is no search query
  const showFeaturedSpotlight =
    currentPage === 1 && selectedCategory === "All" && searchQuery === "" && filteredBlogs.length > 0;

  // The featured post is the most recent (first item)
  const featuredPost = showFeaturedSpotlight ? filteredBlogs[0] : null;

  // Display all blogs in the grid
  const displayBlogs = filteredBlogs;

  // Paginated blogs
  const totalPages = Math.ceil(displayBlogs.length / POSTS_PER_PAGE);
  const paginatedBlogs = useMemo(() => {
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    return displayBlogs.slice(startIdx, startIdx + POSTS_PER_PAGE);
  }, [displayBlogs, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (gridSectionRef.current) {
      const yOffset = -100; // offset to clear floating navbar
      const y = gridSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Safe date formatter to prevent range error crashes on undefined/invalid dates
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Recent";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Extract cover page fields from CMS dynamically
  const coverImageFromCMS = siteSettings?.blogsPageSettings?.coverImage
    ? getMediaUrl(siteSettings.blogsPageSettings.coverImage)
    : null;
  const coverBgUrl = coverImageFromCMS || "/uploads/blog_ebc_sunrise.png";
  const coverTitle = siteSettings?.blogsPageSettings?.title || "Summit Chronicles";
  const coverSubtitle = siteSettings?.blogsPageSettings?.subtitle || "Nature Heaven Trekking & Expedition";

  return (
    <div className="w-full -mt-24 md:-mt-32">
      {/* 1. Compact Cover Hero Section */}
      <div className="relative bg-primary overflow-hidden py-10 md:py-14 px-6 text-center text-white border-b border-secondary/20 shadow-inner">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/95 via-primary-dark/95 to-black/90" />
        <div 
          className="absolute inset-0 z-0 opacity-20 mix-blend-overlay bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url('${coverBgUrl}')` }}
        />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-2 mt-8 animate-fadeIn">
          <span className="text-secondary uppercase font-bold text-[10px] tracking-[0.2em] block">
            {coverSubtitle}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-white leading-tight">
            {coverTitle}
          </h1>
          <div className="h-0.5 w-12 bg-secondary my-1"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        
        {/* 2. Featured Spotlight Post */}
        {featuredPost && (
          <div className="mb-16 animate-fadeIn">
            <span className="text-xs uppercase font-extrabold tracking-widest text-secondary mb-4 block">
              ⭐ Spotlight Post
            </span>
            <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-secondary/15 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500">
              
              {/* Image Column */}
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:h-[420px] w-full overflow-hidden bg-primary/10">
                {featuredPost.coverImage ? (
                  <Image
                    src={getMediaUrl(featuredPost.coverImage)}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-103 transition duration-700 ease-out"
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5 font-serif text-primary/30">
                    Nature Heaven Chronicles
                  </div>
                )}
                {/* Category Badge overlay */}
                <span className="absolute top-4 left-4 bg-secondary text-primary font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                  {featuredPost.category}
                </span>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  {/* Meta row */}
                  <div className="flex items-center gap-2.5 text-[10px] text-muted font-bold tracking-wider uppercase">
                    <span>
                      {formatDate(featuredPost.publishedAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaClock className="h-3 w-3" />
                      {featuredPost.readTime || "5 min read"}
                    </span>
                  </div>

                  <h2 className="font-serif font-black text-primary group-hover:text-secondary transition text-2xl md:text-3xl leading-tight">
                    <Link href={`/blogs/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light line-clamp-4">
                    {featuredPost.excerpt}
                  </p>
                </div>

                {/* Author Info & Button */}
                <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-secondary/20 bg-primary/5 flex items-center justify-center shrink-0">
                      {featuredPost.author?.photo ? (
                        <Image
                          src={getMediaUrl(featuredPost.author.photo)}
                          alt={featuredPost.author.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <FaUser className="text-primary/30 h-4 w-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-primary">{featuredPost.author?.name || "Summit Guide"}</span>
                      <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">Author</span>
                    </div>
                  </div>

                  <Link
                    href={`/blogs/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white hover:text-secondary font-bold text-xs px-4 py-2.5 rounded-xl shadow transition duration-300"
                  >
                    <span>Read Story</span>
                    <span>→</span>
                  </Link>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 3. Category Filter & Search row */}
        <div ref={gridSectionRef} className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center mb-10 pb-6 border-b border-secondary/15">
          {/* Category pills (Left side) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none w-full lg:w-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = categoriesWithCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-sm border ${
                    isActive
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-secondary/20 text-charcoal hover:bg-secondary/5"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-normal ${
                    isActive ? "bg-white/20 text-white" : "bg-primary/5 text-primary"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar & Quick Keywords (Right side) */}
          <div className="flex flex-col gap-2 w-full lg:w-80 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-white border border-secondary/20 rounded-xl py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:border-secondary text-charcoal shadow-sm focus:shadow-md transition-all duration-300"
              />
              <FaSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5" />
            </div>
            
            {/* Quick Keywords */}
            <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-muted">
              <span>Quick tags:</span>
              {["EBC", "Annapurna", "Packing", "Culture"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearchChange(tag)}
                  className="px-2 py-0.5 bg-[#1a3c2e]/5 hover:bg-[#1a3c2e]/10 border border-[#1a3c2e]/10 hover:border-[#c8922a]/30 rounded text-[9px] text-[#1a3c2e] font-semibold transition cursor-pointer"
                >
                  {tag}
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="text-secondary hover:underline ml-1 text-[9px] font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Result Summary (if searching) */}
        {searchQuery && (
          <div className="mb-6 -mt-4">
            <span className="text-xs text-muted font-medium">
              Found {filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"} matching &quot;{searchQuery}&quot;
            </span>
          </div>
        )}

        {/* 4. Blog Cards Grid (Compact Layout) */}
        {paginatedBlogs.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-secondary/10 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 justify-between h-full"
                >
                  <div>
                    {/* Cover image */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary/10">
                      {blog.coverImage ? (
                        <Image
                          src={getMediaUrl(blog.coverImage)}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 font-serif text-primary/30">
                          Nature Heaven Blog
                        </div>
                      )}
                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 bg-secondary text-primary font-bold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-md">
                        {blog.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-4.5 flex flex-col gap-2.5">
                      {/* Meta */}
                      <div className="flex items-center gap-2 text-[10px] text-muted font-bold tracking-wider uppercase">
                        <span>
                          {formatDate(blog.publishedAt)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FaClock className="h-3 w-3" />
                          {blog.readTime || "5 min read"}
                        </span>
                      </div>

                      <h3 className="font-serif font-black text-primary group-hover:text-secondary transition text-sm sm:text-base leading-snug line-clamp-2">
                        <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                      </h3>

                      <p className="text-[12.5px] sm:text-xs text-charcoal/70 leading-relaxed line-clamp-3 font-light">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Author + Read Link */}
                  <div className="px-4.5 pb-4.5 pt-3 border-t border-primary/5 flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="relative h-7 w-7 rounded-full overflow-hidden border border-secondary/20 bg-primary/5 flex items-center justify-center shrink-0">
                        {blog.author?.photo ? (
                          <Image
                            src={getMediaUrl(blog.author.photo)}
                            alt={blog.author.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <FaUser className="text-primary/30 h-3 w-3" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-primary truncate max-w-[90px] sm:max-w-[120px]">
                        {blog.author?.name || "Summit Guide"}
                      </span>
                    </div>

                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] text-primary font-bold hover:text-secondary group/link transition shrink-0"
                    >
                      <span>Read Article</span>
                      <span className="group-hover/link:translate-x-1 transition duration-300">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* 5. Client-Side Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-secondary/15">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl border border-secondary/20 bg-white text-primary hover:bg-secondary/10 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
                  aria-label="Previous page"
                >
                  <FaChevronLeft className="h-3 w-3" />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 rounded-xl border text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                        isActive
                          ? "bg-primary border-primary text-white shadow-md"
                          : "bg-white border-secondary/20 text-primary hover:bg-secondary/10"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl border border-secondary/20 bg-white text-primary hover:bg-secondary/10 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
                  aria-label="Next page"
                >
                  <FaChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20 bg-white border border-secondary/10 rounded-3xl p-8 flex flex-col items-center gap-3 shadow-md max-w-lg mx-auto">
            <span className="text-5xl">🏔️</span>
            <h3 className="font-serif font-bold text-xl text-primary mt-2">No Chronicles Found</h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
              We couldn&apos;t find any articles matching your search or category filter. Try clearing your filters or search bar.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setCurrentPage(1);
              }}
              className="mt-3 px-5 py-2 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl shadow transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
