import HomeClient from "@/components/home-client";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `${siteConfig.name} | Movie & TV Show Discovery`,
  description: siteConfig.description,
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeClient />
    </Suspense>
  );
}
