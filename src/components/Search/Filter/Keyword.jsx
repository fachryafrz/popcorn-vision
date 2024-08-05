import { fetchData } from "@/lib/fetch";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import AsyncSelect from "react-select/async";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Keyword({ searchAPIParams, inputStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;

  const [keyword, setKeyword] = useState([]);

  const timerRef = useRef(null);
  const keywordsLoadOptions = useCallback((inputValue, callback) => {
    const fetchDataWithDelay = async () => {
      // Delay pengambilan data selama 500ms setelah pengguna berhenti mengetik
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Lakukan pengambilan data setelah delay
      fetchData({
        endpoint: `/search/keyword`,
        queryParams: {
          query: inputValue,
        },
      }).then((res) => {
        const options = res.results.map((keyword) => ({
          value: keyword.id,
          label: keyword.name,
        }));
        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase()),
        );
        callback(filteredOptions);
      });
    };

    // Hapus pemanggilan sebelumnya jika ada
    clearTimeout(timerRef.current);

    // Set timer untuk memanggil fetchDataWithDelay setelah delay
    timerRef.current = setTimeout(() => {
      fetchDataWithDelay();
    }, 1000);
  }, []);

  const handleKeywordChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.map((option) => option.value);

      if (value.length === 0) {
        current.delete("with_keywords");
      } else {
        current.set("with_keywords", value);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router],
  );

  useEffect(() => {
    // Keyword
    if (searchParams.get("with_keywords")) {
      const keywordParams = searchParams.get("with_keywords").split(",");
      const fetchPromises = keywordParams.map((keywordId) => {
        return fetchData({
          endpoint: `/keyword/${keywordId}`,
        });
      });

      searchAPIParams["with_keywords"] = searchParams.get("with_keywords");

      Promise.all(fetchPromises)
        .then((responses) => {
          const uniqueKeyword = [...new Set(responses)]; // Remove duplicates if any
          const searchKeyword = uniqueKeyword.map((keyword) => ({
            value: keyword.id,
            label: keyword.name,
          }));
          setKeyword(searchKeyword);
        })
        .catch((error) => {
          console.error("Error fetching keyword:", error);
        });
    } else {
      setKeyword(null);

      delete searchAPIParams["with_keywords"];
    }
  }, [searchAPIParams, searchParams]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Keyword</span>
      <AsyncSelect
        noOptionsMessage={() => "Type to search"}
        loadingMessage={() => "Searching..."}
        loadOptions={keywordsLoadOptions}
        onChange={handleKeywordChange}
        value={keyword}
        styles={inputStyles}
        placeholder={`Search keyword...`}
        isDisabled={isQueryParams}
        isMulti
      />
    </section>
  );
}
