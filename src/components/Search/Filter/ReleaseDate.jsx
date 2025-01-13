import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from 'next-nprogress-bar';

export default function ReleaseDate({ isTvPage, minYear, maxYear }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const isQueryParams = searchParams.get("query");

  const today = dayjs();
  const endOfNextYear = today.add(1, "year").endOf("year");

  const [minDatepicker, setMinDatepicker] = useState(today);
  const [maxDatepicker, setMaxDatepicker] = useState(endOfNextYear);

  const handleDatePickerChange = (newValue) => {
    const value = `${newValue[0]}..${newValue[1]}`;

    if (!value) {
      current.delete("release_date");
    } else {
      current.set("release_date", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // Datepicker
    if (searchParams.get("release_date")) {
      const [min, max] = searchParams.get("release_date").split("..");
      const searchMinDatepicker = dayjs(min);
      const searchMaxDatepicker = dayjs(max);

      setMinDatepicker(searchMinDatepicker);
      setMaxDatepicker(searchMaxDatepicker);
    } else {
      setMinDatepicker(today);
      setMaxDatepicker(endOfNextYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, minYear, maxYear, isTvPage]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Release Date</span>
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
