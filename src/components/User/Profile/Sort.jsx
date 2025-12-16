"use client";

import { IonIcon } from "@ionic/react";
import { arrowDown, arrowUp } from "ionicons/icons";
import { useQueryState, parseAsString } from "nuqs";
import { useMemo } from "react";

const sortOptions = [
  { label: "Date Added", value: "created_at" },
  { label: "Rating", value: "rating" },
  { label: "Popularity", value: "popularity" },
  { label: "Release Date", value: "release_date" },
];

const orderOptions = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

export default function UserProfileSort() {
  const [sortBy, setSortBy] = useQueryState("sort_by", parseAsString);
  const [orderBy, setOrderBy] = useQueryState("order", parseAsString);

  const sort = useMemo(
    () => sortOptions.find((o) => o.value === sortBy) || sortOptions[0],
    [sortBy],
  );
  const order = useMemo(
    () => orderOptions.find((o) => o.value === orderBy) || orderOptions[1],
    [orderBy],
  );

  const handleSort = (option) => {
    setSortBy(option.value);
  };
  const handleOrder = () => {
    const newOrder =
      order?.value === "asc" ? orderOptions[1].value : orderOptions[0].value;
    setOrderBy(newOrder);
  };

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1`}>
      <div className={`flex items-center gap-2`}>
        <span>Sort by:</span>

        <div className="dropdown dropdown-end dropdown-bottom dropdown-hover">
          <button className="btn btn-secondary btn-sm border-none bg-opacity-20 text-white hocus:bg-opacity-50">
            {sort?.label}
          </button>
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box z-[1] w-52 bg-base-200 bg-opacity-90 p-2 shadow backdrop-blur"
          >
            {sortOptions.map((option) => {
              return (
                <li key={option.value}>
                  <button
                    onClick={() => handleSort(option)}
                    className={`btn btn-secondary no-animation btn-sm justify-start rounded-lg border-none bg-opacity-0 ${sort?.value === option.value ? `btn-active !bg-opacity-30` : ``}`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className={`flex items-center gap-2`}>
        <span>Order:</span>

        <button
          onClick={handleOrder}
          className="btn btn-square btn-secondary btn-sm border-none bg-opacity-20 text-white hocus:bg-opacity-50"
        >
          {order?.value === `asc` ? (
            <IonIcon icon={arrowUp} />
          ) : (
            <IonIcon icon={arrowDown} />
          )}
        </button>
      </div>
    </div>
  );
}
