"use client";

import { getPerson } from "@/lib/fetch";
import React from "react";
import ImagePovi from "@/components/Film/ImagePovi";

// Redux Toolkit
import { useDispatch } from "react-redux";
import { setPerson } from "@/redux/slices/personSlice";

export default function Person({
  id,
  name,
  role,
  profile_path,
  personRole,
  tooltip = false,
}) {
  const dispatch = useDispatch();

  let profilePath = profile_path;

  const handleActorClick = () => {
    getPerson({ id }).then((res) => {
      // Redux Toolkit
      dispatch(setPerson(res));
    });
  };

  return (
    <button
      onClick={personRole != `author` ? () => handleActorClick() : null}
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
