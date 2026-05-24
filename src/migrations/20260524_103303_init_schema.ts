import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'viewer');
  CREATE TYPE "public"."enum_treks_difficulty" AS ENUM('easy', 'moderate', 'hard', 'extreme');
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_departures_status" AS ENUM('available', 'limited', 'sold_out', 'cancelled');
  CREATE TYPE "public"."enum_bookings_travelers_gender" AS ENUM('male', 'female', 'other');
  CREATE TYPE "public"."enum_bookings_payment_type" AS ENUM('full', 'advance_10');
  CREATE TYPE "public"."enum_bookings_payment_status" AS ENUM('unpaid', 'partial', 'paid', 'refunded');
  CREATE TYPE "public"."enum_bookings_booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'resolved', 'closed');
  CREATE TYPE "public"."enum_payments_method" AS ENUM('stripe', 'paypal', 'esewa', 'khalti', 'bank_transfer');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('pending', 'success', 'failed', 'refunded');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Trekk Expert' NOT NULL,
  	"avatar_id" integer,
  	"role" "enum_users_role" DEFAULT 'admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_emergency_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar
  );
  
  CREATE TABLE "site_settings_affiliations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "site_settings_video_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"youtube_id" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"trek_name" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"logo" varchar,
  	"hero_video_url" varchar,
  	"hero_image_id" integer,
  	"hero_headline" varchar NOT NULL,
  	"hero_subheadline" varchar,
  	"stats_clients" varchar,
  	"stats_years" varchar,
  	"stats_treks" varchar,
  	"stats_rating" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_whatsapp" varchar,
  	"contact_info_email" varchar,
  	"contact_info_address" varchar,
  	"social_links_youtube" varchar,
  	"social_links_instagram" varchar,
  	"social_links_facebook" varchar,
  	"social_links_tiktok" varchar,
  	"header_settings_expert_name" varchar DEFAULT 'Kafle',
  	"header_settings_expert_phone" varchar DEFAULT '+977 9851218358',
  	"header_settings_expert_whats_app" varchar DEFAULT '+977 9851218358',
  	"header_settings_quick_email" varchar DEFAULT 'info@natureheaventrek.com',
  	"footer_settings_bio_text" varchar DEFAULT 'Nature Heaven Trekking & Expedition is a government-licensed, premier adventure operator in Nepal. We lead customized private trekking, peak climbing, and cultural tours across the Himalayas.',
  	"footer_settings_nepal_head_office_address" varchar DEFAULT 'Pakjonal Marga -16, Thamel, Kathmandu, Nepal',
  	"footer_settings_nepal_head_office_phone" varchar DEFAULT '+977-9851218358',
  	"footer_settings_uk_branch_office_address" varchar DEFAULT 'London, United Kingdom',
  	"footer_settings_uk_branch_office_phone" varchar,
  	"footer_settings_government_reg_no" varchar DEFAULT 'Government Registration No. 4893. Bonded & insured through Everest Insurance. Authorized by Ministry of Tourism, Government of Nepal.',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treks_id" integer
  );
  
  CREATE TABLE "regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"cover_image_id" integer,
  	"map_center_lat" numeric,
  	"map_center_lng" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "treks_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "treks_day_by_day_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"accommodation" varchar,
  	"meals" varchar,
  	"distance" varchar,
  	"altitude" numeric
  );
  
  CREATE TABLE "treks_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"inclusion" varchar
  );
  
  CREATE TABLE "treks_exclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"exclusion" varchar
  );
  
  CREATE TABLE "treks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "treks_gps_coordinates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lat" numeric NOT NULL,
  	"lng" numeric NOT NULL,
  	"label" varchar NOT NULL,
  	"altitude" numeric
  );
  
  CREATE TABLE "treks_group_discounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"min_persons" numeric NOT NULL,
  	"max_persons" numeric NOT NULL,
  	"price_per_person" numeric NOT NULL
  );
  
  CREATE TABLE "treks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"region_id" integer NOT NULL,
  	"duration" numeric NOT NULL,
  	"price" numeric NOT NULL,
  	"discounted_price" numeric,
  	"difficulty" "enum_treks_difficulty" NOT NULL,
  	"max_altitude" numeric NOT NULL,
  	"group_size" numeric,
  	"start_point" varchar,
  	"end_point" varchar,
  	"overview" jsonb,
  	"hero_image_id" integer,
  	"youtube_video_id" varchar,
  	"is_best_seller" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_blog_posts_status" DEFAULT 'draft' NOT NULL,
  	"category" varchar NOT NULL,
  	"author_id" integer NOT NULL,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"read_time" varchar,
  	"cover_image_id" integer,
  	"excerpt" varchar NOT NULL,
  	"body" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treks_id" integer
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer,
  	"bio" varchar,
  	"social_links_facebook" varchar,
  	"social_links_instagram" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_twitter" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"rating" numeric NOT NULL,
  	"review_text" varchar NOT NULL,
  	"trek_id" integer,
  	"date" timestamp(3) with time zone,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"trek_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"category" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "departures" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"trek_id" integer NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"available_seats" numeric DEFAULT 16 NOT NULL,
  	"booked_seats" numeric DEFAULT 0 NOT NULL,
  	"status" "enum_departures_status" DEFAULT 'available' NOT NULL,
  	"price_override" numeric,
  	"is_guaranteed" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "bookings_travelers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar,
  	"nationality" varchar NOT NULL,
  	"gender" "enum_bookings_travelers_gender" NOT NULL,
  	"dob" timestamp(3) with time zone NOT NULL,
  	"passport_number" varchar,
  	"passport_expiry" timestamp(3) with time zone
  );
  
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"booking_id" varchar NOT NULL,
  	"trek_id" integer NOT NULL,
  	"departure_id" integer,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"travelers_count" numeric DEFAULT 1 NOT NULL,
  	"customer_details_first_name" varchar NOT NULL,
  	"customer_details_last_name" varchar NOT NULL,
  	"customer_details_email" varchar NOT NULL,
  	"customer_details_phone" varchar NOT NULL,
  	"customer_details_country" varchar NOT NULL,
  	"base_price" numeric NOT NULL,
  	"discount" numeric,
  	"tax" numeric,
  	"total_price" numeric NOT NULL,
  	"payment_type" "enum_bookings_payment_type" DEFAULT 'full' NOT NULL,
  	"payment_status" "enum_bookings_payment_status" DEFAULT 'unpaid' NOT NULL,
  	"booking_status" "enum_bookings_booking_status" DEFAULT 'pending' NOT NULL,
  	"admin_remarks" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"country" varchar,
  	"trek_id" integer,
  	"start_date" timestamp(3) with time zone,
  	"travelers" numeric DEFAULT 1,
  	"message" varchar NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"booking_id" integer NOT NULL,
  	"payment_id" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"method" "enum_payments_method" NOT NULL,
  	"status" "enum_payments_status" DEFAULT 'pending' NOT NULL,
  	"transaction_details" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"site_settings_id" integer,
  	"regions_id" integer,
  	"treks_id" integer,
  	"blog_posts_id" integer,
  	"team_members_id" integer,
  	"testimonials_id" integer,
  	"gallery_id" integer,
  	"faqs_id" integer,
  	"departures_id" integer,
  	"bookings_id" integer,
  	"inquiries_id" integer,
  	"payments_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_emergency_numbers" ADD CONSTRAINT "site_settings_emergency_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_affiliations" ADD CONSTRAINT "site_settings_affiliations_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_affiliations" ADD CONSTRAINT "site_settings_affiliations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_video_gallery" ADD CONSTRAINT "site_settings_video_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_treks_fk" FOREIGN KEY ("treks_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions" ADD CONSTRAINT "regions_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "treks_highlights" ADD CONSTRAINT "treks_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treks_day_by_day_itinerary" ADD CONSTRAINT "treks_day_by_day_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treks_inclusions" ADD CONSTRAINT "treks_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treks_exclusions" ADD CONSTRAINT "treks_exclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treks_gallery" ADD CONSTRAINT "treks_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "treks_gallery" ADD CONSTRAINT "treks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treks_gps_coordinates" ADD CONSTRAINT "treks_gps_coordinates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treks_group_discounts" ADD CONSTRAINT "treks_group_discounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treks" ADD CONSTRAINT "treks_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "treks" ADD CONSTRAINT "treks_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_tags" ADD CONSTRAINT "blog_posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_team_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_treks_fk" FOREIGN KEY ("treks_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_trek_id_treks_id_fk" FOREIGN KEY ("trek_id") REFERENCES "public"."treks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery" ADD CONSTRAINT "gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery" ADD CONSTRAINT "gallery_trek_id_treks_id_fk" FOREIGN KEY ("trek_id") REFERENCES "public"."treks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departures" ADD CONSTRAINT "departures_trek_id_treks_id_fk" FOREIGN KEY ("trek_id") REFERENCES "public"."treks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookings_travelers" ADD CONSTRAINT "bookings_travelers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_trek_id_treks_id_fk" FOREIGN KEY ("trek_id") REFERENCES "public"."treks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_departure_id_departures_id_fk" FOREIGN KEY ("departure_id") REFERENCES "public"."departures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_trek_id_treks_id_fk" FOREIGN KEY ("trek_id") REFERENCES "public"."treks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_settings_fk" FOREIGN KEY ("site_settings_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_treks_fk" FOREIGN KEY ("treks_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departures_fk" FOREIGN KEY ("departures_id") REFERENCES "public"."departures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "site_settings_emergency_numbers_order_idx" ON "site_settings_emergency_numbers" USING btree ("_order");
  CREATE INDEX "site_settings_emergency_numbers_parent_id_idx" ON "site_settings_emergency_numbers" USING btree ("_parent_id");
  CREATE INDEX "site_settings_affiliations_order_idx" ON "site_settings_affiliations" USING btree ("_order");
  CREATE INDEX "site_settings_affiliations_parent_id_idx" ON "site_settings_affiliations" USING btree ("_parent_id");
  CREATE INDEX "site_settings_affiliations_logo_idx" ON "site_settings_affiliations" USING btree ("logo_id");
  CREATE INDEX "site_settings_video_gallery_order_idx" ON "site_settings_video_gallery" USING btree ("_order");
  CREATE INDEX "site_settings_video_gallery_parent_id_idx" ON "site_settings_video_gallery" USING btree ("_parent_id");
  CREATE INDEX "site_settings_hero_image_idx" ON "site_settings" USING btree ("hero_image_id");
  CREATE INDEX "site_settings_updated_at_idx" ON "site_settings" USING btree ("updated_at");
  CREATE INDEX "site_settings_created_at_idx" ON "site_settings" USING btree ("created_at");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_treks_id_idx" ON "site_settings_rels" USING btree ("treks_id");
  CREATE UNIQUE INDEX "regions_slug_idx" ON "regions" USING btree ("slug");
  CREATE INDEX "regions_cover_image_idx" ON "regions" USING btree ("cover_image_id");
  CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
  CREATE INDEX "treks_highlights_order_idx" ON "treks_highlights" USING btree ("_order");
  CREATE INDEX "treks_highlights_parent_id_idx" ON "treks_highlights" USING btree ("_parent_id");
  CREATE INDEX "treks_day_by_day_itinerary_order_idx" ON "treks_day_by_day_itinerary" USING btree ("_order");
  CREATE INDEX "treks_day_by_day_itinerary_parent_id_idx" ON "treks_day_by_day_itinerary" USING btree ("_parent_id");
  CREATE INDEX "treks_inclusions_order_idx" ON "treks_inclusions" USING btree ("_order");
  CREATE INDEX "treks_inclusions_parent_id_idx" ON "treks_inclusions" USING btree ("_parent_id");
  CREATE INDEX "treks_exclusions_order_idx" ON "treks_exclusions" USING btree ("_order");
  CREATE INDEX "treks_exclusions_parent_id_idx" ON "treks_exclusions" USING btree ("_parent_id");
  CREATE INDEX "treks_gallery_order_idx" ON "treks_gallery" USING btree ("_order");
  CREATE INDEX "treks_gallery_parent_id_idx" ON "treks_gallery" USING btree ("_parent_id");
  CREATE INDEX "treks_gallery_image_idx" ON "treks_gallery" USING btree ("image_id");
  CREATE INDEX "treks_gps_coordinates_order_idx" ON "treks_gps_coordinates" USING btree ("_order");
  CREATE INDEX "treks_gps_coordinates_parent_id_idx" ON "treks_gps_coordinates" USING btree ("_parent_id");
  CREATE INDEX "treks_group_discounts_order_idx" ON "treks_group_discounts" USING btree ("_order");
  CREATE INDEX "treks_group_discounts_parent_id_idx" ON "treks_group_discounts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "treks_slug_idx" ON "treks" USING btree ("slug");
  CREATE INDEX "treks_region_idx" ON "treks" USING btree ("region_id");
  CREATE INDEX "treks_hero_image_idx" ON "treks" USING btree ("hero_image_id");
  CREATE INDEX "treks_updated_at_idx" ON "treks" USING btree ("updated_at");
  CREATE INDEX "treks_created_at_idx" ON "treks" USING btree ("created_at");
  CREATE INDEX "blog_posts_tags_order_idx" ON "blog_posts_tags" USING btree ("_order");
  CREATE INDEX "blog_posts_tags_parent_id_idx" ON "blog_posts_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");
  CREATE INDEX "blog_posts_cover_image_idx" ON "blog_posts" USING btree ("cover_image_id");
  CREATE INDEX "blog_posts_seo_seo_meta_image_idx" ON "blog_posts" USING btree ("seo_meta_image_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX "blog_posts_rels_order_idx" ON "blog_posts_rels" USING btree ("order");
  CREATE INDEX "blog_posts_rels_parent_idx" ON "blog_posts_rels" USING btree ("parent_id");
  CREATE INDEX "blog_posts_rels_path_idx" ON "blog_posts_rels" USING btree ("path");
  CREATE INDEX "blog_posts_rels_treks_id_idx" ON "blog_posts_rels" USING btree ("treks_id");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "testimonials_trek_idx" ON "testimonials" USING btree ("trek_id");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "gallery_image_idx" ON "gallery" USING btree ("image_id");
  CREATE INDEX "gallery_trek_idx" ON "gallery" USING btree ("trek_id");
  CREATE INDEX "gallery_updated_at_idx" ON "gallery" USING btree ("updated_at");
  CREATE INDEX "gallery_created_at_idx" ON "gallery" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "departures_trek_idx" ON "departures" USING btree ("trek_id");
  CREATE INDEX "departures_updated_at_idx" ON "departures" USING btree ("updated_at");
  CREATE INDEX "departures_created_at_idx" ON "departures" USING btree ("created_at");
  CREATE INDEX "bookings_travelers_order_idx" ON "bookings_travelers" USING btree ("_order");
  CREATE INDEX "bookings_travelers_parent_id_idx" ON "bookings_travelers" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "bookings_booking_id_idx" ON "bookings" USING btree ("booking_id");
  CREATE INDEX "bookings_trek_idx" ON "bookings" USING btree ("trek_id");
  CREATE INDEX "bookings_departure_idx" ON "bookings" USING btree ("departure_id");
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  CREATE INDEX "inquiries_trek_idx" ON "inquiries" USING btree ("trek_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "payments_booking_idx" ON "payments" USING btree ("booking_id");
  CREATE UNIQUE INDEX "payments_payment_id_idx" ON "payments" USING btree ("payment_id");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_site_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("site_settings_id");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");
  CREATE INDEX "payload_locked_documents_rels_treks_id_idx" ON "payload_locked_documents_rels" USING btree ("treks_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_departures_id_idx" ON "payload_locked_documents_rels" USING btree ("departures_id");
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "site_settings_emergency_numbers" CASCADE;
  DROP TABLE "site_settings_affiliations" CASCADE;
  DROP TABLE "site_settings_video_gallery" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TABLE "regions" CASCADE;
  DROP TABLE "treks_highlights" CASCADE;
  DROP TABLE "treks_day_by_day_itinerary" CASCADE;
  DROP TABLE "treks_inclusions" CASCADE;
  DROP TABLE "treks_exclusions" CASCADE;
  DROP TABLE "treks_gallery" CASCADE;
  DROP TABLE "treks_gps_coordinates" CASCADE;
  DROP TABLE "treks_group_discounts" CASCADE;
  DROP TABLE "treks" CASCADE;
  DROP TABLE "blog_posts_tags" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "blog_posts_rels" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "gallery" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "departures" CASCADE;
  DROP TABLE "bookings_travelers" CASCADE;
  DROP TABLE "bookings" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_treks_difficulty";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum_departures_status";
  DROP TYPE "public"."enum_bookings_travelers_gender";
  DROP TYPE "public"."enum_bookings_payment_type";
  DROP TYPE "public"."enum_bookings_payment_status";
  DROP TYPE "public"."enum_bookings_booking_status";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_payments_method";
  DROP TYPE "public"."enum_payments_status";`)
}
