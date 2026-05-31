import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';

export const BlogSettings: CollectionConfig = {
  slug: 'blogSettings',
  labels: {
    singular: 'Blog Page Setting',
    plural: 'Blog Page Settings',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Website Content',
    description: 'Manage the blogs listing page header title, subtitle, and hero cover image.',
  },
  access: {
    read: () => true, // Publicly readable for dynamic blogs landing page
    create: checkPermission('blogSettings', 'create'),
    update: checkPermission('blogSettings', 'update'),
    delete: checkPermission('blogSettings', 'delete'),
  },
  fields: [
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Blogs Hero Cover Image',
      required: true,
      admin: {
        description: 'Banner photo for the blog page header.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Blogs Page Title',
      required: true,
      defaultValue: 'Summit Chronicles',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Blogs Page Subtitle',
      required: true,
      defaultValue: 'Nature Heaven Trekking & Expedition',
    },
  ],
};
