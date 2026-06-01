import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_company_pages_csr_commitments_icon" AS ENUM('education', 'welfare', 'eco', 'economy', 'community', 'safety');
  CREATE TABLE "company_pages_csr_commitments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_company_pages_csr_commitments_icon",
  	"description" varchar NOT NULL
  );
  
  ALTER TABLE "company_pages" ADD COLUMN "csr_quote_text" varchar;
  ALTER TABLE "company_pages" ADD COLUMN "csr_quote_author" varchar;
  ALTER TABLE "company_pages" ADD COLUMN "csr_quote_image_id" integer;
  ALTER TABLE "company_pages_csr_commitments" ADD CONSTRAINT "company_pages_csr_commitments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "company_pages_csr_commitments_order_idx" ON "company_pages_csr_commitments" USING btree ("_order");
  CREATE INDEX "company_pages_csr_commitments_parent_id_idx" ON "company_pages_csr_commitments" USING btree ("_parent_id");
  ALTER TABLE "company_pages" ADD CONSTRAINT "company_pages_csr_quote_image_id_media_id_fk" FOREIGN KEY ("csr_quote_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "company_pages_csr_quote_csr_quote_image_idx" ON "company_pages" USING btree ("csr_quote_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_pages_csr_commitments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "company_pages_csr_commitments" CASCADE;
  ALTER TABLE "company_pages" DROP CONSTRAINT "company_pages_csr_quote_image_id_media_id_fk";
  
  DROP INDEX "company_pages_csr_quote_csr_quote_image_idx";
  ALTER TABLE "company_pages" DROP COLUMN "csr_quote_text";
  ALTER TABLE "company_pages" DROP COLUMN "csr_quote_author";
  ALTER TABLE "company_pages" DROP COLUMN "csr_quote_image_id";
  DROP TYPE "public"."enum_company_pages_csr_commitments_icon";`)
}
