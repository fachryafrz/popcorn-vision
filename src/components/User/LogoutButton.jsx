/* eslint-disable @next/next/no-img-element */
import { useAuth } from "@/hooks/auth";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LogoutButton({ user }) {
  const router = useRouter();

  const { logout } = useAuth();

  const [profileImage, setProfileImage] = useState(null);

  const handleProfile = async () => {
    await axios
      .get(`/api/revalidate`, {
        params: { path: "/profile" },
      })
      .then(({ data: { revalidated, path } }) => {
        if (revalidated) {
          router.push(path);
        }
      });
  };

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
        className={`btn aspect-square h-auto min-h-0 rounded-full border-transparent bg-opacity-0 p-1 hover:border-transparent hover:bg-opacity-[30%] hover:backdrop-blur-sm sm:m-0 xl:aspect-auto`}
      >
        {!profileImage ? (
          <div className="avatar placeholder">
            <div className="w-8 rounded-full bg-base-100 text-neutral-content">
              <span className="text-xs">{user.username.slice(0, 2)}</span>
            </div>
          </div>
        ) : (
          <figure className="avatar">
            <div className="w-8 rounded-full">
              <img src={profileImage} alt={user.name} />
            </div>
          </figure>
        )}

        {/* <div className={`hidden flex-col items-start xl:flex`}>
          <span>{user.username}</span>
        </div> */}
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box z-[1] mt-2 w-52 bg-base-100 p-2 shadow"
      >
        <li>
          <button onClick={handleProfile}>
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
