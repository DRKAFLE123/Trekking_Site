// Deploy trigger: database config updates
import { buildConfig } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { SiteSettings } from './collections/SiteSettings';
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

const rawDbUrl = process.env.DATABASE_URL || process.env.DATABASE_URI || '';
const dbUrl = rawDbUrl.trim().replace(/^["']|["']$/g, '');
const isPostgres = dbUrl.toLowerCase().startsWith('postgres://') || dbUrl.toLowerCase().startsWith('postgresql://');

export default buildConfig({
  admin: {
    user: users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    components: {
      graphics: {
        Logo: '@components/payload/AdminHeaderLogo#AdminHeaderLogo',
        Icon: '@components/payload/Icon#Icon',
      },
      beforeLogin: ['@components/payload/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['@components/payload/BeforeDashboard#BeforeDashboard'],
      beforeNav: ['@components/payload/BeforeNav#BeforeNav'],
    },
    avatar: {
      Component: '@components/payload/CustomAvatar#CustomAvatar',
    },
  },
  collections: [
    users,
    SiteSettings,
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
  db: isPostgres
    ? postgresAdapter({
        pool: {
          connectionString: dbUrl,
        },
        push: true,
      })
    : sqliteAdapter({
        client: {
          url: dbUrl || 'file:./payload.db',
        },
        push: true,
      }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'change_this_secret_1234567890',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
