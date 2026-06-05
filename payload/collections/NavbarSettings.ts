import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';
import { revalidateGlobalSettings } from '../hooks/revalidate';

export const NavbarSettings: CollectionConfig = {
  slug: 'navbarSettings',
  access: {
    read: () => true, // Publicly readable for rendering the header navbar
    create: checkPermission('navbarSettings', 'create'),
    update: checkPermission('navbarSettings', 'update'),
    delete: checkPermission('navbarSettings', 'delete'),
  },
  admin: {
    group: 'System Admin',
    useAsTitle: 'siteName',
    description: 'Configure global navigation headers, brand assets, and multi-level dropdowns.',
    hidden: ({ user }: any) =>
      Boolean(user && user.role !== 'admin' && user.role !== 'custom'),
  },
  hooks: {
    afterChange: [revalidateGlobalSettings],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Nature Heaven',
      label: 'Site Brand Name',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Header Site Logo',
    },
    {
      name: 'navigationMenu',
      type: 'array',
      label: 'Navbar Navigation Menu',
      admin: {
        description: 'Add, reorder, show/hide, or delete navbar menu sections.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Menu Link Label (e.g. Nepal Trips)',
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'dropdown',
          options: [
            { label: 'Dropdown Mega Menu', value: 'dropdown' },
            { label: 'Single Flat Link', value: 'single-link' },
          ],
        },
        {
          name: 'href',
          type: 'text',
          label: 'URL/Path (only for Single Flat Link)',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'single-link',
          },
        },
        {
          name: 'dropdownStyle',
          type: 'select',
          label: 'Dropdown Megamenu Style',
          defaultValue: 'custom-links',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'dropdown',
          },
          options: [
            { label: 'Trips by Regions (Dynamic grid)', value: 'regions-grid' },
            { label: 'Travel Info (Categorized Pages)', value: 'travel-info' },
            { label: 'Contact Pages (Dynamic Pages)', value: 'contact-pages' },
            { label: 'Company Pages (Dynamic Pages)', value: 'company-pages' },
            { label: 'Treks List (e.g. Top 15 Bestsellers)', value: 'treks-list' },
            { label: 'Custom Flat Links', value: 'custom-links' },
          ],
        },
        {
          name: 'featuredTreks',
          type: 'relationship',
          relationTo: 'treks',
          hasMany: true,
          label: 'Select Treks to Display',
          admin: {
            condition: (data, siblingData) => siblingData?.dropdownStyle === 'treks-list',
            description: 'Select treks (e.g. Top 15) to include in this dropdown.',
          },
        },
        {
          name: 'customLinks',
          type: 'array',
          label: 'Custom Sub-Links',
          admin: {
            condition: (data, siblingData) => siblingData?.dropdownStyle === 'custom-links',
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            { name: 'hide', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'hide',
          type: 'checkbox',
          defaultValue: false,
          label: 'Hide this entire section from Navbar',
        },
      ],
    },
  ],
};
