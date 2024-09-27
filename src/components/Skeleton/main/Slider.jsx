"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function SkeletonSlider() {
  const itemCount = 10;

  return (
    <section
      className={`mx-auto flex w-full max-w-none flex-col gap-2 !bg-opacity-0 [&_*]:animate-pulse [&_*]:rounded-lg [&_*]:bg-gray-400 [&_*]:bg-opacity-20`}
    >
      {/* Films */}
      <Swiper
        // spaceBetween={8}
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
        className={`relative w-full !bg-opacity-0 !px-4 !pb-[2rem] !pt-[2.5rem] lg:!pb-[3rem]`}
        wrapperClass={`!bg-opacity-0`}
      >
        {[...Array(itemCount).keys()].map((b) => (
          <SwiperSlide
            key={b}
            className={`max-w-[calc(100%/2.2)] !bg-opacity-0 pr-2 transition-all sm:max-w-[calc(100%/3.2)] md:max-w-[calc(100%/4.2)] lg:max-w-[calc(100%/5.2)] xl:max-w-[calc(100%/6.2)] 2xl:max-w-[calc(100%/7.2)]`}
          >
            {/* Poster */}
            <div className={`aspect-poster`}></div>

            {/* Title */}
            {/* <div className={`mt-2 h-[28px]`}></div> */}

            {/* Release Date & Genres */}
            {/* <div className={`mt-1 flex h-[20px] gap-1 !bg-opacity-0`}>
              <div className={`w-[30%]`}></div>
              <div className={`w-[70%]`}></div>
            </div> */}
          </SwiperSlide>
        ))}

        <div className="absolute left-0 right-0 top-0 flex h-[28px] max-w-7xl items-end justify-between !bg-opacity-0 px-4 xl:max-w-none">
          {/* Section Title */}
          <div className="relative z-10 h-[28px] w-[100px]"></div>
        </div>
      </Swiper>
    </section>
  );
}
