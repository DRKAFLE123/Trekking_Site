import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Payload 3.89+ records when a password reset was requested on auth
// collections (used to throttle forgot-password). Nullable, so the previous
// Payload version keeps working against the same database during rollout.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_requested_at";
  `)
}
