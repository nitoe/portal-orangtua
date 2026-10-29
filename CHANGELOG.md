# Changelog — Portal Orang Tua

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

