/* eslint-disable @next/next/no-img-element */
import { useAuth } from "@/hooks/auth";
import React, { useEffect, useState } from "react";

export default function LogoutButton({ user }) {
  const { logout } = useAuth();

  const [profileImage, setProfileImage] = useState();

  useEffect(() => {
    const { avatar } = user;

    if (avatar.tmdb.avatar_path) {
      setProfileImage(
        `https://www.themoviedb.org/t/p/w64_and_h64_face${avatar.tmdb.avatar_path}`,
      );
    }

    if (avatar.gravatar) {
      setProfileImage(`https://gravatar.com/avatar/${avatar.gravatar.hash}`);
    }
  }, [user]);

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn rounded-full border-transparent bg-opacity-0 px-2 pr-4 hover:border-transparent hover:bg-opacity-[30%] hover:backdrop-blur-sm"
      >
        <figure className="avatar">
          <div className="w-8 rounded-full">
            <img src={profileImage} alt={user.name} />
          </div>
        </figure>

        <div className={`flex flex-col items-start`}>
          <span>{user.username}</span>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box z-[1] mt-2 w-52 bg-base-100 p-2 shadow"
      >
        <li>
          <button>
            <span>Profile</span>
          </button>
        </li>
        <li>
          <button onClick={logout}>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
