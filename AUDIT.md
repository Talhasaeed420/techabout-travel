# Audit: https://travel.pk/air/flights/karachi-to-dubai

**Report only. Nothing on the live site was touched.**

## How I did it, and what I could not do

I fetched the public page and read its text, headings, links and meta tags. I could not run Lighthouse, axe or a screen reader where I worked (no browser, no access to those tools), so **I have no speed numbers and I did not make any up**. The findings below come from what is visible in the page content. Each one says how to confirm it with a free tool. Speed steps are at the bottom.

Good things I saw, to be fair: a "Skip to main content" link, zoom is allowed (`maximum-scale=5, user-scalable=yes`), a canonical URL, a clear meta description, and helpful plain-language notes about visas and baggage.

## Findings

| # | Finding | Evidence | Who it hurts | Severity | One-line fix |
|---|---|---|---|---|---|
| 1 | One checklist item has the wrong text under its heading. | Item 3 of "Four checks for KHI → DXB" is titled "Read every segment" but its text is the Dubai airport paragraph ("This page is fixed to Dubai International (DXB)…"). | Every reader: the advice promised by the heading is missing. | Medium | Write real text for that item (check each leg's airline, time and terminal). |
| 2 | The same paragraphs are repeated 3 to 4 times. | The visa paragraph ("Pakistani ordinary-passport holders normally need a UAE visa…") appears in the notes, the checklist and the FAQ. The DXB airport paragraph appears 3 times, the "main southern hub" paragraph 4 times. | Screen reader users hear it again each time, everyone scrolls a longer page, and a visa rule that changes can go stale in one copy but not the others. | Medium | Keep each fact once and link to it from the other places. |
| 3 | The title promises live fares, but the page has no route facts until the user searches. | The H1 says "Compare Live Fares". The FAQ "Which airlines currently fly from Karachi to Dubai?" only answers "the search results are the reliable answer". No airline or usual flight time is on the page. | People on slow 3G who want a quick answer, and search visitors who leave without learning anything. | Medium | Add a small block of facts that rarely change (non-stop airlines, usual flight time) and keep fares in the live search. |
| 4 | Some link names are glued together or repeated. | The logo link reads ".pk Travel.pkElevated Journeys .pk Travel.pk" (name twice). A nav item reads "Plan a stayPlanning" with no space. | Screen reader and voice control users ("click Plan a stay" may not match). | Low to medium | Give the logo link `aria-label="Travel.pk home"`, hide decorative parts with `aria-hidden`, and separate or hide the badge text. |
| 5 | Breadcrumb separators are read as list items. | The breadcrumb is "Home, /, Flights, /, Karachi to Dubai": the "/" marks are their own items. | Screen reader users hear a 5-item list with two "slash" items. | Low | Draw the separators with CSS or add `aria-hidden="true"`. |

**How to confirm each one:** 1, 2 and 3 you can see by reading the page (3: set DevTools Network to "Slow 3G" and reload). 4 and 5: open Chrome DevTools, Elements, Accessibility tab, click the logo link or breadcrumb and look at "Computed Properties" and the tree, or run the free axe DevTools extension.

## Speed: not measured, here is how to do it

Run these three (all free) and fill in the table:

1. PageSpeed Insights, https://pagespeed.web.dev/, paste the page URL, Mobile tab. Record LCP, CLS, INP and the "Opportunities" list.
2. Chrome DevTools, Lighthouse tab, Mobile. Record the Performance and Accessibility scores.
3. Chrome DevTools, Network tab, throttle to Slow 3G, hard reload. Note how long until the H1 and hero image appear.

| Metric | Result |
|---|---|
| LCP | to fill in |
| CLS | to fill in |
| INP / TBT | to fill in |
| Lighthouse accessibility | to fill in |

Where I would look first, based on what is on the page: the large hero photo at the top (`/images/dubai-skyline.png`, requested at 1200 px wide through `_next/image`). Is it the LCP element, does it load with priority, and is it sized for a phone? Also how much JavaScript the search widget needs before the page is usable.
