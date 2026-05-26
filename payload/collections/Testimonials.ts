import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated } from '../access';

export const testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
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
      type: 'upload',
      relationTo: 'media',
    },
  ],
};
