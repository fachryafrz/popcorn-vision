export function slugify(text) {
  const slug = text
    ?.toLowerCase() // Ubah menjadi huruf kecil semua
    .replace(/[^\w\s-]/g, "") // Hapus karakter yang tidak cocok dengan pola regex
    .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
    .replace(/-{2,}/g, "-") // Hapus multiple tanda hubung berturut-turut
    .replace(/^-+|-+$/g, ""); // Hapus tanda hubung di awal atau akhir string

  if (slug !== "") {
    return `-${slug}`;
  } else {
    return "";
  }
}
