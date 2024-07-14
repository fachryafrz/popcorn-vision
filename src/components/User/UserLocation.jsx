"use client";

import { getLocation } from "@/lib/fetch";
import { useEffect } from "react";

export default function UserLocation() {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        const { latitude, longitude } = userLocation;

        getLocation({ latitude, longitude }).then((response) => {
          localStorage.setItem("user-location", JSON.stringify(response));
        });
      });
    }
  }, []);
}
