# Travel.pk flight results

Next.js (App Router) and TypeScript, with fake flight data.

## Setup

Run `npm install`, then `npm run dev`, and open localhost:3000. Add `public/assets/dubai.jpeg`. 

## States

Start with `/air/search?from=KHI&to=DXB` and add:

- `&simulate=slow`
- `&simulate=error`
- `&simulate=empty`
- `&simulate=partial`
- `&stops=0&airlines=PK&cabin=business&price=100000` (empty from filters)

Cached page: `/air/flights/karachi-to-dubai`






