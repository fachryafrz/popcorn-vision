import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SortByType from "./Type";
import SortByOrder from "./Order";

export default function SearchSort({
  handleNotAvailable,
  handleClearNotAvailable,
  inputStyles,
  setIsFilterActive,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const isQueryParams = searchParams.get("query") ? true : false;

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
      current.delete("sort_by");
    } else {
      current.set("sort_by", `${value}.${sortByOrder.value}`);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleSortByOrderChange = (selectedOption) => {
    const value = selectedOption.value;

    if (!value) {
      current.delete("sort_by");
    } else {
      current.set("sort_by", `${sortByType.value}.${value}`);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

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
    } else {
      setSortByType(sortByTypeOptions[0]);
      setSortByOrder(sortByOrderOptions[1]);
    }
  }, [
    searchParams,
    sortByOrder.value,
    sortByOrderOptions,
    sortByType.value,
    sortByTypeOptions,
  ]);

  return (
    <div
      onMouseOver={() => isQueryParams && handleNotAvailable()}
      onMouseLeave={() => handleClearNotAvailable()}
      className={`flex flex-nowrap justify-center gap-2 lg:justify-end [&>div]:w-full lg:[&>div]:w-[145px]`}
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
  );
}
