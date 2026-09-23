import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Header rebuild:
//   - navbar_settings_representatives: one row per country office /
//     representative shown in the header's phone dropdown (replaces the two
//     hard-coded branch phones in siteSettings.headerSettings).
//   - navbar_settings.promo_bar_*: the announcement strip becomes CMS-toggled
//     and is off by default.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "navbar_settings_representatives" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "country" varchar,
      "country_code" varchar,
      "name" varchar,
      "whats_app" varchar,
      "hours" varchar,
      "is_default" boolean DEFAULT false
    );
    CREATE INDEX IF NOT EXISTS "navbar_settings_representatives_order_idx"
      ON "navbar_settings_representatives" ("_order");
    CREATE INDEX IF NOT EXISTS "navbar_settings_representatives_parent_id_idx"
      ON "navbar_settings_representatives" ("_parent_id");
    DO $$ BEGIN
      ALTER TABLE "navbar_settings_representatives"
        ADD CONSTRAINT "navbar_settings_representatives_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "navbar_settings"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    ALTER TABLE "navbar_settings"
      ADD COLUMN IF NOT EXISTS "promo_bar_enabled" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "promo_bar_text" varchar,
      ADD COLUMN IF NOT EXISTS "promo_bar_link_label" varchar,
      ADD COLUMN IF NOT EXISTS "promo_bar_link_href" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "navbar_settings_representatives";
    ALTER TABLE "navbar_settings"
      DROP COLUMN IF EXISTS "promo_bar_enabled",
      DROP COLUMN IF EXISTS "promo_bar_text",
      DROP COLUMN IF EXISTS "promo_bar_link_label",
      DROP COLUMN IF EXISTS "promo_bar_link_href";
  `)
}
