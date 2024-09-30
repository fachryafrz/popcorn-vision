"use client";

import Script from "next/script";

export default function GoogleAdsense({ pId }) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossorigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
