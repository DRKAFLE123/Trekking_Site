import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor } from '../access';

export const SiteSettings: CollectionConfig = {
  slug: 'siteSettings',
  access: {
    read: () => true, // Public read needed for SSG homepage
    create: isAdmin,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    group: 'System Admin',
    useAsTitle: 'siteName',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'text',
    },
    {
      name: 'heroVideoUrl',
      type: 'text',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroHeadline',
      type: 'text',
      required: true,
    },
    {
      name: 'heroSubheadline',
      type: 'text',
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        { name: 'clients', type: 'text' },
        { name: 'years', type: 'text' },
        { name: 'treks', type: 'text' },
        { name: 'rating', type: 'text' },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'whatsapp', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'address', type: 'text' },
      ],
    },
    {
      name: 'emergencyNumbers',
      type: 'array',
      fields: [
        {
          name: 'number',
          type: 'text',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'youtube', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'tiktok', type: 'text' },
      ],
    },
    {
      name: 'affiliations',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'headerSettings',
      type: 'group',
      fields: [
        { name: 'expertName', type: 'text', defaultValue: 'Kafle' },
        { name: 'expertPhone', type: 'text', defaultValue: '+977 9851218358' },
        { name: 'expertWhatsApp', type: 'text', defaultValue: '+977 9851218358' },
        { name: 'quickEmail', type: 'text', defaultValue: 'info@natureheaventrek.com' },
      ],
    },
    {
      name: 'footerSettings',
      type: 'group',
      fields: [
        { name: 'bioText', type: 'textarea', defaultValue: 'Nature Heaven Trekking & Expedition is a government-licensed, premier adventure operator in Nepal. We lead customized private trekking, peak climbing, and cultural tours across the Himalayas.' },
        { name: 'nepalHeadOfficeAddress', type: 'text', defaultValue: 'Pakjonal Marga -16, Thamel, Kathmandu, Nepal' },
        { name: 'nepalHeadOfficePhone', type: 'text', defaultValue: '+977-9851218358' },
        { name: 'ukBranchOfficeAddress', type: 'text', defaultValue: 'London, United Kingdom' },
        { name: 'ukBranchOfficePhone', type: 'text' },
        { name: 'governmentRegNo', type: 'text', defaultValue: 'Government Registration No. 4893. Bonded & insured through Everest Insurance. Authorized by Ministry of Tourism, Government of Nepal.' },
      ],
    },
    {
      name: 'videoGallery',
      type: 'array',
      label: 'Video Gallery (Homepage)',
      admin: {
        description: 'YouTube video IDs shown in the Himalayan Trek Experience section. Paste just the video ID (e.g. h1F7Tj2_H0Q) from the YouTube URL.',
      },
      fields: [
        {
          name: 'youtubeId',
          type: 'text',
          required: true,
          label: 'YouTube Video ID',
          admin: {
            description: 'The part after ?v= in the YouTube URL. E.g. for youtube.com/watch?v=h1F7Tj2_H0Q, enter: h1F7Tj2_H0Q',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Video Title',
        },
        {
          name: 'trekName',
          type: 'text',
          label: 'Trek Name (shown as label)',
        },
      ],
    },
    {
      name: 'top5Treks',
      type: 'relationship',
      relationTo: 'treks',
      hasMany: true,
      label: 'Top 5 Treks (Navbar)',
      admin: {
        description: 'Select the top 5 treks to display in the navbar dropdown under "Top 5 Treks".',
      },
    },
    {
      name: 'paymentSettings',
      type: 'group',
      label: 'Payment Gateway Toggles',
      fields: [
        {
          name: 'enableStripe',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Stripe Credit Card',
        },
        {
          name: 'enablePaypal',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable PayPal Gateway',
        },
        {
          name: 'enableLocalWallets',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Local Wallets (eSewa, Khalti)',
        },
        {
          name: 'enableBankTransfer',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Bank SWIFT Wire Transfer',
        },
        {
          name: 'enableBookNowPayLater',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Book Now, Pay Later (0% Down)',
        },
        {
          name: 'advancePaymentPercentage',
          type: 'number',
          defaultValue: 10,
          label: 'Advance Payment Percentage (%)',
          admin: {
            description: 'Set to 0 to completely hide the Advance Deposit option.',
          },
        },
      ],
    },
  ],
};
