// Dummy Data
import slides from "../highlight.json";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper";

// Ionic Icons
import { IonIcon } from "@ionic/react";
import { star, informationCircleOutline, playOutline } from "ionicons/icons";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

const HomeSlider = () => {
  return (
    <div>
      <h2 className="sr-only">Movie Highlights</h2>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={0}
        slidesPerView={1}
        className="lg:rounded-bl-[3rem] lg:ml-[5rem]"
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className="h-[50vh] md:h-[90vh] flex items-end p-4 lg:p-[4rem] relative before:absolute before:inset-0 before:bg-gradient-to-t md:before:bg-gradient-to-tr before:from-base-dark-gray before:via-base-dark-gray before:opacity-[50%] after:absolute after:inset-0 after:bg-gradient-to-t lg:after:bg-gradient-to-tr after:from-base-dark-gray lg:after:opacity-[90%]"
          >
            <figure className="absolute inset-0 -z-10">
              <img src={slide.img} alt={slide.title} />
            </figure>
            <div className="flex flex-col gap-2 lg:gap-4 z-20 md:max-w-[70%] lg:max-w-[40%]">
              <h3 className="font-bold text-2xl lg:text-5xl line-clamp-1 lg:line-clamp-2">
                {slide.title}
              </h3>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <IonIcon
                    icon={star}
                    className="text-primary-yellow !w-5 h-full aspect-square"
                  />
                  <span className="text-base md:text-xl text-white">
                    {slide.rating}
                  </span>
                </div>
                <span className="hidden md:block">|</span>
                <span className="hidden md:block text-gray-400">
                  {slide.runtime} &bull; {slide.genre} &bull;{" "}
                  {slide.release_date}
                </span>
              </div>
              <p className="line-clamp-1 md:line-clamp-3">{slide.synopsys}</p>
              <div className="flex gap-4 mt-4">
                <a
                  href="#!"
                  className="w-full text-sm p-4 md:px-8 rounded-lg bg-primary-blue bg-opacity-60 uppercase font-medium tracking-wider flex justify-center items-center gap-1 transition-all md:max-w-fit hover:bg-opacity-100 hover:scale-105 active:scale-100 md:text-base"
                >
                  <IonIcon
                    icon={informationCircleOutline}
                    className="!w-5 h-full aspect-square"
                  />
                  Details
                </a>
                <a
                  href="#!"
                  className="w-full text-sm p-4 md:px-8 rounded-lg bg-base-gray bg-opacity-40 uppercase font-medium tracking-wider flex justify-center items-center gap-1 transition-all md:max-w-fit hover:bg-opacity-100 hover:scale-105 active:scale-100 md:text-base"
                >
                  <IonIcon
                    icon={playOutline}
                    className="!w-5 h-full aspect-square"
                  />
                  Trailer
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;
