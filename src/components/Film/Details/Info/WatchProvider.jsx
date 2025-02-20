/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WatchProvider({ film, providersIDArray, isTvPage }) {
  const router = useRouter();

  const [providerCountry, providerTypes] = providersIDArray;

  const combinedProviders = [];

  const formatProviderType = (providers, type) => {
    return providers.map((provider) => {
      return {
        provider_id: provider.provider_id,
        provider_name: provider.provider_name,
        logo_path: provider.logo_path,
        url: provider.url,
        type: type,
      };
    });
  };

  if (providerTypes.rent)
    combinedProviders.push(...formatProviderType(providerTypes.rent, "Rent"));
  if (providerTypes.buy)
    combinedProviders.push(...formatProviderType(providerTypes.buy, "Buy"));
  if (providerTypes.flatrate)
    combinedProviders.push(
      ...formatProviderType(providerTypes.flatrate, "Stream"),
    );
  if (providerTypes.ads)
    combinedProviders.push(...formatProviderType(providerTypes.ads, "Ads"));

  const groupedProviders = combinedProviders.reduce((acc, provider) => {
    const existingProvider = acc.find(
      (p) => p.provider_id === provider.provider_id,
    );
    if (existingProvider) {
      // Jika provider dengan id yang sama sudah ada, gabungkan tipe mereka jika belum ada
      if (!existingProvider.type.includes(provider.type)) {
        existingProvider.type += `/${provider.type}`;
      }
    } else {
      // Jika belum ada, tambahkan provider ke array
      acc.push({ ...provider });
    }
    return acc;
  }, []);

  return (
    <>
      {groupedProviders.map(
        (item, i) =>
          item.logo_path && (
            <>
              {/* NOTE: The delay causing component jump */}

              <Link
                key={item.provider_id}
                href={`${
                  !isTvPage ? `/search` : `/tv/search`
                }?watch_providers=${item.provider_id}`}
                prefetch={false}
                className={`flex`}
              >
                <div
                  className="tooltip tooltip-bottom before:!hidden before:!rounded-full before:!bg-black before:!bg-opacity-80 before:!p-4 before:!py-2 before:!font-semibold before:!backdrop-blur after:!hidden md:before:!inline-block"
                  data-tip={`${item.provider_name} (${item.type})`}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.logo_path}`}
                    draggable={false}
                    alt=""
                    aria-hidden
                    role="presentation"
                    className={`aspect-square w-[50px] rounded-xl`}
                    width={50}
                    height={50}
                  />
                  <span aria-hidden className={`sr-only`}>
                    {item.provider_name} ({item.type})
                  </span>
                </div>
              </Link>
            </>
          ),
      )}
    </>
  );
}
