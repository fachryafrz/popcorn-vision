export function formatYYYYMMDD({ date }) {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Tambah 1 karena bulan dimulai dari 0
  const day = String(newDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function calculateDate({ date, years = 0, months = 0, days = 0 }) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  newDate.setMonth(newDate.getMonth() + months);
  newDate.setDate(newDate.getDate() + days);

  return formatYYYYMMDD({ date: newDate });
}

export function formatDate({ date, showDay = true }) {
  const newDate = new Date(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const releaseDayIndex = newDate.getDay();
  const releaseDay = dayNames[releaseDayIndex];

  const formattedDate = newDate.toLocaleString("en-US", options);

  if (showDay) {
    return `${releaseDay}, ${formattedDate}`;
  } else {
    return formattedDate;
  }
}
