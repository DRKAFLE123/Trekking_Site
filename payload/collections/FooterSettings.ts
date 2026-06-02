import { CollectionConfig } from 'payload';
import { isAdmin } from '../access';

export const FooterSettings: CollectionConfig = {
  slug: 'footerSettings',
  access: {
    read: () => true, // Publicly readable for rendering the footer
    create: isAdmin,  // Superadmin only
    update: isAdmin,  // Superadmin only
    delete: isAdmin,  // Superadmin only
  },
  admin: {
    group: 'System Admin',
    useAsTitle: 'siteName',
    description: 'Configure dynamic footer menus, emergency contacts, branch addresses, accepted payments, and partner affiliations.',
    hidden: ({ user }: any) => Boolean(user && user.role !== 'admin'),
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Nature Heaven',
      label: 'Site Brand Name',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Header Site Logo',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Footer Mountain Background Image',
    },
    {
      name: 'bioText',
      type: 'textarea',
      label: 'Bio / About Paragraph',
      defaultValue: 'Nature Heaven Trekking is a government-licensed, premier adventure operator in Nepal. We lead customized private trekking, peak climbing, and cultural tours across the Himalayas.',
    },
    {
      name: 'newsletterTitle',
      type: 'text',
      defaultValue: 'Subscribe our Newsletter',
      label: 'Newsletter Title',
    },
    {
      name: 'emergencyTitle',
      type: 'text',
      defaultValue: 'Emergency SOS (24/7):',
      label: 'Emergency Section Title',
    },
    {
      name: 'emergencyNumbers',
      type: 'array',
      label: 'Emergency Contact Numbers',
      fields: [
        { name: 'number', type: 'text', required: true }
      ]
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      defaultValue: '+977-9851218358',
      label: 'WhatsApp Contact Number',
    },
    {
      name: 'emails',
      type: 'array',
      label: 'Office Contact Emails',
      fields: [
        { name: 'email', type: 'text', required: true }
      ]
    },
    {
      name: 'nepalOfficeAddress',
      type: 'text',
      defaultValue: 'Pakjonal Marga -16, Thamel, Kathmandu, Nepal',
      label: 'Nepal Head Office Address',
    },
    {
      name: 'nepalOfficePhone',
      type: 'text',
      label: 'Nepal Head Office Phone',
    },
    {
      name: 'ukOfficeAddress',
      type: 'text',
      defaultValue: 'London, United Kingdom',
      label: 'UK Branch Office Address',
    },
    {
      name: 'ukOfficePhone',
      type: 'text',
      label: 'UK Branch Office Phone',
    },
    {
      name: 'navigationMenu',
      type: 'array',
      label: 'Footer Navigation Columns (Up to 5 Columns)',
      maxRows: 5,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Column Title (e.g. Popular Regions)',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Sub Links List',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true }
          ]
        }
      ]
    },
    {
      name: 'acceptedPayments',
      type: 'group',
      label: 'Accepted Payment Methods & Secured Badges',
      fields: [
        { name: 'enableSectigo', type: 'checkbox', defaultValue: true, label: 'Show Sectigo Badge' },
        { name: 'enablePaypal', type: 'checkbox', defaultValue: true, label: 'Show PayPal logo' },
        { name: 'enableMastercard', type: 'checkbox', defaultValue: true, label: 'Show Mastercard logo' },
        { name: 'enableVisa', type: 'checkbox', defaultValue: true, label: 'Show Visa logo' },
        { name: 'enableSwift', type: 'checkbox', defaultValue: true, label: 'Show SWIFT logo' }
      ]
    },
    {
      name: 'affiliations',
      type: 'array',
      label: 'Associated Partner Affiliations',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Association Name (e.g. TAAN)' },
        { name: 'logo', type: 'upload', relationTo: 'media', label: 'Partner Logo Image' },
        { name: 'url', type: 'text', required: true, label: 'Association Official URL' }
      ]
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Channels',
      fields: [
        { name: 'youtube', type: 'text', defaultValue: 'https://youtube.com' },
        { name: 'instagram', type: 'text', defaultValue: 'https://instagram.com' },
        { name: 'facebook', type: 'text', defaultValue: 'https://facebook.com' },
        { name: 'tiktok', type: 'text', defaultValue: 'https://tiktok.com' }
      ]
    },
    {
      name: 'governmentRegNo',
      type: 'text',
      defaultValue: 'Government Registration No. 4893. Bonded & insured through Everest Insurance. Authorized by Ministry of Tourism, Government of Nepal.',
      label: 'Government Registration Info',
    },
    {
      name: 'copyrightNotice',
      type: 'textarea',
      defaultValue: 'The copyright to all content on this website, including photographs, belongs to Nature Heaven Trekking and cannot be reproduced without our permission.',
      label: 'Copyright Notice Terms',
    }
  ]
};
