import { Slider } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useQueryState, parseAsString } from "nuqs";

export default function Rating({ sliderStyles }) {
  const [ratingParam, setRatingParam] = useQueryState("rating", parseAsString);
  const [query] = useQueryState("query");

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
    const value = newValue ? `${newValue[0]},${newValue[1]}` : "";

    // NOTE: Using vote_average.gte & vote_average.lte
    if (!value) {
      setRatingParam(null);
    } else {
      setRatingParam(`${newValue[0]}..${newValue[1]}`);
    }
  };

  useEffect(() => {
    // Rating
    if (ratingParam) {
      const [min, max] = ratingParam.split("..");
      const [ratingMin, ratingMax] = rating;
      const searchRating = [Number(min), Number(max)];

      if (ratingMin !== Number(min) || ratingMax !== Number(max)) {
        setRating(searchRating);
        setRatingSlider(searchRating);
      }
    } else {
    }
  }, [rating, ratingParam]);

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
          disabled={!!query}
        />
      </div>
    </section>
  );
}
