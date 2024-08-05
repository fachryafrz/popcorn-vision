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

export default function Runtime({ searchAPIParams, sliderStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;

  const [runtime, setRuntime] = useState([0, 300]);
  const [runtimeSlider, setRuntimeSlider] = useState([0, 300]);

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

  useEffect(() => {
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
      }
    } else {
      delete searchAPIParams["with_runtime.gte"];
      delete searchAPIParams["with_runtime.lte"];
    }
  }, [runtime, searchAPIParams, searchParams]);

  return (
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
  );
}
