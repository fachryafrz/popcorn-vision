"use client";

/* eslint-disable @next/next/no-img-element */
import { IonIcon } from "@ionic/react";
import { chevronBackCircle, chevronForwardCircle } from "ionicons/icons";
import { YouTubeEmbed } from "@next/third-parties/google";

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
import { useEffect, useState } from "react";

export default function FilmMedia({ film, videos, images }) {
  const [youtubeParams, setYoutubeParams] = useState();

  const filteredVideos = videos?.results.filter((result) => {
    const isYouTubeOfficial =
      result.site === "YouTube" && result.official === true;
    const isEnglish = result.iso_639_1 === "en";
    const isValidType = ["Trailer", "Teaser", "Clip"].includes(result.type);

    return isYouTubeOfficial && isEnglish && isValidType;
  });

  useEffect(() => {
    const params = new URLSearchParams({
      rel: 0,
      start: 0,
      enablejsapi: 1,
      origin: window.location.origin,
      widget_referrer: window.location.href,
    }).toString();

    setYoutubeParams(params);
  }, []);

  return (
    <div id="media" className="-mx-4 flex flex-col gap-2 md:mx-0">
      <div className="max-w-full">
        <Swiper
          modules={[
            FreeMode,
            Navigation,
            Thumbs,
            Autoplay,
            EffectFade,
            Mousewheel,
            Zoom,
          ]}
          effect="fade"
          spaceBetween={16}
          navigation={{
            enabled: true,
            nextEl: "#next",
            prevEl: "#prev",
          }}
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
              <IonIcon
                icon={chevronForwardCircle}
                style={{
                  fontSize: 30,
                }}
              />
            </button>
            <button
              id="prev"
              className={`z-40 flex items-center p-2 text-white`}
              aria-labelledby={`previous-slide`}
            >
              <IonIcon
                icon={chevronBackCircle}
                style={{
                  fontSize: 30,
                }}
              />
            </button>
          </div>
          {filteredVideos.map((vid, index) => {
            return (
              <SwiperSlide key={vid.key}>
                <YouTubeEmbed
                  videoid={vid.key}
                  width={"100%"}
                  height={"100%"}
                  params={youtubeParams}
                  style={`max-width: 100%; max-height: 100%; background-image: url('https://i.ytimg.com/vi/${vid.key}/maxresdefault.jpg');`}
                />
              </SwiperSlide>
            );
          })}

          {images.slice(0, 10).map((img, index) => {
            return (
              <SwiperSlide key={index}>
                <picture>
                  <source
                    media="(min-width: 780px) and (max-width: 1279px)"
                    srcset={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                  />
                  <source
                    media="(min-width: 1280px)"
                    srcset={`https://image.tmdb.org/t/p/w1280${img.file_path}`}
                  />
                  <img
                    src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                    alt={film.title ?? film.name}
                    className={`h-full w-full object-cover`}
                    draggable={false}
                    loading="lazy"
                    width={500}
                    height={750}
                  />
                </picture>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
