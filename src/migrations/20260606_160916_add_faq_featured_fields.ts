import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "treks_faqs" ADD COLUMN "is_featured" boolean DEFAULT false;
  ALTER TABLE "faqs" ADD COLUMN "is_featured" boolean DEFAULT false;
  ALTER TABLE "faqs" ADD COLUMN "show_on_all_treks" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "treks_faqs" DROP COLUMN "is_featured";
  ALTER TABLE "faqs" DROP COLUMN "is_featured";
  ALTER TABLE "faqs" DROP COLUMN "show_on_all_treks";`)
}
