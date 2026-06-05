import { CollectionConfig } from 'payload';
import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical';
import { checkPermission } from '../access';
import { revalidateTrek, revalidateTrekDelete } from '../hooks/revalidate';

const parseYoutubeId = (args: any) => {
  const value = args.value;
  if (value) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = value.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
  }
  return value;
};

const filterEmptyFaqs = ({ value }: any) => {
  if (Array.isArray(value)) {
    return value.filter((item: any) => {
      const hasQuestion = item.question && item.question.trim().length > 0;
      const hasAnswer = item.answer && typeof item.answer === 'object' && Object.keys(item.answer).length > 0;
      return hasQuestion || hasAnswer;
    });
  }
  return value;
};

// ============================================================
// MODULARIZED COLLAPSIBLE SECTIONS (CHRONOLOGICAL FRONTEND ORDER)
// ============================================================

const basicInfoSection = {
  type: 'collapsible' as const,
  label: '📋 Basic Info',
  admin: {
    initCollapsed: false,
    description: 'Core details shown in the title bar, specs card, and booking widget.',
  },
  fields: [
    {
      type: 'row' as const,
      fields: [
        {
          name: 'title',
          type: 'text' as const,
          required: true,
          admin: { description: 'Full trek name, e.g. "Everest Base Camp Trek – 14 Days"' },
        },
        {
          name: 'slug',
          type: 'text' as const,
          required: true,
          unique: true,
          admin: { description: 'URL identifier, no spaces. e.g. "everest-base-camp-trek-14"' },
          hooks: {
            beforeValidate: [
              ({ value, data }: any) => {
                if (value) {
                  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                }
                if (data?.title) {
                  return data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                }
                return value;
              }
            ]
          }
        },
      ],
    },
    {
      type: 'row' as const,
      fields: [
        {
          name: 'region',
          type: 'relationship' as const,
          relationTo: 'regions' as const,
          required: true,
        },
        {
          name: 'difficulty',
          type: 'select' as const,
          options: [
            { label: '🟢 Easy', value: 'easy' },
            { label: '🟡 Moderate', value: 'moderate' },
            { label: '🔴 Hard', value: 'hard' },
            { label: '⚫ Extreme', value: 'extreme' },
          ],
          required: true,
        },
      ],
    },
    {
      type: 'row' as const,
      fields: [
        {
          name: 'price',
          type: 'number' as const,
          required: true,
          admin: { description: 'Original price in USD per person' },
        },
        {
          name: 'discountedPrice',
          type: 'number' as const,
          admin: { description: 'Sale/discounted price in USD (leave empty if no discount)' },
        },
      ],
    },
    {
      type: 'row' as const,
      fields: [
        {
          name: 'duration',
          type: 'number' as const,
          required: true,
          admin: { description: 'Total number of days (e.g. 14)' },
        },
        {
          name: 'maxAltitude',
          type: 'number' as const,
          required: true,
          admin: { description: 'Highest point in meters (e.g. 5364)' },
        },
        {
          name: 'groupSize',
          type: 'number' as const,
          admin: { description: 'Max group size (e.g. 12)' },
        },
      ],
    },
    {
      type: 'row' as const,
      fields: [
        {
          name: 'startPoint',
          type: 'text' as const,
          admin: { description: 'Where the trek starts (e.g. Lukla)' },
        },
        {
          name: 'endPoint',
          type: 'text' as const,
          admin: { description: 'Where the trek ends (e.g. Lukla)' },
        },
      ],
    },
    {
      type: 'row' as const,
      fields: [
        {
          name: 'bestSeason',
          type: 'text' as const,
          admin: { description: 'Best months to trek (e.g. "Spring (Mar–May) & Autumn (Sep–Nov)")' },
        },
        {
          name: 'accommodationType',
          type: 'text' as const,
          admin: { description: 'Accommodation type (e.g. "Teahouses & 3-Star Hotels in KTM")' },
        },
      ],
    },
    {
      type: 'row' as const,
      fields: [
        {
          name: 'mealsIncluded',
          type: 'text' as const,
          admin: { description: 'Meals provided (e.g. "Breakfast, Lunch & Dinner on trek")' },
        },
        {
          name: 'isBestSeller',
          type: 'checkbox' as const,
          defaultValue: false,
          label: '⭐ Feature as Best Seller',
        },
      ],
    },
  ],
};

const overviewSection = {
  type: 'collapsible' as const,
  label: '📖 Overview & Highlights',
  admin: {
    initCollapsed: true,
    description: 'The main description and highlight bullet points shown at the top of the trek page.',
  },
  fields: [
    {
      name: 'highlights',
      type: 'array' as const,
      label: 'Trek Highlights',
      admin: {
        description: 'Key selling points shown as a bullet list. Add one highlight per row.',
      },
      labels: {
        singular: 'Highlight',
        plural: 'Highlights',
      },
      fields: [
        {
          name: 'highlight',
          type: 'textarea' as const,
          required: true,
          admin: { 
            width: '100%',
            description: 'e.g. "Stand at Everest Base Camp (5,364m)"' 
          },
        },
      ],
    },
    {
      name: 'overview',
      type: 'richText' as const,
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          EXPERIMENTAL_TableFeature(),
        ],
      }),
      admin: {
        description: 'Main trek description. Use headings, bold text, and paragraphs for a well-structured overview.',
      },
    },
  ],
};

const flightInfoSection = {
  type: 'collapsible' as const,
  label: '✈️ Flight Info & Trip Briefing',
  admin: {
    initCollapsed: true,
    description: 'Shown as info cards on the trek page. Explain flight logistics and the pre-trip online briefing process.',
  },
  fields: [
    {
      name: 'flightInfoTitle',
      type: 'text' as const,
      label: 'Flight Info Card Title',
      defaultValue: 'Lukla Flight Information',
      admin: {
        description: 'Custom title for this card, e.g. "Lukla Flight Information" or "Pokhara Flight Information" or "Flight Information". Defaults to "Lukla Flight Information".',
      },
    },
    {
      name: 'flightInfo',
      type: 'richText' as const,
      label: 'Flight Information Content',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          EXPERIMENTAL_TableFeature(),
        ],
      }),
      admin: {
        description: 'Explain flight details, seasonal variations, weather delays, and buffer day recommendations.',
      },
    },
    {
      name: 'briefingInfo',
      type: 'richText' as const,
      label: 'Online Trip Briefing',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          EXPERIMENTAL_TableFeature(),
        ],
      }),
      admin: {
        description: 'Explain the pre-trek online briefing process — what it covers, when it happens, how to join (WhatsApp/Zoom).',
      },
    },
  ],
};

const mediaSection = {
  type: 'collapsible' as const,
  label: '🖼️ Media — Photos, Video & Route Map',
  admin: {
    initCollapsed: true,
    description: 'Upload photos, add a YouTube video, and upload the route map image.',
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload' as const,
      relationTo: 'media' as const,
      label: 'Hero Cover Photo',
      admin: {
        description: 'Main cover image shown at the top of the page. Use a landscape photo, minimum 1200px wide.',
      },
    },
    {
      name: 'mapImage',
      type: 'upload' as const,
      relationTo: 'media' as const,
      label: 'Route Map Image',
      admin: {
        description: 'Upload a static route map (JPG/PNG/WebP). If empty, the interactive GPS map will be used instead.',
      },
    },
    {
      name: 'gallery',
      type: 'array' as const,
      label: 'Photo Gallery',
      admin: {
        description: 'Upload additional trek photos (up to 20 recommended). They appear in the gallery grid.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload' as const,
          relationTo: 'media' as const,
          required: true,
        },
      ],
    },
    {
      name: 'youtubeVideoId',
      type: 'text' as const,
      label: 'YouTube Video',
      hooks: {
        beforeValidate: [parseYoutubeId],
      },
      admin: {
        description: 'Paste the full YouTube URL or just the 11-character video ID (e.g. fAsw_vB3JpI). The video will be embedded on the trek page.',
      },
    },
  ],
};

const itinerarySection = {
  type: 'collapsible' as const,
  label: '🗓️ Day-by-Day Itinerary',
  admin: {
    initCollapsed: true,
    description: 'Add one entry per day. Each day appears as an expandable accordion on the trek page.',
  },
  fields: [
    {
      name: 'dayByDayItinerary',
      type: 'array' as const,
      labels: {
        singular: 'Day',
        plural: 'Days',
      },
      fields: [
        {
          type: 'row' as const,
          fields: [
            {
              name: 'day',
              type: 'number' as const,
              required: true,
              admin: { description: 'Day number (1, 2, 3...)' },
            },
            {
              name: 'title',
              type: 'text' as const,
              required: true,
              admin: { description: 'Day title, e.g. "Fly to Lukla & Trek to Phakding (2,652m)"' },
            },
            {
              name: 'location',
              type: 'text' as const,
              label: 'Location Pin',
              admin: { description: 'Key location name (e.g. Lukla) to show as a header badge' },
            },
          ],
        },
        {
          type: 'row' as const,
          fields: [
            {
              name: 'distance',
              type: 'text' as const,
              admin: { description: 'Distance walked, e.g. "8.5 km (5.3 miles)"' },
            },
            {
              name: 'altitude',
              type: 'number' as const,
              label: 'Altitude (meters)',
              admin: { description: 'Altitude at end of day in meters, e.g. 2652' },
            },
          ],
        },
        {
          type: 'row' as const,
          fields: [
            {
              name: 'trekDuration',
              type: 'text' as const,
              label: 'Trek Duration',
              admin: { description: 'e.g. 3 hours' },
            },
            {
              name: 'flightHours',
              type: 'text' as const,
              label: 'Flight/Transport Duration',
              admin: { description: 'e.g. 40/20 Minutes' },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea' as const,
          required: true,
          admin: { description: 'What happens on this day. 2–4 sentences is ideal.' },
        },
        {
          type: 'row' as const,
          fields: [
            {
              name: 'accommodation',
              type: 'text' as const,
              admin: { description: 'Where you sleep, e.g. "Standard Teahouse"' },
            },
            {
              name: 'meals',
              type: 'text' as const,
              admin: { description: 'Meals provided, e.g. "B, L, D" or "Breakfast only"' },
            },
          ],
        },
        {
          name: 'media',
          type: 'array' as const,
          label: 'Day Media (Images & YouTube Videos)',
          labels: {
            singular: 'Media Item',
            plural: 'Media Items',
          },
          admin: {
            description: 'Add photos or YouTube videos for this specific itinerary day.',
          },
          fields: [
            {
              name: 'type',
              type: 'select' as const,
              required: true,
              defaultValue: 'image',
              options: [
                { label: '🖼️ Image Upload', value: 'image' },
                { label: '🎥 YouTube Video', value: 'video' },
              ],
            },
            {
              name: 'image',
              type: 'upload' as const,
              relationTo: 'media' as const,
              admin: {
                condition: (data: any, siblingData: any) => siblingData?.type === 'image',
                description: 'Select an image from library or upload one.',
              },
            },
            {
              name: 'youtubeUrl',
              type: 'text' as const,
              label: 'YouTube Video URL or ID',
              admin: {
                condition: (data: any, siblingData: any) => siblingData?.type === 'video',
                description: 'Paste YouTube watch URL or 11-character video ID.',
              },
            },
            {
              name: 'title',
              type: 'text' as const,
              label: 'Title / Caption',
              admin: { description: 'Optional short caption or title for this media.' },
            },
          ],
        },
      ],
    },
  ],
};

const inclusionsExclusionsSection = {
  type: 'collapsible' as const,
  label: '✅ Inclusions & Exclusions',
  admin: {
    initCollapsed: true,
    description: 'Define what is included and excluded in the package price. Categorize them into clean visual groups.',
  },
  fields: [
    {
      name: 'inclusions',
      type: 'array' as const,
      label: "What's Included",
      labels: {
        singular: 'Inclusion Category Group',
        plural: 'Inclusion Category Groups',
      },
      fields: [
        {
          name: 'heading',
          type: 'text' as const,
          label: 'Category Heading (e.g. Transportation)',
          required: true,
          admin: { width: '100%' },
        },
        {
          name: 'icon',
          type: 'select' as const,
          label: 'Icon Code',
          defaultValue: 'info',
          admin: { width: '100%' },
          options: [
            { label: '✈️ Transportation', value: 'transport' },
            { label: '🏨 Accommodations', value: 'accommodation' },
            { label: '🍽️ Food & Drinks', value: 'food' },
            { label: '👥 Guide & Porter', value: 'guide' },
            { label: '🎫 Permits & Fees', value: 'permits' },
            { label: '🛡️ Travel Insurance', value: 'insurance' },
            { label: '📋 Visa Info', value: 'visa' },
            { label: '🎒 Equipment & Gear', value: 'equipment' },
            { label: '💳 Personal Expenses', value: 'personal' },
            { label: 'ℹ️ Other Info', value: 'info' },
          ],
        },
        {
          name: 'points',
          type: 'array' as const,
          label: 'Inclusion Points',
          admin: { width: '100%' },
          labels: {
            singular: 'Inclusion Point',
            plural: 'Inclusion Points',
          },
          fields: [
            {
              name: 'point',
              type: 'text' as const,
              required: true,
              label: false as any,
              admin: {
                width: '100%',
                placeholder: 'e.g. Round-trip domestic flights (Kathmandu–Lukla–Kathmandu)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'exclusions',
      type: 'array' as const,
      label: "What's NOT Included",
      labels: {
        singular: 'Exclusion Category Group',
        plural: 'Exclusion Category Groups',
      },
      fields: [
        {
          name: 'heading',
          type: 'text' as const,
          label: 'Category Heading (e.g. Personal Expenses)',
          required: true,
          admin: { width: '100%' },
        },
        {
          name: 'icon',
          type: 'select' as const,
          label: 'Icon Code',
          defaultValue: 'personal',
          admin: { width: '100%' },
          options: [
            { label: '✈️ Transportation', value: 'transport' },
            { label: '🏨 Accommodations', value: 'accommodation' },
            { label: '🍽️ Food & Drinks', value: 'food' },
            { label: '👥 Guide & Porter', value: 'guide' },
            { label: '🎫 Permits & Fees', value: 'permits' },
            { label: '🛡️ Travel Insurance', value: 'insurance' },
            { label: '📋 Visa Info', value: 'visa' },
            { label: '🎒 Equipment & Gear', value: 'equipment' },
            { label: '💳 Personal Expenses', value: 'personal' },
            { label: 'ℹ️ Other Info', value: 'info' },
          ],
        },
        {
          name: 'points',
          type: 'array' as const,
          label: 'Exclusion Points',
          admin: { width: '100%' },
          labels: {
            singular: 'Exclusion Point',
            plural: 'Exclusion Points',
          },
          fields: [
            {
              name: 'point',
              type: 'text' as const,
              required: true,
              label: false as any,
              admin: {
                width: '100%',
                placeholder: 'e.g. International airfare and departure taxes',
              },
            },
          ],
        },
      ],
    },
  ],
};

const packingListSection = {
  type: 'collapsible' as const,
  label: '🎒 Packing List',
  admin: {
    initCollapsed: true,
    description: 'Required equipment list shown as an interactive checklist on the trek page. Group items by category.',
  },
  fields: [
    {
      name: 'packingList',
      type: 'array' as const,
      label: 'Gear Categories',
      labels: {
        singular: 'Category',
        plural: 'Categories',
      },
      admin: {
        description: 'Suggested categories: Headwear, Clothing Layers, Footwear & Handwear, Personal Gear, Toiletries & Medicines.',
      },
      fields: [
        {
          name: 'category',
          type: 'text' as const,
          required: true,
          admin: { description: 'Category name, e.g. "Clothing & Layers"' },
        },
        {
          name: 'items',
          type: 'array' as const,
          label: 'Items',
          fields: [
            {
              name: 'item',
              type: 'text' as const,
              required: true,
              admin: { description: 'e.g. "Down Jacket (rated to -10°C, provided if needed)"' },
            },
          ],
        },
      ],
    },
  ],
};

const tripInfoSection = {
  type: 'collapsible' as const,
  label: '📚 Trip Info — Topic Cards',
  admin: {
    initCollapsed: true,
    description: 'Add individual info topics (e.g. Accommodation, Meals, Altitude Safety, Insurance). Each appears as an expandable card on the trek page. Add as many topics as needed.',
  },
  fields: [
    {
      name: 'tripInfoSections',
      type: 'array' as const,
      label: 'Info Topics',
      labels: {
        singular: 'Info Topic',
        plural: 'Info Topics',
      },
      admin: {
        description: 'Tip: Good topics include — Accommodation, Food & Meals, Water & Hydration, Luggage Limits, Altitude Safety, Travel Insurance, Guide & Porters, Tipping Guidelines, Electricity & WiFi, Packing Tips.',
      },
      fields: [
        {
          name: 'title',
          type: 'text' as const,
          required: true,
          admin: { description: 'Topic title, e.g. "Accommodation & Lodging"' },
        },
        {
          name: 'icon',
          type: 'select' as const,
          label: 'Topic Icon',
          defaultValue: 'info',
          options: [
            { label: '🏨 Accommodation', value: 'accommodation' },
            { label: '🍽️ Food & Meals', value: 'food' },
            { label: '💧 Water & Hydration', value: 'water' },
            { label: '🎒 Luggage & Packing', value: 'luggage' },
            { label: '✈️ Flights & Transport', value: 'flights' },
            { label: '🛡️ Travel Insurance', value: 'insurance' },
            { label: '📋 Visa & Documents', value: 'visa' },
            { label: '🏥 Health & Safety', value: 'health' },
            { label: '🚁 Helicopter Rescue', value: 'helicopter' },
            { label: '👥 Guide & Porters', value: 'guide' },
            { label: '☀️ Weather & Seasons', value: 'weather' },
            { label: '🔌 Electricity & WiFi', value: 'electricity' },
            { label: '🚿 Hot Showers', value: 'shower' },
            { label: '💰 Money & ATMs', value: 'money' },
            { label: '🤝 Tipping', value: 'tipping' },
            { label: 'ℹ️ General Info', value: 'info' },
          ],
        },
        {
          name: 'content',
          type: 'richText' as const,
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              EXPERIMENTAL_TableFeature(),
            ],
          }),
          admin: {
            description: 'Content for this topic. You can use bold text, bullet lists, and paragraphs.',
          },
        },
        {
          name: 'image',
          type: 'upload' as const,
          relationTo: 'media' as const,
          label: 'Section Image / Chart',
          admin: {
            description: 'Optional image or chart to display in this section (e.g. Route Map, Altitude Chart, packing diagram).',
          },
        },
      ],
    },
  ],
};

const gpsRouteSection = {
  type: 'collapsible' as const,
  label: '🗺️ GPS Route Points (Interactive Map)',
  admin: {
    initCollapsed: true,
    description: 'Only needed if you do NOT upload a Route Map Image above. Enter GPS waypoints to draw an interactive map. If a map image is uploaded, the interactive map is hidden.',
  },
  fields: [
    {
      name: 'gpsCoordinates',
      type: 'array' as const,
      label: 'Route Waypoints',
      admin: {
        description: 'Add each key location on the route. The map will draw a line through them in order.',
      },
      fields: [
        {
          type: 'row' as const,
          fields: [
            {
              name: 'lat',
              type: 'number' as const,
              required: true,
              label: 'Latitude',
              admin: { description: 'e.g. 27.9878' },
            },
            {
              name: 'lng',
              type: 'number' as const,
              required: true,
              label: 'Longitude',
              admin: { description: 'e.g. 86.9250' },
            },
          ],
        },
        {
          type: 'row' as const,
          fields: [
            {
              name: 'label',
              type: 'text' as const,
              required: true,
              label: 'Place Name',
              admin: { description: 'e.g. "Namche Bazaar"' },
            },
            {
              name: 'altitude',
              type: 'number' as const,
              label: 'Altitude (m)',
              admin: { description: 'Optional: altitude in meters' },
            },
          ],
        },
      ],
    },
  ],
};

const groupDiscountsSection = {
  type: 'collapsible' as const,
  label: '💰 Group Size Discounts',
  admin: {
    initCollapsed: true,
    description: 'Set tiered pricing based on group size. These appear in the booking sidebar. If left empty, a default 4–16% discount table is auto-calculated.',
  },
  fields: [
    {
      name: 'groupDiscounts',
      type: 'array' as const,
      label: 'Discount Tiers',
      admin: {
        description: 'Example: 1 person = $1,500 | 2–3 persons = $1,440 | 4–7 persons = $1,380',
      },
      fields: [
        {
          type: 'row' as const,
          fields: [
            {
              name: 'minPersons',
              type: 'number' as const,
              required: true,
              admin: { description: 'Min group size (e.g. 1)' },
            },
            {
              name: 'maxPersons',
              type: 'number' as const,
              required: true,
              admin: { description: 'Max group size (e.g. 3)' },
            },
            {
              name: 'pricePerPerson',
              type: 'number' as const,
              required: true,
              admin: { description: 'Price per person in USD (e.g. 1440)' },
            },
          ],
        },
      ],
    },
  ],
};

const faqsSection = {
  type: 'collapsible' as const,
  label: '❓ FAQs (Trek-Specific)',
  admin: {
    initCollapsed: true,
    description: 'Frequently asked questions specific to this trek. These appear in the full-width FAQ section at the bottom of the trek page.',
  },
  fields: [
    {
      name: 'faqs',
      type: 'array' as const,
      hooks: {
        beforeValidate: [filterEmptyFaqs],
      },
      labels: {
        singular: 'FAQ',
        plural: 'FAQs',
      },
      fields: [
        {
          name: 'question',
          type: 'text' as const,
          required: true,
          admin: { description: 'The question travellers often ask' },
        },
        {
          name: 'category',
          type: 'select' as const,
          label: 'Category',
          defaultValue: 'general',
          options: [
            { label: 'ℹ️ Basic Information', value: 'general' },
            { label: '💪 Physical Readiness & Training', value: 'prep_fitness' },
            { label: '🎫 Entry permit', value: 'permits' },
            { label: '📋 Assurance and Travel permit', value: 'insurance_visa' },
            { label: '👥 Himalayan Guide & Support Team', value: 'guides_staff' },
            { label: '🏨 Where You Stay & What’s Included', value: 'accommodation_facilities' },
            { label: '🍽️ Meals and Refreshments', value: 'food_drinks' },
            { label: '☀️ Weather Patterns & Seasonal Changes', value: 'weather_seasons' },
            { label: '🏥 Health Protection & Safety', value: 'health_safety' },
            { label: '🎒 Equipment & Packing List', value: 'packing_gear' },
            { label: '💳 Trip Booking & Payment Policy', value: 'booking_payments' },
            { label: '✈️ Flights & Ground Transport', value: 'transportation_flights' },
          ],
        },
        {
          name: 'answer',
          type: 'richText' as const,
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              EXPERIMENTAL_TableFeature(),
            ],
          }),
          admin: { description: 'Clear, helpful answer. 2–4 sentences is ideal.' },
        },
      ],
    },
  ],
};

const seoSection = {
  type: 'collapsible' as const,
  label: '🔍 SEO (Search Engine)',
  admin: {
    initCollapsed: true,
    description: 'Optional but recommended. Improves how this trek appears in Google search results.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text' as const,
      label: 'Meta Title',
      admin: {
        description: 'Page title for Google (50–60 chars). Leave blank to auto-use the trek title.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea' as const,
      label: 'Meta Description',
      admin: {
        description: 'Short description for Google search results (140–160 chars). Leave blank to auto-use the overview.',
      },
    },
  ],
};

// ============================================================
// MAIN COLLECTION SCHEMA
// ============================================================

export const treks: CollectionConfig = {
  slug: 'treks',
  access: {
    read: checkPermission('treks', 'read'),
    create: checkPermission('treks', 'create'),
    update: checkPermission('treks', 'update'),
    delete: checkPermission('treks', 'delete'),
  },
  admin: {
    group: 'Trekking & Operations',
    useAsTitle: 'title',
    description: 'Manage all trek packages. Each section below corresponds to a section on the trek detail page.',
  },
  hooks: {
    afterChange: [revalidateTrek],
    afterDelete: [revalidateTrekDelete],
  },
  fields: [
    basicInfoSection,
    overviewSection,
    flightInfoSection,
    mediaSection,
    itinerarySection,
    inclusionsExclusionsSection,
    packingListSection,
    tripInfoSection,
    gpsRouteSection,
    groupDiscountsSection,
    faqsSection,
    seoSection,
  ],
};
