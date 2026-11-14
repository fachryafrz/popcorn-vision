import { Suspense } from "react";
import type { Metadata } from "next";
import SearchClient from "@/components/search-client";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Search | ${siteConfig.name}`,
  description: `Search movies, TV series, and users on ${siteConfig.name}.`,
};

export default function SearchPage() {
  return (
    <Suspense>
      <SearchClient />
    </Suspense>
  );
}
