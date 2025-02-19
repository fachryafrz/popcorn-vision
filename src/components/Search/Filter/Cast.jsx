import { useEffect, useState, useCallback, useRef } from "react";
import AsyncSelect from "react-select/async";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function Cast({ inputStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const isQueryParams = searchParams.get("query");

  const [cast, setCast] = useState([]);

  const timerRef = useRef(null);
  const castsLoadOptions = useCallback((inputValue, callback) => {
    const fetchDataWithDelay = async () => {
      // Delay pengambilan data selama 500ms setelah pengguna berhenti mengetik
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Lakukan pengambilan data setelah delay
      axios
        .get(`/api/search/person`, { params: { query: inputValue } })
        .then(({ data }) => {
          const options = data.results.map((person) => ({
            value: person.id,
            label: person.name,
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

  const handleCastChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      current.delete("with_cast");
    } else {
      current.set("with_cast", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // Cast
    if (searchParams.get("with_cast")) {
      const castParams = searchParams.get("with_cast").split(",");
      const fetchPromises = castParams.map((castId) => {
        return axios.get(`/api/person/${castId}`).then(({ data }) => data);
      });

      Promise.all(fetchPromises)
        .then((responses) => {
          const uniqueCast = [...new Set(responses)]; // Remove duplicates if any
          const searchCast = uniqueCast.map((cast) => ({
            value: cast.id,
            label: cast.name,
          }));
          setCast(searchCast);
        })
        .catch((error) => {
          console.error("Error fetching cast:", error);
        });
    } else {
      setCast(null);
    }
  }, [searchParams]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Actor</span>
      <AsyncSelect
        noOptionsMessage={() => "Type to search"}
        loadingMessage={() => "Searching..."}
        loadOptions={castsLoadOptions}
        onChange={handleCastChange}
        value={cast}
        styles={inputStyles}
        placeholder={`Search actor...`}
        isDisabled={isQueryParams}
        isMulti
      />
    </section>
  );
}
