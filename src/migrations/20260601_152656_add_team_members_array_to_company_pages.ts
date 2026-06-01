import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "company_pages_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer,
  	"bio" varchar,
  	"social_links_facebook" varchar,
  	"social_links_instagram" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_twitter" varchar
  );
  
  ALTER TABLE "company_pages_team_members" ADD CONSTRAINT "company_pages_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "company_pages_team_members" ADD CONSTRAINT "company_pages_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "company_pages_team_members_order_idx" ON "company_pages_team_members" USING btree ("_order");
  CREATE INDEX "company_pages_team_members_parent_id_idx" ON "company_pages_team_members" USING btree ("_parent_id");
  CREATE INDEX "company_pages_team_members_photo_idx" ON "company_pages_team_members" USING btree ("photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "company_pages_team_members" CASCADE;`)
}
