import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor, isAuthenticated } from '../access';

export const siteSettings: CollectionConfig = {
  slug: 'siteSettings',
  access: {
    read: isAuthenticated,
    create: isAdmin,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
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
        { name: 'logo', type: 'relationship', relationTo: 'media' },
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
  ],
};
