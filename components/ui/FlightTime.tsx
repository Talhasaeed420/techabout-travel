import { AIRPORTS } from "../../app/constants";

// Shows a flight time in the airport's own timezone with its offset, like "04:10 GMT+5".
// It runs on the server, so the browser gets finished text and nothing can differ (no hydration warning).
export default function FlightTime({ utc, airport }: { utc: string; airport: string }) {
  const date = new Date(utc);
  const { city, zone } = AIRPORTS[airport];

  const time = date.toLocaleTimeString("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const day = date.toLocaleDateString("en-GB", { timeZone: zone, weekday: "short", day: "numeric", month: "short" });
  const offset = new Intl.DateTimeFormat("en-GB", { timeZone: zone, timeZoneName: "shortOffset" }).format(date).split(", ")[1];

  return (
    <div>
      <span className="time">{time}</span> <span className="muted">{offset}</span>
      <p className="muted">
        {day}, {city} ({airport})
      </p>
    </div>
  );
}
