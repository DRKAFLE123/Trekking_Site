import { getPayload } from 'payload';
import config from '../payload/payload.config';

async function main() {
  const payload = await getPayload({ config });

  // ── 1. Get first trek ──────────────────────────────────────────────────────
  const treks = await payload.find({ collection: 'treks', limit: 1, depth: 0 });
  if (!treks.docs.length) {
    console.error('❌ No treks found. Please seed treks first.');
    process.exit(1);
  }
  const trek = treks.docs[0];
  console.log(`✅ Using trek: "${trek.title}" (id: ${trek.id})`);

  // ── 2. Get first user ──────────────────────────────────────────────────────
  const users = await payload.find({ collection: 'users', limit: 1, depth: 0 });
  if (!users.docs.length) {
    console.error('❌ No users found.');
    process.exit(1);
  }
  const user = users.docs[0];
  console.log(`✅ Using author (user): "${user.email}" (id: ${user.id})`);

  // ── 3. Get or create a teamMember ─────────────────────────────────────────
  const teamMembers = await payload.find({ collection: 'teamMembers', limit: 1, depth: 0 });
  let authorId: string | number;

  if (teamMembers.docs.length) {
    authorId = teamMembers.docs[0].id;
    console.log(`✅ Using team member id: ${authorId}`);
  } else {
    // Create a dummy team member for the test
    const newMember = await payload.create({
      collection: 'teamMembers',
      data: {
        name: 'Test Author',
        role: 'Content Writer',
        bio: 'A test author created by the seed script.',
      },
    });
    authorId = newMember.id;
    console.log(`✅ Created team member id: ${authorId}`);
  }

  // ── 4. Get first media item (for cover image) ─────────────────────────────
  const media = await payload.find({ collection: 'media', limit: 1, depth: 0 });
  if (!media.docs.length) {
    console.error('❌ No media found. Please upload at least one image first.');
    process.exit(1);
  }
  const coverImage = media.docs[0];
  console.log(`✅ Using cover image id: ${coverImage.id}`);

  // ── 5. Build the Lexical body with Trek Card + CTA blocks ─────────────────
  const body = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        // Intro heading
        {
          type: 'heading',
          tag: 'h2',
          format: '',
          indent: 0,
          version: 1,
          children: [{ type: 'text', text: 'The Ultimate Everest Experience', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        },
        // Intro paragraph
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              text: 'Trekking to Everest Base Camp is one of the most iconic adventures in the world. The trail passes through Sherpa villages, ancient monasteries, and some of the most dramatic mountain scenery on Earth. Here is the package we recommend for this legendary journey:',
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
        },
        // ── Trek Card Block ────────────────────────────────────────────────
        {
          type: 'block',
          format: '',
          version: 2,
          fields: {
            blockType: 'trekCardBlock',
            blockName: 'Everest Trek Card',
            id: 'test-trek-card-1',
            trek: trek, // full populated trek object
            customOneLiner: 'The classic Himalayan adventure — walk in the footsteps of legends to 5,364m.',
          },
        },
        // Mid paragraph
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              text: 'This trek is suitable for fit beginners with proper acclimatization days built into the itinerary. The best seasons to go are October–November and March–May. Our team provides end-to-end support including permits, accommodation, and experienced licensed guides.',
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
        },
        // Sub heading
        {
          type: 'heading',
          tag: 'h3',
          format: '',
          indent: 0,
          version: 1,
          children: [{ type: 'text', text: 'What Makes This Trek Special?', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        },
        // Bullet list
        {
          type: 'list',
          listType: 'bullet',
          format: '',
          indent: 0,
          version: 1,
          children: [
            { type: 'listitem', value: 1, format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Panoramic views of Everest, Lhotse, Nuptse, and Ama Dablam', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] },
            { type: 'listitem', value: 2, format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Acclimatization days in Namche Bazaar & Dingboche', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] },
            { type: 'listitem', value: 3, format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Flight to Lukla — the world\'s most thrilling airport', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] },
            { type: 'listitem', value: 4, format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Teahouse stays with warm meals and local hospitality', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] },
          ],
        },
        // ── CTA Block ─────────────────────────────────────────────────────
        {
          type: 'block',
          format: '',
          version: 2,
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

  // ── 6. Create the blog post ────────────────────────────────────────────────
  // Check if test blog already exists
  const existing = await payload.find({
    collection: 'blogPosts',
    where: { slug: { equals: 'test-everest-trek-guide' } },
    limit: 1,
    depth: 0,
  });

  if (existing.docs.length) {
    console.log('⚠️  Test blog post already exists — updating it...');
    const updated = await payload.update({
      collection: 'blogPosts',
      id: existing.docs[0].id,
      data: {
        title: 'Everest Base Camp Trek — Complete Guide 2025',
        coverImage: coverImage.id,
        body,
        excerpt: 'Everything you need to know about trekking to Everest Base Camp — route, difficulty, best season, and our recommended package.',
        status: 'published',
        publishedAt: new Date().toISOString(),
        slug: 'test-everest-trek-guide',
        author: authorId,
        category: 'Trekking Guides',
        tags: [{ tag: 'everest' }, { tag: 'ebc' }, { tag: 'himalaya' }],
        readTime: '6 min read',
        isFeatured: true,
        relatedTreks: [trek.id],
      },
    });
    console.log(`\n🎉 Updated! View it at: http://localhost:3000/blogs/test-everest-trek-guide`);
    console.log(`📝 Admin: http://localhost:3000/admin/collections/blogPosts/${updated.id}`);
  } else {
    const created = await payload.create({
      collection: 'blogPosts',
      data: {
        title: 'Everest Base Camp Trek — Complete Guide 2025',
        coverImage: coverImage.id,
        body,
        excerpt: 'Everything you need to know about trekking to Everest Base Camp — route, difficulty, best season, and our recommended package.',
        status: 'published',
        publishedAt: new Date().toISOString(),
        slug: 'test-everest-trek-guide',
        author: authorId,
        category: 'Trekking Guides',
        tags: [{ tag: 'everest' }, { tag: 'ebc' }, { tag: 'himalaya' }],
        readTime: '6 min read',
        isFeatured: true,
        relatedTreks: [trek.id],
      },
    });
    console.log(`\n🎉 Created! View it at: http://localhost:3000/blogs/test-everest-trek-guide`);
    console.log(`📝 Admin: http://localhost:3000/admin/collections/blogPosts/${created.id}`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
