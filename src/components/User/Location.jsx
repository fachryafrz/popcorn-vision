"use client";

import { USER_LOCATION } from "@/lib/constants";
import { getLocationData } from "@/lib/fetch";
import { useLocation } from "@/zustand/location";
import { useEffect } from "react";

export default function UserLocation({ ip }) {
  const { setLocation } = useLocation();

  useEffect(() => {
    const userLocation = localStorage.getItem(USER_LOCATION);

    if (userLocation) {
      setLocation(JSON.parse(userLocation));
    } else {
      getLocationData(ip).then((data) => {
        setLocation(data);
        localStorage.setItem(USER_LOCATION, JSON.stringify({
          country_code: data.country_code,
          country_name: data.country_name
        }));
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip]);

  return null;
}
