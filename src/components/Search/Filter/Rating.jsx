import { Slider } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Rating({ sliderStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;

  const [rating, setRating] = useState([0, 100]);
  const [ratingSlider, setRatingSlider] = useState([0, 100]);

  const ratingMarks = useMemo(
    () => [
      {
        value: 0,
        label: ratingSlider[0],
      },
      {
        value: 100,
        label: ratingSlider[1],
      },
    ],
    [ratingSlider],
  );

  const handleRatingChange = (event, newValue) => {
    const value = rating ? `${newValue[0]},${newValue[1]}` : "";

    // NOTE: Using vote_count.gte & vote_count.lte
    if (!value) {
      current.delete("vote_count");
    } else {
      current.set("vote_count", `${newValue[0]}..${newValue[1]}`);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // Rating
    if (searchParams.get("vote_count")) {
      const [min, max] = searchParams.get("vote_count").split("..");
      const searchRating = [parseInt(min), parseInt(max)];

      if (rating[0] !== searchRating[0] || rating[1] !== searchRating[1]) {
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
          min={0}
          max={100}
          marks={ratingMarks}
          sx={sliderStyles}
          disabled={isQueryParams}
        />
      </div>
    </section>
  );
}
