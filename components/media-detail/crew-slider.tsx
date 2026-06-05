import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Users } from "lucide-react";

interface CrewSliderItem {
  id: number;
  name: string;
  profile_path: string | null;
  role: string;
}

interface CrewSliderProps {
  title: string;
  items: CrewSliderItem[];
}

export default function CrewSlider({ title, items }: CrewSliderProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
        <Users className="text-primary h-5 w-5" />
        {title}
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
          {items.map((item) => {
            const pic = item.profile_path
              ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
              : "/logo/popcorn.png";
            return (
              <SwiperSlide key={item.id} className="py-1">
                <div className="group flex w-full flex-col items-center text-center">
                  <div
                    className="mb-2 h-16 w-16 rounded-full border-2 border-zinc-800 bg-zinc-900 bg-cover bg-center shadow-md sm:h-20 sm:w-20"
                    style={{ backgroundImage: `url(${pic})` }}
                  />
                  <span className="w-full truncate text-xs font-semibold text-white group-hover:whitespace-pre-wrap">
                    {item.name}
                  </span>
                  <span className="mt-0.5 w-full truncate text-[10px] text-zinc-500">
                    {item.role}
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
