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
import SearchSort from "../Sort";

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
  languagesData,
  handleNotAvailable,
  handleClearNotAvailable,
  userLocation,
  setUserLocation,
  locationError,
  setLocationError,
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
    // Search Query
    if (searchParams.get("query")) {
      const searchQuery = searchParams.get("query");

      setSearchQuery(searchQuery);
    } else {
    }
  }, [searchParams, setSearchQuery]);

  return (
    <aside
      onMouseOver={() => isQueryParams && handleNotAvailable()}
      onMouseLeave={() => handleClearNotAvailable()}
      className={`fixed inset-x-0 top-[66px] z-50 flex h-[calc(100dvh-66px)] w-full flex-col gap-4 overflow-y-auto bg-[#2A313E] bg-opacity-[95%] p-4 backdrop-blur transition-all lg:sticky lg:h-[calc(100dvh-66px-1rem)] lg:max-w-[300px] lg:translate-x-0 lg:rounded-3xl ${
        isFilterActive ? `translate-x-0` : `-translate-x-full`
      }`}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsFilterActive(false)}
        className={`pointer-events-auto absolute right-4 top-2 z-50  aspect-square  lg:hidden`}
      >
        <IonIcon icon={close} className={`text-3xl`} />
      </button>

      {/* Sort */}
      <section className={`flex flex-col gap-1 lg:hidden`}>
        <span className={`font-medium`}>Sort</span>
        <SearchSort
          handleNotAvailable={handleNotAvailable}
          handleClearNotAvailable={handleClearNotAvailable}
          inputStyles={inputStyles}
          setIsFilterActive={setIsFilterActive}
        />
      </section>

      {/* TV Series Status */}
      {isTvPage && <TVSeriesStatus />}

      {/* Release Date */}
      <ReleaseDate
        isTvPage={isTvPage}
        minYear={minYear}
        maxYear={maxYear}
        releaseDate={releaseDate}
      />

      {/* Streaming (Watch Providers) */}
      <Streaming
        inputStyles={inputStyles}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        locationError={locationError}
        setLocationError={setLocationError}
      />

      {/* Genre */}
      <Genre genresData={genresData} inputStyles={inputStyles} />

      {/* Networks */}
      {isTvPage && <Network inputStyles={inputStyles} />}

      {/* Cast */}
      {!isTvPage && <Cast inputStyles={inputStyles} />}

      {/* Crew */}
      {!isTvPage && <Crew inputStyles={inputStyles} />}

      {/* Company */}
      <Company inputStyles={inputStyles} />

      {/* Language */}
      <Language inputStyles={inputStyles} languagesData={languagesData} />

      {/* Keyword */}
      <Keyword inputStyles={inputStyles} />

      {/* TV Series Type */}
      {isTvPage && <TVSeriesType />}

      {/* Runtime */}
      <Runtime sliderStyles={sliderStyles} />

      {/* Rating */}
      <Rating sliderStyles={sliderStyles} />
    </aside>
  );
}
