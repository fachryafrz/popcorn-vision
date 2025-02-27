import { POPCORN } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LoginAlert() {
  const pathname = usePathname();

  useEffect(() => {
    document.getElementById("loginAlert").showModal();
  }, [pathname]);

  return (
    <dialog
      id="loginAlert"
      className="modal backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur"
    >
      <div className="modal-box max-w-md space-y-8">
        <figure
          style={{
            background: `url(${POPCORN})`,
            backgroundSize: `contain`,
          }}
          className={`mx-auto aspect-square w-[120px]`}
        ></figure>
        <h3 className="text-center text-2xl font-bold">Login Required!</h3>

        <div className={`space-y-4 [&>*]:text-pretty`}>
          <p>
            Hey there! Looks like you&apos;re trying to use a feature that
            requires login.
          </p>
          <p>
            By signing in, you can rate movies and TV shows, add your favorite
            titles to your collection, and build your own watchlist to keep
            track of what you want to watch next.
          </p>
          <p>
            Don&apos;t miss out! sign in now and make the most of{" "}
            {process.env.NEXT_PUBLIC_APP_NAME}!
          </p>
        </div>

        <div className={`flex gap-2`}>
          <div className={`flex-1`}>
            <form method="dialog">
              <button
                type="submit"
                className={`btn btn-ghost w-full rounded-full bg-white bg-opacity-5`}
              >
                Close
              </button>
            </form>
          </div>

          <div className={`flex-1`}>
            <button
              onClick={() => document.getElementById("login").click()}
              className={`btn btn-primary w-full rounded-full`}
            >
              Proceed to Login
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
