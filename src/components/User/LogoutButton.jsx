/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LogoutButton({ user }) {
  const [profileImage, setProfileImage] = useState(null);

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
    <Link
      href={`/profile`}
      prefetch={false}
      className={`btn btn-circle flex border-transparent bg-opacity-0 p-0 hocus:border-transparent hocus:bg-opacity-[30%] hocus:backdrop-blur-sm`}
    >
      {!profileImage ? (
        <div className="avatar placeholder">
          <div className="w-[36px] rounded-full bg-base-100 text-neutral-content">
            <span className="text-xs">{user.username.slice(0, 2)}</span>
          </div>
        </div>
      ) : (
        <figure className="avatar">
          <div className="w-[36px] rounded-full">
            <img
              src={profileImage}
              alt={user.name}
              draggable={false}
              width={64}
              height={64}
            />
          </div>
        </figure>
      )}
    </Link>
  );
}
