export default function loading() {
  const itemCount = 7;

  const renderItems = () => {
    return Array.from({ length: itemCount }, (_, index) => (
      <div key={index} className={`flex flex-col gap-1 !bg-opacity-0`}>
        <div
          className={`h-[250px] w-[40vw] sm:w-[28vw] md:w-[23.5vw] lg:w-[19vw] xl:w-[13vw]`}
        ></div>
        <div className={`h-[20px]`}></div>
        <div className={`h-[1rem]`}></div>
      </div>
    ));
  };

  return (
    <div
      className={`[&_*]:animate-pulse [&_*]:bg-gray-400 [&_*]:bg-opacity-20 flex flex-col gap-[1rem]`}
    >
      {/* HomeSlider */}
      <section
        className={`h-[532px] relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray flex flex-col justify-end items-center md:items-start gap-2 p-4 [&_*]:rounded-lg mb-4 md:[&_*]:max-w-[70%] lg:[&_*]:max-w-[50%] xl:px-[9rem]`}
      >
        <div className={`h-[200px] w-full`}></div>
        <div className={`h-[24px] w-[100px]`}></div>
        <div className={`h-[48px] md:h-[72px] w-full`}></div>
      </section>

      {/* FilmSlider */}
      <section
        className={`flex flex-col gap-4 [&_*]:rounded-lg !bg-opacity-0 p-4 xl:px-[9rem]`}
      >
        <div className={`h-[28px] w-[100px]`}></div>
        <div className={`flex gap-2 flex-nowrap overflow-hidden !bg-opacity-0`}>
          {renderItems()}
        </div>
      </section>

      {/* FilmSlider */}
      <section
        className={`flex flex-col gap-4 [&_*]:rounded-lg !bg-opacity-0 p-4 xl:px-[9rem]`}
      >
        <div className={`h-[28px] w-[100px] bg-opacity-[15%]`}></div>
        <div className={`flex gap-2 flex-nowrap overflow-hidden !bg-opacity-0`}>
          {renderItems()}
        </div>
      </section>
    </div>
  );
}
