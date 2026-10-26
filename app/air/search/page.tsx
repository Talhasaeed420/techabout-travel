import { Suspense } from "react";
import Filters from "../../../components/Filters";
import { Announce } from "../../../components/RetryAndAnnounce";
import { EmptyState, ErrorState, LoadingState, PartialBanner } from "../../../components/States";
import Button from "../../../components/ui/Button";
import DatePicker from "../../../components/ui/DatePicker";
import FlightTime from "../../../components/ui/FlightTime";
import SelectInput from "../../../components/ui/SelectInput";
import allFlights from "../../api/offers/offers.json";
import { AIRLINES, API_TIMEOUT_MS, API_URL, FROM_OPTIONS, PAX_OPTIONS, TO_OPTIONS } from "../../constants";
import { buildQuery, readParams, type ApiResult, type Flight, type SearchParams } from "../../routes/searchParams";
import { formatDuration, formatPkr, TEXT } from "../../text";

export const metadata = { title: TEXT.search.pageTitle };

// Reads the URL and asks the API on every visit, so this page is never cached.
export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const search = readParams(new URLSearchParams(await searchParams));

  // Airlines that fly this route. This comes from the data file, not from the slow API, so the filters show up straight away.
  const airlinesOnRoute = Object.keys(AIRLINES).filter((code) =>
    allFlights.some((flight) => flight.from === search.from && flight.to === search.to && flight.airline === code),
  );

  return (
    <div className="page">
      <h1>{TEXT.search.heading(search.from, search.to)}</h1>
      <div className="muted">{TEXT.search.summary(search.date, search.pax)}</div>

      <form action="/air/search" method="get" className="search-form" aria-label={TEXT.search.formLabel} id="search-form">
        <SelectInput label={TEXT.search.from} name="from" defaultValue={search.from} options={FROM_OPTIONS} />
        <SelectInput label={TEXT.search.to} name="to" defaultValue={search.to} options={TO_OPTIONS} />
        <DatePicker label={TEXT.search.date} name="date" defaultValue={search.date} />
        <SelectInput label={TEXT.search.travellers} name="pax" defaultValue={String(search.pax)} options={PAX_OPTIONS} />
        <Button type="submit">{TEXT.search.submit}</Button>
      </form>

      <div className="layout">
        <Filters search={search} airlinesOnRoute={airlinesOnRoute} />

        <div role="region" aria-label={TEXT.search.resultsLabel}>
          {/* the key changes with every search, so the loading state shows again each time */}
          <Suspense key={buildQuery(search)} fallback={<LoadingState />}>
            <Results search={search} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Asks our own API for flights. It never crashes: a bad status code or a timeout comes back as a result.
// cache "no-store" because fares change all the time and must never be saved.
async function getFlights(search: SearchParams): Promise<ApiResult> {
  try {
    const response = await fetch(`${API_URL}/api/offers?${buildQuery(search)}`, { cache: "no-store", signal: AbortSignal.timeout(API_TIMEOUT_MS) });
    if (response.status !== 200) return { status: response.status, flights: [], failedAirlines: [] };

    const data = await response.json();
    return { status: 200, flights: data.flights, failedAirlines: data.failedAirlines };
  } catch {
    return { status: 504, flights: [], failedAirlines: [] }; // 504 = no answer in time
  }
}

// Waits for the API while the loading state is on screen, then picks what to show.
async function Results({ search }: { search: SearchParams }) {
  const { status, flights, failedAirlines } = await getFlights(search);

  if (status !== 200) return <ErrorState status={status} />;

  const heading = TEXT.results.heading(flights.length, search.from, search.to);
  const announcement = flights.length === 0 ? TEXT.results.announceNone : TEXT.results.announceFound(flights.length, failedAirlines.map((code) => AIRLINES[code]));

  return (
    <div>
      <Announce text={announcement} />
      {failedAirlines.length > 0 && <PartialBanner airlines={failedAirlines.map((code) => AIRLINES[code])} />}

      {flights.length === 0 ? (
        <EmptyState search={search} />
      ) : (
        <>
          <div className="results-head">
            <h2>{heading}</h2>
          </div>
          <div role="list" aria-label={heading} className="flight-list">
            {flights.map((flight) => (
              <div role="listitem" key={flight.id}>
                <FlightCard flight={flight} pax={search.pax} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FlightCard({ flight, pax }: { flight: Flight; pax: number }) {
  return (
    <div className="card">
      <div>
        <h3>{AIRLINES[flight.airline]}</h3>
        <p>{flight.flightNo}</p>
        <p className="muted">
          {TEXT.card.baggage(flight.baggageKg)} · {flight.refundable ? TEXT.card.refundable : TEXT.card.notRefundable}
        </p>
      </div>

      <div className="card__times">
        <FlightTime utc={flight.departUtc} airport={flight.from} />
        <p className="card__stops">
          {formatDuration(flight.durationMinutes)}
          <br />
          {flight.stops === 0 ? TEXT.card.nonStop : TEXT.card.stopsVia(flight.stops, String(flight.via))}
        </p>
        <FlightTime utc={flight.arriveUtc} airport={flight.to} />
      </div>

      <div className="card__fare">
        <p className="price">{formatPkr(flight.farePkr)}</p>
        <p className="muted">{TEXT.card.perPerson}</p>
        {pax > 1 && <p className="muted">{TEXT.card.total(formatPkr(flight.farePkr * pax), pax)}</p>}
      </div>
    </div>
  );
}
