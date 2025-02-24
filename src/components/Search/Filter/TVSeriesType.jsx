import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AND_SEPARATION, OR_SEPARATION } from "@/lib/constants";

const TYPE = "type";

export default function TVSeriesType() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  const isQueryParams = searchParams.get("query");
  const defaultToggleSeparation = searchParams.get(TYPE)?.includes("|")
    ? OR_SEPARATION
    : AND_SEPARATION;

  const [tvType, setTvType] = useState([]);
  const [toggleSeparation, setToggleSeparation] = useState(
    defaultToggleSeparation,
  );

  const separation = toggleSeparation === AND_SEPARATION ? "," : "|";

  // Pre-loaded Options
  const tvSeriesType = useMemo(
    () => [
      "All",
      "Documentary",
      "News",
      "Miniseries",
      "Reality",
      "Scripted",
      "Talk Show",
      "Video",
    ],
    [],
  );

  // Handle checkbox change
  const handleTypeChange = (event) => {
    const isChecked = event.target.checked;
    const inputValue = parseInt(event.target.value);

    let updatedValue = [...tvType]; // Salin status sebelumnya

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
      setTvType(updatedValue);
      current.delete(TYPE);
    } else {
      current.set(TYPE, updatedValue.join(separation));
    }

    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSeparator = (separator) => {
    setToggleSeparation(separator);

    if (searchParams.get(TYPE)) {
      const params = searchParams.get(TYPE);

      const separation = separator === AND_SEPARATION ? "," : "|";
      const newSeparator = params.includes("|") ? "," : "|";
      if (newSeparator !== separation) return;

      const updatedParams = params.replace(/[\|,]/g, newSeparator);

      current.set(TYPE, updatedParams);
      router.push(`${pathname}?${current.toString()}`);
    }
  };

  useEffect(() => {
    // TV Shows Type
    if (searchParams.get(TYPE)) {
      const params = searchParams.get(TYPE);
      const splitted = params.split(separation);
      setTvType(splitted);
    } else {
      setTvType([]);
    }
  }, [searchParams, separation]);

  return (
    <section className="@container">
      <div className={`flex items-center justify-between`}>
        <span className={`font-medium`}>Type</span>

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
        {tvSeriesType.map((typeName, i) => {
          const index = i - 1;
          const isChecked = tvType.length === 0 && i === 0;

          return (
            <li key={index}>
              <div className={`flex items-center`}>
                <input
                  type={`checkbox`}
                  id={`type_${index}`}
                  name={`type`}
                  className={`checkbox checkbox-sm rounded-md`}
                  value={index}
                  checked={isChecked || tvType.includes(index.toString())}
                  onChange={handleTypeChange}
                  disabled={isQueryParams}
                />

                <label
                  htmlFor={`type_${index}`}
                  className={`${
                    isQueryParams ? `cursor-default` : `cursor-pointer`
                  } flex w-full py-1 pl-2 text-sm font-medium`}
                >
                  {typeName}
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
