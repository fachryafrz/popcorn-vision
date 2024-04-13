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

  let profilePath = profile_path;

  const handleActorClick = () => {
    router.push(`${pathname}/?person=${id}`, {
      scroll: false,
    });
  };

  return (
    <button
      onClick={personRole != `author` ? () => handleActorClick() : null}
      // href={{
      //   pathname,
      //   query: { person: id },
      // }}
      // as={{
      //   pathname: `/person/${id}`,
      // }}
      className={`flex min-w-[120px] flex-row items-center gap-2 text-start ${
        personRole != `author`
          ? `rounded-[2rem] p-2 pr-8 transition-all hocus:bg-secondary hocus:bg-opacity-20 hocus:backdrop-blur`
          : `cursor-default`
      }`}
    >
      <div
        className={`aspect-square !h-[50px] !w-[50px] flex-shrink-0 overflow-hidden rounded-full bg-base-100`}
      >
        <ImagePovi imgPath={profilePath} className={`aspect-square w-[50px]`} />
      </div>

      <div className="w-full self-center">
        <h3 title={name} className={`font-medium md:line-clamp-1`}>
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
