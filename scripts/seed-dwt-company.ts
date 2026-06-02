import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import fs from 'fs';

// Helper function to build standard Lexical text node
function textNode(text: string, bold: boolean = false, italic: boolean = false) {
  let format = 0;
  if (bold) format += 1;
  if (italic) format += 2;
  return {
    type: 'text',
    text,
    format,
    detail: 0,
    mode: 'normal',
    style: '',
    version: 1,
  };
}

// Helper to build standard Lexical paragraph node
function paragraphNode(text: string) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: [textNode(text)],
  };
}

// Helper to build heading node
function headingNode(text: string, tag: 'h1' | 'h2' | 'h3') {
  return {
    type: 'heading',
    tag,
    format: '',
    indent: 0,
    version: 1,
    children: [textNode(text)],
  };
}

// Helper to build list node
function listNode(items: string[], listType: 'bullet' | 'number' = 'bullet') {
  return {
    type: 'list',
    listType,
    format: '',
    indent: 0,
    version: 1,
    children: items.map((item, idx) => ({
      type: 'listitem',
      value: idx + 1,
      format: '',
      indent: 0,
      version: 1,
      children: [textNode(item)],
    })),
  };
}

// Convert markdown-like text to Lexical JSON RichText structure
function markdownToLexical(md: string) {
  const lines = md.split('\n');
  const children: any[] = [];
  let currentListItems: string[] = [];
  let currentListType: 'bullet' | 'number' | null = null;
  
  const flushList = () => {
    if (currentListItems.length > 0 && currentListType) {
      children.push(listNode(currentListItems, currentListType));
      currentListItems = [];
      currentListType = null;
    }
  };
  
  for (let line of lines) {
    line = line.trim();
    if (!line) {
      flushList();
      continue;
    }
    
    // Headings
    if (line.startsWith('# ')) {
      flushList();
      children.push(headingNode(line.slice(2), 'h1'));
    } else if (line.startsWith('## ')) {
      flushList();
      children.push(headingNode(line.slice(3), 'h2'));
    } else if (line.startsWith('### ')) {
      flushList();
      children.push(headingNode(line.slice(4), 'h3'));
    }
    // Lists
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (currentListType && currentListType !== 'bullet') {
        flushList();
      }
      currentListType = 'bullet';
      currentListItems.push(line.slice(2));
    } else if (/^\d+\.\s+/.test(line)) {
      if (currentListType && currentListType !== 'number') {
        flushList();
      }
      currentListType = 'number';
      const cleanLine = line.replace(/^\d+\.\s+/, '');
      currentListItems.push(cleanLine);
    }
    // Paragraph
    else {
      flushList();
      children.push(paragraphNode(line));
    }
  }
  
  flushList();
  
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
    }
  };
}

async function main() {
  console.log('🚀 Initializing Payload CMS...');
  const { getPayload } = await import('payload');
  const { default: config } = await import('../payload/payload.config');
  const payload = await getPayload({ config });

  // 1. Fetch available treks and media to link
  const treks = await payload.find({ collection: 'treks', limit: 3, depth: 0 });
  const relatedTrekIds = treks.docs.map((t) => t.id);
  const media = await payload.find({ collection: 'media', limit: 5, depth: 0 });
  const heroImageId = media.docs.length > 0 ? media.docs[0].id : undefined;
  const documentIds = media.docs.slice(1, 4).map((m) => m.id);

  // Folder containing resolved DWT text documents
  const dataDir = 'C:/Users/Dr.Kafle/.gemini/antigravity-ide/brain/7f79d946-8e4d-4f82-9565-c868af1698fb';

  const pagesToSeed = [
    {
      slug: 'about-us',
      title: 'About Us',
      excerpt: 'Nature Heaven Trekking & Expedition is a team of local tourism professionals born and raised in the shadow of Mount Everest, dedicated to safe, life-changing adventure.',
      filePath: path.join(dataDir, 'dwt_about_us_resolved.md'),
      seoTitle: 'About Us | Nature Heaven Trekking & Expedition',
    },
    {
      slug: 'our-team',
      title: 'Our Sherpa Team',
      excerpt: 'Meet our experienced, licensed local tourism professionals consisting of high-altitude Sherpa guides, climbers, and operations managers.',
      filePath: path.join(dataDir, 'dwt_our_team_text.txt'),
      seoTitle: 'Meet Our Sherpa Team | Nature Heaven Trekking',
    },
    {
      slug: 'responsible-tourism',
      title: 'Responsible Tourism',
      excerpt: 'We are committed to sustainable travel practices, Leave No Trace eco-ethics, and supporting local mountain village communities.',
      filePath: path.join(dataDir, 'dwt_responsible_tourism_resolved.md'),
      seoTitle: 'Responsible Tourism | Nature Heaven Trekking',
    },
    {
      slug: 'terms-conditions',
      title: 'Terms & Conditions',
      excerpt: 'Review our booking terms, contract conditions, deposits, payments, cancellations, and overall client/company liabilities.',
      filePath: path.join(dataDir, 'dwt_terms_resolved.md'),
      seoTitle: 'Terms & Conditions | Nature Heaven Trekking',
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      excerpt: 'Read our privacy guidelines explaining what client personal information we collect, how we protect it, and what your privacy rights are.',
      filePath: path.join(dataDir, 'dwt_privacy_resolved.md'),
      seoTitle: 'Privacy Policy | Nature Heaven Trekking & Expedition',
    },
    {
      slug: 'legal-documents',
      title: 'Legal Documents',
      excerpt: 'Verified legal registration certificates, licensing documents, and regulatory affiliations of Nature Heaven Trekking with the Nepal government.',
      filePath: path.join(dataDir, 'dwt_legal_resolved.md'),
      seoTitle: 'Legal Documents & Registrations | Nature Heaven Trekking',
    }
  ];

  for (const pageInfo of pagesToSeed) {
    console.log(`\n📄 Seeding page: "${pageInfo.title}" (slug: ${pageInfo.slug})...`);
    
    let rawContent = '';
    if (fs.existsSync(pageInfo.filePath)) {
      rawContent = fs.readFileSync(pageInfo.filePath, 'utf-8');
      console.log(`   Read content from file: ${pageInfo.filePath} (${rawContent.length} chars)`);
    } else {
      console.log(`   ⚠️ File not found: ${pageInfo.filePath}. Using generic fallback.`);
      rawContent = pageInfo.excerpt;
    }

    const lexicalContent = markdownToLexical(rawContent);

    const existing = await payload.find({
      collection: 'companyPages',
      where: { slug: { equals: pageInfo.slug } },
      limit: 1,
      depth: 0,
    });

    const dataToSave: any = {
      title: pageInfo.title,
      slug: pageInfo.slug,
      excerpt: pageInfo.excerpt,
      content: lexicalContent,
      heroImage: heroImageId,
      seoTitle: pageInfo.seoTitle,
      seoDescription: pageInfo.excerpt,
      relatedTreks: relatedTrekIds,
      documents: documentIds,
    };

    if (pageInfo.slug === 'our-team') {
      dataToSave.teamMembers = [
        { name: 'Paul Gurung', role: 'CEO/ FOUNDER', bio: 'Paul Gurung is the visionary founder and CEO of Nature Heaven Trekking. With over two decades of high-altitude climbing and operations leadership, he ensures every trek is safe and life-changing.' },
        { name: 'Bimal Gurung', role: 'Executive Director', bio: 'Bimal manages the daily operations, logistics, and partner relations of Nature Heaven. His administrative excellence guarantees seamless customer experiences.' },
        { name: 'Dol Gurung', role: 'Trekking Leader', bio: 'A veteran trek leader with over 50 successful Everest and Annapurna crossings. Licensed and certified in high-altitude medicine.' },
        { name: 'Siddhanta Gurung', role: 'Trekking Leader', bio: 'Specializes in the Langtang and Manaslu circuits. Known for his profound knowledge of local Buddhist culture.' },
        { name: 'Manish Gurung', role: 'Trekking Leader', bio: 'Expert wilderness first-aid responder. Dedicated to guiding off-the-beaten-path treks.' },
        { name: 'Hari Gurung', role: 'Trekking Leader', bio: 'Over 10 years of experience leading Everest base camp treks. Extremely friendly and knowledgeable.' },
        { name: 'Prem Tamang', role: 'Trek Leader', bio: 'An energetic guide from the Tamang heritage, offering deep insights into native lifestyles and mountain flora.' },
        { name: 'Chhanda Ghale', role: 'Trek Leader', bio: 'Chhanda is certified in wilderness rescue and leads climbing trips up Island Peak and Mera Peak.' },
        { name: 'Dil Gurung', role: 'Trekking Leader', bio: 'Dil leads cultural treks across the Mustang and Annapurna foothills with care and responsibility.' },
        { name: 'Mansingh Gurung', role: 'Trekking Leader', bio: 'Mansingh has guided hundreds of clients safely over the challenging Thorong La pass.' },
        { name: 'Gakul Ghale', role: 'Trek Leader', bio: 'Specializes in birdwatching and eco-tourism treks in national parks.' },
        { name: 'Suresh Gurung', role: 'Trek Leader', bio: 'Dedicated guide for high-altitude treks. Always carrying an oximeter and safety kit.' },
        { name: 'Nabin Gurung', role: 'Trek Leader', bio: 'Enthusiastic explorer who loves sharing tales of Nepalese mythology under the stars.' },
        { name: 'Kershing Gurung', role: 'Trek Leader', bio: 'Kershing leads with a gentle spirit, ensuring children and elderly hikers feel safe.' },
        { name: 'Prabhat Gurung', role: 'Trek Leader', bio: 'An experienced guide with extensive mountaineering rescue training.' },
        { name: 'Man Kumar Tamang', role: 'Trek Leader', bio: 'Specializes in the Everest region, highly praised for his mountain cooking tips.' },
        { name: 'Nigma Tamang', role: 'Trek Leader', bio: 'Veteran guide with a deep love for the Sherpa valleys.' },
        { name: 'Binod Gurung', role: 'Trek Leader', bio: 'Binod is dedicated to Leave No Trace ethics and eco-trekking.' },
        { name: 'Aryan Gurung', role: 'Trekking Leader', bio: 'Known for his athletic pace and deep passion for peak climbing.' },
        { name: 'Sanajay Magar', role: 'Trek Leader', bio: 'A certified first-responder guide who knows the Annapurna region inside out.' },
        { name: 'Phurba Tamang', role: 'Trek Leader', bio: 'Phurba is a local guide who brings an authentic voice to Solukhumbu expeditions.' },
        { name: 'Kaji Gurung', role: 'Trek Leader', bio: 'Friendly, patient, and highly trained in high-altitude mountain sickness prevention.' },
        { name: 'Dev Gurung', role: 'Trek Leader', bio: 'An active trekking guide with specialized knowledge of alpine topography.' },
        { name: 'Jit Gurung', role: 'Trek Leader', bio: 'Logistics expert on the trails, ensuring tea house bookings are perfect.' },
        { name: 'Durga Gurung', role: 'Trek Leader', bio: 'Durga loves photography and helps trekkers capture the best Himalayan views.' },
        { name: 'Milan Gurung', role: 'Trek Leader', bio: 'Extremely well-versed in English and cultural history of the Gurung people.' },
        { name: 'Bhim Gurung', role: 'Trek Leader', bio: 'Over 15 years in tourism, guiding safely through wild Himalayan storms.' },
        { name: 'Rupesh Gurung', role: 'Trek Leader', bio: 'Rupesh is dedicated to porters rights and sustainable eco-trekking.' }
      ];
    }

    if (pageInfo.slug === 'responsible-tourism') {
      dataToSave.csrQuote = {
        text: "We don't just lead tours; we support the children and porters whose ancestors have cared for these mountains for centuries.",
        author: "Mingma Sherpa, CEO",
        image: heroImageId,
      };
      dataToSave.csrCommitments = [
        {
          title: "Village School Library Project",
          icon: "education",
          description: "We supply textbooks, English storybooks, and reference encyclopedias to three rural primary schools in the Gorkha foothills, funding teacher salaries and study desks.",
        },
        {
          title: "Porter Welfare & Rights Code",
          icon: "welfare",
          description: "We are active supporters of IPPG (International Porter Protection Group). We guarantee maximum weight limits, hot nutritional meals, and warm shelter facilities for our helpers.",
        },
        {
          title: "Zero Single-Use Plastics",
          icon: "eco",
          description: "We equip guides with gravity filter bags and water purification tablets, discouraging clients from buying bottled plastic mineral water in teahouses.",
        },
        {
          title: "Local Economic Support",
          icon: "economy",
          description: "We source 100% of our teahouse stops from locally owned family lodges instead of foreign-owned corporate chains, keeping money directly in mountain economies.",
        },
      ];
    }

    if (existing.docs.length > 0) {
      const doc = existing.docs[0];
      console.log(`   Page already exists (id: ${doc.id}) — updating it...`);
      await payload.update({
        collection: 'companyPages',
        id: doc.id,
        data: dataToSave,
      });
      console.log(`   ✅ Page "${pageInfo.title}" updated successfully!`);
    } else {
      console.log(`   Creating new page...`);
      const created = await payload.create({
        collection: 'companyPages',
        data: dataToSave,
      });
      console.log(`   ✅ Page "${pageInfo.title}" created successfully! (id: ${created.id})`);
    }
  }

  console.log('\n🎉 Seeding of Company Pages completed successfully!');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Error seeding company pages:', e);
  process.exit(1);
});
