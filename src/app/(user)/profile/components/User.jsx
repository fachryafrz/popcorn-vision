/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/hooks/auth";
import { useEffect, useState } from "react";

export default function User({ user }) {
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
    <div className={`flex items-center justify-center gap-8`}>
      <figure className={`max-w-[200px] overflow-hidden rounded-full pointer-events-none`}>
        <img src={profileImage} alt={user.name} />
      </figure>

      <div className={`flex flex-col gap-2`}>
        <h1 className={`text-5xl font-bold`}>{user.username}</h1>
        <span className={`text-2xl font-medium text-gray-400`}>
          {user.name}
        </span>
      </div>
    </div>
  );
}
