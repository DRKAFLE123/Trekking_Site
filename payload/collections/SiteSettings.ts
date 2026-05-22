import { CollectionConfig } from 'payload';

export const siteSettings: CollectionConfig = {
  slug: 'siteSettings',
  admin: {
    useAsTitle: 'siteName',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'text',
    },
    {
      name: 'heroVideoUrl',
      type: 'text',
    },
    {
      name: 'heroHeadline',
      type: 'text',
      required: true,
    },
    {
      name: 'heroSubheadline',
      type: 'text',
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        { name: 'clients', type: 'text' },
        { name: 'years', type: 'text' },
        { name: 'treks', type: 'text' },
        { name: 'rating', type: 'text' },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'whatsapp', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'address', type: 'text' },
      ],
    },
    {
      name: 'emergencyNumbers',
      type: 'array',
      fields: [
        {
          name: 'number',
          type: 'text',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'youtube', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'tiktok', type: 'text' },
      ],
    },
    {
      name: 'affiliations',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'logo', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
};
