"use server";

// NOTE: This has to be called from server actions, I tried to use it in the Location.jsx but it didn't work
export async function getLocationData(ip) {
  const response = await fetch(`https://ipapi.com/ip_api.php?ip=${ip}`);
  const locationData = await response.json();

  return locationData;
}
