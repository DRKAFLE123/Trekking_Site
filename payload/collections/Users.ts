import { CollectionConfig } from 'payload';
import { isAdmin } from '../access';

export const users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Lock the account for 10 minutes after 5 wrong passwords.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60 * 8, // admin session: 8 hours
    forgotPassword: {
      expiration: 60 * 60 * 1000, // reset link valid for 1 hour
      generateEmailSubject: () => 'Reset your Nature Heaven admin password',
      generateEmailHTML: (args: any) => {
        const token = args?.token || '';
        const base = String(args?.req?.payload?.config?.serverURL || 'https://natureheaventreks.com').replace(/\/+$/, '');
        const url = `${base}/admin/reset/${token}`;
        const name = args?.user?.name || 'there';
        return `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1f2937">
  <div style="background:#1a3c2e;padding:18px 24px;border-radius:6px 6px 0 0">
    <p style="margin:0;color:#fff;font-size:16px;font-weight:bold">Nature Heaven Treks &amp; Expedition</p>
    <p style="margin:2px 0 0;color:#c8922a;font-size:11px;letter-spacing:2px;text-transform:uppercase">Website admin</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:0;padding:24px;border-radius:0 0 6px 6px">
    <p>Hi ${name},</p>
    <p>Someone asked to reset the password for your admin account. Click the button below to choose a new one. The link works for one hour.</p>
    <p style="margin:24px 0"><a href="${url}" style="background:#c8922a;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:5px;display:inline-block">Reset password</a></p>
    <p style="font-size:12px;color:#6b7280">If the button doesn't work, paste this link into your browser:<br>${url}</p>
    <p style="font-size:12px;color:#6b7280">If you didn't ask for this, you can ignore this email. Your password stays the same.</p>
  </div>
</div>`;
      },
    },
  },
  admin: {
    group: 'System Admin',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'createdAt'],
    hidden: ({ user }: any) => Boolean(user && user.role !== 'admin'),
  },
  access: {
    read: isAdmin,
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
      hooks: {
        afterRead: [
          async ({ value, req }) => {
            if (!value) return value;
            if (typeof value === 'object') return value;
            if (!req?.payload) return value;
            try {
              const role = await req.payload.findByID({
                collection: 'roles',
                id: value,
                depth: 0,
                overrideAccess: true,
              });
              return role;
            } catch (err) {
              return value;
            }
          },
        ],
      },
    },
  ],
};
