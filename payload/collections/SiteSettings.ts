import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';
import { revalidateGlobalSettings } from '../hooks/revalidate';

const parseYoutubeId = (args: any) => {
  const value = args.value;
  if (value) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = value.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
  }
  return value;
};

export const SiteSettings: CollectionConfig = {
  slug: 'siteSettings',
  access: {
    read: (args) => {
      if (!args.req.user) return true;
      return checkPermission('siteSettings', 'read')(args);
    },
    create: checkPermission('siteSettings', 'create'),
    update: checkPermission('siteSettings', 'update'),
    delete: checkPermission('siteSettings', 'delete'),
  },
  admin: {
    group: 'Global Settings',
    useAsTitle: 'siteName',
    hidden: ({ user }: any) =>
      Boolean(user && user.role !== 'admin' && user.role !== 'custom'),
  },
  hooks: {
    afterChange: [revalidateGlobalSettings],
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
      name: 'seoImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Default Social Share Image (SEO)',
      admin: {
        description: 'Default cover image shown when sharing the website home page or generic pages on social media (Facebook, WhatsApp, Twitter, etc.). Recommended size: 1200x630px.',
      },
    },
    {
      name: 'heroVideoUrl',
      type: 'text',
      admin: {
        description: 'MP4 URL or YouTube Link for the homepage background video.',
      },
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
        {
          name: 'mapCoordinates',
          type: 'text',
          label: 'Map Coordinates (Lat, Lng)',
          defaultValue: '27.71672384712074, 85.30808857301508',
        },
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
        {
          name: 'expert',
          type: 'relationship',
          relationTo: 'teamMembers',
          required: false,
          label: 'Primary Expert Specialist (Team Member)',
          admin: {
            description: 'Choose a team member to dynamically load the expert profile (name, avatar, phone, WhatsApp). If unselected, defaults to the text values below.',
          },
        },
        { name: 'expertName', type: 'text', defaultValue: 'Kafle' },
        { name: 'expertPhone', type: 'text', defaultValue: '+977 9851218358' },
        { name: 'expertWhatsApp', type: 'text', defaultValue: '+977 9851218358' },
        { name: 'quickEmail', type: 'text', defaultValue: 'info@natureheaventreks.com' },
        { name: 'nepalBranchPhone', type: 'text', defaultValue: '+977 9851218358', label: 'Nepal Branch Phone' },
        { name: 'ukBranchPhone', type: 'text', defaultValue: '+44 7459 313411', label: 'UK Branch Phone' },
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
        description: 'YouTube videos shown in the Himalayan Trek Experience section. Paste the 11-char ID or the full YouTube URL.',
      },
      fields: [
        {
          name: 'youtubeId',
          type: 'text',
          required: true,
          label: 'YouTube Video ID / Link',
          hooks: {
            beforeValidate: [parseYoutubeId],
          },
          admin: {
            description: 'Can be the full YouTube URL or just the video ID. E.g. h1F7Tj2_H0Q',
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
    {
      name: 'blogsPageSettings',
      type: 'group',
      label: 'Blogs Page Settings',
      fields: [
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Blogs Hero Cover Image',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Blogs Page Title',
          defaultValue: 'Summit Chronicles',
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Blogs Page Subtitle',
          defaultValue: 'Nature Heaven Trekking & Expedition',
        },
      ],
    },
    {
      name: 'reviewPlatforms',
      type: 'array',
      label: 'Review Platforms (Ratings & Stats)',
      admin: {
        description: 'Manage the review scores/counts displayed on the homepage.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Platform Name (e.g. TripAdvisor)' },
            { name: 'rating', type: 'text', required: true, label: 'Rating (e.g. 5.0)' },
            { name: 'maxRating', type: 'text', required: true, label: 'Max Rating (e.g. 5.0 or 10)' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'reviewsCount', type: 'text', required: true, label: 'Review Count Label (e.g. 2,234+ reviews)' },
            { name: 'badgeText', type: 'text', label: 'Badge Text (e.g. Certificate of Excellence)' },
            { name: 'stars', type: 'number', required: true, defaultValue: 5, label: 'Stars (1-5)' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'Platform Review Profile Link (URL)',
          admin: {
            description:
              'Optional. Full URL to your TripAdvisor / Google / Booking.com profile. When set, the card becomes a clickable link that opens in a new tab.',
          },
        },
      ],
    },
    {
      name: 'featuredTravelInfo',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      label: 'Featured Travel Info Pages (Homepage)',
      admin: {
        description: 'Select travel info pages to feature in a card list on the homepage.',
      },
    },
    {
      name: 'trackingSettings',
      type: 'group',
      label: 'Tracking & Marketing Scripts',
      admin: {
        description:
          'Third-party tracking tags (Google Ads, Analytics, Meta Pixel, etc.). Managed here so new tags never require a code change.',
      },
      fields: [
        {
          name: 'headScripts',
          type: 'textarea',
          label: 'Site-wide Tracking Scripts (HTML)',
          admin: {
            description:
              'Paste complete tags exactly as the provider gives them, including the <script> tags. Injected on every page of the website. WARNING: scripts here run with full access to the page — only paste code from providers you trust (Google, Meta, etc.).',
          },
        },
        {
          name: 'googleAdsConversionSendTo',
          type: 'text',
          label: 'Google Ads Conversion ID/Label (fired on booking success)',
          admin: {
            description:
              "The send_to value from the Google Ads event snippet, e.g. AW-123456789/AbCdEfGhIj. Fired automatically when a visitor completes a booking. Leave empty to disable.",
          },
        },
      ],
    },
    {
      name: 'allowIndexing',
      type: 'checkbox',
      defaultValue: true,
      label: 'Allow Search Engine Indexing (Google, Bing, etc.)',
      admin: {
        description: 'If disabled, search engines will be instructed not to index or crawl the website (adds "noindex, nofollow" meta tags and disallows crawling in robots.txt).',
      },
    },
  ],
};
