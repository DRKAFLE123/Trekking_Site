import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated, checkPermission } from '../access';
import { revalidateRegion, revalidateRegionDelete } from '../hooks/revalidate';

export const regions: CollectionConfig = {
  slug: 'regions',
  access: {
    read: checkPermission('regions', 'read'),
    create: checkPermission('regions', 'create'),
    update: checkPermission('regions', 'update'),
    delete: checkPermission('regions', 'delete'),
  },
  hooks: {
    afterChange: [revalidateRegion],
    afterDelete: [revalidateRegionDelete],
  },
  admin: {
    group: 'Trekking & Operations',
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
      name: 'country',
      type: 'select',
      required: true,
      defaultValue: 'nepal',
      options: [
        { label: 'Nepal', value: 'nepal' },
        { label: 'Tibet', value: 'tibet' },
        { label: 'Bhutan', value: 'bhutan' },
      ],
      admin: {
        description: 'The country this region belongs to.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'coverImage',
      type: 'upload',
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
