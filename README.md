# Travel.pk flight results

A flight results page for Travel.pk. Next.js App Router and TypeScript. No database, no keys, all data is invented.

## Run it

You need Node.js 18.18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000 and keep port 3000, because the search page asks its own API at that address (use the `API_URL` variable in `app/constants.ts` for another port).

Add one photo, as a **.jpeg**, at `public/assets/dubai.jpeg`. It is the banner on the Karachi to Dubai page. Without it you only see the alt text.

## Open every state

Add these after `http://localhost:3000`.

| State | URL |
|---|---|
| Normal results | `/air/search?from=KHI&to=DXB` |
| Loading (6.5 seconds) | `/air/search?from=KHI&to=DXB&simulate=slow` |
| Error (API sends 503) | `/air/search?from=KHI&to=DXB&simulate=error` |
| Empty | `/air/search?from=KHI&to=DXB&simulate=empty` |
| Empty because of filters | `/air/search?from=KHI&to=DXB&stops=0&airlines=PK&cabin=business&price=100000` |
| Partial (Emirates and Qatar missing) | `/air/search?from=KHI&to=DXB&simulate=partial` |
| Cached page | `/air/flights/karachi-to-dubai` |
| The API itself | `/api/offers?from=KHI&to=DXB&simulate=partial` |

URL params: `from`, `to`, `date`, `pax`, `cabin`, `stops` (0 or 1), `airlines` (EK,QR), `price`, `sort`, `simulate`. They are all read in one file, `app/routes/searchParams.ts`.

With `simulate=error`, Retry fails again because the URL still says error. That is on purpose. Remove `simulate` from the URL to see it work.

## Status codes

| Code | Where | Meaning |
|---|---|---|
| 200 | the API | an answer, even if it has no flights, or some airlines are missing (partial) |
| 503 | the API | the supplier is down (`simulate=error`) |
| 504 | the search page | the API did not answer in 10 seconds |

The search page looks at the status code: 200 shows flights or the empty or partial state, anything else shows the error state.

## How it works

1. The URL is the only state. `readParams` turns it into an object, `buildQuery` turns it back.
2. `app/air/search/page.tsx` reads the URL and shows the search form and filters straight away.
3. `Results` (in the same file) waits for `/api/offers` inside `<Suspense>`, so the loading state shows first and the flights stream in.
4. Changing a filter changes the URL and the server draws the page again. Back, forward, refresh and pasted links all work.

## Files

| File | What is inside |
|---|---|
| `app/constants.ts` | defaults, airports, airlines, dropdown lists, API numbers |
| `app/text.ts` | every word on screen, and the PKR and date formatting |
| `app/routes/searchParams.ts` | the URL params and the shared types |
| `app/api/offers/route.ts` | the fake API with `simulate` |
| `app/api/offers/offers.json` | 28 invented flights |
| `app/air/search/page.tsx` | the results page and flight card |
| `app/air/flights/karachi-to-dubai/page.tsx` | the cached page, with its own data inside |
| `components/States.tsx` | loading, error, empty and partial |
| `components/Filters.tsx` | filters, plus the phone dialog |
| `components/RetryAndAnnounce.tsx` | Retry button and the screen reader message |
| `components/KeyboardUse.tsx` | keyboard support for the whole page |
| `components/ui/` | Button, SelectInput, DatePicker, Checkbox, FlightTime |

Only four files run in the browser: `Filters`, `RetryAndAnnounce`, `KeyboardUse` and the ui parts they use. Everything else is a server component. Times and prices are made on the server, so the browser has nothing to recalculate and cannot show a different text (no hydration warnings).

## Keyboard

`KeyboardUse.tsx` handles Tab and the arrow keys itself. Focus moves between the buttons and fields and wraps around, so it never lands in the browser address bar. Up and down still change an option inside a dropdown. When the phone filter dialog is open, only the controls inside it are used.

## Gaps and next steps

- No automated tests yet. I did not run it in a browser, so check hydration warnings and the keyboard by hand.
- Screenshots or a recording, and the speed numbers in `AUDIT.md`, still have to be added.
- No checkout page. The flight cards only show the details.
- Next: tests for `readParams`, a Playwright run of the four states, and moving focus to the results after Retry.
