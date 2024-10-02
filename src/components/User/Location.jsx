"use client";

import { useLocation } from "@/zustand/location";
import { useEffect } from "react";

export default function UserLocation({ locationData }) {
  const { setLocation } = useLocation();

  useEffect(() => {
    setLocation(locationData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationData]);

  return null;
}
