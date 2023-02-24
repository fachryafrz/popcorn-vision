export function Loading({ height = "full" }) {
  return (
    <div className={`h-${height} w-full`}>
      <div
        className={`animate-pulse h-full bg-base-gray bg-opacity-50 rounded`}
      ></div>
    </div>
  );
}
