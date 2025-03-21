import { inputStyles } from "@/utils/inputStyles";
import Select from "react-select";

export default function SortByType({
  sortByTypeOptions,
  handleSortByTypeChange,
  sortByType,
  isQueryParams,
}) {
  return (
    <Select
      options={sortByTypeOptions}
      onChange={handleSortByTypeChange}
      value={sortByType}
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
