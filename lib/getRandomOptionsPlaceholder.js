export function getRandomOptionsPlaceholder(options) {
  if (!options || options.length < 2) return "Loading...";

  const numberOfOptions = options.length;
  let randomIndex1 = Math.floor(Math.random() * numberOfOptions);
  let randomIndex2 = randomIndex1;

  // Pilih dua indeks acak yang berbeda
  while (randomIndex2 === randomIndex1) {
    randomIndex2 = Math.floor(Math.random() * numberOfOptions);
  }

  // Ambil dua opsi yang berbeda
  const option1 = options[randomIndex1]?.label;
  const option2 = options[randomIndex2]?.label;

  return `${option1}, ${option2}...`;
}
