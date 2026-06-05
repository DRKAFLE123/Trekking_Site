import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "header_settings_expert_id" integer;
  ALTER TABLE "team_members" ADD COLUMN "phone" varchar;
  ALTER TABLE "team_members" ADD COLUMN "whats_app" varchar;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_header_settings_expert_id_team_members_id_fk" FOREIGN KEY ("header_settings_expert_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_header_settings_header_settings_expert_idx" ON "site_settings" USING btree ("header_settings_expert_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_header_settings_expert_id_team_members_id_fk";
  
  DROP INDEX "site_settings_header_settings_header_settings_expert_idx";
  ALTER TABLE "site_settings" DROP COLUMN "header_settings_expert_id";
  ALTER TABLE "team_members" DROP COLUMN "phone";
  ALTER TABLE "team_members" DROP COLUMN "whats_app";`)
}
