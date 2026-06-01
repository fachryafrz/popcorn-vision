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
      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
        <Tv className="h-5 w-5 text-blue-500" />
        Key Cast & Characters
      </h2>
      <div className="w-full relative swiper-cast-container">
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
                <div className="flex flex-col items-center text-center w-full">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cover bg-center border-2 border-zinc-800 shadow-md mb-2 bg-zinc-900"
                    style={{ backgroundImage: `url(${actorPic})` }}
                  />
                  <span className="text-xs font-semibold text-white truncate w-full">
                    {actor.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 truncate w-full mt-0.5">
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
