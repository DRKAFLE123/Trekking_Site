import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const payload = await getPayload({ config });

    // Fetch bestsellers in treks
    const bestSellersRes = await payload.find({
      collection: 'treks',
      where: {
        isBestSeller: {
          equals: true,
        },
      },
      depth: 1,
    });

    // Fetch blogs
    const blogsRes = await payload.find({
      collection: 'blogPosts',
      depth: 1,
    });

    // Fetch FAQs
    const faqsRes = await payload.find({
      collection: 'faqs',
      depth: 1,
    });

    // Fetch testimonials
    const testimonialsRes = await payload.find({
      collection: 'testimonials',
      depth: 1,
    });

    return NextResponse.json({
      bestSellers: bestSellersRes.docs,
      blogs: blogsRes.docs,
      faqs: faqsRes.docs,
      testimonials: testimonialsRes.docs,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
      },
    });
  } catch (error: any) {
    console.error('Error fetching home data from Payload:', error);
    return NextResponse.json({
      bestSellers: [],
      blogs: [],
      faqs: [],
      testimonials: [],
      error: error.message || 'Internal Server Error',
    }, {
      status: 500,
    });
  }
}
