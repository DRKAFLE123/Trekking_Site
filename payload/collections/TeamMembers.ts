import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, checkPermission } from '../access';

export const teamMembers: CollectionConfig = {
  slug: 'teamMembers',
  access: {
    read: () => true,
    create: checkPermission('teamMembers', 'create'),
    update: checkPermission('teamMembers', 'update'),
    delete: checkPermission('teamMembers', 'delete'),
  },
  admin: {
    group: 'Website Content',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'twitter', type: 'text' },
      ],
    },
  ],
};
