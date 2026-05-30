import { CollectionConfig } from 'payload';

export const users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    group: 'System Admin',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      return Boolean(user); // Any logged-in user can read users
    },
    create: ({ req: { user } }) => {
      // Allow creation if no users exist yet (first user registration) or if the actor is an admin
      return !user || user?.role === 'admin';
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true; // Admins can update anyone
      return {
        id: {
          equals: user.id,
        },
      }; // Users can update their own profile (avatar, password, name)
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'; // Only admin can delete users
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Trekk Expert',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload a custom profile picture.',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
        { label: 'Custom Role', value: 'custom' },
      ],
      required: true,
      defaultValue: 'admin',
    },
    {
      name: 'customRole',
      type: 'relationship',
      relationTo: 'roles',
      required: false,
      admin: {
        condition: (data: any) => data?.role === 'custom',
        description: 'Select a custom role managed in the Roles collection.',
      },
    },
  ],
};
