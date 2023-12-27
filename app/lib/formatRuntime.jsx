import { isPlural } from "./isPlural";

export function formatRuntime(runtime) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes} ${isPlural({ text: "min", number: minutes })}`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}
