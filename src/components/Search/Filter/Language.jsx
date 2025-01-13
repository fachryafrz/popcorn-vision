import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { getRandomOptionsPlaceholder } from "@/lib/getRandomOptionsPlaceholder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Language({ inputStyles, languagesData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const isQueryParams = searchParams.get("query");

  const [language, setLanguage] = useState();
  const [languagesInputPlaceholder, setLanguagesInputPlaceholder] = useState();

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
      current.delete("with_original_language");
    } else {
      current.set("with_original_language", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
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
    if (searchParams.get("with_original_language")) {
      const languagesParams = searchParams
        .get("with_original_language")
        .split(",");
      const searchLanguages = languagesParams.map((languageId) =>
        languagesData?.find(
          (language) => language.iso_639_1 === languageId.toLowerCase(),
        ),
      );
      const searchLanguagesOptions = searchLanguages?.map(
        (language) =>
          language && {
            value: language.iso_639_1,
            label: language.english_name,
          },
      );
      setLanguage(searchLanguagesOptions);
    } else {
      setLanguage(null);
    }
  }, [languagesData, searchParams]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Language</span>
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
