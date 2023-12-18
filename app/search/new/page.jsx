/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { fetchData } from "@/app/api/route";
import FilmCard from "@/app/components/FilmCard";
import { slugify } from "@/app/lib/slugify";
import { IonIcon } from "@ionic/react";
import { FormControl, InputLabel, MenuItem, Slider } from "@mui/material";
import { close, filter, grid, menu, search } from "ionicons/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import SelectMUI from "@mui/material/Select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function page({ type = "movie" }) {
  const isTvPage = type === "tv";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  const [films, setFilms] = useState();
  const [genresData, setGenresData] = useState();
  const [languagesData, setLanguagesData] = useState();
  const [isGrid, setIsGrid] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [minYear, setMinYear] = useState();
  const [maxYear, setMaxYear] = useState();

  // Filters
  const [releaseDate, setReleaseDate] = useState([minYear, maxYear]);
  const [genre, setGenre] = useState();
  const [language, setLanguage] = useState();
  const [cast, setCast] = useState();
  const [crew, setCrew] = useState();
  const [keyword, setKeyword] = useState();
  const [company, setCompany] = useState();
  const [rating, setRating] = useState([0, 100]);
  const [ratingMinimum, setRatingMinimum] = useState(0);
  const [runtime, setRuntime] = useState([0, 300]);

  // MUI Select
  const [sortByType, setSortByType] = useState(`popularity`);
  const [sortByOrder, setSortByOrder] = useState(`desc`);

  // Handle Slider Marks/Labels
  const releaseDateMarks = [
    {
      value: minYear,
      label: releaseDate[0],
    },
    {
      value: maxYear,
      label: releaseDate[1],
    },
  ];
  const ratingMarks = [
    {
      value: 0,
      label: rating[0],
    },
    {
      value: 100,
      label: rating[1],
    },
  ];
  const ratingMinimumMarks = [
    {
      value: 0,
      label: ratingMinimum,
    },
  ];
  const runtimeMarks = [
    {
      value: 0,
      label: runtime[0],
    },
    {
      value: 300,
      label: runtime[1],
    },
  ];

  // Handle MUI Slider Change
  const handleReleaseDateChange = (event, newValue) => {
    setReleaseDate(newValue);

    const value = releaseDate ? `${newValue[0]},${newValue[1]}` : "";

    if (!value) {
      current.delete("release_date");
    } else {
      current.set("release_date", `${newValue[0]}..${newValue[1]}`);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);

    const value = rating ? `${newValue[0]},${newValue[1]}` : "";

    if (!value) {
      current.delete("vote_average.gte");
      current.delete("vote_average.lte");
    } else {
      current.set("vote_average.gte", newValue[0]);
      current.set("vote_average.lte", newValue[1]);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleRatingMinimumChange = (event, newValue) => {
    setRatingMinimum(newValue);

    const value = ratingMinimum ? `${newValue}` : "";

    if (!value) {
      current.delete("vote_count.gte");
    } else {
      current.set("vote_count.gte", newValue);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleRuntimeChange = (event, newValue) => {
    setRuntime(newValue);

    const value = runtime ? `${newValue[0]},${newValue[1]}` : "";

    if (!value) {
      current.delete("with_runtime.gte");
      current.delete("with_runtime.lte");
    } else {
      current.set("with_runtime.gte", newValue[0]);
      current.set("with_runtime.lte", newValue[1]);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  // Handle MUI Select Change
  const handleSortByTypeChange = (event) => {
    setSortByType(event.target.value);

    const value = sortByType.trim();

    if (!value) {
      current.delete("sort_by");
    } else {
      current.set("sort_by", `${event.target.value}.${sortByOrder}`);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleSortByOrderChange = (event) => {
    setSortByOrder(event.target.value);

    const value = sortByOrder.trim();

    if (!value) {
      current.delete("sort_by");
    } else {
      current.set("sort_by", `${sortByType}.${event.target.value}`);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  // Handle Slider Styles
  const sliderStyles = {
    color: "#fff",
    "& .MuiSlider-markLabel": {
      color: "#fff",
      backgroundColor: "#202735",
      padding: "0.25rem 0.5rem",
      borderRadius: "999px",
      "&[data-index='0']": {
        left: "calc(0% + 0.75rem) !important",
      },
      "&[data-index='1']": {
        left: "calc(100% - 0.75rem) !important",
      },
    },
  };

  // Handle Select Input Styles
  const inputStyles = {
    control: (styles) => ({
      ...styles,
      color: "#fff",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return { ...styles, color: "#000" };
    },
  };
  const selectStyles = {
    borderRadius: "999px",
    color: "#fff",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#79808B",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& .MuiSelect-icon": {
      color: "#fff",
    },
  };

  // Handle Select Options
  const genresOptions = genresData?.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));
  const languagesOptions = languagesData?.map((language) => ({
    value: language.iso_639_1,
    label: language.english_name,
  }));
  const castsLoadOptions = (inputValue, callback) => {
    setTimeout(() => {
      fetchData({
        endpoint: `/search/person`,
        queryParams: {
          query: inputValue,
        },
      }).then((res) => {
        const options = res.results.map((person) => ({
          value: person.id,
          label: person.name,
        }));
        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
      });
    }, 2000);
  };
  const crewsLoadOptions = (inputValue, callback) => {
    setTimeout(() => {
      fetchData({
        endpoint: `/search/person`,
        queryParams: {
          query: inputValue,
        },
      }).then((res) => {
        const options = res.results.map((person) => ({
          value: person.id,
          label: person.name,
        }));
        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
      });
    }, 2000);
  };
  const keywordsLoadOptions = (inputValue, callback) => {
    setTimeout(() => {
      fetchData({
        endpoint: `/search/keyword`,
        queryParams: {
          query: inputValue,
        },
      }).then((res) => {
        const options = res.results.map((keyword) => ({
          value: keyword.id,
          label: keyword.name,
        }));
        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
      });
    }, 2000);
  };
  const companiesLoadOptions = (inputValue, callback) => {
    setTimeout(() => {
      fetchData({
        endpoint: `/search/company`,
        queryParams: {
          query: inputValue,
        },
      }).then((res) => {
        const options = res.results.map((company) => ({
          value: company.id,
          label: company.name,
        }));
        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
      });
    }, 2000);
  };

  // Handle Select Change
  const handleGenreChange = (selectedOption) => {
    setGenre(selectedOption);

    const value = selectedOption.map((option) => option.value);

    if (!value) {
      current.delete("with_genres");
    } else {
      current.set("with_genres", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleLanguageChange = (selectedOption) => {
    console.log(selectedOption);
  };
  const handleCastChange = (selectedOption) => {
    console.log(selectedOption);
  };
  const handleCrewChange = (selectedOption) => {
    console.log(selectedOption);
  };
  const handleKeywordChange = (selectedOption) => {
    console.log(selectedOption);
  };
  const handleCompanyChange = (selectedOption) => {
    console.log(selectedOption);
  };

  // Use Effect
  useEffect(() => {
    // Get default film list
    fetchData({ endpoint: `/discover/${type}` }).then((res) =>
      setFilms(res.results)
    );

    // Get default film list page 2
    fetchData({
      endpoint: `/discover/${type}`,
      queryParams: {
        page: 2,
      },
    }).then((res) => setFilms((prev) => prev && [...prev, ...res.results]));

    // Get genres list
    fetchData({ endpoint: `/genre/${type}/list` }).then((res) =>
      setGenresData(res.genres)
    );

    // Get languages list
    fetchData({ endpoint: `/configuration/languages` }).then((res) =>
      setLanguagesData(res)
    );

    // Fetch min year of available films
    fetchData({
      endpoint: `/discover/${type}`,
      queryParams: {
        sort_by: "primary_release_date.asc",
      },
    }).then((res) => {
      const minReleaseDate = res.results[0].release_date;
      const minYear = parseInt(new Date(minReleaseDate).getFullYear());
      setMinYear(minYear);
    });

    // Fetch max year of available films
    fetchData({
      endpoint: `/discover/${type}`,
      queryParams: {
        sort_by: "primary_release_date.desc",
      },
    }).then((res) => {
      const maxReleaseDate = res.results[0].release_date;
      const maxYear = parseInt(new Date(maxReleaseDate).getFullYear());
      setMaxYear(maxYear);
    });
  }, [type]);

  // Use Effect for set available Release Dates
  useEffect(() => {
    setReleaseDate([minYear, maxYear]);
  }, [minYear, maxYear]);

  // Use Effect for Search Params
  useEffect(() => {
    if (current.get("release_date")) {
      const releaseDateParams = current.get("release_date").split(".");
      const searchMinYear = parseInt(releaseDateParams[0]);
      const searchMaxYear = parseInt(releaseDateParams[2]);

      if (minYear !== searchMinYear || maxYear !== searchMaxYear) {
        setReleaseDate([searchMinYear, searchMaxYear]);
      }
    }

    if (current.get("with_genres")) {
      const genresParams = current.get("with_genres").split(",");
      const searchGenres = genresParams.map((genreId) =>
        genresData?.find((genre) => parseInt(genre.id) === parseInt(genreId))
      );
      const searchGenresOptions = searchGenres?.map(
        (genre) =>
          genre && {
            value: genre.id,
            label: genre.name,
          }
      );
      setGenre(searchGenresOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genresData]);

  return (
    <div className={`flex lg:px-4`}>
      <aside
        className={`p-4 w-full lg:max-w-[300px] h-[calc(100svh-66px-1rem)] lg:sticky top-[66px] bg-base-100 bg-opacity-[95%] lg:bg-secondary lg:bg-opacity-20 backdrop-blur lg:rounded-3xl overflow-y-auto flex flex-col gap-4 fixed inset-x-0 z-20 transition-all lg:translate-x-0 ${
          isFilterActive ? `translate-x-0` : `-translate-x-full`
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsFilterActive(false)}
          className={`grid place-content-center aspect-square absolute top-0 right-0 ml-auto z-50 p-4 pointer-events-auto lg:hidden`}
        >
          <IonIcon icon={close} className={`text-3xl`} />
        </button>

        {/* Title */}
        <span className={`font-bold text-2xl`}>Filters</span>

        {/* Release Date */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Release Date</span>
          <div className={`w-full px-3`}>
            <Slider
              getAriaLabel={() => "Release Date"}
              value={releaseDate}
              onChange={handleReleaseDateChange}
              valueLabelDisplay="off"
              min={minYear}
              max={maxYear}
              marks={releaseDateMarks}
              sx={sliderStyles}
            />
          </div>
        </section>

        {/* Genre */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Genre</span>
          <Select
            options={genresData && genresOptions}
            onChange={handleGenreChange}
            value={genre}
            styles={inputStyles}
            placeholder={`Select`}
            isMulti
          />
        </section>

        {/* Language */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Language</span>
          <Select
            options={languagesData && languagesOptions}
            onChange={handleLanguageChange}
            styles={inputStyles}
            placeholder={`Select`}
            isMulti
          />
        </section>

        {/* Cast */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Cast</span>
          <AsyncSelect
            loadOptions={castsLoadOptions}
            onChange={handleCastChange}
            styles={inputStyles}
            placeholder={`Search`}
            isMulti
          />
        </section>

        {/* Crew */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Crew</span>
          <AsyncSelect
            loadOptions={crewsLoadOptions}
            onChange={handleCrewChange}
            styles={inputStyles}
            placeholder={`Search`}
            isMulti
          />
        </section>

        {/* Keyword */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Keyword</span>
          <AsyncSelect
            loadOptions={keywordsLoadOptions}
            onChange={handleKeywordChange}
            styles={inputStyles}
            placeholder={`Search`}
            isMulti
          />
        </section>

        {/* Company */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Company</span>
          <AsyncSelect
            loadOptions={companiesLoadOptions}
            onChange={handleCompanyChange}
            styles={inputStyles}
            placeholder={`Search`}
            isMulti
          />
        </section>

        {/* Rating */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Rating</span>
          <div className={`w-full px-3`}>
            <Slider
              getAriaLabel={() => "Rating"}
              value={rating}
              onChange={handleRatingChange}
              valueLabelDisplay="off"
              min={0}
              max={100}
              marks={ratingMarks}
              sx={sliderStyles}
            />
          </div>
        </section>

        {/* Rating Count Minimum */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Rating Count Minimum</span>
          <div className={`w-full px-3`}>
            <Slider
              getAriaLabel={() => "Rating Count Minimum"}
              value={ratingMinimum}
              onChange={handleRatingMinimumChange}
              valueLabelDisplay="off"
              min={0}
              max={100}
              marks={ratingMinimumMarks}
              sx={sliderStyles}
            />
          </div>
        </section>

        {/* Runtime */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Runtime</span>
          <div className={`w-full px-3`}>
            <Slider
              getAriaLabel={() => "Runtime"}
              value={runtime}
              onChange={handleRuntimeChange}
              valueLabelDisplay="off"
              min={0}
              step={10}
              max={300}
              marks={runtimeMarks}
              sx={sliderStyles}
            />
          </div>
        </section>
      </aside>
      <div className={`p-4 lg:pr-0 flex flex-col gap-4 w-full`}>
        {/* Options */}
        <section
          className={`flex flex-col lg:flex-row items-center lg:justify-between gap-4`}
        >
          {/* Search bar */}
          <div
            className={`w-full bg-gray-600 bg-opacity-[90%] backdrop-blur rounded-2xl flex items-center`}
          >
            <span
              className={`pointer-events-none absolute inset-y-0 pl-4 flex items-center`}
            >
              <IonIcon icon={search} className={`text-gray-400 text-lg`} />
            </span>

            <input
              type="text"
              placeholder="Search"
              className="text-white bg-transparent w-full px-4 py-4 pl-10"
            />
          </div>

          <div
            className={`flex items-center justify-center gap-1 flex-wrap lg:flex-nowrap`}
          >
            {/* Sort by type */}
            <FormControl fullWidth className={`w-[150px]`}>
              <SelectMUI
                labelId="sort-by-type-label"
                id="sort-by-type"
                value={sortByType}
                onChange={handleSortByTypeChange}
                sx={selectStyles}
              >
                <MenuItem value={`popularity`}>Popularity</MenuItem>
                <MenuItem value={`vote_count`}>Rating</MenuItem>
                <MenuItem value={`primary_release_date`}>Release Date</MenuItem>
                <MenuItem value={`revenue`}>Revenue</MenuItem>
                <MenuItem value={`budget`}>Budget</MenuItem>
              </SelectMUI>
            </FormControl>

            {/* Sort by order */}
            <FormControl fullWidth className={`w-[150px]`}>
              <SelectMUI
                labelId="sort-by-order-label"
                id="sort-by-order"
                value={sortByOrder}
                onChange={handleSortByOrderChange}
                sx={selectStyles}
              >
                <MenuItem value={`asc`}>Ascending</MenuItem>
                <MenuItem value={`desc`}>Descending</MenuItem>
              </SelectMUI>
            </FormControl>

            {/* Display */}
            <div
              className={`p-1 rounded-full bg-gray-900 flex items-center gap-1`}
            >
              <ButtonSwitcher
                onClick={() => setIsGrid(true)}
                icon={grid}
                condition={isGrid}
              />
              <ButtonSwitcher
                onClick={() => setIsGrid(false)}
                icon={menu}
                condition={!isGrid}
              />
            </div>

            {/* Filter button */}
            <button
              onClick={() => setIsFilterActive(true)}
              className={`btn btn-ghost bg-secondary bg-opacity-20 aspect-square lg:hidden`}
            >
              <IonIcon icon={filter} className={`text-2xl`} />
            </button>
          </div>
        </section>

        {/* Films List */}
        <section
          className={`grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-5`}
        >
          {genresData &&
            films?.map((film) => {
              const filmGenres =
                film.genre_ids && genresData
                  ? film.genre_ids.map((genreId) =>
                      genresData.find((genre) => genre.id === genreId)
                    )
                  : [];

              return (
                <FilmCard
                  key={film.id}
                  film={film}
                  genres={filmGenres}
                  isTvPage={isTvPage}
                />
              );
            })}
        </section>
      </div>
    </div>
  );
}

function ButtonSwitcher({ icon, onClick, condition }) {
  return (
    <button
      onClick={onClick}
      className={`aspect-square flex p-2 rounded-full transition-all ${
        condition
          ? `bg-white text-base-100`
          : `bg-transparent text-white hocus:bg-base-100`
      }`}
    >
      <IonIcon icon={icon} />
    </button>
  );
}
