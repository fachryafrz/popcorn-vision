import { fetchData } from "@/lib/fetch";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import AsyncSelect from "react-select/async";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from 'next-nprogress-bar';

export default function Company({ inputStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query");

  const [company, setCompany] = useState([]);

  const timerRef = useRef(null);
  const companiesLoadOptions = useCallback((inputValue, callback) => {
    const fetchDataWithDelay = async () => {
      // Delay pengambilan data selama 500ms setelah pengguna berhenti mengetik
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Lakukan pengambilan data setelah delay
      fetchData({
        endpoint: `/search/company`,
        queryParams: {
          query: inputValue,
        },
      }).then((res) => {
        const options = res.results.map((company) => ({
          value: company.id,
          label: company.name,
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

  const handleCompanyChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      current.delete("with_companies");
    } else {
      current.set("with_companies", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // Company
    if (searchParams.get("with_companies")) {
      const companyParams = searchParams.get("with_companies").split(",");
      const fetchPromises = companyParams.map((companyId) => {
        return fetchData({
          endpoint: `/company/${companyId}`,
        });
      });

      Promise.all(fetchPromises)
        .then((responses) => {
          const uniqueCompany = [...new Set(responses)]; // Remove duplicates if any
          const searchCompany = uniqueCompany.map((company) => ({
            value: company.id,
            label: company.name,
          }));
          setCompany(searchCompany);
        })
        .catch((error) => {
          console.error("Error fetching company:", error);
        });
    } else {
      setCompany(null);
    }
  }, [searchParams]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Company</span>
      <AsyncSelect
        noOptionsMessage={() => "Type to search"}
        loadingMessage={() => "Searching..."}
        loadOptions={companiesLoadOptions}
        onChange={handleCompanyChange}
        value={company}
        styles={inputStyles}
        placeholder={`Search company...`}
        isDisabled={isQueryParams}
        isMulti
      />
    </section>
  );
}
