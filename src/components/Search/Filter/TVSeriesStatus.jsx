import { useEffect, useState, useMemo } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { AND_SEPARATION, OR_SEPARATION } from "@/lib/constants";

const STATUS = "status";

export default function TVSeriesStatus() {
  const [statusParam, setStatusParam] = useQueryState(STATUS, parseAsString);
  const [query] = useQueryState("query");

  const defaultToggleSeparation = statusParam?.includes("|")
    ? OR_SEPARATION
    : AND_SEPARATION;

  const [status, setStatus] = useState([]);
  const [toggleSeparation, setToggleSeparation] = useState(
    defaultToggleSeparation,
  );

  const separation = toggleSeparation === AND_SEPARATION ? "," : "|";

  // Pre-loaded Options
  const tvSeriesStatus = useMemo(
    () => [
      "All",
      "Returning Series",
      "Planned",
      "In Production",
      "Ended",
      "Canceled",
      "Pilot",
    ],
    [],
  );

  // Handle checkbox change
  const handleStatusChange = (event) => {
    const isChecked = event.target.checked;
    const inputValue = parseInt(event.target.value);

    let updatedValue = [...status]; // Salin status sebelumnya

    if (inputValue === -1) {
      // Jika yang dipilih adalah "All", bersihkan semua status
      updatedValue = [];
    } else {
      if (isChecked && !updatedValue.includes(inputValue.toString())) {
        // Tambahkan status yang dipilih jika belum ada
        updatedValue.push(inputValue.toString());
      } else {
        // Hapus status yang tidak dipilih lagi
        updatedValue = updatedValue.filter((s) => s !== inputValue.toString());
      }
    }

    // Lakukan pengaturan URL
    if (updatedValue.length === 0) {
      setStatusParam(null);
    } else {
      setStatusParam(updatedValue.join(separation));
    }
  };

  const handleSeparator = (separator) => {
    setToggleSeparation(separator);

    if (statusParam) {
      const separation = separator === AND_SEPARATION ? "," : "|";
      const newSeparator = statusParam.includes("|") ? "," : "|";
      if (newSeparator !== separation) return;

      const updatedParams = statusParam.replace(/[\|,]/g, newSeparator);
      setStatusParam(updatedParams);
    }
  };

  useEffect(() => {
    // TV Shows Status
    if (statusParam) {
      const splitted = statusParam.split(separation);
      setStatus(splitted);
    } else {
      setStatus([]);
    }
  }, [statusParam, separation]);

  return (
    <section className="@container">
      <div className={`flex items-center justify-between`}>
        <span className={`font-medium`}>Status</span>

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

      <ul className={`mt-2 grid @sm:grid-flow-col @sm:grid-rows-4`}>
        {tvSeriesStatus.map((statusName, i) => {
          const index = i - 1;
          const isChecked = status.length === 0 && i === 0;

          return (
            <li key={index}>
              <div className={`flex items-center`}>
                <input
                  type={`checkbox`}
                  id={`status_${index}`}
                  name={`status`}
                  className={`checkbox checkbox-sm rounded-md`}
                  value={index}
                  checked={isChecked || status.includes(index.toString())}
                  onChange={handleStatusChange}
                  disabled={!!query}
                />

                <label
                  htmlFor={`status_${index}`}
                  className={`${
                    query ? `cursor-default` : `cursor-pointer`
                  } flex w-full py-1 pl-2 text-sm font-medium`}
                >
                  {statusName}
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
