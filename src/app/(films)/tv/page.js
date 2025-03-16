import React from "react";
import Home from "@/app/page";
import { siteConfig } from "@/config/site";

export async function generateMetadata() {
  return {
    title: "TV Shows",
    openGraph: {
      title: `TV Shows - ${siteConfig.name}`,
      url: `${siteConfig.url}/tv`,
    },
  };
}

export default async function HomeTV() {
  return <Home type={`tv`} />;
}
