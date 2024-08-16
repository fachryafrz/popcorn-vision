import Reveal from "@/components/Layout/Reveal";
import Link from "next/link";

export default function WatchProvider({ providersIDArray, isTvPage }) {
  return (
    <div className={`flex flex-wrap gap-2`}>
      {(
        providersIDArray[1].rent ||
        providersIDArray[1].buy ||
        providersIDArray[1].flatrate ||
        providersIDArray[1].ads
      ).map(
        (item, i) =>
          item.logo_path !== null && (
            <Reveal delay={0.1 * i} key={item.provider_id}>
              <Link
                href={`${
                  !isTvPage ? `/search` : `/tv/search`
                }?watch_providers=${item.provider_id}`}
              >
                <figure
                  title={item.provider_name}
                  style={{
                    background: `url(https://image.tmdb.org/t/p/w500${item.logo_path})`,
                    backgroundSize: `contain`,
                    backgroundRepeat: `no-repeat`,
                  }}
                  className={`aspect-square w-[40px] rounded-xl`}
                ></figure>
              </Link>
            </Reveal>
          ),
      )}
    </div>
  );
}
