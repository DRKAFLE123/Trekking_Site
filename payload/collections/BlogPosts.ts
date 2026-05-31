import { CollectionConfig, Block } from 'payload';
import { checkPermission } from '../access';
import { lexicalEditor, BlocksFeature, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical';

const TrekCardBlock: Block = {
  slug: 'trekCardBlock',
  labels: {
    singular: 'Trek Card',
    plural: 'Trek Cards',
  },
  fields: [
    {
      name: 'trek',
      type: 'relationship',
      relationTo: 'treks',
      required: true,
      admin: {
        description: 'Select the trek package to display inside the blog.',
      },
    },
    {
      name: 'customOneLiner',
      type: 'text',
      label: 'Custom One Liner',
      admin: {
        description: 'Optional override for the short description under the title.',
      },
    },
  ],
};

const CtaBlock: Block = {
  slug: 'ctaBlock',
  labels: {
    singular: 'CTA Holiday Banner',
    plural: 'CTA Holiday Banners',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      defaultValue: 'Want to Plan Your Holiday in Nepal?',
      required: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Make Inquiry Now',
      required: true,
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      defaultValue: '+977-9823636377',
      required: true,
    },
  ],
};

const getLexicalText = (node: any): string => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.text) return node.text;
  if (node.root) return getLexicalText(node.root);
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(getLexicalText).join(' ');
  }
  return '';
};

export const blogPosts: CollectionConfig = {
  slug: 'blogPosts',
  access: {
    read: checkPermission('blogPosts', 'read'),
    create: checkPermission('blogPosts', 'create'),
    update: checkPermission('blogPosts', 'update'),
    delete: checkPermission('blogPosts', 'delete'),
  },
  admin: {
    group: 'Website Content',
    useAsTitle: 'title',
    preview: (doc) => {
      if (doc && doc.slug) {
        return `/blogs/preview/${doc.slug}`;
      }
      return '';
    },
    livePreview: {
      url: ({ data }) => `/blogs/preview/${data?.slug || data?.id || 'new-post'}`,
    },
    components: {
      edit: {
        PreviewButton: '@components/payload/CustomPreviewToggle#CustomPreviewToggle',
      }
    }
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data && data.body) {
          const text = getLexicalText(data.body);
          const words = text.trim() ? text.trim().split(/\s+/) : [];
          const wordCount = words.length;
          data.wordCount = wordCount;
          
          const minutes = Math.max(1, Math.ceil(wordCount / 200));
          data.readTime = `${minutes} min read`;
        } else {
          data.wordCount = 0;
          data.readTime = '0 min read';
        }
        return data;
      }
    ]
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1500, // Autosave every 1.5 seconds of inactivity
      },
    },
  },
  fields: [
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Hero Cover Image',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Post Title',
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          EXPERIMENTAL_TableFeature(),
          BlocksFeature({
            blocks: [TrekCardBlock, CtaBlock],
          }),
        ],
      }),
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'A brief summary of the blog post shown on lists and category cards.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      admin: {
        description: 'Search engine and social sharing settings for this post.',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      required: true,
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'teamMembers',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'E.g. Trekking Guides, Travel Info, Packing Tips',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Feature on Homepage',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        position: 'sidebar',
        description: 'Keywords/tags for quick search.',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'Enter tag name...',
          },
        },
      ],
    },
    {
      name: 'relatedTreks',
      type: 'relationship',
      relationTo: 'treks',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'wordCount',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-calculated from post body.',
      },
    },
    {
      name: 'readTime',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-calculated from post body.',
      },
    },
  ],
};
