import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_treks_inclusions_icon" AS ENUM('transport', 'accommodation', 'food', 'guide', 'permits', 'insurance', 'visa', 'equipment', 'personal', 'info');
  CREATE TYPE "public"."enum_treks_exclusions_icon" AS ENUM('transport', 'accommodation', 'food', 'guide', 'permits', 'insurance', 'visa', 'equipment', 'personal', 'info');
  CREATE TABLE "treks_inclusions_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar NOT NULL
  );
  
  CREATE TABLE "treks_exclusions_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar NOT NULL
  );
  
  ALTER TABLE "treks_inclusions" ADD COLUMN "heading" varchar DEFAULT 'General' NOT NULL;
  ALTER TABLE "treks_inclusions" ADD COLUMN "icon" "enum_treks_inclusions_icon" DEFAULT 'info';
  ALTER TABLE "treks_exclusions" ADD COLUMN "heading" varchar DEFAULT 'General' NOT NULL;
  ALTER TABLE "treks_exclusions" ADD COLUMN "icon" "enum_treks_exclusions_icon" DEFAULT 'personal';
  ALTER TABLE "treks_inclusions_points" ADD CONSTRAINT "treks_inclusions_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treks_inclusions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treks_exclusions_points" ADD CONSTRAINT "treks_exclusions_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treks_exclusions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "treks_inclusions_points_order_idx" ON "treks_inclusions_points" USING btree ("_order");
  CREATE INDEX "treks_inclusions_points_parent_id_idx" ON "treks_inclusions_points" USING btree ("_parent_id");
  CREATE INDEX "treks_exclusions_points_order_idx" ON "treks_exclusions_points" USING btree ("_order");
  CREATE INDEX "treks_exclusions_points_parent_id_idx" ON "treks_exclusions_points" USING btree ("_parent_id");
  ALTER TABLE "treks_inclusions" DROP COLUMN "inclusion";
  ALTER TABLE "treks_exclusions" DROP COLUMN "exclusion";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "treks_inclusions_points" CASCADE;
  DROP TABLE "treks_exclusions_points" CASCADE;
  ALTER TABLE "treks_inclusions" ADD COLUMN "inclusion" varchar NOT NULL;
  ALTER TABLE "treks_exclusions" ADD COLUMN "exclusion" varchar NOT NULL;
  ALTER TABLE "treks_inclusions" DROP COLUMN "heading";
  ALTER TABLE "treks_inclusions" DROP COLUMN "icon";
  ALTER TABLE "treks_exclusions" DROP COLUMN "heading";
  ALTER TABLE "treks_exclusions" DROP COLUMN "icon";
  DROP TYPE "public"."enum_treks_inclusions_icon";
  DROP TYPE "public"."enum_treks_exclusions_icon";`)
}
