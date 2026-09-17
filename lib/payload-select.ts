// Field projections for listing queries.
//
// Payload's find() returns every field of every document by default. On this
// site that meant the homepage shipped every trek's full itinerary, inclusions
// and FAQs, and /blogs shipped the complete body of all 22 articles — pages of
// 3.5–5.7 MB of HTML before a single image loaded. Cards only render a handful
// of fields, so listings select just those.
//
// `populate` caps what a populated relationship carries: a testimonial's
// `trek` relation otherwise drags the whole trek document in with it.

export const TREK_CARD_SELECT = {
  title: true,
  slug: true,
  duration: true,
  price: true,
  discountedPrice: true,
  difficulty: true,
  maxAltitude: true,
  heroImage: true,
  isBestSeller: true,
  region: true,
  youtubeVideoId: true,
  highlights: true,
} as const;

export const BLOG_CARD_SELECT = {
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  author: true,
  category: true,
  publishedAt: true,
  readTime: true,
  isFeatured: true,
  updatedAt: true,
} as const;

// Relationship populate rules: when a listing item links to a trek, carry only
// the trek's name and address, never its content.
export const TREK_LINK_POPULATE = {
  treks: { title: true, slug: true },
} as const;
