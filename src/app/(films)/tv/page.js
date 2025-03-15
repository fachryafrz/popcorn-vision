import React from "react";
import Home from "@/app/page";

export async function generateMetadata() {
  return {
    title: "TV Shows",
    openGraph: {
      title: `TV Shows - ${process.env.NEXT_PUBLIC_APP_NAME}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tv`,
    },
  };
}

export default async function HomeTV() {
  return <Home type={`tv`} />;
}
