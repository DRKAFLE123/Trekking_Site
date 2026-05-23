import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor } from '../access';

export const gallery: CollectionConfig = {
  slug: 'gallery',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'caption', 'trek', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'trek',
      type: 'relationship',
      relationTo: 'treks',
    },
  ],
  timestamps: true,
};
