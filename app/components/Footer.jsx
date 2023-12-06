/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import {
  logoFacebook,
  logoInstagram,
  logoTwitter,
  logoYoutube,
} from "ionicons/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// JSON import
import footer from "@/app/json/footer.json";

export default function Footer() {
  // Date variables
  const currentYear = new Date().getFullYear();
  const createdDate = new Date("2023-02-17");
  const createdMonth = createdDate.toLocaleString("en-US", { month: "short" });
  const createdYear = createdDate.getFullYear();

  const pathname = usePathname();

  // Router variables
  const isTvPage = pathname.startsWith("/tv");

  const [installPrompt, setInstallPrompt] = useState();

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    });
  }, []);

  return (
    <footer className="px-4 mx-auto pt-[2rem] max-w-7xl flex flex-col text-white">
      <div className="flex flex-col items-center justify-center text-center pb-8">
        <figure
          style={{ background: `url(/popcorn.png)`, backgroundSize: `contain` }}
          className={`w-[200px] aspect-square`}
        ></figure>
        <figcaption
          className={`w-[200px] font-bold text-4xl text-center items-center after:leading-tight after:content-["Popcorn_Vision"]`}
        ></figcaption>
      </div>
      <div className="grid gap-8 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {footer.map((footer) => (
          <div key={footer.id}>
            <h2 className="font-bold text-xl mb-2 xl:mb-4">{footer.section}</h2>
            <ul>
              {footer.links &&
                footer.links.map((link) => (
                  <li key={link.name}>
                    {link.url === `/download` ? (
                      <button
                        onClick={async () => {
                          await installPrompt.prompt();

                          setInstallPrompt(null);
                        }}
                        className="font-light tracking-wider hocus:font-normal transition-all max-w-fit"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        href={link.url}
                        className="font-light tracking-wider hocus:font-normal transition-all max-w-fit"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="font-bold text-xl mb-2 xl:mb-4">Get in Touch</h2>
          <p className="font-light tracking-wide mb-2 xl:mb-4">
            Stay connected with us to discover more stories about new movies and
            explore more with us
          </p>
          <div className="flex gap-2 flex-wrap">
            <a
              href="https://facebook.com/fachryafrz"
              target="_blank"
              className="bg-secondary bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hocus:bg-opacity-25 hocus:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={logoFacebook} className="text-[1.25rem]" />
            </a>
            <a
              href="https://twitter.com/fachryafrz"
              target="_blank"
              className="bg-secondary bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hocus:bg-opacity-25 hocus:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={logoTwitter} className="text-[1.25rem]" />
            </a>
            <a
              href="https://instagram.com/fachryafrz"
              target="_blank"
              className="bg-secondary bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hocus:bg-opacity-25 hocus:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={logoInstagram} className="text-[1.25rem]" />
            </a>
            <a
              href="https://youtube.com/@fachryafrz"
              target="_blank"
              className="bg-secondary bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hocus:bg-opacity-25 hocus:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={logoYoutube} className="text-[1.25rem]" />
            </a>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col justify-center border-t border-secondary border-opacity-25 text-center">
        <span>
          Popcorn Vision &copy;{" "}
          {createdYear == currentYear
            ? `${createdMonth} ${createdYear}`
            : `${createdMonth} ${createdYear}-${currentYear}`}{" "}
          all rights reserved
        </span>
        <span className={`flex gap-1 items-center justify-center`}>
          <span>Powered by</span>
          <a href="https://themoviedb.org" target="_blank">
            <img
              src={`https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg`}
              alt={`The Movie DB`}
              className={`w-20 object-contain`}
            />
          </a>
        </span>
      </div>
    </footer>
  );
}
