// The fake airline API. It uses the same URL params as the search page and answers after 1.2 to 2.5 seconds.
// Status codes: 200 = answer (even when empty or partial), 503 = supplier is down.
//
// Add ?simulate= to force a state:
//   slow     normal answer, after 6.5 seconds
//   error    503 error
//   empty    200 with no flights
//   partial  200, but Emirates and Qatar are missing and named in failedAirlines
import type { NextRequest } from "next/server";
import { FAST_DELAY_MAX_MS, FAST_DELAY_MIN_MS, PAKISTAN_OFFSET, PARTIAL_MISSING, SLOW_DELAY_MS } from "../../constants";
import { readParams, type Flight, type FlightRow } from "../../routes/searchParams";
import allFlights from "./offers.json";

export const dynamic = "force-dynamic"; // fares are live, so never cache this

export async function GET(request: NextRequest) {
  const search = readParams(request.nextUrl.searchParams);
  const rows: FlightRow[] = allFlights;

  const delay = search.simulate === "slow" ? SLOW_DELAY_MS : FAST_DELAY_MIN_MS + Math.random() * (FAST_DELAY_MAX_MS - FAST_DELAY_MIN_MS);
  await new Promise((done) => setTimeout(done, delay));

  if (search.simulate === "error") {
    return Response.json({ error: "Supplier unavailable" }, { status: 503 });
  }

  // flights on this route that have a fare in the chosen cabin. The date and the time make the real moment of departure.
  const onRoute: Flight[] = rows
    .filter((row) => row.from === search.from && row.to === search.to && row.fares[search.cabin])
    .map((row) => {
      const departs = new Date(`${search.date}T${row.departTime}:00${PAKISTAN_OFFSET}`);
      return {
        id: row.id,
        flightNo: row.flightNo,
        airline: row.airline,
        from: row.from,
        to: row.to,
        departUtc: departs.toISOString(),
        arriveUtc: new Date(departs.getTime() + row.durationMinutes * 60000).toISOString(),
        durationMinutes: row.durationMinutes,
        stops: row.stops,
        via: row.via,
        farePkr: row.fares[search.cabin] || 0,
        baggageKg: row.baggageKg,
        refundable: row.refundable,
      };
    });

  // airlines that "did not answer" (only in partial mode)
  const failedAirlines = search.simulate === "partial" ? PARTIAL_MISSING.filter((code) => onRoute.some((f) => f.airline === code)) : [];

  const matching = onRoute.filter(
    (f) =>
      !failedAirlines.includes(f.airline) &&
      (search.stops === "" || f.stops <= Number(search.stops)) &&
      (search.airlines.length === 0 || search.airlines.includes(f.airline)) &&
      (search.price === "" || f.farePkr <= Number(search.price)),
  );

  if (search.sort === "duration") matching.sort((a, b) => a.durationMinutes - b.durationMinutes);
  else if (search.sort === "departure") matching.sort((a, b) => a.departUtc.localeCompare(b.departUtc));
  else matching.sort((a, b) => a.farePkr - b.farePkr);

  return Response.json({ flights: search.simulate === "empty" ? [] : matching, failedAirlines });
}
