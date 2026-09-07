# Dokumentasi Proyek — Sertifikasi Junior Web Developer

**Peserta:** Erlangga
**Skema:** Junior Web Developer
**Tahun:** 2026

## 1. Ringkasan

| # | Tugas | Hasil |
|---|-------|-------|
| 1 | Website statis profil pribadi | `web-portofolio/` |
| 2 | Website dinamis toko karya tangan (batik) | `web-batik/` (Kainara Studio) |
| 3 | Tautkan web usaha ke dalam web profil | Tombol + kartu proyek + footer, dua arah, dengan layar loading transisi |

## 2. Struktur Folder

```
KainraSerkom/
├── web-portofolio/          # Web statis
│   ├── index.html           # Hero, tentang, perjalanan, layanan, skill, proyek, kontak
│   ├── 404.html
│   ├── style.css            # Design system "Warm Editorial" (CSS variables)
│   └── script.js            # Dark mode, progress bar, validasi form
└── web-batik/               # Web dinamis (Supabase)
    ├── index.html           # Hero, promo, katalog, cara pesan, tentang, kontak
    ├── admin.html           # Panel admin CRUD (terkunci PIN)
    ├── 404.html
    ├── css/style.css
    ├── img/logo-k.svg
    └── js/
        ├── supabaseClient.js  # Koneksi + helper (formatRupiah, escHtml)
        ├── catalog.js         # Katalog: search, filter, sort, pagination, wishlist, ulasan
        ├── cart.js            # Keranjang (localStorage + validasi stok)
        ├── checkout.js        # Checkout via WhatsApp
        ├── admin.js           # CRUD produk + upload gambar
        └── script.js          # Navbar, dark mode, offline bar, transisi halaman
```

## 3. Fitur Utama

**Web Portofolio:** hero formal (foto/monogram + caption peran ganda Web & Flutter),
tentang, timeline perjalanan 2024–2026, layanan (4 jasa, termasuk aplikasi mobile Flutter),
8 skill cards (termasuk Flutter & Dart), featured project + modal cuplikan, 2 kartu proyek,
form kontak bervalidasi (kirim via WhatsApp), dark mode, scroll progress bar, 404 personal.

**Web Toko (Kainara Studio):** katalog dinamis dari Supabase (cari, kategori, rentang harga,
sorting, pagination), favorit/wishlist, rating & ulasan, produk terkait, tombol share,
keranjang + validasi stok, checkout via WhatsApp, riwayat pesanan, promo flash sale +
countdown, cara pemesanan 1-2-3, testimoni, form kontak cepat, dark mode, indikator offline,
halaman admin CRUD terkunci PIN.

## 4. Teknologi / Library (pre-existing)

Bootstrap 5.3.3, Bootstrap Icons 1.11.3, SweetAlert2, Supabase JS v2 (PostgreSQL + Storage),
Google Fonts (Playfair Display, Inter, Caveat).
Bahasa: Indonesia, Inggris, Jepang, Arab (RTL) via sistem i18n sendiri.

## 5. Cara Menjalankan & Demo ke Asesor

1. Buka `web-portofolio/index.html` → klik **"Lihat Toko Saya"** (ada loading transisi).
2. Di toko: coba cari/filter produk, tambah ke keranjang, checkout (terbuka WhatsApp).
3. Buka `web-batik/admin.html` → masukkan PIN demo: **`kainara26`** → tambah/edit/hapus produk
   (data tersimpan di Supabase, langsung muncul di katalog).
4. Coba dark mode (ikon bulan di navbar) dan matikan internet (muncul bar offline).

> Catatan: fitur tulis (admin CRUD) butuh koneksi ke Supabase. Kunci anon dipakai di sisi
> klien hanya untuk demo; data produk bersifat publik-baca.

## 6. Praktik yang Diterapkan

- HTML semantik + meta SEO/OG + ARIA label pada tombol ikon.
- Anti-XSS: semua render produk via `escHtml` + event delegation (tanpa inline `onclick` berdata).
- Validasi input di klien (form kontak, stok, nomor HP) + pesan error per field.
- `prefers-reduced-motion` dihormati; efek non-esensial mati di perangkat sentuh.
- Kode terstruktur per file/fungsi; tidak ada framework build — murni HTML/CSS/JS.
