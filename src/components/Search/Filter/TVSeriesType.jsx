import { fetchData } from "@/lib/fetch";
import { IonIcon } from "@ionic/react";
import { Slider } from "@mui/material";
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
import { askLocation } from "@/lib/navigator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TVSeriesType({ searchAPIParams }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;

  const [tvType, setTvType] = useState([]);

  // Pre-loaded Options
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

  // Handle checkbox change
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
      current.set("type", updatedValue.join("|"));
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // TV Series Type
    if (searchParams.get("type")) {
      const typeParams = searchParams.get("type").split("|");
      setTvType(typeParams);

      searchAPIParams["with_type"] = searchParams.get("type");
    } else {
      delete searchAPIParams["with_type"];
    }
  }, [searchAPIParams, searchParams]);

  return (
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
  );
}
