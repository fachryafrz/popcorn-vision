/* eslint-disable @next/next/no-img-element */

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function FilmCollection({ film }) {
  const [collections, setCollections] = useState({});

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/collection/${film.belongs_to_collection.id}
          `,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            },
          }
        );
        setCollections(res.data);
      } catch (error) {
        console.error(`Errornya collections: ${error}`);
      }
    };

    fetchCollections();
  }, [film]);

  return (
    <div className={`flex flex-col gap-2`}>
      <div id="collections" className="flex flex-col gap-2 ">
        <h2 className="font-bold text-xl text-white m-0">
          {collections && collections.name}
        </h2>
      </div>
      <ul className="flex flex-col gap-1">
        {collections.parts &&
          collections.parts.map((item, index) => {
            return (
              <li key={index}>
                <Link
                  href={`/movies/${item.id}`}
                  className={`flex items-center gap-2 bg-base-gray bg-opacity-10 hocus:bg-opacity-30 p-2 rounded-xl w-full ${
                    film.id === item.id && `bg-primary-blue bg-opacity-30`
                  }`}
                >
                  <span className={`text-gray-400 text-sm font-medium px-1`}>
                    {index + 1}
                  </span>

                  <figure className="aspect-poster min-w-[50px] max-w-[50px] rounded-lg overflow-hidden">
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : `/popcorn.png`
                      }
                      alt={item.title}
                      className={`object-contain`}
                    />
                  </figure>
                  <div className="flex flex-col gap-1 items-start w-full">
                    <h3
                      className="text-start line-clamp-2 font-medium"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    <div className="text-sm text-gray-400 font-medium">
                      {item.release_date
                        ? new Date(item.release_date).getFullYear()
                        : `Coming soon`}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-3 w-full">
                    {item.overview}
                  </p>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
