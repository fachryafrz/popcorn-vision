export default function manifest() {
  return {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    short_name: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    start_url: "/",
    display: "standalone",
    background_color: "#131720",
    theme_color: "#131720",
    icons: [
      {
        src: "/maskable/maskable_icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/home.png",
        sizes: "640x320",
        type: "image/png",
        form_factor: "wide",
        label: "Home",
      },
      {
        src: "/screenshots/film_details.png",
        sizes: "640x320",
        type: "image/png",
        form_factor: "wide",
        label: "Film Details",
      },
      {
        src: "/screenshots/home_mobile.png",
        sizes: "750x1332",
        type: "image/png",
        form_factor: "narrow",
        label: "Home",
      },
      {
        src: "/screenshots/film_details_mobile.png",
        sizes: "750x1332",
        type: "image/png",
        form_factor: "narrow",
        label: "Film Details",
      },
    ],
  };
}
