import { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Website Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Page Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'URL Slug',
      admin: {
        description: 'The URL path for this page (e.g. weather-and-climate). Auto-generated from title if left blank.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) {
              return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            if (data?.title) {
              return data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return value;
          }
        ]
      }
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Background Image',
      admin: {
        description: 'Large image displayed at the top of the page behind the title.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short Excerpt / Summary',
      admin: {
        description: 'Used for previews and SEO.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Page Content',
      required: true,
    },
    {
      name: 'seoTitle',
      type: 'text',
      label: 'SEO Title',
      admin: {
        description: 'Leave blank to use the page title.',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      label: 'SEO Description',
      admin: {
        description: 'Leave blank to use the excerpt.',
      },
    },
  ],
};
