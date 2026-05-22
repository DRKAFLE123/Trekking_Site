import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated } from '../access';

export const inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    read: isAuthenticated,
    create: () => true,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'trek', 'startDate', 'status'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'trek',
      type: 'relationship',
      relationTo: 'treks',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
    },
    {
      name: 'travelers',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Closed', value: 'closed' },
      ],
      required: true,
      defaultValue: 'new',
    },
  ],
};
