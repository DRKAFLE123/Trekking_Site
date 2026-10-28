import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// SEO titles/descriptions move into the CMS: a "Page SEO" list on siteSettings for pages
// without their own document, and SEO fields on regions.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_page_seo" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "path" varchar NOT NULL,
      "meta_title" varchar,
      "meta_description" varchar,
      CONSTRAINT "site_settings_page_seo_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action
    );
    CREATE INDEX IF NOT EXISTS "site_settings_page_seo_order_idx" ON "site_settings_page_seo" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_page_seo_parent_id_idx" ON "site_settings_page_seo" USING btree ("_parent_id");
    ALTER TABLE "regions"
      ADD COLUMN IF NOT EXISTS "meta_title" varchar,
      ADD COLUMN IF NOT EXISTS "meta_description" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings_page_seo";
    ALTER TABLE "regions" DROP COLUMN IF EXISTS "meta_title", DROP COLUMN IF EXISTS "meta_description";
  `)
}
