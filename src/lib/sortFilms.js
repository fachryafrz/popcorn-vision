export function sortFilms({ films, sort = "DESC", isTvPage = false }) {
  const sortedFilms = [...films].sort((a, b) => {
    const dateA = new Date(!isTvPage ? a.release_date : a.first_air_date);
    const dateB = new Date(!isTvPage ? b.release_date : b.first_air_date);

    if (sort === "ASC") {
      return dateA - dateB;
    } else if (sort === "DESC") {
      return dateB - dateA;
    }
  });

  return sortedFilms;
}
