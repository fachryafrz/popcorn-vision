import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQueryState, parseAsString } from "nuqs";

export default function ReleaseDate({ isTvPage, minYear, maxYear }) {
  const [releaseDate, setReleaseDate] = useQueryState(
    "release_date",
    parseAsString,
  );
  const [query] = useQueryState("query");

  const today = dayjs();
  const endOfNextYear = today.add(1, "year").endOf("year");

  const [minDatepicker, setMinDatepicker] = useState(today);
  const [maxDatepicker, setMaxDatepicker] = useState(endOfNextYear);

  const handleDatePickerChange = (newValue) => {
    const value = `${newValue[0]}..${newValue[1]}`;

    if (!value) {
      setReleaseDate(null);
    } else {
      setReleaseDate(value);
    }
  };

  useEffect(() => {
    // Datepicker
    if (releaseDate) {
      const [min, max] = releaseDate.split("..");
      const searchMinDatepicker = dayjs(min);
      const searchMaxDatepicker = dayjs(max);

      setMinDatepicker(searchMinDatepicker);
      setMaxDatepicker(searchMaxDatepicker);
    } else {
      setMinDatepicker(today);
      setMaxDatepicker(endOfNextYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [releaseDate, minYear, maxYear, isTvPage]);

  return (
    <section className={`flex flex-col gap-1`}>
      {/* NOTE: add h-8 to be aligned with the other filter */}
      <span className={`block h-8 font-medium`}>Release Date</span>

      <div className={`w-full px-3`}>
        {minYear && maxYear ? (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div
                className={`-mx-3 flex flex-row items-center justify-center gap-2 lg:gap-1`}
              >
                <MobileDatePicker
                  // label="Start"
                  className="w-full"
                  orientation="portrait"
                  minDate={dayjs(`${minYear}-01-01`)}
                  maxDate={dayjs(`${maxYear}-12-31`)}
                  defaultValue={minDatepicker}
                  value={minDatepicker}
                  onAccept={(newValue) => {
                    setMinDatepicker(newValue);
                    handleDatePickerChange([
                      dayjs(newValue).format("YYYY-MM-DD"),
                      dayjs(maxDatepicker).format("YYYY-MM-DD"),
                    ]);
                  }}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                  closeOnSelect={false}
                  disabled={query}
                  format="DD MMM YYYY"
                  sx={{
                    "& .MuiInputBase-root": {
                      color: "#fff",
                      backgroundColor: "#131720",
                      borderRadius: "1.5rem",
                      cursor: "text",
                      fontSize: "14px",
                      "& input": {
                        textAlign: "center",
                      },
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
                    ".Mui-disabled": {
                      color: "#fff",
                      WebkitTextFillColor: "#fff",
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
                  className="w-full"
                  orientation="portrait"
                  minDate={minDatepicker}
                  maxDate={dayjs(`${maxYear}-12-31`)}
                  defaultValue={maxDatepicker}
                  value={maxDatepicker}
                  onAccept={(newValue) => {
                    setMaxDatepicker(newValue);
                    handleDatePickerChange([
                      dayjs(minDatepicker).format("YYYY-MM-DD"),
                      dayjs(newValue).format("YYYY-MM-DD"),
                    ]);
                  }}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                  closeOnSelect={false}
                  disabled={query}
                  format="DD MMM YYYY"
                  sx={{
                    "& .MuiInputBase-root": {
                      color: "#fff",
                      backgroundColor: "#131720",
                      borderRadius: "1.5rem",
                      cursor: "text",
                      fontSize: "14px",
                      "& input": {
                        textAlign: "center",
                      },
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
                    ".Mui-disabled": {
                      color: "#fff",
                      WebkitTextFillColor: "#fff",
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
  );
}
