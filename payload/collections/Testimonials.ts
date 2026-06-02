import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, checkPermission } from '../access';

export const testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    read: checkPermission('testimonials', 'read'),
    create: checkPermission('testimonials', 'create'),
    update: checkPermission('testimonials', 'update'),
    delete: checkPermission('testimonials', 'delete'),
  },
  admin: {
    group: 'Website Content',
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
      type: 'upload',
      relationTo: 'media',
    },
  ],
};
