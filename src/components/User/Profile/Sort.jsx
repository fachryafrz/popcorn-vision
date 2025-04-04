"use client";

import { IonIcon } from "@ionic/react";
import { arrowDown, arrowUp } from "ionicons/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sort, setSort] = useState();
  const [order, setOrder] = useState();

  const handleSort = (option) => {
    const current = new URLSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      sort_by: option.value,
      order: order?.value,
    });

    router.replace(`${pathname}?${current.toString()}`);
  };
  const handleOrder = () => {
    const newOrder = order?.value === "asc" ? orderOptions[1] : orderOptions[0];

    const current = new URLSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      sort_by: sort?.value,
      order: newOrder?.value,
    });

    router.replace(`${pathname}?${current.toString()}`);
  };

  useEffect(() => {
    if (searchParams.get("sort_by")) {
      const sortParam = searchParams.get("sort_by");
      const sortOption = sortOptions.find(
        (option) => option.value === sortParam,
      );

      setSort(sortOption);
    } else {
      setSort(sortOptions[0]);
    }

    if (searchParams.get("order")) {
      const orderParam = searchParams.get("order");
      const orderOption = orderOptions.find(
        (option) => option.value === orderParam,
      );

      setOrder(orderOption);
    } else {
      setOrder(orderOptions[1]);
    }
  }, [searchParams]);

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
