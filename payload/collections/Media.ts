import { CollectionConfig, CollectionAfterChangeHook, CollectionAfterReadHook } from 'payload';
import { checkPermission } from '../access';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

/**
 * Payload v3 regenerates the `url` field on every read from staticDir + filename,
 * silently undoing the URL that was actually stored in the DB. For media that
 * was uploaded via the Cloudinary hook, that means the Cloudinary URL is lost.
 * For media that was seeded with a local path (e.g. "/gallery/foo.png"), that
 * path is also lost — and the Payload-default `/api/media/file/<filename>` 404s
 * because the file isn't in `public/uploads`.
 *
 * This afterRead hook fixes BOTH cases by reading the stored value directly
 * from the DB and restoring it onto `doc.url`. It does NOT invent URLs:
 *  - If the DB has a Cloudinary URL  → use it (transforms applied to sizes).
 *  - If the DB has a local path      → use it as-is.
 *  - If the DB has no URL            → leave Payload's default alone.
 */
const overrideUrlWithStoredValue: CollectionAfterReadHook = async ({ doc, req }) => {
  if (!doc?.id) return doc;

  let storedUrl: string | null = null;
  try {
    // Raw SQL via the Drizzle proxy on the postgres adapter — single column,
    // single row, fast.
    const drizzle: any = (req?.payload?.db as any)?.drizzle;
    if (drizzle?.execute) {
      const r = await drizzle.execute(`SELECT url FROM media WHERE id = ${Number(doc.id)} LIMIT 1`);
      storedUrl = (r?.rows?.[0]?.url as string) || null;
    }
  } catch {
    // If anything goes wrong, just keep Payload's default URL.
    return doc;
  }

  if (!storedUrl || typeof storedUrl !== 'string') return doc;

  // Don't echo Payload's own auto-generated path back into doc.url — that path
  // is exactly the thing we're trying to override.
  if (storedUrl.startsWith('/api/media/file/')) return doc;

  doc.url = storedUrl;

  // If the stored URL is a Cloudinary URL, also derive the image-size URLs via
  // on-the-fly Cloudinary transforms so admin thumbnails / relationship
  // previews / blog covers all get a proper image at the right size.
  if (storedUrl.includes('res.cloudinary.com/') && storedUrl.includes('/upload/')) {
    const sizeWidths: Record<string, string> = {
      thumbnail: 'w_400,h_300,c_fill',
      card: 'w_768,h_512,c_fill',
      tablet: 'w_1024,c_limit',
    };
    if (doc.sizes && typeof doc.sizes === 'object') {
      for (const sizeName of Object.keys(doc.sizes)) {
        const transform = sizeWidths[sizeName] || 'w_800,c_limit';
        doc.sizes[sizeName] = doc.sizes[sizeName] || {};
        doc.sizes[sizeName].url = storedUrl.replace(
          '/upload/',
          `/upload/${transform},q_auto,f_auto/`
        );
      }
    }
  }

  return doc;
};

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'summit-trail-trekking',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Automates media uploads to Cloudinary on file creation/update,
 * ensuring fast loading times via Cloudinary CDN and automatic image optimization.
 */
const uploadToCloudinary: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create' && operation !== 'update') return;

  // Prevent recursion if already updating or uploaded
  if (req?.context?.preventCloudinary) {
    return;
  }

  // Prevent infinite loop if already uploaded to Cloudinary
  if (doc.url && doc.url.includes('res.cloudinary.com')) {
    return;
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn(
      'Cloudinary API Key or Secret is not configured in environment variables. Serving media files locally from static public/uploads.'
    );
    return;
  }

  try {
    const filePath = path.join(process.cwd(), 'public/uploads', doc.filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`Local file not found at ${filePath} for Cloudinary upload.`);
      return;
    }

    console.log(`[Media Cloudinary Upload] Uploading ${doc.filename} to Cloudinary...`);
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: 'summit-trail-trekking',
      use_filename: true,
      unique_filename: true,
      resource_type: 'auto',
    });

    console.log(`[Media Cloudinary Upload] Successful! URL: ${uploadResult.secure_url}`);

    // Update document URL directly via raw SQL to bypass Payload's auto-generated URL mapping
    const dbAdapter = req?.payload?.db as any;
    const drizzle = (req?.transactionID && dbAdapter?.sessions?.[req.transactionID as any]?.db) || dbAdapter?.drizzle;
    if (drizzle?.execute) {
      await drizzle.execute(
        `UPDATE media SET url = '${uploadResult.secure_url}' WHERE id = ${Number(doc.id)}`
      );
      console.log(`[Media Cloudinary Upload] Successfully updated database url field via raw SQL.`);
    } else {
      console.warn('[Media Cloudinary Upload] Drizzle client not found, falling back to payload update.');
      // Set context flag to prevent infinite recursion on nested update
      if (req) {
        req.context = req.context || {};
        req.context.preventCloudinary = true;
      }
      await req.payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          url: uploadResult.secure_url,
        },
        req,
        overrideAccess: true,
      });
    }

    // Optionally delete the local file after upload to save local disk space:
    // try {
    //   fs.unlinkSync(filePath);
    // } catch (err) {
    //   console.error('Failed to clean up local uploaded file:', err);
    // }
  } catch (error) {
    console.error('[Media Cloudinary Upload] Error uploading file to Cloudinary:', error);
  }
};

export const media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Website Content',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'category', 'tags'],
  },
  upload: {
    staticDir: 'public/uploads',
    // Cap upload size to protect disk + Cloudinary quota. Images shouldn't
    // exceed a few MB after compression; PDFs/videos can be larger but a
    // 25 MB hard cap blocks accidental + abusive multi-GB uploads.
    maxFileSize: 25 * 1024 * 1024,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        position: 'centre',
      },
    ],
    // Always return a working thumbnail URL for the admin media list,
    // including Cloudinary-hosted assets (the previous `'thumbnail'` size
    // string broke for those because the local resized file no longer
    // existed after the Cloudinary upload hook ran — Payload then fell
    // back to a generic file icon).
    adminThumbnail: ({ doc }: { doc: any }) => {
      const url: string | undefined =
        doc?.url || doc?.sizes?.thumbnail?.url || doc?.thumbnailURL;
      if (!url || typeof url !== 'string') return null;
      // Cloudinary supports on-the-fly resizing — request a small, square
      // crop so the list thumbnail loads fast.
      if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
        return url.replace('/upload/', '/upload/w_120,h_120,c_fill,q_auto,f_auto/');
      }
      return url;
    },
    mimeTypes: ['image/*', 'application/pdf', 'video/*'],
  },
  access: {
    read: checkPermission('media', 'read'),
    create: checkPermission('media', 'create'),
    update: checkPermission('media', 'update'),
    delete: checkPermission('media', 'delete'),
  },
  hooks: {
    afterChange: [uploadToCloudinary],
    afterRead: [overrideUrlWithStoredValue],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive text for accessibility/SEO.',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Uncategorized', value: 'uncategorized' },
        { label: 'Trek Covers', value: 'trek_covers' },
        { label: 'Blog Covers', value: 'blog_covers' },
        { label: 'Gallery Photos', value: 'gallery_photos' },
        { label: 'Team Photos', value: 'team_photos' },
      ],
      defaultValue: 'uncategorized',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Categorize files to easily filter them in the media library.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        position: 'sidebar',
        description: 'Keywords/tags for quick search.',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};
