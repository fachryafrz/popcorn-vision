"use client";

import { USER_LOCATION } from "@/lib/constants";
import { useLocation } from "@/zustand/location";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserLocation() {
  // Zustand
  const { setLocation } = useLocation();

  // State
  const [isLocationSaved, setIsLocationSaved] = useState(true); // NOTE: To prevent refetch ip

  // Lifecycle
  useEffect(() => {
    const userLocation = localStorage.getItem(USER_LOCATION);
    if (!userLocation) {
      setIsLocationSaved(false);
      return;
    }

    if (Object.keys(JSON.parse(userLocation)).length === 0) {
      localStorage.removeItem(USER_LOCATION);
      setIsLocationSaved(false);
      return;
    }

    setLocation(JSON.parse(userLocation));
    setIsLocationSaved(true);
  }, []);

  useEffect(() => {
    if (isLocationSaved) return;

    const getLocationData = async () => {
      const { data } = await axios.get(`https://ipinfo.io/json`);

      const locationData = {
        country_code: data.country,
        country_name: new Intl.DisplayNames(["en"], { type: "region" }).of(
          data.country,
        ),
      };

      setLocation(locationData);
      localStorage.setItem(USER_LOCATION, JSON.stringify(locationData));
      setIsLocationSaved(true);
    };

    getLocationData();
  }, [isLocationSaved]);

  return null;
}
