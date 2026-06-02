import { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@/payload/payload.config';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const payload = await getPayload({ config });
    const siteSettings = await payload.find({
      collection: 'siteSettings',
      depth: 0,
    });
    
    const allowIndexing = siteSettings.docs[0]?.allowIndexing ?? true;

    if (!allowIndexing) {
      return {
        rules: {
          userAgent: '*',
          disallow: '/',
        },
      };
    }

    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: 'https://natureheaventreks.com/sitemap.xml',
    };
  } catch (error) {
    console.error('Error fetching site settings for robots.ts:', error);
    // Fallback to allowing indexing if query fails
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: 'https://natureheaventreks.com/sitemap.xml',
    };
  }
}
