import { Slider } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Runtime({ sliderStyles }) {
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
      const [min, max] = searchParams.get("with_runtime").split("..");
      const searchRuntime = [parseInt(min), parseInt(max)];

      if (runtime[0] !== searchRuntime[0] || runtime[1] !== searchRuntime[1]) {
        setRuntime(searchRuntime);
        setRuntimeSlider(searchRuntime);
      }
    } else {
    }
  }, [runtime, searchParams]);

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
