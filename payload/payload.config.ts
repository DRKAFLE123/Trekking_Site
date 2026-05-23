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
import { gallery } from './collections/Gallery';
import { faqs } from './collections/Faqs';
import { departures } from './collections/Departures';
import { bookings } from './collections/Bookings';
import { inquiries } from './collections/Inquiries';
import { payments } from './collections/Payments';
import { users } from './collections/Users';
import { media } from './collections/Media';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    components: {
      graphics: {
        Logo: '@components/payload/AdminHeaderLogo#AdminHeaderLogo',
        Icon: '@/components/payload/Icon#Icon',
      },
    },
    avatar: {
      Component: '@components/payload/CustomAvatar#CustomAvatar',
    },
  },
  collections: [
    users,
    siteSettings,
    regions,
    treks,
    blogPosts,
    teamMembers,
    testimonials,
    gallery,
    faqs,
    departures,
    bookings,
    inquiries,
    payments,
    media
  ],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
    },
    push: false,
  }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'change_this_secret_1234567890',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
