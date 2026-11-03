// Applies migration 20261103_120000_blog_scheduled_publish directly and records it (batch 20).
// Hostinger deploys don't run migrations and the Payload CLI fails on Node 24 here.
// Safe to run twice: it only adds empty columns and deletes nothing.
//   node --env-file=.env scripts/apply-blog-schedule-migration.mjs
import pg from "pg";

const NAME = "20261103_120000_blog_scheduled_publish";
const c = new pg.Client({ connectionString: process.env.DATABASE_URI, ssl: { rejectUnauthorized: false } });
await c.connect();
try {
  const like = await c.query("select column_name from information_schema.columns where table_name='_blog_posts_v' and column_name like 'version_published%'");
  if (!like.rowCount) throw new Error("_blog_posts_v does not follow the version_ column naming");
  await c.query("BEGIN");
  await c.query(`ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "scheduled_publish_at" timestamp(3) with time zone`);
  await c.query(`ALTER TABLE "_blog_posts_v" ADD COLUMN IF NOT EXISTS "version_scheduled_publish_at" timestamp(3) with time zone`);
  const done = await c.query("SELECT 1 FROM payload_migrations WHERE name = $1", [NAME]);
  if (!done.rowCount) await c.query("INSERT INTO payload_migrations (name, batch) VALUES ($1, 20)", [NAME]);
  await c.query("COMMIT");
  const cols = await c.query("select table_name, column_name from information_schema.columns where column_name in ('scheduled_publish_at','version_scheduled_publish_at')");
  console.log("Done:", cols.rows.map((r) => `${r.table_name}.${r.column_name}`).join(", "));
} catch (e) {
  await c.query("ROLLBACK").catch(() => {});
  console.error("Failed, nothing changed:", e.message);
  process.exitCode = 1;
} finally {
  await c.end();
}
