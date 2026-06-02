import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated, checkPermission } from '../access';

export const departures: CollectionConfig = {
  slug: 'departures',
  access: {
    read: checkPermission('departures', 'read'),
    create: checkPermission('departures', 'create'),
    update: checkPermission('departures', 'update'),
    delete: checkPermission('departures', 'delete'),
  },
  admin: {
    group: 'Trekking & Operations',
    useAsTitle: 'startDate',
    defaultColumns: ['startDate', 'endDate', 'trek', 'availableSeats', 'bookedSeats', 'status'],
  },
  fields: [
    {
      name: 'trek',
      type: 'relationship',
      relationTo: 'treks',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
    {
      name: 'availableSeats',
      type: 'number',
      required: true,
      defaultValue: 16,
    },
    {
      name: 'bookedSeats',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Limited Seats', value: 'limited' },
        { label: 'Sold Out', value: 'sold_out' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      required: true,
      defaultValue: 'available',
    },
    {
      name: 'priceOverride',
      type: 'number',
    },
    {
      name: 'isGuaranteed',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};
