export function formatRuntime(runtime) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes} minute${minutes > 1 ? `s` : ``}`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}
