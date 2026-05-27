'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaRegClock, FaFacebookF, FaLink } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { BlogPost, Trek } from '@/types';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/cloudinary-loader';

interface HeadingItem {
  id: string;
  text: string;
}

interface BlogDetailClientProps {
  blog: BlogPost;
  headings: HeadingItem[];
  bodyContent: React.ReactNode;
  relatedTreksCard: React.ReactNode;
}

export default function BlogDetailClient({
  blog,
  headings,
  bodyContent,
  relatedTreksCard,
}: BlogDetailClientProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  // Intersection Observer to highlight active TOC heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -70% 0px', // Trigger when header is near the top
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the first entry that is intersecting
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        setActiveId(visibleEntry.target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => {
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [headings]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleShareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const scrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <div className="bg-[#fcfbfa] min-h-screen pt-28 md:pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Back Link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-light tracking-wider uppercase mb-8 transition"
        >
          <FaArrowLeft />
          <span>Back to All Articles</span>
        </Link>

        {/* Desktop Split Layout: Sidebar Widgets on LEFT, Main Article on RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Sidebar Pane: TOC & Share (Sticky on Desktop) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
            
            {/* Table of Contents Card */}
            {headings.length > 0 && (
              <div className="bg-white border border-secondary/10 shadow-md rounded-2xl p-6">
                <h3 className="font-serif font-bold text-primary text-base border-b border-primary/5 pb-3 mb-4 flex items-center gap-2">
                  <span>📖</span>
                  <span>Table of Contents</span>
                </h3>
                <nav className="flex flex-col gap-2">
                  {headings.map((heading, idx) => {
                    const isActive = activeId === heading.id;
                    return (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(e) => scrollToHeading(e, heading.id)}
                        className={`flex items-start gap-3 text-xs md:text-sm py-1.5 px-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'bg-secondary/10 border-l-4 border-secondary text-primary font-bold shadow-sm'
                            : 'text-charcoal/70 hover:text-primary hover:bg-bgOffWhite/50'
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center h-5 w-5 rounded-full text-[10px] shrink-0 ${
                            isActive
                              ? 'bg-secondary text-primary font-bold'
                              : 'bg-primary/5 text-charcoal/50'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{heading.text}</span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Share Widget Card */}
            <div className="bg-white border border-secondary/10 shadow-md rounded-2xl p-6">
              <h4 className="text-[10px] text-charcoal/50 uppercase font-bold tracking-widest mb-3">
                SHARE
              </h4>
              <div className="flex items-center gap-3">
                
                {/* Facebook Share */}
                <button
                  onClick={handleShareFacebook}
                  className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#1877F2] text-white hover:scale-105 active:scale-95 shadow-sm transition"
                  title="Share on Facebook"
                >
                  <FaFacebookF className="h-4.5 w-4.5" />
                </button>

                {/* X Share */}
                <button
                  onClick={handleShareX}
                  className="flex items-center justify-center h-10 w-10 rounded-xl bg-black text-white hover:scale-105 active:scale-95 shadow-sm transition"
                  title="Share on X"
                >
                  <FaXTwitter className="h-4.5 w-4.5" />
                </button>

                {/* Copy Link */}
                <div className="relative">
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center justify-center h-10 w-10 rounded-xl border border-secondary/20 hover:scale-105 active:scale-95 shadow-sm transition ${
                      copied ? 'bg-green-500 text-white border-transparent' : 'bg-primary/5 text-charcoal/70 hover:bg-primary/10'
                    }`}
                    title="Copy Page Link"
                  >
                    <FaLink className="h-4 w-4" />
                  </button>
                  {copied && (
                    <span className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] py-1 px-2 rounded shadow-md whitespace-nowrap z-50">
                      Link Copied!
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Author Profile Card */}
            {blog.author && (
              <div className="bg-white border border-secondary/10 shadow-md rounded-2xl p-6 flex flex-col gap-4 text-center">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-primary/10 border-2 border-secondary mx-auto">
                  {blog.author.photo ? (
                    <Image
                      src={getMediaUrl(blog.author.photo)}
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

            {/* Related Treks */}
            {relatedTreksCard}

          </aside>

          {/* Right Main Column: Blog Header, Cover Photo, Article Body */}
          <main className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Post Header */}
            <div>
              <span className="bg-secondary text-primary font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full w-fit">
                {blog.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-primary leading-tight mt-4 mb-6">
                {blog.title}
              </h1>

              {/* Meta Details */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-charcoal/70 border-t border-b border-primary/5 py-4">
                {blog.author && (
                  <div className="flex items-center gap-2.5">
                    <span>
                      By <strong className="text-primary font-bold">{blog.author.name}</strong>
                    </span>
                  </div>
                )}

                <div className="h-4 w-px bg-primary/10"></div>

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
                    <div className="h-4 w-px bg-primary/10"></div>
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
              <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-secondary/15 shadow-lg">
                <Image
                  src={getMediaUrl(blog.coverImage)}
                  alt={blog.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                />
              </div>
            )}

            {/* Article Body Content */}
            <article className="bg-white border border-secondary/10 shadow-lg rounded-2xl p-6 md:p-10 prose prose-emerald max-w-none">
              {bodyContent}
            </article>

          </main>

        </div>
      </div>
    </div>
  );
}
