import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload/payload.config';

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config });

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 100;

    const pages = await payload.find({
      collection: 'contactPages',
      depth: 1,
      limit,
    });

    return NextResponse.json(pages.docs);
  } catch (error) {
    console.error('Error fetching contact pages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
