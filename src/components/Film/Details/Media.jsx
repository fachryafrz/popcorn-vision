/* eslint-disable @next/next/no-img-element */
import { IonIcon } from "@ionic/react";
import { chevronBackCircle, chevronForwardCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  FreeMode,
  Mousewheel,
  Navigation,
  Thumbs,
  Zoom,
} from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import "swiper/css/zoom";
import Reveal from "@/components/Layout/Reveal";
import YouTube from "react-youtube";

export default function FilmMedia({ videos, images }) {
  const [mediaSwiper, setMediaSwiper] = useState();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeVideo, setActiveVideo] = useState({
    index: null,
    video: null,
  });

  const filteredVideos =
    videos &&
    videos.results.filter(
      (result) =>
        (result.site === "YouTube" &&
          result.official === true &&
          result.iso_639_1 === "en" &&
          result.type === "Trailer") ||
        result.type === "Teaser" ||
        result.type === "Clip",
    );

  useEffect(() => {
    if (activeVideo.index !== activeSlide) {
      activeVideo.video?.pauseVideo();
    } else {
      activeVideo.video?.playVideo();
    }
  }, [activeSlide, activeVideo]);

  return (
    <div id="media" className="flex flex-col gap-2 -mx-4 md:mx-0">
      <div className="max-w-full">
        <Swiper
          onSwiper={(swiper) => setMediaSwiper(swiper)}
          onSlideChange={() => {
            if (mediaSwiper) {
              setActiveSlide(mediaSwiper.activeIndex);
            }
          }}
          modules={[
            FreeMode,
            Navigation,
            Thumbs,
            Autoplay,
            EffectFade,
            Mousewheel,
            Zoom,
          ]}
          // zoom={true}
          effect="fade"
          spaceBetween={16}
          // mousewheel={true}
          navigation={{
            enabled: true,
            nextEl: "#next",
            prevEl: "#prev",
          }}
          // autoplay={{
          //   delay: 3000,
          //   disableOnInteraction: true,
          //   pauseOnMouseEnter: true,
          // }}
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          className="relative aspect-video overflow-hidden md:rounded-xl"
        >
          <div
            id="navigation"
            className={`absolute inset-0 flex flex-row-reverse items-center justify-between`}
          >
            <button
              id="next"
              className={`z-40 flex items-center p-2 text-white`}
              aria-labelledby={`next-slide`}
            >
              <IonIcon icon={chevronForwardCircle} className={`text-3xl`} />
            </button>
            <button
              id="prev"
              className={`z-40 flex items-center p-2 text-white`}
              aria-labelledby={`previous-slide`}
            >
              <IonIcon icon={chevronBackCircle} className={`text-3xl`} />
            </button>
          </div>
          {filteredVideos
            // .reverse()
            // .slice(0, 10)
            .map((vid, index) => {
              return (
                <SwiperSlide key={vid.key}>
                  {/* <link
                    href={`https://youtube.com/embed/${vid.key}?rel=0&start=0`}
                  />
                  <meta content={vid.name} />
                  <meta
                    content={`https://i.ytimg.com/vi_webp/${vid.key}/maxresdefault.webp`}
                  />
                  <meta content={vid.published_at} />
                  <iframe
                    src={`https://youtube.com/embed/${vid.key}?rel=0&start=0`}
                    title="YouTube video player"
                    loading="lazy"
                    frameBorder="0"
                    allowFullScreen
                    className={`w-full h-full`}
                  ></iframe> */}

                  <YouTube
                    videoId={vid.key}
                    className={`h-full w-full`}
                    iframeClassName={`w-full h-full`}
                    // onReady={(e) => console.log(`Ready`, e)}
                    onPlay={(e) => setActiveVideo({ index, video: e.target })}
                    // onPause={(e) => console.log(`Pause`, e)}
                    opts={{
                      playerVars: {
                        rel: 0,
                        start: 0,
                      },
                    }}
                  />
                </SwiperSlide>
              );
            })}

          {images.slice(0, 10).map((img, index) => {
            return (
              <SwiperSlide key={index}>
                <figure className="swiper-zoom-container">
                  <img
                    src={`https://image.tmdb.org/t/p/w1280${img.file_path}`}
                    alt={``}
                    className={`h-full w-full object-cover`}
                    draggable={false}
                    loading="lazy"
                  />
                </figure>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
