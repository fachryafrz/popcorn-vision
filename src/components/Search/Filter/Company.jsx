import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { useQueryState, parseAsString } from "nuqs";
import { AND_SEPARATION, OR_SEPARATION } from "@/lib/constants";
import { debounce } from "@mui/material";
import { inputStyles } from "@/utils/inputStyles";

const WITH_COMPANIES = "with_companies";

export default function Company() {
  const [withCompanies, setWithCompanies] = useQueryState(
    WITH_COMPANIES,
    parseAsString,
  );
  const [query] = useQueryState("query");

  const defaultToggleSeparation = withCompanies?.includes("|")
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
      setWithCompanies(null);
    } else {
      setWithCompanies(value.join(separation));
    }
  };

  const handleSeparator = (separator) => {
    setToggleSeparation(separator);

    if (withCompanies) {
      const separation = separator === AND_SEPARATION ? "," : "|";
      const newSeparator = withCompanies.includes("|") ? "," : "|";
      if (newSeparator !== separation) return;

      const updatedParams = withCompanies.replace(/[\|,]/g, newSeparator);
      setWithCompanies(updatedParams);
    }
  };

  useEffect(() => {
    // Company
    if (withCompanies) {
      const splitted = withCompanies.split(separation);

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
  }, [withCompanies, separation]);

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
        isDisabled={!!query}
        isMulti
      />
    </section>
  );
}
