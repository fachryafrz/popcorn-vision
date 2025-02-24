import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { AND_SEPARATION, OR_SEPARATION } from "@/lib/constants";
import debounce from "debounce";

const WITH_COMPANIES = "with_companies";

export default function Company({ inputStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  const isQueryParams = searchParams.get("query");
  const defaultToggleSeparation = searchParams
    .get(WITH_COMPANIES)
    ?.includes("|")
    ? OR_SEPARATION
    : AND_SEPARATION;

  const [company, setCompany] = useState([]);
  const [toggleSeparation, setToggleSeparation] = useState(
    defaultToggleSeparation,
  );

  const separation = toggleSeparation === AND_SEPARATION ? "," : "|";

  const companiesLoadOptions = debounce(async (inputValue, callback) => {
    const { data } = await axios.get(`/api/search/company`, {
      params: { query: inputValue },
    });

    const options = data.results.map((company) => ({
      value: company.id,
      label: company.name,
    }));

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );

    callback(filteredOptions);
  }, 1000);

  const handleCompanyChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      current.delete(WITH_COMPANIES);
    } else {
      current.set(WITH_COMPANIES, value.join(separation));
    }

    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSeparator = (separator) => {
    setToggleSeparation(separator);

    if (searchParams.get(WITH_COMPANIES)) {
      const params = searchParams.get(WITH_COMPANIES);

      const separation = separator === AND_SEPARATION ? "," : "|";
      const newSeparator = params.includes("|") ? "," : "|";
      if (newSeparator !== separation) return;

      const updatedParams = params.replace(/[\|,]/g, newSeparator);

      current.set(WITH_COMPANIES, updatedParams);
      router.push(`${pathname}?${current.toString()}`);
    }
  };

  useEffect(() => {
    // Company
    if (searchParams.get(WITH_COMPANIES)) {
      const params = searchParams.get(WITH_COMPANIES);
      const splitted = params.split(separation);

      Promise.all(
        splitted.map((companyId) =>
          axios.get(`/api/company/${companyId}`).then(({ data }) => data),
        ),
      )
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
  }, [searchParams, separation]);

  return (
    <section className={`flex flex-col gap-1`}>
      <div className={`flex items-center justify-between`}>
        <span className={`font-medium`}>Company</span>

        <div className={`flex rounded-full bg-base-100 p-1`}>
          <button
            onClick={() => handleSeparator(AND_SEPARATION)}
            className={`btn btn-ghost btn-xs rounded-full ${
              toggleSeparation === AND_SEPARATION
                ? "bg-white text-base-100 hover:bg-white hover:bg-opacity-50"
                : ""
            }`}
          >
            AND
          </button>
          <button
            onClick={() => handleSeparator(OR_SEPARATION)}
            className={`btn btn-ghost btn-xs rounded-full ${
              toggleSeparation === OR_SEPARATION
                ? "bg-white text-base-100 hover:bg-white hover:bg-opacity-50"
                : ""
            }`}
          >
            OR
          </button>
        </div>
      </div>

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
