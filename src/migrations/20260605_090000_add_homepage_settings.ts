import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Icon enums for the two array fields
    CREATE TYPE "public"."enum_homepage_settings_why_travel_features_icon" AS ENUM (
      'award', 'calendar', 'users', 'shield', 'leaf', 'smile',
      'mountain', 'compass', 'check'
    );
    CREATE TYPE "public"."enum_homepage_settings_private_treks_us_ps_icon" AS ENUM (
      'running', 'shield', 'calendar-check', 'hotel', 'user-check',
      'mountain', 'compass', 'star'
    );

    -- Main singleton table
    CREATE TABLE "homepage_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "internal_label" varchar DEFAULT 'Homepage Settings',
      "why_travel_kicker" varchar DEFAULT 'The Nature Heaven Standard',
      "why_travel_title" varchar DEFAULT 'Why Travel With Us?',
      "why_travel_description" varchar,
      "why_travel_image_id" integer,
      "why_travel_badge_icon" varchar DEFAULT '🏆',
      "why_travel_badge_title" varchar DEFAULT '100% Native Sherpa Crew',
      "why_travel_badge_description" varchar,
      "private_treks_kicker" varchar DEFAULT '100% Customized Trips',
      "private_treks_title" varchar DEFAULT 'Exclusive Private Treks',
      "private_treks_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- "Why Travel With Us" feature cards (array)
    CREATE TABLE "homepage_settings_why_travel_features" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon" "enum_homepage_settings_why_travel_features_icon" DEFAULT 'award' NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar NOT NULL
    );

    -- "Exclusive Private Treks" USP cards (array)
    CREATE TABLE "homepage_settings_private_treks_us_ps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon" "enum_homepage_settings_private_treks_us_ps_icon" DEFAULT 'running' NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar NOT NULL
    );

    -- Foreign keys
    ALTER TABLE "homepage_settings" ADD CONSTRAINT "homepage_settings_why_travel_image_id_media_id_fk"
      FOREIGN KEY ("why_travel_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "homepage_settings_why_travel_features" ADD CONSTRAINT "homepage_settings_why_travel_features_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "homepage_settings_private_treks_us_ps" ADD CONSTRAINT "homepage_settings_private_treks_us_ps_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;

    -- Indexes
    CREATE INDEX "homepage_settings_why_travel_image_idx" ON "homepage_settings" USING btree ("why_travel_image_id");
    CREATE INDEX "homepage_settings_updated_at_idx" ON "homepage_settings" USING btree ("updated_at");
    CREATE INDEX "homepage_settings_created_at_idx" ON "homepage_settings" USING btree ("created_at");
    CREATE INDEX "homepage_settings_why_travel_features_order_idx" ON "homepage_settings_why_travel_features" USING btree ("_order");
    CREATE INDEX "homepage_settings_why_travel_features_parent_id_idx" ON "homepage_settings_why_travel_features" USING btree ("_parent_id");
    CREATE INDEX "homepage_settings_private_treks_us_ps_order_idx" ON "homepage_settings_private_treks_us_ps" USING btree ("_order");
    CREATE INDEX "homepage_settings_private_treks_us_ps_parent_id_idx" ON "homepage_settings_private_treks_us_ps" USING btree ("_parent_id");

    -- Plumb into Payload's global locked-documents rels system
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "homepage_settings_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_homepage_settings_fk"
      FOREIGN KEY ("homepage_settings_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_homepage_settings_id_idx"
      ON "payload_locked_documents_rels" USING btree ("homepage_settings_id");

    -- Site Settings: add URL field to review platforms array
    ALTER TABLE "site_settings_review_platforms" ADD COLUMN IF NOT EXISTS "url" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings_review_platforms" DROP COLUMN IF EXISTS "url";

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_homepage_settings_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "homepage_settings_id";

    DROP TABLE IF EXISTS "homepage_settings_why_travel_features" CASCADE;
    DROP TABLE IF EXISTS "homepage_settings_private_treks_us_ps" CASCADE;
    DROP TABLE IF EXISTS "homepage_settings" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_homepage_settings_why_travel_features_icon";
    DROP TYPE IF EXISTS "public"."enum_homepage_settings_private_treks_us_ps_icon";
  `)
}
