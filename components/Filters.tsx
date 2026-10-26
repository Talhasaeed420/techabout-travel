"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AIRLINES, CABINS, PRICES, SORTS, STOPS } from "../app/constants";
import { activeFilters, clearFiltersUrl, searchUrl, type SearchParams } from "../app/routes/searchParams";
import { TEXT } from "../app/text";
import Button from "./ui/Button";
import Checkbox from "./ui/Checkbox";
import SelectInput from "./ui/SelectInput";

interface Props {
  search: SearchParams;
  airlinesOnRoute: string[];
}

// On a big screen the filters sit in the sidebar. On a phone a button opens them in a dialog.
// The browser's <dialog> tag does the hard parts: it blocks the page behind it and closes with Escape.
export default function Filters({ search, airlinesOnRoute }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <div className="sidebar" role="complementary" aria-label={TEXT.filters.title}>
        <FilterFields search={search} airlinesOnRoute={airlinesOnRoute} />
      </div>

      <Button look="outline" className="filters-toggle" onClick={() => dialogRef.current?.showModal()}>
        {TEXT.filters.open(activeFilters(search).length)}
      </Button>

      <dialog ref={dialogRef} className="filters-dialog" aria-label={TEXT.filters.title}>
        <div className="filters-dialog__inner">
          <div className="filters-dialog__bar">
            <h2>{TEXT.filters.title}</h2>
            <Button look="outline" onClick={close}>
              {TEXT.filters.close}
            </Button>
          </div>
          <FilterFields search={search} airlinesOnRoute={airlinesOnRoute} />
          <Button onClick={close}>{TEXT.filters.showFlights}</Button>
        </div>
      </dialog>
    </>
  );
}

// The filter fields. They hold no flight data: every change makes a new URL and the server draws the page again.
function FilterFields({ search, airlinesOnRoute }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function change(changes: Partial<SearchParams>) {
    const next = Object.assign({}, search, changes);
    startTransition(() => router.push(searchUrl(next), { scroll: false }));
  }

  function toggleAirline(code: string, checked: boolean) {
    const others = search.airlines.filter((airline) => airline !== code);
    change({ airlines: checked ? others.concat(code) : others });
  }

  return (
    <div>
      <SelectInput label={TEXT.filters.sortBy} options={SORTS} value={search.sort} onChange={(value) => change({ sort: value })} />
      <SelectInput label={TEXT.filters.cabin} options={CABINS} value={search.cabin} onChange={(value) => change({ cabin: value })} />
      <SelectInput label={TEXT.filters.stops} options={STOPS} value={search.stops} onChange={(value) => change({ stops: value })} />

      <div className="field" role="group" aria-label={TEXT.filters.airlines}>
        <p className="field__label">{TEXT.filters.airlines}</p>
        {airlinesOnRoute.map((code) => (
          <Checkbox key={code} label={AIRLINES[code]} checked={search.airlines.includes(code)} onChange={(checked) => toggleAirline(code, checked)} />
        ))}
      </div>

      <SelectInput label={TEXT.filters.price} options={PRICES} value={search.price} onChange={(value) => change({ price: value })} />

      {activeFilters(search).length > 0 && (
        <Button href={clearFiltersUrl(search)} look="outline">
          {TEXT.filters.clear}
        </Button>
      )}
      {isPending && <div className="muted">{TEXT.filters.updating}</div>}
    </div>
  );
}
