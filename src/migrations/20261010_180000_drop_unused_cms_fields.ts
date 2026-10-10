import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Fields removed from the CMS config because nothing on the site reads them:
// - navbar_settings.logo   (header always renders /logo/emblem.svg)
// - homepage private-treks USP icon picker (the section uses photos now)
// - blog_settings guide cover texts (the ebook card was removed; the guide PDF stays,
//   it is still emailed to newsletter subscribers)
// Run only after the code without these fields is deployed.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "navbar_settings" DROP CONSTRAINT IF EXISTS "navbar_settings_logo_id_media_id_fk";
    DROP INDEX IF EXISTS "navbar_settings_logo_idx";
    ALTER TABLE "navbar_settings" DROP COLUMN IF EXISTS "logo_id";
    ALTER TABLE "homepage_settings_private_treks_u_s_ps" DROP COLUMN IF EXISTS "icon";
    DROP TYPE IF EXISTS "public"."enum_homepage_settings_private_treks_u_s_ps_icon";
    ALTER TABLE "blog_settings"
      DROP COLUMN IF EXISTS "guide_settings_title",
      DROP COLUMN IF EXISTS "guide_settings_subtitle",
      DROP COLUMN IF EXISTS "guide_settings_badge_text",
      DROP COLUMN IF EXISTS "guide_settings_footer_text",
      DROP COLUMN IF EXISTS "guide_settings_description";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "navbar_settings" ADD COLUMN IF NOT EXISTS "logo_id" integer;
    ALTER TABLE "navbar_settings" ADD CONSTRAINT "navbar_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "navbar_settings_logo_idx" ON "navbar_settings" USING btree ("logo_id");
    DO $$ BEGIN
      CREATE TYPE "public"."enum_homepage_settings_private_treks_u_s_ps_icon" AS ENUM('running', 'shield', 'calendar-check', 'hotel', 'user-check', 'mountain', 'compass', 'star');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    ALTER TABLE "homepage_settings_private_treks_u_s_ps" ADD COLUMN IF NOT EXISTS "icon" "enum_homepage_settings_private_treks_u_s_ps_icon" DEFAULT 'running' NOT NULL;
    ALTER TABLE "blog_settings"
      ADD COLUMN IF NOT EXISTS "guide_settings_title" varchar DEFAULT 'TRAVEL GUIDE' NOT NULL,
      ADD COLUMN IF NOT EXISTS "guide_settings_subtitle" varchar DEFAULT 'NEPAL 2026' NOT NULL,
      ADD COLUMN IF NOT EXISTS "guide_settings_badge_text" varchar DEFAULT 'SUMMIT GUIDE' NOT NULL,
      ADD COLUMN IF NOT EXISTS "guide_settings_footer_text" varchar DEFAULT 'Nature Heaven Trekking' NOT NULL,
      ADD COLUMN IF NOT EXISTS "guide_settings_description" varchar DEFAULT '' NOT NULL;
  `)
}
