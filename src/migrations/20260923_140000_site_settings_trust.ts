import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the `trust` group to siteSettings: founding year, company registration
// number and TripAdvisor details, rendered as trust chips in the homepage hero.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "trust_founded_year" numeric,
      ADD COLUMN IF NOT EXISTS "trust_registration_no" varchar,
      ADD COLUMN IF NOT EXISTS "trust_trip_advisor_url" varchar,
      ADD COLUMN IF NOT EXISTS "trust_trip_advisor_reviews" numeric,
      ADD COLUMN IF NOT EXISTS "trust_trip_advisor_rating" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "trust_founded_year",
      DROP COLUMN IF EXISTS "trust_registration_no",
      DROP COLUMN IF EXISTS "trust_trip_advisor_url",
      DROP COLUMN IF EXISTS "trust_trip_advisor_reviews",
      DROP COLUMN IF EXISTS "trust_trip_advisor_rating";
  `)
}
