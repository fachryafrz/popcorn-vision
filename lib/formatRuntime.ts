import pluralize from "pluralize";

export function formatRuntime(runtime) {
  if (runtime > 60) {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  } else {
    return pluralize("min", runtime, true);
  }
}
