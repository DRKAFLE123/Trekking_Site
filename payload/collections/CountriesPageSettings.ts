import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';
import { revalidateGlobalSettings } from '../hooks/revalidate';

// Singleton driving the new `/countries` listing page. We have a fixed set
// of 3 countries (Nepal / Tibet / Bhutan) that mirror the enum on Regions,
// so the country cards live as an array on this singleton rather than as
// their own collection. The client can swap images, edit copy, or hide a
// card without code changes. Frontend falls back to sensible defaults if
// the CMS row is empty.
export const CountriesPageSettings: CollectionConfig = {
  slug: 'countriesPageSettings',
  access: {
    read: () => true,
    create: checkPermission('countriesPageSettings', 'create'),
    update: checkPermission('countriesPageSettings', 'update'),
    delete: checkPermission('countriesPageSettings', 'delete'),
  },
  admin: {
    group: 'Archive Pages',
    useAsTitle: 'internalLabel',
    description:
      'Edit the /countries listing page: hero, the 3 country cards, and the bottom CTA.',
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
      defaultValue: 'Countries Page Settings',
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
          description: 'The top banner of the /countries page.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'heroKicker',
                  type: 'text',
                  label: 'Kicker / Eyebrow',
                  defaultValue: 'Browse by Country',
                },
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Browser Tab Title',
                  defaultValue:
                    'Trekking Destinations by Country | Nature Heaven Trekking & Expedition',
                },
              ],
            },
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Hero Title',
              defaultValue: 'Choose Your Himalayan Destination',
            },
            {
              name: 'heroDescription',
              type: 'textarea',
              label: 'Hero Description',
              defaultValue:
                'Three countries, one Himalaya. Nepal for the legendary Everest and Annapurna circuits, Tibet for the high-altitude monasteries and remote north face, Bhutan for pristine kingdom valleys and Buddhist culture.',
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
                'Discover private Himalayan trekking experiences across Nepal, Tibet, and Bhutan — three distinct cultures, terrains, and routes curated by native Sherpa guides.',
            },
          ],
        },
        {
          label: 'Country Cards',
          description:
            'The 3 country cards (Nepal, Tibet, Bhutan). Slugs must match the country pages at /countries/<slug>.',
          fields: [
            {
              name: 'countries',
              type: 'array',
              label: 'Country Cards',
              minRows: 0,
              maxRows: 12,
              admin: {
                description:
                  'Edit / reorder / hide. Leave empty to use the built-in defaults (Nepal, Tibet, Bhutan).',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Country Name (e.g. Nepal)',
                    },
                    {
                      name: 'slug',
                      type: 'text',
                      required: true,
                      label: 'Slug (matches /countries/<slug>)',
                      admin: {
                        description:
                          'Use lowercase, no spaces. Must match an existing country page slug: nepal | tibet | bhutan.',
                      },
                    },
                  ],
                },
                {
                  name: 'tagline',
                  type: 'text',
                  label: 'Tagline (1 line, shown under the name)',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Card Description',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Card Cover Image',
                },
                {
                  name: 'hide',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Hide This Country',
                },
              ],
            },
          ],
        },
        {
          label: 'Bottom CTA',
          description: 'The call-to-action at the bottom of the page.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaKicker',
                  type: 'text',
                  label: 'Kicker',
                  defaultValue: 'Cross-border itinerary?',
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
              defaultValue: 'Multi-country journeys, fully customized',
            },
            {
              name: 'ctaDescription',
              type: 'textarea',
              label: 'CTA Description',
              defaultValue:
                'Combine Nepal with Tibet via the Friendship Highway, or pair Bhutan with an Everest base camp trek. Tell us your dream itinerary and we will handle permits, logistics, and the local crew.',
            },
            {
              name: 'ctaButtonHref',
              type: 'text',
              label: 'Button Link',
              defaultValue: '/plan-a-trip',
            },
          ],
        },
      ],
    },
  ],
};
