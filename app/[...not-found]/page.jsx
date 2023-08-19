/* eslint-disable @next/next/no-img-element */
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
    <div className={`flex flex-col items-center justify-center h-[90vh] p-4`}>
      <h2 className={`sr-only`}>Not Found</h2>
      <img
        src={`/sad_popcorn.png`}
        alt={process.env.APP_NAME}
        className={`h-[200px] w-[200px] object-contain`}
      />
      <p>Oops! We don&apos;t think we have this page.</p>
      <p>Try searching for something else.</p>
      <div
        className={`mt-4 px-4 py-4 -top-8 w-full max-w-xl sm:mx-auto bg-gray-600 bg-opacity-[90%] backdrop-blur flex items-center gap-4 mx-4 rounded-2xl shadow-xl border-t-4 border-x-4 border-base-dark-gray before:absolute before:w-4 before:h-4 before:bg-transparent before:top-3 before:-left-5 before:rounded-br-xl before:shadow-custom-left after:absolute after:w-4 after:h-4 after:bg-transparent after:top-3 after:-right-5 after:rounded-bl-xl after:shadow-custom-right`}
      >
        <IonIcon icon={search} className={`text-[1.25rem]`} />
        <form onSubmit={handleSubmit} className={`w-full`}>
          <input
            onChange={handleSearchQuery}
            type="text"
            placeholder="Search"
            className={`text-white bg-transparent w-full`}
          />
          <input type="submit" className="sr-only" />
        </form>
      </div>
    </div>
  );
}
