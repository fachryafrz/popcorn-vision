/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import { refresh, search } from "ionicons/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Error({ error, reset }) {
  return (
    <div className={`min-h-[calc(100dvh-66px)] grid place-content-center`}>
      <div className={`flex flex-col items-center xl:flex-row xl:items-start justify-center p-4 max-w-7xl mx-auto`}>
        <figure
          style={{
            background: `url(/sad_popcorn_engineer.png)`,
          }}
          className={`w-[300px] aspect-square !bg-contain`}
        ></figure>
        <div className={`prose`}>
          <h1 style={{ textWrap: `balance` }}>Oops! Something Went Wrong</h1>
          <p>
            We&apos;re currently experiencing technical difficulties accessing
            the film information. We&apos;re working hard to fix this issue.
            Please bear with us while we sort things out.
          </p>
          <p>In the meantime, here are a few things you can try:</p>
          <ul>
            <li>
              Refresh the page: Sometimes a simple refresh can do the trick.
            </li>
            <li>
              Come back later: We&apos;re actively working on resolving this and
              expect to have things up and running smoothly shortly.
            </li>
          </ul>
          <p>
            We apologize for any inconvenience caused. Thank you for your
            patience and understanding!
          </p>

          <button onClick={() => reset()} className="btn btn-base-100">
          <IonIcon icon={refresh} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
