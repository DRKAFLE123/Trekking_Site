import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';

export const gallery: CollectionConfig = {
  slug: 'gallery',
  access: {
    read: () => true, // Publicly readable for the website masonry
    create: checkPermission('gallery', 'create'),
    update: checkPermission('gallery', 'update'),
    delete: checkPermission('gallery', 'delete'),
  },
  admin: {
    group: 'Website Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'trek', 'createdAt'],
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
          name: 'category',
          type: 'select',
          options: [
            { label: 'Trekking & Trails', value: 'trekking' },
            { label: 'Sightseeing & Peaks', value: 'sightseeing' },
            { label: 'People & Local Culture', value: 'people_culture' },
            { label: 'Landscapes & Wildlife', value: 'landscapes' },
            { label: 'Lodging & Meals', value: 'accommodation_meals' },
            { label: 'Others / General', value: 'others' },
          ],
          required: true,
          defaultValue: 'trekking',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload or choose an image from media library.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        placeholder: 'Enter a caption (e.g. Stunning sunrise views of Mt. Ama Dablam)',
      },
    },
    {
      name: 'trek',
      type: 'relationship',
      relationTo: 'treks',
      admin: {
        description: 'Link this photo to a specific trek (optional).',
      },
    },
  ],
  timestamps: true,
};
