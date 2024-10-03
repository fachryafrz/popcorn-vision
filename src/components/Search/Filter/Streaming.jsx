import { fetchData } from "@/lib/fetch";
import { useEffect, useState, useMemo, useCallback } from "react";
import Select from "react-select";
import { getRandomOptionsPlaceholder } from "@/lib/getRandomOptionsPlaceholder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocation } from "@/zustand/location";
import useSWR from "swr";

export default function Streaming({ inputStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const isQueryParams = searchParams.get("query") ? true : false;
  const isTvPage = pathname.startsWith("/tv");

  const { location } = useLocation();

  const fetcher = async () => {
    const { results } = await fetchData({
      endpoint: `/watch/providers/${!isTvPage ? "movie" : "tv"}`,
      queryParams: {
        watch_region: location.country_code,
      },
    });
    return results;
  };
  const { data: providersData } = useSWR(
    `/watch/providers/${!isTvPage ? "movie" : "tv"}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // const [providersData, setProvidersData] = useState([]);
  const [provider, setProvider] = useState();
  const [providersInputPlaceholder, setProvidersInputPlaceholder] = useState();

  const providersOptions = useMemo(() => {
    return providersData?.map((provider) => ({
      value: provider.provider_id,
      label: provider.provider_name,
    }));
  }, [providersData]);

  const handleProviderChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      current.delete("watch_providers");
    } else {
      current.set("watch_providers", value);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
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
    if (searchParams.get("watch_providers")) {
      const providersParams = searchParams.get("watch_providers").split(",");
      const searchProviders = providersParams.map((providerId) =>
        providersData?.find(
          (provider) => parseInt(provider.provider_id) === parseInt(providerId),
        ),
      );
      const searchProvidersOptions = searchProviders?.map(
        (provider) =>
          provider && {
            value: provider.provider_id,
            label: provider.provider_name,
          },
      );
      setProvider(searchProvidersOptions);
    } else {
      setProvider(null);
    }
  }, [providersData, searchParams]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Streaming</span>

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
