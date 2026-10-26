import { AIRPORTS } from "./constants";

// All the words on screen are here, so the components only hold layout.
// A few small functions at the top turn numbers and dates into text.

export function formatPkr(amount: number): string {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", currencyDisplay: "code", maximumFractionDigits: 0 }).format(amount);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

const cities = (from: string, to: string) => `${AIRPORTS[from].city} to ${AIRPORTS[to].city}`;
const flightWord = (count: number) => `${count} ${count === 1 ? "flight" : "flights"}`;

export const TEXT = {
  siteName: "Travel.pk",
  siteTitle: "Travel.pk | Flights",
  siteDescription: "Compare flights from Pakistan in PKR. Pay with JazzCash or Easypaisa.",
  skipLink: "Skip to main content",
  nav: { search: "Search flights", karachiDubai: "Karachi to Dubai" },

  search: {
    pageTitle: "Flight results",
    heading: (from: string, to: string) => `Flights from ${cities(from, to)}`,
    summary: (date: string, pax: number) => `${formatDate(date)} · ${pax} ${pax === 1 ? "traveller" : "travellers"}`,
    formLabel: "Search flights",
    resultsLabel: "Flight results",
    from: "From",
    to: "To",
    date: "Departure date",
    travellers: "Travellers",
    submit: "Search flights",
  },

  filters: {
    title: "Filters",
    open: (count: number) => (count > 0 ? `Filters (${count})` : "Filters"),
    close: "Close",
    showFlights: "Show flights",
    sortBy: "Sort by",
    cabin: "Cabin",
    stops: "Stops",
    airlines: "Airlines",
    price: "Price per person",
    clear: "Clear filters",
    updating: "Updating…",
    cabinActive: (cabin: string) => `${cabin} cabin`,
    airlinesActive: (names: string) => `Airlines: ${names}`,
  },

  results: {
    heading: (count: number, from: string, to: string) => `${flightWord(count)} from ${cities(from, to)}`,
    announceFound: (count: number, missing: string[]) =>
      `${flightWord(count)} found.${missing.length > 0 ? ` Fares from ${missing.join(" and ")} are missing.` : ""}`,
    announceNone: "No flights match.",
    searching: "Searching for flights…",
  },

  card: {
    perPerson: "per person",
    total: (price: string, pax: number) => `${price} for ${pax}`,
    baggage: (kg: number) => `${kg} kg bag`,
    refundable: "Refundable",
    notRefundable: "Non-refundable",
    nonStop: "Non-stop",
    stopsVia: (stops: number, via: string) => `${stops} stop via ${via}`,
  },

  empty: {
    title: "No flights found",
    withFilters: (from: string, to: string, date: string) => `Nothing matches your search for ${cities(from, to)} on ${formatDate(date)} with these filters:`,
    withoutFilters: (from: string, to: string, date: string) =>
      `We couldn't find any flights for ${cities(from, to)} on ${formatDate(date)}. Try another date or route.`,
    changeSearch: "Change search",
  },

  error: {
    title: "We couldn't load flights",
    timeout: "The airlines are taking too long to answer.",
    unavailable: "We couldn't reach the airlines just now.",
    help: "This is usually temporary. Your search and filters are saved, so you can try again.",
    announce: "We couldn't load flights. You can try again.",
  },

  partial: {
    title: "Some fares are missing.",
    body: (airlines: string) => `${airlines} didn't answer, so the list below may not show every option.`,
  },

  retry: { button: "Retry", busy: "Trying again…" },
};
