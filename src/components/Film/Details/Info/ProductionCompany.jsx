/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function ProductionCompany({ item, i, isTvPage }) {
  return (
    <>
      <Link
        href={
          !isTvPage
            ? `/search?with_companies=${item.id}`
            : `/tv/search?with_companies=${item.id}`
        }
         
      >
        {item.logo_path ? (
          <div
            className="tooltip tooltip-bottom before:!hidden before:!rounded-2xl before:!bg-black before:!bg-opacity-80 before:!p-4 before:!py-2 before:!font-semibold before:!backdrop-blur md:before:!inline-block"
            data-tip={item.name}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.logo_path}`}
              draggable={false}
              alt=""
              aria-hidden
              role="presentation"
              className={`aspect-[2/1] h-[60px] bg-center object-contain grayscale invert transition-all hocus:grayscale-0 hocus:invert-0`}
              width={120}
              height={60}
            />
            <p className="sr-only">{item.name}</p>
          </div>
        ) : (
          <p className="max-w-[120px] text-pretty text-center font-semibold">
            {item.name}
          </p>
        )}
      </Link>
    </>
  );
}
