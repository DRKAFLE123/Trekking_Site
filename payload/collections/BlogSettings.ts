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
    read: (args) => {
      if (!args.req.user) return true;
      return checkPermission('blogSettings', 'read')(args);
    },
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
      label: 'Newsletter Welcome Guide',
      admin: { description: 'This PDF is emailed to every new newsletter subscriber.' },
      fields: [
        {
          name: 'pdfFile',
          type: 'upload',
          relationTo: 'media',
          label: 'Guide PDF',
          required: true,
          admin: {
            description: 'Select or upload the PDF document from Media.',
          },
        },
      ],
    },
  ],
};
