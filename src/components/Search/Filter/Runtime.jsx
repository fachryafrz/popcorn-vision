import { Slider } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useQueryState, parseAsString } from "nuqs";

export default function Runtime({ sliderStyles }) {
  const [withRuntime, setWithRuntime] = useQueryState(
    "with_runtime",
    parseAsString,
  );
  const [query] = useQueryState("query");

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
      setWithRuntime(null);
    } else {
      setWithRuntime(`${newValue[0]}..${newValue[1]}`);
    }
  };

  useEffect(() => {
    // Runtime
    if (withRuntime) {
      const [min, max] = withRuntime.split("..");
      const searchRuntime = [parseInt(min), parseInt(max)];

      if (runtime[0] !== searchRuntime[0] || runtime[1] !== searchRuntime[1]) {
        setRuntime(searchRuntime);
        setRuntimeSlider(searchRuntime);
      }
    } else {
    }
  }, [runtime, withRuntime]);

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
