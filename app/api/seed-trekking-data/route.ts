import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload/payload.config';
import { Client } from 'pg';

// 1. Define Travel Info new pages title mappings
const travelInfoPages = [
  { slug: "travel-guide-for-nepal", title: "Ultimate Travel Guide to Nepal", excerpt: "Your definitive guide to exploring Nepal, covering arrival logistics, peak seasons, and cultural insights." },
  { slug: "private-treks-in-nepal", title: "Tailor-Made Private Treks in Nepal", excerpt: "Experience custom-designed hiking itineraries built around your private timeline, interests, and hiking pace." },
  { slug: "why-travel-to-nepal", title: "What Makes Nepal Special?", excerpt: "Discover the spectacular mountains, warm ethnic cultures, and legendary trails that define Nepal." },
  { slug: "regions-in-nepal", title: "Trekking Region in Nepal", excerpt: "An in-depth look at Nepal's primary hiking territories: Everest, Annapurna, Manaslu, Langtang, and beyond." },
  { slug: "attractions-in-nepal", title: "Famous Destinations in Nepal", excerpt: "From Pokhara's lakes to Chitwan's safaris and the ancient temples of Kathmandu Valley." },
  { slug: "guides-mandatory-for-trekkers", title: "Why Guides are Mandatory for Trekkers?", excerpt: "Guidelines on the new rules requiring professional registered guides for all solo/independent foreign hikers." },
  { slug: "accommodation-in-nepal", title: "Accommodation Facilities", excerpt: "A guide to teahouses, mountain lodges, homestays, and luxury hotels on the trail and in cities." },
  { slug: "altitude-acclimatization", title: "Altitude Acclimatization: 8 Essential Golden Rules", excerpt: "Crucial health guidelines to identify and prevent high-altitude sickness (AMS) during high-pass treks." },
  { slug: "getting-to-nepal-and-visas", title: "Nepal Arrival and Immigration Guide", excerpt: "Visas on arrival, custom declarations, and flight logistics for entering Nepal seamlessly." },
  { slug: "currency-and-payments", title: "Global Currency and Digital Payment Solutions", excerpt: "Using Nepalese Rupees (NPR), credit cards, mobile wallets, and handling cash on the mountain trails." },
  { slug: "facts-about-mt-everest", title: "Lesser-Known Facts of Mount Everest", excerpt: "Fascinating geo-physical, ecological, and cultural trivia about the highest peak on Earth." },
  { slug: "fact-about-lord-buddha", title: "Fact About Lord Buddha", excerpt: "Explore Lumbini, the birthplace of Siddhartha Gautama (Lord Buddha), and his teachings of peace." },
  { slug: "food-and-beverages", title: "Beverages and Food", excerpt: "What to eat on the trails: custom nutritional analysis of Dal Bhat, local teas, and drinking-water safety." },
  { slug: "safety-while-travelling", title: "Guidelines for Safe and Secure Travel in Nepal", excerpt: "Tips on staying secure, emergency helicopter coordinates, medical checkups, and travel protocols." },
  { slug: "transportation-in-nepal", title: "How Transportation Works in Nepal", excerpt: "Domestic mountain flights, private jeeps, and tourist coaches: navigating Himalayan roads safely." },
  { slug: "trekking-permits-and-fees", title: "Permit Rules and Fees for Trekking in Nepal", excerpt: "National park permits, local municipality cards, and TIMS requirements mapped out for foreign visitors." },
  { slug: "weather-and-climate", title: "Weather and Climate Variations Across Nepal", excerpt: "Monsoons, freezing winter winds, and perfect spring seasons analyzed month-by-month." },
  { slug: "what-to-do-before-coming", title: "Travel Preparation Guide for Nepal Visitors", excerpt: "Fitness training routines, shopping checklists, packing regulations, and vaccination guides." },
  { slug: "health-safety-risk-prevention", title: "Health, Safety, and Risk Prevention", excerpt: "Proactive strategies for avoiding food-borne bugs, muscle strains, and cold-weather hazards." },
  { slug: "know-festival-in-nepal", title: "Know Festival in Nepal", excerpt: "Immerse yourself in Dashain, Tihar, Holi, and Tiji festivals: Nepal's rich calendar of cultural celebrations." }
];

// 2. Define Category to Region mapping
const categoryToRegion: Record<string, { name: string; slug: string }> = {
  "Everest Treks": { name: "Everest Region", slug: "everest" },
  "Annapurna Treks": { name: "Annapurna Region", slug: "annapurna" },
  "Manaslu Treks": { name: "Manaslu Region", slug: "manaslu" },
  "Langtang Treks": { name: "Langtang Region", slug: "langtang" },
  "Ganesh Himal Treks": { name: "Ganesh Himal Region", slug: "ganesh-himal" },
  "Mustang Treks": { name: "Mustang Region", slug: "mustang" },
  "Kanchenjunga Treks": { name: "Kanchenjunga Region", slug: "kanchenjunga" },
  "Makalu Treks": { name: "Makalu Region", slug: "makalu" },
  "Dolpa Treks": { name: "Dolpa Region", slug: "dolpa" },
  "Tour in Nepal": { name: "Tour in Nepal", slug: "tour-in-nepal" },
  "Expedition in Nepal": { name: "Expedition in Nepal", slug: "expedition-in-nepal" },
  "Peak Climbing in Nepal": { name: "Peak Climbing in Nepal", slug: "peak-climbing-in-nepal" },
  "Jungle Safari in Nepal": { name: "Jungle Safari in Nepal", slug: "jungle-safari-in-nepal" },
  "River Rafting in Nepal": { name: "River Rafting in Nepal", slug: "river-rafting-in-nepal" },
  "Bungee Jumping in Nepal": { name: "Bungee Jumping in Nepal", slug: "bungee-jumping-in-nepal" },
  "Paragliding in Nepal": { name: "Paragliding in Nepal", slug: "paragliding-in-nepal" }
};

const makeLexicalParagraphs = (text: string) => {
  const paragraphs = text
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map(p => ({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: p,
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }))
    }
  };
};

function generatePlaceholderContent(title: string) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "heading",
          tag: "h2",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: `Overview of ${title}`,
              version: 1,
            },
          ],
        },
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: `This is the premium live documentation and overview details for ${title}. Highly recommended and customized for global adventurers booking private trekking, peaks, and cultural activities in Nepal.`,
              version: 1,
            },
          ],
        },
      ],
    },
  };
}

export async function GET(request: Request) {
  const env = process.env as any;
  const envKey = "NODE_ENV";
  const originalNodeEnv = env[envKey];
  
  try {
    // --- RAW SQL CLIENT FOR PURGES (bypasses payload_locked_documents_rels issues) ---
    const rawDbUrl = (process.env.DATABASE_URL || process.env.DATABASE_URI || '').trim().replace(/^"|"$/g, '');
    const dbClient = new Client({ connectionString: rawDbUrl });
    await dbClient.connect();
    
    console.log("[Seeder] Purging collections via direct SQL...");
    // Delete in dependency order (children before parents)
    await dbClient.query('DELETE FROM payments');
    await dbClient.query('DELETE FROM bookings');
    await dbClient.query('DELETE FROM departures');
    await dbClient.query('DELETE FROM inquiries');
    await dbClient.query('DELETE FROM treks_faqs');
    await dbClient.query('DELETE FROM treks_gps_coordinates');
    await dbClient.query('DELETE FROM treks_group_discounts');
    await dbClient.query('DELETE FROM treks_gallery');
    await dbClient.query('DELETE FROM treks_highlights');
    await dbClient.query('DELETE FROM treks_inclusions');
    await dbClient.query('DELETE FROM treks_exclusions');
    await dbClient.query('DELETE FROM treks_day_by_day_itinerary');
    await dbClient.query('DELETE FROM faqs_rels');
    await dbClient.query('DELETE FROM faqs');
    await dbClient.query('DELETE FROM treks');
    await dbClient.query('DELETE FROM regions');
    await dbClient.query('DELETE FROM pages');
    await dbClient.query("SELECT setval('treks_id_seq', 1, false) WHERE EXISTS (SELECT FROM pg_sequences WHERE sequencename = 'treks_id_seq')").catch(() => {});
    await dbClient.query("SELECT setval('regions_id_seq', 1, false) WHERE EXISTS (SELECT FROM pg_sequences WHERE sequencename = 'regions_id_seq')").catch(() => {});
    await dbClient.query("SELECT setval('faqs_id_seq', 1, false) WHERE EXISTS (SELECT FROM pg_sequences WHERE sequencename = 'faqs_id_seq')").catch(() => {});
    await dbClient.end();
    console.log("[Seeder] Direct SQL purge complete.");

    console.log("[Seeder] Booting Payload Local API...");
    // Temporarily trigger dev schemas in adapter
    env[envKey] = "development";
    const payload = await getPayload({ config });
    console.log("[Seeder] Payload initialized successfully.");

    // --- PHASE 1: PAGES SEEDING (Travel Info) ---
    console.log("[Seeder] Seeding 20 high-fidelity Travel Info Pages...");
    for (const pageItem of travelInfoPages) {
      await payload.create({
        collection: 'pages',
        data: {
          title: pageItem.title,
          slug: pageItem.slug,
          excerpt: pageItem.excerpt,
          content: generatePlaceholderContent(pageItem.title) as any
        }
      });
    }

    // --- PHASE 3: SEED REGIONS ---
    console.log("[Seeder] Seeding Regions...");
    const regionMap: Record<string, number> = {};
    for (const [catName, regInfo] of Object.entries(categoryToRegion)) {
      const createdRegion = await payload.create({
        collection: 'regions',
        data: {
          name: regInfo.name,
          slug: regInfo.slug,
          description: `All adventure trips, base camps, climbs, and tours located across the beautiful ${regInfo.name} in Nepal.`
        }
      });
      regionMap[catName] = Number(createdRegion.id);
    }

    // --- PHASE 4: SEED EBC TREK ---
    console.log("[Seeder] Seeding Everest Base Camp Trek - 14 Days...");

    const ebcOverviewText = `The 14-day Everest Base Camp Trek takes you deep into Nepal’s Khumbu region, leading you to the foot of the world’s highest peak, Mount Everest. Along the journey, you’ll pass through dramatic glacial valleys, rugged mountain trails, traditional Sherpa villages, and ancient Buddhist monasteries, experiencing the true essence of the Himalayas.

Everest Base Camp Trek Overview
The Everest Base Camp Trek offers an unforgettable journey through the stunning landscapes and rich Sherpa culture of Nepal’s Everest region in the northeast Himalayas. This iconic trek takes you to Everest Base Camp (5,364 m) in the Solukhumbu District, with the highest point being Kala Patthar (5,555 m), where you get spectacular close-up views of Mount Everest.

This 14-day adventure begins with a scenic flight from Kathmandu to Lukla (2,860 m), lasting around 40 minutes. During peak seasons, flights may operate from Manthali, which requires a 5-hour drive from Kathmandu followed by a short 20-minute flight to Lukla.

From Lukla, the trail follows the Dudh Koshi River valley, passing through traditional villages like Phakding (2,650 m). Along the way, you cross iconic suspension bridges, including the famous Hillary Bridge, and enter the protected Sagarmatha National Park, known for its dramatic mountain scenery and biodiversity.

As you ascend through lush rhododendron forests and alpine landscapes, you reach Namche Bazaar (3,440 m), the vibrant gateway to Everest. This Sherpa town is a key acclimatization stop, where you can explore local markets, visit nearby Khumjung village, the Sherpa museum, and Syangboche Airport, and enjoy panoramic mountain views.

From Namche, the trail offers your first clear glimpses of Everest from viewpoints such as the Everest View Hotel. The route continues through wildlife-rich terrain, where sightings of Himalayan tahr, musk deer, and colorful pheasants are possible.

The journey then leads to Tengboche (3,860 m), home to the famous Tengboche Monastery. This peaceful location offers breathtaking views of Ama Dablam, Everest, Lhotse, and Nuptse, blending spiritual serenity with natural grandeur.

Further ahead, you pass through dense pine and juniper forests before reaching Dingboche (4,410 m), a high-altitude farming village and important acclimatization stop.

Beyond Dingboche, the landscape becomes increasingly rugged as you approach Lobuche (4,940 m), passing memorial stupas dedicated to climbers who lost their lives on Everest. The terrain grows harsher and more dramatic as oxygen levels drop.

From Lobuche, the trail continues to Gorak Shep (5,140 m), the final settlement before Everest Base Camp. A challenging trek from here brings you to Everest Base Camp (5,364 m), surrounded by glaciers and towering Himalayan peaks, offering a true sense of achievement.

On the return, you walk alongside the vast Khumbu Glacier and pass the dramatic Khumbu Icefall before heading back to Gorak Shep. An early morning ascent to Kala Patthar rewards you with an unforgettable sunrise view of Everest glowing in golden light.

The descent retraces the route through Pheriche (4,250 m), Dingboche, Tengboche, and Namche Bazaar, before reaching Lukla. A final scenic flight returns you to Kathmandu, concluding your Everest Base Camp adventure with lifelong memories of mountains, culture, and adventure.

Lukla Flight Information
During peak trekking seasons (March–May and October–November), flights to Lukla are often operated from Manthali (Ramechhap) instead of Kathmandu due to heavy air traffic at Tribhuvan International Airport. On these days, you will typically depart Kathmandu around 12:30 a.m. and travel for 5–6 hours by road to reach Manthali Airport for an early morning flight.
In the off-season, Lukla flights generally operate directly from Kathmandu Airport, making the journey more convenient.
Please note that flights to Lukla are highly weather-dependent, and delays or cancellations are common due to unpredictable mountain conditions. For this reason, we strongly recommend adding at least two buffer days after your trek to ensure smooth international connections and avoid travel disruptions.

Online Trip Briefing
Once your booking is confirmed with a 10% deposit and we receive your required documents, we will arrange a quick online briefing via WhatsApp.
During this session, we will go through the full itinerary, gear checklist, weather conditions, and what you can expect on the trail. It is also your opportunity to ask any questions about the trek.
We will guide you on both physical and mental preparation so you feel fully confident, informed, and ready before starting your journey.`;

    const ebcHighlights = [
      { highlight: "Breathtaking close-up views of Mount Everest (8,848.68 m) from the Khumbu region" },
      { highlight: "Visit the iconic Everest Base Camp (5,364 m) rock, a famous landmark and photo spot" },
      { highlight: "Scenic and thrilling flight to Tenzing-Hillary Airport in Lukla" },
      { highlight: "Hike to Kala Patthar (5,555 m) for the best sunrise and sunset views over Everest" },
      { highlight: "Panoramic Himalayan views of Lhotse (8,516 m), Cho Oyu (8,201 m), and Makalu (8,463 m)" },
      { highlight: "Experience Syangboche, one of the highest airports in the world (3,780 m)" },
      { highlight: "Visit the historic Tengboche Monastery, a spiritual hub of the Khumbu region" },
      { highlight: "Stand near the mighty Khumbu Glacier (around 4,900 m), one of the world’s highest glaciers" },
      { highlight: "Trek through Sagarmatha National Park, rich in glaciers, forests, and alpine landscapes" },
      { highlight: "Explore Sherpa culture and lifestyle in villages like Namche Bazaar" },
      { highlight: "Pay respects at the memorial stupas in Lobuche, dedicated to Everest climbers" },
      { highlight: "Walk through spiritual trails featuring mani walls, prayer wheels, and suspension bridges" },
      { highlight: "Chance to spot Himalayan wildlife such as musk deer, Himalayan tahr, snow leopard, and colorful pheasants" }
    ];

    const ebcInclusions = [
      { inclusion: "Round-trip flights: Kathmandu/Manthali – Lukla (and return)" },
      { inclusion: "Shared road transfer between Kathmandu and Manthali when required" },
      { inclusion: "Private airport pick-up and drop-off service in Kathmandu" },
      { inclusion: "13 nights total accommodation during the trek" },
      { inclusion: "6 nights in Lukla, Phakding (2 nights), and Namche Bazaar (3 nights) in rooms with private attached bathrooms where available" },
      { inclusion: "7 nights in standard teahouse rooms at Tengboche (2 nights), Dingboche (2 nights), Lobuche, Gorakshep, and Pheriche" },
      { inclusion: "Full-board meals (breakfast, lunch, and dinner) during the trek" },
      { inclusion: "14 breakfasts, 13 lunches, and 14 dinners (one main course per meal)" },
      { inclusion: "Seasonal fresh fruits daily" },
      { inclusion: "Water purification tablets for safe drinking water" },
      { inclusion: "Licensed, English-speaking trekking guide" },
      { inclusion: "1 assistant guide for groups above 12 trekkers" },
      { inclusion: "Porter service (1 porter for every 2 trekkers, carrying up to 18 kg total)" },
      { inclusion: "Covers wages, insurance, accommodation, meals, transport, and equipment for staff" },
      { inclusion: "Sagarmatha National Park entry permit" },
      { inclusion: "Khumbu Pasang Lhamu Rural Municipality fee" },
      { inclusion: "All applicable local and government taxes" },
      { inclusion: "Basic medical kit and oxygen saturation (oximeter) monitoring" },
      { inclusion: "Assistance with emergency rescue coordination (covered by your travel insurance)" },
      { inclusion: "Company T-shirt and cap" },
      { inclusion: "Trek completion certificate" },
      { inclusion: "Farewell dinner in Kathmandu after the trek" },
      { inclusion: "Sleeping bag, down jacket, and duffel bag (shared per two trekkers if needed)" },
      { inclusion: "Free luggage storage at our Kathmandu office during the trek" }
    ];

    const ebcExclusions = [
      { exclusion: "International flight tickets to and from Nepal" },
      { exclusion: "Hotel stays in Kathmandu before and after the trek" },
      { exclusion: "Extra nights in Kathmandu due to early arrival, late departure, or changes in itinerary" },
      { exclusion: "All meals (breakfast, lunch, and dinner) in Kathmandu before and after the trek" },
      { exclusion: "Tips for guides and porters (recommended but not mandatory)" },
      { exclusion: "Nepal tourist visa on arrival at Tribhuvan International Airport" },
      { exclusion: "Personal travel insurance covering high-altitude trekking and emergency helicopter evacuation (mandatory)" },
      { exclusion: "Snacks, bottled water, tea/coffee, soft drinks, alcohol, and hot showers" },
      { exclusion: "Wi-Fi, phone calls, battery charging fees" },
      { exclusion: "Extra porter charges (if required)" },
      { exclusion: "Souvenirs and shopping items" },
      { exclusion: "Personal trekking clothing and equipment" },
      { exclusion: "Any services not specifically mentioned in the “Included” section" }
    ];

    const ebcItinerary = [
      {
        day: 1,
        title: "Arrival and welcome at Tribhuvan International Airport, Kathmandu (1300m/4260ft).",
        description: "Welcome to Nepal! Upon your arrival at the airport, our friendly team will be there to greet you with a warm smile. Look out for a staff member holding a nameplate with your name at the terminal gate for easy identification. From there, you’ll be comfortably escorted to your hotel. Settlement and relax. In the evening, join us for a welcome dinner at a traditional local restaurant. Experience Thamel's buzzing hub of shops, cafes, and nightlife before returning to your hotel.",
        accommodation: "Thamel Boutique Hotel",
        meals: "Dinner",
        altitude: 1300
      },
      {
        day: 2,
        title: "Fly from Kathmandu or Manthali to Lukla. Trek to Phakding (2,650 m), about 3 hours.",
        description: "During peak seasons, flights to Lukla from Kathmandu are often rerouted to Manthali Airport due to air traffic. In such cases, you will depart your hotel around 12:30 AM for a 5-hour drive to Manthali, followed by a 20-minute flight to Lukla. Direct flights from Kathmandu (40 min) are available off-season. After landing in Lukla, descend through Chaurikharka and follow the Dudh Koshi River, passing Cheplung and Thado Koshi Gaon to Phakding.",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 2650
      },
      {
        day: 3,
        title: "Trek from Phakding to Namche Bazaar (3,440 m), approx. 6 hours.",
        description: "Leaving Phakding, the trail follows the Dudh Koshi River, winding through rhododendron and pine forests. You will cross Hillary suspension bridge and climb steadily to reach Namche Bazaar (3,440 m), the Sherpa capital and vibrant gateway to Everest, offering beautiful views of Everest, Lhotse, and Ama Dablam.",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 3440
      },
      {
        day: 4,
        title: "Acclimatization and rest day in Namche Bazaar.",
        description: "Acclimatization in Namche Bazaar is an essential part of the trek. Spend the day exploring Namche Bazaar, hike to the Everest View Hotel for spectacular panoramas, visit Khumjung village, the Sherpa museum, and Syangboche Airport, while resting and keeping hydrated.",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 3440
      },
      {
        day: 5,
        title: "Trek from Namche Bazaar to Tengboche/Deboche (3,855 m), approx. 5 hours.",
        description: "We start early after breakfast. The trail winds through rhododendron forests, crossing bridges over roaring rivers before climbing to Tengboche Monastery at 3,860 m, the spiritual hub of the Khumbu region. Outstanding panoramic mountain vistas of Ama Dablam, Nuptse, Lhotse, and Everest await.",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 3855
      },
      {
        day: 6,
        title: "Trek from Tengboche to Dingboche (4,360 m), approx. 5 hours.",
        description: "Leaving Tengboche, we follow the scenic trail through rhododendron forests. The landscape gradually changes, becoming more alpine and rugged. We ascend alongside the Imja Khola river, passing local villages and prayer wheels to reach the high-altitude farming village of Dingboche (4,410 m).",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 4360
      },
      {
        day: 7,
        title: "Acclimatization and rest day in Dingboche.",
        description: "A second key acclimatization day. Take a steady hike to Nagarjuna Hill (approx. 5,100 m) to expose your body to thinner air. Enjoy breathtaking views of Ama Dablam, Lhotse, and surrounding glaciers before descending to Dingboche for a restful afternoon.",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 4360
      },
      {
        day: 8,
        title: "Trek from Dingboche to Lobuche (4,930 m), approx. 5 hours.",
        description: "Trek through a rocky alpine landscape. Pass through the memorial stupas at Lobuche Pass dedicated to the climbers who lost their lives on Everest. The terrain grows harsher and more dramatic as we reach the small cluster of teahouses at Lobuche (4,940 m).",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 4930
      },
      {
        day: 9,
        title: "Trek from Lobuche to Everest Base Camp (5,364 m) and return to Gorak Shep (5,185 m), approx. 7 hours.",
        description: "Trek along the lateral moraine of the Khumbu Glacier to Gorak Shep. Continue onwards to the legendary Everest Base Camp itself (5,364 m). Stand next to the iconic base camp rock surrounded by icefalls and towering peaks, then return to Gorak Shep for the night.",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 5185
      },
      {
        day: 10,
        title: "Hike to Kala Patthar (5,555 m), return to Gorak Shep, trek down to Pheriche (4,250 m), approx. 5 hours.",
        description: "Early morning hike to Kala Patthar (5,555 m) for the finest golden sunrise view over Mount Everest, Lhotse, and Nuptse. Descend to Gorak Shep for breakfast, then trek downhill to the windy valley of Pheriche.",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 4250
      },
      {
        day: 11,
        title: "Trek from Pheriche to Namche Bazaar (3,440 m), approx. 8 hours.",
        description: "Retrace the trail back through beautiful valleys, stone houses, and chortens. Cross suspension bridges high above the Dudh Koshi River, then descend back through Namche Bazaar, reflecting on your mountain achievement.",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 3440
      },
      {
        day: 12,
        title: "Trek from Namche Bazaar to Lukla (2,850 m), approx. 4 hours.",
        description: "Final day of trekking. Walk mostly downhill along the river valley, passing through lush forests and local villages. Re-enter Lukla, where you can relax, celebrate with your guide and porter team, and look back at the completing of your trek.",
        accommodation: "Hotel/Lodge/ Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 2850
      },
      {
        day: 13,
        title: "Fly back to Kathmandu or Manthali from Lukla, drive to Kathmandu.",
        description: "Enjoy a final warm breakfast in Lukla before boarding your morning flight to Kathmandu (or Manthali, followed by the drive to Kathmandu). Once back in the capital, you will be transferred to your hotel to rest, relax, and buy souvenirs.",
        accommodation: "Thamel Boutique Hotel",
        meals: "Breakfast",
        altitude: 1300
      },
      {
        day: 14,
        title: "Final departure to the international airport",
        description: "Your Himalayan adventure concludes today. Coordinate with your guide for airport transfers according to your flight departure time. Safe journey and Namaste!",
        accommodation: "None",
        meals: "Breakfast",
        altitude: 1300
      }
    ];

    const ebcRegionId = regionMap["Everest Treks"];
    if (!ebcRegionId) {
      throw new Error("Everest Region ID not found during seeding");
    }

    const createdEbcTrek = await payload.create({
      collection: 'treks',
      data: {
        title: "Everest Base Camp Trek - 14 Days",
        slug: "everest-base-camp-trek-14",
        region: ebcRegionId,
        duration: 14,
        price: 1399,
        discountedPrice: 1199,
        difficulty: "hard",
        maxAltitude: 5555,
        groupSize: 12,
        startPoint: "Kathmandu",
        endPoint: "Kathmandu",
        highlights: ebcHighlights,
        inclusions: ebcInclusions,
        exclusions: ebcExclusions,
        isBestSeller: true,
        overview: makeLexicalParagraphs(ebcOverviewText) as any,
        dayByDayItinerary: ebcItinerary
      }
    });

    console.log("[Seeder] Seeded EBC Trek document successfully.");

    // --- PHASE 4.5: SEED MANASLU TREK ---
    console.log("[Seeder] Seeding Manaslu Circuit Trek - 16 Days...");

    const manasluOverviewText = `The 15-day Manaslu Circuit Trek circles Mount Manaslu (8,163 m), leading you through remote valleys, dramatic gorges, and culturally rich Tibetan-influenced villages. Along the journey, you cross the demanding Larkya La Pass (5,106 m), where the landscape transforms from green lowlands into stark alpine wilderness, offering one of Nepal’s most beautiful and less-traveled trekking experiences.

Manaslu Circuit Trek Overview
The Manaslu Circuit Trek is a remote and adventurous journey that circles Mount Manaslu (8,163 m), offering a peaceful alternative to Nepal’s busier trekking routes. Located in north-central Nepal near the Tibetan border, the trail passes through the protected Manaslu Conservation Area, where nature and culture blend beautifully.

The journey typically begins with a drive from Kathmandu to Soti Khola via Arughat along the Trishuli River. From here, the trail follows the Budhi Gandaki River, entering deep valleys filled with suspension bridges, waterfalls, terraced hills, and forested landscapes.

Soti Khola (730 m) marks the starting point of the trek, where the transition from road travel to remote mountain trails begins. The route continues to Machha Khola (890 m), passing rocky paths, waterfalls, and small Gurung settlements like Lububesi and Khursani, offering early cultural encounters.

Further along, the trail crosses rivers via suspension bridges to reach Doban (1,070 m), a confluence area surrounded by natural beauty. A stop at Tatopani adds the refreshing experience of natural hot springs before the ascent continues toward Jagat, a key checkpoint village known for its Tibetan-style architecture and terraced fields.

From Jagat, the trail leads to Philim (1,570 m), opening into a wider valley with Gurung communities. The journey then narrows again toward Deng (1,860 m), where deep gorges, bamboo forests, and river crossings create a more isolated and rugged trekking feel.

As you ascend to Ghap (2,250 m) and Namrung (2,660 m), dense pine, oak, and rhododendron forests dominate the landscape. This section introduces stronger Buddhist influences through mani walls, chortens, and prayer flags. Namrung also offers the first clear views of the surrounding Himalayan peaks.

Continuing through Lihi, you reach Lho (3,180 m), a culturally rich village with monasteries, traditional homes, and stunning views of Simnang Himal (6,251 m). The trail then passes Shyala before arriving at Samagaun (3,530 m), one of the most important acclimatization stops, where trekkers can explore Birendra Lake or hike to Manaslu Base Camp.

The route then moves toward Samdo (3,875 m), a village influenced by ancient Nepal–Tibet trade and yak caravan culture. Surrounded by alpine terrain and juniper forests, Samdo lies close to the Tibetan border and reflects a unique cross-cultural heritage.

From here, the trail gradually becomes more rugged as it approaches Dharamsala (4,480 m), also known as Larkya La Phedi. This is the final stop before crossing the high pass, where the environment becomes stark, remote, and dramatic.

The highlight of the trek is crossing the Larkya La Pass (5,106 m), the highest and most challenging point of the journey. From the summit, trekkers are rewarded with sweeping views of Himlung Himal, Cheo Himal, Kang Guru, and Annapurna II.

After a steep descent, the trail leads to Bhimtang (3,720 m), followed by a gradual return through greener valleys. Passing Gho (2,550 m), Tilje, and Thonje, the landscape transitions into fertile farmland and traditional villages.

The trek concludes at Dharapani (1,910 m), from where a drive along the Marsyangdi River takes you to Besisahar (760 m), and onward to Kathmandu.

Overall, the Manaslu Circuit Trek offers a complete Himalayan experience—combining remote wilderness, rich Tibetan-influenced culture, and one of the most scenic high-altitude trekking routes in Nepal.

Note
Nature Heaven Trekking kindly requests all clients to arrive in Kathmandu at least one weekday before the start of the Manaslu Circuit Trek. This is necessary as we require a full working day to arrange the special Manaslu trekking permit, which can only be processed with your original passport and valid Nepal visa.
The trek package includes travel by public bus; however, a private jeep can be arranged upon request for added comfort at an additional cost.

Online Trip Briefing
The online trip briefing is a pre-trek information session conducted via WhatsApp video call to address all your questions before the journey begins. After your booking is confirmed and we receive your documents (a passport copy is sufficient at first), we will send you the briefing schedule through email.
During this session, we will review the complete itinerary, provide a detailed packing list, and explain what to expect during the trek. The goal is to ensure you are fully informed, confident, and well prepared for the adventure ahead.
For smooth communication, please add us on WhatsApp at +977-9851218358 or share your contact number with us.`;

    const manasluHighlights = [
      { highlight: "Cross the iconic Larkya La Pass (5,106m / 16,751ft), the highest and most challenging point of the trek" },
      { highlight: "Trek along the dramatic Budhi Gandaki Gorge, featuring suspension bridges and cliff-hugging trails" },
      { highlight: "Explore the remote and less-visited Manaslu Conservation Area" },
      { highlight: "Visit ancient Buddhist monasteries such as Ribung Gompa (Lho) and Pungyen Gompa (Sama Gaun), set against stunning glacier views" },
      { highlight: "Enjoy panoramic Himalayan vistas including Mount Manaslu (8,163m), Himalchuli, Ngadi Chuli, and the Annapurna ranges" },
      { highlight: "Acclimatize at Samagaun, the main village beneath the north face of Manaslu" },
      { highlight: "Take a side hike to Manaslu Base Camp (4,800m / 15,748ft) and Birendra Lake for breathtaking glacier and icefall scenery" },
      { highlight: "Discover Samdo village, shaped by historic Nepal–Tibet trade routes and traditional yak caravan culture" },
      { highlight: "Experience rich Tibetan Buddhist heritage through mani walls, chortens, prayer wheels, and prayer flags" },
      { highlight: "Witness diverse biodiversity, from dense forests and alpine valleys to glacier landscapes" },
      { highlight: "Immerse in authentic Nubri village culture and Tibetan-influenced mountain lifestyles" },
      { highlight: "Spot rare Himalayan wildlife such as the monal pheasant, blue sheep, and musk deer" },
      { highlight: "Walk through changing vegetation zones, from rhododendron and pine forests to juniper and alpine moss" },
      { highlight: "Enjoy a quieter, less-crowded trekking route offering a true remote Himalayan experience" }
    ];

    const manasluInclusions = [
      { inclusion: "Public bus transportation from Kathmandu to Arughat and onward to Soti Khola (trek starting point), and from Dharapani back to Kathmandu after the trek" },
      { inclusion: "Private airport transfers between Kathmandu Airport and your hotel" },
      { inclusion: "Total 15 nights accommodation during the trek" },
      { inclusion: "7 nights in rooms with private attached bathrooms at Soti Khola, Namrung, Lho, Samagaun (2 nights), Bhimtang, and Gho" },
      { inclusion: "8 nights in standard twin-sharing rooms at Machha Khola, Doban, Philim, Deng, Ghap, Samdo, Dharamsala, and Dharapani" },
      { inclusion: "Full-board meals throughout the trek (16 breakfasts, 16 lunches, and 15 dinners), with one main course per meal" },
      { inclusion: "Daily seasonal fresh fruits" },
      { inclusion: "Water purification tablets for safe drinking water" },
      { inclusion: "Government-licensed, English-speaking trekking guide from Nature Heaven Trekking" },
      { inclusion: "One assistant guide for groups of 12 or more trekkers" },
      { inclusion: "Porter support (one porter for every two trekkers; luggage limit: 9 kg per trekker)" },
      { inclusion: "Coverage of guide and porter wages, insurance, accommodation, meals, transport, and equipment" },
      { inclusion: "Manaslu Restricted Area Permit, Manaslu Conservation Area Permit (MCAP), Annapurna Conservation Area Permit (ACAP)" },
      { inclusion: "All applicable government and local taxes" },
      { inclusion: "Emergency rescue coordination in case of serious health issues (as per travel insurance coverage)" },
      { inclusion: "First aid kit including an oximeter for monitoring oxygen levels at high altitude" },
      { inclusion: "Company T-shirt and cap as souvenirs" },
      { inclusion: "Trek completion certificate after successful finish" },
      { inclusion: "Farewell dinner in Kathmandu" },
      { inclusion: "Sleeping bag, down jacket, and duffle bag provided (shared basis) if needed" },
      { inclusion: "Free luggage storage at Nature Heaven Trekking office during the trek" }
    ];

    const manasluExclusions = [
      { exclusion: "International airfare to and from Nepal is not included" },
      { exclusion: "Hotel stays in Kathmandu before and after the trek are not included" },
      { exclusion: "Extra nights in Kathmandu due to early arrival, late departure, or early return from the trek are also excluded" },
      { exclusion: "All meals in Kathmandu before and after the trek are not included" },
      { exclusion: "Tips for guides and porters are not included and are expected at your discretion" },
      { exclusion: "Nepal entry visa fee (payable in cash upon arrival at Tribhuvan International Airport)" },
      { exclusion: "Mandatory travel insurance must cover high-altitude trekking, emergency helicopter rescue, evacuation, and medical expenses" },
      { exclusion: "Personal costs such as snacks, bottled or boiled water, hot and cold drinks, hot showers, alcohol, Wi-Fi, phone calls, battery charging, shopping, and extra porter services" },
      { exclusion: "Personal trekking clothing and equipment" },
      { exclusion: "Excess baggage charges beyond the 9 kg per trekker limit" },
      { exclusion: "Any additional costs caused by unforeseen circumstances such as landslides, bad weather, flight delays, itinerary changes, illness, government policy changes, strikes, or other situations beyond control" }
    ];

    const manasluItinerary = [
      {
        day: 1,
        title: "Arrival and welcome at Tribhuvan International Airport, Kathmandu (1300m/4260ft).",
        description: "Welcome to Nepal! Upon your arrival at the airport, after finishing passport, immigration, and visa procedures, our team will greet you outside the terminal holding a sign with your name. We will then take you to your hotel for some rest. In the evening, join us for a welcome dinner where you will meet your guide and receive an introduction to the trek along with a briefing.",
        accommodation: "Thamel Boutique Hotel",
        meals: "Dinner",
        altitude: 1300
      },
      {
        day: 2,
        title: "Sightseeing and preparation day in Kathmandu",
        description: "On this day, you will explore the rich culture and heritage of Kathmandu before starting your trek. Your guide will take you to some of the city’s most famous sites, such as the ancient Durbar Square, the sacred Pashupatinath Temple, and the peaceful Boudhanath Stupa. In the afternoon, prepare your gear and finalize permits.",
        accommodation: "Thamel Boutique Hotel",
        meals: "Breakfast",
        altitude: 1300
      },
      {
        day: 3,
        title: "Drive from Kathmandu to Machha Khol (890 m/2,965 ft)",
        description: "After breakfast at your hotel in Kathmandu, you will begin your road journey to Machha Khol. The drive takes about 7 to 8 hours. Leaving the busy city behind, you will travel through beautiful countryside with terraced fields, small villages, and stunning mountain views. Check into the guesthouse upon arrival.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 890
      },
      {
        day: 4,
        title: "Trek from Machha Khola (890m) to Jagat (1340m)",
        description: "Starting early from Machha Khola, follow the Budhi Gandaki River upstream. Climb through lush forests of rhododendrons, oaks, and pines. Pass small Gurung and Tibetan settlements. Cross suspension bridges to reach Jagat checkpoint village.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 1340
      },
      {
        day: 5,
        title: "Trek from Jagat (1340m) to Deng (1860m)",
        description: "Trek along the river valley. The trail gradually ascends through pine, oak, and rhododendron forests, crossing several suspension bridges over rushing streams to arrive in Deng, a quiet settlement with Tibetan-style stone houses.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 1860
      },
      {
        day: 6,
        title: "Trek from Deng (1860m) to Namrung (2630m)",
        description: "Continue trekking uphill through dense forests of rhododendron and bamboo. The trail steadily climbs, offering beautiful views of the surrounding hills and the Budhi Gandaki River. Reach Namrung, which features a strong Buddhist influence.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 2630
      },
      {
        day: 7,
        title: "Trek from Namrung (2,630m) to Lho (3,180m) / Shala (3,460m)",
        description: "Trek higher through alpine forests. Climb steadily with spectacular views of Simnang Himal and Mount Manaslu. Arrive in Lho, a culturally rich village with a monastery overlooking the valley.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 3180
      },
      {
        day: 8,
        title: "Trek to Pung Gyen Gompa (4,800 m/15,748 ft) and walk to Samagaun (3,520 m/11,548 ft)",
        description: "Start early and climb steeply to Pung Gyen Gompa monastery at 4,800 m, set against glaciers and peak walls. Enjoy the spiritual serenity, then walk down to Samagaun, the most important settlement in the valley.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 3520
      },
      {
        day: 9,
        title: "Acclimatization Day at Samagaun - Birendra Lake or Pungen Monastery or Manaslu Base Camp",
        description: "Acclimatization rest day. Hike to the green glacial waters of Birendra Lake or ascend further to Manaslu Base Camp (4,800 m) for close-up glacier views. Return to Samagaun for the night.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 3520
      },
      {
        day: 10,
        title: "Trek from Samagaon (3520m) to Samdo (3860m)",
        description: "Walk through open alpine pastures and sparse juniper woodlands. The trail crosses yak pastures and stone huts. Spot blue sheep grazing. Arrive in Samdo, a remote village close to the Tibetan border.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 3860
      },
      {
        day: 11,
        title: "Trek from Samdo (3860m) to Larkya Phedi (Dharamshala) (4480m)",
        description: "Trek gradually uphill through rocky alpine meadows. Cross streams with yaks grazing. Arrive at Dharamsala stone shelter (4,480 m), rest early, and prepare your gear for crossing the high pass tomorrow.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 4480
      },
      {
        day: 12,
        title: "Trek from Larkya Phedi (4480m) to Bimthang (3720m) via Larkya La Pass (5106m)",
        description: "Most demanding pass day. Start at 4 AM, climbing rocky and potentially snowy trails to Larkya La Pass (5,106 m). Enjoy panoramic views of Himlung Himal, Cheo, and Annapurna II, then descend steeply to Bhimtang valley.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 3720
      },
      {
        day: 13,
        title: "Trek from Bimthang (3720m) to Tiliche (2560m)",
        description: "A steady descent through pine, oak, and rhododendron forests. Walk alongside clear mountain streams. The temperature warms up as we reach the Gurung village of Tilije (2,560 m).",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 2560
      },
      {
        day: 14,
        title: "Trek to Dharapani and drive to Besisahar (760m/2,493 ft)",
        description: "Walk down through farmlands to Dharapani, the junction where the Manaslu Circuit meets the Annapurna Circuit. Board a local shared jeep and drive to Besisahar along the Marsyangdi River.",
        accommodation: "Hotel/Lodge/Tea House during the trek",
        meals: "Breakfast, Lunch, Dinner",
        altitude: 760
      },
      {
        day: 15,
        title: "Drive to Kathmandu (1,400 m/4,600 ft)",
        description: "Scenic 6-8 hour drive back to Kathmandu, passing terraced fields, hills, and river gorges. Check in to the hotel, unpack, rest, and celebrate the completion of the circle with a farewell dinner.",
        accommodation: "Thamel Boutique Hotel",
        meals: "Breakfast, Dinner",
        altitude: 1400
      },
      {
        day: 16,
        title: "Final departure to the international airport",
        description: "Enjoy breakfast at the hotel, coordinate with your guide, and transfer to Tribhuvan International Airport for your flight departure home. Safe travels!",
        accommodation: "None",
        meals: "Breakfast",
        altitude: 1300
      }
    ];

    const manasluRegionId = regionMap["Manaslu Treks"];
    if (!manasluRegionId) {
      throw new Error("Manaslu Region ID not found during seeding");
    }

    const createdManasluTrek = await payload.create({
      collection: 'treks',
      data: {
        title: "Manaslu Circuit Trek - 16 Days",
        slug: "manaslu-circuit-trek-16",
        region: manasluRegionId,
        duration: 16,
        price: 1299,
        discountedPrice: 1099,
        difficulty: "hard",
        maxAltitude: 5160,
        groupSize: 12,
        startPoint: "Kathmandu",
        endPoint: "Kathmandu",
        highlights: manasluHighlights,
        inclusions: manasluInclusions,
        exclusions: manasluExclusions,
        isBestSeller: true,
        overview: makeLexicalParagraphs(manasluOverviewText) as any,
        dayByDayItinerary: manasluItinerary
      }
    });

    console.log("[Seeder] Seeded Manaslu Trek document successfully.");

    // --- PHASE 5: SEED FAQS ---
    console.log("[Seeder] Seeding category FAQs...");

    // 1. General FAQs (for homepage)
    const generalFaqs = [
      {
        question: "What is the best time of year to trek to Everest Base Camp?",
        answer: "The absolute best seasons are Spring (March to May) and Autumn (September to November). During these months, skies are typically clear, providing magnificent mountain vistas, and weather on the trail is relatively stable.",
        category: "general",
        order: 1
      },
      {
        question: "How physically fit do I need to be for a Himalayan Trek?",
        answer: "Himalayan treks like EBC and Manaslu require a good level of cardiovascular fitness. You should be comfortable walking 5-7 hours daily on steep, rocky uphill and downhill trails. Cardio exercises and leg conditioning starting 2 months prior are advised.",
        category: "general",
        order: 2
      },
      {
        question: "Do I need a guide for trekking in Nepal?",
        answer: "Yes, a registered professional guide is mandatory for foreign trekkers in national parks and conservation areas in Nepal. This policy is set by the government to ensure security and safety against altitude sickness and lost navigation.",
        category: "general",
        order: 3
      },
      {
        question: "Is travel insurance mandatory for high-altitude trekking?",
        answer: "Yes, comprehensive travel insurance is mandatory. Your policy must explicitly cover high-altitude trekking up to 6,000 meters and helicopter emergency evacuation rescue, as road transport is not available on the trails.",
        category: "general",
        order: 4
      }
    ];

    for (const faq of generalFaqs) {
      await payload.create({
        collection: 'faqs',
        data: {
          question: faq.question,
          answer: makeLexicalParagraphs(faq.answer) as any,
          category: faq.category,
          order: faq.order
        }
      });
    }

    // 2. EBC Trek-specific FAQs (categorized across various groups)
    const ebcFaqs = [
      // Basic Info
      {
        question: "What are the major attractions of the EBC?",
        answer: "The major attractions include Everest Base Camp itself, Kala Patthar (5,555 m) for spectacular sunrise views, Namche Bazaar (the Sherpa capital), Tengboche Monastery, and walking through the UNESCO-listed Sagarmatha National Park.",
        category: "general"
      },
      {
        question: "How crowded is the Everest Base Camp trail?",
        answer: "During peak seasons (Spring and Autumn), the trail can be quite busy, and Namche Bazaar and other teahouses are full. If you prefer quieter trails, consider trekking in the shoulder months or winter.",
        category: "general"
      },
      {
        question: "Is it possible to complete the EBC within a short duration?",
        answer: "Yes, you can do shorter itineraries like 10 or 12 days, or return by helicopter to save days, but adequate acclimatization is highly recommended to avoid altitude sickness.",
        category: "general"
      },
      {
        question: "When can I see Mt. Everest for the first time during the EBC?",
        answer: "You will catch your first view of Mt. Everest on Day 3 along the trail to Namche Bazaar, and a better panoramic view from the Everest View Hotel on Day 4.",
        category: "general"
      },
      // Physical Readiness
      {
        question: "What are the age restrictions for EBC Trek?",
        answer: "There is no strict age limit, but due to the trek's physical demands, it's generally recommended for individuals aged 16-70. However, with good health and fitness, older trekkers can complete the trek successfully.",
        category: "prep_fitness"
      },
      {
        question: "Is EBC challenging for beginners?",
        answer: "It is challenging because of the high altitude, but physically fit beginners with no previous high-altitude experience can complete it by pacing themselves and staying hydrated.",
        category: "prep_fitness"
      },
      // Entry Permits
      {
        question: "What permits do I need for the Everest Base Camp Trek?",
        answer: "To trek to Everest Base Camp, you need two main permits: the Khumbu Pasang Lhamu Rural Municipality Permit (NPR 3,000) and the Sagarmatha National Park Entry Permit (NPR 3,000 + 13% VAT). These permits are processed and fully included in your Nature Heaven package.",
        category: "permits"
      },
      // Assurance and Travel Permit
      {
        question: "Do I need travel insurance for the EBC Trek?",
        answer: "Yes, comprehensive travel insurance is mandatory. Your policy must cover high-altitude trekking up to 6,000 meters and helicopter emergency rescue/evacuation, as road transport is not available in the Khumbu region.",
        category: "insurance_visa"
      },
      // Where You Stay & What's Included
      {
        question: "What is the accommodation like on the EBC Trek?",
        answer: "Accommodation is in local teahouses. Rooms are twin-sharing with basic wooden beds, mattresses, and blankets. Attached bathrooms are available in lower villages like Lukla and Namche Bazaar, but as you climb higher, bathrooms become shared and basic.",
        category: "accommodation_facilities"
      },
      // Meals and Refreshments
      {
        question: "What kind of food is served on the EBC Trek?",
        answer: "Teahouses serve warm, high-carbohydrate meals. Dal Bhat (rice, lentils, vegetables) is the staple and highly recommended. Other options include noodles, pasta, momos, soups, oatmeal, and pancakes. We recommend a vegetarian diet at high altitudes.",
        category: "food_drinks"
      },
      // Weather Patterns & Seasonal Changes
      {
        question: "When is the best time to trek to EBC?",
        answer: "The best times are Spring (March to May) and Autumn (September to November). These months offer stable weather, clear mornings with excellent mountain visibility, and comfortable trekking temperatures.",
        category: "weather_seasons"
      },
      // Health Protection & Safety
      {
        question: "How do you manage altitude adaptation and safety?",
        answer: "Our 14-day itinerary includes two dedicated acclimatization rest days in Namche Bazaar (3,440 m) and Dingboche (4,360 m). Our guides monitor oxygen saturation levels daily, carry a first-aid kit, and coordinate emergency helicopter evacuation if necessary.",
        category: "health_safety"
      },
      // Equipment & Packing List
      {
        question: "What gear is essential for EBC?",
        answer: "Essential gear includes sturdy waterproof hiking boots, layered clothing (moisture-wicking baselayers, fleece, down jacket), a warm sleeping bag rated for -15°C, UV sunglasses, trekking poles, and water purification tablets.",
        category: "packing_gear"
      },
      // Trip Booking & Payment Policy
      {
        question: "Can I customize my EBC itinerary?",
        answer: "Yes, Nature Heaven Treks offers custom private itineraries. You can add extra acclimatization days, include Gokyo Lakes, or opt for helicopter returns.",
        category: "booking_payments"
      },
      // Flights & Ground Transport
      {
        question: "How do Lukla flights operate?",
        answer: "During peak seasons, Lukla flights are often operated from Manthali Airport (Ramechhap) to avoid air traffic in Kathmandu. This requires a 5-hour night drive from Kathmandu. In the off-season, flights operate directly from Kathmandu. All flights are weather-dependent.",
        category: "transportation_flights"
      }
    ];

    for (const faq of ebcFaqs) {
      await payload.create({
        collection: 'faqs',
        data: {
          question: faq.question,
          answer: makeLexicalParagraphs(faq.answer) as any,
          category: faq.category,
          treks: [createdEbcTrek.id]
        }
      });
    }

    // 3. Manaslu Trek-specific FAQs (36 FAQs across 12 categories)
    const manasluFaqs = [
      // --- Basic Information ---
      { question: "Where is the Manaslu Circuit located?", answer: "The Manaslu Circuit lies in the western Himalayan region of Nepal, close to the Tibet (China) border. The trail encircles Mount Manaslu, the world's 8th highest peak, and passes through remote valleys, traditional settlements, and the protected Manaslu Conservation Area.", category: "general", order: 1 },
      { question: "How long does the Manaslu Circuit Trek take?", answer: "The Manaslu Circuit Trek typically takes 16 days to complete, including travel between Kathmandu and the trailhead, acclimatization days, and the crossing of Larke La Pass.", category: "general", order: 2 },
      { question: "What are the main highlights of the Manaslu Circuit Trek?", answer: "Key highlights include: stunning views of Mount Manaslu (8,163 m), Ganesh Himal, Annapurna II, and surrounding peaks. Crossing the challenging Larke La Pass (5,160 m), one of the highest trekking passes in Nepal. Traditional Tibetan-influenced villages with monasteries, mani walls, and prayer flags. Diverse landscapes ranging from subtropical forests and terraced fields to alpine meadows and glacial terrain.", category: "general", order: 3 },
      { question: "Is the Manaslu Circuit Trek suitable for all levels of trekkers?", answer: "It is considered moderately to highly challenging due to long walking days, high altitude, and remote terrain. However, with good fitness, proper preparation, and steady pacing, most determined trekkers can complete it safely.", category: "general", order: 4 },
      { question: "What makes the Manaslu Circuit Trek unique compared to other treks in Nepal?", answer: "Its main uniqueness is its remoteness and low crowd levels. Compared to more commercial routes like the Annapurna Circuit, it offers a quieter, more authentic Himalayan experience with fewer trekkers and stronger cultural immersion.", category: "general", order: 5 },
      { question: "Is the Manaslu Circuit Trek available as a private trip?", answer: "Yes, the Manaslu Circuit Trek is available as a fully private trip, allowing you to trek with your own group and maintain your preferred pace and schedule.", category: "general", order: 6 },
      { question: "Can I customize the Manaslu Circuit Trek itinerary?", answer: "Yes, the itinerary can be customized based on your travel dates, fitness level, acclimatization needs, and additional side trips such as the Tsum Valley extension.", category: "general", order: 7 },

      // --- Physical Readiness & Training ---
      { question: "How fit do I need to be for the Manaslu Circuit Trek?", answer: "The Manaslu Circuit requires a moderate to good level of fitness. You should be comfortable walking 5–8 hours per day on uneven mountain trails, including long ascents and descents at high altitude. Good endurance and stamina matter more than technical skills.", category: "prep_fitness", order: 1 },
      { question: "Can beginners undertake the Manaslu Circuit Trek?", answer: "Yes, beginners can complete the trek if they are well-prepared physically and mentally. While prior trekking experience is helpful, it is not mandatory. Proper acclimatization, a steady walking pace, and guided support make it achievable for first-time high-altitude trekkers.", category: "prep_fitness", order: 2 },
      { question: "What kind of physical preparation is recommended for this trek?", answer: "Recommended preparation includes: cardiovascular training (running, cycling, swimming, or brisk walking), strength training (focus on legs, core, and overall endurance), hiking practice (long walks on uneven terrain with a backpack), stair or hill training to simulate trekking conditions, and consistency for at least 4–8 weeks before the trek.", category: "prep_fitness", order: 3 },

      // --- Entry Permit ---
      { question: "What permits are required for the Manaslu Circuit Trek?", answer: "To trek the Manaslu Circuit, you need three permits: 1. Manaslu Restricted Area Permit (RAP), 2. Manaslu Conservation Area Permit (MCAP), and 3. Annapurna Conservation Area Permit (ACAP). These permits regulate entry into protected and restricted regions and support conservation and local management.", category: "permits", order: 1 },
      { question: "Are the necessary permits included in the trekking package?", answer: "Yes, all required permits are fully included in the trekking package, so you do not need to arrange them separately.", category: "permits", order: 2 },
      { question: "Where can I obtain the permits for the Manaslu Circuit Trek?", answer: "Permits can be issued in Kathmandu through the Nepal Tourism Board and related government offices. However, in this package, all permits are arranged and processed on your behalf before the trek begins.", category: "permits", order: 3 },

      // --- Assurance and Travel Permit ---
      { question: "Is travel insurance necessary for the Manaslu Circuit Trek?", answer: "Yes, travel insurance is mandatory for the Manaslu Circuit. It is required due to the remote terrain, high altitude, and limited medical facilities along the route.", category: "insurance_visa", order: 1 },
      { question: "What should my insurance cover for this trek?", answer: "Your insurance policy must include: emergency medical treatment and hospitalization, high-altitude trekking coverage (up to at least 5,000–5,200 meters), emergency helicopter evacuation from remote areas, treatment and evacuation costs related to altitude sickness or injury, and coverage for delays or cancellations due to weather or landslides. Confirm directly with your insurance provider that helicopter evacuation at high altitude is included.", category: "insurance_visa", order: 2 },
      { question: "Do I need a visa for trekking in Nepal, and how can I obtain one?", answer: "Yes, a tourist visa is required for all foreign nationals except Indian citizens. You can obtain it through visa on arrival at Tribhuvan International Airport in Kathmandu, or apply in advance through a Nepali embassy. Requirements include a passport valid for at least 6 months, a passport-size photo, and visa fee payment. For a Manaslu trek, a 30-day visa (USD 50) is generally recommended.", category: "insurance_visa", order: 3 },

      // --- Himalayan Guide & Support Team ---
      { question: "Is it necessary to have a guide for the Manaslu Circuit Trek?", answer: "Yes, a licensed guide is compulsory for the Manaslu Circuit because it falls under a restricted trekking region where solo trekking is not permitted.", category: "guides_staff", order: 1 },
      { question: "What roles do guides and porters play during the trek?", answer: "Guides are responsible for leading the trekking route safely, managing permits and logistics, monitoring altitude and health, and communicating with locals. Porters help by carrying your main luggage and reducing your physical load so you can focus on trekking comfortably.", category: "guides_staff", order: 2 },
      { question: "Can I trek the Manaslu Circuit independently without a guide?", answer: "No, independent trekking is not allowed on the Manaslu Circuit. Regulations for restricted areas require all trekkers to be accompanied by a registered guide and organized through a licensed trekking agency.", category: "guides_staff", order: 3 },

      // --- Where You Stay & What's Included ---
      { question: "What type of accommodation is available during the Manaslu Circuit Trek?", answer: "During the Manaslu Circuit, accommodation is mainly in tea houses and basic mountain lodges. Rooms are simple, usually twin-sharing, with basic bedding. In a few lower-altitude villages, you may find limited rooms with attached bathrooms, but this becomes rare as you go higher.", category: "accommodation_facilities", order: 1 },
      { question: "Are teahouses or lodges equipped with modern facilities like electricity and hot showers?", answer: "Yes, basic facilities such as electricity, hot showers, and Wi-Fi are available in most lodges along the route. However, these services are not always reliable and usually come at an extra cost, especially at higher altitudes where resources are limited.", category: "accommodation_facilities", order: 2 },
      { question: "Will I have access to Wi-Fi or charging points along the trek?", answer: "Wi-Fi and charging facilities are available in many teahouses, particularly in lower and mid-altitude villages. However, connections can be slow, unstable, and weather-dependent. Charging electronic devices also usually requires an additional fee, and availability becomes more limited as you move higher on the trail.", category: "accommodation_facilities", order: 3 },

      // --- Meals and Refreshments ---
      { question: "What kind of meals are provided during the Manaslu Circuit Trek?", answer: "During the Manaslu Circuit, we provide full-board meals (breakfast, lunch, and dinner) throughout the trek. Meals are freshly prepared at teahouses and include a mix of local and basic international dishes such as dal bhat, noodles, soups, Tibetan bread, fried rice, and simple sandwiches.", category: "food_drinks", order: 1 },
      { question: "Are there vegetarian or vegan food options available?", answer: "Yes, vegetarian and vegan meal options are widely available along the trekking route. Most teahouses can prepare meals according to your dietary preference, especially if informed in advance.", category: "food_drinks", order: 2 },
      { question: "Is safe drinking water available along the trek, or should I bring purification tablets?", answer: "Safe drinking water is available in teahouses as bottled or boiled water, but it must be purchased. To stay safe and reduce costs, it is strongly recommended to carry water purification tablets or a portable filter, as natural water sources along the trail are not safe for direct drinking.", category: "food_drinks", order: 3 },

      // --- Weather Patterns & Seasonal Changes ---
      { question: "What is the best time of year to do the Manaslu Circuit Trek?", answer: "The best seasons for the Manaslu Circuit are spring (March–May) and autumn (September–November). These periods offer stable weather, clear mountain views, and comfortable daytime temperatures, making trekking and crossing Larke La Pass safer and more enjoyable.", category: "weather_seasons", order: 1 },
      { question: "How does the weather affect the trekking experience on the Manaslu Circuit?", answer: "Weather plays a major role: Spring & Autumn bring clear skies, good visibility, and ideal trekking conditions. Monsoon (June–August) brings heavy rainfall, slippery trails, and landslide risk. Winter (December–February) brings very cold temperatures and heavy snowfall at higher altitudes. Each season changes trail conditions and comfort levels significantly.", category: "weather_seasons", order: 2 },
      { question: "Is it safe to trek during the monsoon or winter seasons?", answer: "Yes, trekking is possible in both monsoon and winter, but it is more challenging. Monsoon brings rain, leeches, and slippery paths, while winter brings extreme cold and snow-covered passes. These seasons are generally suitable only for well-prepared and experienced trekkers seeking a more remote and less crowded experience.", category: "weather_seasons", order: 3 },

      // --- Health Protection & Safety ---
      { question: "What health risks should I be aware of during the Manaslu Circuit Trek?", answer: "On the Manaslu Circuit, the main health risks include altitude sickness (AMS), dehydration, fatigue, and minor injuries such as sprains or blisters. Because the trek involves long walking days and high elevations, proper acclimatization, hydration, and steady pacing are essential for safety.", category: "health_safety", order: 1 },
      { question: "Is altitude sickness a concern on the Manaslu Circuit?", answer: "Yes, altitude sickness is a significant concern because the trek crosses elevations above 5,000 meters at Larke La Pass. To reduce the chances of AMS: ascend gradually with proper acclimatization days, walk at a slow and steady pace, stay well hydrated, and avoid overexertion and alcohol. Listening to your body is key to a safe trekking experience.", category: "health_safety", order: 2 },
      { question: "What emergency procedures are in place during the trek?", answer: "Your safety is supported by trained guides certified in first aid and emergency response. In case of serious illness or injury: immediate assessment by the guide, first aid and stabilization on the trail, coordination with the Kathmandu team and your insurance provider, and emergency helicopter evacuation if required and weather permits. All emergency actions are taken in coordination with your travel insurance coverage and local rescue services.", category: "health_safety", order: 3 },

      // --- Equipment & Packing List ---
      { question: "What essential items should I pack for the Manaslu Circuit Trek?", answer: "Essential packing items include sturdy trekking boots, layered warm clothing, a waterproof jacket, a sleeping bag, water purification tablets or filter, sunscreen, sunglasses, and a basic first-aid kit. A headlamp, reusable water bottle, and personal toiletries are also highly recommended for comfort and safety.", category: "packing_gear", order: 1 },
      { question: "Is a sleeping bag necessary for this trek?", answer: "Yes, a sleeping bag is strongly recommended. Although teahouses provide basic bedding and blankets, temperatures at higher elevations can drop significantly. A sleeping bag rated for sub-zero temperatures (-10°C to -15°C or lower) ensures better warmth and hygiene throughout the trek.", category: "packing_gear", order: 2 },
      { question: "Are trekking poles or other gear recommended?", answer: "Yes, trekking poles are highly recommended to support balance and reduce strain on knees, especially during long ascents and descents. Additional useful gear includes gaiters for dust or snow protection, and crampons during winter months when trails may be icy or snow-covered.", category: "packing_gear", order: 3 },

      // --- Trip Booking & Payment Policy ---
      { question: "How far in advance should I book the Manaslu Circuit Trek?", answer: "For the Manaslu Circuit, it is best to book at least one month in advance, especially during peak trekking seasons (spring and autumn). Early booking helps ensure permit processing, guide availability, and smooth logistical arrangements.", category: "booking_payments", order: 1 },
      { question: "What is the payment process for booking this trek?", answer: "To confirm your booking, a 10% advance deposit is required. The remaining balance can be paid upon arrival in Kathmandu before the trek begins. Payment methods include credit or debit card, bank transfer, Wise transfer, Western Union, or cash payment in Kathmandu. Full payment instructions are shared via email after booking confirmation.", category: "booking_payments", order: 2 },
      { question: "Are there any cancellation or refund policies for the trek?", answer: "Yes, cancellation and refund policies apply depending on the timing of cancellation and operational costs. For detailed conditions, please refer to the official terms and conditions page.", category: "booking_payments", order: 3 },

      // --- Flights & Ground Transport ---
      { question: "How do I get to the starting point of the Manaslu Circuit Trek?", answer: "To begin the Manaslu Circuit, you will travel from Kathmandu to Soti Khola, which is the usual starting point of the trek. The journey is done by road and typically takes several hours through scenic hills, rivers, and rural settlements.", category: "transportation_flights", order: 1 },
      { question: "Are domestic flights required to reach the starting point of the trek?", answer: "No, domestic flights are not required for this trek. The entire journey to the trailhead is completed by road transport.", category: "transportation_flights", order: 2 },
      { question: "What transportation options are available after completing the trek?", answer: "After finishing the trek at Dharapani, you will travel by road back to Kathmandu. The usual route is: Dharapani → Besisahar (local jeep or bus), then Besisahar → Kathmandu (bus or shared/private vehicle). Private jeep options are also available at an additional cost for more comfort and faster travel.", category: "transportation_flights", order: 3 }
    ];

    for (const faq of manasluFaqs) {
      await payload.create({
        collection: 'faqs',
        data: {
          question: faq.question,
          answer: makeLexicalParagraphs(faq.answer) as any,
          category: faq.category as any,
          order: (faq as any).order || 0,
          treks: [createdManasluTrek.id]
        }
      });
    }

    // --- PHASE 6: UPDATE SITE SETTINGS ---
    console.log("[Seeder] Configuring Global Site Settings...");
    const siteSettingsDocs = await payload.find({ collection: 'siteSettings', limit: 1 });
    const bestsellerIds = [createdEbcTrek.id, createdManasluTrek.id];

    const siteSettingsData = {
      siteName: "Nature Heaven Trekking & Expedition",
      heroHeadline: "Experience the Majesty of the Himalayas",
      heroSubheadline: "Tailored trekking, peak climbing, and wilderness adventures in Nepal.",
      top5Treks: bestsellerIds,
      headerSettings: {
        expertName: "Kafle",
        expertPhone: "+977 9851218358",
        expertWhatsApp: "+977 9851218358",
        quickEmail: "info@summittrailtrekking.com"
      },
      footerSettings: {
        bioText: "Nature Heaven Trekking & Expedition is a government-licensed, premier adventure operator in Nepal. We lead customized private trekking, peak climbing, and cultural tours across the Himalayas.",
        nepalHeadOfficeAddress: "Pakjonal Marga -16, Thamel, Kathmandu, Nepal",
        nepalHeadOfficePhone: "+977-9851218358",
        ukBranchOfficeAddress: "London, United Kingdom",
        ukBranchOfficePhone: "",
        governmentRegNo: "Government Registration No. 4893. Bonded & insured through Everest Insurance. Authorized by Ministry of Tourism, Government of Nepal."
      }
    };

    if (siteSettingsDocs.totalDocs > 0) {
      await payload.update({
        collection: 'siteSettings',
        id: siteSettingsDocs.docs[0].id,
        data: siteSettingsData
      });
    } else {
      await payload.create({
        collection: 'siteSettings',
        data: siteSettingsData
      });
    }

    env[envKey] = originalNodeEnv;
    return NextResponse.json({
      success: true,
      pagesCreated: travelInfoPages.length,
      regionsCreated: Object.keys(categoryToRegion).length,
      treksCreated: 2,
      bestsellersUpdated: bestsellerIds.length,
      message: `Database successfully synchronized. Purged legacys. Seeded EBC and Manaslu detailed treks, travel guides, and FAQs.`
    });

  } catch (error: any) {
    env[envKey] = originalNodeEnv;
    console.error("[Seeder] Critical database seeding failure:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to seed trekking database entries",
      stack: error.stack
    }, { status: 500 });
  }
}
