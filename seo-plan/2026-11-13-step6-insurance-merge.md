# Step 6: merge the travel-insurance pages (for Aryan's approval, 13 Nov 2026)

## What we have
| URL | Source | GSC 28 days | Content |
|---|---|---|---|
| /travel-info/travel-insurance | CMS "pages" doc `travel-insurance` | 378 impressions, 0 clicks, position 58 | Short: one heading, "Key Coverage Essentials" |
| /travel-insurance | **the same CMS doc**, second address (footer, menu, FAQ, packing list, visa page link here) | 11 impressions, 1 click, position 53 | Identical to the above |
| /blogs/travel-insurance-for-trekking-in-nepal (post 54) | Blog post | 19 impressions, 2 clicks, position 50 | Full guide, facts checked 28 Oct: altitude limits, helicopter rescue, exclusions, per-trek cover, 7 FAQs, author |

Google sees one short page at two addresses, each claiming to be the original, plus a third page on the same topic. About 20 insurance queries ("nepal travel insurance", "best travel insurance for trekking in nepal", "travel insurance for trekking in nepal") all sit at positions 55–60 because the signals are split three ways.

## Proposal: one page, post 54
1. **301** `/travel-insurance` → `/blogs/travel-insurance-for-trekking-in-nepal`
2. **301** `/travel-info/travel-insurance` → `/blogs/travel-insurance-for-trekking-in-nepal`
3. **Site links** point straight to post 54: footer (2 links), menu active state, FAQ page, packing list, visa page.
4. **Sitemap**: remove `/travel-insurance` and skip the `travel-insurance` doc in the /travel-info list.
5. **Posts**: 5 posts link to `/travel-insurance` (89, 85, 64, 59, 54). Change the links to post 54 (post 54 links to itself: remove that link). Post 85 currently has a draft on top; its new draft already links to post 54.
6. Post 54's Google title stays "Travel Insurance for Trekking in Nepal: Altitude & Rescue". Nothing is deleted: the CMS page doc stays, it is just no longer reachable.

Why post 54 and not the travel-info page: it is the only one with real content, an author, Article schema, FAQs and an "Updated" date. The 301s carry over the travel-info page's signals.

Alternative (not recommended): keep `/travel-insurance` and copy post 54's content into the CMS page doc. That loses the author, dates and related-trek cards, and leaves us maintaining the content in two places.

## How it is checked before going live
Local production build; head check on all 29 page types; both old URLs return 301 to post 54; post 54 returns 200; sitemap has no redirecting URLs; then deploy and slow-crawl every sitemap URL.
