import { CollectionConfig } from 'payload';

export const faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
};
