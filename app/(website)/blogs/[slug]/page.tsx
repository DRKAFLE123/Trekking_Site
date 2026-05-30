import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { renderLexical, extractHeadings } from "@/lib/lexical-renderer";
import { getMediaUrl } from "@/lib/cloudinary-loader";
import BlogDetailClient from "@/components/BlogDetailClient";

export const revalidate = 60; // Revalidate every minute

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

const defaultBlogs = [
  {
    id: "db1",
    title: "Ultimate Guide to Everest Base Camp Altitude Adaptation",
    category: "Trekking Guides",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
    excerpt: "Acclimatization is key to a successful Everest trek. Learn how to climb high, sleep low, and pace yourself like a professional mountain guide.",
    publishedAt: "2026-05-15T00:00:00.000Z",
    readTime: "6 min read",
    slug: "everest-base-camp-acclimatization-guide"
  },
  {
    id: "db2",
    title: "Best Trekking Seasons in Nepal: When to Go",
    category: "Travel Info",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
    excerpt: "Should you trek in Spring or Autumn? We break down the weather patterns, trail crowds, and photography conditions for every season in the Himalayas.",
    publishedAt: "2026-05-10T00:00:00.000Z",
    readTime: "5 min read",
    slug: "best-trekking-seasons-in-nepal"
  },
  {
    id: "db3",
    title: "How to Choose Between Everest and Annapurna Circuits",
    category: "Comparison",
    coverImage: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=800",
    excerpt: "Deciding between the two most iconic treks in the world? We compare the altitude profiles, tea house cultures, and scenery to help you choose.",
    publishedAt: "2026-05-02T00:00:00.000Z",
    readTime: "8 min read",
    slug: "everest-vs-annapurna-circuit"
  },
  {
    id: "db4",
    title: "Nepal Trekking Packing List: Essential Gear Guide",
    category: "Trekking Guides",
    coverImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800",
    excerpt: "What should you pack for a high-altitude Himalayan trek? Here is our comprehensive gear checklist, covering clothing layers, boots, sleeping bags, and medicine.",
    publishedAt: "2026-04-20T00:00:00.000Z",
    readTime: "7 min read",
    slug: "nepal-trekking-packing-list-guide"
  },
  {
    id: "db5",
    title: "Manaslu Circuit Trek: Complete Preparation & Permit Guide",
    category: "Trekking Guides",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    excerpt: "All you need to know about the special restricted area permit for the Manaslu region, and physical training recommendations for Larke La Pass.",
    publishedAt: "2026-04-10T00:00:00.000Z",
    readTime: "6 min read",
    slug: "manaslu-circuit-trek-preparation"
  }
];

const defaultBlogBodies: Record<string, any[]> = {
  "everest-base-camp-acclimatization-guide": [
    {
      _type: "block",
      style: "h2",
      children: [{ text: "The Golden Rule of Acclimatization" }]
    },
    {
      _type: "block",
      children: [{ text: "Climb high, sleep low. During the trek, your body adapts to lower oxygen levels at night by producing more red blood cells. By hiking up to a higher altitude during the day and descending to a lower point to sleep, you stimulate this adaptation process safely without putting continuous stress on your body." }]
    },
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Stay Hydrated and Maintain Nutrition" }]
    },
    {
      _type: "block",
      children: [{ text: "You lose moisture rapidly in cold, dry mountain air. Drink at least 4 to 5 liters of purified water daily. Dal Bhat, the traditional Nepalese lentil and rice dish, is highly recommended as it provides sustained carbohydrates and protein to fuel your daily hikes." }]
    },
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Listen to Your Body's Warning Signs" }]
    },
    {
      _type: "block",
      children: [{ text: "Do not ignore symptoms like mild headaches, dizziness, or shortness of breath. Inform your guide immediately. It's better to rest or take a slow pace than to ignore symptoms and risk high-altitude cerebral or pulmonary edema." }]
    }
  ],
  "best-trekking-seasons-in-nepal": [
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Autumn Season (September to November)" }]
    },
    {
      _type: "block",
      children: [{ text: "Autumn is widely considered the absolute peak trekking season in Nepal. Post-monsoon, the air is clean, the weather is extremely stable, and visibility is crystal clear, offering pristine views of the snowy peaks. Nights are cold but days are comfortably warm." }]
    },
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Spring Season (March to May)" }]
    },
    {
      _type: "block",
      children: [{ text: "Spring is the second best season, marked by blooming rhododendrons and wild mountain flowers. Temperatures are slightly warmer than autumn, though clear skies are most consistent in the mornings with afternoon clouds being more common." }]
    },
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Monsoon and Winter Off-Seasons" }]
    },
    {
      _type: "block",
      children: [{ text: "Winter (December to February) brings freezing temperatures and heavy snow at high altitude, though lower trails are clear and quiet. Monsoon (June to August) is wet and humid with leeches, but ideal for rain-shadow areas like Upper Mustang." }]
    }
  ],
  "everest-vs-annapurna-circuit": [
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Altitude Profile and Terrain Differences" }]
    },
    {
      _type: "block",
      children: [{ text: "Everest Base Camp takes you straight up into high-altitude terrain quickly, reaching 5,364m at base camp and 5,555m at Kala Patthar. The Annapurna Circuit has a more gradual ascent, though you cross the legendary Thorong La Pass at 5,416m, descending into the holy temples of Muktinath." }]
    },
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Cultural Highlights of EBC vs Annapurna" }]
    },
    {
      _type: "block",
      children: [{ text: "EBC is deep in Sherpa country, rich in Buddhist monasteries (like Tengboche) and prayer flags. The Annapurna Circuit offers a wider variety of cultures, passing through Hindu farming villages at lower altitudes to Tibetan-Buddhist settlements in Manang." }]
    },
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Scenery and Trail Dynamics" }]
    },
    {
      _type: "block",
      children: [{ text: "Everest is dramatic, raw, and dominated by towering giants like Ama Dablam and Lhotse. Annapurna is highly diverse, featuring lush green river valleys, deep gorges, pine forests, and dry rain-shadow plains." }]
    }
  ],
  "nepal-trekking-packing-list-guide": [
    {
      _type: "block",
      style: "h2",
      children: [{ text: "High-Quality Layering System" }]
    },
    {
      _type: "block",
      children: [{ text: "Moisture-wicking baselayers, insulating fleece mid-layers, and a heavy wind/waterproof outer shell are essential. A premium down jacket rated for sub-zero temperatures is mandatory for cold nights." }]
    },
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Footwear and Extremity Protection" }]
    },
    {
      _type: "block",
      children: [{ text: "Break in sturdy, waterproof hiking boots before arriving. Pack multiple pairs of wool trekking socks, a warm beanie, UV sunglasses, and lightweight gloves." }]
    },
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Essential Accessories and Gear" }]
    },
    {
      _type: "block",
      children: [{ text: "A 40-50L backpack, a sleeping bag rated for -15°C, sturdy trekking poles, water purification tablets, and a basic medical kit with Diamox (altitude medicine)." }]
    }
  ],
  "manaslu-circuit-trek-preparation": [
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Restricted Area Permit Requirements" }]
    },
    {
      _type: "block",
      children: [{ text: "Manaslu requires a special Restricted Area Permit (RAP), which can only be obtained through a registered Nepalese agency with a minimum of two trekkers and an authorized guide. Passports must be submitted in Kathmandu." }]
    },
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Crossing the Larkya La Pass (5,106m)" }]
    },
    {
      _type: "block",
      children: [{ text: "Larkya La is one of the most challenging high passes in the Himalayas. Strong physical preparation, cardiovascular training, and leg strength conditioning starting 2-3 months prior are crucial." }]
    },
    {
      _type: "block",
      style: "h2",
      children: [{ text: "Tea House Conditions and Infrastructure" }]
    },
    {
      _type: "block",
      children: [{ text: "Manaslu is less crowded and more authentic than Everest, meaning tea houses are slightly more basic. Power, hot water, and internet are limited at higher altitudes." }]
    }
  ]
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "blogPosts",
      where: { slug: { equals: slug } },
      depth: 1,
    });
    const blog = (res.docs[0] || null) as unknown as BlogPost | null;

    if (!blog) {
      const matchedDefault = defaultBlogs.find(b => b.slug === slug);
      if (matchedDefault) {
        return {
          title: `${matchedDefault.title} | Nature Heaven Chronicles`,
          description: matchedDefault.excerpt,
        };
      }
      return {
        title: "Article Not Found | Nature Heaven Trekking & Expedition",
      };
    }

    return {
      title: `${blog.title} | Nature Heaven Chronicles`,
      description: blog.excerpt,
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

  try {
    const payload = await getPayload({ config });
    const [res, siteSettingsRes, allBlogsRes] = await Promise.all([
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
      })
    ]);

    blog = (res.docs[0] || null) as unknown as BlogPost | null;
    siteSettings = siteSettingsRes.docs[0] || null;
    allBlogs = allBlogsRes.docs as unknown as BlogPost[];
  } catch (err: any) {
    console.warn("[Blog Detail Page] Failed to query blog details:", err.message);
  }

  // Fallback to default blogs if the database is empty
  const blogsList = allBlogs && allBlogs.length > 0 ? allBlogs : (defaultBlogs as unknown as BlogPost[]);

  if (!blog) {
    const matchedDefault = defaultBlogs.find(b => b.slug === slug);
    if (matchedDefault) {
      blog = {
        ...matchedDefault,
        body: defaultBlogBodies[slug] || "This is default content for the blog post.",
        author: {
          name: "Summit Guide",
          bio: "Himalayan leader with 10+ years of experience in high altitude guiding and logistics.",
          photo: null
        },
        relatedTreks: []
      } as any;
    }
  }

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
    />
  );
}
