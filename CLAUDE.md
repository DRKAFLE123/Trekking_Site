# Nature Heaven Treks & Expedition: project memory

Read this first in every new chat. Update **Progress** at the end of every work session.

@AGENTS.md

## The project
- Website: https://natureheaventreks.com (Nepal private trekking agency; clients from UK, USA, Australia, Europe).
- Old site natureheaventrek.com (WordPress) is retired: 371 old URLs 301 to the new site via `.htaccess` on the old
  Hostinger hosting. Keep the old domain registered (auto-renew), keep the old GSC property, keep old hosting while
  redirects live there.
- Stack: Next.js 16 (webpack build; `next dev` uses Turbopack and breaks admin styling, so trust the live admin) +
  Payload CMS 3.90 on Postgres (Supabase). Images on Cloudinary (`lib/cloudinary-loader.ts`, `f_auto,q_auto`).
- Hosting: Hostinger, auto-deploys from `main`. Deploy = `git push origin dev && git push origin dev:main`.
  Keep `dev` and `main` identical.
- Admin: `/admin`. Blog author used on posts: Krishna Ghimire (teamMembers id 38).
- Only company phone/WhatsApp: **+977-9851218358**.

## Working rules (from Aryan; do not break)
1. **No change on the live site without Aryan's OK.** Local testing is fine. Do only what was asked; no frontend
   changes when he asked for backend, etc. Blog posts go to the CMS as drafts; publish after his approval.
2. Everything must earn revenue, ranking or traffic. No garbage pages/links/content. Old URLs are migrated or 301'd.
3. One step at a time. Show lists (titles, rewrites, merges) for approval before applying them in bulk.
4. Never enter passwords or tokens; never upload the backup anywhere (it lives on Aryan's external disk).
5. Don't merge Hostinger's automatic vulnerability PRs. URLs never change. PayPal and bank transfer must keep working.
6. Commit messages end with the Co-Authored-By line given by the harness.

## Gotchas (learned the hard way)
- `payload.update` on a **blog post that has a newer unsaved draft** flips the post to draft = it disappears from
  the live site. Check versions first (`payload.findVersions`), or restore the last published version after.
  Treks and pages have no drafts, so they're safe.
- Blog post 8 had no author and couldn't be saved; any post without an author fails validation.
- Scripts against the CMS: write TS in `scripts/.out/`, bundle with
  `npx esbuild <f>.ts --bundle --platform=node --format=esm --packages=external --banner:js="import {createRequire as __cr} from 'module';const require=__cr(import.meta.url);" --outfile=<f>.mjs`,
  run with `node --env-file=.env <f>.mjs` (DB env var is `DATABASE_URI`). Revalidation warnings in scripts are
  harmless; a deploy rebuilds pages.
- Local Lighthouse is blocked by Hostinger (403); use `scripts/.out/lcp.mjs` (`--desktop`), `axe.mjs`, `seo-audit.mjs`.
- Page titles: there is **no** brand title template. Each page writes its own; keep ≤ 60 chars, keyword first.
- Trek page H2s use the trek name with the duration stripped (`components/TrekDetailClient.tsx`, `trekName`).
- Trek highlights are edited as one textarea (`highlightsText`, virtual) and stored in the `highlights` array.

## History (what's done)
- Sep–Oct 2026, Redesign & Cleanup proposal (NPR 85k, 3 phases): backup; old URLs 301 (371/371 verified);
  29 old articles moved into the CMS; GSC Change of Address accepted 10 Oct; one-page booking; speed (mobile 86 /
  desktop 93 accepted); CSP enforced; accessibility; B2B partners page; homepage design final (no redesign);
  client progress report `reports/Nature-Heaven-Progress-Report-2026-10-11.pdf`.
- 15 Oct: admin blog preview + public URL box + sharp editor images; trek highlights one-per-line box;
  brand removed from auto titles (was doubled on 53 pages); 66 titles rewritten ≤ 60 chars; trek-name headings;
  SEO audit fixes (robots no longer blocks `/_next/`, canonicals, breadcrumb + Article schema, region H1s,
  `/contact-us/contact-us` 301). Audit after: 0 issues on titles, meta, canonical, H1, alt, broken links.
- 25 Oct: GSC review. Impressions 7x since 14 Oct (avg position 27 → 13). Pre-October clicks were the client's own
  devices (confirmed 28 Oct), so the real baseline is ~1–3 clicks/day.
- 28 Oct: client gave Aryan full SEO responsibility (6–10 posts/month). Master plan written.

## Current focus: SEO growth
Plan: **`seo-plan/SEO-MASTER-PLAN.md`** (baseline, strategy, post rules, 6-month roadmap, files).
Targets: 100–300 real Google clicks/month by end of Nov 2026, 1,000–2,000 by Apr 2027.

### Progress (tick as done; newest notes at the bottom)
- [x] Master plan, keyword clusters, blog inventory (28 Oct)
- [ ] A1 CTR rewrites for 8 page-1/2 posts (list → Aryan approves → apply)
- [ ] A2 Internal links blog → trek pages (10 posts with none first)
- [ ] A3 Merge the "best time to visit Nepal" duplicates + 301
- [ ] A4 Thin post culture-festivals (109 words): expand or merge
- [ ] A5 Author box / sameAs / "Last updated"
- [ ] A6 Client stops self-clicking
- [ ] B Month 1 posts 1–8 (see plan table)
- [ ] C Trek page upgrades (cost table, permits, best time, FAQ)
- [ ] D Off-site authority (GBP, TripAdvisor, directories, partners)
- [ ] E Weekly GSC check / monthly client report

### Open questions for the client
- Footer "Registration No. 4893"; public natureadventure603@gmail.com in footer; partner 24h reply promise;
  analytics before/after cookie consent; a real test booking + partner enquiry.
- Remaining open SEO items: 2 treks without cover image (Kathmandu Valley Heritage Tour, EBC with Heli Tour);
  some Cloudinary images still served as JPEG; /regions, /countries, /video-gallery not linked from any page.
