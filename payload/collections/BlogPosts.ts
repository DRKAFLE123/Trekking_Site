import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated } from '../access';

export const blogPosts: CollectionConfig = {
  slug: 'blogPosts',
  access: {
    read: isAuthenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    preview: (doc) => {
      if (doc && doc.slug) {
        return `/blogs/preview/${doc.slug}`;
      }
      return '';
    },
  },
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
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'category',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'teamMembers',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
    },
    {
      name: 'readTime',
      type: 'text',
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'relatedTreks',
      type: 'relationship',
      relationTo: 'treks',
      hasMany: true,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'metaImage',
          type: 'relationship',
          relationTo: 'media',
        },
      ],
    },
  ],
};
