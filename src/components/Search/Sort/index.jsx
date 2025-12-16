import { useEffect, useState, useMemo } from "react";
import SortByType from "./Type";
import SortByOrder from "./Order";
import { useFiltersNotAvailable } from "@/zustand/filtersNotAvailable";
import { useQueryState, parseAsString } from "nuqs";

export default function SearchSort() {
  const [sortBy, setSortBy] = useQueryState("sort_by", parseAsString);
  const [query] = useQueryState("query");
  const { setFiltersNotAvailable } = useFiltersNotAvailable();

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
  const handleSortByTypeChange = (selectedOption) => {
    const value = selectedOption.value;

    if (!value) {
      setSortBy(null);
    } else {
      setSortBy(`${value}.${sortByOrder.value}`);
    }
  };
  const handleSortByOrderChange = (selectedOption) => {
    const value = selectedOption.value;

    if (!value) {
      setSortBy(null);
    } else {
      setSortBy(`${sortByType.value}.${value}`);
    }
  };

  useEffect(() => {
    // Sort by
    if (sortBy) {
      const sortByParams = sortBy.split(".");
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
    } else {
      setSortByType(sortByTypeOptions[0]);
      setSortByOrder(sortByOrderOptions[1]);
    }
  }, [
    sortBy,
    sortByOrder.value,
    sortByOrderOptions,
    sortByType.value,
    sortByTypeOptions,
  ]);

  return (
    <div
      onMouseOver={() => query && setFiltersNotAvailable(true)}
      onMouseLeave={() => setFiltersNotAvailable(false)}
      className={`flex flex-nowrap justify-center gap-2 lg:justify-end [&>div]:w-full lg:[&>div]:w-[145px]`}
    >
      {/* Sort by type */}
      <SortByType
        sortByTypeOptions={sortByTypeOptions}
        handleSortByTypeChange={handleSortByTypeChange}
        sortByType={sortByType}
        isQueryParams={!!query}
      />

      {/* Sort by order */}
      <SortByOrder
        sortByOrderOptions={sortByOrderOptions}
        handleSortByOrderChange={handleSortByOrderChange}
        sortByOrder={sortByOrder}
        isQueryParams={!!query}
      />
    </div>
  );
}
