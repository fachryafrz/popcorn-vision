"use client";

import { USER_LOCATION } from "@/lib/constants";
import { useLocation } from "@/zustand/location";
import axios from "axios";
import { useEffect } from "react";

export default function UserLocation({ ip }) {
  const { setLocation } = useLocation();

  useEffect(() => {
    const userLocation = localStorage.getItem(USER_LOCATION);

    if (userLocation) {
      if (Object.keys(JSON.parse(userLocation)).length === 0) {
        localStorage.removeItem(USER_LOCATION);
        return;
      }

      setLocation(JSON.parse(userLocation));
    } else {
      const getLocationData = async () => {
        const { data } = await axios.get(`http://ip-api.com/json/${ip}`);

        setLocation(data);

        localStorage.setItem(
          USER_LOCATION,
          JSON.stringify({
            countryCode: data.countryCode,
            country: data.country,
          }),
        );
      };

      getLocationData();
    }
  }, [ip]);

  return null;
}
