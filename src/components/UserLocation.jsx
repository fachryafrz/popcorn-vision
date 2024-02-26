"use client";

import { getLocation } from "@/lib/fetch";
import { useEffect, useState } from "react";

export default function UserLocation() {
  // For user location
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(position.coords);
        setUserLocation(localStorage.getItem("user-location"));
      });
    }
  }, []);

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location;

      if (!userLocation)
        getLocation({ latitude, longitude }).then((response) => {
          // if (response.countryCode !== "ID") {
          //   setLanguage("en-US");
          // }
          localStorage.setItem("user-location", JSON.stringify(response));
        });
    }
  }, [location, userLocation]);
}
