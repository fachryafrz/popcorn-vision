/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

export default function TitleLogo({ film, images }) {
  const [titleLogo, setTitleLogo] = useState({});
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const isDetailPage = pathname.startsWith("/movies") || isTvPage;

  useEffect(() => {
    const fetchTitleLogo = async () => {
      axios
        .get(
          `https://api.themoviedb.org/3/${!isTvPage ? `movie` : `tv`}/${
            film.id
          }/images`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
              language: "en",
            },
          }
        )
        .then((response) => {
          setTitleLogo(response.data.logos[0]);
          setLoading(false);
        });
    };

    if (images) {
      setLoading(false);
      setTitleLogo(images.logos[0]);
    } else {
      fetchTitleLogo();
    }
  }, [film, isTvPage, images]);

  return titleLogo ? (
    <>
      {!loading ? (
        <figure className={`mb-4 flex justify-center h-[150px] w-[75%]`} style={{ 
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${titleLogo.file_path})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPositionY: isDetailPage ? 'center' : 'bottom',
         }}>
          {/* <img
            src={`https://image.tmdb.org/t/p/w500${titleLogo.file_path}`}
            alt={!isTvPage ? film.title : film.name}
            title={!isTvPage ? film.title : film.name}
            className="max-h-[150px] pointer-events-none"
          /> */}
          {!images && (
            <figcaption className={`sr-only`}>
              <h3>{!isTvPage ? film.title : film.name}</h3>
            </figcaption>
          )}
        </figure>
      ) : (
        <div
          className={`h-[150px] w-full !max-w-[350px] animate-pulse bg-gray-400 bg-opacity-30 rounded-lg`}
        ></div>
      )}
    </>
  ) : (
    <h3 className="font-bold text-4xl lg:text-5xl line-clamp-1 lg:line-clamp-2 !leading-tight">
      {!isTvPage ? film.title : film.name}
    </h3>
  );
}
