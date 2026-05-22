import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated } from '../access';

export const faqs: CollectionConfig = {
  slug: 'faqs',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'question',
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
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
};
