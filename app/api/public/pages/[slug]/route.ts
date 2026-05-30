import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload/payload.config';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const payload = await getPayload({ config });
    const { slug } = await params;

    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
    });

    if (result.docs.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(result.docs[0]);
  } catch (error) {
    console.error(`Error fetching page with slug:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
