import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TVSeriesStatus({ searchAPIParams }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;

  const [status, setStatus] = useState([]);

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
      setStatus(updatedValue);
      current.delete("status");
    } else {
      current.set("status", updatedValue.join("|"));
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // TV Series Status
    if (searchParams.get("status")) {
      const statusParams = searchParams.get("status").split("|");
      setStatus(statusParams);

      searchAPIParams["with_status"] = searchParams.get("status");
    } else {
      delete searchAPIParams["with_status"];
      setStatus([]);
    }
  }, [searchAPIParams, searchParams]);

  return (
    <section>
      <span className={`font-medium`}>Status</span>
      <ul className={`mt-2`}>
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
                  className={`checkbox checkbox-md`}
                  value={index}
                  checked={isChecked || status.includes(index.toString())}
                  onChange={handleStatusChange}
                  disabled={isQueryParams}
                />

                <label
                  htmlFor={`status_${index}`}
                  className={`${
                    isQueryParams ? `cursor-default` : `cursor-pointer`
                  } flex w-full py-2 pl-2`}
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