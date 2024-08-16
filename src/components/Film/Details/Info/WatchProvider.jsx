import Reveal from "@/components/Layout/Reveal";
import Link from "next/link";

export default function WatchProvider({ providersIDArray, isTvPage }) {
  const [providerCountry, providerTypes] = providersIDArray;

  const combinedProviders = [];

  if (providerTypes.rent) combinedProviders.push(...providerTypes.rent);
  if (providerTypes.buy) combinedProviders.push(...providerTypes.buy);
  if (providerTypes.flatrate) combinedProviders.push(...providerTypes.flatrate);
  if (providerTypes.ads) combinedProviders.push(...providerTypes.ads);

  const uniqueProviders = combinedProviders.filter(
    (provider, index, self) =>
      index === self.findIndex((t) => t.provider_id === provider.provider_id),
  );

  return (
    <div className={`flex flex-wrap gap-2`}>
      {uniqueProviders.map(
        (item, i) =>
          item.logo_path && (
            <div key={item.provider_id}>
              {/* NOTE: The delay causing component jump */}
              {/* <Reveal delay={i > 0 ? 0.1 * i : 0} key={item.provider_id}> */}
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
              {/* </Reveal> */}
            </div>
          ),
      )}
    </div>
  );
}
