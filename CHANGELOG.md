# Changelog — Portal Orang Tua

## 2026-11-12e — Dashboard Try Out TKA: ringkasan, jalur tahap, rincian satu tahap

- **Hero ringkasan ananda:** nama, kelas, dan tiga angka (tahap dibuka, rata-rata terbaru, peringkat terbaru). Menggantikan blok identitas kecil yang menggandakan avatar header.
- **Jalur Try Out:** lima tahap sebagai tile ringkas (rata-rata, peringkat, selisih, bar mini). Tahap yang belum dibuka menjadi tile terkunci kecil, tidak lagi lima baris lebar yang identik.
- **Rincian satu tahap sekaligus:** pilih tile untuk membuka panel; default tahap terbaru yang dibuka. Berisi kartu peringkat, rata-rata, tiga kartu mapel berwarna (Bahasa Indonesia biru, Matematika teal, IPA rose, selaras LMS) dengan meter 0–100, catatan wali kelas, dan 10 besar (lencana 1–3, catatan posisi ananda bila di luar 10 besar).
- **Selisih (▲/▼) per mapel** dibanding tahap sebelumnya yang memuat mapel yang sama, lengkap dengan legenda yang terlihat di HP.
- **Sebaran capaian:** dilipat per mapel («Lihat sebaran capaian»), nama materi panjang dibungkus, bukan dipotong.
- Empty state baru bila belum ada tahap yang dibuka. Mobile: label hero diringkas, tile 5 kolom tetap muat di 375px.
- **Rata-rata selalu dua desimal** (mis. 80,00 / 81,67) di hero, tile, kartu rata-rata, dan tabel 10 besar; selisih rata-rata juga dua desimal. Nilai per mapel tetap bilangan apa adanya.
- **Tidak mengubah** data, query, atau `assets/firebase.js`. Hanya `tryout-tka.html`.

## 2026-11-12d — Katalog Try Out + sebaran capaian + label lengkap

- **Katalog per tahap**: Try Out I, II, … sebagai kartu terpisah (buka/tutup), tidak menumpuk.
- **Ranking** sebagai kartu tersendiri di dalam tahap (10 besar collapsible).
- Label mapel **Bahasa Indonesia** (bukan BI), Matematika, IPA.
- Tampilkan **sebaran capaian** per mapel bila snapshot memuatnya:
  - per tingkat kompleksitas (L1/L2/L3)
  - per materi / capaian
  - domain IPA (Pengetahuan / Keterampilan Proses Sains)
- Shell modern (top-header, sidebar, bottom-nav) dipertahankan.
- File: `tryout-tka.html`, `assets/firebase.js` (`sebaran` dari `lms_tka_hasil_ortu`).

## 2026-11-12b — Polish UI Hasil Try Out TKA

- Tampilan `tryout-tka.html` diperhalus agar tidak terasa skeleton/generik:
  - Intro header bermerek sekolah (gradient muh-600).
  - Kartu tahap dengan head + badge status jelas (Dipublikasikan / Belum).
  - Kartu nilai BI / Matematika / IPA lebih legible; ranking anak ditonjolkan.
  - Tabel 10 besar lebih rapi, highlight baris anak, scroll horizontal di HP.
  - Empty state & catatan wali lebih ramah orang tua.
- **Tidak mengubah** logika data, query snapshot, atau alur publish di LMS.
- File: `tryout-tka.html`.

## 2026-11-12 — Hasil Try Out TKA (kelas 6)

- Menu **Try Out TKA** + halaman `tryout-tka.html`: nilai BI/MTK/IPA, rata-rata, peringkat gabungan 6A+6B, 10 besar.
- Hanya tahap yang sudah dipublikasikan wali di LMS.
- Khusus sesi anak kelas 6A/6B; kelas lain mendapat penjelasan.
- File: `tryout-tka.html`, `beranda.html`, `assets/firebase.js` (`loadTryOutTkaAnak`).

## 2026-10-30f

### Hapus badge “Ananda” yang menutupi nilai
- Label **Ananda** di pojok kartu 5 Besar dihilangkan karena menutupi angka rata-rata.
- Kartu anak sendiri tetap dibedakan dengan border/latar ungu lembut (`is-mine`), tanpa teks tambahan.

## 2026-10-30e

### Kembalikan pilihan kelas seperti semula
- Filter kelas di `lima-besar.html` kembali ke tombol wrap dengan label **Kelas …** (bukan strip geser horizontal).
- Kelas hanya muncul jika rapor STS kelas tersebut sudah dipublikasikan wali kelas; jika 6B belum publish, memang tidak ada di daftar.

## 2026-10-30d

### Hapus legenda “Arti ikon peringkat”
- Bagian penjelasan ikon peringkat 1–5 di bawah daftar 5 Besar dihilangkan; ikon tetap tampil di kartu ranking saja.
- Hanya UI `lima-besar.html`.

## 2026-10-30c

### Filter kelas 5 Besar terlihat di HP (termasuk 6B)
- Strip filter kelas di `lima-besar.html` di layar HP: digeser **horizontal** (bukan hanya wrap yang terpotong), sehingga kelas di ujung seperti **6B** tetap bisa dijangkau.
- Tombol filter menampilkan kode kelas singkat (`6B`) agar muat lebih banyak; `aria-label` tetap “Kelas 6B”.
- Kelas aktif otomatis di-scroll ke tengah strip.
- Padding bawah ditambah agar daftar ranking tidak tertutup bottom-nav.
- Hanya UI mobile; logika ranking tidak berubah.

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
