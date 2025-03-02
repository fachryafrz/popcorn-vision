import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { getRandomOptionsPlaceholder } from "@/lib/getRandomOptionsPlaceholder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AND_SEPARATION, OR_SEPARATION } from "@/lib/constants";
import { inputStyles } from "@/utils/inputStyles";

const WITH_ORIGINAL_LANGUAGE = "with_original_language";

export default function Language({ languagesData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  const isQueryParams = searchParams.get("query");
  const defaultToggleSeparation = searchParams
    .get(WITH_ORIGINAL_LANGUAGE)
    ?.includes("|")
    ? OR_SEPARATION
    : AND_SEPARATION;

  const [language, setLanguage] = useState();
  const [languagesInputPlaceholder, setLanguagesInputPlaceholder] = useState();
  const [toggleSeparation, setToggleSeparation] = useState(
    defaultToggleSeparation,
  );

  const separation = toggleSeparation === AND_SEPARATION ? "," : "|";

  // Handle Select Options
  const languagesOptions = useMemo(() => {
    return languagesData?.map((language) => ({
      value: language.iso_639_1,
      label: language.english_name,
    }));
  }, [languagesData]);

  const handleLanguageChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      current.delete(WITH_ORIGINAL_LANGUAGE);
    } else {
      current.set(WITH_ORIGINAL_LANGUAGE, value.join(separation));
    }

    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSeparator = (separator) => {
    setToggleSeparation(separator);

    if (searchParams.get(WITH_ORIGINAL_LANGUAGE)) {
      const params = searchParams.get(WITH_ORIGINAL_LANGUAGE);

      const separation = separator === AND_SEPARATION ? "," : "|";
      const newSeparator = params.includes("|") ? "," : "|";
      if (newSeparator !== separation) return;

      const updatedParams = params.replace(/[\|,]/g, newSeparator);

      current.set(WITH_ORIGINAL_LANGUAGE, updatedParams);
      router.push(`${pathname}?${current.toString()}`);
    }
  };

  // Use Effect for cycling random options placeholder
  useEffect(() => {
    const updatePlaceholders = () => {
      const languagesPlaceholder =
        getRandomOptionsPlaceholder(languagesOptions);

      setLanguagesInputPlaceholder(languagesPlaceholder);
    };

    updatePlaceholders();

    // Set interval to run every 5 seconds
    const intervalId = setInterval(updatePlaceholders, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [languagesOptions]);

  useEffect(() => {
    // Languages
    if (searchParams.get(WITH_ORIGINAL_LANGUAGE)) {
      const params = searchParams.get(WITH_ORIGINAL_LANGUAGE);
      const splitted = params.split(separation);
      const filtered = splitted.map((languageId) =>
        languagesData?.find(
          (language) => language.iso_639_1 === languageId.toLowerCase(),
        ),
      );
      const options = filtered?.map(
        (language) =>
          language && {
            value: language.iso_639_1,
            label: language.english_name,
          },
      );
      setLanguage(options);
    } else {
      setLanguage(null);
    }
  }, [languagesData, searchParams, separation]);

  return (
    <section className={`flex flex-col gap-1`}>
      <div className={`flex items-center justify-between`}>
        <span className={`font-medium`}>Language</span>

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

      <Select
        options={languagesData && languagesOptions}
        onChange={handleLanguageChange}
        value={language}
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
        }}
        placeholder={languagesInputPlaceholder}
        isDisabled={isQueryParams}
        isMulti
      />
    </section>
  );
}
