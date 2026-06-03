import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🚀 Initializing Payload CMS...');
  const { getPayload } = await import('payload');
  const { default: config } = await import('../payload/payload.config');
  const payload = await getPayload({ config });

  console.log('🔍 Fetching companyPages...');
  const pages = await payload.find({
    collection: 'companyPages',
    limit: 100,
    depth: 1,
  });
  console.log('Company Pages found:', pages.docs.map(p => ({ id: p.id, title: p.title, slug: p.slug })));

  const teamPage = pages.docs.find(p => p.slug === 'our-team');
  if (teamPage) {
    console.log('Found Our Team page. Embedded team members length:', (teamPage as any).teamMembers?.length || 0);
    console.log('Embedded team members details:', (teamPage as any).teamMembers?.map((m: any) => ({ name: m.name, role: m.role })));
  } else {
    console.log('No Our Team page found in companyPages!');
  }

  console.log('🔍 Fetching teamMembers collection...');
  const teamMembers = await payload.find({
    collection: 'teamMembers',
    limit: 100,
  });
  console.log('Global team members count:', teamMembers.docs.length);
  console.log('Global team members details:', teamMembers.docs.map((m: any) => ({ id: m.id, name: m.name, role: m.role })));

  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
