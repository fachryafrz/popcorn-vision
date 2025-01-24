/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function TitleLogo({ film, images, setLoading }) {
  const [titleLogo, setTitleLogo] = useState(images);

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const isDetailPage = pathname.startsWith("/movies") || isTvPage;
  const title = !isTvPage ? film.title : film.name;

  return titleLogo ? (
    <figure className="mb-4 flex justify-center md:justify-start">
      <img
        src={`https://image.tmdb.org/t/p/w500${titleLogo.file_path}`}
        alt=""
        aria-hidden
        className=" max-h-[180px] bg-contain object-contain"
        draggable={false}
        role="presentation"
        width={400}
        height={180}
      />

      {/* {!images && (
          <figcaption className="sr-only">
            <h3 style={{ textWrap: `balance` }}>{title}</h3>
          </figcaption>
        )} */}
    </figure>
  ) : (
    <>
      {/* This fallback is for FilmSummary component */}

      <span
        aria-hidden
        className="line-clamp-2 text-center text-3xl font-bold !leading-normal md:text-left lg:text-5xl"
        style={{ textWrap: `balance` }}
      >
        {title}
      </span>
    </>
  );
}
