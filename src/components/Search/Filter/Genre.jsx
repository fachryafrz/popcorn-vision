import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { getRandomOptionsPlaceholder } from "@/lib/getRandomOptionsPlaceholder";
import { useQueryState, parseAsString } from "nuqs";
import { AND_SEPARATION, OR_SEPARATION } from "@/lib/constants";
import { inputStyles } from "@/utils/inputStyles";

const WITH_GENRES = "with_genres";

export default function Genre({ genresData }) {
  const [withGenres, setWithGenres] = useQueryState(WITH_GENRES, parseAsString);
  const [query] = useQueryState("query");

  const defaultToggleSeparation = withGenres?.includes("|")
    ? OR_SEPARATION
    : AND_SEPARATION;

  const [genre, setGenre] = useState();
  const [genresInputPlaceholder, setGenresInputPlaceholder] = useState();
  const [toggleSeparation, setToggleSeparation] = useState(
    defaultToggleSeparation,
  );

  const separation = toggleSeparation === AND_SEPARATION ? "," : "|";

  // Handle Select Options
  const genresOptions = useMemo(() => {
    return genresData?.map((genre) => ({
      value: genre.id,
      label: genre.name,
    }));
  }, [genresData]);

  // Handle Select Change
  const handleGenreChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      setWithGenres(null);
    } else {
      setWithGenres(value.join(separation));
    }
  };

  const handleSeparator = (separator) => {
    setToggleSeparation(separator);

    if (withGenres) {
      const separation = separator === AND_SEPARATION ? "," : "|";
      const newSeparator = withGenres.includes("|") ? "," : "|";
      if (newSeparator !== separation) return;

      const updatedParams = withGenres.replace(/[\|,]/g, newSeparator);
      setWithGenres(updatedParams);
    }
  };

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
    if (withGenres) {
      const splitted = withGenres.split(separation);
      const filtered = splitted.map((genreId) =>
        genresData?.find((genre) => parseInt(genre.id) === parseInt(genreId)),
      );
      const options = filtered?.map(
        (genre) =>
          genre && {
            value: genre.id,
            label: genre.name,
          },
      );
      setGenre(options);
    } else {
      setGenre(null);
    }
  }, [genresData, withGenres, separation]);

  return (
    <section className={`flex flex-col gap-1`}>
      <div className={`flex items-center justify-between`}>
        <span className={`font-medium`}>Genre</span>

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
        isDisabled={!!query}
        isMulti
      />
    </section>
  );
}
