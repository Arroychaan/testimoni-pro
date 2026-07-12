# LAPORAN AUDIT LOGIKA & ALUR BISNIS: TESTIMONIPRO

Dokumen ini mencantumkan 11 cacat logika, cacat konsep, celah keamanan, dan bug kegunaan yang diidentifikasi dari penelusuran menyeluruh terhadap file dan halaman di dalam proyek TestimoniPro.

---

### 1. Pendaftaran Bisnis Tanpa Tahap Verifikasi (Klaim Sepihak)
* **Lokasi:** [`RegisterBusiness.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/RegisterBusiness.jsx)
* **Deskripsi:** Menekan tombol "Daftar" langsung mempublikasikan profil bisnis dan slug secara instan. Tidak ada mekanisme verifikasi admin, antrean audit, atau flag status peninjauan (`pending`/`approved`).
* **Dampak:** Siapapun dapat mendaftarkan nama brand ternama secara sepihak dan menyalahgunakan nama dagang tersebut.

### 2. Celah Spam "Ulasan Publik" (Sybil Attack)
* **Lokasi:** [`SubmitExperience.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/SubmitExperience.jsx) & [`supabase_schema.sql`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/supabase_schema.sql)
* **Deskripsi:** Ulasan dapat dikirimkan sebagai "Ulasan Publik" biasa tanpa token verifikasi transaksi. RLS policy membolehkan operasi `INSERT` ulasan dari siapapun secara anonim.
* **Dampak:** Bot atau kompetitor dapat dengan mudah membanjiri profil bisnis dengan ribuan ulasan palsu/negatif untuk merusak reputasi mereka.

### 3. Konsep "Campaign" & "Produk" yang Hilang
* **Lokasi:** [`Dashboard.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/Dashboard.jsx)
* **Deskripsi:** Tombol "Buat Token" men-generate token dengan parameter nama produk kosong (`productName: ''`). Tidak ada antarmuka bagi pemilik bisnis untuk menautkan token ke kampanye promo atau jenis produk tertentu secara dinamis.
* **Dampak:** Pemilik bisnis tidak memiliki kontrol atas produk apa yang diulas, membuat token transaksi kehilangan konteks pemasaran yang bermakna.

### 4. Sistem Poin Loyalitas Palsu (Client-side Dummy)
* **Lokasi:** [`SubmitExperience.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/SubmitExperience.jsx)
* **Deskripsi:** Poin loyalitas disimpan menggunakan `localStorage.setItem('tp_pending_loyalty', ...)`. Tidak ada tabel database untuk menyimpan saldo poin pengguna atau relasi penukaran hadiah.
* **Dampak:** Poin akan langsung hangus jika pengguna membersihkan cache browser, beralih perangkat, atau memakai tab samaran (incognito). Poin juga tidak dapat ditukarkan.

### 5. WhatsApp Auto-Reply yang Tidak Bekerja (Ghost Feature)
* **Lokasi:** [`EditProfile.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/EditProfile.jsx) & [`SubmitExperience.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/SubmitExperience.jsx)
* **Deskripsi:** Terdapat kolom pengaturan template WhatsApp Auto-reply, tetapi alur pengiriman testimoni tidak terintegrasi ke penyedia gerbang API WhatsApp (seperti Twilio, Fonnte, dll.) untuk memicu pengiriman pesan nyata ke nomor pelanggan.
* **Dampak:** Fitur ini hanya menjadi placeholder data di database tanpa fungsionalitas nyata.

### 6. Cacat Konsep Monetisasi (SaaS Billing Bypass)
* **Lokasi:** [`EditProfile.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/EditProfile.jsx)
* **Deskripsi:** Kunci fitur premium (Pro) dikendalikan murni oleh kolom boolean `is_pro` di database. Tidak ada integrasi sistem payment gateway (Stripe/Midtrans) maupun pencatatan status/masa aktif langganan.
* **Dampak:** Pengguna dapat dengan mudah memodifikasi data boolean `is_pro` di Supabase untuk membypass sistem pembayaran dan menggunakan fitur premium gratis selamanya.

### 7. Inkonsistensi Matematika Trust Grade (Dokumentasi vs Implementasi)
* **Lokasi:** [`TrustGradePage.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/TrustGradePage.jsx) vs [`supabase_schema.sql`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/supabase_schema.sql)
* **Deskripsi:** Dokumentasi TrustGradePage membagi rentang skor sebagai: `0-29` (Merah), `30-59` (Kuning), `60-79` (Hijau), dan `80-100` (Emas). Sedangkan skema database mengimplementasikan: `>=90` (Sangat Terpercaya), `>=75` (Terpercaya), `>=60` (Cukup Baik), `>=40` (Perlu Peningkatan), dan `<40` (Belum Terverifikasi).
* **Dampak:** Kebingungan pengguna dan hilangnya kredibilitas sistem penilai karena rumus publik tidak sesuai dengan perhitungan riil di backend.

### 8. Peretasan Layout Logo yang Rapuh (Absolute CSS Position Hack)
* **Lokasi:** [`Navbar.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/components/ui/Navbar.jsx)
* **Deskripsi:** Elemen penampung logo menggunakan modifikasi posisi absolut negatif yang sangat kaku:
  ```javascript
  position: 'absolute', left: '-32px', top: '-90px', width: '200px', height: '200px'
  ```
* **Dampak:** Logo akan terpotong, tidak sejajar, atau menghilang dari navbar jika file aset SVG diubah atau diganti dengan dimensi yang berbeda.

### 9. Plasebo Banner Cookies (Tanpa Pemblokiran Skrip Pelacak)
* **Lokasi:** [`CookieBanner.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/components/ui/CookieBanner.jsx) & [`CookieSettings.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/CookieSettings.jsx)
* **Deskripsi:** Opsi persetujuan cookie (Esensial, Analitik, Marketing) hanya mengubah state UI lokal tanpa memicu fungsi untuk mematikan atau mengaktifkan tag/skrip pelacak eksternal secara dinamis.
* **Dampak:** Pelanggaran hukum privasi (GDPR/CCPA) karena tracker tetap berjalan di latar belakang terlepas dari pilihan persetujuan pengguna.

### 10. Inkonsistensi Sanitasi Input Nomor WhatsApp
* **Lokasi:** [`RegisterBusiness.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/RegisterBusiness.jsx) vs [`EditProfile.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/EditProfile.jsx)
* **Deskripsi:** Pada pendaftaran bisnis, input WhatsApp disanitasi ketat dari karakter non-angka. Namun, di halaman edit profil, input tersebut berupa kolom teks biasa tanpa sanitasi.
* **Dampak:** Potensi masuknya data sampah atau teks tidak valid ke kolom `owner_whatsapp` di database.

### 11. Inkonsistensi Skema Pricing Paket PRO
* **Lokasi:** [`Pricing.jsx`](file:///d:/Achmad%20Roychan/Proyek/testimoni-pro/src/pages/Pricing.jsx)
* **Deskripsi:** Paket Pro ditampilkan seharga Rp 0/bulan dengan label diskon terbatas untuk 100 pendaftar pertama secara statis. Tidak ada logika backend untuk memantau sisa kuota promo secara dinamis.
* **Dampak:** Halaman harga tidak mencerminkan status penawaran yang sebenarnya secara real-time dan berisiko menyesatkan calon pelanggan.
