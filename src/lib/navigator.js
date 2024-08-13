import { getLocation } from "./fetch";

export function askLocation(setUserLocation, setError) {
  if (sessionStorage.getItem("user-location")) {
    setUserLocation(sessionStorage.getItem("user-location"));
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          const { latitude, longitude } = userLocation;

          // Asumsikan getLocation adalah fungsi yang mengembalikan lokasi berdasarkan koordinat
          getLocation({ latitude, longitude }).then((response) => {
            sessionStorage.setItem("user-location", JSON.stringify(response));
            setUserLocation(JSON.stringify(response));
            setError(null); // Clear any previous errors
          });
        },
        (error) => {
          console.log(error);
          if (error.code === error.PERMISSION_DENIED) {
            setError(
              "Location access denied by user. Please enable location access in your browser settings and try again.",
            );
          }
        },
      );
    }
  }
}
