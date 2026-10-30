# Changelog — Portal Orang Tua

## 2026-10-30b

### Revisi ikon 5 Besar: piala (1–3) & medali (4–5)
- Peringkat **1–3** memakai ikon **piala**, dibedakan ukuran, warna, bentuk, dan ornamen:
  - **1** — piala emas besar, gagang melengkung, bintang di puncak, animasi glow
  - **2** — piala perak lebih ramping, gagang bersudut, ring pada batang
  - **3** — piala perunggu lebih kecil/pendek, garis ornamen horizontal
- Peringkat **4–5** memakai **medali** (biru dan hijau) dengan pita.
- Hanya perubahan visual di `lima-besar.html`. Tidak mengubah data, ranking, atau halaman lain.

## 2026-10-30a

### Fitur 5 Besar Capaian (seluruh kelas)
- Halaman baru `lima-besar.html`: orang tua dapat melihat daftar **5 besar capaian** dari **setiap kelas** (bukan hanya kelas ananda), berdasarkan rata-rata nilai akhir mapel pada rapor STS resmi yang sudah dipublikasikan.
- Ikon peringkat berbeda:
  - **1** — mahkota emas berkelip (animasi glow) + nomor emas
  - **2** — medali perak
  - **3** — medali perunggu
  - **4** — bintang biru
  - **5** — pita hijau
- Filter per kelas; kelas ananda ditandai; jika ananda masuk 5 besar, kartu ditandai “Ananda”.
- Fungsi baru `loadLimaBesarCapaian()` di `assets/firebase.js` (agregasi `rapor_sts_ortu` + gerbang `sts_publikasi`).
- Navigasi (sidebar + bottom nav) diperbarui di beranda, rapor STS, ringkasan capaian; kartu hub di beranda.
- **Tidak mengubah** halaman Ringkasan Capaian pribadi, rumus nilai, atau aplikasi penilaian. Tidak ada write ke Firestore dari portal.
- Hanya data yang sudah `published` yang tampil.

## 2026-10-29n

### Timer hitung mundur rilis rapor STS + narasi lebih sopan
- Di `rapor-sts.html`, jika wali kelas sudah menetapkan jadwal rilis (`jadwalAt`):
  - Ditampilkan timer hitung mundur (jam:menit:detik) yang diperbarui setiap detik.
  - Setelah waktu tiba, muncul pesan untuk memuat ulang halaman.
- Jika belum dijadwalkan: narasi tetap ramah — belum dipublikasikan, silakan cek kembali atau tanyakan ke wali kelas.
- Di `capaian.html`:
  - “Belum ada data rapor STS untuk anak ini.” → “Belum ada data rapor STS untuk ananda.”
  - “Hanya nilai anak ini.” → “Hanya nilai ananda.”
  - “Data anak tidak ditemukan” → “Data ananda tidak ditemukan”
- Tidak mengubah data, rumus, atau aplikasi penilaian. Timer hanya tampilan di portal.

## 2026-10-29m

### Narasi menunggu rapor STS lebih informatif
- Pesan di `rapor-sts.html` saat rapor belum tersedia diubah menjadi lebih ramah orang tua.
- Jika wali kelas sudah menjadwalkan rilis (field `jadwalAt` di `sts_publikasi`):
  - Menampilkan tanggal dan jam kapan rapor akan dibuka.
- Jika belum dijadwalkan / belum dipublikasikan:
  - Pesan singkat: belum dipublikasikan oleh wali kelas, silakan cek kembali nanti atau tanyakan ke wali kelas.
- `loadRaporStsResmi` di `assets/firebase.js` sekarang juga mengembalikan `jadwalLabel` dan `periodeLabel` bila ada jadwal.
- Tidak mengubah tampilan rapor yang sudah published. Tidak ada perubahan di aplikasi penilaian.

