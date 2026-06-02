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
    {
      name: 'guideSettings',
      type: 'group',
      label: 'Free Travel Guide Settings (Lead Magnet)',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Guide Cover Title',
          defaultValue: 'TRAVEL GUIDE',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Guide Cover Subtitle',
          defaultValue: 'NEPAL 2026',
          required: true,
        },
        {
          name: 'badgeText',
          type: 'text',
          label: 'Guide Cover Badge / Header',
          defaultValue: 'SUMMIT GUIDE',
          required: true,
        },
        {
          name: 'footerText',
          type: 'text',
          label: 'Guide Cover Footer Brand',
          defaultValue: 'Nature Heaven Trekking',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Lead Magnet Description',
          defaultValue: 'Get our free travel guide packed with insider tips, hidden geographical gems, and essential equipment checklists. Save time, travel smarter, and make the most of your adventure.',
          required: true,
        },
        {
          name: 'pdfFile',
          type: 'upload',
          relationTo: 'media',
          label: 'Upload Guide PDF File',
          required: true,
          admin: {
            description: 'Select or upload the PDF document from Media.',
          },
        },
      ],
    },
  ],
};
