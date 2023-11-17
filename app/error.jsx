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
    <div className={`h-[calc(100svh-66px)] grid place-content-center`}>
      <div
        className={`flex items-start justify-center p-4 max-w-7xl mx-auto`}
      >
        <figure
          style={{
            background: `url(/sad_popcorn_engineer.png)`,
          }}
          className={`w-[300px] aspect-square !bg-contain`}
        ></figure>
        <div className={`prose`}>
          <h1>Oops! Something Went Wrong</h1>
          <p>
            We're currently experiencing technical difficulties accessing the
            film information. We're working hard to fix this issue. Please
            bear with us while we sort things out.
          </p>
          <p>In the meantime, here are a few things you can try:</p>
          <ul>
            <li>
              Refresh the page: Sometimes a simple refresh can do the trick.
            </li>
            <li>
              Come back later: We're actively working on resolving this and expect
              to have things up and running smoothly shortly.
            </li>
          </ul>
          <p>We apologize for any inconvenience caused. Thank you for your patience and understanding!</p>
        </div>
      </div>
    </div>
  );
}
