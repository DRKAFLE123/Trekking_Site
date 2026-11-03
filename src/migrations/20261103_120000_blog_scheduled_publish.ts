import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// "Publish on" date for blog posts, on the live table and on the versions table that holds drafts.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "scheduled_publish_at" timestamp(3) with time zone;
    ALTER TABLE "_blog_posts_v" ADD COLUMN IF NOT EXISTS "version_scheduled_publish_at" timestamp(3) with time zone;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "scheduled_publish_at";
    ALTER TABLE "_blog_posts_v" DROP COLUMN IF EXISTS "version_scheduled_publish_at";
  `)
}
