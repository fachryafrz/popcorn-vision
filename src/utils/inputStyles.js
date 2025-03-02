export const inputStyles = {
  placeholder: (styles) => ({
    ...styles,
    fontSize: "14px",
    whiteSpace: "nowrap",
  }),
  control: (styles) => ({
    ...styles,
    color: "#fff",
    backgroundColor: "#131720",
    borderWidth: "1px",
    borderColor: "#79808B",
    borderRadius: "1.5rem",
    cursor: "text",
  }),
  input: (styles, { isDisabled }) => ({
    ...styles,
    color: "#fff",
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    display: "none",
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: "none",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "#131720",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      color: "#fff",
      backgroundColor: isSelected ? "rgba(255,255,255,0.1)" : "#131720",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.05)",
      },
    };
  },
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "9999px",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#fff",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#fff",
    borderRadius: "9999px",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  }),
  clearIndicator: (styles) => ({
    ...styles,
    display: "block",
    "&:hover": {
      color: "#fff",
    },
    cursor: "pointer",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#fff",
  }),
};
