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
      url: ({ data }) => `/blogs/preview/${data?.slug || data?.id || 'new-post'}`,
    },
    components: {
      edit: {
        PreviewButton: '@components/payload/CustomPreviewToggle#CustomPreviewToggle',
      }
    }
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Hero Cover Image',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Post Title',
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'A brief summary of the blog post shown on lists and category cards.',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      required: true,
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'teamMembers',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'E.g. Trekking Guides, Travel Info, Packing Tips',
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
    {
      name: 'readTime',
      type: 'text',
      admin: {
        position: 'sidebar',
        placeholder: 'E.g. 5 min read',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Feature on Homepage',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedTreks',
      type: 'relationship',
      relationTo: 'treks',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
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
};
