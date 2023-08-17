export default function loading() {
  const sectionCount = 2;
  const itemCount = 7;

  return (
    <div
      className={`[&_*]:animate-pulse [&_*]:bg-gray-400 [&_*]:bg-opacity-20 flex flex-col gap-[1rem]`}
    >
      {/* HomeSlider */}
      <section
        className={`h-[532px] relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray flex flex-col justify-end items-center md:items-start gap-2 p-4 [&_*]:rounded-lg mb-4 md:[&_*]:max-w-[70%] lg:[&_*]:max-w-[50%] xl:px-[9rem]`}
      >
        <div className={`h-[150px] lg:h-[200px] w-full`}></div>
        <div className={`h-[24px] w-[100px]`}></div>
        <div className={`h-[50px] md:h-[100px] w-full`}></div>
      </section>

      {/* FilmSlider */}
      {[...Array(sectionCount).keys()].map((a) => (
        <section
          key={a}
          className={`flex flex-col gap-4 [&_*]:rounded-lg !bg-opacity-0 p-4 xl:px-[9rem]`}
        >
          <div className={`h-[28px] w-[100px]`}></div>
          <div
            className={`flex gap-2 flex-nowrap overflow-hidden !bg-opacity-0`}
          >
            {[...Array(itemCount).keys()].map((b) => (
              <div key={b} className={`flex flex-col gap-1 !bg-opacity-0`}>
                <div
                  className={`h-[250px] w-[40vw] sm:w-[28vw] md:w-[23.5vw] lg:w-[19vw] xl:w-[13vw]`}
                ></div>
                <div className={`h-[20px]`}></div>
                <div className={`h-[1rem]`}></div>
              </div>
            ))}{" "}
          </div>
        </section>
      ))}
    </div>
  );
}
