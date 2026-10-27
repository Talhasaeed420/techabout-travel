// Every fixed value lives here: defaults, dropdown lists and the numbers for the fake API.

export const DEFAULT_FROM = "KHI";
export const DEFAULT_TO = "DXB";

export const AIRPORTS: Record<string, { city: string; zone: string }> = {
  KHI: { city: "Karachi", zone: "Asia/Karachi" },
  LHE: { city: "Lahore", zone: "Asia/Karachi" },
  ISB: { city: "Islamabad", zone: "Asia/Karachi" },
  MUX: { city: "Multan", zone: "Asia/Karachi" },
  DXB: { city: "Dubai", zone: "Asia/Dubai" },
  JED: { city: "Jeddah", zone: "Asia/Riyadh" },
  LHR: { city: "London", zone: "Europe/London" },
};

export const AIRLINES: Record<string, string> = {
  PK: "Pakistan International Airlines",
  EK: "Emirates",
  FZ: "flydubai",
  G9: "Air Arabia",
  PA: "Airblue",
  QR: "Qatar Airways",
  SV: "Saudia",
  TK: "Turkish Airlines",
  EY: "Etihad Airways",
  ER: "SereneAir",
};

// Dropdown lists. Each one is { value: what goes in the URL, label: what the user reads }.
export const FROM_OPTIONS = ["KHI", "LHE", "ISB", "MUX"].map((code) => ({ value: code, label: `${AIRPORTS[code].city} (${code})` }));
export const TO_OPTIONS = ["DXB", "JED", "LHR", "KHI", "LHE"].map((code) => ({ value: code, label: `${AIRPORTS[code].city} (${code})` }));
export const PAX_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => ({ value: n, label: n }));

export const CABINS = [
  { value: "economy", label: "Economy" },
  { value: "premium", label: "Premium economy" },
  { value: "business", label: "Business" },
];

export const SORTS = [
  { value: "price", label: "Cheapest first" },
  { value: "duration", label: "Shortest first" },
  { value: "departure", label: "Earliest departure" },
];

export const STOPS = [
  { value: "", label: "Any number of stops" },
  { value: "0", label: "Non-stop only" },
  { value: "1", label: "Up to 1 stop" },
];

export const PRICES = [
  { value: "", label: "Any price" },
  { value: "25000", label: "Up to PKR 25,000" },
  { value: "50000", label: "Up to PKR 50,000" },
  { value: "75000", label: "Up to PKR 75,000" },
  { value: "100000", label: "Up to PKR 100,000" },
  { value: "200000", label: "Up to PKR 200,000" },
  { value: "400000", label: "Up to PKR 400,000" },
];

// ?simulate= values, see the top of app/api/offers/route.ts
export const SIMULATIONS = ["slow", "error", "empty", "partial"];

// the fake API
export const FAST_DELAY_MIN_MS = 1200;
export const FAST_DELAY_MAX_MS = 2500;
export const SLOW_DELAY_MS = 6500;
export const PARTIAL_MISSING = ["EK", "QR"];
export const PAKISTAN_OFFSET = "+05:00"; // all our departures are in Pakistan, which has no summer time

// The search page asks our own API. The address comes from the API_URL variable in .env.production (or in Vercel's settings).
// On your computer, with no variable set, it uses localhost.
export const API_URL = process.env.API_URL || "http://localhost:3000";
export const API_TIMEOUT_MS = 10000;

export const LIVE_MESSAGE_ID = "live-message";