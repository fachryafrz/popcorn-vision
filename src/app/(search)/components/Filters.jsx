import { fetchData } from "@/lib/fetch";
import { IonIcon } from "@ionic/react";
import { Input, Slider } from "@mui/material";
import { close } from "ionicons/icons";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import tmdbNetworks from "@/json/tv_network_ids_12_26_2023.json";
import { getRandomOptionsPlaceholder } from "@/lib/getRandomOptionsPlaceholder";
import moment from "moment";

import dayjs from "dayjs";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function Filters({
  type,
  isQueryParams,
  router,
  pathname,
  searchParams,
  current,
  inputStyles,
  setNotAvailable,
  sortByOrderOptions,
  sortByTypeOptions,
  setLoading,
  setFilms,
  genresData,
  setGenresData,
  setTotalSearchPages,
  setCurrentSearchPage,
  searchQuery,
  setSearchQuery,
  setNotFoundMessage,
  sortByType,
  setSortByType,
  sortByOrder,
  setSortByOrder,
  isFilterActive,
  setIsFilterActive,
  releaseDate,
  setReleaseDate,
  minYear,
  setMinYear,
  maxYear,
  setMaxYear,
  searchAPIParams,
  languagesData,
  totalSearchResults,
  setTotalSearchResults,
}) {
  const isTvPage = type === "tv";
  const [userLocation, setUserLocation] = useState(null);

  // State
  // const [languagesData, setLanguagesData] = useState([]);
  const [providersData, setProvidersData] = useState([]);
  const [networksData, setNetworksData] = useState(tmdbNetworks);
  const [castData, setCastData] = useState();
  const [crewData, setCrewData] = useState();
  const [keywordData, setKeywordData] = useState();
  const [companyData, setCompanyData] = useState();
  const [isGrid, setIsGrid] = useState(true);

  // React-Select Placeholder
  const [genresInputPlaceholder, setGenresInputPlaceholder] = useState();
  const [languagesInputPlaceholder, setLanguagesInputPlaceholder] = useState();
  const [providersInputPlaceholder, setProvidersInputPlaceholder] = useState();

  // Filters
  const [status, setStatus] = useState([]);
  const [tvType, setTvType] = useState([]);
  const [releaseDateSlider, setReleaseDateSlider] = useState([
    minYear,
    maxYear,
  ]);
  const [genre, setGenre] = useState();
  const [language, setLanguage] = useState();
  const [provider, setProvider] = useState();
  const [network, setNetwork] = useState([]);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [keyword, setKeyword] = useState([]);
  const [company, setCompany] = useState([]);
  const [ratingSlider, setRatingSlider] = useState([0, 100]);
  const [runtimeSlider, setRuntimeSlider] = useState([0, 300]);
  const [rating, setRating] = useState([0, 100]);
  const [runtime, setRuntime] = useState([0, 300]);

  // Pre-loaded Options
  const tvSeriesStatus = useMemo(
    () => [
      "All",
      "Returning Series",
      "Planned",
      "In Production",
      "Ended",
      "Canceled",
      "Pilot",
    ],
    [],
  );
  const tvSeriesType = useMemo(
    () => [
      "All",
      "Documentary",
      "News",
      "Miniseries",
      "Reality",
      "Scripted",
      "Talk Show",
      "Video",
    ],
    [],
  );

  // Handle Slider Marks/Labels
  const releaseDateMarks = useMemo(
    () => [
      {
        value: minYear,
        label: releaseDateSlider[0],
      },
      {
        value: maxYear,
        label: releaseDateSlider[1],
      },
    ],
    [releaseDateSlider, minYear, maxYear],
  );
  const ratingMarks = useMemo(
    () => [
      {
        value: 0,
        label: ratingSlider[0],
      },
      {
        value: 100,
        label: ratingSlider[1],
      },
    ],
    [ratingSlider],
  );
  const runtimeMarks = useMemo(
    () => [
      {
        value: 0,
        label: runtimeSlider[0],
      },
      {
        value: 300,
        label: runtimeSlider[1],
      },
    ],
    [runtimeSlider],
  );

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
  const handleDatePickerChange = (newValue) => {
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

  // Handle MUI Slider, Select & Input Styles
  const sliderStyles = useMemo(() => {
    return {
      color: "#fff",
      "& .MuiSlider-markLabel": {
        color: "#fff",
        backgroundColor: "#131720",
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
  }, []);
  const muiInputStyles = useMemo(() => {
    return {
      "& input": {
        color: "#fff",
        backgroundColor: "#131720",
        borderRadius: "999px",
        maxWidth: "45px",
        fontSize: "14px",
        textAlign: "center",
        padding: "0.25rem",
      },
      "& input[type=number]::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "& input[type=number]::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    };
  }, []);

  // Handle Select Options
  const genresOptions = useMemo(() => {
    return genresData?.map((genre) => ({
      value: genre.id,
      label: genre.name,
    }));
  }, [genresData]);
  const languagesOptions = useMemo(() => {
    return languagesData?.map((language) => ({
      value: language.iso_639_1,
      label: language.english_name,
    }));
  }, [languagesData]);
  const providersOptions = useMemo(() => {
    return providersData?.map((provider) => ({
      value: provider.provider_id,
      label: provider.provider_name,
    }));
  }, [providersData]);
  const networksLoadOptions = (inputValue, callback) => {
    setTimeout(() => {
      const options = networksData.map((network) => ({
        value: network.id,
        label: network.name,
      }));
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
      );
      callback(filteredOptions);
    }, 2000);
  };

  const timerRef = useRef(null);
  const castsLoadOptions = useCallback((inputValue, callback) => {
    const fetchDataWithDelay = async () => {
      // Delay pengambilan data selama 500ms setelah pengguna berhenti mengetik
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Lakukan pengambilan data setelah delay
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
          option.label.toLowerCase().includes(inputValue.toLowerCase()),
        );
        callback(filteredOptions);
      });
    };

    // Hapus pemanggilan sebelumnya jika ada
    clearTimeout(timerRef.current);

    // Set timer untuk memanggil fetchDataWithDelay setelah delay
    timerRef.current = setTimeout(() => {
      fetchDataWithDelay();
    }, 1000);
  }, []);
  const crewsLoadOptions = useCallback((inputValue, callback) => {
    const fetchDataWithDelay = async () => {
      // Delay pengambilan data selama 500ms setelah pengguna berhenti mengetik
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Lakukan pengambilan data setelah delay
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
          option.label.toLowerCase().includes(inputValue.toLowerCase()),
        );
        callback(filteredOptions);
      });
    };

    // Hapus pemanggilan sebelumnya jika ada
    clearTimeout(timerRef.current);

    // Set timer untuk memanggil fetchDataWithDelay setelah delay
    timerRef.current = setTimeout(() => {
      fetchDataWithDelay();
    }, 1000);
  }, []);
  const keywordsLoadOptions = useCallback((inputValue, callback) => {
    const fetchDataWithDelay = async () => {
      // Delay pengambilan data selama 500ms setelah pengguna berhenti mengetik
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Lakukan pengambilan data setelah delay
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
          option.label.toLowerCase().includes(inputValue.toLowerCase()),
        );
        callback(filteredOptions);
      });
    };

    // Hapus pemanggilan sebelumnya jika ada
    clearTimeout(timerRef.current);

    // Set timer untuk memanggil fetchDataWithDelay setelah delay
    timerRef.current = setTimeout(() => {
      fetchDataWithDelay();
    }, 1000);
  }, []);
  const companiesLoadOptions = useCallback((inputValue, callback) => {
    const fetchDataWithDelay = async () => {
      // Delay pengambilan data selama 500ms setelah pengguna berhenti mengetik
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Lakukan pengambilan data setelah delay
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
          option.label.toLowerCase().includes(inputValue.toLowerCase()),
        );
        callback(filteredOptions);
      });
    };

    // Hapus pemanggilan sebelumnya jika ada
    clearTimeout(timerRef.current);

    // Set timer untuk memanggil fetchDataWithDelay setelah delay
    timerRef.current = setTimeout(() => {
      fetchDataWithDelay();
    }, 1000);
  }, []);

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
  const handleLanguageChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.map((option) => option.value);

      if (value.length === 0) {
        current.delete("with_original_language");
      } else {
        current.set("with_original_language", value);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router],
  );
  const handleProviderChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.map((option) => option.value);

      if (value.length === 0) {
        current.delete("watch_providers");
      } else {
        current.set("watch_providers", value);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router],
  );
  const handleNetworkChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.map((option) => option.value);

      if (value.length === 0) {
        current.delete("with_networks");
      } else {
        current.set("with_networks", value);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router],
  );
  const handleCastChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.map((option) => option.value);

      if (value.length === 0) {
        current.delete("with_cast");
      } else {
        current.set("with_cast", value);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router],
  );
  const handleCrewChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.map((option) => option.value);

      if (value.length === 0) {
        current.delete("with_crew");
      } else {
        current.set("with_crew", value);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router],
  );
  const handleKeywordChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.map((option) => option.value);

      if (value.length === 0) {
        current.delete("with_keywords");
      } else {
        current.set("with_keywords", value);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router],
  );
  const handleCompanyChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.map((option) => option.value);

      if (value.length === 0) {
        current.delete("with_companies");
      } else {
        current.set("with_companies", value);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router],
  );

  // Handle checkbox change
  const handleStatusChange = (event) => {
    const isChecked = event.target.checked;
    const inputValue = parseInt(event.target.value);

    let updatedValue = [...status]; // Salin status sebelumnya

    if (inputValue === -1) {
      // Jika yang dipilih adalah "All", bersihkan semua status
      updatedValue = [];
    } else {
      if (isChecked && !updatedValue.includes(inputValue.toString())) {
        // Tambahkan status yang dipilih jika belum ada
        updatedValue.push(inputValue.toString());
      } else {
        // Hapus status yang tidak dipilih lagi
        updatedValue = updatedValue.filter((s) => s !== inputValue.toString());
      }
    }

    // Lakukan pengaturan URL
    if (updatedValue.length === 0) {
      setStatus(updatedValue);
      current.delete("status");
    } else {
      current.set("status", updatedValue.join(","));
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };
  const handleTypeChange = (event) => {
    const isChecked = event.target.checked;
    const inputValue = parseInt(event.target.value);

    let updatedValue = [...tvType]; // Salin status sebelumnya

    if (inputValue === -1) {
      // Jika yang dipilih adalah "All", bersihkan semua status
      updatedValue = [];
    } else {
      if (isChecked && !updatedValue.includes(inputValue.toString())) {
        // Tambahkan status yang dipilih jika belum ada
        updatedValue.push(inputValue.toString());
      } else {
        // Hapus status yang tidak dipilih lagi
        updatedValue = updatedValue.filter((s) => s !== inputValue.toString());
      }
    }

    // Lakukan pengaturan URL
    if (updatedValue.length === 0) {
      setTvType(updatedValue);
      current.delete("type");
    } else {
      current.set("type", updatedValue.join(","));
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  // Handle not available
  const handleNotAvailable = () => {
    setNotAvailable(
      "Filters cannot be applied, please clear the search input.",
    );
  };

  // Use Effect for getting user location
  useEffect(() => {
    setUserLocation(localStorage.getItem("user-location"));
  }, []);

  // Use Effect for cycling random options placeholder
  useEffect(() => {
    const updatePlaceholders = () => {
      const genresPlaceholder = getRandomOptionsPlaceholder(genresOptions);
      const languagesPlaceholder =
        getRandomOptionsPlaceholder(languagesOptions);
      const providersPlaceholder =
        getRandomOptionsPlaceholder(providersOptions);

      // Set placeholders for your elements here
      // For example:
      setGenresInputPlaceholder(genresPlaceholder);
      setLanguagesInputPlaceholder(languagesPlaceholder);
      setProvidersInputPlaceholder(providersPlaceholder);
    };

    updatePlaceholders();

    // Set interval to run every 5 seconds
    const intervalId = setInterval(updatePlaceholders, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [genresOptions, languagesOptions, providersOptions]);

  // Use Effect for fetching streaming providers based on user location
  useEffect(() => {
    // Fetch watch providers by user country code
    if (userLocation) {
      fetchData({
        endpoint: `/watch/providers/movie`,
        queryParams: {
          watch_region: JSON.parse(userLocation).countryCode,
        },
      }).then((res) => {
        setProvidersData(res.results);
      });
    }
  }, [isTvPage, type, userLocation]);

  // Use Effect for set available Release Dates
  useEffect(() => {
    setReleaseDate([minYear, maxYear]);
    setReleaseDateSlider([minYear, maxYear]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minYear, maxYear]);

  // Use Effect for Select with preloaded data
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

      searchAPIParams["with_original_language"] = searchParams.get(
        "with_original_language",
      );
    } else {
      setLanguage(null);

      delete searchAPIParams["with_original_language"];
    }

    // Providers
    if (searchParams.get("watch_providers")) {
      const providersParams = searchParams.get("watch_providers").split(",");
      const searchProviders = providersParams.map((providerId) =>
        providersData?.find(
          (provider) => parseInt(provider.provider_id) === parseInt(providerId),
        ),
      );
      const searchProvidersOptions = searchProviders?.map(
        (provider) =>
          provider && {
            value: provider.provider_id,
            label: provider.provider_name,
          },
      );
      setProvider(searchProvidersOptions);

      searchAPIParams["with_watch_providers"] =
        searchParams.get("watch_providers");
      searchAPIParams["watch_region"] = JSON.parse(userLocation)?.countryCode;
    } else {
      setProvider(null);

      delete searchAPIParams["with_watch_providers"];
      delete searchAPIParams["watch_region"];
    }

    // Network
    if (searchParams.get("with_networks")) {
      const networksParams = searchParams.get("with_networks").split(",");
      const searchNetworks = networksParams.map((networkId) =>
        networksData?.find(
          (network) => parseInt(network.id) === parseInt(networkId),
        ),
      );

      const searchNetworksOptions = searchNetworks?.map(
        (network) =>
          network && {
            value: network.id,
            label: network.name,
          },
      );
      setNetwork(searchNetworksOptions);

      searchAPIParams["with_networks"] = searchParams.get("with_networks");
    } else {
      setNetwork(null);

      delete searchAPIParams["with_networks"];
    }
  }, [
    genresData,
    languagesData,
    providersData,
    networksData,
    searchParams,
    searchAPIParams,
    userLocation,
  ]);

  // Use Effect for Search Params
  useEffect(() => {
    // TV Series Status
    if (searchParams.get("status")) {
      const statusParams = searchParams.get("status").split(",");
      setStatus(statusParams);

      searchAPIParams["with_status"] = searchParams.get("status");
    } else {
      delete searchAPIParams["with_status"];
    }

    // TV Series Type
    if (searchParams.get("type")) {
      const typeParams = searchParams.get("type").split(",");
      setTvType(typeParams);

      searchAPIParams["with_type"] = searchParams.get("type");
    } else {
      delete searchAPIParams["with_type"];
    }

    // Release date
    // if (searchParams.get("release_date")) {
    //   const releaseDateParams = searchParams.get("release_date").split(".");
    //   const searchMinYear = parseInt(releaseDateParams[0]);
    //   const searchMaxYear = parseInt(releaseDateParams[2]);

    //   // if (minYear !== searchMinYear || maxYear !== searchMaxYear) {
    //   setReleaseDate([searchMinYear, searchMaxYear]);
    //   setReleaseDateSlider([searchMinYear, searchMaxYear]);
    //   // }

    //   const fullMinYear = `${searchMinYear}-01-01`;
    //   const fullMaxYear = `${searchMaxYear}-12-31`;

    //   if (!isTvPage) {
    //     searchAPIParams["primary_release_date.gte"] = fullMinYear;
    //     searchAPIParams["primary_release_date.lte"] = fullMaxYear;
    //   } else {
    //     searchAPIParams["first_air_date.gte"] = fullMinYear;
    //     searchAPIParams["first_air_date.lte"] = fullMaxYear;
    //   }
    // } else {
    //   setReleaseDate([minYear, maxYear]);
    //   setReleaseDateSlider([minYear, maxYear]);

    //   if (!isTvPage) {
    //     delete searchAPIParams["primary_release_date.gte"];
    //     delete searchAPIParams["primary_release_date.lte"];
    //   } else {
    //     delete searchAPIParams["first_air_date.gte"];
    //     delete searchAPIParams["first_air_date.lte"];
    //   }
    // }

    // Cast
    if (searchParams.get("with_cast")) {
      const castParams = searchParams.get("with_cast").split(",");
      const fetchPromises = castParams.map((castId) => {
        return fetchData({
          endpoint: `/person/${castId}`,
        });
      });

      searchAPIParams["with_cast"] = searchParams.get("with_cast");

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
    } else {
      setCast(null);

      delete searchAPIParams["with_cast"];
    }

    // Crew
    if (searchParams.get("with_crew")) {
      const crewParams = searchParams.get("with_crew").split(",");
      const fetchPromises = crewParams.map((crewId) => {
        return fetchData({
          endpoint: `/person/${crewId}`,
        });
      });

      searchAPIParams["with_crew"] = searchParams.get("with_crew");

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
    } else {
      setCrew(null);

      delete searchAPIParams["with_crew"];
    }

    // Keyword
    if (searchParams.get("with_keywords")) {
      const keywordParams = searchParams.get("with_keywords").split(",");
      const fetchPromises = keywordParams.map((keywordId) => {
        return fetchData({
          endpoint: `/keyword/${keywordId}`,
        });
      });

      searchAPIParams["with_keywords"] = searchParams.get("with_keywords");

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
    } else {
      setKeyword(null);

      delete searchAPIParams["with_keywords"];
    }

    // Company
    if (searchParams.get("with_companies")) {
      const companyParams = searchParams.get("with_companies").split(",");
      const fetchPromises = companyParams.map((companyId) => {
        return fetchData({
          endpoint: `/company/${companyId}`,
        });
      });

      searchAPIParams["with_companies"] = searchParams.get("with_companies");

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
    } else {
      setCompany(null);

      delete searchAPIParams["with_companies"];
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

        searchAPIParams["vote_count.gte"] = searchRating[0];
        searchAPIParams["vote_count.lte"] = searchRating[1];
      } else {
        delete searchAPIParams["vote_count.gte"];
        delete searchAPIParams["vote_count.lte"];
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

        searchAPIParams["with_runtime.gte"] = searchRuntime[0];
        searchAPIParams["with_runtime.lte"] = searchRuntime[1];
      } else {
        delete searchAPIParams["with_runtime.gte"];
        delete searchAPIParams["with_runtime.lte"];
      }
    }

    // Sort by
    if (searchParams.get("sort_by")) {
      const sortByParams = searchParams.get("sort_by").split(".");
      const searchSortByType = sortByParams.map((param) =>
        sortByTypeOptions.find((option) => option.value === param),
      )[0];
      const searchSortByOrder = sortByParams.map((param) =>
        sortByOrderOptions.find((option) => option.value === param),
      )[1];

      if (sortByType.value !== searchSortByType.value) {
        setSortByType(searchSortByType);
      }

      if (sortByOrder.value !== searchSortByOrder.value) {
        setSortByOrder(searchSortByOrder);
      }

      searchAPIParams["sort_by"] = searchParams.get("sort_by");
    } else {
      delete searchAPIParams["sort_by"];
    }

    // Options (o)
    if (searchParams.get("o")) {
      const optionsParams = searchParams.get("o");

      const today = moment().format("YYYY-MM-DD");
      const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
      const monthsAgo = moment().subtract(1, "months").format("YYYY-MM-DD");
      const monthsLater = moment().add(1, "months").format("YYYY-MM-DD");

      searchAPIParams["without_genres"] = 18;

      if (optionsParams === "now_playing" || optionsParams === "on_the_air") {
        if (!isTvPage) {
          searchAPIParams["primary_release_date.gte"] = monthsAgo;
          searchAPIParams["primary_release_date.lte"] = today;
        } else {
          searchAPIParams["first_air_date.gte"] = monthsAgo;
          searchAPIParams["first_air_date.lte"] = today;
        }
      }

      if (optionsParams === "upcoming") {
        if (!isTvPage) {
          searchAPIParams["primary_release_date.gte"] = tomorrow;
          searchAPIParams["primary_release_date.lte"] = monthsLater;
        } else {
          searchAPIParams["first_air_date.gte"] = tomorrow;
          searchAPIParams["first_air_date.lte"] = monthsLater;
        }
      }
    } else {
      delete searchAPIParams["without_genres"];
      if (!isTvPage) {
        delete searchAPIParams["primary_release_date.gte"];
        delete searchAPIParams["primary_release_date.lte"];
      } else {
        delete searchAPIParams["first_air_date.gte"];
        delete searchAPIParams["first_air_date.lte"];
      }
    }

    // Datepicker
    if (searchParams.get("release_date")) {
      const datepickerParams = searchParams.get("release_date").split("..");
      const searchMinDatepicker = dayjs(datepickerParams[0]);
      const searchMaxDatepicker = dayjs(datepickerParams[1]);

      setMinDatepicker(searchMinDatepicker);
      setMaxDatepicker(searchMaxDatepicker);

      if (!isTvPage) {
        searchAPIParams["primary_release_date.gte"] =
          searchMinDatepicker.format("YYYY-MM-DD");
        searchAPIParams["primary_release_date.lte"] =
          searchMaxDatepicker.format("YYYY-MM-DD");
      }

      if (isTvPage) {
        searchAPIParams["first_air_date.gte"] =
          searchMinDatepicker.format("YYYY-MM-DD");
        searchAPIParams["first_air_date.lte"] =
          searchMaxDatepicker.format("YYYY-MM-DD");
      }
    } else {
      if (!isTvPage) {
        delete searchAPIParams["primary_release_date.gte"];
        delete searchAPIParams["primary_release_date.lte"];
      }

      if (isTvPage) {
        delete searchAPIParams["first_air_date.gte"];
        delete searchAPIParams["first_air_date.lte"];
      }
    }

    // Search Query
    if (searchParams.get("query")) {
      const searchQuery = searchParams.get("query");

      searchAPIParams["query"] = searchQuery;

      setSearchQuery(searchQuery);
    } else {
      delete searchAPIParams["query"];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rating,
    runtime,
    searchParams,
    searchAPIParams,
    sortByOrder.value,
    sortByOrderOptions,
    sortByType.value,
    sortByTypeOptions,
    minYear,
    maxYear,
    setSearchQuery,
    setSortByType,
    setSortByOrder,
    isTvPage,
  ]);

  // Use Effect for Search
  useEffect(() => {
    setLoading(true);

    const performSearch = () => {
      fetchData({
        endpoint: `/discover/${type}`,
        queryParams: searchAPIParams,
      })
        .then((res) => {
          setFilms(res.results);
          setLoading(false);
          setTotalSearchPages(res.total_pages);
          setCurrentSearchPage(1);
          setTotalSearchResults(res.total_results);

          setTimeout(() => {
            setNotFoundMessage("No film found");
          }, 10000);
        })
        .catch((error) => {
          console.error("Error fetching films:", error);
        });
    };

    const performSearchQuery = () => {
      fetchData({
        endpoint: `/search/multi`,
        queryParams: {
          query: searchQuery,
          include_adult: false,
          language: "en-US",
          page: 1,
        },
      })
        .then((res) => {
          // Filter movies based on release date
          const filteredMovies = res.results.filter(
            (film) => film.media_type === "movie" || film.media_type === "tv",
          );
          setFilms(filteredMovies);
          setLoading(false);
          setTotalSearchPages(res.total_pages);
          setCurrentSearchPage(1);
          setTotalSearchResults(res.total_results);

          setTimeout(() => {
            setNotFoundMessage("No film found");
          }, 10000);
        })
        .catch((error) => {
          console.error("Error fetching films:", error);
        });
    };

    if (!searchParams.get("query")) {
      performSearch();
    }

    if (searchParams.get("query") && searchQuery) {
      performSearchQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, searchAPIParams, searchQuery, searchParams]);

  const [minDatepicker, setMinDatepicker] = useState(dayjs(new Date()));
  const [maxDatepicker, setMaxDatepicker] = useState(
    dayjs(new Date(maxYear, 11, 31)),
  );

  return (
    <aside
      onMouseOver={() => isQueryParams && handleNotAvailable()}
      onMouseLeave={() => setNotAvailable("")}
      className={`fixed inset-x-0 top-[66px] z-30 flex h-[calc(100svh-66px)] w-full flex-col gap-4 overflow-y-auto bg-[#2A313E] bg-opacity-[95%] p-4 backdrop-blur transition-all lg:sticky lg:h-[calc(100svh-66px-1rem)] lg:max-w-[300px] lg:translate-x-0 lg:rounded-3xl ${
        isFilterActive ? `translate-x-0` : `-translate-x-full`
      }`}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsFilterActive(false)}
        className={`pointer-events-auto absolute right-0 top-0 z-50 ml-auto grid aspect-square place-content-center p-4 lg:hidden`}
      >
        <IonIcon icon={close} className={`text-3xl`} />
      </button>

      {/* Title */}
      {/* <span className={`font-bold text-2xl`}>Filters</span> */}

      {/* Tv Series Status */}
      {isTvPage && (
        <section>
          <span className={`font-medium`}>Status</span>
          <ul className={`mt-2`}>
            {tvSeriesStatus.map((statusName, i) => {
              const index = i - 1;
              const isChecked = status.length === 0 && i === 0;

              return (
                <li key={index}>
                  <div className={`flex items-center`}>
                    <input
                      type={`checkbox`}
                      id={`status_${index}`}
                      name={`status`}
                      className={`checkbox checkbox-md`}
                      value={index}
                      checked={isChecked || status.includes(index.toString())}
                      onChange={handleStatusChange}
                      disabled={isQueryParams}
                    />

                    <label
                      htmlFor={`status_${index}`}
                      className={`${
                        isQueryParams ? `cursor-default` : `cursor-pointer`
                      } flex w-full py-2 pl-2`}
                    >
                      {statusName}
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Release Date */}
      {/* <section className={`flex flex-col gap-1`}>
        <span className={`font-medium`}>Release Date</span>
        <div className={`w-full px-3`}>
          {minYear && maxYear ? (
            <>
              <Slider
                getAriaLabel={() => "Release Date"}
                value={releaseDateSlider}
                onChange={(event, newValue) => setReleaseDateSlider(newValue)}
                onChangeCommitted={handleReleaseDateChange}
                valueLabelDisplay="off"
                min={minYear}
                max={maxYear}
                // marks={releaseDateMarks}
                sx={sliderStyles}
                disabled={isQueryParams}
              />

              <div className={`-mx-3 flex justify-between`}>
                <Input
                  value={releaseDateSlider[0]}
                  size="small"
                  onChange={({ target }) => {
                    const newValue = target.value;

                    setReleaseDateSlider((prev) => [newValue, prev[1]]);
                  }}
                  onBlur={(e) => handleReleaseDateChange(e, releaseDateSlider)}
                  inputProps={{
                    step: 1,
                    min: minYear,
                    max: maxYear,
                    type: "number",
                    "aria-labelledby": "min-release-date-slider",
                  }}
                  disableUnderline
                  sx={muiInputStyles}
                />

                <Input
                  value={releaseDateSlider[1]}
                  size="small"
                  onChange={({ target }) => {
                    const newValue = target.value;

                    setReleaseDateSlider((prev) => [prev[0], newValue]);
                  }}
                  onBlur={(e) => handleReleaseDateChange(e, releaseDateSlider)}
                  inputProps={{
                    step: 1,
                    min: minYear,
                    max: maxYear,
                    type: "number",
                    "aria-labelledby": "max-release-date-slider",
                  }}
                  disableUnderline
                  sx={muiInputStyles}
                />
              </div>
            </>
          ) : (
            <span
              className={`block w-full text-center text-xs italic text-gray-400`}
            >
              Finding oldest & latest...
            </span>
          )}
        </div>
      </section> */}

      {/* NOTE: NEW Release Date */}
      <section className={`flex flex-col gap-1`}>
        <span className={`font-medium`}>Release Date</span>
        <div className={`w-full px-3 pt-2`}>
          {minYear && maxYear ? (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className={`-mx-3 flex flex-row items-center gap-1`}>
                  <MobileDatePicker
                    // label="Start"
                    minDate={dayjs(`${minYear}-01-01`)}
                    maxDate={dayjs(`${maxYear}-12-31`)}
                    defaultValue={minDatepicker}
                    value={minDatepicker}
                    onChange={(newValue) => {
                      setMinDatepicker(newValue);
                      handleDatePickerChange([
                        dayjs(newValue).format("YYYY-MM-DD"),
                        dayjs(maxDatepicker).format("YYYY-MM-DD"),
                      ]);
                    }}
                    slotProps={{
                      textField: { size: "small" },
                    }}
                    format="DD MMM YYYY"
                    sx={{
                      "& .MuiInputBase-root": {
                        color: "#fff",
                        backgroundColor: "#131720",
                        borderRadius: "1.5rem",
                        cursor: "text",
                        fontSize: "14px",
                        "& button": {
                          color: "#fff",
                        },
                        "& fieldset": {
                          borderColor: "#79808B",
                        },
                        "&:hover fieldset": {
                          borderColor: "#fff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#fff",
                        },
                      },
                      label: {
                        color: "#fff",
                        "&.Mui-focused": {
                          color: "#fff",
                        },
                      },
                    }}
                  />

                  <span className={`text-base`}>-</span>

                  <MobileDatePicker
                    // label="End"
                    minDate={dayjs(`${minYear}-01-01`)}
                    maxDate={dayjs(`${maxYear}-12-31`)}
                    defaultValue={maxDatepicker}
                    value={maxDatepicker}
                    onChange={(newValue) => {
                      setMaxDatepicker(newValue);
                      handleDatePickerChange([
                        dayjs(minDatepicker).format("YYYY-MM-DD"),
                        dayjs(newValue).format("YYYY-MM-DD"),
                      ]);
                    }}
                    slotProps={{
                      textField: { size: "small" },
                    }}
                    format="DD MMM YYYY"
                    sx={{
                      "& .MuiInputBase-root": {
                        color: "#fff",
                        backgroundColor: "#131720",
                        borderRadius: "1.5rem",
                        cursor: "text",
                        fontSize: "14px",
                        "& button": {
                          color: "#fff",
                        },
                        "& fieldset": {
                          borderColor: "#79808B",
                        },
                        "&:hover fieldset": {
                          borderColor: "#fff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#fff",
                        },
                      },
                      label: {
                        color: "#fff",
                        "&.Mui-focused": {
                          color: "#fff",
                        },
                      },
                    }}
                  />
                </div>
              </LocalizationProvider>
            </>
          ) : (
            <span
              className={`block w-full text-center text-xs italic text-gray-400`}
            >
              Finding oldest & latest...
            </span>
          )}
        </div>
      </section>

      {/* Streaming (Watch Providers) */}
      <section className={`flex flex-col gap-1`}>
        <span className={`font-medium`}>Streaming</span>
        {userLocation ? (
          <Select
            options={providersData && providersOptions}
            onChange={handleProviderChange}
            value={provider}
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
            placeholder={providersInputPlaceholder}
            isDisabled={isQueryParams}
            isMulti
          />
        ) : (
          <span
            className={`block w-full text-center text-xs italic text-gray-400`}
          >
            Please enable location
          </span>
        )}
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
              cursor: "pointer",
            }),
          }}
          placeholder={genresInputPlaceholder}
          isDisabled={isQueryParams}
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
              cursor: "pointer",
            }),
          }}
          placeholder={languagesInputPlaceholder}
          isDisabled={isQueryParams}
          isMulti
        />
      </section>

      {/* Networks */}
      {isTvPage && (
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Networks</span>
          <AsyncSelect
            noOptionsMessage={() => "Type to search"}
            loadingMessage={() => "Searching..."}
            loadOptions={networksLoadOptions}
            onChange={handleNetworkChange}
            value={network}
            styles={inputStyles}
            placeholder={`Search TV networks...`}
            isDisabled={isQueryParams}
            isMulti
          />
        </section>
      )}

      {/* Cast */}
      {!isTvPage && (
        <section className={`flex flex-col gap-1`}>
          <span className={`font-medium`}>Actor</span>
          <AsyncSelect
            noOptionsMessage={() => "Type to search"}
            loadingMessage={() => "Searching..."}
            loadOptions={castsLoadOptions}
            onChange={handleCastChange}
            value={cast}
            styles={inputStyles}
            placeholder={`Search actor...`}
            isDisabled={isQueryParams}
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
            isDisabled={isQueryParams}
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
          isDisabled={isQueryParams}
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
          isDisabled={isQueryParams}
          isMulti
        />
      </section>

      {/* Tv Series Type */}
      {isTvPage && (
        <section>
          <span className={`font-medium`}>Types</span>
          <ul className={`mt-2`}>
            {tvSeriesType.map((typeName, i) => {
              const index = i - 1;
              const isChecked = tvType.length === 0 && i === 0;

              return (
                <li key={index}>
                  <div className={`flex items-center`}>
                    <input
                      type={`checkbox`}
                      id={`type_${index}`}
                      name={`type`}
                      className={`checkbox checkbox-md`}
                      value={index}
                      checked={isChecked || tvType.includes(index.toString())}
                      onChange={handleTypeChange}
                      disabled={isQueryParams}
                    />

                    <label
                      htmlFor={`type_${index}`}
                      className={`${
                        isQueryParams ? `cursor-default` : `cursor-pointer`
                      } flex w-full py-2 pl-2`}
                    >
                      {typeName}
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

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
            disabled={isQueryParams}
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
            disabled={isQueryParams}
          />
        </div>
      </section>
    </aside>
  );
}
