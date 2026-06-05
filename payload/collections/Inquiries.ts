import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated, fromTrustedRouteOrAuthenticated, checkPermission } from '../access';

export const inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    read: checkPermission('inquiries', 'read'),
    create: (args) => {
      if ((args.req as any)?.context?.fromTrustedRoute === true) return true;
      return checkPermission('inquiries', 'create')(args);
    },
    update: checkPermission('inquiries', 'update'),
    delete: checkPermission('inquiries', 'delete'),
  },
  admin: {
    group: 'Enquiries & Leads',
    useAsTitle: 'name',
    defaultColumns: ['type', 'name', 'email', 'trek', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone', 'subject', 'message'],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: '📩 Contact Enquiry', value: 'contact' },
        { label: '🗺️ Plan a Trip', value: 'plan_trip' },
        { label: '🎒 Booking Enquiry', value: 'booking_enquiry' },
        { label: '📰 Newsletter Subscriber', value: 'newsletter' },
        { label: '🌍 Country Inquiry', value: 'country_inquiry' },
      ],
      required: true,
      defaultValue: 'contact',
    },
    {
      name: 'name',
      type: 'text',
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
      name: 'subject',
      type: 'text',
    },
    {
      name: 'trek',
      type: 'relationship',
      relationTo: 'treks',
      required: false,
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
