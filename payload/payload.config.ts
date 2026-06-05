// Deploy trigger: database config updates
import { buildConfig } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { SiteSettings } from './collections/SiteSettings';
import { NavbarSettings } from './collections/NavbarSettings';
import { FooterSettings } from './collections/FooterSettings';
import { HomepageSettings } from './collections/HomepageSettings';
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
import { Pages } from './collections/Pages';
import { ContactPages } from './collections/ContactPages';
import { BlogSettings } from './collections/BlogSettings';
import { CompanyPages } from './collections/CompanyPages';
import { roles } from './collections/Roles';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const rawDbUrl = process.env.DATABASE_URL || process.env.DATABASE_URI || '';
const dbUrl = rawDbUrl.trim().replace(/^["']|["']$/g, '');

// This project uses a single Supabase Postgres database for both dev and prod.
// SQLite is no longer supported — `DATABASE_URI` must be a Postgres URL.
if (!dbUrl.toLowerCase().startsWith('postgres://') && !dbUrl.toLowerCase().startsWith('postgresql://')) {
  throw new Error(
    'DATABASE_URI must be a Postgres connection string (postgres:// or postgresql://). ' +
    'See .env.example and Supabase → Project Settings → Database → Connection pooling.'
  );
}

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
    roles,
    SiteSettings,
    NavbarSettings,
    FooterSettings,
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
    media,
    Pages,
    ContactPages,
    BlogSettings,
    CompanyPages,
    HomepageSettings,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: dbUrl,
    },
    // Disable Drizzle dev-push so it doesn't prompt the dev server on schema
    // diffs (those prompts hang the server because it has no TTY). Schema
    // changes go through migrations in src/migrations/.
    push: false,
  }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'change_this_secret_1234567890',
  // Cap multipart uploads at 25 MB to protect disk + Cloudinary quota.
  // Images shouldn't exceed a few MB after compression; PDFs/videos can be
  // larger but a hard cap blocks accidental + abusive multi-GB uploads.
  upload: {
    limits: { fileSize: 25 * 1024 * 1024 },
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
