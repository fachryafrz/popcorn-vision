import { USER_LOCATION } from "./constants";
import { getLocation } from "./fetch";

export function findLocation(setLocation, setError) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const { latitude, longitude } = userLocation;

      // Asumsikan getLocation adalah fungsi yang mengembalikan lokasi berdasarkan koordinat
      getLocation({ latitude, longitude }).then((response) => {
        localStorage.setItem(USER_LOCATION, JSON.stringify(response));
        setLocation(JSON.stringify(response));
        setError(null); // Clear any previous errors
      });
    },
    (error) => {
      console.error(error);
      if (error.code === error.PERMISSION_DENIED) {
        setError(
          "Location access denied by user. Please enable location access in your browser settings and try again.",
        );
      }
    },
  );
  // }
}

export function checkLocationPermission(setLocation, setError) {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      findLocation(setLocation, setError);
    } else if (result.state === "prompt") {
      setError(true);
      // Don't do anything if the permission was prompt.
    } else if (result.state === "denied") {
      // Don't do anything if the permission was denied.
    }
  });
}

export function requestLocation(setLocation, setError) {
  if (navigator.geolocation) {
    findLocation(setLocation, setError);
  }
}
