import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';

export const blogPosts: CollectionConfig = {
  slug: 'blogPosts',
  access: {
    read: checkPermission('blogPosts', 'read'),
    create: checkPermission('blogPosts', 'create'),
    update: checkPermission('blogPosts', 'update'),
    delete: checkPermission('blogPosts', 'delete'),
  },
  admin: {
    group: 'Website Content',
    useAsTitle: 'title',
    preview: (doc) => {
      if (doc && doc.slug) {
        return `/blogs/preview/${doc.slug}`;
      }
      return '';
    },
    livePreview: {
      url: ({ data }) => data?.slug ? `/blogs/preview/${data.slug}` : '',
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1500, // Autosave every 1.5 seconds of inactivity
      },
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Blog Content',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                },
              ],
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              admin: {
                description: 'A brief summary of the blog post (shown on lists and cards).',
              },
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          label: 'Publishing Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  options: [
                    { label: 'Draft', value: 'draft' },
                    { label: 'Published', value: 'published' },
                  ],
                  required: true,
                  defaultValue: 'draft',
                },
                {
                  name: 'publishedAt',
                  type: 'date',
                  required: true,
                  defaultValue: () => new Date().toISOString(),
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'author',
                  type: 'relationship',
                  relationTo: 'teamMembers',
                  required: true,
                },
                {
                  name: 'category',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'E.g. Trekking Guides, Travel Info, Packing Tips',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'readTime',
                  type: 'text',
                  admin: {
                    placeholder: 'E.g. 5 min read',
                  },
                },
                {
                  name: 'isFeatured',
                  type: 'checkbox',
                  label: 'Feature on Homepage',
                  defaultValue: false,
                },
              ],
            },
            {
              name: 'tags',
              type: 'array',
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'relatedTreks',
              type: 'relationship',
              relationTo: 'treks',
              hasMany: true,
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Meta Title',
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'Meta Description',
                },
                {
                  name: 'metaImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Social Share Image',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
