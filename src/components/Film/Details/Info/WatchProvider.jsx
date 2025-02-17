/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WatchProvider({ providersIDArray, isTvPage }) {
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
  if (providerTypes.tmdb)
    combinedProviders.push(
      ...formatProviderType(providerTypes.tmdb, "Provider"),
    );

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

  const handleOpenWindow = async (url) => {
    // NOTE: Already tried the documentPictureInPicture with iframe but it doesn't work, because most of the website refuse to be embeded in iframe

    const width =
      screen.availWidth < 1024 ? 600 : screen.availWidth < 1280 ? 1024 : 1200;
    const height = screen.availHeight < 600 ? screen.availHeight : 600;
    const left = (screen.availWidth - width) / 2;
    const top = (screen.availHeight - height) / 2;

    const windowFeatures = `left=${left},top=${top},width=${width},height=${height},noreferrer,noopener`;

    window.open(url, "gameStoreWindow", windowFeatures);
  };

  return (
    <div className={`flex flex-wrap gap-2`}>
      {groupedProviders.map(
        (item, i) =>
          item.logo_path && (
            <>
              {/* NOTE: The delay causing component jump */}

              <button
                key={item.provider_id}
                onClick={() => {
                  if (item.url) {
                    handleOpenWindow(item.url);
                  } else {
                    router.push(
                      `${
                        !isTvPage ? `/search` : `/tv/search`
                      }?watch_providers=${item.provider_id}`,
                    );
                  }
                }}
                prefetch={true}
                className={`flex`}
              >
                <div
                  className="tooltip tooltip-bottom before:!hidden before:!rounded-full before:!bg-black before:!bg-opacity-80 before:!p-4 before:!py-2 before:!font-semibold before:!backdrop-blur after:!hidden md:before:!inline-block"
                  data-tip={`${item.provider_name} (${item.type})`}
                >
                  <img
                    src={
                      item.url
                        ? item.logo_path
                        : `https://image.tmdb.org/t/p/w500${item.logo_path}`
                    }
                    draggable={false}
                    alt=""
                    aria-hidden
                    role="presentation"
                    className={`aspect-square w-[40px] rounded-xl`}
                    width={40}
                    height={40}
                  />
                  <span aria-hidden className={`sr-only`}>
                    {item.provider_name} ({item.type})
                  </span>
                </div>
              </button>
            </>
          ),
      )}
    </div>
  );
}
