# Pilot Gift Guide

Native, dependency-free static website for https://www.pilotgiftguide.com. Source repository: https://github.com/ATCblake/gift. Hosting target: Vercel, ATC team. Domain registrar: GoDaddy.

## Deployment status — October 20, 2026

Live: https://www.pilotgiftguide.com (Vercel project `atc15/pilot-gift-guide`). The apex redirects to www. GoDaddy A and www CNAME records are connected; unrelated records were preserved. HTTPS, a category, a guide, robots, sitemap and a 404 response were verified.

The daily publishing workflow is connected to a Vercel deploy hook stored in the encrypted GitHub Actions repository secret `VERCEL_DEPLOY_HOOK`. Search Console verification and sitemap submission are not configured yet.

## Current content

- 100 published launch guides across ten categories: 19 existing guides plus 81 new original articles.
- The 81 new articles contain approximately 27,500 words, with ten substantive entries per article.
- 14 sourced product entries with retailer links and observed prices dated October 20, 2026.
- 21 complete scheduled articles, one per day October 21–November 10.
- 61-slot daily editorial calendar through December 20: 21 ready articles and 40 research briefs. Briefs are not finished articles and will not publish automatically.
- Numbered editorial lists, official source links for named recommendations, related-guide links, and category hubs.

Open `editorial-calendar.html` for the readable calendar. Edit `content.json` for the original launch guides, `editorial/*.txt` for the expanded manuscripts (then run `python3 editorial/import-guides.py` to refresh `expanded-guides.json`), `posts.json` for complete scheduled articles, and `categories.json` for category hubs. Prices and product sources are in `research/products.json`.

## Run and validate

```sh
npm test
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Node 22 or newer. No package installation is required. The build renders complete HTML; JavaScript only controls the featured-guide carousel. The site is editorial: numbered rankings, written comparisons and product source links. There is no storefront, cart, checkout, product search/filter/sort or saved-gift feature.

`BUILD_DATE=2026-11-10 npm run build` previews future publication locally. Run a normal build afterward. Never deploy a build with a future date override.

The test suite verifies exactly 100 launch articles, ten entries per new article, complete original paragraphs, category membership, directory coverage, scheduling boundaries, removal of future pages, sitemap inclusion, unique titles, one H1 per page, JSON-LD validity, internal paths/assets, categories and carousel count.

## Scheduled publishing

The GitHub Actions workflow runs at **15:17 UTC daily**, October 21–December 20, 2026. That is **8:17 AM PDT** through October 31 and **7:17 AM PST** from November 1. GitHub schedules may be delayed. The script does nothing outside the date window.

A Vercel build reveals only posts with `status: ready` and `publish_date` no later than the current Los Angeles date. A missed run catches up on the next successful build. Future articles are absent from HTML, links and sitemap. The source repository is public, so scheduled article source is visible there before publication.

The Vercel deploy hook targets `main` and is stored as the GitHub Actions repository secret `VERCEL_DEPLOY_HOOK`. Never commit or print the hook URL. The workflow queues a deployment; check Vercel for successful completion. A warning identifies dates without a finished article. It does not fabricate an article or convert a brief into one.

To add a finished article: write original copy, verify claims and sources, assign a category and product IDs, add it to `posts.json` with its date and `status: ready`, update the calendar, run `npm test`, commit and push. Date-specific sales and delivery claims must be checked close to publication. Do not prewrite invented offers or shipping deadlines.

## Design

Blue-and-white editorial styling with a guide-only homepage: article previews, topic hubs and a three-slide featured-guide carousel. Ranked product lists and reference prices appear inside articles, not as homepage merchandise. All homepage content calls to action lead to guides, topic hubs or editorial information. The approved logo uses live Outfit text in blue/charcoal/blue plus an SVG tail-fin mark; the font and its OFL license are self-hosted.

The carousel uses native HTML text and product images from the articles, with previous/next, direct selection, pause and keyboard controls. Reduced-motion users start with autoplay disabled. Product imagery remains owned by its respective brand or retailer. Retailer links inside guides are labeled as sources.

## Launch sequence

1. Import this repository into Vercel. `vercel.json` specifies `npm run build` and the `dist` output directory.
2. Add `pilotgiftguide.com` and `www.pilotgiftguide.com` to the project. Set one canonical host and redirect the other. Use the exact DNS records provided by Vercel; preserve unrelated GoDaddy records, including mail records.
3. Confirm HTTPS, the home page, a guide, a category, `/robots.txt`, `/sitemap.xml` and a genuine 404 on production.
4. Verify the domain in Google Search Console using its supplied DNS record. Submit the sitemap and request indexing for the home page and strongest category guides. Verification and submission are separate from deployment and must be checked in Search Console.
5. Configure and test the deploy hook and Actions secret. Confirm a successful deployment rather than treating a queued request as publication.
6. Check weekly for stale prices, broken merchant links and poor-performing search queries. Refresh an existing guide when that better serves the query than publishing a near-duplicate page.

## SEO and distribution plan

### Site architecture

Category hubs: aviation headsets; toys and models; pilot gear and bags; student pilots; gifts by budget; milestones and occasions; pilot partners and family; books, art and history; aviation experiences; flight simulators. Each guide answers a distinct buying question and links to related guides and actual merchant listings. Pages have server-rendered content, canonical URLs, unique titles/descriptions, breadcrumbs and Article structured data. No invented ratings, review stars or hands-on tests.

Prioritize the broad buying guides and specific long-tail questions already covered. Do not create dozens of interchangeable pages for every relationship or price point. New content must add a useful comparison, an original example, a verified fact or a distinct decision aid.

Publishing daily is an operating cadence, not a ranking advantage by itself. A new domain may not gain meaningful search traffic before Christmas. Use owned channels and relevant referrals alongside SEO.

### First two weeks

- Link to the guide from a relevant ATC-owned page when the site owner approves the placement. Use a natural label such as “pilot gift guide,” with the ATC relationship visible on the destination.
- Share the useful category pages through ATC's existing email/social channels when separately authorized. Keep each message focused on the audience's actual gift problem.
- Ask several pilots or instructors for specific wishlist or compatibility input. Obtain permission to quote and credit them before publishing it; do not fabricate expert review.
- Create an original gift-checklist graphic and a useful product comparison that an aviation newsletter would have a reason to cite.

### Outreach shortlist and angle

Prepare tailored pitches for pilot-partner creators, flight-school newsletters, aviation clubs and relevant podcasts. Existing research is in the workspace's `outputs/pilot-partner-prospects.json`. Check each contact and current publication before outreach.

Potential angles: a gift checklist for non-pilot partners; a student-pilot gift list for school families; an honest headset configuration checklist; toys vs. collectible models. Offer the specific resource, not a demand for a backlink.

Draft:

> Hi [name] — we made a practical [specific guide] for [their audience]. It covers [one concrete useful detail] and links directly to the product sources. We're the team behind ATC and disclose that connection. If you're preparing a holiday resource, this may be useful: [relevant page]. Happy to send a short checklist or answer questions.

No outreach has been sent. Sending messages requires a separate user instruction. Do not buy followed links, mass-post comments, manufacture testimonials or promise reciprocal links. Clearly label sponsored placements and qualify paid links appropriately.

### Measurement

After Search Console is connected, review indexed pages, impressions, query relevance and clicks weekly. Track retailer and ATC outbound clicks only after an analytics choice and privacy update. This version has no analytics pixel, newsletter form or account collection. A ranking, attribution dashboard or conversion event should not be reported as configured until verified.

### Editorial phases

- Oct 21–Nov 10: 21 finished evergreen articles publish daily.
- Nov 11–26: research new products, add original photos/interviews and improve comparison guides. Calendar entries remain briefs until completed.
- Nov 27: verify Black Friday offers on the day.
- Nov 30: verify Cyber Monday offers on the day.
- Dec 1–13: focus on compatibility, gifting logistics and verified gift terms.
- Dec 14–20: recheck destination-specific delivery and digital options. Do not invent universal shipping cutoffs.

Google references: https://developers.google.com/search/docs/fundamentals/creating-helpful-content ; https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl ; https://developers.google.com/search/docs/essentials/spam-policies .


## Editorial imagery (October 20 refresh)

- The [editable Figma artwork board](https://www.figma.com/design/5Zbx11Z7gme1yHueje5deg/Marketing-Collateral?node-id=996-1827) contains twelve cover compositions. Exported JPEGs live in `dist/assets/editorial/`.
- `research/editorial-images.json` maps topics and selected guide slugs to cover imagery, alt text and captions, and records photography sources. Source photographs are preserved in `research/photos/`.
- All published and scheduled guides receive a cover, contextual caption, social image and Article image metadata through `artFor`. Covers illustrate topics; they do not imply every photographed product appears in every list.
- The approved live-text wordmark is unchanged. The site remains a guide publisher with no storefront or checkout. Brand mentions and app promotions requested for removal have been removed from public copy and styles.
- Tests cover imagery and removed-brand regressions alongside the existing scheduling, metadata and internal-link checks.
