"use server";

import axios from "axios";

export async function getLocation({ latitude, longitude }) {
  const { data } = await axios.get(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
  );

  return data;
}

export async function getLocationData(ip) {
  const response = await fetch(`https://ipapi.com/ip_api.php?ip=${ip}`);
  const locationData = await response.json();

  return locationData;
}
