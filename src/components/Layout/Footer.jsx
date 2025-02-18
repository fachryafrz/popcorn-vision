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
import { POPCORN } from "@/lib/constants";
import dayjs from "dayjs";

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
  const today = dayjs();
  const tomorrow = today.add(1, "days").format("YYYY-MM-DD");
  const endOfNextYear = today.add(1, "year").endOf("year").format("YYYY-MM-DD");

  const footerLinks = [
    {
      title: "Authentication",
      links: [
        { name: "Login", href: "/login" },
        { name: "Favorites", href: "/profile" },
        { name: "Watchlist", href: "/profile" },
        { name: "Rated Film", href: "/profile" },
      ],
    },
    {
      title: "Explore",
      links: [
        { name: "Movies", href: "/" },
        { name: "TV Shows", href: "/tv" },
        { name: "Top Rated Movies", href: "/search?sort_by=vote_count.desc" },
        {
          name: "Upcoming Movies",
          href: `/search?release_date=${tomorrow}..${endOfNextYear}`,
        },
        { name: "Popular TV Shows", href: "/tv/search?sort_by=vote_count.desc" },
      ],
    },
    {
      title: "Search",
      links: [
        { name: "Filters", href: `${isTvPage ? "/tv" : ""}/search` },
        {
          name: "Genres",
          href: `${isTvPage ? "/tv" : ""}/search?with_genres=16`,
        },
        {
          name: "Actors",
          href: `${isTvPage ? "/tv" : ""}/search?with_cast=6384`,
        },
        {
          name: "Streaming",
          href: `${isTvPage ? "/tv" : ""}/search?watch_providers=8`,
        },
        {
          name: "Vote Count",
          href: `${isTvPage ? "/tv" : ""}/search?vote_count=10000`,
        },
      ],
    },
  ];

  return (
    <footer className="mx-auto flex max-w-7xl flex-col px-4 pt-[2rem] text-white">
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
      <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {footerLinks.map((footer) => (
          <div key={footer.title}>
            <h2 className="mb-2 text-xl font-bold xl:mb-4">{footer.title}</h2>
            <ul>
              {footer.links &&
                footer.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="max-w-fit font-light tracking-wider transition-all hocus:font-normal"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="mb-2 text-xl font-bold xl:mb-4">Get in Touch</h2>
          <p className="mb-2 font-light tracking-wide xl:mb-4">
            Stay connected with us to discover more stories about new movies and
            explore more with us
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="https://github.com/fachryafrz/popcorn-vision"
              target="_blank"
              className="grid place-items-center rounded-[3rem] bg-secondary bg-opacity-10 p-3 text-primary-blue transition-all hocus:scale-110 hocus:rounded-[0.75rem] hocus:bg-opacity-25"
            >
              <IonIcon
                icon={logoGithub}
                style={{
                  fontSize: 20,
                }}
              />
            </Link>
            <Link
              href="https://twitter.com/fachryafrz"
              target="_blank"
              className="grid place-items-center rounded-[3rem] bg-secondary bg-opacity-10 p-3 text-primary-blue transition-all hocus:scale-110 hocus:rounded-[0.75rem] hocus:bg-opacity-25"
            >
              <IonIcon
                icon={logoTwitter}
                style={{
                  fontSize: 20,
                }}
              />
            </Link>
            <Link
              href="https://instagram.com/fachryafrz"
              target="_blank"
              className="grid place-items-center rounded-[3rem] bg-secondary bg-opacity-10 p-3 text-primary-blue transition-all hocus:scale-110 hocus:rounded-[0.75rem] hocus:bg-opacity-25"
            >
              <IonIcon
                icon={logoInstagram}
                style={{
                  fontSize: 20,
                }}
              />
            </Link>
            <Link
              href="https://www.linkedin.com/in/fachryafrz"
              target="_blank"
              className="grid place-items-center rounded-[3rem] bg-secondary bg-opacity-10 p-3 text-primary-blue transition-all hocus:scale-110 hocus:rounded-[0.75rem] hocus:bg-opacity-25"
            >
              <IonIcon
                icon={logoLinkedin}
                style={{
                  fontSize: 20,
                }}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center border-t border-secondary border-opacity-25 p-4 text-center">
        <span style={{ textWrap: `balance` }}>
          {`${process.env.NEXT_PUBLIC_APP_NAME} © ${
            createdYear == currentYear
              ? `${createdMonth} ${createdYear}`
              : `${createdMonth} ${createdYear} - ${currentMonth} ${currentYear}`
          } all rights reserved`}
        </span>
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
        {/* <span>{`v${packageJson.version}`}</span> */}
      </div>
    </footer>
  );
}
