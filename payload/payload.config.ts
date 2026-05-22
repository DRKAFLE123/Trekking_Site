import { buildConfig } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { siteSettings } from './collections/SiteSettings';
import { regions } from './collections/Regions';
import { treks } from './collections/Treks';
import { blogPosts } from './collections/BlogPosts';
import { teamMembers } from './collections/TeamMembers';
import { testimonials } from './collections/Testimonials';
import { faqs } from './collections/Faqs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    // basic admin settings
  },
  collections: [siteSettings, regions, treks, blogPosts, teamMembers, testimonials, faqs],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
    },
  }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'change_this_secret_1234567890',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
