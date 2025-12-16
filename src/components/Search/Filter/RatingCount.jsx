import { Slider } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

export default function RatingCount({ sliderStyles }) {
  const [voteCount, setVoteCount] = useQueryState(
    "vote_count",
    parseAsInteger,
  );
  const [query] = useQueryState("query");

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
    const value = newValue ? newValue : "";

    const ratingValue = [0, 10, 100, 1000, 10000][newValue];

    // NOTE: Using vote_average.gte & vote_average.lte
    if (!value) {
      setVoteCount(null);
    } else {
      setVoteCount(ratingValue);
    }
  };

  useEffect(() => {
    // Rating Count
    if (voteCount) {
      const ratingIndex = [0, 10, 100, 1000, 10000].indexOf(Number(voteCount));

      if (rating !== ratingIndex) {
        setRating(ratingIndex);
        setRatingSlider(ratingIndex);
      }
    } else {
    }
  }, [rating, voteCount]);

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
          disabled={!!query}
        />
      </div>
    </section>
  );
}
