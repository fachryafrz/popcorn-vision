import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { tvNetworks } from "@/data/tv-networks";
import { useQueryState, parseAsString } from "nuqs";
import { AND_SEPARATION, OR_SEPARATION } from "@/lib/constants";
import { debounce } from "@mui/material";
import { inputStyles } from "@/utils/inputStyles";

const WITH_NETWORKS = "with_networks";

export default function Network() {
  const [withNetworks, setWithNetworks] = useQueryState(
    WITH_NETWORKS,
    parseAsString,
  );
  const [query] = useQueryState("query");

  const defaultToggleSeparation = withNetworks?.includes("|")
    ? OR_SEPARATION
    : AND_SEPARATION;

  const [networksData, setNetworksData] = useState(tvNetworks);
  const [network, setNetwork] = useState([]);
  const [toggleSeparation, setToggleSeparation] = useState(
    defaultToggleSeparation,
  );

  const separation = toggleSeparation === AND_SEPARATION ? "," : "|";

  const networksLoadOptions = debounce((inputValue, callback) => {
    const options = networksData.map((network) => ({
      value: network.id,
      label: network.name,
    }));
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
    callback(filteredOptions);
  }, 1000);

  const handleNetworkChange = (selectedOption) => {
    const value = selectedOption.map((option) => option.value);

    if (value.length === 0) {
      setWithNetworks(null);
    } else {
      setWithNetworks(value.join(separation));
    }
  };

  const handleSeparator = (separator) => {
    setToggleSeparation(separator);

    if (withNetworks) {
      const separation = separator === AND_SEPARATION ? "," : "|";
      const newSeparator = withNetworks.includes("|") ? "," : "|";
      if (newSeparator !== separation) return;

      const updatedParams = withNetworks.replace(/[\|,]/g, newSeparator);
      setWithNetworks(updatedParams);
    }
  };

  useEffect(() => {
    // Network
    if (withNetworks) {
      const splitted = withNetworks.split(separation);
      const filtered = splitted.map((networkId) =>
        networksData?.find(
          (network) => parseInt(network.id) === parseInt(networkId),
        ),
      );

      const options = filtered?.map(
        (network) =>
          network && {
            value: network.id,
            label: network.name,
          },
      );

      setNetwork(options);
    } else {
      setNetwork(null);
    }
  }, [networksData, withNetworks, separation]);

  return (
    <section className={`flex flex-col gap-1`}>
      <div className={`flex items-center justify-between`}>
        <span className={`font-medium`}>Networks</span>

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
        loadOptions={networksLoadOptions}
        onChange={handleNetworkChange}
        value={network}
        styles={inputStyles}
        placeholder={`Search TV networks...`}
        isDisabled={!!query}
        isMulti
      />
    </section>
  );
}
