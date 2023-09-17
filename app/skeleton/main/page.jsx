export default function MainLoading() {
  const sectionCount = 2;
  const itemCount = 7;

  return (
    <div
      className={`[&_*]:animate-pulse [&_*]:bg-gray-400 [&_*]:bg-opacity-20 flex flex-col gap-[1rem]`}
    >
      {/* HomeSlider */}
      <section
        className={`h-[532px] max-w-7xl relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray flex flex-col justify-end items-center md:items-start gap-2 p-4 [&_*]:rounded-lg mb-4 md:[&_*]:max-w-[70%] lg:[&_*]:max-w-[50%]`}
      >
        {/* Title Logo */}
        <div className={`h-[100px] w-full !max-w-[300px]`}></div>
        {/* Rating, Release Date, Season, Genre */}
        <div
          className={`flex items-center justify-center md:justify-start gap-2 !bg-opacity-0 w-full [&_*]:w-full [&_*]:!max-w-[75px]`}
        >
          <div className={`h-[24px] w-full`}></div>
          <div className={`h-[24px] w-full`}></div>
          <div className={`h-[24px] w-full`}></div>
        </div>
        {/* Overview */}
        <div
          className={`h-[100px] w-full !bg-opacity-0 flex flex-col gap-2 items-center md:items-start [&_*]:!max-w-none`}
        >
          <div className={`h-[24px] w-full`}></div>
          <div className={`h-[24px] w-full`}></div>
          <div className={`h-[24px] w-[80%]`}></div>
        </div>
      </section>

      {/* FilmSlider */}
      {[...Array(sectionCount).keys()].map((a) => (
        <section
          key={a}
          className={`max-w-7xl flex flex-col gap-4 [&_*]:rounded-lg !bg-opacity-0 p-4`}
        >
          {/* Section Title */}
          <div className={`h-[28px] w-[100px]`}></div>
          <div
            className={`flex gap-2 flex-nowrap overflow-hidden !bg-opacity-0`}
          >
            {[...Array(itemCount).keys()].map((b) => (
              <div key={b} className={`flex flex-col gap-1 !bg-opacity-0`}>
                {/* Poster */}
                <div
                  className={`h-[250px] w-[40vw] sm:w-[28vw] md:w-[23.5vw] lg:w-[19vw] xl:w-[13vw]`}
                ></div>
                {/* Film Title */}
                <div className={`h-[20px]`}></div>
                {/* Release Date & Genres */}
                <div className={`h-[1rem] !bg-opacity-0 flex gap-1`}>
                  <div className={`h-full w-[30%]`}></div>
                  <div className={`h-full w-[70%]`}></div>
                </div>
              </div>
            ))}{" "}
          </div>
        </section>
      ))}
    </div>
  );
}
