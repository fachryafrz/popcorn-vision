import React from "react";

export default function HeadCustom({
  title = process.env.NEXT_PUBLIC_APP_NAME,
  description = process.env.NEXT_PUBLIC_APP_DESC,
  url = process.env.NEXT_PUBLIC_APP_URL,
  imgUrl = "/popcorn.png",
  imgAlt = process.env.NEXT_PUBLIC_APP_NAME,
}) {
  return (
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Favicon  */}
      {/* <link rel="icon" href="/favicon.ico" type="image/x-icon" /> */}
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

      {/* Apple Touch Icon (untuk perangkat iOS)  */}
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Icon untuk Safari Pinned Tab (untuk Safari)  */}
      <link rel="mask-icon" href="/mask-icon.svg" color="blue" />

      {/* Icon untuk browser Android  */}
      <link rel="manifest" href="/manifest.json" />

      <meta name="theme-color" content="#202735" />

      {/* Meta tags */}
      <meta name="robots" content="index, archive" />
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={process.env.NEXT_PUBLIC_APP_KEYWORDS} />
      <link rel="canonical" href={url} />

      {/* Page title */}
      <title>{title}</title>

      {/* Open Graph tags */}
      <meta property="og:site_name" content={process.env.NEXT_PUBLIC_APP_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:alt" content={imgAlt} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:image" content={imgUrl} />
      <meta name="twitter:image:alt" content={imgAlt} />
    </head>
  );
}
