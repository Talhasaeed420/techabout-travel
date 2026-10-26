import { AIRLINES, CABINS, DEFAULT_FROM, DEFAULT_TO, FROM_OPTIONS, PRICES, SIMULATIONS, SORTS, STOPS, TO_OPTIONS } from "../constants";
import { TEXT } from "../text";

// The search page, the API and the filters all read the URL through this one file.
// Example: /air/search?from=KHI&to=DXB&date=2026-11-20&cabin=business&stops=0&airlines=PK,EK&price=100000&sort=duration

export interface SearchParams {
  from: string;
  to: string;
  date: string; // YYYY-MM-DD
  pax: number; // travellers
  cabin: string;
  stops: string; // "" means any, "0" non-stop, "1" up to one stop
  airlines: string[]; // empty means all airlines
  price: string; // "" means any price
  sort: string;
  simulate: string; // "" means normal
}

// one flight as the API sends it (times are UTC)
export interface Flight {
  id: string;
  flightNo: string;
  airline: string;
  from: string;
  to: string;
  departUtc: string;
  arriveUtc: string;
  durationMinutes: number;
  stops: number;
  via: string | null;
  farePkr: number;
  baggageKg: number;
  refundable: boolean;
}

// one row of offers.json
export interface FlightRow {
  id: string;
  flightNo: string;
  airline: string;
  from: string;
  to: string;
  departTime: string;
  durationMinutes: number;
  stops: number;
  via: string | null;
  fares: Record<string, number | undefined>; // a flight may have no seats in some cabins
  baggageKg: number;
  refundable: boolean;
}

// what the search page gets back from the API. status is the HTTP status code.
export interface ApiResult {
  status: number;
  flights: Flight[];
  failedAirlines: string[];
}

function inList(options: { value: string }[], value: string): boolean {
  return options.some((option) => option.value === value);
}

function labelOf(options: { value: string; label: string }[], value: string): string {
  const found = options.find((option) => option.value === value);
  return found ? found.label : value;
}

function defaultDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

function readDate(value: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const looksRight = /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
  return looksRight && value >= today ? value : defaultDate();
}

// URL to search. Anything wrong in the URL becomes the default value, so a bad link never crashes the page.
export function readParams(url: URLSearchParams): SearchParams {
  const get = (name: string) => url.get(name) || "";
  const pax = Number(get("pax"));

  return {
    from: inList(FROM_OPTIONS, get("from")) ? get("from") : DEFAULT_FROM,
    to: inList(TO_OPTIONS, get("to")) ? get("to") : DEFAULT_TO,
    date: readDate(get("date")),
    pax: Number.isInteger(pax) && pax >= 1 && pax <= 9 ? pax : 1,
    cabin: inList(CABINS, get("cabin")) ? get("cabin") : "economy",
    stops: inList(STOPS, get("stops")) ? get("stops") : "",
    airlines: get("airlines").toUpperCase().split(",").filter((code) => code in AIRLINES),
    price: inList(PRICES, get("price")) ? get("price") : "",
    sort: inList(SORTS, get("sort")) ? get("sort") : "price",
    simulate: SIMULATIONS.includes(get("simulate")) ? get("simulate") : "",
  };
}

// Search back to a URL. Values that are still the default are left out.
export function buildQuery(search: SearchParams): string {
  const query = new URLSearchParams({ from: search.from, to: search.to, date: search.date });
  if (search.pax > 1) query.set("pax", String(search.pax));
  if (search.cabin !== "economy") query.set("cabin", search.cabin);
  if (search.stops !== "") query.set("stops", search.stops);
  if (search.airlines.length > 0) query.set("airlines", search.airlines.join(","));
  if (search.price !== "") query.set("price", search.price);
  if (search.sort !== "price") query.set("sort", search.sort);
  if (search.simulate !== "") query.set("simulate", search.simulate);
  return query.toString().replace(/%2C/g, ",");
}

export function searchUrl(search: SearchParams): string {
  return `/air/search?${buildQuery(search)}`;
}

// Same search with no filters. It also drops "simulate" so the button always shows real results.
export function clearFiltersUrl(search: SearchParams): string {
  return searchUrl({ from: search.from, to: search.to, date: search.date, pax: search.pax, cabin: "economy", stops: "", airlines: [], price: "", sort: "price", simulate: "" });
}

// the filters that are switched on, as short sentences (the empty state lists them)
export function activeFilters(search: SearchParams): string[] {
  const list: string[] = [];
  if (search.cabin !== "economy") list.push(TEXT.filters.cabinActive(labelOf(CABINS, search.cabin)));
  if (search.stops !== "") list.push(labelOf(STOPS, search.stops));
  if (search.airlines.length > 0) list.push(TEXT.filters.airlinesActive(search.airlines.map((code) => AIRLINES[code]).join(", ")));
  if (search.price !== "") list.push(labelOf(PRICES, search.price));
  return list;
}
