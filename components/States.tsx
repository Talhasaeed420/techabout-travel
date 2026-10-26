import { activeFilters, clearFiltersUrl, type SearchParams } from "../app/routes/searchParams";
import { TEXT } from "../app/text";
import { Announce, RetryButton } from "./RetryAndAnnounce";
import Button from "./ui/Button";

// The four screen states besides "results": loading, error, empty and partial.

// Grey boxes in the same size as a flight card, so nothing jumps when the flights arrive
export function LoadingState() {
  return (
    <div aria-busy="true">
      <Announce text={TEXT.results.searching} />
      <div className="results-head">
        <span className="bar bar--wide" />
      </div>
      <div className="flight-list" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="card card--skeleton">
            <span className="bar" />
            <span className="bar bar--wide" />
            <span className="bar" />
          </div>
        ))}
      </div>
    </div>
  );
}

// The API answered with a bad HTTP status (like 503), or did not answer in time (504)
export function ErrorState({ status }: { status: number }) {
  return (
    <div className="notice notice--error">
      <Announce text={TEXT.error.announce} />
      <h3>{TEXT.error.title}</h3>
      <p>
        {status === 504 ? TEXT.error.timeout : TEXT.error.unavailable} {TEXT.error.help}
      </p>
      <RetryButton />
    </div>
  );
}

// Status 200 but no flights. If filters caused it, name them and offer Clear filters.
export function EmptyState({ search }: { search: SearchParams }) {
  const filters = activeFilters(search);

  return (
    <div className="notice">
      <h3>{TEXT.empty.title}</h3>
      {filters.length > 0 ? (
        <>
          <p>{TEXT.empty.withFilters(search.from, search.to, search.date)}</p>
          <ul>
            {filters.map((filter) => (
              <li key={filter}>{filter}</li>
            ))}
          </ul>
          <Button href={clearFiltersUrl(search)}>{TEXT.filters.clear}</Button>
        </>
      ) : (
        <>
          <p>{TEXT.empty.withoutFilters(search.from, search.to, search.date)}</p>
          <Button href="#search-form">{TEXT.empty.changeSearch}</Button>
        </>
      )}
    </div>
  );
}

// Some airlines did not answer. The flights we got are still shown under this banner.
export function PartialBanner({ airlines }: { airlines: string[] }) {
  return (
    <div className="banner">
      <p>
        <strong>{TEXT.partial.title}</strong> {TEXT.partial.body(airlines.join(" and "))}
      </p>
      <RetryButton />
    </div>
  );
}
