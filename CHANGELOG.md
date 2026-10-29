# Changelog — Portal Orang Tua

## 2026-10-29m

### Narasi menunggu rapor STS lebih informatif
- Pesan di `rapor-sts.html` saat rapor belum tersedia diubah menjadi lebih ramah orang tua.
- Jika wali kelas sudah menjadwalkan rilis (field `jadwalAt` di `sts_publikasi`):
  - Menampilkan tanggal dan jam kapan rapor akan dibuka.
- Jika belum dijadwalkan / belum dipublikasikan:
  - Pesan singkat: belum dipublikasikan oleh wali kelas, silakan cek kembali nanti atau tanyakan ke wali kelas.
- `loadRaporStsResmi` di `assets/firebase.js` sekarang juga mengembalikan `jadwalLabel` dan `periodeLabel` bila ada jadwal.
- Tidak mengubah tampilan rapor yang sudah published. Tidak ada perubahan di aplikasi penilaian.

## 2026-10-29l

### Status menu Rapor STS di beranda mengikuti lembar resmi
- Beranda (`beranda.html`) sekarang memakai `loadRaporStsResmi` (koleksi `rapor_sts_ortu` + gerbang `sts_publikasi`) untuk menentukan status.
- Jika lembar resmi belum ada / belum dipublikasikan ulang oleh wali kelas:
  - Deskripsi menu: “Belum dipublikasikan oleh wali kelas”
  - Badge: Menunggu
  - Status strip: Menunggu
- Jika sudah tersedia: “Rapor STS siap dibuka”, badge Tersedia, periode dari dokumen rapor.
- Sumber lama (`loadNilaiStsPublished` / rata-rata `nilai_sts`) tidak lagi dipakai di beranda agar tidak menampilkan “siap dibuka” padahal rapor resmi belum ada.
- Halaman `rapor-sts.html` tidak diubah (sudah memakai sumber resmi). Tidak ada perubahan data atau aplikasi penilaian.

## 2026-10-29k

### Sapaan login lebih islami
- Di halaman login (`index.html`), judul panel orang tua diubah dari “Hai, Bapak dan Ibu.” menjadi “Assalamu'alaikum wr. wb. Ayah/Bunda.”
- Hanya teks sapaan yang berubah. Form, id elemen, tab, logika login, skala fluid, dan seluruh halaman lain tidak diubah.
- Tidak ada risiko regresi fungsional.

