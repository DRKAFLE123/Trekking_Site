import { getPayload } from 'payload';
import config from '../payload/payload.config';

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
function headingNode(text: string, tag: 'h2' | 'h3') {
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

async function main() {
  console.log('🚀 Initializing Payload CMS...');
  const payload = await getPayload({ config });

  // 1. Fetch available treks to link as related resources
  console.log('🔍 Fetching treks for related resources...');
  const treks = await payload.find({ collection: 'treks', limit: 3, depth: 0 });
  const relatedTrekIds = treks.docs.map((t) => t.id);
  console.log(`   Found ${relatedTrekIds.length} treks to link.`);

  // 2. Fetch available media items for cover image / documents
  console.log('🔍 Fetching media library assets...');
  const media = await payload.find({ collection: 'media', limit: 5, depth: 0 });
  const mediaDocs = media.docs;
  console.log(`   Found ${mediaDocs.length} media assets in library.`);

  const heroImageId = mediaDocs.length > 0 ? mediaDocs[0].id : undefined;
  const documentIds = mediaDocs.slice(1, 4).map((m) => m.id);

  if (heroImageId) {
    console.log(`   Using cover image ID: ${heroImageId}`);
  } else {
    console.log('⚠️  No media assets found in database. Cover images and PDFs will not be pre-linked.');
  }

  // 3. Define About Us Page Content (Lexical RichText Structure)
  const aboutUsBody = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        headingNode('Our Heritage: The Story of Native Sherpa Guides', 'h2'),
        paragraphNode(
          'Nature Heaven Trekking & Expedition was born in the shadows of Mt. Everest, founded by seasoned high-altitude Sherpa guides who spent decades summiting the world\'s highest peaks. For generations, our families have walked these paths, carrying not just climbing gear, but a deep spiritual connection to the mountains. We envisioned a local trekking agency that prioritizes safety, cultural immersion, and genuine hospitality over high-volume commercial tourism.'
        ),
        paragraphNode(
          'Every guide in our team is a native of the Himalayas, born and raised in high-altitude valleys like Khumbu and Rolwaling. We don\'t just know the trails; we know the families who run the teahouses, the monks who bless the mountain passes, and the micro-climate patterns that ensure a safe, successful summit expedition.'
        ),

        headingNode('The Core Difference: 100% Private, Custom Departures', 'h2'),
        paragraphNode(
          'Unlike generic trekking tours that pack twenty strangers into a single group, we specialize exclusively in private departures. This single choice transforms the entire Himalayan experience. On a private trek with us:'
        ),
        listNode([
          'You choose the calendar date that perfectly matches your schedule.',
          'You set the daily hiking speed, allowing you to walk at your natural pace.',
          'Your guide is dedicated 100% to your safety, comfort, and cultural immersion.',
          'We customize the itinerary dynamically on the trail if you need an extra acclimatization day or want to explore a hidden side valley.'
        ]),

        headingNode('Our Unwavering Commitment to Porter Welfare', 'h2'),
        paragraphNode(
          'Our porters are the true heroes of the Himalayas. We operate under strict ethical guidelines set by the International Porter Protection Group (IPPG) and the Himalayan Rescue Association (HRA). This guarantees:'
        ),
        listNode([
          'Fair wages that are well above the industry standard and paid directly on time.',
          'Full medical insurance and coverage for any high-altitude illness or evacuation.',
          'High-quality, windproof, cold-weather clothing and protective mountaineering gear.',
          'Strict weight limits (maximum 20kg per porter) to ensure their safety and physical well-being.'
        ]),

        headingNode('Fully Licensed and Government Authorized Operator', 'h2'),
        paragraphNode(
          'Nature Heaven is a fully authorized trekking operator, legally registered under the Government of Nepal. We hold active memberships and credentials with all regulatory tourism bodies:'
        ),
        listNode([
          'Ministry of Culture, Tourism and Civil Aviation (MoCTCA), Government of Nepal.',
          'Nepal Tourism Board (NTB) - Registered Operator.',
          'Trekking Agencies Association of Nepal (TAAN) - Active Corporate Member.',
          'Himalayan Rescue Association (HRA) & Nepal Mountaineering Association (NMA).'
        ]),
        paragraphNode(
          'We operate with full transparent financial audits, comprehensive liability coverage, and highly secure payment gateways, giving you complete peace of mind from the moment of your booking.'
        ),
      ],
    },
  };

  // 4. Define Why Choose Us Page Content (Lexical RichText Structure)
  const whyUsBody = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        headingNode('Nepal Tourist Visa Guidelines & Entry Fees', 'h2'),
        paragraphNode(
          'Planning a trip to the Himalayas starts with getting into the country. All international tourists (except Indian nationals) require a visa to enter Nepal. Fortunately, obtaining one is straightforward. You can easily get a Visa on Arrival at Tribhuvan International Airport (TIA) in Kathmandu or apply at your local Nepalese Embassy before departure.'
        ),
        paragraphNode(
          'Make sure your passport has at least 6 months of validity remaining from your date of entry and contains at least two blank pages. The tourist visa fees are payable in major currencies (USD, EUR, GBP) at the airport terminal:'
        ),
        listNode([
          '15-Day Tourist Visa: $30 USD',
          '30-Day Tourist Visa: $50 USD',
          '90-Day Tourist Visa: $125 USD'
        ]),

        headingNode('High-Altitude Travel Insurance: Essential Criteria', 'h2'),
        paragraphNode(
          'Standard travel insurance policies do NOT cover adventure activities above 3,000 meters. For treks like Everest Base Camp (reaching 5,364m) or the Annapurna Circuit (Thorang La Pass at 5,416m), you must secure specialized travel insurance. Your policy MUST specifically cover:'
        ),
        listNode([
          'Emergency helicopter search and rescue evacuation up to 6,000 meters elevation.',
          'High-altitude medical treatment, hospitalization, and emergency repatriation.',
          'Trip interruption or cancellation due to weather delays (very common for Lukla/Pokhara flights).'
        ]),
        paragraphNode(
          'We highly recommend world-recognized adventure insurance providers such as World Nomads, Global Rescue, or Allianz High-Altitude coverage. Always send a copy of your insurance policy certificate to our office team before your trek begins.'
        ),

        headingNode('The Ultimate Himalayan Packing Checklist', 'h2'),
        paragraphNode(
          'Packing the right gear can make the difference between a lifetime adventure and a miserable experience. The key is a smart, light, layered clothing system. We recommend packing these essential items:'
        ),
        listNode([
          'Layer 1 (Base): Moisture-wicking thermal tops and bottoms (merino wool is best).',
          'Layer 2 (Insulation): Lightweight fleece jacket or pullover, and trekking trousers.',
          'Layer 3 (Outer): Windproof and waterproof shell jacket and pants (Gore-Tex or equivalent).',
          'Heavy-weight down jacket rated for comfort down to -15°C (essential for chilly evenings).',
          'Comfortable, well broken-in high-cut hiking boots with sturdy ankle support.',
          'Four-season sleeping bag rated down to -15°C (we can also rent high-quality bags in Kathmandu).',
          'Polarized UV sunglasses, a warm beanie, a sun-protection hat, and windproof gloves.',
          'Two high-quality trekking poles, a 30-40L daypack, a headlamp, and a water purification system.'
        ]),

        headingNode('Our Advanced Safety and Emergency Protocols', 'h2'),
        paragraphNode(
          'Your safety is our absolute priority. Our guides undergo annual high-altitude medical training certified by the Wilderness Medicine Institute. Each trek is equipped with advanced safety gear:'
        ),
        listNode([
          'Pulse Oximeters: Guides check your blood oxygen saturation and heart rate twice daily (morning & evening) to monitor altitude acclimatization.',
          'Comprehensive Wilderness First-Aid Kits containing high-altitude medications (Acetazolamide/Diamox).',
          'Satellite Communication devices to ensure connectivity in deep valleys where mobile signals fail.',
          'Immediate, direct 24/7 coordination with helicopter evacuation services and high-altitude rescue teams.'
        ]),
      ],
    },
  };

  // 5. Define CSR Page Content (Lexical RichText Structure)
  const csrBody = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        headingNode('Our Eco-Ethics: Leave No Trace in the Himalayas', 'h2'),
        paragraphNode(
          'The Himalayan ecosystem is as fragile as it is magnificent. With the rise of adventure tourism, garbage accumulation and environmental degradation have become critical issues. Nature Heaven is deeply committed to preserving this wild heritage. We strictly enforce and practice the international Leave No Trace (LNT) principles on every single trek.'
        ),
        paragraphNode(
          'We pack out all non-biodegradable waste we generate, carrying it back to Kathmandu for proper recycling. We use biodegradable soap and cleaning agents in our camps. Furthermore, we actively discourage single-use plastic water bottles. Instead, we provide our guests with safe, purified drinking water using UV filtration and chlorine-free treatment tablets, preventing thousands of plastic bottles from ending up in mountain landfills.'
        ),

        headingNode('Supporting Solukhumbu Schools & Local Healthcare', 'h2'),
        paragraphNode(
          'We believe that the communities living in the shadow of the mountains should benefit directly from the tourism that comes to their valleys. A dedicated portion (5%) of every booking made with Nature Heaven goes directly into our Mountain Education and Healthcare Fund.'
        ),
        paragraphNode(
          'This fund is actively managed to support remote village schools and health posts in the Solukhumbu (Everest) and Gorkha (Manaslu) regions. Through this fund, we:'
        ),
        listNode([
          'Provide textbooks, uniforms, and stationery to underprivileged mountain children.',
          'Contribute to the monthly salaries of local school teachers in remote mountain villages.',
          'Donate essential medical supplies, oxygen cylinders, and basic health kits to village clinics.',
          'Sponsor higher education scholarships for the children of our guides, cooks, and porters.'
        ]),

        headingNode('Sustainable Travel & Carbon-Neutral Trekking Initiatives', 'h2'),
        paragraphNode(
          'We strive to minimize the carbon footprint of our operations. We design our itineraries to support local, community-run tea houses, ensuring that tourism dollars are distributed equitably among mountain families.'
        ),
        paragraphNode(
          'We source our trek meals from local, organic greenhouses and farms along the trail, promoting sustainable agriculture and reducing transport emissions. Additionally, we are launching a pilot tree-planting project in the mid-hills of Nepal. For every customer who treks with us, we plant five native trees in deforested areas, helping to restore local ecosystems and offset travel emissions.'
        ),

        headingNode('Empowering Women and Youth in Mountain Tourism', 'h2'),
        paragraphNode(
          'Historically, the trekking and climbing industry in Nepal has been heavily male-dominated. At Nature Heaven, we are working to change this narrative. We sponsor guiding licenses, English language courses, and leadership workshops for local Nepalese women.'
        ),
        paragraphNode(
          'We are proud to support and employ female trekking guides, outdoor leaders, and mountain coordinators, helping them break barriers and secure financial independence in the outdoor adventure industry.'
        ),
      ],
    },
  };

  const pagesToSeed = [
    {
      slug: 'about-us',
      title: 'About Us',
      excerpt: 'Founded by native high-altitude Sherpa guides, Nature Heaven Trekking & Expedition is built on a dream of connecting conscious international travelers with the authentic heart of the Nepalese Himalayas through 100% private customized departures.',
      content: aboutUsBody,
      videos: [
        {
          title: 'Nature Heaven - Our Sherpa Story and Porter Welfare Principles',
          youtubeUrl: 'https://www.youtube.com/watch?v=w639d6vB51I',
        },
        {
          title: 'Everest Base Camp Trek - Inside Look by Native Guides',
          youtubeUrl: 'https://www.youtube.com/watch?v=hG3zL576DCE',
        },
      ],
    },
    {
      slug: 'why-us',
      title: 'Why Choose Us',
      excerpt: 'Planning a trip to the Himalayas can be overwhelming. We simplify the journey with detailed Nepal tourist visa guides, high-altitude insurance criteria, comprehensive packing checklists, and wilderness safety protocols.',
      content: whyUsBody,
      videos: [
        {
          title: 'Himalayan Trekking Packing Guide - Expert Gear Advice',
          youtubeUrl: 'https://www.youtube.com/watch?v=9_C8kexYf8o',
        },
        {
          title: 'Understanding High Altitude and Acclimatization in Nepal',
          youtubeUrl: 'https://www.youtube.com/watch?v=9PqX_x8i6q4',
        },
      ],
    },
    {
      slug: 'csr',
      title: 'CSR (Eco-Ethics & Community)',
      excerpt: 'We believe in leaving the mountains cleaner than we found them. Our CSR initiatives focus on eco-ethics, supporting local schools/healthcare in the Everest Solukhumbu region, carbon-neutral treks, and women\'s guiding scholarships.',
      content: csrBody,
      videos: [
        {
          title: 'Leave No Trace - Sustainable Trekking in High Altitude',
          youtubeUrl: 'https://www.youtube.com/watch?v=R9Z8XhQ7_E0',
        },
        {
          title: 'Mountain Communities - Restoring Reforestation in Gorkha Region',
          youtubeUrl: 'https://www.youtube.com/watch?v=w30t3-H7jRE',
        },
      ],
    },
  ];

  for (const pageData of pagesToSeed) {
    console.log(`\n📄 Seeding page: "${pageData.title}" (slug: ${pageData.slug})...`);

    // Check if page already exists
    const existing = await payload.find({
      collection: 'companyPages',
      where: { slug: { equals: pageData.slug } },
      limit: 1,
      depth: 0,
    });

    const dataToSave = {
      title: pageData.title,
      slug: pageData.slug,
      excerpt: pageData.excerpt,
      content: pageData.content,
      heroImage: heroImageId,
      seoTitle: `${pageData.title} | Company | Nature Heaven Treks`,
      seoDescription: pageData.excerpt,
      relatedTreks: relatedTrekIds,
      documents: documentIds,
      videos: pageData.videos,
    };

    if (existing.docs.length > 0) {
      const doc = existing.docs[0];
      console.log(`   Page already exists (id: ${doc.id}) — updating it...`);
      await payload.update({
        collection: 'companyPages',
        id: doc.id,
        data: dataToSave,
      });
      console.log(`   ✅ Page "${pageData.title}" updated successfully!`);
    } else {
      console.log(`   Creating new page...`);
      const created = await payload.create({
        collection: 'companyPages',
        data: dataToSave,
      });
      console.log(`   ✅ Page "${pageData.title}" created successfully! (id: ${created.id})`);
    }
  }

  console.log('\n🎉 All Company Pages seeded successfully!');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Error seeding company pages:', e);
  process.exit(1);
});
