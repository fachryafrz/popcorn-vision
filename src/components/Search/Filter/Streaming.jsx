import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { getRandomOptionsPlaceholder } from "@/lib/getRandomOptionsPlaceholder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocation } from "@/zustand/location";
import useSWR from "swr";
import axios from "axios";
import { AND_SEPARATION, OR_SEPARATION } from "@/lib/constants";
import { inputStyles } from "@/utils/inputStyles";

const WATCH_PROVIDERS = "watch_providers";

export default function Streaming() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  const isQueryParams = searchParams.get("query");
  const isTvPage = pathname.startsWith("/tv");
  const defaultToggleSeparation = searchParams
    .get(WATCH_PROVIDERS)
    ?.includes("|")
    ? OR_SEPARATION
    : AND_SEPARATION;

  const { location } = useLocation();

  const { data: providersData } = useSWR(
    `/api/watch/providers/${!isTvPage ? "movie" : "tv"}`,
    (url) =>
      axios
        .get(url, {
          params: { watch_region: location.countryCode },
        })
        .then(({ data }) => data.results),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // const [providersData, setProvidersData] = useState([]);
  const [provider, setProvider] = useState();
  const [providersInputPlaceholder, setProvidersInputPlaceholder] = useState();
  const [toggleSeparation, setToggleSeparation] = useState(
    defaultToggleSeparation,
  );

  const separation = toggleSeparation === AND_SEPARATION ? "," : "|";

  const providersOptions = useMemo(() => {
    return providersData?.map((provider) => ({
      value: provider.provider_id,
      label: provider.provider_name,
    }));
  }, [providersData]);

  const handleProviderChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      current.delete(WATCH_PROVIDERS);
    } else {
      current.set(WATCH_PROVIDERS, value.join(separation));
    }

    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSeparator = (separator) => {
    setToggleSeparation(separator);

    if (searchParams.get(WATCH_PROVIDERS)) {
      const params = searchParams.get(WATCH_PROVIDERS);

      const separation = separator === AND_SEPARATION ? "," : "|";
      const newSeparator = params.includes("|") ? "," : "|";
      if (newSeparator !== separation) return;

      const updatedParams = params.replace(/[\|,]/g, newSeparator);

      current.set(WATCH_PROVIDERS, updatedParams);
      router.push(`${pathname}?${current.toString()}`);
    }
  };

  // Use Effect for cycling random options placeholder
  useEffect(() => {
    const updatePlaceholders = () => {
      const providersPlaceholder =
        getRandomOptionsPlaceholder(providersOptions);

      setProvidersInputPlaceholder(providersPlaceholder);
    };

    updatePlaceholders();

    // Set interval to run every 5 seconds
    const intervalId = setInterval(updatePlaceholders, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [providersOptions]);

  useEffect(() => {
    // Providers
    if (searchParams.get(WATCH_PROVIDERS)) {
      const params = searchParams.get(WATCH_PROVIDERS);
      const splitted = params.split(separation);
      const filtered = splitted.map((providerId) =>
        providersData?.find(
          (provider) => parseInt(provider.provider_id) === parseInt(providerId),
        ),
      );
      const options = filtered?.map(
        (provider) =>
          provider && {
            value: provider.provider_id,
            label: provider.provider_name,
          },
      );
      setProvider(options);
    } else {
      setProvider(null);
    }
  }, [providersData, searchParams, separation]);

  return (
    <section className={`flex flex-col gap-1`}>
      <div className={`flex items-center justify-between`}>
        <span className={`font-medium`}>Streaming</span>

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

      {!location && (
        <div className={`flex h-[42px] justify-center`}>
          <span
            className={`block w-full animate-pulse rounded-full bg-gray-400 bg-opacity-20`}
          />
        </div>
      )}

      {location && (
        <Select
          options={providersData && providersOptions}
          onChange={handleProviderChange}
          value={provider}
          styles={{
            ...inputStyles,
            dropdownIndicator: (styles) => ({
              ...styles,
              display: "block",
              "&:hover": {
                color: "#fff",
              },
              cursor: "pointer",
            }),
          }}
          placeholder={providersInputPlaceholder}
          isDisabled={isQueryParams}
          isMulti
        />
      )}
    </section>
  );
}
