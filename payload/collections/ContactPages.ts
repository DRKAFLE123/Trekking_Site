import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';

export const ContactPages: CollectionConfig = {
  slug: 'contactPages',
  labels: {
    singular: 'Contact Page',
    plural: 'Contact Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Website Content',
  },
  access: {
    read: () => true, // Publicly readable for dynamic frontend route
    create: checkPermission('contactPages', 'create'),
    update: checkPermission('contactPages', 'update'),
    delete: checkPermission('contactPages', 'delete'),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Content',
          fields: [
            {
              type: 'row',
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
                    description: 'The URL path for this page (e.g. payment-methods). Auto-generated from title if left blank.',
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
              ],
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Short Excerpt / Summary',
              admin: {
                description: 'Used for list previews, cards, and meta tags.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Page Content',
              required: true,
            },
          ],
        },
        {
          label: 'Media Settings',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Background Image',
              admin: {
                description: 'Large image displayed at the top of the page behind the title.',
              },
            },
          ],
        },
        {
          label: 'SEO Settings',
          fields: [
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
        },
        {
          label: 'Related Resources',
          fields: [
            {
              name: 'relatedTreks',
              type: 'relationship',
              relationTo: 'treks',
              hasMany: true,
              label: 'Recommended / Related Treks',
              admin: {
                description: 'Select related trekking itineraries to display as promotional cards on this page.',
              },
            },
            {
              name: 'documents',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              label: 'Downloadable Documents / PDFs',
              admin: {
                description: 'Link PDFs, visa guidelines, or maps for travelers to download.',
              },
            },
            {
              name: 'videos',
              type: 'array',
              label: 'Helper YouTube Videos',
              labels: {
                singular: 'Video',
                plural: 'Videos',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Video Title',
                  required: true,
                },
                {
                  name: 'youtubeUrl',
                  type: 'text',
                  label: 'YouTube Video URL or ID',
                  required: true,
                  admin: {
                    description: 'Paste watch URL or 11-char ID.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
