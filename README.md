Berikut adalah berkas `README.md` yang profesional, bersih, dan diatur ulang agar urutannya mendahulukan **Cara Menjalankan Aplikasi** sebelum **Fitur-Fitur yang Diimplementasikan**, sesuai dengan struktur instruksi yang kamu inginkan.

Kamu bisa langsung menyalin seluruh blok teks di bawah ini ke dalam berkas `README.md` pada direktori utama proyekmu:

```markdown
# AURACatalog — Airbnb-Inspired Consumer Marketplace

AURACatalog adalah aplikasi katalog produk modern berbasis web yang mengadopsi kemewahan visual dan kenyamanan antarmuka pengguna dari **Airbnb Design System**. Proyek ini dikembangkan menggunakan **React.js**, **Tailwind CSS v4** (`@tailwindcss/vite`), dan **Axios** sebagai motor penarikan data dari *FakeStoreAPI*.

Aplikasi ini dirancang dengan standar performa tinggi yang sepenuhnya mematuhi arsitektur komponen tunggal terpusat untuk logika UI (`src/App.jsx`), pemisahan modul penanganan request data asinkronus (`src/api.js`), serta standarisasi responsivitas *mobile-first* guna menyajikan pengalaman berbelanja yang mulus di semua perangkat.

---

## Cara Menjalankan Aplikasi di Lingkungan Lokal

Ikuti panduan langkah-demi-langkah berikut untuk memasang dan menguji aplikasi AURACatalog pada komputer Anda:

### 1. Prasyarat Sistem
Pastikan komputer Anda sudah terinstal lingkungan runtime **Node.js** (Versi 18 ke atas) serta pengelola paket **npm**.

### 2. Kloning Proyek
Buka terminal/command prompt, lalu jalankan perintah klon berikut dan masuk ke direktori proyek:
```bash
git clone <url-repositori-github-anda>
cd <nama-folder-proyek-anda>

```

### 3. Instalasi Pustaka Dependensi

Pasang seluruh paket modul yang diperlukan oleh sistem (React, Axios, dan plugin utama Tailwind v4) dengan perintah:

```bash
npm install

```

### 4. Jalankan Server Pengembangan (Development Server)

Nyalakan server lokal Vite dengan instruksi di bawah ini:

```bash
npm run dev

```

Setelah proses kompilasi selesai, terminal akan memunculkan alamat URL lokal (biasanya `http://localhost:5173/`). Buka tautan tersebut melalui browser pilihan Anda.

*Catatan: Jika Anda ingin memastikan server membersihkan sisa-sisa cache lama dari memori kompilasi, Anda bisa memaksa server berjalan lewat perintah:*

```bash
npm run dev -- --force

```

### 5. Kompilasi untuk Kebutuhan Produksi (Production Build)

Apabila ingin memaketkan aplikasi ke dalam file statis yang siap di-deploy ke server produksi (Netlify/Vercel/GitHub Pages), jalankan perintah:

```bash
npm run build

```

---

## Fitur-Fitur yang Diimplementasikan

Aplikasi ini mengintegrasikan seluruh arsitektur marketplace modern dengan fungsionalitas operasional sebagai berikut:

### 1. Desain Antarmuka Airbnb Canvas System

* **Clean White Canvas:** Estetika minimalis premium berlatar belakang putih murni (`#ffffff`), teks utama arang (`#222222`), teks sekunder abu-abu (`#6a6a6a`), dan garis pembatas/border tipis halus (`#dddddd`).
* **Rausch Accent Voltage:** Penggunaan warna tunggal merah *Airbnb Rausch* (`#ff385c`) secara eksklusif untuk seluruh elemen *Call to Action* (CTA) utama, tombol belanja, ikon rating bintang, dan penanda status aktif.
* **Friendly Shape Language:** Seluruh komponen interaktif dirancang dengan sudut membulat (*pill-shaped* `rounded-full` pada search bar/tab kategori, dan *soft-card* `rounded-xl` pada kartu katalog) untuk memancarkan kesan ramah dan humanis.

### 2. Arsitektur Komponen Tunggal & Clean Code (Single-File Architecture)

* Proyek telah dibersihkan secara total dari sisa-sisa framework CSS lama yang menabrak gaya (seperti Bootstrap) dan berkas CSS bawaan templat dasar.
* Seluruh logika visual, siklus manajemen state terpusat, penanganan event, modal detail, pencarian, dan render halaman dikunci di dalam satu berkas terpusat: `src/App.jsx`.

### 3. Asynchronous Data Fetching & Server-Side Filtering

* Menggunakan **Axios** secara murni pada berkas terisolasi `src/api.js` untuk melakukan penarikan data produk, kategori unik, dan penyaringan item secara asinkronus dari server.
* **Dynamic Category Filtering:** Setiap kali pengguna berpindah tab kategori, aplikasi melakukan *direct hit request* ke endpoint API spesifik (bukan melakukan filter tiruan di browser klien), memastikan pemuatan data berjalan real-time dan hemat memori.

### 4. Sistem Pencarian Real-Time & Real Pagination

* **Real-Time Search Bar:** Bar pencarian berbentuk kapsul di bagian navbar atas menyaring judul produk pilihan pengguna secara instan seiring ketikan keyboard, dioptimalkan dengan React `useMemo` untuk mencegah *re-render* yang sia-sia.
* **Responsive Pagination:** Memisahkan item produk API ke dalam beberapa halaman yang proporsional secara dinamis dengan search bar dan tab kategori aktif untuk mempercepat waktu pemuatan halaman.

### 5. Loading Indicator & Error Handling

* **Loading State:** Saat data sedang ditarik dari server API, aplikasi menampilkan indikator animasi berputar murni dari utilitas Tailwind (`animate-spin text-[#ff385c]`) di tengah halaman.
* **Error Handling:** Jika terjadi kegagalan jaringan atau server down, aplikasi memunculkan kotak notifikasi alert berwarna merah lembut (`bg-red-50 text-red-700`) yang ramah pengguna, lengkap dengan **Tombol Coba Lagi (Retry Button)** untuk memicu ulang *fetching* data.

### 6. Jendela Detail Produk Melayang (Anti-Break Modal)

* Mengoreksi masalah layout rusak dengan membungkus detail produk ke dalam **Fixed Modal Dialog Overlay** yang melayang di atas grid dengan efek blur tipis transparan (`backdrop-blur-sm`).
* Modal dirancang adaptif (1 kolom di seluler, 2 kolom di layar besar) menampilkan gambar komprehensif, judul tebal, deskripsi tekstual, kalkulasi bintang rating, harga, dan tombol aksi langsung.

### 7. Halaman Keranjang Belanja & Persistensi LocalStorage

* **Navigasi View Internal:** Perpindahan tampilan dari Katalog Utama ke halaman Keranjang Belanja dikontrol secara instan menggunakan state `currentView` tanpa dependensi eksternal router.
* **Manajemen Cart & Quantity Stepper:** Fitur tambah barang, tombol pengubah kuantitas item secara interaktif (+/-), penghapusan item, hingga ringkasan kalkulasi otomatis total tagihan belanja.
* **Persistensi Data 100%:** State *Cart* (Keranjang) dan status *Wishlist* (Ikon Hati) terikat langsung ke dalam `localStorage` browser, menjamin data barang belanjaan pengguna tidak hilang atau ter-reset ketika halaman web di-refresh.

### 8. Responsivitas Total Lintas Perangkat (Mobile-First Layout)

* **Navbar Adaptif:** Pada layar smartphone, komponen navbar bertransformasi secara otomatis dari baris horizontal menjadi tumpukan vertikal yang rapi dengan search bar melebar penuh (`w-full`).
* **Scrollable Category Strip:** Deretan pil kategori bertransformasi menjadi baris yang dapat digeser secara menyamping (*scrollable horizontal strip*) di HP, mencegah teks patah ke bawah.
* **Responsive Grid & Cart Elements:** Grid katalog dikunci menggunakan breakpoint `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`. Struktur tabel pada keranjang belanja akan melebur menjadi tumpukan kartu vertikal fleksibel saat diakses melalui smartphone.

---

## Spesifikasi Ukuran Breakpoint Responsif

Penataan tata letak visual aplikasi ini dikontrol secara ketat melalui parameter grid Tailwind v4 berikut:

* **Layar Smartphone / Seluler (`< 744px`):** Grid katalog memuat 1 kolom, daftar keranjang belanja berbentuk kartu vertikal tunggal, menu kategori dapat digeser ke samping, modal detail menjadi full-screen panel.
* **Layar Tablet Portrait (`744px - 1128px`):** Grid katalog secara otomatis membelah menjadi 2 hingga 3 kolom.
* **Layar Desktop (`> 1128px`):** Grid katalog tampil maksimal 4 kolom, lebar kontainer utama dibatasi di tengah layar (`max-w-7xl mx-auto`) dengan padding pengaman yang lega di sisi kanan dan kiri.

```

```