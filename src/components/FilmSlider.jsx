import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import slides from "../popular.json";

import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";

import "swiper/css/navigation";
import "swiper/css/autoplay";

const FilmSlider = () => {
  return (
    <div>
      <h2 className="sr-only">Most Popular</h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: ".next",
          prevEl: ".prev",
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        className="px-4 py-[5rem] lg:px-[16rem] mx-2 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-dark-gray before:max-w-[9rem] before:z-10 after:absolute after:top-0 after:right-0 after:!w-[9rem] after:!h-full after:bg-gradient-to-l after:from-base-dark-gray after:z-10 before:hidden after:hidden lg:before:block lg:after:block"
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className="overflow-hidden hover:scale-105 active:scale-100 transition-all"
          >
            <a href="#!">
              <figure className="rounded-lg overflow-hidden aspect-poster">
                <img src={slide.poster} alt={slide.title} />
              </figure>
              <div className="mt-2">
                <h3
                  title={slide.title}
                  className="font-bold text-lg line-clamp-1"
                >
                  {slide.title}
                </h3>
                <span className="text-gray-400 whitespace-nowrap">
                  {slide.release_date} &bull; {slide.genre}
                </span>
              </div>
            </a>
          </SwiperSlide>
        ))}

        <div className="absolute top-[2rem] left-0 right-0 h-8 !max-w-7xl mx-auto px-4 lg:px-[9rem] flex justify-between items-center xl:max-w-none">
          <p className="font-bold text-2xl lg:text-3xl">Most Popular</p>
          <div className="flex gap-4 items-center">
            <button className="prev h-[1.5rem]">
              <IonIcon icon={chevronBack} className="text-[1.5rem]"></IonIcon>
            </button>
            <button className="next h-[1.5rem]">
              <IonIcon
                icon={chevronForward}
                className="text-[1.5rem]"
              ></IonIcon>
            </button>
          </div>
        </div>
      </Swiper>
    </div>
  );
};

export default FilmSlider;
