/* eslint-disable @next/next/no-img-element */
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
        prefetch={true}
      >
        <Reveal delay={0.1 * i}>
          {item.logo_path ? (
            <div
              class="tooltip tooltip-bottom before:!hidden before:!rounded-2xl before:!bg-black before:!bg-opacity-80 before:!p-4 before:!py-2 before:!font-semibold before:!backdrop-blur md:before:!inline-block"
              data-tip={item.name}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${item.logo_path}`}
                draggable={false}
                loading="lazy"
                alt={item.name}
                role="presentation"
                className={`aspect-[2/1] h-[60px] bg-center object-contain grayscale invert transition-all hocus:grayscale-0 hocus:invert-0`}
              />
            </div>
          ) : (
            <span
              data-before-content={item.name}
              className={`before-content block max-w-[120px] text-pretty text-center font-semibold`}
            />
          )}
        </Reveal>
      </Link>
    </>
  );
}
