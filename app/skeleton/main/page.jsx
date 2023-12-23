"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function MainLoading() {
  const sectionCount = 3;
  const itemCount = 10;

  return (
    <div
      className={`[&_*]:animate-pulse [&_*]:bg-gray-400 [&_*]:bg-opacity-20 flex flex-col gap-[1rem] -mt-[66px]`}
    >
      {/* HomeSlider */}
      <section
        className={`h-[100dvh] lg:h-[120dvh] min-h-[500px] relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-100 flex items-start`}
      >
        <div
          className={`h-full max-h-[100dvh] pb-[2rem] w-full !bg-opacity-0 flex items-end`}
        >
          <div
            className={`w-full max-w-none mx-auto !bg-opacity-0 flex flex-col justify-end items-center md:items-start gap-2 p-4 [&_*]:rounded-lg mb-4 md:[&_*]:max-w-[40%]`}
          >
            {/* Title Logo */}
            <div className={`h-[150px] w-full !max-w-[350px]`}></div>
            {/* Rating, Runtime, Season, Genre */}
            <div
              className={`flex items-center justify-center md:justify-start gap-1 !bg-opacity-0 w-full [&_*]:w-full [&_*]:!max-w-[75px]`}
            >
              <div className={`h-[32px] w-full !rounded-full`}></div>
              <div className={`h-[32px] w-full !rounded-full`}></div>
              <div className={`h-[32px] w-full !rounded-full`}></div>
            </div>
            {/* Overview */}
            <div
              className={`h-[100px] w-full !bg-opacity-0 hidden md:flex flex-col gap-2 items-center md:items-start [&_*]:!max-w-none`}
            >
              <div className={`h-[24px] w-full`}></div>
              <div className={`h-[24px] w-full`}></div>
              <div className={`h-[24px] w-[80%]`}></div>
            </div>
            {/* Details Button */}
            <div
              className={`h-[48px] w-full md:!max-w-[25%] lg:!max-w-[300px] bg-opacity-40 border-none !rounded-full hocus:bg-opacity-100 backdrop-blur`}
            ></div>
          </div>
        </div>
      </section>

      {/* FilmSlider */}
      {[...Array(sectionCount).keys()].map((a) => (
        <section
          key={a}
          className={`w-full max-w-none mx-auto flex flex-col gap-4 [&_*]:rounded-lg !bg-opacity-0 p-4 lg:-mt-[5rem]`}
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
            className={`!bg-opacity-0 w-full !pr-[3rem]`}
            wrapperClass={`!bg-opacity-0`}
          >
            {[...Array(itemCount).keys()].map((b) => (
              <SwiperSlide
                key={b}
                className={`!bg-opacity-0 max-w-[calc(100%/2.5)] sm:max-w-[calc(100%/3.5)] md:max-w-[calc(100%/4.5)] lg:max-w-[calc(100%/5.5)] xl:max-w-[calc(100%/6.5)] 2xl:max-w-[calc(100%/7.5)] mr-2`}
              >
                {/* Poster */}
                <div className={`aspect-poster`}></div>

                {/* Title */}
                <div className={`h-[28px] mt-2`}></div>

                {/* Release Date & Genres */}
                <div className={`h-[20px] mt-1 flex gap-1 !bg-opacity-0`}>
                  <div className={`w-[30%]`}></div>
                  <div className={`w-[70%]`}></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      ))}

      {/* Trending */}
      <section className={`px-4 !bg-opacity-0 mx-auto max-w-7xl w-full`}>
        <div
          className={`relative flex flex-col items-center md:flex-row gap-8 p-8 md:p-[3rem] rounded-[2rem] md:rounded-[3rem] overflow-hidden before:z-10 before:absolute before:inset-0 before:bg-gradient-to-t md:before:bg-gradient-to-r before:from-black before:via-black before:via-30% before:opacity-[100%] before:invisible md:before:visible after:z-20 after:absolute after:inset-0 after:bg-gradient-to-t md:after:bg-gradient-to-r after:from-black`}
        >
          {/* Background */}
          <div
            className={`absolute inset-0 z-0 md:left-[30%] blur-md md:blur-0`}
          ></div>
          {/* Poster */}
          <div
            className={`z-30 w-full sm:w-[300px] aspect-poster rounded-2xl overflow-hidden`}
          ></div>

          {/* Details */}
          <div
            className={`z-30 flex flex-col items-center text-center gap-2 w-full md:max-w-[60%] lg:max-w-[50%] md:items-start md:text-start [&_*]:rounded-lg !bg-opacity-0`}
          >
            {/* Title Logo */}
            <div className={`h-[150px] w-full !max-w-[300px]`}></div>
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
          </div>
        </div>
      </section>
    </div>
  );
}
