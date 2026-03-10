import { siteConfig } from "@/config/site";
import ClientMovieSearch from "@/components/Search/ClientMovieSearch";

export async function generateMetadata() {
  return {
    title: `Search Movies`,
    openGraph: {
      title: `Search Movies`,
      url: `${siteConfig.url}/search`,
    },
  };
}

export default function page() {
  return <ClientMovieSearch />;
}

