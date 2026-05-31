import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Execute the entire migration in one clean transaction since Postgres aborted transactions on duplicate errors
  await db.execute(sql`
    ALTER TYPE "public"."enum_navbar_settings_navigation_menu_dropdown_style" ADD VALUE 'contact-pages' BEFORE 'treks-list';
    ALTER TYPE "public"."enum_navbar_settings_navigation_menu_dropdown_style" ADD VALUE 'company-pages' BEFORE 'treks-list';
    
    CREATE TABLE "contact_pages_videos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "youtube_url" varchar NOT NULL
    );
    
    CREATE TABLE "contact_pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "excerpt" varchar,
      "content" jsonb NOT NULL,
      "hero_image_id" integer,
      "seo_title" varchar,
      "seo_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    
    CREATE TABLE "contact_pages_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "treks_id" integer,
      "media_id" integer
    );
    
    CREATE TABLE "blog_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "cover_image_id" integer NOT NULL,
      "title" varchar DEFAULT 'Summit Chronicles' NOT NULL,
      "subtitle" varchar DEFAULT 'Nature Heaven Trekking & Expedition' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    
    CREATE TABLE "company_pages_videos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "youtube_url" varchar NOT NULL
    );
    
    CREATE TABLE "company_pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "excerpt" varchar,
      "content" jsonb NOT NULL,
      "hero_image_id" integer,
      "seo_title" varchar,
      "seo_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    
    CREATE TABLE "company_pages_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "treks_id" integer,
      "media_id" integer
    );
    
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_pages_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_settings_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "company_pages_id" integer;
    
    ALTER TABLE "contact_pages_videos" ADD CONSTRAINT "contact_pages_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "contact_pages" ADD CONSTRAINT "contact_pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "contact_pages_rels" ADD CONSTRAINT "contact_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "contact_pages_rels" ADD CONSTRAINT "contact_pages_rels_treks_fk" FOREIGN KEY ("treks_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "contact_pages_rels" ADD CONSTRAINT "contact_pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "blog_settings" ADD CONSTRAINT "blog_settings_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "company_pages_videos" ADD CONSTRAINT "company_pages_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "company_pages" ADD CONSTRAINT "company_pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "company_pages_rels" ADD CONSTRAINT "company_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."company_pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "company_pages_rels" ADD CONSTRAINT "company_pages_rels_treks_fk" FOREIGN KEY ("treks_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "company_pages_rels" ADD CONSTRAINT "company_pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    
    CREATE INDEX "contact_pages_videos_order_idx" ON "contact_pages_videos" USING btree ("_order");
    CREATE INDEX "contact_pages_videos_parent_id_idx" ON "contact_pages_videos" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "contact_pages_slug_idx" ON "contact_pages" USING btree ("slug");
    CREATE INDEX "contact_pages_hero_image_idx" ON "contact_pages" USING btree ("hero_image_id");
    CREATE INDEX "contact_pages_updated_at_idx" ON "contact_pages" USING btree ("updated_at");
    CREATE INDEX "contact_pages_created_at_idx" ON "contact_pages" USING btree ("created_at");
    CREATE INDEX "contact_pages_rels_order_idx" ON "contact_pages_rels" USING btree ("order");
    CREATE INDEX "contact_pages_rels_parent_idx" ON "contact_pages_rels" USING btree ("parent_id");
    CREATE INDEX "contact_pages_rels_path_idx" ON "contact_pages_rels" USING btree ("path");
    CREATE INDEX "contact_pages_rels_treks_id_idx" ON "contact_pages_rels" USING btree ("treks_id");
    CREATE INDEX "contact_pages_rels_media_id_idx" ON "contact_pages_rels" USING btree ("media_id");
    
    CREATE INDEX "blog_settings_cover_image_idx" ON "blog_settings" USING btree ("cover_image_id");
    CREATE INDEX "blog_settings_updated_at_idx" ON "blog_settings" USING btree ("updated_at");
    CREATE INDEX "blog_settings_created_at_idx" ON "blog_settings" USING btree ("created_at");
    
    CREATE INDEX "company_pages_videos_order_idx" ON "company_pages_videos" USING btree ("_order");
    CREATE INDEX "company_pages_videos_parent_id_idx" ON "company_pages_videos" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "company_pages_slug_idx" ON "company_pages" USING btree ("slug");
    CREATE INDEX "company_pages_hero_image_idx" ON "company_pages" USING btree ("hero_image_id");
    CREATE INDEX "company_pages_updated_at_idx" ON "company_pages" USING btree ("updated_at");
    CREATE INDEX "company_pages_created_at_idx" ON "company_pages" USING btree ("created_at");
    CREATE INDEX "company_pages_rels_order_idx" ON "company_pages_rels" USING btree ("order");
    CREATE INDEX "company_pages_rels_parent_idx" ON "company_pages_rels" USING btree ("parent_id");
    CREATE INDEX "company_pages_rels_path_idx" ON "company_pages_rels" USING btree ("path");
    CREATE INDEX "company_pages_rels_treks_id_idx" ON "company_pages_rels" USING btree ("treks_id");
    CREATE INDEX "company_pages_rels_media_id_idx" ON "company_pages_rels" USING btree ("media_id");
    
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_pages_fk" FOREIGN KEY ("contact_pages_id") REFERENCES "public"."contact_pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_settings_fk" FOREIGN KEY ("blog_settings_id") REFERENCES "public"."blog_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_company_pages_fk" FOREIGN KEY ("company_pages_id") REFERENCES "public"."company_pages"("id") ON DELETE cascade ON UPDATE no action;
    
    CREATE INDEX "payload_locked_documents_rels_contact_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_pages_id");
    CREATE INDEX "payload_locked_documents_rels_blog_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_settings_id");
    CREATE INDEX "payload_locked_documents_rels_company_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("company_pages_id");
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contact_pages_videos" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "contact_pages" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "contact_pages_rels" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "blog_settings" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "company_pages_videos" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "company_pages" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "company_pages_rels" DISABLE ROW LEVEL SECURITY;
    
    DROP TABLE "contact_pages_videos" CASCADE;
    DROP TABLE "contact_pages" CASCADE;
    DROP TABLE "contact_pages_rels" CASCADE;
    DROP TABLE "blog_settings" CASCADE;
    DROP TABLE "company_pages_videos" CASCADE;
    DROP TABLE "company_pages" CASCADE;
    DROP TABLE "company_pages_rels" CASCADE;
    
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_pages_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_settings_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_company_pages_fk";
    
    ALTER TABLE "navbar_settings_navigation_menu" ALTER COLUMN "dropdown_style" SET DATA TYPE text;
    ALTER TABLE "navbar_settings_navigation_menu" ALTER COLUMN "dropdown_style" SET DEFAULT 'custom-links'::text;
    DROP TYPE "public"."enum_navbar_settings_navigation_menu_dropdown_style";
    CREATE TYPE "public"."enum_navbar_settings_navigation_menu_dropdown_style" AS ENUM('regions-grid', 'travel-info', 'treks-list', 'custom-links');
    ALTER TABLE "navbar_settings_navigation_menu" ALTER COLUMN "dropdown_style" SET DEFAULT 'custom-links'::"public"."enum_navbar_settings_navigation_menu_dropdown_style";
    ALTER TABLE "navbar_settings_navigation_menu" ALTER COLUMN "dropdown_style" SET DATA TYPE "public"."enum_navbar_settings_navigation_menu_dropdown_style" USING "dropdown_style"::"public"."enum_navbar_settings_navigation_menu_dropdown_style";
    
    DROP INDEX "payload_locked_documents_rels_contact_pages_id_idx";
    DROP INDEX "payload_locked_documents_rels_blog_settings_id_idx";
    DROP INDEX "payload_locked_documents_rels_company_pages_id_idx";
    
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_pages_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_settings_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "company_pages_id";
  `);
}
