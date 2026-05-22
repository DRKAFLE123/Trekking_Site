import { CollectionConfig } from 'payload';

export const testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'clientName',
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'reviewText',
      type: 'textarea',
      required: true,
    },
    {
      name: 'trek',
      type: 'relationship',
      relationTo: 'treks',
    },
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'photo',
      type: 'text',
    },
  ],
};
