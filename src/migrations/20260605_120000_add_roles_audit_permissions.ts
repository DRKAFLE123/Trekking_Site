import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the missing Roles permission checkboxes for collections that already
// exist but weren't exposed in the role matrix: companyPages, contactPages,
// blogSettings, homepageSettings, navbarSettings, footerSettings.
//
// Each gets 4 actions (read/create/update/delete) = 24 new boolean columns.

const NEW_PERMS = [
  'companypages_read', 'companypages_create', 'companypages_update', 'companypages_delete',
  'contactpages_read', 'contactpages_create', 'contactpages_update', 'contactpages_delete',
  'blogsettings_read', 'blogsettings_create', 'blogsettings_update', 'blogsettings_delete',
  'homepagesettings_read', 'homepagesettings_create', 'homepagesettings_update', 'homepagesettings_delete',
  'navbarsettings_read', 'navbarsettings_create', 'navbarsettings_update', 'navbarsettings_delete',
  'footersettings_read', 'footersettings_create', 'footersettings_update', 'footersettings_delete',
];

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const stmts = NEW_PERMS.map(
    (col) => `ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "permissions_${col}" boolean DEFAULT false;`,
  ).join('\n');
  await db.execute(sql.raw(stmts));
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  const stmts = NEW_PERMS.map(
    (col) => `ALTER TABLE "roles" DROP COLUMN IF EXISTS "permissions_${col}";`,
  ).join('\n');
  await db.execute(sql.raw(stmts));
}
