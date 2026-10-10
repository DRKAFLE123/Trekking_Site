import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { NextResponse } from 'next/server';
import { lexicalToParagraphs } from '@/lib/lexical-text';

// One trek's FAQs as plain text, for the /faqs trek filter. Loaded on demand so
// /faqs doesn't ship every trek's FAQs (2,500+, all already on the trek pages).
export async function GET(req: Request) {
  const id = Number(new URL(req.url).searchParams.get('trek'));
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json([], { status: 400 });

  const payload = await getPayload({ config });
  const trek: any = await payload
    .findByID({ collection: 'treks', id, depth: 0, select: { faqs: true } as any })
    .catch(() => null);

  const faqs = (trek?.faqs || []).map((f: any, i: number) => ({
    id: `faq-nested-${id}-${i}`,
    q: f.question || '',
    a: lexicalToParagraphs(f.answer).join(' '),
    category: f.category || 'general',
    isFeatured: !!f.isFeatured,
    showOnAllTreks: false,
    trekIds: [String(id)],
  }));

  return NextResponse.json(faqs, {
    headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
  });
}
