// Applies migration 20261028_120000_page_seo to the live database and records it (batch 19).
// The Payload CLI (`npx payload migrate`) fails on Node 24 in this project, so migrations are applied directly.
// Safe to run twice: it only creates what is missing and never deletes data.
//   node --env-file=.env scripts/apply-page-seo-migration.mjs
import pg from "pg";

const NAME = "20261028_120000_page_seo";
const c = new pg.Client({ connectionString: process.env.DATABASE_URI, ssl: { rejectUnauthorized: false } });
await c.connect();
try {
  await c.query("BEGIN");
  await c.query(`
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
  `);
  const done = await c.query(`SELECT 1 FROM payload_migrations WHERE name = $1`, [NAME]);
  if (!done.rowCount) await c.query(`INSERT INTO payload_migrations (name, batch) VALUES ($1, 19)`, [NAME]);
  await c.query("COMMIT");
  const t = (await c.query("select to_regclass('public.site_settings_page_seo') t")).rows[0].t;
  const cols = (await c.query("select column_name from information_schema.columns where table_name='regions' and column_name like 'meta%'")).rows.map((r) => r.column_name);
  console.log(`✅ Done. Table: ${t}. Region columns: ${cols.join(", ")}. Recorded as ${NAME}.`);
} catch (e) {
  await c.query("ROLLBACK");
  console.error("❌ Failed, nothing was changed:", e.message);
  process.exitCode = 1;
} finally {
  await c.end();
}
