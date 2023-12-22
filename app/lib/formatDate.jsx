export function formatDate({ date }) {
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

  return formatDate({ date: newDate });
}
