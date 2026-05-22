import { CollectionConfig } from 'payload';

export const blogPosts: CollectionConfig = {
  slug: 'blogPosts',
  admin: {
    useAsTitle: 'title',
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
      type: 'text',
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
  ],
};
