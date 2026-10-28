# Nature Heaven: SEO / AI-SEO Master Plan (Nov 2026 – Apr 2027)

Owner: Aryan (full responsibility given by the client, 2026-10-28). Executor: Claude, one step at a time.
Goal: real Google visitors from UK / USA / Australia / Europe who send enquiries.

| Milestone | Organic clicks / month (real, GSC) |
|---|---|
| End of Nov 2026 | 100–300 |
| End of Jan 2027 | 400–700 |
| End of Apr 2027 (6 months) | 1,000–2,000 |

These are targets, not promises. New domain, few backlinks; the plan is built for a low-authority site.

## 1. Baseline (GSC, 15 Sep – 24 Oct 2026)

- Clicks before 7 Oct were mostly the client's own team clicking from 5–6 devices (confirmed by Aryan 2026-10-28).
  Ignore them. **Real baseline ≈ 1–3 clicks/day.** Ask the client to stop: it pollutes data and Google can discount it.
- From 14 Oct (after Change of Address + 371 redirects): impressions 60–70/day → ~470/day, avg position 27 → 13.
- 23–24 Oct: 13 and 26 clicks/day at position ~10 (new titles starting to show).
- Product snippets (trek price rich result) already working: 53 clicks / 317 impressions.
- Foreign demand exists but does not click yet: US 1,274 impressions / 5 clicks, UK 495 / 8, India 492, AU 281.
- Mobile CTR 1.2% vs desktop (inflated by fake clicks): fix titles/snippets for mobile.

## 2. Why this strategy (what the research showed)

- Head terms ("everest base camp trek", "best treks in nepal") are owned by big brands + OTAs. Skip for now.
- Long-tail SERPs for niche treks (Khopra Danda, Gosaikunda, Ganesh Himal, Mardi Himal, Tilicho, Tsum, Nar Phu)
  are ranked by **small Nepali agencies** (himalayanlocalguide, nepalgram, hopnepal, mosaicadventure,
  himalayanpartner) and OTA listings (TourRadar, kimkim, Expedia). Beatable with better, fresher, first-hand content.
- Google autocomplete gave 3,346 real queries (`seo-plan/autosuggest.tsv`), clustered by trek × intent in
  `seo-plan/keyword-clusters.tsv`. Every trek has the same question set: **cost, itinerary/days, best time & month,
  difficulty, guide/permit rules, vs-comparisons, packing.**
- So: **every trek page is a hub; blog posts answer its spoke questions and link back to it.** This is how a small
  site builds topical authority and how blog traffic turns into bookings.

## 3. Rules for every new post (AI-SEO + Google)

1. One primary long-tail keyword + 3–6 close variants from `keyword-clusters.tsv`. Check the post doesn't already exist
   (`seo-plan/blog-inventory.tsv`) and doesn't compete with a trek page or another post.
2. Check the top 5 results first (WebSearch). Beat them on freshness (2026/27 prices, rules), specifics
   (altitudes, walking hours, NPR/USD costs, permit fees with source), and first-hand detail from the team.
3. Answer-first: the first 2–3 sentences answer the query directly (40–60 words). AI Overviews/ChatGPT lift these.
4. H2s phrased like the real questions. A short FAQ (4–6 Qs) at the end. Tables for costs/itineraries.
5. 1,500–2,500 words; no filler; human tone (no AI clichés, no em-dash overuse).
6. Links: 1 contextual link to the matching **trek page** near the top + 1 near the end, 2–3 links to related posts,
   1–2 outbound links to authorities (Nepal Tourism Board, ACAP, Nepal Immigration) for facts.
7. Meta title ≤ 60 chars, keyword first, no brand. Meta description 140–155 chars with a reason to click.
8. Images from the site's own Cloudinary library (real trip photos), descriptive alt text, WebP/AVIF via f_auto.
9. Author = Krishna Ghimire (guide credentials in bio). Show "Last updated".
10. Publish workflow: create as **draft** in the CMS → Aryan reviews with Preview → publish only after his OK.

## 4. Step-by-step roadmap (tick off in CLAUDE.md "Progress")

### Phase A: Quick wins on what already exists (week 1, highest ROI)
- A1. CTR rewrites (title + description) for posts already on page 1–2 with ~0% CTR:
  Tilicho Lake (1,341 impr, pos 22), Nepal geography (548, pos 11), How cold is Everest (384, pos 9),
  Michael Matthews (375, pos 22), Rhododendron forest (230, pos 7.5), Nepal traditional clothing (189, pos 7),
  Tibetan culture (154, pos 7), What is Kathmandu famous for (212, pos 17). List for approval first.
- A2. Internal links blog → trek page. 10 posts have zero internal links (see inventory). Priority pairs:
  Tilicho → /trips/annapurna-circuit-trek-with-tilicho-lake; How cold is Everest → /trips/everest-base-camp-trek;
  Manaslu cost → /trips/manaslu-circuit-trek; Langtang beginner → /trips/langtang-valley-trek; etc.
- A3. Merge cannibals (with 301): best-time-to-visit-nepal + best-time-to-visit-nepal-season-by-season-guide
  (+ /travel-info/when-to-come-to-nepal). Later: private-treks / travel-insurance / regions overlaps.
- A4. Thin post culture-festivals-himalayan-trails-nepal (109 words): expand or merge + 301.
- A5. E-E-A-T: author box with Krishna Ghimire's credentials; Organization schema `sameAs` (TripAdvisor, Facebook,
  Instagram, GBP); "Last updated" on posts.
- A6. Tell client: stop self-clicking.

### Phase B: New content (6–10 posts/month, ~2/week)
**Month 1 (Nov 2026): winter + spring-planning long-tails on niche treks we sell**
| # | Working title | Primary keyword | Links to |
|---|---|---|---|
| 1 | Mardi Himal Trek Difficulty: How Hard Is It Really? | mardi himal trek difficulty | /trips/mardi-himal-trek |
| 2 | Mardi Himal Trek Cost 2026–27: Permits, Guide & Daily Budget | mardi himal trek cost | /trips/mardi-himal-trek |
| 3 | Khopra Danda Trek: Itinerary, Khayer Lake & Best Time | khopra danda trek itinerary | /trips/khopra-dada-trek |
| 4 | Gosaikunda Trek from Kathmandu: 5–7 Day Itinerary & Cost | gosaikunda trek itinerary | /trips/gosainkunda-trek |
| 5 | Poon Hill Trek for Beginners & Families | poon hill trek for beginners | /trips/poon-hill-trek |
| 6 | Annapurna Base Camp Trek in Winter (Dec–Feb) | annapurna base camp trek in winter | /trips/annapurna-base-camp-trek |
| 7 | Langtang Valley Trek in December & Winter | langtang valley trek in december | /trips/langtang-valley-trek |
| 8 | Everest Base Camp Trek in December: Weather, Crowds & Tips | everest base camp trek in december | /trips/everest-base-camp-trek |

**Month 2 (Dec): spring planning + comparisons.** EBC trek in April/May; ABC in March; Manaslu in spring;
Mardi Himal vs Poon Hill; ABC vs Mardi Himal; Langtang vs Gosaikunda; best spring treks for first-timers.
**Month 3 (Jan): cost + permits per trek.** ABC cost; Langtang cost; Upper Mustang permit ($500/10 days) & cost;
Tsum Valley permits; Nepal trek permits 2027 explained; guide-mandatory rule FAQ.
**Month 4 (Feb): difficulty + training for foreigners.** EBC training plan (12 weeks); trekking Nepal over 50;
first Himalayan trek checklist from UK/USA; altitude by trek.
**Month 5 (Mar): off-the-beaten-path cluster.** Nar Phu, Tsum, Ganesh Himal, Kanchenjunga, Makalu (cost, itinerary,
best time each).
**Month 6 (Apr): monsoon/autumn + Tibet/Bhutan.** Upper Mustang in monsoon; best treks in July/August; autumn crowds
alternatives; Bhutan/Tibet combos.

Re-plan monthly from GSC: double down on clusters that get impressions; refresh posts stuck at position 8–20.

### Phase C: Trek (money) pages
- Add per trek: cost breakdown table, permits (with fees), best time by month, difficulty, FAQ. Link to its spoke posts.
- Fix data errors seen in audit (e.g. Ama Dablam Expedition title says 30 days, duration field 36).
- Product schema already gives price snippets; keep prices current.

### Phase D: Authority (off-site; client acts, Claude prepares material)
- Google Business Profile: weekly posts, ask every past client for a review (UK/US names help).
- TripAdvisor reviews; TAAN / Nepal Tourism Board / NMA member listings with a link.
- B2B partners page → ask partner agencies for a link.
- Honest answers on Reddit (r/Nepal, r/trekking), Quora, Lonely Planet forum, linking only where it truly helps.
- 1 guest post/month on travel blogs (pitch drafted by Claude).

### Phase E: Measure
- Weekly: GSC export (Dates, Pages, Queries, Countries) → compare to baseline above.
- Monthly: one-page report for the client (clicks, top new queries, posts published, enquiries).
- GA4: confirm enquiry/booking form submissions are tracked as conversions.

## 5. Files
- `seo-plan/blog-inventory.tsv`: all 61 published posts (words, internal links, category, date).
- `seo-plan/autosuggest.tsv`: 3,346 Google autocomplete queries. Regenerate: `node scripts/.out/suggest.mjs > seo-plan/autosuggest.tsv`.
- `seo-plan/keyword-clusters.tsv`: queries grouped by trek × intent.
- `seo-proposal/title-rewrites.tsv`: the 66 titles rewritten on 2026-10-15.
- `scripts/.out/seo-audit.mjs`: full on-page audit of every sitemap URL.
