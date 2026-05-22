import Image from "next/image";
import Link from "next/link";
import { FaAward, FaCalendarAlt, FaUsers, FaShieldAlt, FaLeaf, FaSmile } from "react-icons/fa";
// Removed Sanity fetch – using internal API
import { Trek, BlogPost, Faq, Testimonial, Region } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import TrekCard from "@/components/TrekCard";
import StatsCounter from "@/components/StatsCounter";
import HeroSearch from "@/components/HeroSearch";
import HeroVideo from "@/components/HeroVideo";
import VideoGallery from "@/components/VideoGallery";
import RegionGrid from "@/components/RegionGrid";
import ReviewPlatforms from "@/components/ReviewPlatforms";
import ExclusivePrivateTreks from "@/components/ExclusivePrivateTreks";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import UpcomingDepartures from "@/components/UpcomingDepartures";
import FAQAccordion from "@/components/FAQAccordion";
import Affiliations from "@/components/Affiliations";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/FramerWrap";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const payload = await getPayload({ config });
  
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

  const regionsRes = await payload.find({
    collection: 'regions',
    depth: 1,
    limit: 6,
  });

  const blogsRes = await payload.find({
    collection: 'blogPosts',
    depth: 1,
  });

  const faqsRes = await payload.find({
    collection: 'faqs',
    depth: 1,
  });

  const testimonialsRes = await payload.find({
    collection: 'testimonials',
    depth: 1,
  });

  const bestSellers = bestSellersRes.docs as unknown as Trek[];
  const regions = regionsRes.docs as unknown as Region[];
  const blogs = blogsRes.docs as unknown as BlogPost[];
  const faqs = faqsRes.docs as unknown as Faq[];
  const testimonials = testimonialsRes.docs as unknown as Testimonial[];

  // Slice first 3 blogs for homepage preview
  const featuredBlogs = blogs.slice(0, 3);


  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[95vh] min-h-[600px] flex items-center justify-center bg-primary overflow-hidden">
        {/* Background video / overlay */}
        <div className="absolute inset-0 z-0">
          {/* Hero image as LCP fallback behind the video */}
          <Image
  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200"
  alt="Everest Base Camp Hero"
  fill
  priority
  className="object-cover object-center scale-105"
  sizes="100vw"
  style={{ zIndex: 0 }}
/>
          {/* YouTube background video + animated gradient fallback */}
          <HeroVideo />
          {/* Dark overlay for text contrast */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-primary/70 pointer-events-none" style={{ zIndex: 10 }} />
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 relative z-20 text-center flex flex-col gap-6 text-bgOffWhite items-center">
          <FadeInUp delay={0.1}>
            <span className="inline-flex items-center gap-1.5 bg-secondary text-primary font-sans font-bold text-xs tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-secondary/25 shadow-lg">
              🏔️ Nepal&apos;s #1 Private Trekking Company
            </span>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-black max-w-5xl leading-[1.1] tracking-tight">
              Explore the <span className="text-secondary text-glow">Nepali Himalayas</span>
            </h1>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <p className="font-sans text-lg sm:text-xl md:text-2xl text-bgOffWhite/90 max-w-2xl font-light tracking-wide">
              Private. Personalized. Unforgettable.
            </p>
          </FadeInUp>

          {/* Dynamic Search Bar */}
          <FadeInUp delay={0.4} className="w-full">
            <HeroSearch />
          </FadeInUp>

          {/* Quick CTAs */}
          <FadeInUp delay={0.5} className="flex flex-col sm:flex-row items-center gap-4 mt-2">
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-bgOffWhite/60 animate-bounce">
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold">Scroll</span>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
          </svg>
        </div>
      </section>

      {/* 2. Stats Bar */}
      <StatsCounter />

      {/* 3. Best Seller Treks */}
      <section className="py-24 px-6 bg-[#fcfbfa]">
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

          {/* Cards Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((trek: Trek, index: number) => (
              <StaggerItem key={trek._id || index}>
                <TrekCard trek={trek} />
              </StaggerItem>
            ))}
          </StaggerContainer>

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

      {/* 5. Why Choose Us (Split Layout) */}
      <section className="py-24 px-6 bg-white border-y border-secondary/15">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image Card */}
          <FadeInUp className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-secondary/10">
            <Image
              src="/general/why_us_photo"
              alt="Himalayan guides and trekkers"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Embedded Badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-primary/90 backdrop-blur-md p-6 rounded-xl border border-secondary/20 flex gap-4 text-bgOffWhite">
              <span className="text-4xl text-secondary">🏆</span>
              <div>
                <h4 className="font-serif font-bold text-lg">100% Native Sherpa Crew</h4>
                <p className="text-xs text-bgOffWhite/80 mt-1">Our guides are licensed, altitude-first-aid certified local mountain heroes.</p>
              </div>
            </div>
          </FadeInUp>

          {/* Right: Feature List */}
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
                The Nature Heaven Standard
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary">
                Why Travel With Us?
              </h2>
              <div className="h-0.5 w-16 bg-secondary mt-4 mb-6"></div>
              <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">
                We are a fully licensed, Nepal-based trekking operator. Unlike booking through multi-national agencies, you book directly with the local Sherpa operator, ensuring higher safety, fair porter treatment, and a 100% authentic journey.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Award Winner */}
              <div className="flex items-start gap-3">
                <span className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
                  <FaAward className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-bold text-primary text-sm md:text-base">Award Winner</h4>
                  <p className="text-xs text-charcoal/70 mt-1">Top-rated operator with TripAdvisor Choice Award.</p>
                </div>
              </div>

              {/* Flexible Itineraries */}
              <div className="flex items-start gap-3">
                <span className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
                  <FaCalendarAlt className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-bold text-primary text-sm md:text-base">Flexible Itinerary</h4>
                  <p className="text-xs text-charcoal/70 mt-1">Change travel pace or routes mid-trek as needed.</p>
                </div>
              </div>

              {/* Local Experts */}
              <div className="flex items-start gap-3">
                <span className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
                  <FaUsers className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-bold text-primary text-sm md:text-base">Sherpa Guided</h4>
                  <p className="text-xs text-charcoal/70 mt-1">Treks led by native high-altitude Sherpa climbers.</p>
                </div>
              </div>

              {/* Safe & Supported */}
              <div className="flex items-start gap-3">
                <span className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
                  <FaShieldAlt className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-bold text-primary text-sm md:text-base">Oxygen Supported</h4>
                  <p className="text-xs text-charcoal/70 mt-1">Equipped with satellite communication and emergency oxygen.</p>
                </div>
              </div>

              {/* Sustainable Travel */}
              <div className="flex items-start gap-3">
                <span className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
                  <FaLeaf className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-bold text-primary text-sm md:text-base">Eco Trekking</h4>
                  <p className="text-xs text-charcoal/70 mt-1">Zero single-use plastic, support local community libraries.</p>
                </div>
              </div>

              {/* Happiness Guaranteed */}
              <div className="flex items-start gap-3">
                <span className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
                  <FaSmile className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-bold text-primary text-sm md:text-base">100% Satisfaction</h4>
                  <p className="text-xs text-charcoal/70 mt-1">Private tours average 5/5 stars rating by past clients.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. Review Platforms */}
      <ReviewPlatforms />

      {/* 7. Exclusive Private Treks */}
      <ExclusivePrivateTreks />

      {/* 8. Video Gallery */}
      <VideoGallery />

      {/* 9. Testimonials Marquee */}
      <TestimonialMarquee testimonials={testimonials} />

      {/* 10. Upcoming Departures */}
      <UpcomingDepartures />

      {/* 11. Blog Preview Grid */}
      <section className="py-24 px-6 bg-white border-t border-b border-secondary/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
              Himalayan Chronicles
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-primary">
              Latest Travel Guides & News
            </h2>
            <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
            <p className="text-sm md:text-base text-charcoal/80">
              Read pro trekking advice, gear checklists, difficulty guides, and weather reports written directly by our mountain leaders.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBlogs.map((blog: BlogPost, idx: number) => (
              <div
                key={blog._id || idx}
                className="group flex flex-col bg-bgOffWhite rounded-xl overflow-hidden border border-secondary/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Cover image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary/10">
                  {blog.coverImage && (
                    <Image
                      src={blog.coverImage}
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

                {/* Body details */}
                <div className="p-5 flex flex-col justify-between grow">
                  <div className="flex flex-col gap-2.5">
                    {/* Meta */}
                    <div className="flex items-center gap-2 text-[10px] text-muted tracking-wider uppercase font-semibold">
                      <span>{new Date(blog.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
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
                    <span>Read More</span>
                    <span className="group-hover/link:translate-x-1 transition duration-300">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-primary font-bold border-b-2 border-secondary hover:text-secondary transition duration-300 pb-1"
            >
              <span>View All Blog Articles</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 12. FAQ Accordion */}
      <section className="py-24 px-6 bg-[#fcfbfa]">
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
