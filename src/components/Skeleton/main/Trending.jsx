export default function SkeletonTrending() {
  return (
    <section
      className={`mx-auto w-full max-w-7xl !bg-opacity-0 md:px-4 [&_*]:animate-pulse [&_*]:bg-gray-400 [&_*]:bg-opacity-20`}
    >
      <div
        className={`relative flex flex-col items-center gap-8 overflow-hidden p-8 before:invisible before:absolute before:inset-0 before:z-10 before:bg-gradient-to-t before:from-black before:via-black before:via-30% before:opacity-[100%] after:absolute after:inset-0 after:z-20 after:bg-gradient-to-t after:from-black md:flex-row md:rounded-[3rem] md:p-[3rem] md:before:visible md:before:bg-gradient-to-r md:after:bg-gradient-to-r`}
      >
        {/* Background */}
        <div
          className={`absolute inset-0 z-0 blur-md md:left-[30%] md:blur-0`}
        ></div>
        {/* Poster */}
        <div
          className={`z-30 aspect-poster w-full overflow-hidden rounded-2xl sm:w-[300px]`}
        ></div>

        {/* Details */}
        <div
          className={`z-30 flex w-full flex-col items-center gap-2 !bg-opacity-0 text-center md:max-w-[60%] md:items-start md:text-start lg:max-w-[50%] [&_*]:rounded-lg`}
        >
          {/* Title Logo */}
          <div className={`h-[150px] w-full !max-w-[300px]`}></div>
          {/* Rating, Release Date, Season, Genre */}
          <div
            className={`flex w-full items-center justify-center gap-2 !bg-opacity-0 md:justify-start [&_*]:w-full [&_*]:!max-w-[75px]`}
          >
            <div className={`h-[24px] w-full`}></div>
            <div className={`h-[24px] w-full`}></div>
            <div className={`h-[24px] w-full`}></div>
          </div>
          {/* Overview */}
          <div
            className={`hidden h-[100px] w-full flex-col items-center gap-2 !bg-opacity-0 md:flex md:items-start [&_*]:!max-w-none`}
          >
            <div className={`h-[24px] w-full`}></div>
            <div className={`h-[24px] w-full`}></div>
            <div className={`h-[24px] w-[80%]`}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
