"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function MainLoading() {
  const sectionCount = 3;
  const itemCount = 10;

  return (
    <div
      className={`-mt-[66px] flex flex-col gap-[1rem] [&_*]:animate-pulse [&_*]:bg-gray-400 [&_*]:bg-opacity-20`}
    >
      {/* HomeSlider */}
      <section
        className={`relative flex h-[100svh] min-h-[500px] items-start before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-100 lg:h-[120svh]`}
      >
        <div
          className={`flex h-full max-h-[100svh] w-full items-end !bg-opacity-0 pb-[2rem]`}
        >
          <div
            className={`mx-auto mb-4 flex w-full max-w-none flex-col items-center justify-end gap-2 !bg-opacity-0 p-4 md:items-start [&_*]:rounded-lg md:[&_*]:max-w-[40%]`}
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

      {/* FilmSlider */}
      <div className={`!bg-opacity-0 lg:-mt-[5rem]`}>
        {[...Array(sectionCount).keys()].map((a) => (
          <section
            key={a}
            className={`mx-auto flex w-full max-w-none flex-col gap-4 !bg-opacity-0 p-4 [&_*]:rounded-lg`}
          >
            {/* Section Title */}
            <div className={`h-[28px] w-[100px]`}></div>

            {/* Films */}
            <Swiper
              spaceBetween={8}
              slidesPerView={2}
              // breakpoints={{
              //   640: {
              //     slidesPerView: 3,
              //     slidesPerGroup: 3,
              //   },
              //   768: {
              //     slidesPerView: 4,
              //     slidesPerGroup: 4,
              //   },
              //   1024: {
              //     slidesPerView: 5,
              //     slidesPerGroup: 5,
              //   },
              // }}
              allowSlideNext={false}
              allowSlidePrev={false}
              allowTouchMove={false}
              className={`w-full !bg-opacity-0 !pr-[3rem]`}
              wrapperClass={`!bg-opacity-0`}
            >
              {[...Array(itemCount).keys()].map((b) => (
                <SwiperSlide
                  key={b}
                  className={`mr-2 max-w-[calc(100%/2.5)] !bg-opacity-0 sm:max-w-[calc(100%/3.5)] md:max-w-[calc(100%/4.5)] lg:max-w-[calc(100%/5.5)] xl:max-w-[calc(100%/6.5)] 2xl:max-w-[calc(100%/7.5)]`}
                >
                  {/* Poster */}
                  <div className={`aspect-poster`}></div>

                  {/* Title */}
                  <div className={`mt-2 h-[28px]`}></div>

                  {/* Release Date & Genres */}
                  <div className={`mt-1 flex h-[20px] gap-1 !bg-opacity-0`}>
                    <div className={`w-[30%]`}></div>
                    <div className={`w-[70%]`}></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        ))}
      </div>

      {/* Trending */}
      <section className={`mx-auto w-full max-w-7xl !bg-opacity-0 px-4`}>
        <div
          className={`relative flex flex-col items-center gap-8 overflow-hidden rounded-[2rem] p-8 before:invisible before:absolute before:inset-0 before:z-10 before:bg-gradient-to-t before:from-black before:via-black before:via-30% before:opacity-[100%] after:absolute after:inset-0 after:z-20 after:bg-gradient-to-t after:from-black md:flex-row md:rounded-[3rem] md:p-[3rem] md:before:visible md:before:bg-gradient-to-r md:after:bg-gradient-to-r`}
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
              className={`flex h-[100px] w-full flex-col items-center gap-2 !bg-opacity-0 md:items-start [&_*]:!max-w-none`}
            >
              <div className={`h-[24px] w-full`}></div>
              <div className={`h-[24px] w-full`}></div>
              <div className={`h-[24px] w-[80%]`}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
