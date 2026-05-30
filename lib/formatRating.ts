export function formatRating(rating) {
  if (rating < 9.9) {
    return (Math.floor(rating * 10) / 10).toFixed(1);
  } else {
    return rating;
  }
}
