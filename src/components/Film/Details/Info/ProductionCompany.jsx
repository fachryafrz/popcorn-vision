import Reveal from "@/components/Layout/Reveal";
import Link from "next/link";
import React from "react";

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
        <Reveal delay={0.1 * i}>
          {item.logo_path ? (
            <div
              class="tooltip tooltip-bottom before:!rounded-full before:!bg-black before:!bg-opacity-80 before:!p-4 before:!py-2 before:!font-semibold before:!backdrop-blur"
              data-tip={item.name}
            >
              <figure
                className={`aspect-[2/1] h-[60px] bg-center grayscale invert transition-all hocus:grayscale-0 hocus:invert-0`}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w500${item.logo_path})`,
                  backgroundSize: `contain`,
                  backgroundRepeat: `no-repeat`,
                }}
              ></figure>

              <span className={`sr-only`}>{item.name}</span>
            </div>
          ) : (
            <span
              className={`block max-w-[120px] text-pretty text-center font-semibold`}
            >
              {item.name}
            </span>
          )}
        </Reveal>
      </Link>
      <span className={`sr-only`}>{item.name}</span>
    </>
  );
}
