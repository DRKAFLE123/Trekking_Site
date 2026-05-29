import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "treks" ADD COLUMN "trip_info_content" jsonb;
  ALTER TABLE "treks" ADD COLUMN "map_image_id" integer;
  ALTER TABLE "treks" ADD CONSTRAINT "treks_map_image_id_media_id_fk" FOREIGN KEY ("map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "treks_map_image_idx" ON "treks" USING btree ("map_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "treks" DROP CONSTRAINT "treks_map_image_id_media_id_fk";
  DROP INDEX "treks_map_image_idx";
  ALTER TABLE "treks" DROP COLUMN "trip_info_content";
  ALTER TABLE "treks" DROP COLUMN "map_image_id";`)
}
