/* eslint-disable @next/next/no-img-element */
import { useAuth } from "@/hooks/auth";
import { revalidateRedirect } from "@/lib/revalidateRedirect";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { logOutOutline, personOutline } from "ionicons/icons";
import { usePathname } from "next/navigation";
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useState } from "react";

export default function LogoutButton({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate } = useAuth();

  const logout = async () => {
    await axios.delete(`/api/authentication/logout`).then(() => mutate(null));

    if (pathname === "/profile") {
      router.push("/login");
    }
  };

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
    <div className="dropdown dropdown-end h-full w-full">
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-square btn-sm flex h-full w-full rounded-full border-transparent bg-opacity-0 p-0 hocus:border-transparent hocus:bg-opacity-[30%] hocus:backdrop-blur-sm`}
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
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box z-50 mt-3 max-w-52 bg-base-200 p-2 font-medium shadow"
      >
        <li>
          <button onClick={() => revalidateRedirect("/profile")}>
            <IonIcon icon={personOutline} className={`!text-xl`} />
            <span className={`whitespace-nowrap`}>{user.username}</span>
          </button>
        </li>
        <li>
          <button onClick={logout} className={`text-error`}>
            <IonIcon icon={logOutOutline} className={`!text-2xl`} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
