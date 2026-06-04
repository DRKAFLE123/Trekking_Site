import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

export async function safeRevalidatePath(path: string, type?: 'layout' | 'page') {
  try {
    // Dynamic import to prevent crashes when running standalone scripts (e.g. database seeding/check scripts)
    const { revalidatePath } = await import('next/cache');
    revalidatePath(path, type);
    console.log(`[Revalidation] Purged cache for: ${path} (${type || 'page'})`);
  } catch (error: any) {
    console.warn(`[Revalidation] Could not revalidate path ${path}:`, error.message);
  }
}

// Revalidates paths when a Trek is updated or deleted
export const revalidateTrek: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  if (doc?.slug) {
    await safeRevalidatePath(`/trips/${doc.slug}`);
  }
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    await safeRevalidatePath(`/trips/${previousDoc.slug}`);
  }
  await safeRevalidatePath('/trips');
  await safeRevalidatePath('/');
  await safeRevalidatePath('/faqs');
};

export const revalidateTrekDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  if (doc?.slug) {
    await safeRevalidatePath(`/trips/${doc.slug}`);
  }
  await safeRevalidatePath('/trips');
  await safeRevalidatePath('/');
  await safeRevalidatePath('/faqs');
};

// Revalidates paths when an FAQ is updated or deleted
export const revalidateFaq: CollectionAfterChangeHook = async ({ doc, req }) => {
  await safeRevalidatePath('/faqs');
  
  // Revalidate treks associated with this FAQ
  if (doc?.treks && Array.isArray(doc.treks)) {
    for (const trek of doc.treks) {
      const trekId = typeof trek === 'object' ? trek.id : trek;
      try {
        const trekDoc = await req.payload.findByID({
          collection: 'treks',
          id: trekId,
          depth: 0,
        });
        if (trekDoc?.slug) {
          await safeRevalidatePath(`/trips/${trekDoc.slug}`);
        }
      } catch (err: any) {
        console.warn(`[Revalidation FAQ] Failed to find trek for ID ${trekId}:`, err.message);
      }
    }
  }
};

export const revalidateFaqDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await safeRevalidatePath('/faqs');
  
  // Revalidate treks associated with this FAQ
  if (doc?.treks && Array.isArray(doc.treks)) {
    for (const trek of doc.treks) {
      const trekId = typeof trek === 'object' ? trek.id : trek;
      try {
        const trekDoc = await req.payload.findByID({
          collection: 'treks',
          id: trekId,
          depth: 0,
        });
        if (trekDoc?.slug) {
          await safeRevalidatePath(`/trips/${trekDoc.slug}`);
        }
      } catch (err: any) {
        console.warn(`[Revalidation FAQ Delete] Failed to find trek for ID ${trekId}:`, err.message);
      }
    }
  }
};

// Revalidates global settings (Navbar, Footer, Site Settings)
export const revalidateGlobalSettings: CollectionAfterChangeHook = async () => {
  // Purge the entire layout cache since header/footers affect all pages
  await safeRevalidatePath('/', 'layout');
};

// Revalidates standard pages
export const revalidatePage: CollectionAfterChangeHook = async ({ doc }) => {
  if (doc?.slug) {
    const slugPath = doc.slug === 'home' ? '/' : `/${doc.slug}`;
    await safeRevalidatePath(slugPath);
  }
  await safeRevalidatePath('/');
};

export const revalidatePageDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  if (doc?.slug) {
    const slugPath = doc.slug === 'home' ? '/' : `/${doc.slug}`;
    await safeRevalidatePath(slugPath);
  }
  await safeRevalidatePath('/');
};

// Revalidates blog posts
export const revalidateBlog: CollectionAfterChangeHook = async ({ doc }) => {
  if (doc?.slug) {
    await safeRevalidatePath(`/blogs/${doc.slug}`);
  }
  await safeRevalidatePath('/blogs');
  await safeRevalidatePath('/');
};

export const revalidateBlogDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  if (doc?.slug) {
    await safeRevalidatePath(`/blogs/${doc.slug}`);
  }
  await safeRevalidatePath('/blogs');
  await safeRevalidatePath('/');
};

// Revalidates testimonials
export const revalidateTestimonial: CollectionAfterChangeHook = async ({ doc, req }) => {
  await safeRevalidatePath('/');
  if (doc?.trek) {
    const trekId = typeof doc.trek === 'object' ? doc.trek.id : doc.trek;
    try {
      const trekDoc = await req.payload.findByID({
        collection: 'treks',
        id: trekId,
        depth: 0,
      });
      if (trekDoc?.slug) {
        await safeRevalidatePath(`/trips/${trekDoc.slug}`);
      }
    } catch (err: any) {
      console.warn(`[Revalidation Testimonial] Failed to find trek:`, err.message);
    }
  }
};

export const revalidateTestimonialDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await safeRevalidatePath('/');
  if (doc?.trek) {
    const trekId = typeof doc.trek === 'object' ? doc.trek.id : doc.trek;
    try {
      const trekDoc = await req.payload.findByID({
        collection: 'treks',
        id: trekId,
        depth: 0,
      });
      if (trekDoc?.slug) {
        await safeRevalidatePath(`/trips/${trekDoc.slug}`);
      }
    } catch (err: any) {
      console.warn(`[Revalidation Testimonial Delete] Failed to find trek:`, err.message);
    }
  }
};

// Revalidates team members
export const revalidateTeam: CollectionAfterChangeHook = async () => {
  await safeRevalidatePath('/our-team');
  await safeRevalidatePath('/about-us');
};

export const revalidateTeamDelete: CollectionAfterDeleteHook = async () => {
  await safeRevalidatePath('/our-team');
  await safeRevalidatePath('/about-us');
};

// Revalidates regions
export const revalidateRegion: CollectionAfterChangeHook = async ({ doc }) => {
  if (doc?.slug) {
    await safeRevalidatePath(`/regions/${doc.slug}`);
  }
  await safeRevalidatePath('/');
};

export const revalidateRegionDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  if (doc?.slug) {
    await safeRevalidatePath(`/regions/${doc.slug}`);
  }
  await safeRevalidatePath('/');
};
