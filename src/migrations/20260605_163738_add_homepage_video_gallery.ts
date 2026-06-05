import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Add new featured video columns to homepage_settings
    ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "featured_video_kicker" varchar DEFAULT 'Watch the Journey';
    ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "featured_video_title" varchar DEFAULT 'Himalayan Trek Experience';
    ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "featured_video_description" varchar DEFAULT 'Watch real journeys through Nepal''s most iconic mountain trails.';

    -- 2. Create the video gallery table
    CREATE TABLE IF NOT EXISTS "homepage_settings_video_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "youtube_id" varchar NOT NULL,
      "title" varchar NOT NULL,
      "trek_id" integer,
      "trek_name" varchar NOT NULL,
      "description" varchar
    );

    -- 3. Add foreign keys & indexes
    ALTER TABLE "homepage_settings_video_gallery" DROP CONSTRAINT IF EXISTS "homepage_settings_video_gallery_trek_id_treks_id_fk";
    ALTER TABLE "homepage_settings_video_gallery" ADD CONSTRAINT "homepage_settings_video_gallery_trek_id_treks_id_fk" FOREIGN KEY ("trek_id") REFERENCES "public"."treks"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "homepage_settings_video_gallery" DROP CONSTRAINT IF EXISTS "homepage_settings_video_gallery_parent_id_fk";
    ALTER TABLE "homepage_settings_video_gallery" ADD CONSTRAINT "homepage_settings_video_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "homepage_settings_video_gallery_order_idx" ON "homepage_settings_video_gallery" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "homepage_settings_video_gallery_parent_id_idx" ON "homepage_settings_video_gallery" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "homepage_settings_video_gallery_trek_idx" ON "homepage_settings_video_gallery" USING btree ("trek_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "homepage_settings_video_gallery" CASCADE;
    ALTER TABLE "homepage_settings" DROP COLUMN IF EXISTS "featured_video_kicker";
    ALTER TABLE "homepage_settings" DROP COLUMN IF EXISTS "featured_video_title";
    ALTER TABLE "homepage_settings" DROP COLUMN IF EXISTS "featured_video_description";
  `)
}
