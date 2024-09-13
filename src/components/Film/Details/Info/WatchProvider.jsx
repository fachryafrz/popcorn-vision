import Reveal from "@/components/Layout/Reveal";
import Link from "next/link";

export default function WatchProvider({ providersIDArray, isTvPage }) {
  const [providerCountry, providerTypes] = providersIDArray;

  const combinedProviders = [];

  const formatProviderType = (providers, type) => {
    return providers.map((provider) => {
      return {
        provider_id: provider.provider_id,
        provider_name: provider.provider_name,
        logo_path: provider.logo_path,
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
    <div className={`flex flex-wrap gap-2`}>
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
                className={`flex`}
              >
                <div
                  class="tooltip tooltip-bottom before:!rounded-full before:!bg-black before:!bg-opacity-80 before:!p-4 before:!py-2 before:!font-semibold before:!backdrop-blur after:!hidden"
                  data-tip={`${item.provider_name} (${item.type})`}
                >
                  <Reveal delay={i > 0 ? 0.1 * i : 0}>
                    <figure
                      style={{
                        background: `url(https://image.tmdb.org/t/p/w500${item.logo_path})`,
                        backgroundSize: `contain`,
                        backgroundRepeat: `no-repeat`,
                      }}
                      className={`aspect-square w-[40px] rounded-xl`}
                    ></figure>
                  </Reveal>
                  <span className={`sr-only`}>
                    {item.provider_name} ({item.type})
                  </span>
                </div>
              </Link>
            </>
          ),
      )}
    </div>
  );
}
