import { CollectionConfig } from 'payload';
import { isAdmin } from '../access';

export const roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
    group: 'System Admin',
    defaultColumns: ['name', 'createdAt', 'updatedAt'],
  },
  access: {
    // Only superadmin can create/update/delete roles
    read: ({ req: { user } }) => Boolean(user), // All authenticated users can read roles to select them
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Role Name',
    },
    {
      name: 'permissions',
      type: 'group',
      label: 'Role Permissions Matrix',
      fields: [
        {
          type: 'collapsible',
          label: 'Trekking & Operations Permissions',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'treks_read', type: 'checkbox', label: 'Read Treks', defaultValue: true },
                { name: 'treks_create', type: 'checkbox', label: 'Create Treks', defaultValue: false },
                { name: 'treks_update', type: 'checkbox', label: 'Update Treks', defaultValue: false },
                { name: 'treks_delete', type: 'checkbox', label: 'Delete Treks', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'regions_read', type: 'checkbox', label: 'Read Regions', defaultValue: true },
                { name: 'regions_create', type: 'checkbox', label: 'Create Regions', defaultValue: false },
                { name: 'regions_update', type: 'checkbox', label: 'Update Regions', defaultValue: false },
                { name: 'regions_delete', type: 'checkbox', label: 'Delete Regions', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'departures_read', type: 'checkbox', label: 'Read Departures', defaultValue: true },
                { name: 'departures_create', type: 'checkbox', label: 'Create Departures', defaultValue: false },
                { name: 'departures_update', type: 'checkbox', label: 'Update Departures', defaultValue: false },
                { name: 'departures_delete', type: 'checkbox', label: 'Delete Departures', defaultValue: false },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Website Content Permissions',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'blogPosts_read', type: 'checkbox', label: 'Read Blogs', defaultValue: true },
                { name: 'blogPosts_create', type: 'checkbox', label: 'Create Blogs', defaultValue: false },
                { name: 'blogPosts_update', type: 'checkbox', label: 'Update Blogs', defaultValue: false },
                { name: 'blogPosts_delete', type: 'checkbox', label: 'Delete Blogs', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'pages_read', type: 'checkbox', label: 'Read Pages', defaultValue: true },
                { name: 'pages_create', type: 'checkbox', label: 'Create Pages', defaultValue: false },
                { name: 'pages_update', type: 'checkbox', label: 'Update Pages', defaultValue: false },
                { name: 'pages_delete', type: 'checkbox', label: 'Delete Pages', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'faqs_read', type: 'checkbox', label: 'Read FAQs', defaultValue: true },
                { name: 'faqs_create', type: 'checkbox', label: 'Create FAQs', defaultValue: false },
                { name: 'faqs_update', type: 'checkbox', label: 'Update FAQs', defaultValue: false },
                { name: 'faqs_delete', type: 'checkbox', label: 'Delete FAQs', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'gallery_read', type: 'checkbox', label: 'Read Gallery', defaultValue: true },
                { name: 'gallery_create', type: 'checkbox', label: 'Create Gallery', defaultValue: false },
                { name: 'gallery_update', type: 'checkbox', label: 'Update Gallery', defaultValue: false },
                { name: 'gallery_delete', type: 'checkbox', label: 'Delete Gallery', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'testimonials_read', type: 'checkbox', label: 'Read Testimonials', defaultValue: true },
                { name: 'testimonials_create', type: 'checkbox', label: 'Create Testimonials', defaultValue: false },
                { name: 'testimonials_update', type: 'checkbox', label: 'Update Testimonials', defaultValue: false },
                { name: 'testimonials_delete', type: 'checkbox', label: 'Delete Testimonials', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'teamMembers_read', type: 'checkbox', label: 'Read Team', defaultValue: true },
                { name: 'teamMembers_create', type: 'checkbox', label: 'Create Team', defaultValue: false },
                { name: 'teamMembers_update', type: 'checkbox', label: 'Update Team', defaultValue: false },
                { name: 'teamMembers_delete', type: 'checkbox', label: 'Delete Team', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'media_read', type: 'checkbox', label: 'Read Media', defaultValue: true },
                { name: 'media_create', type: 'checkbox', label: 'Create Media', defaultValue: true },
                { name: 'media_update', type: 'checkbox', label: 'Update Media', defaultValue: true },
                { name: 'media_delete', type: 'checkbox', label: 'Delete Media', defaultValue: false },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Customer Relations & Financials Permissions',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'bookings_read', type: 'checkbox', label: 'Read Bookings', defaultValue: true },
                { name: 'bookings_create', type: 'checkbox', label: 'Create Bookings', defaultValue: false },
                { name: 'bookings_update', type: 'checkbox', label: 'Update Bookings', defaultValue: false },
                { name: 'bookings_delete', type: 'checkbox', label: 'Delete Bookings', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'inquiries_read', type: 'checkbox', label: 'Read Inquiries', defaultValue: true },
                { name: 'inquiries_create', type: 'checkbox', label: 'Create Inquiries', defaultValue: false },
                { name: 'inquiries_update', type: 'checkbox', label: 'Update Inquiries', defaultValue: false },
                { name: 'inquiries_delete', type: 'checkbox', label: 'Delete Inquiries', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'payments_read', type: 'checkbox', label: 'Read Payments', defaultValue: false },
                { name: 'payments_create', type: 'checkbox', label: 'Create Payments', defaultValue: false },
                { name: 'payments_update', type: 'checkbox', label: 'Update Payments', defaultValue: false },
                { name: 'payments_delete', type: 'checkbox', label: 'Delete Payments', defaultValue: false },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'System Administration Permissions',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'siteSettings_read', type: 'checkbox', label: 'Read Site Settings', defaultValue: true },
                { name: 'siteSettings_update', type: 'checkbox', label: 'Update Site Settings', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'users_read', type: 'checkbox', label: 'Read Users', defaultValue: false },
                { name: 'users_create', type: 'checkbox', label: 'Create Users', defaultValue: false },
                { name: 'users_update', type: 'checkbox', label: 'Update Users', defaultValue: false },
                { name: 'users_delete', type: 'checkbox', label: 'Delete Users', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'roles_read', type: 'checkbox', label: 'Read Roles', defaultValue: false },
                { name: 'roles_create', type: 'checkbox', label: 'Create Roles', defaultValue: false },
                { name: 'roles_update', type: 'checkbox', label: 'Update Roles', defaultValue: false },
                { name: 'roles_delete', type: 'checkbox', label: 'Delete Roles', defaultValue: false },
              ],
            },
          ],
        },
      ],
    },
  ],
};
