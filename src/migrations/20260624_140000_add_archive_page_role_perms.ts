import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the role-matrix permission checkboxes for the two new singletons
// added in 20260624_120000_add_archive_page_settings: regionsPageSettings
// and countriesPageSettings. Each gets 4 actions (read/create/update/delete)
// = 8 new boolean columns on the roles table.

const NEW_PERMS = [
  'regionspagesettings_read',
  'regionspagesettings_create',
  'regionspagesettings_update',
  'regionspagesettings_delete',
  'countriespagesettings_read',
  'countriespagesettings_create',
  'countriespagesettings_update',
  'countriespagesettings_delete',
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
