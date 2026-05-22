import { CollectionConfig } from 'payload';

export const treks: CollectionConfig = {
  slug: 'treks',
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
      name: 'region',
      type: 'relationship',
      relationTo: 'regions',
      required: true,
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'discountedPrice',
      type: 'number',
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Hard', value: 'hard' },
        { label: 'Extreme', value: 'extreme' },
      ],
      required: true,
    },
    {
      name: 'maxAltitude',
      type: 'number',
      required: true,
    },
    {
      name: 'groupSize',
      type: 'number',
    },
    {
      name: 'startPoint',
      type: 'text',
    },
    {
      name: 'endPoint',
      type: 'text',
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        {
          name: 'highlight',
          type: 'text',
        },
      ],
    },
    {
      name: 'overview',
      type: 'richText',
    },
    {
      name: 'dayByDayItinerary',
      type: 'array',
      fields: [
        { name: 'day', type: 'number', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'accommodation', type: 'text' },
        { name: 'meals', type: 'text' },
        { name: 'distance', type: 'text' },
        { name: 'altitude', type: 'number' },
      ],
    },
    {
      name: 'inclusions',
      type: 'array',
      fields: [
        {
          name: 'inclusion',
          type: 'text',
        },
      ],
    },
    {
      name: 'exclusions',
      type: 'array',
      fields: [
        {
          name: 'exclusion',
          type: 'text',
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'text',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'text',
        },
      ],
    },
    {
      name: 'gpsCoordinates',
      type: 'array',
      fields: [
        { name: 'lat', type: 'number', required: true },
        { name: 'lng', type: 'number', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'altitude', type: 'number' },
      ],
    },
    {
      name: 'isBestSeller',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'metaTitle',
      type: 'text',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
    },
  ],
};
