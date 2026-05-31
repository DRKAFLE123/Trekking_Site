import { getPayload } from 'payload';
import { sql } from '@payloadcms/db-postgres';
import config from '../payload/payload.config';
import { up } from '../src/migrations/20260531_163146_add_company_pages';

async function main() {
  console.log('🚀 Initializing Payload CMS...');
  const payload = await getPayload({ config });
  
  console.log('🚀 Extracting Drizzle database client...');
  const db = (payload.db as any).drizzle;
  if (!db) {
    throw new Error('Could not find Drizzle instance on payload.db!');
  }
  
  console.log('🚀 Executing migration 20260531_163146_add_company_pages up() function...');
  await up({ db, payload, req: {} as any });
  console.log('✅ Migration up() function executed successfully!');
  
  console.log('📌 Recording migration in "payload_migrations" table...');
  try {
    await db.execute(sql`
      INSERT INTO "payload_migrations" ("name", "batch") 
      VALUES ('20260531_163146_add_company_pages', 6);
    `);
    console.log('✅ Migration record inserted into "payload_migrations"!');
  } catch (err: any) {
    if (err.message.includes('already exists') || err.message.includes('duplicate')) {
      console.log('ℹ️ Migration record already exists in database.');
    } else {
      console.error('⚠️ Warning when inserting migration record:', err.message);
    }
  }
  
  console.log('🎉 Database Schema is now perfectly synced!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
