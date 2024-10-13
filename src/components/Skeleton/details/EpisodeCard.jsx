"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/keyboard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";

export default function SkeletonEpisodeCard() {
  const episodes = [...Array(2).keys()];

  return (
    <Swiper
      modules={[Navigation, Keyboard]}
      keyboard={true}
      navigation={{
        enabled: true,
        prevEl: `#prevEps`,
        nextEl: `#nextEps`,
      }}
      slidesPerView={1}
      spaceBetween={4}
      breakpoints={{
        1024: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
      }}
      className={`relative !px-2`}
      >
      {episodes.map((item) => {
        return (
          <SwiperSlide key={item.id} className={`!h-auto`}>
            <EpisodeCard />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

function EpisodeCard() {
  return (
    <div
      className={`flex h-fit w-full flex-col items-center gap-2 rounded-xl bg-secondary bg-opacity-10 p-2 backdrop-blur transition-all [&_*]:animate-pulse [&_*]:bg-gray-400 [&_*]:bg-opacity-20`}
    >
      <div className={`aspect-video w-full overflow-hidden rounded-lg`}></div>

      <div className="flex w-full flex-col items-start gap-1 !bg-opacity-0">
        <div className="h-[24px] w-[100px] rounded-md"></div>

        <div className="flex w-full items-center gap-1 !bg-opacity-0">
          <div className="h-[24px] w-[50px] rounded-full"></div>
          <div className="h-[24px] w-[50px] rounded-full"></div>
          <div className="h-[24px] w-[50px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
