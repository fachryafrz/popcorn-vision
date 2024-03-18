export function formatRating(rating) {
  if (rating < 9.9) {
    return rating.toFixed(1);
  } else {
    return rating;
  }
}
