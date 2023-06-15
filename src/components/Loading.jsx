export function Loading({ height = "full", width = "full" }) {
  return (
    <div className={`h-${height} w-${width}`}>
      <div
        className={`animate-pulse h-full bg-base-gray bg-opacity-50 rounded`}
      ></div>
    </div>
  );
}
