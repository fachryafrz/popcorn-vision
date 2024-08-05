"use client";

import { IonIcon } from "@ionic/react";
import { search } from "ionicons/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    router.replace(`/search?query=${searchQuery.replace(/\s+/g, "+")}`);
  };

  return (
    <div className={`flex h-[90dvh] flex-col items-center justify-center p-4`}>
      <h2 className={`sr-only`}>Not Found</h2>
      <figure
        style={{
          background: `url(/sad_popcorn.png)`,
          backgroundSize: `contain`,
        }}
        className={`aspect-square w-[200px]`}
      ></figure>
      <p>Oops! We don&apos;t have this page.</p>
      <p>Try searching for something else.</p>
      {/* <div
        className={`-top-8 mx-4 mt-4 flex w-full max-w-xl items-center gap-4 rounded-2xl border-x-4 border-t-4 border-base-100 bg-gray-600 bg-opacity-[90%] px-4 py-4 shadow-xl backdrop-blur before:absolute before:-left-5 before:top-3 before:h-4 before:w-4 before:rounded-br-xl before:bg-transparent before:shadow-custom-left after:absolute after:-right-5 after:top-3 after:h-4 after:w-4 after:rounded-bl-xl after:bg-transparent after:shadow-custom-right sm:mx-auto`}
      >
        <IonIcon icon={search} className={`text-[1.25rem]`} />
        <form onSubmit={handleSubmit} className={`w-full`}>
          <input
            onChange={handleSearchQuery}
            type="text"
            placeholder="Search"
            className={`w-full bg-transparent text-white`}
          />
          <input type="submit" className="sr-only" />
        </form>
      </div> */}
    </div>
  );
}
