<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Home Page

Mulai implementasi dari halaman Home terlebih dahulu.

Tujuan halaman Home adalah membantu pengguna menemukan film dan serial TV yang sedang populer, trending, dan berdasarkan kategori atau streaming service tertentu.

### 1. Hero Section

Tampilkan hero carousel fullscreen di bagian paling atas halaman.

Ketentuan:

* Menampilkan campuran data Movie dan TV Series.
* Data diambil dari kombinasi:

  * Trending.
  * Popular.
  * New Releases / Recently Released.
* Pilih sekitar 10-15 item terbaik untuk ditampilkan pada hero slider.
* Setiap slide menampilkan:

  * Backdrop image.
  * Poster.
  * Judul.
  * Tipe konten (Movie / TV Series).
  * Rating TMDB.
  * Genre.
  * Tahun rilis.
  * Overview singkat.
* Tambahkan tombol:

  * View Details.
  * Add to Watchlist (jika user login).

### 2. Trending Now Section

Tampilkan carousel horizontal dengan title:

**Trending Now**

Di sebelah title terdapat segmented control / tabs:

* All
* Movies
* TV Series

Perilaku:

* All → menampilkan kombinasi Movie dan TV Series yang sedang trending.
* Movies → hanya menampilkan Movie trending.
* TV Series → hanya menampilkan TV Series trending.
* Ketika tab berubah, lakukan fetching ulang data sesuai filter yang dipilih.
* Gunakan skeleton loading ketika data sedang dimuat.

### 3. Streaming Services Originals Section

Tampilkan carousel horizontal dengan title berbentuk dropdown.

Default:

**Netflix Originals**

Pilihan dropdown:

* Netflix Originals
* HBO Originals
* Prime Video Originals
* Disney+ Originals
* Apple TV+ Originals

Perilaku:

* Ketika pengguna memilih provider berbeda, lakukan fetching ulang data berdasarkan provider yang dipilih.
* Gunakan TMDB Watch Providers atau provider metadata yang tersedia.
* Menampilkan Movie dan TV Series sesuai provider.
* Gunakan skeleton loading selama proses fetch.

Contoh:

Netflix Originals ▼

[Carousel Content]

Jika user memilih:

Disney+ Originals ▼

Maka carousel harus diperbarui tanpa reload halaman.

### 4. Browse by Category Section

Tampilkan carousel horizontal dengan title berbentuk dropdown.

Default:

**Action**

Pilihan kategori diambil dari TMDB Genres.

Contoh:

* Action
* Adventure
* Animation
* Comedy
* Crime
* Documentary
* Drama
* Fantasy
* Horror
* Mystery
* Romance
* Science Fiction
* Thriller
* War
* Western

Perilaku:

* Ketika genre dipilih, lakukan fetching ulang data sesuai genre tersebut.
* Menampilkan Movie dan TV Series yang termasuk genre yang dipilih.
* Gunakan skeleton loading selama proses fetch.

Contoh:

Action ▼

[Carousel Content]

Ketika user memilih:

Comedy ▼

Maka carousel harus diperbarui tanpa reload halaman.

### Card Design

Semua carousel menggunakan komponen card yang konsisten.

Card harus menampilkan:

* Poster.
* Judul.
* Tahun rilis.
* Rating TMDB.
* Badge Movie atau TV Series.

Hover state:

* Scale ringan.
* Menampilkan tombol Quick View.
* Menampilkan tombol Add to Watchlist.

### Loading State

Setiap section memiliki loading state sendiri.

Gunakan:

* Skeleton cards.
* Skeleton hero banner.

Jangan menggunakan loading global untuk seluruh halaman.

### Performance

* Gunakan Server Components jika memungkinkan.
* Gunakan caching dan revalidation yang sesuai.
* Lazy load carousel yang berada di bawah viewport.
* Hindari duplicate request ke TMDB.
* Gunakan pagination atau infinite loading untuk kebutuhan berikutnya.

### Responsive Design

Desktop:

* Hero fullscreen.
* 5–6 card per row pada carousel.

Tablet:

* 3–4 card per row.

Mobile:

* 2–3 card per row.
* Hero disesuaikan agar tetap fokus pada backdrop dan informasi utama.

<!-- END:nextjs-agent-rules -->
