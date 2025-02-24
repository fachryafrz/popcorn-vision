import { useEffect, useState, useRef } from "react";
import AsyncSelect from "react-select/async";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { AND_SEPARATION, OR_SEPARATION } from "@/lib/constants";
import debounce from "debounce";

const WITH_KEYWORDS = "with_keywords";

export default function Keyword({ inputStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  const isQueryParams = searchParams.get("query");
  const defaultToggleSeparation = searchParams.get(WITH_KEYWORDS)?.includes("|")
    ? OR_SEPARATION
    : AND_SEPARATION;

  const [keyword, setKeyword] = useState([]);
  const [toggleSeparation, setToggleSeparation] = useState(
    defaultToggleSeparation,
  );

  const separation = toggleSeparation === AND_SEPARATION ? "," : "|";

  const keywordsLoadOptions = debounce(async (inputValue, callback) => {
    const { data } = await axios.get(`/api/search/keyword`, {
      params: { query: inputValue },
    });

    const options = data.results.map((keyword) => ({
      value: keyword.id,
      label: keyword.name,
    }));

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );

    callback(filteredOptions);
  }, 1000);

  const handleKeywordChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      current.delete(WITH_KEYWORDS);
    } else {
      current.set(WITH_KEYWORDS, value.join(separation));
    }

    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSeparator = (separator) => {
    setToggleSeparation(separator);

    if (searchParams.get(WITH_KEYWORDS)) {
      const params = searchParams.get(WITH_KEYWORDS);

      const separation = separator === AND_SEPARATION ? "," : "|";
      const newSeparator = params.includes("|") ? "," : "|";
      if (newSeparator !== separation) return;

      const updatedParams = params.replace(/[\|,]/g, newSeparator);

      current.set(WITH_KEYWORDS, updatedParams);
      router.push(`${pathname}?${current.toString()}`);
    }
  };

  useEffect(() => {
    // Keyword
    if (searchParams.get(WITH_KEYWORDS)) {
      const params = searchParams.get(WITH_KEYWORDS);
      const splitted = params.split(separation);

      Promise.all(
        splitted.map((keywordId) =>
          axios.get(`/api/keyword/${keywordId}`).then(({ data }) => data),
        ),
      )
        .then((responses) => {
          const uniqueKeyword = [...new Set(responses)]; // Remove duplicates if any
          const searchKeyword = uniqueKeyword.map((keyword) => ({
            value: keyword.id,
            label: keyword.name,
          }));
          setKeyword(searchKeyword);
        })
        .catch((error) => {
          console.error("Error fetching keyword:", error);
        });
    } else {
      setKeyword(null);
    }
  }, [searchParams, separation]);

  return (
    <section className={`flex flex-col gap-1`}>
      <div className={`flex items-center justify-between`}>
        <span className={`font-medium`}>Keyword</span>

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
        loadOptions={keywordsLoadOptions}
        onChange={handleKeywordChange}
        value={keyword}
        styles={inputStyles}
        placeholder={`Search keyword...`}
        isDisabled={isQueryParams}
        isMulti
      />
    </section>
  );
}
