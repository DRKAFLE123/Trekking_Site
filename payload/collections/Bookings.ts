import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated, fromTrustedRouteOrAuthenticated, checkPermission } from '../access';

export const bookings: CollectionConfig = {
  slug: 'bookings',
  access: {
    read: checkPermission('bookings', 'read'),
    create: (args) => {
      if ((args.req as any)?.context?.fromTrustedRoute === true) return true;
      return checkPermission('bookings', 'create')(args);
    },
    update: checkPermission('bookings', 'update'),
    delete: checkPermission('bookings', 'delete'),
  },
  admin: {
    group: 'Enquiries & Leads',
    useAsTitle: 'bookingId',
    defaultColumns: ['bookingId', 'trek', 'travelersCount', 'totalPrice', 'paymentStatus', 'bookingStatus'],
    listSearchableFields: [
      'bookingId',
      'customerDetails.firstName',
      'customerDetails.lastName',
      'customerDetails.email',
      'travelers.passportNumber',
    ],
  },
  fields: [
    {
      name: 'bookingId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'trek',
      type: 'relationship',
      relationTo: 'treks',
      required: true,
    },
    {
      name: 'departure',
      type: 'relationship',
      relationTo: 'departures',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'travelersCount',
      type: 'number',
      required: true,
      defaultValue: 1,
    },
    {
      name: 'travelers',
      type: 'array',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
        { name: 'email', type: 'text' },
        { name: 'nationality', type: 'text', required: true },
        {
          name: 'gender',
          type: 'select',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        { name: 'dob', type: 'date', required: true },
        { name: 'passportNumber', type: 'text' },
        { name: 'passportExpiry', type: 'date' },
      ],
    },
    {
      name: 'customerDetails',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
        { name: 'email', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
    },
    {
      name: 'discount',
      type: 'number',
    },
    {
      name: 'tax',
      type: 'number',
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'paymentType',
      type: 'select',
      options: [
        { label: 'Full Payment', value: 'full' },
        { label: 'Advance Deposit', value: 'advance_10' },
        { label: 'Book Now, Pay Later (0%)', value: 'pay_later' },
      ],
      required: true,
      defaultValue: 'full',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Partially Paid', value: 'partial' },
        { label: 'Fully Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
      required: true,
      defaultValue: 'unpaid',
    },
    {
      name: 'bookingStatus',
      type: 'select',
      options: [
        { label: 'Pending Verification', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ],
      required: true,
      defaultValue: 'pending',
    },
    {
      name: 'adminRemarks',
      type: 'textarea',
    },
  ],
};
