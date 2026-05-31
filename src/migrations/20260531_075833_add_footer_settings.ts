import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "footer_settings_emergency_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "footer_settings_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "footer_settings_navigation_menu_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_settings_navigation_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer_settings_affiliations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Nature Heaven' NOT NULL,
  	"logo_id" integer,
  	"background_image_id" integer,
  	"bio_text" varchar DEFAULT 'Nature Heaven Trekking is a government-licensed, premier adventure operator in Nepal. We lead customized private trekking, peak climbing, and cultural tours across the Himalayas.',
  	"newsletter_title" varchar DEFAULT 'Subscribe our Newsletter',
  	"emergency_title" varchar DEFAULT 'Emergency SOS (24/7):',
  	"whatsapp_number" varchar DEFAULT '+977-9851218358',
  	"nepal_office_address" varchar DEFAULT 'Pakjonal Marga -16, Thamel, Kathmandu, Nepal',
  	"nepal_office_phone" varchar,
  	"uk_office_address" varchar DEFAULT 'London, United Kingdom',
  	"uk_office_phone" varchar,
  	"accepted_payments_enable_sectigo" boolean DEFAULT true,
  	"accepted_payments_enable_paypal" boolean DEFAULT true,
  	"accepted_payments_enable_mastercard" boolean DEFAULT true,
  	"accepted_payments_enable_visa" boolean DEFAULT true,
  	"accepted_payments_enable_swift" boolean DEFAULT true,
  	"social_links_youtube" varchar DEFAULT 'https://youtube.com',
  	"social_links_instagram" varchar DEFAULT 'https://instagram.com',
  	"social_links_facebook" varchar DEFAULT 'https://facebook.com',
  	"social_links_tiktok" varchar DEFAULT 'https://tiktok.com',
  	"government_reg_no" varchar DEFAULT 'Government Registration No. 4893. Bonded & insured through Everest Insurance. Authorized by Ministry of Tourism, Government of Nepal.',
  	"copyright_notice" varchar DEFAULT 'The copyright to all content on this website, including photographs, belongs to Nature Heaven Trekking and cannot be reproduced without our permission.',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "footer_settings_id" integer;
  ALTER TABLE "footer_settings_emergency_numbers" ADD CONSTRAINT "footer_settings_emergency_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_settings_emails" ADD CONSTRAINT "footer_settings_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_settings_navigation_menu_links" ADD CONSTRAINT "footer_settings_navigation_menu_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_settings_navigation_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_settings_navigation_menu" ADD CONSTRAINT "footer_settings_navigation_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_settings_affiliations" ADD CONSTRAINT "footer_settings_affiliations_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_settings_affiliations" ADD CONSTRAINT "footer_settings_affiliations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_settings" ADD CONSTRAINT "footer_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_settings" ADD CONSTRAINT "footer_settings_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "footer_settings_emergency_numbers_order_idx" ON "footer_settings_emergency_numbers" USING btree ("_order");
  CREATE INDEX "footer_settings_emergency_numbers_parent_id_idx" ON "footer_settings_emergency_numbers" USING btree ("_parent_id");
  CREATE INDEX "footer_settings_emails_order_idx" ON "footer_settings_emails" USING btree ("_order");
  CREATE INDEX "footer_settings_emails_parent_id_idx" ON "footer_settings_emails" USING btree ("_parent_id");
  CREATE INDEX "footer_settings_navigation_menu_links_order_idx" ON "footer_settings_navigation_menu_links" USING btree ("_order");
  CREATE INDEX "footer_settings_navigation_menu_links_parent_id_idx" ON "footer_settings_navigation_menu_links" USING btree ("_parent_id");
  CREATE INDEX "footer_settings_navigation_menu_order_idx" ON "footer_settings_navigation_menu" USING btree ("_order");
  CREATE INDEX "footer_settings_navigation_menu_parent_id_idx" ON "footer_settings_navigation_menu" USING btree ("_parent_id");
  CREATE INDEX "footer_settings_affiliations_order_idx" ON "footer_settings_affiliations" USING btree ("_order");
  CREATE INDEX "footer_settings_affiliations_parent_id_idx" ON "footer_settings_affiliations" USING btree ("_parent_id");
  CREATE INDEX "footer_settings_affiliations_logo_idx" ON "footer_settings_affiliations" USING btree ("logo_id");
  CREATE INDEX "footer_settings_logo_idx" ON "footer_settings" USING btree ("logo_id");
  CREATE INDEX "footer_settings_background_image_idx" ON "footer_settings" USING btree ("background_image_id");
  CREATE INDEX "footer_settings_updated_at_idx" ON "footer_settings" USING btree ("updated_at");
  CREATE INDEX "footer_settings_created_at_idx" ON "footer_settings" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_settings_fk" FOREIGN KEY ("footer_settings_id") REFERENCES "public"."footer_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_footer_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_settings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_settings_emergency_numbers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_settings_emails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_settings_navigation_menu_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_settings_navigation_menu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_settings_affiliations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "footer_settings_emergency_numbers" CASCADE;
  DROP TABLE "footer_settings_emails" CASCADE;
  DROP TABLE "footer_settings_navigation_menu_links" CASCADE;
  DROP TABLE "footer_settings_navigation_menu" CASCADE;
  DROP TABLE "footer_settings_affiliations" CASCADE;
  DROP TABLE "footer_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_footer_settings_fk";
  
  DROP INDEX "payload_locked_documents_rels_footer_settings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "footer_settings_id";`)
}
