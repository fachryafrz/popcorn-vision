export function isPlural({ text, number }) {
  if (number > 1) {
    return `${text}s`;
  } else {
    return text;
  }
}
