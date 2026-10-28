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
      name: 'showOnHomepage',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show on homepage',
      admin: { position: 'sidebar', description: 'Untick to hide this region from the homepage "Explore Trekking Regions" grid.' },
    },
    {
      name: 'homepageOrder',
      type: 'number',
      label: 'Homepage order',
      admin: { position: 'sidebar', description: '1 shows first. Regions without a number come last.' },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Google title (SEO)',
      admin: { description: 'Up to 60 characters. Leave blank to use "<Region name> Trekking | Nature Heaven Treks & Expedition".' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Google description (SEO)',
      admin: { description: '140 to 155 characters. Leave blank to use the region description.' },
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
