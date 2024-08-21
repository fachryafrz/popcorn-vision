import { Slider } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function RatingCount({ sliderStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;

  const [rating, setRating] = useState(0);
  const [ratingSlider, setRatingSlider] = useState(0);

  const ratingMarks = useMemo(
    () => [
      {
        value: 0,
        label: [`0`, `10`, `100`, `1,000`, `10,000`][ratingSlider],
      },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
    ],
    [ratingSlider],
  );

  const handleRatingChange = (event, newValue) => {
    const value = rating ? newValue : "";

    const ratingValue = [0, 10, 100, 1000, 10000][newValue];

    // NOTE: Using vote_average.gte & vote_average.lte
    if (!value) {
      current.delete("vote_count");
    } else {
      current.set("vote_count", ratingValue);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // Rating Count
    if (searchParams.get("vote_count")) {
      const ratingCount = searchParams.get("vote_count");
      const ratingIndex = [0, 10, 100, 1000, 10000].indexOf(
        Number(ratingCount),
      );

      if (rating !== ratingIndex) {
        setRating(ratingIndex);
        setRatingSlider(ratingIndex);
      }
    } else {
    }
  }, [rating, searchParams]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Rating Count Minimum</span>
      <div className={`w-full px-3`}>
        <Slider
          getAriaLabel={() => "Rating Count"}
          value={ratingSlider}
          onChange={(event, newValue) => setRatingSlider(newValue)}
          onChangeCommitted={handleRatingChange}
          valueLabelDisplay="off"
          step={1}
          min={0}
          max={4}
          marks={ratingMarks}
          sx={sliderStyles}
          disabled={isQueryParams}
        />
      </div>
    </section>
  );
}
