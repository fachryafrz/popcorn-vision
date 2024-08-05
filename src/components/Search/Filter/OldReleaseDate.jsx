import React from "react";

export default function OldReleaseDate() {
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

  return {
    /* <section className={`flex flex-col gap-1`}>
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
      </section> */
  };
}
