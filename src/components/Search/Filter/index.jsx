import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
import { useMemo } from "react";
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
import RatingCount from "./RatingCount";
import { useSearchParams } from "next/navigation";
import { useToggleFilter } from "@/zustand/toggleFilter";

export default function Filters({
  type,
  inputStyles,
  genresData,
  minYear,
  maxYear,
  languagesData,
  handleNotAvailable,
  handleClearNotAvailable,
}) {
  const isTvPage = type === "tv";
  const searchParams = useSearchParams();
  const isQueryParams = searchParams.get("query");

  const { toggleFilter, setToggleFilter } = useToggleFilter();

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

  return (
    <aside
      onMouseOver={() => isQueryParams && handleNotAvailable()}
      onMouseLeave={() => handleClearNotAvailable()}
      className={`fixed inset-0 top-[66px] z-50 max-h-[calc(100dvh-66px)] transition-all duration-300 lg:static lg:z-0 lg:max-h-none lg:max-w-[300px] ${
        toggleFilter ? `translate-x-0` : `-translate-x-[calc(100%+1.5rem)]`
      }`}
    >
      {/* Close Button */}
      <button
        onClick={() => setToggleFilter(false)}
        className={`absolute right-4 top-2 z-50 aspect-square lg:hidden`}
      >
        <IonIcon
          icon={close}
          style={{
            fontSize: 34,
          }}
        />
      </button>

      <div
        className={`flex h-full flex-col gap-4 overflow-y-auto bg-neutral bg-opacity-[95%] p-4 backdrop-blur lg:sticky lg:top-[calc(66px+3px)] lg:max-h-[calc(100dvh-66px-1rem-3px)] lg:rounded-2xl lg:outline lg:outline-neutral`}
      >
        {/* Sort */}
        <section className={`flex flex-col gap-1 sm:hidden`}>
          <span className={`font-medium`}>Sort</span>
          <SearchSort
            handleNotAvailable={handleNotAvailable}
            handleClearNotAvailable={handleClearNotAvailable}
            inputStyles={inputStyles}
          />
        </section>

        {/* Release Date */}
        <ReleaseDate isTvPage={isTvPage} minYear={minYear} maxYear={maxYear} />

        {/* Streaming (Watch Providers) */}
        <Streaming inputStyles={inputStyles} />

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

        {/* Runtime */}
        <Runtime sliderStyles={sliderStyles} />

        {/* Rating */}
        <Rating sliderStyles={sliderStyles} />

        {/* Rating Count */}
        <RatingCount sliderStyles={sliderStyles} />

        {/* TV Shows Status */}
        {isTvPage && <TVSeriesStatus />}

        {/* TV Shows Type */}
        {isTvPage && <TVSeriesType />}
      </div>
    </aside>
  );
}
