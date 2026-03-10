import { siteConfig } from "@/config/site";
import ClientTvSearch from "@/components/Search/ClientTvSearch";

export async function generateMetadata() {
  return {
    title: `Search TV Shows`,
    openGraph: {
      title: `Search TV Shows`,
      url: `${siteConfig.url}/tv/search`,
    },
  };
}

export default function page() {
  return <ClientTvSearch />;
}

