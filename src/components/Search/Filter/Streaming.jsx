import { fetchData } from "@/lib/fetch";
import { useEffect, useState, useMemo, useCallback } from "react";
import Select from "react-select";
import { getRandomOptionsPlaceholder } from "@/lib/getRandomOptionsPlaceholder";
import { askLocation } from "@/lib/navigator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Streaming({ searchAPIParams, inputStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState();

  const [providersData, setProvidersData] = useState([]);
  const [provider, setProvider] = useState();
  const [providersInputPlaceholder, setProvidersInputPlaceholder] = useState();

  const providersOptions = useMemo(() => {
    return providersData?.map((provider) => ({
      value: provider.provider_id,
      label: provider.provider_name,
    }));
  }, [providersData]);

  const handleProviderChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.map((option) => option.value);

      if (value.length === 0) {
        current.delete("watch_providers");
      } else {
        current.set("watch_providers", value);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router],
  );

  // Use Effect for getting user location
  useEffect(() => {
    askLocation(setUserLocation, setLocationError);
  }, []);

  // Use Effect for fetching streaming providers based on user location
  useEffect(() => {
    // Fetch watch providers by user country code
    if (userLocation) {
      fetchData({
        endpoint: `/watch/providers/movie`,
        queryParams: {
          watch_region: JSON.parse(userLocation).countryCode,
        },
      }).then((res) => {
        setProvidersData(res.results);
      });
    }
  }, [userLocation]);

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

      searchAPIParams["with_watch_providers"] =
        searchParams.get("watch_providers");
      searchAPIParams["watch_region"] = JSON.parse(userLocation)?.countryCode;
    } else {
      setProvider(null);

      delete searchAPIParams["with_watch_providers"];
      delete searchAPIParams["watch_region"];
    }
  }, [providersData, searchAPIParams, searchParams, userLocation]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Streaming</span>
      {userLocation ? (
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
      ) : (
        <button
          onClick={() => askLocation(setUserLocation, setLocationError)}
          className={`btn btn-outline btn-sm rounded-full`}
        >
          Click to enable location
        </button>
      )}

      {locationError && (
        <>
        <p className="text-xs text-error font-medium">Oops! something isn&apos;t right</p>
        
          {/* <div className={`prose text-xs`}>
            <p>{locationError}</p>
            <p>Please follow these steps to enable location access:</p>
            <ol>
              <li>Click the icon on the left side of the address bar</li>
              <li>Go to &quot;Site settings&quot;.</li>
              <li>
                Find &quot;Location&quot; and set it to &quot;Allow&quot;.
              </li>
              <li>Reload the page and click the button again.</li>
            </ol>
          </div> */}
        </>
      )}
    </section>
  );
}
