import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';
import { revalidateGlobalSettings } from '../hooks/revalidate';

// Singleton-style collection (one document) that drives the editable parts
// of the homepage: the "Why Travel With Us" section and the "Exclusive
// Private Treks" USP grid. Frontend falls back to the hardcoded design when
// this collection is empty, so the site never breaks.
export const HomepageSettings: CollectionConfig = {
  slug: 'homepageSettings',
  access: {
    read: () => true, // Publicly readable for SSG homepage rendering
    create: checkPermission('homepageSettings', 'create'),
    update: checkPermission('homepageSettings', 'update'),
    delete: checkPermission('homepageSettings', 'delete'),
  },
  admin: {
    group: 'Homepage Content',
    useAsTitle: 'internalLabel',
    description: 'Edit the homepage "Why Travel With Us" + "Exclusive Private Treks" sections.',
    // Visible to superadmins and any custom role (their read permission
    // gates actual access). Editor/viewer roles fall back to default.
    hidden: ({ user }: any) =>
      Boolean(user && user.role !== 'admin' && user.role !== 'custom'),
  },
  hooks: {
    afterChange: [revalidateGlobalSettings],
  },
  fields: [
    {
      name: 'internalLabel',
      type: 'text',
      defaultValue: 'Homepage Settings',
      admin: {
        description: 'Internal label only — shown in the admin list.',
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        // -----------------------------------------------------------------
        // Tab 1 — Why Travel With Us
        // -----------------------------------------------------------------
        {
          label: 'Why Travel With Us',
          description: 'The split-layout "Why Travel With Us?" section on the homepage.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'whyTravelKicker',
                  type: 'text',
                  label: 'Kicker / Eyebrow',
                  defaultValue: 'The Nature Heaven Standard',
                },
                {
                  name: 'whyTravelTitle',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'Why Travel With Us?',
                },
              ],
            },
            {
              name: 'whyTravelDescription',
              type: 'textarea',
              label: 'Section Description',
              defaultValue:
                'We are a fully licensed, Nepal-based trekking operator. Unlike booking through multi-national agencies, you book directly with the local Sherpa operator, ensuring higher safety, fair porter treatment, and a 100% authentic journey.',
            },
            {
              name: 'whyTravelImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Side Image',
              admin: {
                description: 'Large image on the left of the section. Falls back to the default Manaslu image.',
              },
            },
            {
              type: 'collapsible',
              label: 'Image Overlay Badge',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'whyTravelBadgeIcon',
                      type: 'text',
                      label: 'Badge Icon (emoji)',
                      defaultValue: '🏆',
                      admin: { width: '20%' },
                    },
                    {
                      name: 'whyTravelBadgeTitle',
                      type: 'text',
                      label: 'Badge Title',
                      defaultValue: '100% Native Sherpa Crew',
                    },
                  ],
                },
                {
                  name: 'whyTravelBadgeDescription',
                  type: 'textarea',
                  label: 'Badge Description',
                  defaultValue:
                    'Our guides are licensed, altitude-first-aid certified local mountain heroes.',
                },
              ],
            },
            {
              name: 'whyTravelFeatures',
              type: 'array',
              label: 'Feature Items',
              admin: {
                description:
                  'Six small feature cards shown in a 2-column grid. Leave empty to keep the default 6 items.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  defaultValue: 'award',
                  label: 'Icon',
                  options: [
                    { label: '🏆 Award', value: 'award' },
                    { label: '📅 Calendar', value: 'calendar' },
                    { label: '👥 Users', value: 'users' },
                    { label: '🛡️ Shield', value: 'shield' },
                    { label: '🍃 Leaf', value: 'leaf' },
                    { label: '😊 Smile', value: 'smile' },
                    { label: '⛰️ Mountain', value: 'mountain' },
                    { label: '🧭 Compass', value: 'compass' },
                    { label: '✅ Check', value: 'check' },
                  ],
                },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'text', required: true },
              ],
            },
          ],
        },
        // -----------------------------------------------------------------
        // Tab 2 — Exclusive Private Treks
        // -----------------------------------------------------------------
        {
          label: 'Exclusive Private Treks',
          description: 'The dark "Exclusive Private Treks" USP section.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'privateTreksKicker',
                  type: 'text',
                  label: 'Kicker / Eyebrow',
                  defaultValue: '100% Customized Trips',
                },
                {
                  name: 'privateTreksTitle',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'Exclusive Private Treks',
                },
              ],
            },
            {
              name: 'privateTreksDescription',
              type: 'textarea',
              label: 'Section Description',
              defaultValue:
                'Unlike cookie-cutter group tours, we specialize in private treks. You set the date, you set the pace, and our guides look after only you.',
            },
            {
              name: 'privateTreksUSPs',
              type: 'array',
              label: 'USP Cards',
              admin: {
                description:
                  'Five USP cards in a row. Leave empty to keep the default 5 items.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  defaultValue: 'running',
                  label: 'Icon',
                  options: [
                    { label: '🏃 Running (Your Pace)', value: 'running' },
                    { label: '🛡️ Shield (Sherpa Guide)', value: 'shield' },
                    { label: '📅 Calendar Check (Any Date)', value: 'calendar-check' },
                    { label: '🏨 Hotel (Custom Lodging)', value: 'hotel' },
                    { label: '✅ User Check (Solo)', value: 'user-check' },
                    { label: '⛰️ Mountain', value: 'mountain' },
                    { label: '🧭 Compass', value: 'compass' },
                    { label: '⭐ Star', value: 'star' },
                  ],
                },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
