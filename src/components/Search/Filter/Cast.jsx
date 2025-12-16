import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { useQueryState, parseAsString } from "nuqs";
import { AND_SEPARATION, OR_SEPARATION } from "@/lib/constants";
import { debounce } from "@mui/material";
import { inputStyles } from "@/utils/inputStyles";

const WITH_CAST = "with_cast";

export default function Cast() {
  const [withCast, setWithCast] = useQueryState(WITH_CAST, parseAsString);
  const [query] = useQueryState("query");

  const defaultToggleSeparation = withCast?.includes("|")
    ? OR_SEPARATION
    : AND_SEPARATION;

  const [cast, setCast] = useState([]);
  const [toggleSeparation, setToggleSeparation] = useState(
    defaultToggleSeparation,
  );

  const separation = toggleSeparation === AND_SEPARATION ? "," : "|";

  const castsLoadOptions = debounce(async (inputValue, callback) => {
    const { data } = await axios.get(`/api/search/person`, {
      params: { query: inputValue },
    });

    const options = data.results.map((person) => ({
      value: person.id,
      label: person.name,
    }));

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );

    callback(filteredOptions);
  }, 1000);

  const handleCastChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      setWithCast(null);
    } else {
      setWithCast(value.join(separation));
    }
  };

  const handleSeparator = (separator) => {
    setToggleSeparation(separator);

    if (withCast) {
      const separation = separator === AND_SEPARATION ? "," : "|";
      const newSeparator = withCast.includes("|") ? "," : "|";
      if (newSeparator !== separation) return;

      const updatedParams = withCast.replace(/[\|,]/g, newSeparator);
      setWithCast(updatedParams);
    }
  };

  useEffect(() => {
    // Cast
    if (withCast) {
      const splitted = withCast.split(separation);

      Promise.all(
        splitted.map((castId) =>
          axios.get(`/api/person/${castId}`).then(({ data }) => data),
        ),
      )
        .then((responses) => {
          const uniqueCast = [...new Set(responses)]; // Remove duplicates if any
          const searchCast = uniqueCast.map((cast) => ({
            value: cast.id,
            label: cast.name,
          }));
          setCast(searchCast);
        })
        .catch((error) => {
          console.error("Error fetching cast:", error);
        });
    } else {
      setCast(null);
    }
  }, [withCast, separation]);

  return (
    <section className={`flex flex-col gap-1`}>
      <div className={`flex items-center justify-between`}>
        <span className={`font-medium`}>Actor</span>

        <div className={`flex rounded-full bg-base-100 p-1`}>
          <button
            onClick={() => handleSeparator(AND_SEPARATION)}
            className={`btn btn-ghost btn-xs rounded-full ${
              toggleSeparation === AND_SEPARATION
                ? "bg-white text-base-100 hover:bg-white hover:bg-opacity-50"
                : ""
            }`}
          >
            AND
          </button>
          <button
            onClick={() => handleSeparator(OR_SEPARATION)}
            className={`btn btn-ghost btn-xs rounded-full ${
              toggleSeparation === OR_SEPARATION
                ? "bg-white text-base-100 hover:bg-white hover:bg-opacity-50"
                : ""
            }`}
          >
            OR
          </button>
        </div>
      </div>

      <AsyncSelect
        noOptionsMessage={() => "Type to search"}
        loadingMessage={() => "Searching..."}
        loadOptions={castsLoadOptions}
        onChange={handleCastChange}
        value={cast}
        styles={inputStyles}
        placeholder={`Search actor...`}
        isDisabled={!!query}
        isMulti
      />
    </section>
  );
}
