import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the trackingSettings group to siteSettings:
//   - tracking_settings_head_scripts: raw HTML tags (Google Ads / Analytics /
//     Meta Pixel etc.) injected on every page, managed from the admin panel so
//     new tags never require a deploy.
//   - tracking_settings_google_ads_conversion_send_to: the send_to value for
//     the Google Ads conversion event fired on booking success.
//
// Both nullable — empty means "no tracking configured".

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "tracking_settings_head_scripts" varchar,
      ADD COLUMN IF NOT EXISTS "tracking_settings_google_ads_conversion_send_to" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "tracking_settings_head_scripts",
      DROP COLUMN IF EXISTS "tracking_settings_google_ads_conversion_send_to";
  `)
}
