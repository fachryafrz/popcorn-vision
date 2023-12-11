export function slugify(text) {
  return (
    text &&
    text
      .toLowerCase()
      .replace(/&/g, "")
      .replace(/ /g, "-")
      .replace(/-+/g, "-")
      .replace(/[^\w-]+/g, "")
  );
}
