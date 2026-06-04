import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';
import { revalidatePage, revalidatePageDelete } from '../hooks/revalidate';

export const CompanyPages: CollectionConfig = {
  slug: 'companyPages',
  labels: {
    singular: 'Company Page',
    plural: 'Company Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Website Content',
  },
  access: {
    read: () => true, // Publicly readable for dynamic frontend routing
    create: checkPermission('companyPages', 'create'),
    update: checkPermission('companyPages', 'update'),
    delete: checkPermission('companyPages', 'delete'),
  },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Content',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Page Title',
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  index: true,
                  label: 'URL Slug',
                  admin: {
                    description: 'The URL path for this page (e.g. about-us, why-us, csr). Auto-generated from title if left blank.',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value, data }) => {
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
              name: 'excerpt',
              type: 'textarea',
              label: 'Short Excerpt / Summary',
              admin: {
                description: 'Used for list previews, cards, and meta tags.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Page Content',
              required: true,
            },
          ],
        },
        {
          label: 'Media Settings',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Background Image',
              admin: {
                description: 'Large image displayed at the top of the page behind the title.',
              },
            },
          ],
        },
        {
          label: 'SEO Settings',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              label: 'SEO Title',
              admin: {
                description: 'Leave blank to use the page title.',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'SEO Description',
              admin: {
                description: 'Leave blank to use the excerpt.',
              },
            },
          ],
        },
        {
          label: 'Related Resources',
          fields: [
            {
              name: 'relatedTreks',
              type: 'relationship',
              relationTo: 'treks',
              hasMany: true,
              label: 'Recommended / Related Treks',
              admin: {
                description: 'Select related trekking itineraries to display as promotional cards on this page.',
              },
            },
            {
              name: 'documents',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              label: 'Downloadable Documents / PDFs',
              admin: {
                description: 'Link PDFs, visa guidelines, or maps for travelers to download.',
              },
            },
            {
              name: 'legalCertificates',
              type: 'array',
              label: 'Legal Certificates & Photos',
              labels: {
                singular: 'Certificate',
                plural: 'Certificates',
              },
              admin: {
                description: 'Add photos/images of government registration certificates, licenses, and tax documents (displays on the Legal Documents page).',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Certificate Title',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Certificate Image / Photo',
                  required: true,
                },
              ],
            },
            {
              name: 'teamMembers',
              type: 'array',
              label: 'Team Members (Direct Upload)',
              labels: {
                singular: 'Team Member',
                plural: 'Team Members',
              },
              admin: {
                description: 'Add team members directly inside this page document (displays on the Our Team page).',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'role',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Photo',
                },
                {
                  name: 'bio',
                  type: 'textarea',
                  label: 'Biography / Description',
                },
                {
                  name: 'socialLinks',
                  type: 'group',
                  label: 'Social Links',
                  fields: [
                    { name: 'facebook', type: 'text', label: 'Facebook URL' },
                    { name: 'instagram', type: 'text', label: 'Instagram URL' },
                    { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
                    { name: 'twitter', type: 'text', label: 'Twitter URL' },
                  ],
                },
              ],
            },
            {
              name: 'videos',
              type: 'array',
              label: 'Helper YouTube Videos',
              labels: {
                singular: 'Video',
                plural: 'Videos',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Video Title',
                  required: true,
                },
                {
                  name: 'youtubeUrl',
                  type: 'text',
                  label: 'YouTube Video URL or ID',
                  required: true,
                  admin: {
                    description: 'Paste watch URL or 11-char ID.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'CSR Settings',
          fields: [
            {
              name: 'csrQuote',
              type: 'group',
              label: 'CSR Quote (Optional)',
              fields: [
                {
                  name: 'text',
                  type: 'textarea',
                  label: 'Quote Text',
                },
                {
                  name: 'author',
                  type: 'text',
                  label: 'Author Name (e.g. Mingma Sherpa, CEO)',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Quote Side Image',
                },
              ],
            },
            {
              name: 'csrCommitments',
              type: 'array',
              label: 'CSR Commitments / Pillars',
              labels: {
                singular: 'Commitment',
                plural: 'Commitments',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Title',
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon Code',
                  options: [
                    { label: 'Graduation Cap / Education', value: 'education' },
                    { label: 'Clothing / Porter Welfare', value: 'welfare' },
                    { label: 'Seedling / Eco-ethics', value: 'eco' },
                    { label: 'Money Bill / Local Economy', value: 'economy' },
                    { label: 'Hands / Community Relief', value: 'community' },
                    { label: 'Shield / Safety', value: 'safety' },
                  ],
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  label: 'Short Description',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
