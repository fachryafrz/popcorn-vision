import { IonIcon } from "@ionic/react";
import { search, close } from "ionicons/icons";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Typewriter from "typewriter-effect/dist/core";
import { fetchData } from "@/lib/fetch";
import debounce from "debounce";
import useSWR from "swr";

export function SearchBar({ placeholder = `Type / to search` }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchRef = useRef(null);

  const [searchInput, setSearchInput] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const isTvPage = pathname.startsWith("/tv");
  const isSearchPage = pathname.startsWith(
    !isTvPage ? `/search` : `/tv/search`,
  );
  const DEBOUNCE_DELAY = 300;

  let URLSearchQuery = searchParams.get("query");

  const handleClear = () => {
    setSearchInput("");
    searchRef.current.focus();
  };

  // Debounce dengan library debounce
  const debouncedSearch = useCallback(
    debounce((value) => {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        setDebouncedQuery(trimmedValue.replace(/\s+/g, "+"));
      } else {
        setDebouncedQuery("");
      }
    }, DEBOUNCE_DELAY),
    [],
  );

  // SWR fetch
  const { data: autocompleteResults, isLoading } = useSWR(
    debouncedQuery ? `/api/search/query?query=${debouncedQuery}` : null,
    (endpoint) =>
      fetchData({
        baseURL: process.env.NEXT_PUBLIC_APP_URL,
        endpoint,
      }),
  );

  // Autocomplete data
  const autocompleteData =
    autocompleteResults?.results?.slice(0, 10).filter((item, index, self) => {
      const title = (item.title ?? item.name).toLowerCase();

      return (
        index ===
        self.findIndex((i) => (i.title ?? i.name).toLowerCase() === title)
      );
    }) || [];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const query = searchInput.trim();

    const basePath = isTvPage ? "/tv" : "";
    const searchPath = `${basePath}/search`;
    const formattedQuery = query.replace(/\s+/g, "+");
    const searchQuery = `query=${formattedQuery}`;

    if (!query) {
      router.push(`${searchPath}`);
    } else {
      router.push(`${searchPath}?${searchQuery}`);
    }

    searchRef?.current.blur();
  };

  useEffect(() => {
    if (!URLSearchQuery) return;

    setSearchInput(URLSearchQuery);
  }, [URLSearchQuery]);

  useEffect(() => {
    let input = searchRef.current;

    const customNodeCreator = (character) => {
      // Add character to input placeholder
      input.placeholder = input.placeholder + character;

      // Return null to skip internal adding of dom node
      return null;
    };

    const onRemoveNode = ({ character }) => {
      if (input.placeholder) {
        // Remove last character from input placeholder
        input.placeholder = input.placeholder.slice(0, -1);
      }
    };

    const typewriter = new Typewriter(null, {
      loop: true,
      delay: 50,
      onCreateTextNode: customNodeCreator,
      onRemoveNode: onRemoveNode,
    });

    typewriter
      .typeString("Search a movie or tv show title")
      .pauseFor(5e3)
      .deleteAll()
      .typeString("Click search icon to explore filters!")
      .pauseFor(5e3)
      .deleteAll()
      .typeString(placeholder)
      .pauseFor(15e3)
      .start();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // START: For selecting and deselecting search box
      if (e.key === "/") {
        if (document.activeElement !== searchRef.current) {
          e.preventDefault();
          searchRef.current.focus();
        }
      }

      if (e.key === "Escape") {
        if (document.activeElement === searchRef.current) {
          searchRef.current.blur();
        }
      }
      // END: For selecting and deselecting search box

      // START: Keyboard navigation for autocomplete
      if (!isFocus || autocompleteData.length === 0) return;

      const totalItems = autocompleteData.length;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex === totalItems - 1 ? 0 : prevIndex + 1,
        );
        const selectedItem =
          autocompleteData[
            highlightedIndex === totalItems - 1 ? 0 : highlightedIndex + 1
          ];
        setSearchInput((selectedItem.title ?? selectedItem.name).toLowerCase());
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex <= 0 ? totalItems - 1 : prevIndex - 1,
        );
        const selectedItem =
          autocompleteData[
            highlightedIndex <= 0 ? totalItems - 1 : highlightedIndex - 1
          ];
        setSearchInput((selectedItem.title ?? selectedItem.name).toLowerCase());
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < autocompleteData.length
        ) {
          const selectedItem = autocompleteData[highlightedIndex];
          router.push(
            `${isTvPage ? "/tv" : ""}/search?query=${(selectedItem.title ?? selectedItem.name).toLowerCase().replace(/\s+/g, "+")}`,
          );
        } else {
          handleSubmit(e);
        }

        searchRef.current.blur();
      }
      // END: Keyboard navigation for autocomplete
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [autocompleteData, highlightedIndex, isFocus]);

  // Cleanup debounce
  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [debouncedQuery]);

  return (
    <div className={`relative`}>
      <form
        onSubmit={handleSubmit}
        id={`SearchBar`}
        className={`form-control relative block w-full justify-self-center`}
      >
        <div
          className={`input input-bordered flex items-center rounded-full bg-opacity-[0%] px-0`}
        >
          <div
            className={`pointer-events-none absolute ml-4 flex h-full items-center [&_*]:pointer-events-auto`}
          >
            <Link
              href={!isTvPage ? `/search` : `/tv/search`}
               
              className={`flex`}
            >
              <IonIcon
                icon={search}
                className={`pointer-events-none`}
                style={{
                  fontSize: 18,
                  color: `rgb(156 163 175)`,
                }}
              />
            </Link>
          </div>

          <input
            type={`text`}
            ref={searchRef}
            tabIndex={isSearchPage ? 0 : -1}
            className={`h-full w-full flex-1 bg-transparent pl-10`}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              debouncedSearch(e.target.value);
            }}
            onFocus={() => {
              setIsFocus(true);
              debouncedSearch.flush(); // Immediate search saat focus
            }}
            onBlur={(e) => {
              // Cegah blur jika klik di dalam autocomplete
              if (e.relatedTarget?.closest(".autocomplete-suggestions")) return;
              setIsFocus(false);
            }}
          />

          <div className={`mr-4`}>
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className={`flex h-full items-center`}
              >
                <IonIcon
                  icon={close}
                  className={`text-gray-400`}
                  style={{
                    fontSize: 24,
                  }}
                />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Autocomplete suggestions */}
      {isFocus && autocompleteData.length > 0 && (
        <div
          className={`absolute left-1/2 mt-2 w-full max-w-xl -translate-x-1/2`}
        >
          <ul
            className={`autocomplete-suggestions rounded-box bg-base-200 bg-opacity-95 p-2 backdrop-blur`}
          >
            {autocompleteData.map((film, index) => {
              return (
                <li key={film.id}>
                  <Link
                    href={`${isTvPage ? "/tv" : ""}/search?query=${(film.title ?? film.name).toLowerCase().replace(/\s+/g, "+")}`}
                     
                    className={`flex items-center gap-4 rounded-lg p-2 py-1 ${
                      index === highlightedIndex ? `bg-white bg-opacity-10` : ``
                    }`}
                    onClick={() => setIsFocus(false)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onMouseLeave={() => setHighlightedIndex(-1)}
                    tabIndex={-1}
                  >
                    {/* Title */}
                    <div className={`flex gap-2`}>
                      <IonIcon
                        icon={search}
                        className={`pointer-events-none mt-1`}
                        style={{
                          fontSize: 18,
                          color: `rgb(156 163 175)`,
                        }}
                      />

                      <span className={`flex-1`}>
                        {(film.title ?? film.name).toLowerCase()}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
