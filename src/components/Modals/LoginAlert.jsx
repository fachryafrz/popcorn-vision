import axios from "@/lib/axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

export default function LoginAlert() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );

  const getToken = async () => {
    await axios.get("/authentication/token/new").then(({ data }) => {
      const { request_token: REQUEST_TOKEN } = data;

      router.push(
        `https://www.themoviedb.org/authenticate/${REQUEST_TOKEN}?redirect_to=${window.location.href}`,
      );
    });
  };

  const closeModal = () => {
    // NOTE: This is optional, but i'm doing this anyway
    document.getElementById("loginAlert").close();

    current.delete("rating");
    current.delete("favorite");
    current.delete("watchlist");

    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  };

  return (
    <dialog
      id="loginAlert"
      className="modal backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur"
    >
      <div className="modal-box flex max-w-sm flex-col items-center">
        <h3 className="text-center text-lg font-bold">Login Required!</h3>
        <p className="py-4 text-center">This action requires you to log in.</p>
        <button
          onClick={getToken}
          className={`btn btn-primary w-full rounded-full`}
        >
          Proceed to Login
        </button>
      </div>
      <form method="dialog" onSubmit={closeModal} className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
