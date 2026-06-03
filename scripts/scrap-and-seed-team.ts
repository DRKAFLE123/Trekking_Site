import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Helper to build Lexical JSON nodes
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

function paragraphNode(text: string, childrenOverrides?: any[]) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: childrenOverrides || [textNode(text)],
  };
}

function headingNode(text: string, tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return {
    type: 'heading',
    tag,
    format: '',
    indent: 0,
    version: 1,
    children: [textNode(text, true)],
  };
}

// Function to download image and upload it to Payload CMS media collection
async function downloadAndUploadImage(payload: any, url: string, filename: string, altText: string, category: string): Promise<any> {
  console.log(`📥 Downloading image: ${url}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to download ${url}, status: ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Make sure public/uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write file locally first so Payload's cloudinary hook can find it
    const localFilePath = path.join(uploadDir, filename);
    fs.writeFileSync(localFilePath, buffer);
    console.log(`💾 Saved locally to: ${localFilePath}`);

    console.log(`📤 Uploading to Payload CMS...`);
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
        category: category,
      },
      file: {
        name: filename,
        mimetype: 'image/jpeg',
        data: buffer,
        size: buffer.length,
      },
      overrideAccess: true,
    });
    console.log(`✅ Uploaded successfully! Media ID: ${mediaDoc.id}, URL: ${mediaDoc.url}`);
    return mediaDoc;
  } catch (error: any) {
    console.error(`❌ Failed to process image ${url}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Initializing Payload CMS...');
  const { getPayload } = await import('payload');
  const { default: config } = await import('../payload/payload.config');
  const payload = await getPayload({ config });

  // ==========================================
  // PART 1: CLEAR EXISTING TEAM MEMBERS
  // ==========================================
  console.log('🧹 Clearing existing teamMembers collection records...');
  const existingTeamDocs = await payload.find({
    collection: 'teamMembers',
    limit: 100,
    overrideAccess: true,
  });
  console.log(`   Found ${existingTeamDocs.docs.length} team members to delete.`);
  for (const doc of existingTeamDocs.docs) {
    await payload.delete({
      collection: 'teamMembers',
      id: doc.id,
      overrideAccess: true,
    });
    console.log(`   Deleted team member: ${doc.name} (id: ${doc.id})`);
  }

  // ==========================================
  // PART 1.5: CLEAR ASSOCIATED MEDIA RECORDS
  // ==========================================
  console.log('🧹 Clearing existing team photos and about-us media records...');
  const existingMediaDocs = await payload.find({
    collection: 'media',
    limit: 100,
    where: {
      or: [
        { category: { equals: 'team_photos' } },
        { filename: { like: 'our-team-cover' } },
        { filename: { like: 'about-us-cover' } },
        { filename: { like: 'about-us-values' } },
        { filename: { like: 'krishna-ghimire' } },
        { filename: { like: 'ramesh-tiwari' } },
        { filename: { like: 'rupa-ghimire' } },
        { filename: { like: 'naama' } },
        { filename: { like: 'cristina' } },
        { filename: { like: 'aviad' } },
        { filename: { like: 'melvyn-pyster' } }
      ]
    },
    overrideAccess: true,
  });
  console.log(`   Found ${existingMediaDocs.docs.length} media files to delete.`);
  for (const doc of existingMediaDocs.docs) {
    await payload.delete({
      collection: 'media',
      id: doc.id,
      overrideAccess: true,
    });
    console.log(`   Deleted media record: ${doc.filename} (id: ${doc.id})`);
  }

  // ==========================================
  // PART 2: DOWNLOAD & UPLOAD TEAM PHOTOS
  // ==========================================
  const teamDataScraped = [
    {
      name: 'Krishna Ghimire',
      role: 'CEO/Expedition and Trekking Guide',
      imageUrl: 'https://natureheaventrek.com/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-02-at-5.54.42-PM.jpeg',
      filename: 'krishna-ghimire.jpg',
      bio: "Krishna Ghimire, CEO of Nature Heaven Treks and Expedition, is a seasoned trekker and a visionary leader. With extensive experience in Nepal's tourism sector, Krishna is committed to sustainable tourism and community development. Under his guidance, the company has flourished, offering unique, eco-friendly trekking experiences highlighting Nepal's natural beauty and cultural richness.",
      socialLinks: {
        facebook: 'https://www.facebook.com/profile.php?id=61558748774204',
      }
    },
    {
      name: 'Ramesh Tiwari',
      role: 'CEO/ Tour Guide',
      imageUrl: 'https://natureheaventrek.com/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-02-at-6.12.53-PM.jpeg',
      filename: 'ramesh-tiwari.jpg',
      bio: "Ramesh Tiwari, CEO of Nature Heaven Treks and Expedition, is a seasoned trekker and a visionary leader. With extensive experience in Nepal's tourism sector, Ramesh is committed to sustainable tourism and community development. Under his guidance, the company has flourished, offering unique, eco-friendly trekking experiences that highlight Nepal's natural beauty and cultural richness.",
      socialLinks: {
        facebook: 'https://www.facebook.com/profile.php?id=61558748774204',
      }
    },
    {
      name: 'Rupa Ghimire',
      role: 'Accounting / Tour Guide',
      imageUrl: 'https://natureheaventrek.com/wp-content/uploads/2025/06/Rupa-Ghimire_-800x600.jpg',
      filename: 'rupa-ghimire.jpg',
      bio: "Rupa Ghimire, handling accounting and serving as a tour guide at Nature Heaven Treks and Expedition, brings a unique blend of financial acumen and deep local knowledge to the team. Her expertise ensures operational efficiency and enhances the touring experience for travelers, making each adventure both seamless and enriching.",
      socialLinks: {
        facebook: 'https://www.facebook.com/profile.php?id=61558748774204',
      }
    },
    {
      name: 'Naama',
      role: 'USA Team Leader',
      imageUrl: 'https://natureheaventrek.com/wp-content/uploads/2025/06/Naama__-800x600.jpg',
      filename: 'naama.jpg',
      bio: "Naama, the USA Team Leader at Nature Heaven Treks and Expedition, brings her extensive experience in guiding and adventure tourism to the team. Passionate about connecting travelers with the natural beauty of Nepal, she excels at creating unforgettable journeys. Naama’s dedication to providing seamless and enriching experiences ensures that every traveler feels safe, inspired, and ready to explore the wonders of Nepal’s diverse landscapes.",
      socialLinks: {
        facebook: 'https://www.facebook.com/profile.php?id=61558748774204',
      }
    },
    {
      name: 'Cristina',
      role: 'Malaysia Team Leader',
      imageUrl: 'https://natureheaventrek.com/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-02-at-5.35.18-PM.jpeg',
      filename: 'cristina.jpg',
      bio: "Cristina, Malaysia Team Leader at Nature Heaven Treks and Expedition, embodies the spirit of adventure and cultural curiosity. With a background in sustainable tourism and community development, Cristina is committed to promoting Nepal’s rich cultural heritage while ensuring eco-friendly travel practices. Her enthusiasm and deep knowledge of the region allow her to craft unique trekking experiences that highlight Nepal’s natural beauty and cultural richness, making every journey memorable.",
      socialLinks: {
        facebook: 'https://www.facebook.com/profile.php?id=61558748774204',
      }
    },
    {
      name: 'Aviad',
      role: 'Israel Team Leader',
      imageUrl: 'https://natureheaventrek.com/wp-content/uploads/2025/06/Aviad-Israel-Team-Leader-800x600.jpg',
      filename: 'aviad.jpg',
      bio: "Aviad, Israel Team Leader at Nature Heaven Treks and Expedition, is an experienced trekker and nature enthusiast who thrives on adventure and discovery. With a strong background in guiding international travelers, Aviad is dedicated to providing authentic and transformative trekking experiences in Nepal. His passion for sustainable travel and his commitment to showcasing Nepal’s natural wonders ensure that each journey is both enriching and unforgettable for every traveler.",
      socialLinks: {
        facebook: 'https://www.facebook.com/profile.php?id=61558748774204',
      }
    },
    {
      name: 'Melvyn Pyster',
      role: 'Australian Team Leader',
      imageUrl: 'https://natureheaventrek.com/wp-content/uploads/2025/06/MELVYN-PYSTER_-800x600.jpg',
      filename: 'melvyn-pyster.jpg',
      bio: "Melvyn, Australian Team Leader at Nature Heaven Treks and Expedition, is a passionate adventurer and seasoned trekker with a deep love for the Himalayas. Hailing from Australia, he brings a unique international perspective and a genuine enthusiasm for cultural exchange. Melvyn specializes in guiding travelers through Nepal’s diverse landscapes while fostering meaningful connections with local communities. His dedication to sustainable tourism and immersive travel ensures every trek becomes a life-changing experience for those who join him.",
      socialLinks: {
        facebook: 'https://www.facebook.com/profile.php?id=61558748774204',
      }
    }
  ];

  console.log('📸 Importing team member photos and creating team members...');
  for (const item of teamDataScraped) {
    console.log(`\n👤 Processing team member: ${item.name}...`);
    const mediaDoc = await downloadAndUploadImage(
      payload,
      item.imageUrl,
      item.filename,
      `Photo of ${item.name}`,
      'team_photos'
    );

    const teamMemberData = {
      name: item.name,
      role: item.role,
      bio: item.bio,
      photo: mediaDoc ? mediaDoc.id : undefined,
      socialLinks: item.socialLinks,
    };

    const created = await payload.create({
      collection: 'teamMembers',
      data: teamMemberData,
      overrideAccess: true,
    });
    console.log(`   ✅ Created team member record in collection (id: ${created.id})`);
  }

  // ==========================================
  // PART 3: CLEAN UP COMPANY PAGES - OUR TEAM
  // ==========================================
  console.log('\n📄 Updating the "our-team" Company Page...');
  
  // Download team cover image
  const teamCoverMedia = await downloadAndUploadImage(
    payload,
    'https://natureheaventrek.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-07-at-11.56.18-PM5.jpeg',
    'our-team-cover.jpg',
    'Nature Heaven Treks Team Cover Image',
    'uncategorized'
  );

  const teamPageResponse = await payload.find({
    collection: 'companyPages',
    where: { slug: { equals: 'our-team' } },
    limit: 1,
    overrideAccess: true,
  });

  const teamPageIntroContent = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        paragraphNode(
          'Nature Heaven Treks and Expedition stands as one of Nepal’s leading trekking and expedition companies, celebrated for delivering unparalleled adventure experiences. Guided by the expertise and vision of Krishna Ghimire, our team excels in crafting meticulously planned treks tailored to the unique needs and preferences of our clients.'
        ),
        paragraphNode(
          'With an intimate understanding of the Himalayan terrain, we are committed to providing safe, sustainable, and enriching journeys. Our experienced guides are not just skilled in navigation and safety but also deeply knowledgeable about the cultural heritage of the regions we traverse. This allows us to transform every trek into a meaningful exploration of Nepal’s natural beauty and vibrant traditions.'
        )
      ]
    }
  };

  if (teamPageResponse.docs.length > 0) {
    const doc = teamPageResponse.docs[0];
    console.log(`   Found page (id: ${doc.id}) — replacing embedded dummy array and updating intro text...`);
    await payload.update({
      collection: 'companyPages',
      id: doc.id,
      data: {
        title: 'Our Team',
        excerpt: 'Meet our experienced, licensed local tourism professionals consisting of high-altitude Sherpa guides, climbers, and operations managers.',
        teamMembers: [], // Clear embedded array so the frontend queries the global collection
        content: teamPageIntroContent,
        heroImage: teamCoverMedia ? teamCoverMedia.id : undefined,
      },
      overrideAccess: true,
    });
    console.log('   ✅ "our-team" page updated successfully!');
  } else {
    console.log('   ⚠️ "our-team" page not found! Creating it...');
    await payload.create({
      collection: 'companyPages',
      data: {
        title: 'Our Team',
        slug: 'our-team',
        excerpt: 'Meet our experienced, licensed local tourism professionals consisting of high-altitude Sherpa guides, climbers, and operations managers.',
        teamMembers: [],
        content: teamPageIntroContent,
        heroImage: teamCoverMedia ? teamCoverMedia.id : undefined,
      },
      overrideAccess: true,
    });
    console.log('   ✅ "our-team" page created successfully!');
  }

  // ==========================================
  // PART 4: SCRAPE & SEED ABOUT US PAGE
  // ==========================================
  console.log('\n📄 Updating the "about-us" Company Page...');
  
  // Download about us images
  const aboutUsCoverMedia = await downloadAndUploadImage(
    payload,
    'https://natureheaventrek.com/wp-content/uploads/2024/03/chhuking-in-everest-region-1200x900.jpg',
    'about-us-cover.jpg',
    'Chhuking in Everest Region - About Nature Heaven Treks',
    'uncategorized'
  );

  const aboutUsValuesMedia = await downloadAndUploadImage(
    payload,
    'https://natureheaventrek.com/wp-content/uploads/2025/08/Manaslu-Circuit-Trek-1200x900.jpg',
    'about-us-values.jpg',
    'Manaslu Circuit Trek - Nature Heaven Treks',
    'uncategorized'
  );

  const aboutUsBodyContent = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        paragraphNode(
          'Nature Heaven Treks and Expedition (NHT) stands out in Nepal’s tourism industry by offering a wide range of exciting and unique experiences. We provide adventure activities like trekking in famous regions such as Langtang National Park, Annapurna Conservation Area, and Sagarmatha (Everest) National Park. We also organize jungle safaris, rafting, mountaineering, peaceful tours in Kathmandu and Pokhara, cooking classes, and environmental trips to Mustang and Upper Dolpo. NHT also offers tours to Tibet, Bhutan, and India, giving travelers even more opportunities for adventure and cultural exploration.'
        ),
        paragraphNode(
          'Led by Krishna Ghimire, a tourism expert with over 15 years of experience, NHT has a team of skilled trekking and climbing guides who are friendly, professional, and committed to helping you achieve your travel goals. We believe in honesty and clear communication, providing detailed information about costs and customizable itineraries. There are no hidden fees, so you’ll know exactly what to expect.'
        ),
        paragraphNode(
          'Your safety is our top priority. NHT ensures all activities are backed by reliable insurance and emergency support, so you can explore with peace of mind. We are dedicated to giving every traveler an unforgettable and safe experience.'
        ),
        paragraphNode(
          'At NHT, we treat our clients like family, creating a welcoming and caring atmosphere. Our goal is to make Nepal feel like your “home away from home.” Whether you’re seeking adventure, culture, or relaxation, we are here to make your journey special.'
        ),
        paragraphNode(
          'If you’re planning a trip to Nepal, we invite you to check out our testimonials and choose NHT as your trusted partner for an incredible journey through the beautiful Himalayas. Let us help you create memories that will last a lifetime!'
        ),
        headingNode('Our Core Values', 'h2'),
        headingNode('✅ Safety First', 'h4'),
        paragraphNode(
          'Your safety comes before everything else. Every trip is planned and guided with care to ensure a secure and enjoyable experience.'
        ),
        headingNode('✅ Authenticity', 'h4'),
        paragraphNode(
          'We believe travel should be more than just sightseeing — it should be deeply meaningful and culturally rich.'
        ),
        headingNode('✅ Sustainability', 'h4'),
        paragraphNode(
          'We are committed to protecting the environment and supporting local communities through responsible travel.'
        )
      ]
    }
  };

  const aboutPageResponse = await payload.find({
    collection: 'companyPages',
    where: { slug: { equals: 'about-us' } },
    limit: 1,
    overrideAccess: true,
  });

  if (aboutPageResponse.docs.length > 0) {
    const doc = aboutPageResponse.docs[0];
    console.log(`   Found page (id: ${doc.id}) — updating about-us content and images...`);
    await payload.update({
      collection: 'companyPages',
      id: doc.id,
      data: {
        title: 'About Us',
        excerpt: 'Nature Heaven Treks and Expedition, based in Kathmandu, Nepal, offers awe-inspiring adventures amidst Himalayan landscapes, guided by experienced professionals, ensuring unforgettable experiences in nature\'s embrace.',
        content: aboutUsBodyContent,
        heroImage: aboutUsCoverMedia ? aboutUsCoverMedia.id : undefined,
      },
      overrideAccess: true,
    });
    console.log('   ✅ "about-us" page updated successfully!');
  } else {
    console.log('   ⚠️ "about-us" page not found! Creating it...');
    await payload.create({
      collection: 'companyPages',
      data: {
        title: 'About Us',
        slug: 'about-us',
        excerpt: 'Nature Heaven Treks and Expedition, based in Kathmandu, Nepal, offers awe-inspiring adventures amidst Himalayan landscapes, guided by experienced professionals, ensuring unforgettable experiences in nature\'s embrace.',
        content: aboutUsBodyContent,
        heroImage: aboutUsCoverMedia ? aboutUsCoverMedia.id : undefined,
      },
      overrideAccess: true,
    });
    console.log('   ✅ "about-us" page created successfully!');
  }

  console.log('\n🎉 Scrape and seed completed successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
