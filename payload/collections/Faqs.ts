import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';
import { revalidateFaq, revalidateFaqDelete } from '../hooks/revalidate';

export const faqs: CollectionConfig = {
  slug: 'faqs',
  defaultSort: 'order',
  access: {
    read: checkPermission('faqs', 'read'),
    create: checkPermission('faqs', 'create'),
    update: checkPermission('faqs', 'update'),
    delete: checkPermission('faqs', 'delete'),
  },
  hooks: {
    afterChange: [revalidateFaq],
    afterDelete: [revalidateFaqDelete],
  },
  admin: {
    group: 'Website Content',
    useAsTitle: 'question',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'FAQ Details',
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
            },
            {
              name: 'answer',
              type: 'richText',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Used for sorting FAQs on pages. Smaller numbers appear first.',
              },
            },
          ],
        },
        {
          label: 'Targeting / Scope',
          fields: [
            {
              name: 'category',
              type: 'select',
              options: [
                { label: 'Basic Information', value: 'general' },
                { label: 'Physical Readiness & Training', value: 'prep_fitness' },
                { label: 'Entry permit', value: 'permits' },
                { label: 'Assurance and Travel permit', value: 'insurance_visa' },
                { label: 'Himalayan Guide & Support Team', value: 'guides_staff' },
                { label: 'Where You Stay & What’s Included', value: 'accommodation_facilities' },
                { label: 'Meals and Refreshments', value: 'food_drinks' },
                { label: 'Weather Patterns & Seasonal Changes', value: 'weather_seasons' },
                { label: 'Health Protection & Safety', value: 'health_safety' },
                { label: 'Equipment & Packing List', value: 'packing_gear' },
                { label: 'Trip Booking & Payment Policy', value: 'booking_payments' },
                { label: 'Flights & Ground Transport', value: 'transportation_flights' },
                { label: 'Everest Region', value: 'everest' },
                { label: 'Annapurna Region', value: 'annapurna' },
                { label: 'Manaslu Region', value: 'manaslu' },
                { label: 'Langtang Region', value: 'langtang' },
                { label: 'Ganesh Himal Region', value: 'ganesh-himal' },
                { label: 'Mustang Region', value: 'mustang' },
                { label: 'Kanchenjunga Region', value: 'kanchenjunga' },
                { label: 'Makalu Region', value: 'makalu' },
                { label: 'Dolpa Region', value: 'dolpa' },
                { label: 'Tour in Nepal', value: 'tour-in-nepal' },
                { label: 'Expedition in Nepal', value: 'expedition-in-nepal' },
                { label: 'Peak Climbing in Nepal', value: 'peak-climbing-in-nepal' },
                { label: 'Jungle Safari in Nepal', value: 'jungle-safari-in-nepal' },
                { label: 'River Rafting in Nepal', value: 'river-rafting-in-nepal' },
                { label: 'Bungee Jumping in Nepal', value: 'bungee-jumping-in-nepal' },
                { label: 'Paragliding in Nepal', value: 'paragliding-in-nepal' },
              ],
              required: true,
              defaultValue: 'general',
              admin: {
                description: 'Categorize this FAQ to help organize lists.',
              },
            },
            {
              name: 'treks',
              type: 'relationship',
              relationTo: 'treks',
              hasMany: true,
              required: false,
              admin: {
                description: 'Optional: Select specific treks where this FAQ will appear. If empty, this FAQ is global.',
              },
            },
          ],
        },
      ],
    },
  ],
};
