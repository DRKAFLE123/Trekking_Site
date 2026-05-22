import { CollectionConfig, CollectionAfterChangeHook } from 'payload';
import { isAdmin, isAdminOrEditor } from '../access';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

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
    });

    console.log(`[Media Cloudinary Upload] Successful! URL: ${uploadResult.secure_url}`);

    // Update document URL to refer to Cloudinary secure CDN endpoint
    await req.payload.update({
      collection: 'media',
      id: doc.id,
      data: {
        url: uploadResult.secure_url,
      },
      overrideAccess: true,
    });

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
  upload: {
    staticDir: 'public/uploads',
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
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [uploadToCloudinary],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
};
