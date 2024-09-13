/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import {
  logoGithub,
  logoInstagram,
  logoLinkedin,
  logoTwitter,
} from "ionicons/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import packageJson from "../../../package.json";

// JSON import
import footer from "../../json/footer.json";
import Reveal from "./Reveal";
import { POPCORN } from "@/lib/constants";

export default function Footer() {
  const tmdbImg = `https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg`;

  // Date variables
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
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
    <footer className="mx-auto flex max-w-7xl flex-col px-4 pt-[2rem] text-white">
      <Reveal>
        <div className="flex flex-col items-center justify-center pb-8 text-center">
          <figure
            style={{
              background: `url(${POPCORN})`,
              backgroundSize: `contain`,
            }}
            className={`aspect-square w-[200px]`}
          ></figure>
          <figcaption
            className={`w-[200px] items-center text-center text-4xl font-bold after:leading-tight after:content-["Popcorn_Vision"]`}
          ></figcaption>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {footer.map((footer, i) => (
          <div key={footer.id}>
            <Reveal delay={0.05 * i}>
              <h2 className="mb-2 text-xl font-bold xl:mb-4">
                {footer.section}
              </h2>
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
                          className="max-w-fit font-light tracking-wider transition-all hocus:font-normal"
                        >
                          {link.name}
                        </button>
                      ) : (
                        <Link
                          href={link.url}
                          className="max-w-fit font-light tracking-wider transition-all hocus:font-normal"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
              </ul>
            </Reveal>
          </div>
        ))}
        <div>
          <Reveal delay={0.2}>
            <h2 className="mb-2 text-xl font-bold xl:mb-4">Get in Touch</h2>
            <p className="mb-2 font-light tracking-wide xl:mb-4">
              Stay connected with us to discover more stories about new movies
              and explore more with us
            </p>
            <div className="flex flex-wrap gap-2">
              <Reveal delay={0.05}>
                <Link
                  href="https://github.com/fachryafrz"
                  target="_blank"
                  className="grid place-items-center rounded-[3rem] bg-secondary bg-opacity-10 p-3 text-primary-blue transition-all hocus:scale-110 hocus:rounded-[0.75rem] hocus:bg-opacity-25"
                >
                  <IonIcon icon={logoGithub} className="text-[1.25rem]" />
                </Link>
              </Reveal>
              <Reveal delay={0.1}>
                <Link
                  href="https://twitter.com/fachryafrz"
                  target="_blank"
                  className="grid place-items-center rounded-[3rem] bg-secondary bg-opacity-10 p-3 text-primary-blue transition-all hocus:scale-110 hocus:rounded-[0.75rem] hocus:bg-opacity-25"
                >
                  <IonIcon icon={logoTwitter} className="text-[1.25rem]" />
                </Link>
              </Reveal>
              <Reveal delay={0.15}>
                <Link
                  href="https://instagram.com/fachryafrz"
                  target="_blank"
                  className="grid place-items-center rounded-[3rem] bg-secondary bg-opacity-10 p-3 text-primary-blue transition-all hocus:scale-110 hocus:rounded-[0.75rem] hocus:bg-opacity-25"
                >
                  <IonIcon icon={logoInstagram} className="text-[1.25rem]" />
                </Link>
              </Reveal>
              <Reveal delay={0.2}>
                <Link
                  href="https://www.linkedin.com/in/fachryafrz"
                  target="_blank"
                  className="grid place-items-center rounded-[3rem] bg-secondary bg-opacity-10 p-3 text-primary-blue transition-all hocus:scale-110 hocus:rounded-[0.75rem] hocus:bg-opacity-25"
                >
                  <IonIcon icon={logoLinkedin} className="text-[1.25rem]" />
                </Link>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="flex flex-col justify-center border-t border-secondary border-opacity-25 p-4 text-center">
        <Reveal>
          <span style={{ textWrap: `balance` }}>
            {`Popcorn Vision © ${
              createdYear == currentYear
                ? `${createdMonth} ${createdYear}`
                : `${createdMonth} ${createdYear} - ${currentMonth} ${currentYear}`
            } all rights reserved`}
          </span>
        </Reveal>
        <Reveal>
          <span className={`flex items-center justify-center gap-1`}>
            <span>Powered by</span>
            <Link
              href="https://themoviedb.org"
              target="_blank"
              className={`h-6 p-1.5 pl-0 pt-2`}
            >
              <figure
                className={`h-[10px] w-[77px]`}
                title={`The Movie Database`}
                style={{
                  backgroundImage: `url(${tmdbImg})`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `contain`,
                }}
              ></figure>
            </Link>
          </span>
        </Reveal>
        {/* <Reveal>
          <span>{`v${packageJson.version}`}</span>
        </Reveal> */}
      </div>
    </footer>
  );
}
