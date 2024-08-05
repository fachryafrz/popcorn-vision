/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import { refresh } from "ionicons/icons";

export default function Error({ error, reset }) {
  return (
    <div className={`grid min-h-[calc(100dvh-66px)] place-content-center`}>
      <div
        className={`mx-auto flex max-w-7xl flex-col items-center justify-center p-4 xl:flex-row xl:items-start`}
      >
        <figure
          style={{
            background: `url(/sad_popcorn_engineer.png)`,
          }}
          className={`aspect-square w-[300px] !bg-contain`}
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

          <button onClick={() => reset()} className="btn-base-100 btn">
            <IonIcon icon={refresh} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
