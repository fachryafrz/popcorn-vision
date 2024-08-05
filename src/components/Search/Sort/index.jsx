import { IonIcon } from "@ionic/react";
import { closeCircle, filter } from "ionicons/icons";
import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import Select from "react-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SortByType from "./Type";
import SortByOrder from "./Order";

export default function SearchSort({
  searchAPIParams,
  handleNotAvailable,
  handleClearNotAvailable,
  inputStyles,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;
  const isThereAnyFilter = Object.keys(Object.fromEntries(searchParams)).length;

  const sortByTypeOptions = useMemo(
    () => [
      { value: "popularity", label: "Popularity" },
      { value: "vote_count", label: "Rating" },
      { value: "release_date", label: "Release Date" },
      { value: "revenue", label: "Revenue" },
      { value: "budget", label: "Budget" },
    ],
    [],
  );
  const sortByOrderOptions = useMemo(
    () => [
      { value: "asc", label: "Ascending" },
      { value: "desc", label: "Descending" },
    ],
    [],
  );

  // React Select
  const [sortByType, setSortByType] = useState({
    value: "popularity",
    label: "Popularity",
  });
  const [sortByOrder, setSortByOrder] = useState({
    value: "desc",
    label: "Descending",
  });

  // Handle Select Change
  const handleSortByTypeChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.value;

      if (!value) {
        current.delete("sort_by");
      } else {
        current.set("sort_by", `${value}.${sortByOrder.value}`);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router, sortByOrder],
  );
  const handleSortByOrderChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.value;

      if (!value) {
        current.delete("sort_by");
      } else {
        current.set("sort_by", `${sortByType.value}.${value}`);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router, sortByType],
  );

  useEffect(() => {
    // Sort by
    if (searchParams.get("sort_by")) {
      const sortByParams = searchParams.get("sort_by").split(".");
      const searchSortByType = sortByParams.map((param) =>
        sortByTypeOptions.find((option) => option.value === param),
      )[0];
      const searchSortByOrder = sortByParams.map((param) =>
        sortByOrderOptions.find((option) => option.value === param),
      )[1];

      if (sortByType.value !== searchSortByType.value) {
        setSortByType(searchSortByType);
      }

      if (sortByOrder.value !== searchSortByOrder.value) {
        setSortByOrder(searchSortByOrder);
      }

      searchAPIParams["sort_by"] = searchParams.get("sort_by");
    } else {
      delete searchAPIParams["sort_by"];
      setSortByType(sortByTypeOptions[0]);
      setSortByOrder(sortByOrderOptions[1]);
    }
  }, [
    searchAPIParams,
    searchParams,
    sortByOrder.value,
    sortByOrderOptions,
    sortByType.value,
    sortByTypeOptions,
  ]);

  return (
    <div
      className={`flex w-full flex-col items-center justify-between gap-2 sm:flex-row lg:justify-end`}
    >
      <div
        onMouseOver={() => isQueryParams && handleNotAvailable()}
        onMouseLeave={() => handleClearNotAvailable()}
        className={`flex flex-wrap justify-center gap-1 sm:flex-nowrap`}
      >
        {/* Sort by type */}
        <SortByType
          sortByTypeOptions={sortByTypeOptions}
          handleSortByTypeChange={handleSortByTypeChange}
          sortByType={sortByType}
          inputStyles={inputStyles}
          isQueryParams={isQueryParams}
        />

        {/* Sort by order */}
        <SortByOrder
          sortByOrderOptions={sortByOrderOptions}
          handleSortByOrderChange={handleSortByOrderChange}
          sortByOrder={sortByOrder}
          inputStyles={inputStyles}
          isQueryParams={isQueryParams}
        />
      </div>

      <div className={`flex flex-wrap items-center gap-1 sm:flex-nowrap`}>
        {/* Clear all filters */}
        <Suspense>
          <div
            className={`mr-1 flex flex-row-reverse flex-wrap items-center gap-2`}
          >
            {isThereAnyFilter ? (
              <button
                onClick={() => router.push(`${pathname}`)}
                className={`flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-2 pr-4 text-gray-400 transition-all hocus:bg-red-600 hocus:text-white`}
              >
                <IonIcon icon={closeCircle} className={`text-xl`} />
                <span className={`whitespace-nowrap text-sm`}>
                  Clear all filters
                </span>
              </button>
            ) : (
              <span>No filter selected</span>
            )}
          </div>
        </Suspense>

        {/* Filter button */}
        <button
          onClick={() =>
            isQueryParams ? handleNotAvailable() : setIsFilterActive(true)
          }
          onMouseLeave={() => handleClearNotAvailable()}
          className={`btn btn-ghost aspect-square bg-secondary bg-opacity-20 lg:hidden`}
        >
          <IonIcon icon={filter} className={`text-2xl`} />
        </button>
      </div>
    </div>
  );
}
