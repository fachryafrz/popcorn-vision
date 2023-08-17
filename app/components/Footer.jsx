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
import React from "react";
import { usePathname } from "next/navigation";

// JSON import
import footer from "@/app/json/footer.json";

export default function Footer() {
  // Date variables
  const currentYear = new Date().getFullYear();
  const createdYear = 2023;

  const pathname = usePathname();

  // Router variables
  const isTvPage = pathname.startsWith("/tv");
  return (
    <div className="px-4 lg:px-6 mx-auto pt-[2rem] xl:px-[9rem] flex flex-col text-white">
      <div className="flex flex-col items-center justify-center text-center pb-8">
        <figure
          className={`w-[100px] flex flex-col font-bold text-4xl text-center items-center after:leading-tight after:content-["Popcorn_Vision"]`}
        >
          <img loading="lazy" src={`/popcorn.png`} alt="Popcorn Vision" />
        </figure>
      </div>
      <div className="grid gap-8 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {footer.map((footer) => (
          <div key={footer.id}>
            <h2 className="font-bold text-xl mb-2 xl:mb-4">{footer.section}</h2>
            <ul>
              {footer.links &&
                footer.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={isTvPage ? `/tv` : `/`}
                      className="font-light tracking-wider hocus:font-normal transition-all max-w-fit"
                    >
                      {link.name}
                    </Link>
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
              className="bg-base-gray bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hocus:bg-opacity-25 hocus:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={logoFacebook} className="text-[1.25rem]" />
            </a>
            <a
              href="https://twitter.com/fachryafrz"
              target="_blank"
              className="bg-base-gray bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hocus:bg-opacity-25 hocus:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={logoTwitter} className="text-[1.25rem]" />
            </a>
            <a
              href="https://instagram.com/fachryafrz"
              target="_blank"
              className="bg-base-gray bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hocus:bg-opacity-25 hocus:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={logoInstagram} className="text-[1.25rem]" />
            </a>
            <a
              href="https://youtube.com/@fachryafrz"
              target="_blank"
              className="bg-base-gray bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hocus:bg-opacity-25 hocus:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={logoYoutube} className="text-[1.25rem]" />
            </a>
          </div>
        </div>
      </div>
      <div className="p-8 flex justify-center border-t border-base-gray border-opacity-25 text-center">
        <p>
          Popcorn Vision &copy;{" "}
          {createdYear == currentYear
            ? createdYear
            : `${createdYear}-${currentYear}`}{" "}
          all rights reserved
        </p>
      </div>
    </div>
  );
}
