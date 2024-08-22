/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/hooks/auth";
import { useEffect, useState } from "react";

export default function User({ user }) {
  window.scrollTo(0, 0);

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (!user) return;

    const { avatar } = user;

    if (avatar.tmdb.avatar_path) {
      setProfileImage(
        `https://www.themoviedb.org/t/p/w64_and_h64_face${avatar.tmdb.avatar_path}`,
      );
    }

    if (avatar.gravatar) {
      setProfileImage(
        `https://gravatar.com/avatar/${avatar.gravatar.hash}?s=500`,
      );
    }
  }, [user]);

  if (!user) return;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center md:flex-row md:text-start`}
    >
      {!profileImage ? (
        <div className="avatar placeholder">
          <div className="w-[100px] rounded-full bg-base-200 text-neutral-content md:w-[150px]">
            <span className="text-7xl">{user.username.slice(0, 2)}</span>
          </div>
        </div>
      ) : (
        <figure className="avatar">
          <div className="w-[100px] rounded-full md:w-[150px]">
            <img
              src={profileImage}
              alt={user.name}
              draggable={false}
              loading="lazy"
            />
          </div>
        </figure>
      )}

      <div className={`flex flex-col gap-2`}>
        <h1 className={`text-2xl font-bold md:text-4xl`}>{user.username}</h1>
        <span className={`text-md font-medium text-gray-400 md:text-xl`}>
          {user.name}
        </span>
      </div>
    </div>
  );
}
