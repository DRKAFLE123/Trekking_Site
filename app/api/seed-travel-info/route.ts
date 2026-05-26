import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload/payload.config';

const topics = [
  { title: "Travel Guide for Nepal", slug: "travel-guide-for-nepal", excerpt: "Your comprehensive guide to traveling in Nepal, covering everything from arriving in Kathmandu to trekking in the high Himalayas." },
  { title: "Why Travel to Nepal?", slug: "why-travel-to-nepal", excerpt: "Discover the breathtaking landscapes, rich culture, and warm hospitality that make Nepal a must-visit destination for adventurers and spiritual seekers alike." },
  { title: "Regions in Nepal", slug: "regions-in-nepal", excerpt: "Explore the diverse geographical regions of Nepal: the towering Himalayas, the rolling hills, and the lush Terai plains." },
  { title: "Attractions in Nepal", slug: "attractions-in-nepal", excerpt: "From ancient temples in Kathmandu Valley to the serene lakes of Pokhara and the wildlife of Chitwan National Park." },
  { title: "Guides Mandatory for Trekkers", slug: "guides-mandatory-for-trekkers", excerpt: "Information on the new regulations regarding mandatory guides for foreign trekkers in Nepal's national parks and conservation areas." },
  { title: "Accommodation in Nepal", slug: "accommodation-in-nepal", excerpt: "Learn about the types of accommodation available, from luxury hotels in the cities to traditional teahouses on the trekking trails." },
  { title: "Altitude Acclimatization", slug: "altitude-acclimatization", excerpt: "Crucial information on preventing Acute Mountain Sickness (AMS) and safely acclimatizing while trekking in the Himalayas." },
  { title: "Getting to Nepal & Visas", slug: "getting-to-nepal-and-visas", excerpt: "Everything you need to know about flying into Kathmandu and obtaining your Nepal tourist visa on arrival." },
  { title: "Private Treks in Nepal", slug: "private-treks-in-nepal", excerpt: "Benefits of booking a private trek tailored to your schedule, pace, and specific interests." },
  { title: "Currency & Payments", slug: "currency-and-payments", excerpt: "Understanding the Nepalese Rupee (NPR), ATMs, credit cards, and how much cash to bring on a trek." },
  { title: "Facts About Mt. Everest", slug: "facts-about-mt-everest", excerpt: "Fascinating geographical, historical, and cultural facts about the highest mountain in the world, Sagarmatha." },
  { title: "Food and Beverages", slug: "food-and-beverages", excerpt: "What to expect regarding meals in Nepal: the staple Dal Bhat, momos, and eating safely while on the trail." },
  { title: "Safety While Travelling", slug: "safety-while-travelling", excerpt: "Tips on staying healthy, drinking safe water, avoiding scams, and emergency protocols in Nepal." },
  { title: "Transportation in Nepal", slug: "transportation-in-nepal", excerpt: "Navigating Nepal via domestic flights, tourist buses, private jeeps, and local transport." },
  { title: "Travel Insurance", slug: "travel-insurance", excerpt: "Why comprehensive travel insurance covering high-altitude helicopter rescue is absolutely essential." },
  { title: "Trekking Permits & Fees", slug: "trekking-permits-and-fees", excerpt: "A guide to TIMS cards, National Park entry fees, and restricted area permits required for trekking." },
  { title: "Weather & Climate", slug: "weather-and-climate", excerpt: "A breakdown of Nepal's four distinct seasons and how they affect travel and trekking conditions." },
  { title: "What to Do Before Coming", slug: "what-to-do-before-coming", excerpt: "A comprehensive packing list and physical preparation guide before your Himalayan adventure." },
  { title: "When to Come to Nepal?", slug: "when-to-come-to-nepal", excerpt: "Find out the best times of year to visit Nepal for trekking, cultural tours, and wildlife safaris." },
];

function generatePlaceholderContent(title: string) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "heading",
          tag: "h2",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: `Overview of ${title}`,
              version: 1,
            },
          ],
        },
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: `This is the default content for the ${title} page. Nepal is a country of highly diverse and rich geography, culture, and religions. The mountainous north has eight of the world's ten tallest mountains, including the highest point on Earth, Mount Everest.`,
              version: 1,
            },
          ],
        },
        {
          type: "heading",
          tag: "h3",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "Key Information",
              version: 1,
            },
          ],
        },
        {
          type: "list",
          listType: "bullet",
          start: 1,
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "listitem",
              format: "",
              indent: 0,
              version: 1,
              value: 1,
              children: [
                {
                  type: "text",
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Information point 1 regarding this topic.",
                  version: 1,
                },
              ],
            },
            {
              type: "listitem",
              format: "",
              indent: 0,
              version: 1,
              value: 2,
              children: [
                {
                  type: "text",
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Information point 2 providing further details.",
                  version: 1,
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              detail: 0,
              format: 2, // italic
              mode: "normal",
              style: "",
              text: "Please login to the Payload CMS admin panel to edit this content, add images, and provide detailed information for your travelers.",
              version: 1,
            },
          ],
        },
      ],
    },
  };
}

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config });
    let createdCount = 0;

    for (const topic of topics) {
      // Check if it already exists
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: topic.slug } },
      });

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'pages',
          data: {
            title: topic.title,
            slug: topic.slug,
            excerpt: topic.excerpt,
            content: generatePlaceholderContent(topic.title) as any,
          },
        });
        createdCount++;
      }
    }

    return NextResponse.json({
      message: `Successfully checked ${topics.length} topics. Created ${createdCount} new pages.`,
      success: true,
    });
  } catch (error: any) {
    console.error("Error seeding travel info pages:", error);
    return NextResponse.json({ error: error.message || "Failed to seed pages" }, { status: 500 });
  }
}
