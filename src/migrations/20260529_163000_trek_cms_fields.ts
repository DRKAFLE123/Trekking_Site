import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "treks" ADD COLUMN IF NOT EXISTS "flight_info" text;
    ALTER TABLE "treks" ADD COLUMN IF NOT EXISTS "briefing_info" text;
    ALTER TABLE "treks" ADD COLUMN IF NOT EXISTS "packing_list" jsonb;
    ALTER TABLE "treks" ADD COLUMN IF NOT EXISTS "trip_info_sections" jsonb;
    ALTER TABLE "treks" ADD COLUMN IF NOT EXISTS "best_season" varchar(255);
    ALTER TABLE "treks" ADD COLUMN IF NOT EXISTS "accommodation_type" varchar(255);
    ALTER TABLE "treks" ADD COLUMN IF NOT EXISTS "meals_included" varchar(255);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "treks" DROP COLUMN IF EXISTS "flight_info";
    ALTER TABLE "treks" DROP COLUMN IF EXISTS "briefing_info";
    ALTER TABLE "treks" DROP COLUMN IF EXISTS "packing_list";
    ALTER TABLE "treks" DROP COLUMN IF EXISTS "trip_info_sections";
    ALTER TABLE "treks" DROP COLUMN IF EXISTS "best_season";
    ALTER TABLE "treks" DROP COLUMN IF EXISTS "accommodation_type";
    ALTER TABLE "treks" DROP COLUMN IF EXISTS "meals_included";
  `)
}
