import Image from "next/image";
import Link from "next/link";
import {
  FaAward,
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaLeaf,
  FaSmile,
  FaMountain,
  FaCompass,
  FaCheck,
} from "react-icons/fa";
// Removed Sanity fetch – using internal API
import { Trek, BlogPost, Faq, Testimonial, Region } from "@/types";
import { getPayload } from "payload";
import { getMediaUrl } from "@/lib/cloudinary-loader";
import config from "@/payload/payload.config";
import TrekCard from "@/components/TrekCard";
import StatsCounter from "@/components/StatsCounter";
import HeroSearch from "@/components/HeroSearch";
import HeroVideo from "@/components/HeroVideo";
import VideoGallery from "@/components/VideoGallery";
import RegionGrid from "@/components/RegionGrid";
import ReviewPlatforms from "@/components/ReviewPlatforms";
import ExclusivePrivateTreks from "@/components/ExclusivePrivateTreks";
import PhotoGalleryMasonry from "@/components/PhotoGalleryMasonry";
import UpcomingDepartures from "@/components/UpcomingDepartures";
import FAQAccordion from "@/components/FAQAccordion";
import Affiliations from "@/components/Affiliations";
import { FadeInUp } from "@/components/FramerWrap";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let bestSellers: Trek[] = [];
  let regions: Region[] = [];
  let blogs: BlogPost[] = [];
  let faqs: Faq[] = [];
  let galleryItems: any[] = [];
  let siteSettings: any = null;
  let homepageSettings: any = null;

  try {
    const payload = await getPayload({ config });

    // 1. Fetch Best Sellers
    try {
      const bestSellersRes = await payload.find({
        collection: 'treks',
        where: {
          isBestSeller: {
            equals: true,
          },
        },
        depth: 1,
        limit: 6, // Limit best sellers to exactly 6 as requested
      });
      bestSellers = bestSellersRes.docs as unknown as Trek[];
    } catch (e: any) {
      console.warn("[Home Page] Failed to query treks/bestSellers collection:", e.message);
    }

    // 2. Fetch Regions
    try {
      const regionsRes = await payload.find({
        collection: 'regions',
        depth: 1,
        limit: 8,
      });
      regions = regionsRes.docs as unknown as Region[];
    } catch (e: any) {
      console.warn("[Home Page] Failed to query regions collection:", e.message);
    }

    // 3. Fetch Blogs
    try {
      const blogsRes = await payload.find({
        collection: 'blogPosts',
        depth: 1,
      });
      blogs = blogsRes.docs as unknown as BlogPost[];
    } catch (e: any) {
      console.warn("[Home Page] Failed to query blogPosts collection:", e.message);
    }

    // 4. Fetch FAQs
    try {
      const faqsRes = await payload.find({
        collection: 'faqs',
        where: {
          category: {
            equals: 'general',
          },
        },
        sort: 'order',
        depth: 1,
      });
      faqs = faqsRes.docs as unknown as Faq[];
    } catch (e: any) {
      console.warn("[Home Page] Failed to query faqs collection:", e.message);
    }

    // 5. Fetch Gallery
    try {
      const galleryRes = await payload.find({
        collection: 'gallery',
        depth: 2,
        limit: 30,
      });
      galleryItems = galleryRes.docs as any[];
    } catch (e: any) {
      console.warn("[Home Page] Failed to query gallery collection:", e.message);
    }

    // 6. Fetch Site Settings
    try {
      const siteSettingsRes = await payload.find({
        collection: 'siteSettings',
        depth: 2,
        limit: 1,
        overrideAccess: true, // Needed for SSG prerender (no authenticated user context)
      });
      siteSettings = siteSettingsRes.docs[0] as any;
    } catch (e: any) {
      console.warn("[Home Page] Failed to query siteSettings collection:", e.message);
    }

    // 7. Fetch Homepage Settings (singleton — drives the "Why Travel With Us"
    //    and "Exclusive Private Treks" sections). Falls back gracefully when
    //    no document exists so the page never breaks during early CMS setup.
    try {
      const homepageSettingsRes = await payload.find({
        collection: 'homepageSettings',
        depth: 2,
        limit: 1,
        overrideAccess: true,
      });
      homepageSettings = homepageSettingsRes.docs[0] as any;
    } catch (e: any) {
      console.warn("[Home Page] Failed to query homepageSettings collection:", e.message);
    }

  } catch (err: any) {
    console.warn("[Home Page] Failed to initialize Payload CMS:", err.message);
  }

  // Configure hero fields dynamically from CMS with absolute default fallbacks
  const heroHeadline = siteSettings?.heroHeadline || "Explore the Nepali Himalayas";
  const heroSubheadline = siteSettings?.heroSubheadline || "Private. Personalized. Unforgettable.";
  const heroVideoUrl = siteSettings?.heroVideoUrl || "/hero-bg.mp4";
  
  let heroImage = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200";
  if (siteSettings?.heroImage) {
    const mediaUrl = getMediaUrl(siteSettings.heroImage);
    if (mediaUrl) {
      heroImage = mediaUrl;
    }
  }

  // Set beautiful fallback images for database blogs that lack them
  const processedBlogs = blogs.map((blog) => {
    let coverImage = getMediaUrl(blog.coverImage);
    if (!coverImage) {
      const titleLower = (blog.title || "").toLowerCase();
      if (titleLower.includes("packing")) {
        coverImage = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800";
      } else {
        coverImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800";
      }
    }
    return {
      ...blog,
      coverImage,
    };
  });

  const mergedBlogs = processedBlogs;

  // Sort: featured blogs first, then by publishedAt descending
  const sortedBlogs = [...mergedBlogs].sort((a: any, b: any) => {
    const aFeat = a.isFeatured ? 1 : 0;
    const bFeat = b.isFeatured ? 1 : 0;
    if (aFeat !== bFeat) {
      return bFeat - aFeat;
    }
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });

  // Slice first 5 blogs for homepage preview
  const featuredBlogs = sortedBlogs.slice(0, 5) as unknown as BlogPost[];

  // -------------------------------------------------------------------------
  // Homepage Settings — graceful fallback to the original static design when
  // no CMS document has been created yet (so `npm run dev` on a fresh DB
  // still renders the beautiful homepage).
  // -------------------------------------------------------------------------
  const whyKicker = homepageSettings?.whyTravelKicker || "The Nature Heaven Standard";
  const whyTitle = homepageSettings?.whyTravelTitle || "Why Travel With Us?";
  const whyDescription =
    homepageSettings?.whyTravelDescription ||
    "We are a fully licensed, Nepal-based trekking operator. Unlike booking through multi-national agencies, you book directly with the local Sherpa operator, ensuring higher safety, fair porter treatment, and a 100% authentic journey.";
  const whyImageUrl =
    getMediaUrl(homepageSettings?.whyTravelImage) || "/Manaslu-Circuit-Trek.jpg";
  const whyBadgeIcon = homepageSettings?.whyTravelBadgeIcon || "🏆";
  const whyBadgeTitle =
    homepageSettings?.whyTravelBadgeTitle || "100% Native Sherpa Crew";
  const whyBadgeDescription =
    homepageSettings?.whyTravelBadgeDescription ||
    "Our guides are licensed, altitude-first-aid certified local mountain heroes.";

  const DEFAULT_WHY_FEATURES: Array<{ icon: string; title: string; description: string }> = [
    { icon: "award", title: "Award Winner", description: "Top-rated operator with TripAdvisor Choice Award." },
    { icon: "calendar", title: "Flexible Itinerary", description: "Change travel pace or routes mid-trek as needed." },
    { icon: "users", title: "Sherpa Guided", description: "Treks led by native high-altitude Sherpa climbers." },
    { icon: "shield", title: "Oxygen Supported", description: "Equipped with satellite communication and emergency oxygen." },
    { icon: "leaf", title: "Eco Trekking", description: "Zero single-use plastic, support local community libraries." },
    { icon: "smile", title: "100% Satisfaction", description: "Private tours average 5/5 stars rating by past clients." },
  ];
  const whyFeatures =
    homepageSettings?.whyTravelFeatures && homepageSettings.whyTravelFeatures.length > 0
      ? homepageSettings.whyTravelFeatures
      : DEFAULT_WHY_FEATURES;

  const WHY_ICON_MAP: Record<string, React.ReactNode> = {
    award: <FaAward className="h-5 w-5" />,
    calendar: <FaCalendarAlt className="h-5 w-5" />,
    users: <FaUsers className="h-5 w-5" />,
    shield: <FaShieldAlt className="h-5 w-5" />,
    leaf: <FaLeaf className="h-5 w-5" />,
    smile: <FaSmile className="h-5 w-5" />,
    mountain: <FaMountain className="h-5 w-5" />,
    compass: <FaCompass className="h-5 w-5" />,
    check: <FaCheck className="h-5 w-5" />,
  };

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative w-full h-screen min-h-[650px] flex flex-col justify-between items-center bg-primary overflow-hidden">
        {/* Background video / overlay */}
        <div className="absolute inset-0 z-0">
          {/* Hero image as LCP fallback behind the video */}
          <Image
            src={heroImage}
            alt="Everest Base Camp Hero"
            fill
            priority
            className="object-cover object-center scale-105"
            sizes="100vw"
            style={{ zIndex: 0 }}
            unoptimized
          />
          {/* YouTube background video + animated gradient fallback */}
          <HeroVideo videoUrl={heroVideoUrl} />
          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60 pointer-events-none" style={{ zIndex: 10 }} />
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 relative z-20 text-center flex flex-col gap-6 text-bgOffWhite items-center grow justify-center">
          <FadeInUp delay={0.1} className="hidden md:block">
            <span className="inline-flex items-center gap-1.5 bg-secondary text-primary font-sans font-bold text-xs tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-secondary/25 shadow-lg">
              🏔️ Nepal&apos;s #1 Private Trekking Company
            </span>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl font-black max-w-5xl leading-[1.1] tracking-tight">
              {heroHeadline.includes("Nepali Himalayas") ? (
                <>
                  {heroHeadline.split("Nepali Himalayas")[0]}
                  <span className="text-secondary text-glow">Nepali Himalayas</span>
                  {heroHeadline.split("Nepali Himalayas")[1]}
                </>
              ) : (
                heroHeadline
              )}
            </h1>
          </FadeInUp>

          <FadeInUp delay={0.3} className="hidden md:block">
            <p className="font-sans text-lg sm:text-xl md:text-2xl text-bgOffWhite/90 max-w-2xl font-light tracking-wide">
              {heroSubheadline}
            </p>
          </FadeInUp>

          {/* Dynamic Search Bar */}
          <FadeInUp delay={0.4} className="w-full">
            <HeroSearch />
          </FadeInUp>

          {/* Quick CTAs */}
          <FadeInUp delay={0.5} className="hidden md:flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Link
              href="/trips"
              className="w-full sm:w-auto bg-secondary text-primary font-bold px-8 py-3.5 rounded-xl border border-secondary hover:bg-transparent hover:text-secondary hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Explore All Treks
            </Link>
            <Link
              href="/contact-us"
              className="w-full sm:w-auto bg-transparent text-bgOffWhite border border-bgOffWhite/50 hover:bg-bgOffWhite hover:text-primary font-bold px-8 py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Talk to an Expert
            </Link>
          </FadeInUp>
        </div>

        {/* Bottom Elements */}
        <div className="hidden md:flex w-full relative z-20 flex flex-col items-center mt-6 shrink-0">
          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-1 text-bgOffWhite/60 animate-bounce mb-4">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold">Scroll</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </div>

          {/* Stats Bar (Transparent Overlay) */}
          <StatsCounter transparent={true} />
        </div>
      </section>

      {/* 3. Best Seller Treks */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#fcfbfa]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
              Top Rated Experiences
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
              Best Selling Treks
            </h2>
            <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
            <p className="text-sm md:text-base text-charcoal/80">
              Our award-winning private treks are customized for safety, altitude adaptation, and incredible views of high-altitude Himalayan massifs.
            </p>
          </div>

          {/* Cards Grid (Slider on mobile, grid on desktop) */}
          <div className="flex overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 -mx-4 px-4 md:mx-0 md:px-0">
            {bestSellers.map((trek: Trek, index: number) => (
              <div key={trek._id || index} className="w-[290px] md:w-full shrink-0 snap-align-start flex flex-col">
                <TrekCard trek={trek} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 text-primary font-bold border-b-2 border-secondary hover:text-secondary transition duration-300 pb-1"
            >
              <span>View All Trek Packages</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Region Grid */}
      <RegionGrid regions={regions} />

      {/* 5. Why Choose Us (Split Layout) — CMS-driven, falls back to defaults */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white border-y border-secondary/15">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image Card */}
          <FadeInUp className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-secondary/10">
            <Image
              src={whyImageUrl}
              alt={whyBadgeTitle}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
            {/* Embedded Badge */}
            <div className="absolute bottom-2 left-2 right-2 md:bottom-6 md:left-6 md:right-6 bg-primary/90 backdrop-blur-md p-2 md:p-6 rounded-xl border border-secondary/20 flex gap-1.5 md:gap-4 text-bgOffWhite items-center md:items-start">
              <span className="text-lg md:text-4xl text-secondary shrink-0">{whyBadgeIcon}</span>
              <div>
                <h4 className="font-serif font-bold text-[10px] md:text-lg leading-tight">{whyBadgeTitle}</h4>
                <p className="hidden md:block text-xs text-bgOffWhite/80 mt-1">{whyBadgeDescription}</p>
              </div>
            </div>
          </FadeInUp>

          {/* Right: Feature List */}
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
                {whyKicker}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary">
                {whyTitle}
              </h2>
              <div className="h-0.5 w-16 bg-secondary mt-4 mb-6"></div>
              <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">
                {whyDescription}
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyFeatures.map((feat: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
                    {WHY_ICON_MAP[feat.icon] || WHY_ICON_MAP.award}
                  </span>
                  <div>
                    <h4 className="font-bold text-primary text-sm md:text-base">{feat.title}</h4>
                    <p className="text-xs text-charcoal/70 mt-1">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Review Platforms */}
      <ReviewPlatforms platforms={siteSettings?.reviewPlatforms} />

      {/* 7. Exclusive Private Treks — CMS-driven, falls back to defaults */}
      <ExclusivePrivateTreks
        kicker={homepageSettings?.privateTreksKicker}
        title={homepageSettings?.privateTreksTitle}
        description={homepageSettings?.privateTreksDescription}
        usps={homepageSettings?.privateTreksUSPs}
      />

      {/* 8. Video Gallery */}
      <VideoGallery />

      {/* 9. Photo Gallery (Happy Moments Masonry) */}
      <PhotoGalleryMasonry items={galleryItems} limit={6} showViewAll={true} />

      {/* 10. Upcoming Departures */}
      <UpcomingDepartures />

      {/* 11. Blog Preview Grid */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white border-t border-b border-secondary/10">
        <div className="max-w-7xl mx-auto">
          
          {/* Split Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-2 block">
                Himalayan Chronicles
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-black text-primary leading-tight">
                Explore our Travel Blog
              </h2>
              <p className="text-sm md:text-base text-charcoal/70 leading-relaxed mt-2">
                Explore our blog for trusted trekking insights across Nepal: from beginner-friendly tips and route breakdowns to expert guidance for seasoned high-altitude adventurers.
              </p>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 border border-secondary text-primary hover:text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 self-start md:self-end"
            >
              <span>Explore more blogs</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
              </svg>
            </Link>
          </div>

          {/* Desktop Split Layout */}
          {featuredBlogs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Big Featured Card */}
              <div className="lg:col-span-7 flex animate-fadeIn">
                {(() => {
                  const mainBlog = featuredBlogs[0];
                  const mainBlogUrl = `/blogs/${mainBlog.slug}`;
                  return (
                    <Link
                      href={mainBlogUrl}
                      className="group relative w-full rounded-2xl overflow-hidden shadow-lg border border-secondary/10 flex flex-col justify-end p-6 sm:p-8 min-h-[350px] lg:min-h-[450px]"
                    >
                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-10 transition duration-300 group-hover:from-black/95" />
                      
                      {/* Cover Image */}
                      {mainBlog.coverImage && (
                        <Image
                          src={mainBlog.coverImage}
                          alt={mainBlog.title || 'Blog post cover image'}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500 z-0"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                      )}

                      {/* Content Overlay */}
                      <div className="relative z-20 flex flex-col gap-2">
                        <span className="text-secondary font-bold text-[10px] tracking-widest uppercase flex items-center gap-2">
                          <span>{mainBlog.category}</span>
                          <span>|</span>
                          <span>
                            {new Date(mainBlog.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </span>
                        
                        <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug group-hover:text-secondary transition duration-300">
                          {mainBlog.title}
                        </h3>
                        
                        <p className="text-xs text-bgOffWhite/80 line-clamp-2 mt-1 font-light leading-relaxed">
                          {mainBlog.excerpt}
                        </p>
                      </div>
                    </Link>
                  );
                })()}
              </div>

              {/* Right Column: Four Stacked Smaller Horizontal Cards (Compact Layout) */}
              <div className="lg:col-span-5 flex flex-col gap-3.5 justify-start">
                {featuredBlogs.slice(1, 5).map((blog: BlogPost, idx: number) => {
                  const blogUrl = `/blogs/${blog.slug}`;
                  return (
                    <Link
                      key={blog._id || idx}
                      href={blogUrl}
                      className="group flex gap-3.5 items-center bg-bgOffWhite/10 hover:bg-bgOffWhite/45 border border-secondary/5 hover:border-secondary/15 p-2.5 rounded-xl transition duration-300"
                    >
                      {/* Small Thumbnail */}
                      <div className="relative w-24 sm:w-28 aspect-[16/10] rounded-lg overflow-hidden shrink-0 bg-primary/10">
                        {blog.coverImage && (
                          <Image
                            src={blog.coverImage}
                            alt={blog.title || 'Blog post thumbnail'}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                            sizes="(max-width: 640px) 100px, 120px"
                          />
                        )}
                      </div>

                      {/* Info on Right */}
                      <div className="flex flex-col gap-1.5 overflow-hidden">
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-charcoal/50 font-bold uppercase tracking-wider">
                          <span>📍</span>
                          <span>{blog.category}</span>
                          <span>•</span>
                          <span>
                            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        
                        <h4 className="font-serif font-black text-primary group-hover:text-secondary transition text-sm sm:text-base leading-snug line-clamp-2">
                          {blog.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 11.5 Featured Travel Info Pages */}
      {siteSettings?.featuredTravelInfo && siteSettings.featuredTravelInfo.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-6 bg-[#f8f5f0] border-b border-secondary/10">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
                Essential Trip Guides
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
                Himalayan Travel Preparation
              </h2>
              <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
              <p className="text-sm md:text-base text-charcoal/80">
                Read local guidelines, visa policies, packing tips, and acclimatization strategies prepared by our native Sherpa team.
              </p>
            </div>

            {/* Travel Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteSettings.featuredTravelInfo.map((page: any, idx: number) => {
                const coverImage = page.heroImage?.url || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800";
                return (
                  <Link
                    key={page.id || idx}
                    href={`/travel-info/${page.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-secondary/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full animate-fadeIn"
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary/10">
                      <Image
                        src={coverImage}
                        alt={page.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between grow gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-serif font-black text-primary text-lg sm:text-xl group-hover:text-secondary transition duration-300 leading-snug">
                          {page.title}
                        </h3>
                        {page.excerpt && (
                          <p className="text-xs sm:text-sm text-charcoal/70 line-clamp-3 leading-relaxed font-light font-sans">
                            {page.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-xs text-secondary font-bold uppercase tracking-wider group-hover:gap-2.5 transition-all duration-300 pt-2 border-t border-gray-50 self-start">
                        <span>Read full guide</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 12. FAQ Accordion */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#fcfbfa]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
              Frequently Asked Questions
            </h2>
            <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
            <p className="text-sm md:text-base text-charcoal/80">
              Clear, transparent answers about trekking permits, high-altitude acclimatization, booking terms, and flight bookings in Nepal.
            </p>
          </div>

          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* 13. Affiliations */}
      <Affiliations />
    </div>
  );
}
