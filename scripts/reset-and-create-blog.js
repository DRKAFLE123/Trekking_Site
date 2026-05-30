const crypto = require('crypto');
const http = require('http');
const { Client } = require('pg');

const DB_URI = 'postgresql://postgres:DpostDB12xyz@[2406:da1a:b00:1302:ca:9ac1:9496:2406]:5432/postgres';
const BASE_URL = 'http://localhost:3000';
const NEW_PASSWORD = 'TestPass@123';
const ADMIN_EMAIL = 'kafledamodar0804@gmail.com';
const ADMIN_ID = 2;

// Trek ID 1 = Everest Base Camp, team member id = 1, media id = 1
const TREK_ID = 1;
const AUTHOR_ID = 1;
const MEDIA_ID = 1;

function apiRequest(path, method, data, token) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : undefined;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `JWT ${token}`;
    if (body) headers['Content-Length'] = Buffer.byteLength(body);

    const options = { hostname: 'localhost', port: 3000, path, method, headers };
    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, data: raw }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function resetPassword() {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = await new Promise((res, rej) =>
    crypto.pbkdf2(NEW_PASSWORD, salt, 25000, 512, 'sha256', (e, h) => e ? rej(e) : res(h.toString('hex')))
  );
  const client = new Client({ connectionString: DB_URI });
  await client.connect();
  // Check actual column names
  const cols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`);
  console.log('User table columns:', cols.rows.map(r => r.column_name).join(', '));
  await client.query('UPDATE users SET hash = $1, salt = $2 WHERE id = $3', [hash, salt, ADMIN_ID]);
  await client.end();
  console.log(`✅ Password reset for ${ADMIN_EMAIL} -> ${NEW_PASSWORD}`);
}

async function main() {
  // Step 1: Reset password
  await resetPassword();

  // Step 2: Login
  const loginResp = await apiRequest('/api/users/login', 'POST', { email: ADMIN_EMAIL, password: NEW_PASSWORD });
  if (loginResp.status !== 200) {
    console.error('❌ Login failed:', loginResp.status, JSON.stringify(loginResp.data));
    process.exit(1);
  }
  const token = loginResp.data.token;
  console.log('✅ Logged in, token acquired');

  // Step 3: Build blog post body with Trek Card + CTA
  const body = {
    root: {
      type: 'root', format: '', indent: 0, version: 1,
      children: [
        {
          type: 'heading', tag: 'h2', format: '', indent: 0, version: 1,
          children: [{ type: 'text', text: 'The Ultimate Everest Experience', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        },
        {
          type: 'paragraph', format: '', indent: 0, version: 1,
          children: [{ type: 'text', text: 'Trekking to Everest Base Camp is one of the most iconic adventures in the world. The trail passes through Sherpa villages, ancient monasteries, and some of the most dramatic mountain scenery on Earth. Here is the package we recommend for this legendary journey:', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        },
        // Trek Card Block
        {
          type: 'block', format: '', version: 2,
          fields: {
            blockType: 'trekCardBlock',
            blockName: 'Everest Trek Card',
            id: 'test-trek-card-1',
            trek: TREK_ID,
            customOneLiner: 'The classic Himalayan adventure — walk in the footsteps of legends to 5,364m.',
          },
        },
        {
          type: 'heading', tag: 'h3', format: '', indent: 0, version: 1,
          children: [{ type: 'text', text: 'What Makes This Trek Special?', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        },
        {
          type: 'list', listType: 'bullet', format: '', indent: 0, version: 1,
          children: [
            { type: 'listitem', value: 1, format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Panoramic views of Everest, Lhotse, Nuptse, and Ama Dablam', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] },
            { type: 'listitem', value: 2, format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Acclimatization days in Namche Bazaar & Dingboche', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] },
            { type: 'listitem', value: 3, format: '', indent: 0, version: 1, children: [{ type: 'text', text: "Flight to Lukla — the world's most thrilling airport", format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] },
            { type: 'listitem', value: 4, format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Teahouse stays with warm meals and local hospitality', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] },
          ],
        },
        // CTA Block
        {
          type: 'block', format: '', version: 2,
          fields: {
            blockType: 'ctaBlock',
            blockName: 'Inquiry CTA',
            id: 'test-cta-1',
            headline: 'Ready to Trek to Everest Base Camp?',
            buttonText: 'Make an Inquiry Now',
            whatsappNumber: '+977-9823636377',
          },
        },
      ],
    },
  };

  // Step 4: Create blog post
  const blogData = {
    title: 'Everest Base Camp Trek — Complete Guide 2025',
    coverImage: MEDIA_ID,
    body,
    excerpt: 'Everything you need to know about trekking to Everest Base Camp — route, difficulty, best season, and our recommended package.',
    status: 'published',
    publishedAt: new Date().toISOString(),
    slug: 'test-everest-trek-guide',
    author: AUTHOR_ID,
    category: 'Trekking Guides',
    tags: [{ tag: 'everest' }, { tag: 'ebc' }, { tag: 'himalaya' }],
    readTime: '6 min read',
    isFeatured: true,
    relatedTreks: [TREK_ID],
  };

  // Check if exists first
  const existing = await apiRequest(`/api/blogPosts?where[slug][equals]=test-everest-trek-guide&limit=1`, 'GET', null, token);
  
  let result;
  if (existing.data?.docs?.length > 0) {
    const existingId = existing.data.docs[0].id;
    console.log(`⚠️  Post exists (id: ${existingId}), updating...`);
    result = await apiRequest(`/api/blogPosts/${existingId}`, 'PATCH', blogData, token);
  } else {
    result = await apiRequest('/api/blogPosts', 'POST', blogData, token);
  }

  if (result.status === 200 || result.status === 201) {
    const postId = result.data?.doc?.id || result.data?.id;
    console.log(`\n🎉 SUCCESS! Test blog post created/updated.`);
    console.log(`📖 View on frontend: ${BASE_URL}/blogs/test-everest-trek-guide`);
    console.log(`📝 Edit in admin:    ${BASE_URL}/admin/collections/blogPosts/${postId}`);
  } else {
    console.error('❌ Failed to create blog post:', result.status);
    console.error(JSON.stringify(result.data, null, 2));
  }

  process.exit(0);
}

main().catch(e => { console.error('Error:', e); process.exit(1); });
