import { fetchData } from "@/lib/fetch";
import { useEffect, useState, useMemo, useRef } from "react";
import AsyncSelect from "react-select/async";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from 'next-nprogress-bar';

export default function Crew({ inputStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query");

  const [crew, setCrew] = useState([]);

  const timerRef = useRef(null);
  const crewsLoadOptions = (inputValue, callback) => {
    const fetchDataWithDelay = async () => {
      // Delay pengambilan data selama 500ms setelah pengguna berhenti mengetik
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Lakukan pengambilan data setelah delay
      fetchData({
        endpoint: `/search/person`,
        queryParams: {
          query: inputValue,
        },
      }).then((res) => {
        const options = res.results.map((person) => ({
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
  };

  const handleCrewChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      current.delete("with_crew");
    } else {
      current.set("with_crew", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // Crew
    if (searchParams.get("with_crew")) {
      const crewParams = searchParams.get("with_crew").split(",");
      const fetchPromises = crewParams.map((crewId) => {
        return fetchData({
          endpoint: `/person/${crewId}`,
        });
      });

      Promise.all(fetchPromises)
        .then((responses) => {
          const uniqueCrew = [...new Set(responses)]; // Remove duplicates if any
          const searchCrew = uniqueCrew.map((crew) => ({
            value: crew.id,
            label: crew.name,
          }));
          setCrew(searchCrew);
        })
        .catch((error) => {
          console.error("Error fetching crew:", error);
        });
    } else {
      setCrew(null);
    }
  }, [searchParams]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Crew</span>
      <AsyncSelect
        noOptionsMessage={() => "Type to search"}
        loadingMessage={() => "Searching..."}
        loadOptions={crewsLoadOptions}
        onChange={handleCrewChange}
        value={crew}
        styles={inputStyles}
        placeholder={`Search director, creator...`}
        isDisabled={isQueryParams}
        isMulti
      />
    </section>
  );
}
