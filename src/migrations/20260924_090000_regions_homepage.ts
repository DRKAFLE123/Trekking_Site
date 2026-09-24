import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Regions gain two homepage controls: whether the region card appears in the
// homepage "Explore Trekking Regions" grid, and its position there.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "regions"
      ADD COLUMN IF NOT EXISTS "show_on_homepage" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "homepage_order" numeric;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "regions"
      DROP COLUMN IF EXISTS "show_on_homepage",
      DROP COLUMN IF EXISTS "homepage_order";
  `)
}
