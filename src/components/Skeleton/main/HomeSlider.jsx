export default function SkeletonHomeSlider() {
  return (
    <section
      className={`relative flex h-[100dvh] min-h-[640px] items-start before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-100 lg:h-[120dvh] [&_*]:animate-pulse [&_*]:bg-gray-400 [&_*]:bg-opacity-20`}
    >
      <div
        className={`flex h-full max-h-[100dvh] w-full items-end !bg-opacity-0`}
      >
        <div
          className={`mx-auto flex w-full max-w-none flex-col items-center justify-end gap-2 !bg-opacity-0 p-4 md:items-start [&_*]:rounded-lg md:[&_*]:max-w-[40%]`}
        >
          {/* Title Logo */}
          <div className={`h-[150px] w-full !max-w-[350px]`}></div>
          {/* Rating, Runtime, Season, Genre */}
          <div
            className={`flex w-full items-center justify-center gap-1 !bg-opacity-0 md:justify-start [&_*]:w-full [&_*]:!max-w-[75px]`}
          >
            <div className={`h-[32px] w-full !rounded-full`}></div>
            <div className={`h-[32px] w-full !rounded-full`}></div>
            <div className={`h-[32px] w-full !rounded-full`}></div>
          </div>
          {/* Overview */}
          <div
            className={`hidden h-[100px] w-full flex-col items-center gap-2 !bg-opacity-0 md:flex md:items-start [&_*]:!max-w-none`}
          >
            <div className={`h-[24px] w-full`}></div>
            <div className={`h-[24px] w-full`}></div>
            <div className={`h-[24px] w-[80%]`}></div>
          </div>
          {/* Details Button */}
          <div
            className={`h-[48px] w-full !rounded-full border-none bg-opacity-40 backdrop-blur md:!max-w-[25%] lg:!max-w-[300px]`}
          ></div>
        </div>
      </div>
    </section>
  );
}
