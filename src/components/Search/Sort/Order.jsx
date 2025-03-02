import { inputStyles } from "@/utils/inputStyles";
import Select from "react-select";

export default function SortByOrder({
  sortByOrderOptions,
  handleSortByOrderChange,
  sortByOrder,
  isQueryParams,
}) {
  return (
    <Select
      options={sortByOrderOptions}
      onChange={handleSortByOrderChange}
      value={sortByOrder}
      styles={{
        ...inputStyles,
        dropdownIndicator: (styles) => ({
          ...styles,
          display: "block",
          "&:hover": {
            color: "#fff",
          },
          cursor: "pointer",
        }),
        control: (styles) => ({
          ...styles,
          color: "#fff",
          backgroundColor: "#131720",
          borderWidth: "1px",
          borderColor: "#79808B",
          borderRadius: "1.5rem",
          cursor: "pointer",
        }),
      }}
      isDisabled={isQueryParams}
      isSearchable={false}
      className={`w-[145px]`}
    />
  );
}
