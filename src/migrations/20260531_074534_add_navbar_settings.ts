import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_navbar_settings_navigation_menu_type" AS ENUM('dropdown', 'single-link');
    CREATE TYPE "public"."enum_navbar_settings_navigation_menu_dropdown_style" AS ENUM('regions-grid', 'travel-info', 'treks-list', 'custom-links');

    CREATE TABLE "navbar_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "site_name" varchar DEFAULT 'Nature Heaven' NOT NULL,
      "logo_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "navbar_settings_navigation_menu" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "type" "enum_navbar_settings_navigation_menu_type" DEFAULT 'dropdown' NOT NULL,
      "href" varchar,
      "dropdown_style" "enum_navbar_settings_navigation_menu_dropdown_style" DEFAULT 'custom-links',
      "hide" boolean DEFAULT false
    );

    CREATE TABLE "navbar_settings_navigation_menu_custom_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "hide" boolean DEFAULT false
    );

    CREATE TABLE "navbar_settings_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "treks_id" integer
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "navbar_settings_id" integer;

    ALTER TABLE "navbar_settings_navigation_menu" ADD CONSTRAINT "navbar_settings_navigation_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "navbar_settings_navigation_menu_custom_links" ADD CONSTRAINT "navbar_settings_navigation_menu_custom_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar_settings_navigation_menu"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "navbar_settings" ADD CONSTRAINT "navbar_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "navbar_settings_rels" ADD CONSTRAINT "navbar_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navbar_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "navbar_settings_rels" ADD CONSTRAINT "navbar_settings_rels_treks_fk" FOREIGN KEY ("treks_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_navbar_settings_fk" FOREIGN KEY ("navbar_settings_id") REFERENCES "public"."navbar_settings"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "navbar_settings_logo_idx" ON "navbar_settings" USING btree ("logo_id");
    CREATE INDEX "navbar_settings_updated_at_idx" ON "navbar_settings" USING btree ("updated_at");
    CREATE INDEX "navbar_settings_created_at_idx" ON "navbar_settings" USING btree ("created_at");
    CREATE INDEX "navbar_settings_navigation_menu_order_idx" ON "navbar_settings_navigation_menu" USING btree ("_order");
    CREATE INDEX "navbar_settings_navigation_menu_parent_id_idx" ON "navbar_settings_navigation_menu" USING btree ("_parent_id");
    CREATE INDEX "navbar_settings_navigation_menu_custom_links_order_idx" ON "navbar_settings_navigation_menu_custom_links" USING btree ("_order");
    CREATE INDEX "navbar_settings_navigation_menu_custom_links_parent_id_idx" ON "navbar_settings_navigation_menu_custom_links" USING btree ("_parent_id");
    CREATE INDEX "navbar_settings_rels_order_idx" ON "navbar_settings_rels" USING btree ("order");
    CREATE INDEX "navbar_settings_rels_parent_idx" ON "navbar_settings_rels" USING btree ("parent_id");
    CREATE INDEX "navbar_settings_rels_path_idx" ON "navbar_settings_rels" USING btree ("path");
    CREATE INDEX "navbar_settings_rels_treks_id_idx" ON "navbar_settings_rels" USING btree ("treks_id");
    CREATE INDEX "payload_locked_documents_rels_navbar_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("navbar_settings_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "navbar_settings" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "navbar_settings_navigation_menu" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "navbar_settings_navigation_menu_custom_links" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "navbar_settings_rels" DISABLE ROW LEVEL SECURITY;

    DROP TABLE "navbar_settings" CASCADE;
    DROP TABLE "navbar_settings_navigation_menu" CASCADE;
    DROP TABLE "navbar_settings_navigation_menu_custom_links" CASCADE;
    DROP TABLE "navbar_settings_rels" CASCADE;

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_navbar_settings_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "navbar_settings_id";

    DROP TYPE "public"."enum_navbar_settings_navigation_menu_type";
    DROP TYPE "public"."enum_navbar_settings_navigation_menu_dropdown_style";
  `)
}

