export function Loading({ height = "full", width = "full", classNames }) {
  return (
    <div className={`h-${height} w-${width} ${classNames}`}>
      <div
        className={`animate-pulse h-full bg-base-gray bg-opacity-50 rounded`}
      ></div>
    </div>
  );
}
