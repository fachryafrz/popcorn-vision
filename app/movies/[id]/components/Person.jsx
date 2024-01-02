"use client";

import { getPerson } from "@/app/api/route";
import { slugify } from "@/app/lib/slugify";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { DetailsContext } from "../context";

export default function Person({
  id,
  name,
  role,
  profile_path,
  personRole,
  tooltip = false,
}) {
  let popcorn = `/popcorn.png`;
  let profilePath = profile_path;

  const router = useRouter();

  const { setPersonModal } = useContext(DetailsContext);

  const handleActorClick = () => {
    getPerson({ id }).then((res) => {
      setPersonModal(res);
    });
  };

  return (
    <button
      onClick={personRole != `author` ? () => handleActorClick() : null}
      className={`flex flex-row text-start items-start gap-2 min-w-[120px] ${
        personRole != `author`
          ? `p-2 pr-8 hocus:bg-secondary hocus:bg-opacity-20 hocus:backdrop-blur transition-all rounded-[2rem]`
          : `cursor-default`
      }`}
    >
      <div
        className={`!w-[50px] !h-[50px] aspect-square rounded-full overflow-hidden flex-shrink-0 bg-base-100`}
      >
        <figure
          style={{
            backgroundImage:
              profile_path === null ? `url(${popcorn})` : `url(${profilePath})`,
            backgroundSize: profile_path === null ? `contain` : `cover`,
            backgroundPosition: `center`,
          }}
          className={`w-[50px] aspect-square`}
        ></figure>
      </div>
      <div
        className="w-full self-center"
      >
        <h3
          title={name}
          className={`font-medium md:line-clamp-1`}
        >
          {name}
        </h3>

        {!tooltip && role !== "" ? (
          <span className={`text-xs font-medium text-gray-400 line-clamp-2`}>
            <span title={role}>{role}</span>
          </span>
        ) : (
          role !== "" && tooltip
        )}
      </div>
    </button>
  );
}
