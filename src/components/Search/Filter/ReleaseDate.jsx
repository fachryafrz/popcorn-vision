import { useEffect, useState, useMemo,  } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ReleaseDate({
  isTvPage,
  searchAPIParams,
  minYear,
  maxYear,
  releaseDate,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;

  const today = dayjs();
  const endOfNextYear = today.add(1, "year").endOf("year");

  const [minDatepicker, setMinDatepicker] = useState(today);
  const [maxDatepicker, setMaxDatepicker] = useState(endOfNextYear);

  const handleDatePickerChange = (newValue) => {
    const value = releaseDate ? `${newValue[0]}..${newValue[1]}` : "";

    if (!value) {
      current.delete("release_date");
    } else {
      current.set("release_date", `${newValue[0]}..${newValue[1]}`);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
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

      setMinDatepicker(today);
      setMaxDatepicker(endOfNextYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, searchAPIParams, minYear, maxYear, isTvPage]);

  return (
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
                  disabled={isQueryParams}
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
                  minDate={minDatepicker}
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
                  disabled={isQueryParams}
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
