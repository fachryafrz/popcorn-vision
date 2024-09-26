import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import tmdbNetworks from "@/json/tv_network_ids_12_26_2023.json";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Network({ inputStyles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const isQueryParams = searchParams.get("query") ? true : false;

  const [networksData, setNetworksData] = useState(tmdbNetworks);
  const [network, setNetwork] = useState([]);

  const networksLoadOptions = (inputValue, callback) => {
    setTimeout(() => {
      const options = networksData.map((network) => ({
        value: network.id,
        label: network.name,
      }));
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
      );
      callback(filteredOptions);
    }, 2000);
  };

  const handleNetworkChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      current.delete("with_networks");
    } else {
      const joinedValue = value.join("|");
      current.set("with_networks", joinedValue);
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // Network
    if (searchParams.get("with_networks")) {
      const networksParams = searchParams.get("with_networks").split("|");
      const searchNetworks = networksParams.map((networkId) =>
        networksData?.find(
          (network) => parseInt(network.id) === parseInt(networkId),
        ),
      );

      const searchNetworksOptions = searchNetworks?.map(
        (network) =>
          network && {
            value: network.id,
            label: network.name,
          },
      );
      setNetwork(searchNetworksOptions);
    } else {
      setNetwork(null);
    }
  }, [networksData, searchParams]);

  return (
    <section className={`flex flex-col gap-1`}>
      <span className={`font-medium`}>Networks</span>
      <AsyncSelect
        noOptionsMessage={() => "Type to search"}
        loadingMessage={() => "Searching..."}
        loadOptions={networksLoadOptions}
        onChange={handleNetworkChange}
        value={network}
        styles={inputStyles}
        placeholder={`Search TV networks...`}
        isDisabled={isQueryParams}
        isMulti
      />
    </section>
  );
}
