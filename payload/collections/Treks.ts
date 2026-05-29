import { CollectionConfig } from 'payload';
import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical';
import { checkPermission } from '../access';

const parseYoutubeId = (args: any) => {
  const value = args.value;
  if (value) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = value.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
  }
  return value;
};

export const treks: CollectionConfig = {
  slug: 'treks',
  access: {
    read: checkPermission('treks', 'read'),
    create: checkPermission('treks', 'create'),
    update: checkPermission('treks', 'update'),
    delete: checkPermission('treks', 'delete'),
  },
  admin: {
    group: 'Trekking & Operations',
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Basic Info',
      admin: {
        initCollapsed: false,
      },
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
          type: 'row',
          fields: [
            {
              name: 'region',
              type: 'relationship',
              relationTo: 'regions',
              required: true,
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
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'price',
              type: 'number',
              required: true,
            },
            {
              name: 'discountedPrice',
              type: 'number',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'duration',
              type: 'number',
              required: true,
              admin: {
                description: 'Duration in days (e.g. 14)',
              },
            },
            {
              name: 'maxAltitude',
              type: 'number',
              required: true,
              admin: {
                description: 'Max altitude in meters (e.g. 5364)',
              },
            },
            {
              name: 'groupSize',
              type: 'number',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'startPoint',
              type: 'text',
            },
            {
              name: 'endPoint',
              type: 'text',
            },
          ],
        },
        {
          name: 'isBestSeller',
          type: 'checkbox',
          defaultValue: false,
          label: 'Feature as Best Seller',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Content & Itinerary',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'overview',
          type: 'richText',
          required: true,
        },
        {
          name: 'highlights',
          type: 'array',
          labels: {
            singular: 'Highlight',
            plural: 'Highlights',
          },
          fields: [
            {
              name: 'highlight',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'dayByDayItinerary',
          type: 'array',
          labels: {
            singular: 'Day',
            plural: 'Days Itinerary',
          },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'day', type: 'number', required: true },
                { name: 'title', type: 'text', required: true },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              type: 'row',
              fields: [
                { name: 'accommodation', type: 'text' },
                { name: 'meals', type: 'text' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'distance', type: 'text' },
                { name: 'altitude', type: 'number', label: 'Altitude (meters)' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Inclusions / Exclusions',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'inclusions',
          type: 'array',
          fields: [
            {
              name: 'inclusion',
              type: 'text',
              required: true,
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
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Media & Videos',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero Cover Image',
        },
        {
          name: 'mapImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Route Map Image',
          admin: {
            description: 'Static route-map image. Falls back to the interactive map if empty.',
          },
        },
        {
          name: 'gallery',
          type: 'array',
          label: 'Photo Gallery',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          name: 'youtubeVideoId',
          type: 'text',
          label: 'YouTube Video ID / URL',
          hooks: {
            beforeValidate: [parseYoutubeId],
          },
          admin: {
            description: 'Enter the YouTube Video ID (e.g. fAsw_vB3JpI) or paste the full YouTube watch URL.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Logistics & Map',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'groupDiscounts',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'minPersons', type: 'number', required: true },
                { name: 'maxPersons', type: 'number', required: true },
                { name: 'pricePerPerson', type: 'number', required: true },
              ],
            },
          ],
        },
        {
          name: 'gpsCoordinates',
          type: 'array',
          label: 'GPS Map Coordinates / Route Points',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'lat', type: 'number', required: true, label: 'Latitude' },
                { name: 'lng', type: 'number', required: true, label: 'Longitude' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Point Label (e.g. Lukla)' },
                { name: 'altitude', type: 'number', label: 'Altitude (meters)' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'FAQs',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'faqs',
          type: 'array',
          labels: {
            singular: 'FAQ',
            plural: 'FAQs',
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
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Trip Info (Blog Content)',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'tripInfoContent',
          type: 'richText',
          label: 'Trip Info (Blog Content)',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
          }),
          admin: {
            description: 'Freeform blog-style content: headings, paragraphs, lists, and tables.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'SEO',
      admin: {
        initCollapsed: true,
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
      ],
    },
  ],
};
