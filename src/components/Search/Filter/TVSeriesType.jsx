import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TVSeriesType() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const isQueryParams = searchParams.get("query");

  const [tvType, setTvType] = useState([]);

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
      current.delete("type");
    } else {
      current.set("type", updatedValue.join("|"));
    }

    const search = current.toString();

    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // TV Shows Type
    if (searchParams.get("type")) {
      const typeParams = searchParams.get("type").split("|");
      setTvType(typeParams);
    } else {
    }
  }, [searchParams]);

  return (
    <section className="@container">
      <span className={`font-medium`}>Types</span>
      <ul className={`mt-2 grid @sm:grid-cols-2`}>
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
