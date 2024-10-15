import { Slider } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Rating({ sliderStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const isQueryParams = searchParams.get("query");

  const [rating, setRating] = useState([0, 10]);
  const [ratingSlider, setRatingSlider] = useState([0, 10]);

  const ratingMarks = useMemo(
    () => [
      {
        value: 0,
        label: ratingSlider[0],
      },
      {
        value: 10,
        label: ratingSlider[1],
      },
    ],
    [ratingSlider],
  );

  const handleRatingChange = (event, newValue) => {
    const value = rating ? `${newValue[0]},${newValue[1]}` : "";

    // NOTE: Using vote_average.gte & vote_average.lte
    if (!value) {
      current.delete("rating");
    } else {
      current.set("rating", `${newValue[0]}..${newValue[1]}`);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // Rating
    if (searchParams.get("rating")) {
      const [min, max] = searchParams.get("rating").split("..");
      const [ratingMin, ratingMax] = rating
      const searchRating = [min, max];

      if (ratingMin !== min || ratingMax !== max) {
        setRating(searchRating);
        setRatingSlider(searchRating);
      }
    } else {
    }
  }, [rating, searchParams]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Rating</span>
      <div className={`w-full px-3`}>
        <Slider
          getAriaLabel={() => "Rating"}
          value={ratingSlider}
          onChange={(event, newValue) => setRatingSlider(newValue)}
          onChangeCommitted={handleRatingChange}
          valueLabelDisplay="off"
          step={0.1}
          min={0}
          max={10}
          marks={ratingMarks}
          sx={sliderStyles}
          disabled={isQueryParams}
        />
      </div>
    </section>
  );
}
