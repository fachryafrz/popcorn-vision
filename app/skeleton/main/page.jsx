"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function MainLoading() {
  const sectionCount = 3;
  const itemCount = 7;

  return (
    <div
      className={`[&_*]:animate-pulse [&_*]:bg-gray-400 [&_*]:bg-opacity-20 flex flex-col gap-[1rem]`}
    >
      {/* HomeSlider */}
      <section
        className={`h-[532px] relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray flex items-end`}
      >
        <div
          className={`w-full max-w-7xl mx-auto !bg-opacity-0 flex flex-col justify-end items-center md:items-start gap-2 p-4 [&_*]:rounded-lg mb-4 md:[&_*]:max-w-[50%]`}
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
        </div>
      </section>

      {/* FilmSlider */}
      {[...Array(sectionCount).keys()].map((a) => (
        <section
          key={a}
          className={`w-full max-w-7xl mx-auto flex flex-col gap-4 [&_*]:rounded-lg !bg-opacity-0 p-4`}
        >
          {/* Section Title */}
          <div className={`h-[28px] w-[100px]`}></div>

          {/* Films */}
          <Swiper
            spaceBetween={8}
            slidesPerView={2}
            breakpoints={{
              640: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              768: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              1024: {
                slidesPerView: 5,
                slidesPerGroup: 5,
              },
            }}
            allowSlideNext={false}
            allowSlidePrev={false}
            allowTouchMove={false}
            className={`!bg-opacity-0 w-full !pr-[3rem]`}
            wrapperClass={`!bg-opacity-0`}
          >
            {[...Array(itemCount).keys()].map((b) => (
              <SwiperSlide key={b} className={`!bg-opacity-0`}>
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
          className={`relative rounded-[3rem] p-[3rem] w-full overflow-hidden flex items-center gap-8 before:absolute before:inset-0 before:bg-gradient-to-r before:from-black before:via-[40%] !bg-opacity-5`}
        >
          {/* Background */}
          <div className={`absolute inset-0 -z-10 blur-md md:blur-0`}></div>
          {/* Poster */}
          <div className={`aspect-poster min-w-[300px] rounded-2xl`}></div>

          {/* Details */}
          <div
            className={`flex-1 !bg-opacity-0 flex flex-col justify-end items-center md:items-start gap-2 p-4 [&_*]:rounded-lg mb-4`}
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
          </div>
        </div>
      </section>
    </div>
  );
}
