import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blog_settings" ADD COLUMN "guide_settings_title" varchar DEFAULT 'TRAVEL GUIDE' NOT NULL;
  ALTER TABLE "blog_settings" ADD COLUMN "guide_settings_subtitle" varchar DEFAULT 'NEPAL 2026' NOT NULL;
  ALTER TABLE "blog_settings" ADD COLUMN "guide_settings_badge_text" varchar DEFAULT 'SUMMIT GUIDE' NOT NULL;
  ALTER TABLE "blog_settings" ADD COLUMN "guide_settings_footer_text" varchar DEFAULT 'Nature Heaven Trekking' NOT NULL;
  ALTER TABLE "blog_settings" ADD COLUMN "guide_settings_description" varchar DEFAULT 'Get our free travel guide packed with insider tips, hidden geographical gems, and essential equipment checklists. Save time, travel smarter, and make the most of your adventure.' NOT NULL;
  ALTER TABLE "blog_settings" ADD COLUMN "guide_settings_pdf_file_id" integer;
  ALTER TABLE "blog_settings" ADD CONSTRAINT "blog_settings_guide_settings_pdf_file_id_media_id_fk" FOREIGN KEY ("guide_settings_pdf_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "blog_settings_guide_settings_guide_settings_pdf_file_idx" ON "blog_settings" USING btree ("guide_settings_pdf_file_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blog_settings" DROP CONSTRAINT "blog_settings_guide_settings_pdf_file_id_media_id_fk";
  
  DROP INDEX "blog_settings_guide_settings_guide_settings_pdf_file_idx";
  ALTER TABLE "blog_settings" DROP COLUMN "guide_settings_title";
  ALTER TABLE "blog_settings" DROP COLUMN "guide_settings_subtitle";
  ALTER TABLE "blog_settings" DROP COLUMN "guide_settings_badge_text";
  ALTER TABLE "blog_settings" DROP COLUMN "guide_settings_footer_text";
  ALTER TABLE "blog_settings" DROP COLUMN "guide_settings_description";
  ALTER TABLE "blog_settings" DROP COLUMN "guide_settings_pdf_file_id";`)
}
