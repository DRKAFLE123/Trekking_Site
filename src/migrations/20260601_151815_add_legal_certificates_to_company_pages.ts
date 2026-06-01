import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "company_pages_legal_certificates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  ALTER TABLE "company_pages_legal_certificates" ADD CONSTRAINT "company_pages_legal_certificates_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "company_pages_legal_certificates" ADD CONSTRAINT "company_pages_legal_certificates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "company_pages_legal_certificates_order_idx" ON "company_pages_legal_certificates" USING btree ("_order");
  CREATE INDEX "company_pages_legal_certificates_parent_id_idx" ON "company_pages_legal_certificates" USING btree ("_parent_id");
  CREATE INDEX "company_pages_legal_certificates_image_idx" ON "company_pages_legal_certificates" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "company_pages_legal_certificates" CASCADE;`)
}
