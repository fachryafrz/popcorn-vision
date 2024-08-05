import { useEffect, useState, useMemo, useCallback } from "react";
import Select from "react-select";
import { getRandomOptionsPlaceholder } from "@/lib/getRandomOptionsPlaceholder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Genre({ searchAPIParams, genresData, inputStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;

  const [genre, setGenre] = useState();
  const [genresInputPlaceholder, setGenresInputPlaceholder] = useState();

  // Handle Select Options
  const genresOptions = useMemo(() => {
    return genresData?.map((genre) => ({
      value: genre.id,
      label: genre.name,
    }));
  }, [genresData]);

  // Handle Select Change
  const handleGenreChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.map((option) => option.value);

      if (value.length === 0) {
        current.delete("with_genres");
      } else {
        current.set("with_genres", value);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router],
  );

  // Use Effect for cycling random options placeholder
  useEffect(() => {
    const updatePlaceholders = () => {
      const genresPlaceholder = getRandomOptionsPlaceholder(genresOptions);

      setGenresInputPlaceholder(genresPlaceholder);
    };

    updatePlaceholders();

    // Set interval to run every 5 seconds
    const intervalId = setInterval(updatePlaceholders, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [genresOptions]);

  useEffect(() => {
    // Genres
    if (searchParams.get("with_genres")) {
      const genresParams = searchParams.get("with_genres").split(",");
      const searchGenres = genresParams.map((genreId) =>
        genresData?.find((genre) => parseInt(genre.id) === parseInt(genreId)),
      );
      const searchGenresOptions = searchGenres?.map(
        (genre) =>
          genre && {
            value: genre.id,
            label: genre.name,
          },
      );
      setGenre(searchGenresOptions);

      searchAPIParams["with_genres"] = searchParams.get("with_genres");
    } else {
      setGenre(null);

      delete searchAPIParams["with_genres"];
    }
  }, [genresData, searchAPIParams, searchParams]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Genre</span>
      <Select
        options={genresData && genresOptions}
        onChange={handleGenreChange}
        value={genre}
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
        placeholder={genresInputPlaceholder}
        isDisabled={isQueryParams}
        isMulti
      />
    </section>
  );
}
