import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated, checkPermission, fromTrustedRouteOrAuthenticated } from '../access';

export const payments: CollectionConfig = {
  slug: 'payments',
  access: {
    read: checkPermission('payments', 'read'),
    create: (args) => {
      if ((args.req as any)?.context?.fromTrustedRoute === true) return true;
      return checkPermission('payments', 'create')(args);
    },
    update: checkPermission('payments', 'update'),
    delete: checkPermission('payments', 'delete'),
  },
  admin: {
    group: 'Enquiries & Leads',
    useAsTitle: 'paymentId',
    defaultColumns: ['paymentId', 'booking', 'amount', 'method', 'status'],
  },
  fields: [
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
    },
    {
      name: 'paymentId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'method',
      type: 'select',
      options: [
        { label: 'Stripe Credit Card', value: 'stripe' },
        { label: 'PayPal Gateway', value: 'paypal' },
        { label: 'eSewa Local Wallet', value: 'esewa' },
        { label: 'Khalti Local Wallet', value: 'khalti' },
        { label: 'Bank SWIFT Transfer', value: 'bank_transfer' },
      ],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending Verification', value: 'pending' },
        { label: 'Successful', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      required: true,
      defaultValue: 'pending',
    },
    {
      name: 'transactionDetails',
      type: 'textarea',
    },
  ],
};
