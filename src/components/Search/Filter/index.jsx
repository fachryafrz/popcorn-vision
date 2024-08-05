import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
import { useEffect, useMemo } from "react";
import moment from "moment";
import TVSeriesStatus from "./TVSeriesStatus";
import ReleaseDate from "./ReleaseDate";
import Streaming from "./Streaming";
import Genre from "./Genre";
import Runtime from "./Runtime";
import Network from "./Network";
import Cast from "./Cast";
import Crew from "./Crew";
import Company from "./Company";
import Rating from "./Rating";
import TVSeriesType from "./TVSeriesType";
import Language from "./Language";
import Keyword from "./Keyword";

export default function Filters({
  type,
  isQueryParams,
  router,
  pathname,
  searchParams,
  current,
  inputStyles,
  genresData,
  setSearchQuery,
  isFilterActive,
  setIsFilterActive,
  releaseDate,
  minYear,
  maxYear,
  searchAPIParams,
  languagesData,
  handleNotAvailable,
  handleClearNotAvailable,
}) {
  const isTvPage = type === "tv";

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

  // Use Effect for Search Params
  useEffect(() => {
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
    }
    // else {
    //   delete searchAPIParams["without_genres"];
    //   if (!isTvPage) {
    //     delete searchAPIParams["primary_release_date.gte"];
    //     delete searchAPIParams["primary_release_date.lte"];
    //   } else {
    //     delete searchAPIParams["first_air_date.gte"];
    //     delete searchAPIParams["first_air_date.lte"];
    //   }
    // }

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
    searchParams,
    searchAPIParams,
    minYear,
    maxYear,
    setSearchQuery,
    isTvPage,
  ]);

  return (
    <aside
      onMouseOver={() => isQueryParams && handleNotAvailable()}
      onMouseLeave={() => handleClearNotAvailable()}
      className={`fixed inset-x-0 top-[66px] z-30 flex h-[calc(100dvh-66px)] w-full flex-col gap-4 overflow-y-auto bg-[#2A313E] bg-opacity-[95%] p-4 backdrop-blur transition-all lg:sticky lg:h-[calc(100dvh-66px-1rem)] lg:max-w-[300px] lg:translate-x-0 lg:rounded-3xl ${
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

      {/* TV Series Status */}
      {isTvPage && <TVSeriesStatus searchAPIParams={searchAPIParams} />}

      {/* Release Date */}
      <ReleaseDate
        isTvPage={isTvPage}
        searchAPIParams={searchAPIParams}
        minYear={minYear}
        maxYear={maxYear}
        releaseDate={releaseDate}
      />

      {/* Streaming (Watch Providers) */}
      <Streaming searchAPIParams={searchAPIParams} inputStyles={inputStyles} />

      {/* Genre */}
      <Genre
        searchAPIParams={searchAPIParams}
        genresData={genresData}
        inputStyles={inputStyles}
      />

      {/* Runtime */}
      <Runtime searchAPIParams={searchAPIParams} sliderStyles={sliderStyles} />

      {/* Networks */}
      {isTvPage && (
        <Network searchAPIParams={searchAPIParams} inputStyles={inputStyles} />
      )}

      {/* Cast */}
      {!isTvPage && (
        <Cast searchAPIParams={searchAPIParams} inputStyles={inputStyles} />
      )}

      {/* Crew */}
      {!isTvPage && (
        <Crew searchAPIParams={searchAPIParams} inputStyles={inputStyles} />
      )}

      {/* Company */}
      <Company searchAPIParams={searchAPIParams} inputStyles={inputStyles} />

      {/* Rating */}
      <Rating searchAPIParams={searchAPIParams} sliderStyles={sliderStyles} />

      {/* TV Series Type */}
      {isTvPage && <TVSeriesType searchAPIParams={searchAPIParams} />}

      {/* Language */}
      <Language
        searchAPIParams={searchAPIParams}
        inputStyles={inputStyles}
        languagesData={languagesData}
      />

      {/* NOTE: Keyword */}
      <Keyword searchAPIParams={searchAPIParams} inputStyles={inputStyles} />
    </aside>
  );
}
