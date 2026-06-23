import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Recovery migration. Damodar added four schema fields without shipping
// matching migrations, which broke every query against `site_settings` and
// `regions` — taking down the homepage layout metadata, all trek detail
// pages, and all region detail pages with `column does not exist` errors.
//
// 1. `site_settings.seo_image_id` — `seoImage` upload (default social
//    share image).
// 2. `site_settings.header_settings_nepal_branch_phone` — header Nepal
//    branch phone.
// 3. `site_settings.header_settings_uk_branch_phone` — header UK branch
//    phone.
// 4. `regions.country` — select field (enum: nepal | tibet | bhutan,
//    default `nepal`).
//
// All are nullable/defaulted so existing rows survive without backfill.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- site_settings.seo_image_id (upload relation → media.id)
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_image_id" integer;

    DO $$ BEGIN
      ALTER TABLE "site_settings"
        ADD CONSTRAINT "site_settings_seo_image_id_media_id_fk"
        FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "site_settings_seo_image_idx"
      ON "site_settings" USING btree ("seo_image_id");

    -- site_settings header branch phones (added under headerSettings group)
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "header_settings_nepal_branch_phone" varchar DEFAULT '+977 9851218358';
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "header_settings_uk_branch_phone" varchar DEFAULT '+44 7459 313411';

    -- regions.country (select with enum: nepal | tibet | bhutan)
    DO $$ BEGIN
      CREATE TYPE "public"."enum_regions_country" AS ENUM ('nepal', 'tibet', 'bhutan');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    ALTER TABLE "regions"
      ADD COLUMN IF NOT EXISTS "country" "enum_regions_country" DEFAULT 'nepal' NOT NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "regions" DROP COLUMN IF EXISTS "country";
    DROP TYPE IF EXISTS "public"."enum_regions_country";

    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "header_settings_nepal_branch_phone";
    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "header_settings_uk_branch_phone";

    ALTER TABLE "site_settings"
      DROP CONSTRAINT IF EXISTS "site_settings_seo_image_id_media_id_fk";
    DROP INDEX IF EXISTS "site_settings_seo_image_idx";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_image_id";
  `)
}
