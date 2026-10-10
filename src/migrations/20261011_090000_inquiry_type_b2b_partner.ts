import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// New inquiry type for the /b2b-partners form. Adding an enum value is
// backward compatible, so this can run before the code that uses it.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TYPE "public"."enum_inquiries_type" ADD VALUE IF NOT EXISTS 'b2b_partner';`)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // Postgres cannot drop a single enum value; leaving it is harmless.
}
