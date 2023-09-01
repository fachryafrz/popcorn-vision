/* eslint-disable @next/next/no-img-element */

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function FilmCollection({ film }) {
  const [apiData, setApiData] = useState();
  const [collectionTitle, setCollectionTitle] = useState();
  const [collections, setCollections] = useState({});
  const [showAllCollection, setShowAllCollection] = useState(false);
  const numCollection = 3;

  const handleShowAllCollection = () => {
    setShowAllCollection(true);
  };

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
        setApiData(res.data);
        setCollectionTitle(res.data.name);
        const sortedCollections = res.data.parts.sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);

          return dateA - dateB;
        });
        setCollections(sortedCollections);
      } catch (error) {
        console.error(`Errornya collections: ${error}`);
      }
    };

    fetchCollections();
    setShowAllCollection(false);
  }, [film]);

  function slugify(text) {
    return (
      text &&
      text
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
    );
  }

  return (
    <div className={`flex flex-col gap-2`}>
      <div id="collections" className="flex flex-col gap-2 ">
        <h2 className="font-bold text-xl text-white m-0">
          {apiData && collectionTitle}
        </h2>
      </div>
      <ul className="flex flex-col gap-1 relative">
        {apiData &&
          collections
            .slice(0, showAllCollection ? collections.length : numCollection)
            .map((item, index) => {
              return (
                <li key={index}>
                  <Link
                    href={`/movies/${item.id}-${slugify(film.title)}`}
                    className={`flex items-center gap-2 bg-base-gray bg-opacity-10 hocus:bg-opacity-30 p-2 rounded-xl w-full ${
                      film.id === item.id && `bg-primary-blue bg-opacity-30`
                    }`}
                  >
                    <span className={`text-gray-400 text-sm font-medium px-1`}>
                      {index + 1}
                    </span>

                    <div className="aspect-poster min-w-[50px] max-w-[50px] rounded-lg overflow-hidden flex items-center">
                      {item.poster_path ? (
                        <figure className={`w-full`}>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                            alt={item.title}
                            className={`object-contain`}
                          />
                        </figure>
                      ) : (
                        <figure
                          style={{
                            background: `url(/popcorn.png)`,
                            backgroundSize: `contain`,
                          }}
                          className={`aspect-square w-[50px]`}
                        ></figure>
                      )}
                    </div>
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

        {apiData && collections.length > numCollection && (
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-base-dark-gray justify-center items-end h-[200px] text-primary-blue ${
              showAllCollection ? `hidden` : `flex`
            }`}
          >
            <button onClick={handleShowAllCollection}>
              View all collection
            </button>
          </div>
        )}
      </ul>
    </div>
  );
}
