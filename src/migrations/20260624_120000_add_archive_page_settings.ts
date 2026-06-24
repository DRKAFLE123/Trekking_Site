import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Two new singleton-style collections that drive the editable chrome of
// the /regions and /countries archive listing pages:
//   - regions_page_settings   (main row only, no sub-arrays)
//   - countries_page_settings (main row + countries_page_settings_countries
//                              sub-array for the 3 country cards)
//
// Both tables have nullable defaults so the page-level fallbacks in code
// keep working even when the singleton document is empty.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ============================================================
    -- regions_page_settings
    -- ============================================================
    CREATE TABLE IF NOT EXISTS "regions_page_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "internal_label" varchar DEFAULT 'Regions Page Settings',
      "hero_kicker" varchar DEFAULT 'Explore by Region',
      "meta_title" varchar,
      "hero_title" varchar DEFAULT 'Trekking Regions of the Himalayas',
      "hero_description" varchar,
      "hero_background_image_id" integer,
      "meta_description" varchar,
      "cta_kicker" varchar DEFAULT 'Not sure where to go?',
      "cta_button_label" varchar DEFAULT 'Plan my trip',
      "cta_title" varchar,
      "cta_description" varchar,
      "cta_button_href" varchar DEFAULT '/plan-a-trip',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "regions_page_settings"
        ADD CONSTRAINT "regions_page_settings_hero_bg_media_id_fk"
        FOREIGN KEY ("hero_background_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "regions_page_settings_hero_bg_idx"
      ON "regions_page_settings" USING btree ("hero_background_image_id");
    CREATE INDEX IF NOT EXISTS "regions_page_settings_updated_at_idx"
      ON "regions_page_settings" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "regions_page_settings_created_at_idx"
      ON "regions_page_settings" USING btree ("created_at");

    -- ============================================================
    -- countries_page_settings  (main)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS "countries_page_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "internal_label" varchar DEFAULT 'Countries Page Settings',
      "hero_kicker" varchar DEFAULT 'Browse by Country',
      "meta_title" varchar,
      "hero_title" varchar DEFAULT 'Choose Your Himalayan Destination',
      "hero_description" varchar,
      "hero_background_image_id" integer,
      "meta_description" varchar,
      "cta_kicker" varchar DEFAULT 'Cross-border itinerary?',
      "cta_button_label" varchar DEFAULT 'Plan my trip',
      "cta_title" varchar,
      "cta_description" varchar,
      "cta_button_href" varchar DEFAULT '/plan-a-trip',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "countries_page_settings"
        ADD CONSTRAINT "countries_page_settings_hero_bg_media_id_fk"
        FOREIGN KEY ("hero_background_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "countries_page_settings_hero_bg_idx"
      ON "countries_page_settings" USING btree ("hero_background_image_id");
    CREATE INDEX IF NOT EXISTS "countries_page_settings_updated_at_idx"
      ON "countries_page_settings" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "countries_page_settings_created_at_idx"
      ON "countries_page_settings" USING btree ("created_at");

    -- ============================================================
    -- countries_page_settings_countries  (3-card array)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS "countries_page_settings_countries" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "tagline" varchar,
      "description" varchar,
      "image_id" integer,
      "hide" boolean DEFAULT false
    );

    DO $$ BEGIN
      ALTER TABLE "countries_page_settings_countries"
        ADD CONSTRAINT "countries_page_settings_countries_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."countries_page_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "countries_page_settings_countries"
        ADD CONSTRAINT "countries_page_settings_countries_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "countries_page_settings_countries_order_idx"
      ON "countries_page_settings_countries" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "countries_page_settings_countries_parent_id_idx"
      ON "countries_page_settings_countries" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "countries_page_settings_countries_image_idx"
      ON "countries_page_settings_countries" USING btree ("image_id");

    -- ============================================================
    -- Plumb both into Payload's global locked-documents rels system
    -- ============================================================
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "regions_page_settings_id" integer;
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "countries_page_settings_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_regions_page_settings_fk"
        FOREIGN KEY ("regions_page_settings_id") REFERENCES "public"."regions_page_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_countries_page_settings_fk"
        FOREIGN KEY ("countries_page_settings_id") REFERENCES "public"."countries_page_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_regions_page_settings_id_idx"
      ON "payload_locked_documents_rels" USING btree ("regions_page_settings_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_countries_page_settings_id_idx"
      ON "payload_locked_documents_rels" USING btree ("countries_page_settings_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_regions_page_settings_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_countries_page_settings_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "regions_page_settings_id";
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "countries_page_settings_id";

    DROP TABLE IF EXISTS "countries_page_settings_countries" CASCADE;
    DROP TABLE IF EXISTS "countries_page_settings" CASCADE;
    DROP TABLE IF EXISTS "regions_page_settings" CASCADE;
  `)
}
