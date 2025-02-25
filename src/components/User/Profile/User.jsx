/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/hooks/auth";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { logOutOutline } from "ionicons/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

export default function User({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate } = useAuth();

  const [profileImage, setProfileImage] = useState(null);

  const logout = async () => {
    await axios.delete(`/api/authentication/logout`).then(() => mutate(null));

    if (pathname === "/profile") {
      router.push("/login");
    }
  };

  useEffect(() => window.scrollTo(0, 0), []);

  useLayoutEffect(() => {
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
      className={`relative flex flex-col items-center justify-center gap-4 text-center md:flex-row md:text-start`}
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
              width={500}
              height={500}
            />
          </div>
        </figure>
      )}

      <div className={`flex flex-col-reverse gap-2`}>
        <h1 className={`text-md font-medium text-gray-400 md:text-xl`}>
          {user.name}
        </h1>
        <h2 className={`text-2xl font-bold md:text-4xl`}>{user.username}</h2>
      </div>

      <div className={`sm:absolute right-4 top-0`}>
        <button onClick={logout} className={`btn btn-error btn-sm`}>
          <IonIcon
            icon={logOutOutline}
            style={{
              fontSize: 24,
            }}
          />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
