import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Tv } from "lucide-react";
import { CastItem } from "./types";

interface CastSliderProps {
  cast: CastItem[];
}

export default function CastSlider({ cast }: CastSliderProps) {
  if (cast.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
        <Tv className="text-primary h-5 w-5" />
        Key Cast & Characters
      </h2>
      <div className="swiper-cast-container relative w-full">
        <Swiper
          freeMode={true}
          modules={[Mousewheel, FreeMode]}
          spaceBetween={16}
          slidesPerView={3}
          breakpoints={{
            480: { slidesPerView: 4, spaceBetween: 16 },
            640: { slidesPerView: 5, spaceBetween: 20 },
            768: { slidesPerView: 6, spaceBetween: 20 },
            1024: { slidesPerView: 8, spaceBetween: 24 },
            1280: { slidesPerView: 10, spaceBetween: 24 },
          }}
          mousewheel={{
            forceToAxis: true,
          }}
          className="w-full pb-4"
        >
          {cast.map((actor) => {
            const actorPic = actor.profile_path
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : "/logo/popcorn.png";
            return (
              <SwiperSlide key={actor.id} className="py-1">
                <div className="group flex w-full flex-col items-center text-center">
                  <div
                    className="mb-2 h-16 w-16 rounded-full border-2 border-zinc-800 bg-zinc-900 bg-cover bg-center shadow-md sm:h-20 sm:w-20"
                    style={{ backgroundImage: `url(${actorPic})` }}
                  />
                  <span className="w-full truncate text-xs font-semibold text-white">
                    {actor.name}
                  </span>
                  <span className="mt-0.5 w-full truncate text-[10px] text-zinc-500 group-hover:whitespace-pre-wrap">
                    {actor.character}
                  </span>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
