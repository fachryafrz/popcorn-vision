"use client";

import { getPerson } from "@/lib/fetch";
import React from "react";
import ImagePovi from "@/components/Film/ImagePovi";

// Redux Toolkit
import { useDispatch } from "react-redux";
import { setPerson } from "@/redux/personSlice";

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
      className={`flex flex-row text-start items-center gap-2 min-w-[120px] ${
        personRole != `author`
          ? `p-2 pr-8 hocus:bg-secondary hocus:bg-opacity-20 hocus:backdrop-blur transition-all rounded-[2rem]`
          : `cursor-default`
      }`}
    >
      <div
        className={`!w-[50px] !h-[50px] aspect-square rounded-full overflow-hidden flex-shrink-0 bg-base-100`}
      >
        <ImagePovi imgPath={profilePath} className={`w-[50px] aspect-square`} />
      </div>

      <div className="w-full self-center">
        <h3 title={name} className={`font-medium md:line-clamp-1`}>
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
