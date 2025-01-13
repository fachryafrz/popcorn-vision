/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import ImagePovi from "@/components/Film/ImagePovi";

// Zustand
import { usePathname, useRouter } from "next/navigation";

export default function Person({
  id,
  name,
  role,
  profile_path,
  personRole,
  tooltip = false,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleActorClick = () => {
    router.push(`${pathname}/?person=${id}`, { scroll: false });
  };

  return (
    <button
      onClick={personRole != `author` ? () => handleActorClick() : null}
      className={`flex min-w-[120px] flex-row items-start gap-2 text-start ${
        personRole != `author`
          ? `rounded-[2rem] p-2 pr-8 transition-all hocus:bg-secondary hocus:bg-opacity-20 hocus:backdrop-blur`
          : `cursor-default`
      }`}
    >
      <div
        className={`aspect-square !h-[50px] !w-[50px] flex-shrink-0 overflow-hidden rounded-full bg-base-100`}
      >
        <ImagePovi imgPath={profile_path} className={`aspect-square w-[50px]`}>
          <img
            src={`https://image.tmdb.org/t/p/w185${profile_path}`}
            role="presentation"
            loading="lazy"
            draggable={false}
            alt=""
            aria-hidden
            width={185}
            height={185}
          />
        </ImagePovi>
      </div>

      <div className="w-full self-center">
        <h3 title={name} className={`font-medium md:line-clamp-2`}>
          {name}
        </h3>

        {!tooltip && role !== "" ? (
          <span className={`line-clamp-2 text-xs font-medium text-gray-400`}>
            <span title={role}>{role}</span>
          </span>
        ) : (
          role !== "" && tooltip
        )}
      </div>
    </button>
  );
}
