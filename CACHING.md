# Caching

## What I cached

The Karachi to Dubai page (`/air/flights/karachi-to-dubai`). It only has things that rarely change, like which airlines fly, the flight time and a few questions. It has no prices. I used `export const revalidate = 3600`, so the page is saved and rebuilt in the background at most once an hour.

## What I did not cache

The live fares. The search page and `/api/offers` use `force-dynamic`, and the fetch uses `cache: "no-store"`, so every search asks for fresh prices.

## What breaks if reversed

If I cached the fares, a user could see PKR 68,000 for a seat that now costs more or is already sold out, and then fail at payment.

If I did not cache the Karachi to Dubai page, nothing would break. The server would just rebuild the same page for every visitor, which is slower and costs more when many people visit.