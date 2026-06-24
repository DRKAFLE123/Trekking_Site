import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';
import { revalidateGlobalSettings } from '../hooks/revalidate';

// Singleton driving the editable chrome of the `/regions` listing page.
// Each region card itself still comes from the Regions collection — this
// only controls the hero header and the bottom CTA so the client can tune
// copy / background image without a code change. Frontend falls back to
// sensible defaults when the CMS row is empty.
export const RegionsPageSettings: CollectionConfig = {
  slug: 'regionsPageSettings',
  access: {
    read: () => true,
    create: checkPermission('regionsPageSettings', 'create'),
    update: checkPermission('regionsPageSettings', 'update'),
    delete: checkPermission('regionsPageSettings', 'delete'),
  },
  admin: {
    group: 'Archive Pages',
    useAsTitle: 'internalLabel',
    description: 'Edit the /regions listing page hero + bottom CTA.',
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
      defaultValue: 'Regions Page Settings',
      admin: {
        description: 'Internal label only — shown in the admin list.',
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          description: 'The top banner of the /regions page.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'heroKicker',
                  type: 'text',
                  label: 'Kicker / Eyebrow',
                  defaultValue: 'Explore by Region',
                },
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Browser Tab Title',
                  defaultValue:
                    'Trekking Regions of the Himalayas | Nature Heaven Trekking & Expedition',
                },
              ],
            },
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Hero Title',
              defaultValue: 'Trekking Regions of the Himalayas',
            },
            {
              name: 'heroDescription',
              type: 'textarea',
              label: 'Hero Description',
              defaultValue:
                'From the iconic Everest and Annapurna massifs to remote, restricted areas like Upper Mustang and Dolpa — pick the terrain that matches your ambition.',
            },
            {
              name: 'heroBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Background Image',
              admin: {
                description:
                  'Large background photo behind the hero. 1600×900 or larger recommended.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'SEO Description',
              defaultValue:
                'Browse every Himalayan trekking region we operate in — Everest, Annapurna, Manaslu, Langtang, Mustang, Dolpa, Makalu, Kanchenjunga, and more. Pick your terrain.',
            },
          ],
        },
        {
          label: 'Bottom CTA',
          description: 'The "Plan my trip" call-to-action at the bottom of the page.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaKicker',
                  type: 'text',
                  label: 'Kicker',
                  defaultValue: 'Not sure where to go?',
                },
                {
                  name: 'ctaButtonLabel',
                  type: 'text',
                  label: 'Button Label',
                  defaultValue: 'Plan my trip',
                },
              ],
            },
            {
              name: 'ctaTitle',
              type: 'text',
              label: 'CTA Title',
              defaultValue: 'Let our Sherpa team build you a custom itinerary',
            },
            {
              name: 'ctaDescription',
              type: 'textarea',
              label: 'CTA Description',
              defaultValue:
                "Every region has its own character — best season, difficulty, permits, altitude schedule. Tell us what you want and we'll design the trip around you.",
            },
            {
              name: 'ctaButtonHref',
              type: 'text',
              label: 'Button Link',
              defaultValue: '/plan-a-trip',
              admin: {
                description: 'Use a relative path (e.g. /plan-a-trip) or full URL.',
              },
            },
          ],
        },
      ],
    },
  ],
};
