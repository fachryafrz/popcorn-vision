/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { fetchData } from "@/app/api/route";
import FilmCard from "@/app/components/FilmCard";
import { slugify } from "@/app/lib/slugify";
import { IonIcon } from "@ionic/react";
import { FormControl, InputLabel, MenuItem, Slider } from "@mui/material";
import {
  close,
  closeCircle,
  closeCircleOutline,
  filter,
  grid,
  menu,
  search,
} from "ionicons/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import SelectMUI from "@mui/material/Select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "../components/Navbar";

export default function Search({ type = "movie" }) {
  const isTvPage = type === "tv";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  const [loading, setLoading] = useState(true);
  const [films, setFilms] = useState();
  const [genresData, setGenresData] = useState();
  const [languagesData, setLanguagesData] = useState();
  const [castData, setCastData] = useState();
  const [crewData, setCrewData] = useState();
  const [keywordData, setKeywordData] = useState();
  const [companyData, setCompanyData] = useState();
  const [isGrid, setIsGrid] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [minYear, setMinYear] = useState();
  const [maxYear, setMaxYear] = useState();

  // React-Select Placeholder
  const [genresInputPlaceholder, setGenresInputPlaceholder] = useState();
  const [languagesInputPlaceholder, setLanguagesInputPlaceholder] = useState();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [releaseDateSlider, setReleaseDateSlider] = useState([
    minYear,
    maxYear,
  ]);
  const [releaseDate, setReleaseDate] = useState([minYear, maxYear]);
  const [genre, setGenre] = useState();
  const [language, setLanguage] = useState();
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [keyword, setKeyword] = useState([]);
  const [company, setCompany] = useState([]);
  const [ratingSlider, setRatingSlider] = useState([0, 100]);
  const [runtimeSlider, setRuntimeSlider] = useState([0, 300]);
  const [rating, setRating] = useState([0, 100]);
  const [runtime, setRuntime] = useState([0, 300]);

  // MUI Select
  const [sortByType, setSortByType] = useState(`popularity`);
  const [sortByOrder, setSortByOrder] = useState(`desc`);

  // Handle Slider Marks/Labels
  const releaseDateMarks = [
    {
      value: minYear,
      label: releaseDateSlider[0],
    },
    {
      value: maxYear,
      label: releaseDateSlider[1],
    },
  ];
  const ratingMarks = [
    {
      value: 0,
      label: ratingSlider[0],
    },
    {
      value: 100,
      label: ratingSlider[1],
    },
  ];
  const runtimeMarks = [
    {
      value: 0,
      label: runtimeSlider[0],
    },
    {
      value: 300,
      label: runtimeSlider[1],
    },
  ];

  // Handle MUI Slider Change
  const handleReleaseDateChange = (event, newValue) => {
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
    const value = rating ? `${newValue[0]},${newValue[1]}` : "";

    // NOTE: Using vote_count.gte & vote_count.lte
    if (!value) {
      current.delete("vote_count");
    } else {
      current.set("vote_count", `${newValue[0]}..${newValue[1]}`);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleRuntimeChange = (event, newValue) => {
    const value = runtime ? `${newValue[0]},${newValue[1]}` : "";

    // NOTE: Using with_runtime.gte & with_runtime.lte
    if (!value) {
      current.delete("with_runtime");
    } else {
      current.set("with_runtime", `${newValue[0]}..${newValue[1]}`);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  // Handle MUI Select Change
  const handleSortByTypeChange = (event) => {
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

  // Handle MUI Slider & Select Styles
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

  // Handle React-Select Input Styles
  const inputStyles = {
    placeholder: (styles) => ({
      ...styles,
      fontSize: "14px",
      whiteSpace: "nowrap",
    }),
    control: (styles) => ({
      ...styles,
      color: "#fff",
      backgroundColor: "#202735",
      borderWidth: "1px",
      borderColor: "#79808B",
      borderRadius: "9999px",
    }),
    input: (styles) => ({
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
      backgroundColor: "#202735",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        color: "#fff",
        backgroundColor: "#202735",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.1)",
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
    }),
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
    const value = selectedOption.map((option) => option.value);

    if (!value) {
      current.delete("with_original_language");
    } else {
      current.set("with_original_language", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleCastChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (!value) {
      current.delete("with_cast");
    } else {
      current.set("with_cast", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleCrewChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (!value) {
      current.delete("with_crew");
    } else {
      current.set("with_crew", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleKeywordChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (!value) {
      current.delete("with_keywords");
    } else {
      current.set("with_keywords", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleCompanyChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (!value) {
      current.delete("with_companies");
    } else {
      current.set("with_companies", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  // Random options placeholder
  const getRandomOptionsPlaceholder = (options) => {
    if (!options) return "Loading...";

    const numberOfOptions = options.length;
    const randomStart = Math.floor(Math.random() * numberOfOptions);
    const randomEnd =
      randomStart + 2 > numberOfOptions ? numberOfOptions : randomStart + 2;

    const selectedOptions = options
      .slice(randomStart, randomEnd)
      .map((option) => option?.label)
      .join(", ");

    return `${selectedOptions}...`;
  };

  // Use Effect for cycling random options placeholder
  useEffect(() => {
    const updatePlaceholders = () => {
      const genresPlaceholder = getRandomOptionsPlaceholder(genresOptions);
      const languagesPlaceholder =
        getRandomOptionsPlaceholder(languagesOptions);

      // Set placeholders for your elements here
      // For example:
      setGenresInputPlaceholder(genresPlaceholder);
      setLanguagesInputPlaceholder(languagesPlaceholder);
    };

    // Set interval to run every 5 seconds
    const intervalId = setInterval(updatePlaceholders, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [genresOptions, languagesOptions]); // Add dependencies if needed

  // Use Effect for fetching data
  useEffect(() => {
    if (!searchParams.get("query")) {
      // Get default film list
      // defaultFilms();
    }

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
      const minReleaseDate = !isTvPage
        ? res.results[0].release_date
        : res.results[0].first_air_date;
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
      const maxReleaseDate = !isTvPage
        ? res.results[0].release_date
        : res.results[0].first_air_date;
      const maxYear = parseInt(new Date(maxReleaseDate).getFullYear());
      setMaxYear(maxYear);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Use Effect for set available Release Dates
  useEffect(() => {
    setReleaseDate([minYear, maxYear]);
    setReleaseDateSlider([minYear, maxYear]);
  }, [minYear, maxYear]);

  // Use Effect for Search Params
  useEffect(() => {
    // Release date
    if (searchParams.get("release_date")) {
      const releaseDateParams = searchParams.get("release_date").split(".");
      const searchMinYear = parseInt(releaseDateParams[0]);
      const searchMaxYear = parseInt(releaseDateParams[2]);

      // if (minYear !== searchMinYear || maxYear !== searchMaxYear) {
      setReleaseDate([searchMinYear, searchMaxYear]);
      setReleaseDateSlider([searchMinYear, searchMaxYear]);
      // }
    }

    // Genres
    if (searchParams.get("with_genres")) {
      const genresParams = searchParams.get("with_genres").split(",");
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
    } else if (searchParams.get("with_genres") === "") {
      setGenre(null);
    }

    // Languages
    if (searchParams.get("with_original_language")) {
      const languagesParams = searchParams
        .get("with_original_language")
        .split(",");
      const searchLanguages = languagesParams.map((languageId) =>
        languagesData?.find(
          (language) => language.iso_639_1 === languageId.toLowerCase()
        )
      );
      const searchLanguagesOptions = searchLanguages?.map(
        (language) =>
          language && {
            value: language.iso_639_1,
            label: language.english_name,
          }
      );
      setLanguage(searchLanguagesOptions);
    } else if (searchParams.get("with_original_language") === "") {
      setLanguage(null);
    }

    // Cast
    if (searchParams.get("with_cast")) {
      const castParams = searchParams.get("with_cast").split(",");
      const fetchPromises = castParams.map((castId) => {
        return fetchData({
          endpoint: `/person/${castId}`,
        });
      });

      Promise.all(fetchPromises)
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
    } else if (searchParams.get("with_cast") === "") {
      setCast(null);
    }

    // Crew
    if (searchParams.get("with_crew")) {
      const crewParams = searchParams.get("with_crew").split(",");
      const fetchPromises = crewParams.map((crewId) => {
        return fetchData({
          endpoint: `/person/${crewId}`,
        });
      });

      Promise.all(fetchPromises)
        .then((responses) => {
          const uniqueCrew = [...new Set(responses)]; // Remove duplicates if any
          const searchCrew = uniqueCrew.map((crew) => ({
            value: crew.id,
            label: crew.name,
          }));
          setCrew(searchCrew);
        })
        .catch((error) => {
          console.error("Error fetching crew:", error);
        });
    } else if (searchParams.get("with_crew") === "") {
      setCrew(null);
    }

    // Keyword
    if (searchParams.get("with_keywords")) {
      const keywordParams = searchParams.get("with_keywords").split(",");
      const fetchPromises = keywordParams.map((keywordId) => {
        return fetchData({
          endpoint: `/keyword/${keywordId}`,
        });
      });

      Promise.all(fetchPromises)
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
    } else if (searchParams.get("with_keywords") === "") {
      setKeyword(null);
    }

    // Company
    if (searchParams.get("with_companies")) {
      const companyParams = searchParams.get("with_companies").split(",");
      const fetchPromises = companyParams.map((companyId) => {
        return fetchData({
          endpoint: `/company/${companyId}`,
        });
      });

      Promise.all(fetchPromises)
        .then((responses) => {
          const uniqueCompany = [...new Set(responses)]; // Remove duplicates if any
          const searchCompany = uniqueCompany.map((company) => ({
            value: company.id,
            label: company.name,
          }));
          setCompany(searchCompany);
        })
        .catch((error) => {
          console.error("Error fetching company:", error);
        });
    } else if (searchParams.get("with_companies") === "") {
      setCompany(null);
    }

    // Rating
    if (searchParams.get("vote_count")) {
      const ratingParams = searchParams.get("vote_count").split(".");
      const searchRating = [
        parseInt(ratingParams[0]),
        parseInt(ratingParams[2]),
      ];

      if (rating[0] !== searchRating[0] || rating[1] !== searchRating[1]) {
        setRating(searchRating);
        setRatingSlider(searchRating);
      }
    }

    // Runtime
    if (searchParams.get("with_runtime")) {
      const runtimeParams = searchParams.get("with_runtime").split(".");
      const searchRuntime = [
        parseInt(runtimeParams[0]),
        parseInt(runtimeParams[2]),
      ];

      if (runtime[0] !== searchRuntime[0] || runtime[1] !== searchRuntime[1]) {
        setRuntime(searchRuntime);
        setRuntimeSlider(searchRuntime);
      }
    }

    // Sort by
    if (searchParams.get("sort_by")) {
      const sortByParams = searchParams.get("sort_by").split(".");
      const searchSortByType = sortByParams[0];
      const searchSortByOrder = sortByParams[1];

      if (sortByType !== searchSortByType) {
        setSortByType(searchSortByType);
      }

      if (sortByOrder !== searchSortByOrder) {
        setSortByOrder(searchSortByOrder);
      }
    }

    // Search Query
    if (searchParams.get("query")) {
      const searchQuery = searchParams.get("query");

      setSearchQuery(searchQuery);
    }
  }, [
    router,
    searchParams,
    genresData,
    languagesData,
    maxYear,
    minYear,
    sortByType,
    sortByOrder,
    rating,
    runtime,
  ]);

  // Use Effect for Search
  useEffect(() => {
    const minFullYear = `${releaseDate[0]}-01-01`;
    const maxFullYear = `${releaseDate[1]}-12-31`;

    const performSearch = () => {
      setLoading(true);

      const searchAPIParams = {
        include_adult: false,
        sort_by: `${sortByType}.${sortByOrder}`,
      };

      if (!isTvPage) {
        searchAPIParams["primary_release_date.gte"] = minFullYear;
        searchAPIParams["primary_release_date.lte"] = maxFullYear;
      } else {
        searchAPIParams["first_air_date.gte"] = minFullYear;
        searchAPIParams["first_air_date.lte"] = maxFullYear;
      }

      if (searchParams.get("with_genres")) {
        searchAPIParams.with_genres = genre
          ?.map((genre) => genre?.value)
          .join(",");
      }
      if (searchParams.get("with_original_language")) {
        searchAPIParams.with_original_language = language
          ?.map((language) => language?.value)
          .join(",");
      }
      if (searchParams.get("with_cast")) {
        searchAPIParams.with_cast = cast?.map((cast) => cast?.value).join(",");
      }
      if (searchParams.get("with_crew")) {
        searchAPIParams.with_crew = crew?.map((crew) => crew?.value).join(",");
      }
      if (searchParams.get("with_keywords")) {
        searchAPIParams.with_keywords = keyword
          ?.map((keyword) => keyword?.value)
          .join(",");
      }
      if (searchParams.get("with_companies")) {
        searchAPIParams.with_companies = company
          ?.map((company) => company?.value)
          .join(",");
      }
      if (searchParams.get("vote_count") && rating) {
        searchAPIParams["vote_count.gte"] = rating[0];
        searchAPIParams["vote_count.lte"] = rating[1];
      }
      if (searchParams.get("with_runtime") && runtime) {
        searchAPIParams["with_runtime.gte"] = runtime[0];
        searchAPIParams["with_runtime.lte"] = runtime[1];
      }

      fetchData({
        endpoint: `/discover/${type}`,
        queryParams: searchAPIParams,
      })
        .then((res) => {
          setFilms(res.results);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching films:", error);
        });
    };

    const performSearchQuery = () => {
      setLoading(true);

      fetchData({
        endpoint: `/search/${type}`,
        queryParams: {
          query: searchQuery,
          include_adult: false,
          language: "en-US",
          page: 1,
        },
      })
        .then((res) => {
          // Filter movies based on release date
          const filteredMovies = res.results.filter((film) =>
            !isTvPage
              ? film.release_date
              : film.first_air_date >= `${releaseDate[0]}-01-01` && !isTvPage
              ? film.release_date
              : film.first_air_date <= `${releaseDate[1]}-12-31`
          );
          setFilms(filteredMovies);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching films:", error);
        });
    };

    if (!searchParams.get("query")) {
      performSearch();
    } else {
      performSearchQuery();
    }
  }, [
    searchParams,
    cast,
    company,
    crew,
    genre,
    keyword,
    language,
    rating,
    releaseDate,
    runtime,
    sortByOrder,
    sortByType,
    searchQuery,
    type,
    isTvPage,
  ]);

  return (
    <div className={`flex lg:px-4`}>
      <aside
        className={`p-4 w-full lg:max-w-[300px] h-[calc(100dvh-66px)] lg:h-[calc(100dvh-66px-1rem)] lg:sticky top-[66px] bg-[#2A313E] bg-opacity-[95%] backdrop-blur lg:rounded-3xl overflow-y-auto flex flex-col gap-4 fixed inset-x-0 z-30 transition-all lg:translate-x-0 ${
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
              value={releaseDateSlider}
              onChange={(event, newValue) => setReleaseDateSlider(newValue)}
              onChangeCommitted={handleReleaseDateChange}
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
            styles={{
              ...inputStyles,
              dropdownIndicator: (styles) => ({
                ...styles,
                display: "block",
                "&:hover": {
                  color: "#fff",
                },
              }),
            }}
            placeholder={genresInputPlaceholder}
            isMulti
          />
        </section>

        {/* Language */}
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
              }),
            }}
            placeholder={languagesInputPlaceholder}
            isMulti
          />
        </section>

        {/* Cast */}
        {!isTvPage && (
          <section className={`flex flex-col gap-1`}>
            <span className={`font-medium`}>Cast</span>
            <AsyncSelect
              noOptionsMessage={() => "Type to search"}
              loadingMessage={() => "Searching..."}
              loadOptions={castsLoadOptions}
              onChange={handleCastChange}
              value={cast}
              styles={inputStyles}
              placeholder={`Search actor...`}
              isMulti
            />
          </section>
        )}

        {/* Crew */}
        {!isTvPage && (
          <section className={`flex flex-col gap-1`}>
            <span className={`font-medium`}>Crew</span>
            <AsyncSelect
              noOptionsMessage={() => "Type to search"}
              loadingMessage={() => "Searching..."}
              loadOptions={crewsLoadOptions}
              onChange={handleCrewChange}
              value={crew}
              styles={inputStyles}
              placeholder={`Search director, creator...`}
              isMulti
            />
          </section>
        )}

        {/* Keyword */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Keyword</span>
          <AsyncSelect
            noOptionsMessage={() => "Type to search"}
            loadingMessage={() => "Searching..."}
            loadOptions={keywordsLoadOptions}
            onChange={handleKeywordChange}
            value={keyword}
            styles={inputStyles}
            placeholder={`Search keyword...`}
            isMulti
          />
        </section>

        {/* Company */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Company</span>
          <AsyncSelect
            noOptionsMessage={() => "Type to search"}
            loadingMessage={() => "Searching..."}
            loadOptions={companiesLoadOptions}
            onChange={handleCompanyChange}
            value={company}
            styles={inputStyles}
            placeholder={`Search company...`}
            isMulti
          />
        </section>

        {/* Rating */}
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Rating</span>
          <div className={`w-full px-3`}>
            <Slider
              getAriaLabel={() => "Rating"}
              value={ratingSlider}
              onChange={(event, newValue) => setRatingSlider(newValue)}
              onChangeCommitted={handleRatingChange}
              valueLabelDisplay="off"
              min={0}
              max={100}
              marks={ratingMarks}
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
              value={runtimeSlider}
              onChange={(event, newValue) => setRuntimeSlider(newValue)}
              onChangeCommitted={handleRuntimeChange}
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

      <div className={`p-4 lg:pr-0 flex flex-col gap-2 w-full`}>
        {/* Options */}
        <section
          className={`flex flex-col lg:flex-row items-center lg:justify-between gap-4`}
        >
          {/* Search bar */}
          <div className={`lg:hidden w-full`}>
            <SearchBar />
          </div>

          <h1 className={`capitalize font-bold text-3xl`}>
            {!isTvPage ? `Movie` : `TV Series`}
          </h1>

          <div
            className={`w-full flex gap-2 items-center justify-between lg:justify-end flex-col sm:flex-row`}
          >
            <div
              className={`flex justify-center gap-1 flex-wrap sm:flex-nowrap`}
            >
              {/* Sort by type */}
              <FormControl
                fullWidth
                size="small"
                className={`w-[150px] md:w-[200px]`}
              >
                <SelectMUI
                  labelId="sort-by-type-label"
                  id="sort-by-type"
                  value={sortByType}
                  onChange={handleSortByTypeChange}
                  sx={selectStyles}
                >
                  <MenuItem value={`popularity`}>Popularity</MenuItem>
                  <MenuItem value={`vote_count`}>Rating</MenuItem>
                  <MenuItem value={`primary_release_date`}>
                    Release Date
                  </MenuItem>
                  <MenuItem value={`revenue`}>Revenue</MenuItem>
                  <MenuItem value={`budget`}>Budget</MenuItem>
                </SelectMUI>
              </FormControl>

              {/* Sort by order */}
              <FormControl
                fullWidth
                size="small"
                className={`w-[150px] md:w-[200px]`}
              >
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
            </div>

            <div className={`flex items-center gap-1 flex-wrap sm:flex-nowrap`}>
              {/* Clear all filters */}
              <div
                className={`flex gap-2 items-center flex-wrap flex-row-reverse mr-1`}
              >
                {searchParams.get("query") ||
                releaseDate[0] !== minYear ||
                releaseDate[1] !== maxYear ||
                genre ||
                language ||
                cast ||
                crew ||
                keyword ||
                company ||
                rating[0] !== 0 ||
                rating[1] !== 100 ||
                runtime[0] !== 0 ||
                runtime[1] !== 300 ? (
                  <button
                    onClick={() => {
                      setTimeout(() => {
                        setSearchQuery("");
                        setReleaseDate([minYear, maxYear]);
                        setReleaseDateSlider([minYear, maxYear]);
                        setGenre(null);
                        setLanguage(null);
                        setCast(null);
                        setCrew(null);
                        setKeyword(null);
                        setCompany(null);
                        setRating([0, 100]);
                        setRatingSlider([0, 100]);
                        setRuntime([0, 300]);
                        setRuntimeSlider([0, 300]);
                        setSortByType("popularity");
                        setSortByOrder("desc");
                      }, 500);

                      router.push(`${pathname}`);
                      // router.refresh();
                      // defaultFilms();
                    }}
                    className={`pr-4 flex items-center gap-1 text-gray-400 bg-secondary bg-opacity-20 hocus:bg-red-600 hocus:text-white transition-all rounded-full p-2`}
                  >
                    <IonIcon icon={closeCircle} className={`text-xl`} />
                    <span className={`text-sm whitespace-nowrap`}>
                      Clear all filters
                    </span>
                  </button>
                ) : (
                  <span>No filter selected</span>
                )}
              </div>

              {/* Filter button */}
              <button
                onClick={() => setIsFilterActive(true)}
                className={`btn btn-ghost bg-secondary bg-opacity-20 aspect-square lg:hidden`}
              >
                <IonIcon icon={filter} className={`text-2xl`} />
              </button>
            </div>
          </div>
        </section>

        {/* List of active filters */}
        {/* <section
          className={`hidden gap-2 items-center flex-wrap flex-row-reverse`}
        >
          {releaseDate[0] !== minYear || releaseDate[1] !== maxYear ? (
            <ButtonFilter
              searchParam={"release_date"}
              defaultValue={[minYear, maxYear]}
              setVariable={setReleaseDate}
              title={`Release Date:`}
              info={`${releaseDate[0]}-${releaseDate[1]}`}
            />
          ) : null}

          {genre?.length == 1 ? (
            <ButtonFilter
              searchParam={"with_genres"}
              defaultValue={null}
              setVariable={setGenre}
              title={`Genre:`}
              info={genre[0].label}
            />
          ) : genre?.length == 2 ? (
            <ButtonFilter
              searchParam={"with_genres"}
              defaultValue={null}
              setVariable={setGenre}
              title={`Genre:`}
              info={`${genre[0].label} and ${genre[1].label}`}
            />
          ) : genre?.length > 2 ? (
            <ButtonFilter
              searchParam={"with_genres"}
              defaultValue={null}
              setVariable={setGenre}
              title={`Genre:`}
              info={`${genre[0].label}, ${genre[1].label} and ${
                genre.length - 2
              } more`}
            />
          ) : null}

          {language?.length == 1 ? (
            <ButtonFilter
              searchParam={"with_original_language"}
              defaultValue={null}
              setVariable={setLanguage}
              title={`Language:`}
              info={language[0].label}
            />
          ) : language?.length == 2 ? (
            <ButtonFilter
              searchParam={"with_original_language"}
              defaultValue={null}
              setVariable={setLanguage}
              title={`Language:`}
              info={`${language[0].label} and ${language[1].label}`}
            />
          ) : language?.length > 2 ? (
            <ButtonFilter
              searchParam={"with_original_language"}
              defaultValue={null}
              setVariable={setLanguage}
              title={`Language:`}
              info={`${language[0].label}, ${language[1].label} and ${
                language.length - 2
              } more`}
            />
          ) : null}

          {cast?.length == 1 ? (
            <ButtonFilter
              searchParam={"with_cast"}
              defaultValue={null}
              setVariable={setCast}
              title={`Cast:`}
              info={cast[0].label}
            />
          ) : cast?.length == 2 ? (
            <ButtonFilter
              searchParam={"with_cast"}
              defaultValue={null}
              setVariable={setCast}
              title={`Cast:`}
              info={`${cast[0].label} and ${cast[1].label}`}
            />
          ) : cast?.length > 2 ? (
            <ButtonFilter
              searchParam={"with_cast"}
              defaultValue={null}
              setVariable={setCast}
              title={`Cast:`}
              info={`${cast[0].label}, ${cast[1].label} and ${
                cast.length - 2
              } more`}
            />
          ) : null}

          {crew?.length == 1 ? (
            <ButtonFilter
              searchParam={"with_crew"}
              defaultValue={null}
              setVariable={setCrew}
              title={`Crew:`}
              info={crew[0].label}
            />
          ) : crew?.length == 2 ? (
            <ButtonFilter
              searchParam={"with_crew"}
              defaultValue={null}
              setVariable={setCrew}
              title={`Crew:`}
              info={`${crew[0].label} and ${crew[1].label}`}
            />
          ) : crew?.length > 2 ? (
            <ButtonFilter
              searchParam={"with_crew"}
              defaultValue={null}
              setVariable={setCrew}
              title={`Crew:`}
              info={`${crew[0].label}, ${crew[1].label} and ${
                crew.length - 2
              } more`}
            />
          ) : null}

          {keyword?.length == 1 ? (
            <ButtonFilter
              searchParam={"with_keywords"}
              defaultValue={null}
              setVariable={setKeyword}
              title={`Keyword:`}
              info={keyword[0].label}
            />
          ) : keyword?.length == 2 ? (
            <ButtonFilter
              searchParam={"with_keywords"}
              defaultValue={null}
              setVariable={setKeyword}
              title={`Keyword:`}
              info={`${keyword[0].label} and ${keyword[1].label}`}
            />
          ) : keyword?.length > 2 ? (
            <ButtonFilter
              searchParam={"with_keywords"}
              defaultValue={null}
              setVariable={setKeyword}
              title={`Keyword:`}
              info={`${keyword[0].label}, ${keyword[1].label} and ${
                keyword.length - 2
              } more`}
            />
          ) : null}

          {company?.length == 1 ? (
            <ButtonFilter
              searchParam={"with_companies"}
              defaultValue={null}
              setVariable={setCompany}
              title={`Company:`}
              info={company[0].label}
            />
          ) : company?.length == 2 ? (
            <ButtonFilter
              searchParam={"with_companies"}
              defaultValue={null}
              setVariable={setCompany}
              title={`Company:`}
              info={`${company[0].label} and ${company[1].label}`}
            />
          ) : company?.length > 2 ? (
            <ButtonFilter
              searchParam={"with_companies"}
              defaultValue={null}
              setVariable={setCompany}
              title={`Company:`}
              info={`${company[0].label}, ${company[1].label} and ${
                company.length - 2
              } more`}
            />
          ) : null}

          {rating[0] !== 0 || rating[1] !== 100 ? (
            <ButtonFilter
              searchParam={"vote_count"}
              defaultValue={[0, 100]}
              setVariable={setRating}
              setVariableSlider={setRatingSlider}
              title={`Rating:`}
              info={`${rating[0]}-${rating[1]}`}
            />
          ) : null}

          {runtime[0] !== 0 || runtime[1] !== 300 ? (
            <ButtonFilter
              searchParam={"with_runtime"}
              defaultValue={[0, 300]}
              setVariable={setRuntime}
              setVariableSlider={setRuntimeSlider}
              title={`Runtime:`}
              info={`${runtime[0]}-${runtime[1]}`}
            />
          ) : null}
        </section> */}

        {loading ? (
          <>
            {/* Loading films */}
            <section>
              <span>Loading...</span>
            </section>
          </>
        ) : (
          <>
            {/* Films list */}
            <section
              className={`grid gap-2 sm:gap-3 grid-cols-3 md:grid-cols-4 xl:grid-cols-5`}
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
          </>
        )}
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

function ButtonFilter({
  title,
  info,
  setVariable,
  defaultValue,
  setVariableSlider = null,
  searchParam,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  return (
    <button
      onClick={() => {
        // setVariable(defaultValue);
        // if (setVariableSlider) setVariableSlider(defaultValue);
        current.delete(searchParam);
        const updatedSearchParams = new URLSearchParams(current.toString());
        router.push(`${pathname}?${updatedSearchParams}`);
      }}
      className={`flex gap-1 text-sm items-center bg-gray-900 p-2 px-3 rounded-full hocus:bg-red-700 hocus:line-through`}
    >
      <span>{`${title} ${info}`}</span>
    </button>
  );
}
