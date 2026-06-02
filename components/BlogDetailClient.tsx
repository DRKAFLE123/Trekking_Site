'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaRegClock, FaFacebookF, FaLink, FaHeadset, FaDownload } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { BlogPost } from '@/types';
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
  prevBlog: BlogPost | null;
  nextBlog: BlogPost | null;
  similarBlogs: BlogPost[];
  otherBlogsByAuthor: BlogPost[];
  expertWhatsApp: string;
  expertName: string;
  blogSettings: any;
}

interface NewsletterFormProps {
  onSuccess: (pdfUrl: string | null) => void;
}

function NewsletterForm({ onSuccess }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setStatus("");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "", email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Thank you! Your free travel guide is on its way.");
        setEmail("");
        onSuccess(data.pdfUrl || null);
      } else {
        throw new Error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={submitting}
          className="bg-black/35 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-secondary transition grow min-w-0"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-secondary hover:bg-secondary-dark text-primary font-sans font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition duration-300 shadow disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {submitting ? "Sending..." : "Get Free Guide"}
        </button>
      </form>
      {message && (
        <p className={`text-xs mt-2.5 font-semibold ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default function BlogDetailClient({
  blog,
  headings,
  bodyContent,
  relatedTreksCard,
  prevBlog,
  nextBlog,
  similarBlogs,
  otherBlogsByAuthor,
  expertWhatsApp,
  expertName,
  blogSettings,
}: BlogDetailClientProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState<boolean>(false);

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
      rootMargin: '-120px 0px -60% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
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
    <div className="bg-[#fcfbfa] min-h-screen pt-16 md:pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Back Link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-light tracking-wider uppercase mb-5 transition"
        >
          <FaArrowLeft />
          <span>Back to All Articles</span>
        </Link>

        {/* Desktop Split Layout: Sidebar TOC on LEFT, Main Article on RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Sidebar Pane: Extremely Compact Consolidated Sticky Panel */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start w-full">
            <div className="bg-white border border-secondary/15 shadow-md rounded-2xl p-5 md:p-6 flex flex-col gap-4 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-none">
              
              {/* Table of Contents Section */}
              {headings.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif font-black text-primary text-[17px] border-b border-primary/5 pb-2.5 flex items-center gap-2">
                    <span>📖</span>
                    <span>On this page</span>
                  </h3>
                  
                  {/* Space-optimized vertical timeline navigation */}
                  <nav className="relative pl-4 border-l-[1.5px] border-slate-100 flex flex-col gap-2.5">
                    {headings.map((heading) => {
                      const isActive = activeId === heading.id;
                      return (
                        <a
                          key={heading.id}
                          href={`#${heading.id}`}
                          onClick={(e) => scrollToHeading(e, heading.id)}
                          className={`group relative flex flex-col text-[14.5px] font-sans leading-snug transition-all duration-300 -ml-[21.5px] pl-6 py-0.5 select-none ${
                            isActive
                              ? 'text-[#c8922a] font-bold tracking-tight'
                              : 'text-charcoal/70 hover:text-primary font-semibold'
                          }`}
                        >
                          {/* Indicator Dot */}
                          <span
                            className={`absolute left-0 top-1.5 h-2 w-2 rounded-full border-[1.5px] transition-all duration-350 ${
                              isActive
                                ? 'bg-[#c8922a] border-[#c8922a] scale-110 shadow-[0_0_8px_rgba(200,146,42,0.75)]'
                                : 'bg-white border-slate-300 group-hover:border-primary'
                            }`}
                          />
                          <span>{heading.text}</span>
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* Share Bar Consolidated inside the same panel to fit in one view */}
              <div className="border-t border-slate-100 pt-3.5 mt-1 flex items-center justify-between">
                <span className="text-[9px] text-charcoal/45 font-bold uppercase tracking-widest">
                  Share Article
                </span>
                <div className="flex items-center gap-2">
                  {/* Facebook */}
                  <button
                    onClick={handleShareFacebook}
                    className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white active:scale-95 transition-all duration-200"
                    title="Share on Facebook"
                  >
                    <FaFacebookF className="h-3.5 w-3.5" />
                  </button>

                  {/* X */}
                  <button
                    onClick={handleShareX}
                    className="flex items-center justify-center h-8 w-8 rounded-lg bg-black/5 hover:bg-black text-charcoal hover:text-white active:scale-95 transition-all duration-200"
                    title="Share on X"
                  >
                    <FaXTwitter className="h-3.5 w-3.5" />
                  </button>

                  {/* Link Copy */}
                  <div className="relative">
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center justify-center h-8 w-8 rounded-lg active:scale-95 transition-all duration-200 ${
                        copied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-primary/5 hover:bg-primary/10 text-charcoal/70'
                      }`}
                      title="Copy Page Link"
                    >
                      <FaLink className="h-3.5 w-3.5" />
                    </button>
                    {copied && (
                      <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[9px] py-1 px-2 rounded shadow-md whitespace-nowrap z-50 animate-fadeIn">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* Right Main Column: Blog Header, Cover Photo, Article Body, and Profile box below */}
          <main className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
            
            {/* Post Header */}
            <div>
              <span className="bg-secondary text-primary font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full w-fit">
                {blog.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-primary leading-tight mt-4 mb-6">
                {blog.title}
              </h1>

              {/* Meta Details */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-charcoal/70 border-t border-b border-primary/5 py-4">
                {blog.author && (
                  <div>
                    By{" "}
                    <Link 
                      href={`/blogs?author=${encodeURIComponent(blog.author.name || "Summit Guide")}`}
                      className="text-primary font-bold hover:text-secondary transition"
                    >
                      {blog.author.name}
                    </Link>
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

            {/* Author Profile Box placed beautiful at the end of post */}
            {blog.author && (
              <div className="bg-white border border-secondary/12 shadow-md rounded-2xl p-6 md:p-8 flex flex-col gap-6 transition hover:shadow-lg duration-300">
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                  <Link 
                    href={`/blogs?author=${encodeURIComponent(blog.author.name || "Summit Guide")}`}
                    className="relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden bg-primary/10 border-2 border-secondary shrink-0 shadow-sm hover:scale-105 transition duration-300"
                  >
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
                  </Link>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <Link 
                        href={`/blogs?author=${encodeURIComponent(blog.author.name || "Summit Guide")}`}
                        className="font-serif font-black text-primary text-base md:text-lg hover:text-[#c8922a] transition duration-200"
                      >
                        {blog.author.name}
                      </Link>
                      <span className="text-[9px] text-secondary font-bold uppercase tracking-wider bg-secondary/10 px-2.5 py-0.5 rounded-full w-fit mx-auto sm:mx-0 select-none">
                        Himalayan Guide
                      </span>
                    </div>
                    {blog.author.bio && (
                      <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-light">
                        {blog.author.bio}
                      </p>
                    )}
                    <Link
                      href={`/blogs?author=${encodeURIComponent(blog.author.name || "Summit Guide")}`}
                      className="text-[11px] font-extrabold text-[#c8922a] hover:text-[#c8922a]/80 mt-1 flex items-center gap-1 transition w-fit mx-auto sm:mx-0"
                    >
                      <span>View all articles by {blog.author.name} →</span>
                    </Link>
                  </div>
                </div>

                {/* More from this Author Sub-Section inside Author Profile Card */}
                {otherBlogsByAuthor && otherBlogsByAuthor.length > 0 && (
                  <div className="border-t border-slate-100 pt-6 mt-2 flex flex-col gap-4 text-left">
                    <h5 className="font-serif font-black text-primary text-[14px]">
                      More Chronicles by {blog.author.name}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {otherBlogsByAuthor.map((othBlog) => (
                        <Link
                          key={othBlog.id}
                          href={`/blogs/${othBlog.slug}`}
                          className="group flex gap-3.5 bg-[#fdfdfc] hover:bg-white border border-secondary/10 hover:border-secondary/20 shadow-sm hover:shadow-md rounded-xl p-3 transition duration-300 items-center overflow-hidden"
                        >
                          {othBlog.coverImage && (
                            <div className="relative h-12 w-20 rounded-lg overflow-hidden shrink-0 bg-primary/10">
                              <img
                                src={getMediaUrl(othBlog.coverImage)}
                                alt={othBlog.title}
                                className="object-cover w-full h-full group-hover:scale-[1.03] transition duration-500"
                              />
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5 overflow-hidden">
                            <h6 className="font-serif font-bold text-primary group-hover:text-secondary transition text-xs leading-snug line-clamp-2">
                              {othBlog.title}
                            </h6>
                            <span className="text-[9px] text-charcoal/50">
                              {new Date(othBlog.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Related Treks Widget at the bottom */}
            {relatedTreksCard}

          </main>

        </div>

        {/* 1. Next / Previous Navigation Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-14 mb-10 max-w-7xl mx-auto">
          {prevBlog ? (
            <Link
              href={`/blogs/${prevBlog.slug}`}
              className="group bg-white border border-secondary/10 hover:border-secondary/20 shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col gap-1.5 transition-all duration-300"
            >
              <span className="text-[10px] text-secondary font-extrabold uppercase tracking-wider flex items-center gap-1">
                ← Read Previous
              </span>
              <span className="font-serif font-bold text-primary group-hover:text-secondary transition text-sm sm:text-base leading-snug line-clamp-1">
                {prevBlog.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block border border-dashed border-slate-200 rounded-2xl p-5" />
          )}

          {nextBlog ? (
            <Link
              href={`/blogs/${nextBlog.slug}`}
              className="group bg-white border border-secondary/10 hover:border-secondary/20 shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col gap-1.5 text-right transition-all duration-300"
            >
              <span className="text-[10px] text-secondary font-extrabold uppercase tracking-wider flex items-center gap-1 justify-end">
                Read Next →
              </span>
              <span className="font-serif font-bold text-primary group-hover:text-secondary transition text-sm sm:text-base leading-snug line-clamp-1">
                {nextBlog.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block border border-dashed border-slate-200 rounded-2xl p-5" />
          )}
        </div>

        {/* 2. Speak to an Expert Banner (Cinematic Background, Custom Profile, and CTA button) */}
        <div 
          className="relative rounded-3xl overflow-hidden py-6 px-6 md:py-8 text-center text-white border border-secondary/15 shadow-xl mb-10 z-10 max-w-7xl mx-auto"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(26,60,46,0.94), rgba(16,37,28,0.88)), url('/cinematic_footer_bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-2.5 animate-fadeIn">
            <div className="h-11 w-11 rounded-full overflow-hidden border border-secondary bg-white/10 flex items-center justify-center shadow-md shrink-0 text-secondary">
              <FaHeadset className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-secondary uppercase font-bold text-[9px] sm:text-[10px] tracking-[0.25em] block">
                Speak to an expert
              </span>
              <h3 className="font-serif font-black text-lg sm:text-xl md:text-2xl text-white leading-tight">
                Plan Smarter, Travel Better
              </h3>
              <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed font-light mt-0.5">
                Talk to our specialist <strong>{expertName}</strong> for customized advice, packing tips, and local updates on your next adventure in Nepal.
              </p>
            </div>
            
            <a
              href={`https://wa.me/${expertWhatsApp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-2 bg-white hover:bg-secondary text-primary hover:text-white font-sans font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer select-none"
            >
              <span>Schedule a call 📞</span>
            </a>
          </div>
        </div>

        {/* 3. Other Blogs / Similar Articles grid with beautiful custom border transition buttons */}
        {similarBlogs.length > 0 && (
          <div className="mb-14 max-w-7xl mx-auto">
            <h3 className="font-serif font-black text-primary text-xl md:text-2xl mb-6 text-center">
              Other Blogs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarBlogs.map((simBlog) => (
                <article
                  key={simBlog.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-secondary/10 shadow-md hover:shadow-lg transition-all duration-300 justify-between h-full"
                >
                  <div>
                    {/* Cover image */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary/10">
                      {simBlog.coverImage ? (
                        <img
                          src={getMediaUrl(simBlog.coverImage)}
                          alt={simBlog.title}
                          className="object-cover w-full h-full group-hover:scale-[1.03] transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 font-serif text-primary/30 text-xs">
                          Nature Heaven Chronicles
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-secondary text-primary font-bold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-md">
                        {simBlog.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col gap-2">
                      {/* Published Date */}
                      <span className="text-[10px] text-muted font-bold tracking-wider uppercase">
                        {new Date(simBlog.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>

                      <h4 className="font-serif font-bold text-primary group-hover:text-secondary transition text-sm leading-snug line-clamp-2">
                        {simBlog.title}
                      </h4>

                      <p className="text-xs text-charcoal/70 leading-relaxed line-clamp-3 font-light">
                        {simBlog.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Button: Custom border transition */}
                  <div className="px-5 pb-5 pt-2 mt-auto">
                    <Link
                      href={`/blogs/${simBlog.slug}`}
                      className="inline-flex items-center justify-center w-full py-2.5 border border-secondary hover:bg-secondary text-secondary hover:text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition duration-300 text-center"
                    >
                      Continue Reading
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 4. Plan Your Trip Like a Pro Newsletter Lead capture Block */}
        {(() => {
          const guide = blogSettings?.guideSettings || {
            title: "TRAVEL GUIDE",
            subtitle: "NEPAL 2026",
            badgeText: "SUMMIT GUIDE",
            footerText: "Nature Heaven Trekking",
            description: "Get our free travel guide packed with insider tips, hidden geographical gems, and essential equipment checklists. Save time, travel smarter, and make the most of your adventure."
          };
          return (
            <div 
              className="relative rounded-3xl overflow-hidden p-6 md:p-10 text-white border border-secondary/15 shadow-xl flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-7xl mx-auto"
              style={{
                backgroundImage: "linear-gradient(to right, rgba(20,45,35,0.96), rgba(10,22,17,0.92)), url('/cinematic_footer_bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              {/* Premium Book Cover Mockup */}
              <div className="relative w-40 h-56 bg-gradient-to-b from-[#132c20] to-[#0a1711] border border-white/15 rounded-l-md rounded-r-sm p-4 flex flex-col justify-between shadow-2xl shrink-0 select-none overflow-hidden group transition-all duration-500 ease-out hover:scale-[1.04] hover:-rotate-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {/* Book spine highlight */}
                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/35 to-transparent border-r border-white/5 z-20" />
                <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-white/10 z-20" />

                {/* Page edges effect */}
                <div className="absolute right-0 top-1 bottom-1 w-1 bg-gradient-to-b from-white/15 via-white/25 to-white/15 rounded-r z-10" />

                {/* Shine Sweep Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition duration-1500 ease-out pointer-events-none" />

                {/* Corner Ribbon */}
                <div className="absolute top-0 right-0 bg-secondary text-primary font-sans font-extrabold text-[8px] uppercase tracking-wider py-1 px-4 rotate-45 translate-x-3 translate-y-1 shadow-sm select-none z-20">
                  Free PDF
                </div>

                {/* Badge text */}
                <div className="text-[9px] text-secondary font-sans font-extrabold tracking-[0.25em] text-center w-full uppercase mt-1.5 z-10">
                  {guide.badgeText}
                </div>

                {/* Twin Peaks Mountain Silhouette Emblem */}
                <div className="w-10 h-10 rounded-full border border-secondary/25 bg-white/5 flex items-center justify-center mx-auto my-1.5 text-secondary shadow-inner z-10">
                  <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L1 21h22L12 2zm0 4l6.5 11.25H5.5L12 6zm-2 7l-2 3.5h4l-2-3.5z" />
                  </svg>
                </div>

                {/* Main Titles */}
                <div className="flex flex-col gap-0.5 text-center mt-auto mb-2 z-10">
                  <div className="font-serif text-[15px] font-black leading-tight text-white tracking-wide uppercase">
                    {guide.title}
                  </div>
                  <div className="h-[1.5px] w-6 bg-secondary mx-auto my-1.5" />
                  <div className="text-[9px] text-secondary font-bold tracking-widest uppercase">
                    {guide.subtitle}
                  </div>
                </div>

                {/* Footer Brand */}
                <div className="text-[8px] text-white/50 text-center font-sans tracking-wide leading-none border-t border-white/5 pt-2 z-10">
                  {guide.footerText}
                </div>
              </div>

              {/* Details & Newsletter Input */}
              <div className="flex-1 flex flex-col gap-4 text-center md:text-left w-full">
                <div className="flex flex-col gap-1">
                  <span className="text-secondary font-bold text-[10px] tracking-wider uppercase">Free Download</span>
                  <h3 className="font-serif font-black text-xl sm:text-3xl text-white leading-tight">
                    Plan Your Trip Like a Pro
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                    {guide.description}
                  </p>
                </div>

                {!subscribed ? (
                  <NewsletterForm 
                    onSuccess={(url) => {
                      setSubscribed(true);
                      setDownloadUrl(url);
                      if (url) {
                        // Open in new tab automatically
                        window.open(url, '_blank');
                      }
                    }} 
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md animate-fadeIn mt-2 justify-center md:justify-start">
                    <span className="text-sm font-semibold text-green-400 flex items-center gap-1.5 select-none">
                      <span className="text-base">✓</span> Subscribed Successfully!
                    </span>
                    {downloadUrl ? (
                      <a
                        href={downloadUrl}
                        download="Nepal_Travel_Guide.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-primary font-sans font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition duration-300 shadow cursor-pointer text-center hover:scale-105"
                      >
                        <FaDownload className="h-3 w-3" />
                        <span>Download PDF Guide</span>
                      </a>
                    ) : (
                      <span className="text-xs text-white/60">(Check your email for the guide details)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
