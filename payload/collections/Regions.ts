import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated } from '../access';

export const regions: CollectionConfig = {
  slug: 'regions',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'mapCenter',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
  ],
};
