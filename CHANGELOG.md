# Changelog — Portal Orang Tua

## 2026-11-26h — Overhaul visual (fondasi + Beranda)

- **Bukan polish tipis.** `assets/style.css` diganti: sidebar gelap merek, shell berbingkai di desktop, tipografi lebih berat, bayangan/radius baru, tab STS solid, empty-state dengan CTA primer.
- **Beranda dibangun ulang:** hero salam + kartu anak di panel merek; status rapor sebagai kartu aksi; grid kartu fitur (bukan daftar baris datar).
- Logika data, `shell-nav.js`, filter TKA, dan alur login **tidak diubah**.
- Halaman STS/Riwayat/TKA otomatis memakai chrome shell baru lewat CSS; konten dalamnya menyusul fase overhaul berikutnya.
- File: `assets/style.css`, `beranda.html`, CHANGELOG, ANTIREGRESI.
- Antiregresi: §26.


## 2026-11-26g1 — Hotfix: inisial double-declare di STS/Riwayat

- **Gejala:** `rapor-sts.html` (dan halaman serupa) error `Identifier 'inisial' has already been declared` karena `inisial` diimpor dari `shell-nav.js` sekaligus didefinisikan lokal.
- **Perbaikan:** hapus `function inisial` lokal di `rapor-sts`, `capaian`, `lima-besar`, `riwayat-tugas`; pakai ekspor shell saja. Hapus juga `doLogout` lokal yang redundan (sudah di-wire `initShell`).
- File: empat HTML di atas.


## 2026-11-26g — Polish STS + Riwayat (selaras Beranda)

- **Empty state seragam.** Rapor STS, Capaian, dan Riwayat Tugas memakai pola `.empty-state` (ikon, judul, teks, aksi kembali) di `assets/style.css`, bukan kotak generik.
- **Boot shell:** `rapor-sts`, `capaian`, `lima-besar`, `riwayat-tugas` memakai `initShell` dari `shell-nav.js` (logout, tanggal, TKA anti-FOUC).
- **Riwayat:** intro halaman dirapikan; empty «Belum ada tugas» lebih jelas.
- **STS menunggu jadwal:** countdown tetap ada, dibungkus empty-state.
- File: `rapor-sts.html`, `capaian.html`, `lima-besar.html`, `riwayat-tugas.html`, `assets/style.css`, CHANGELOG, ANTIREGRESI.
- Tidak mengubah logika data/query rapor atau tugas.
- Antiregresi: §25.


## 2026-11-26f — Polish Beranda (wajah portal)

- **Beranda tidak lagi tampil generik.** Salam waktu (pagi/siang/sore/malam) + nama panggilan orang tua; kartu anak dengan aksen merek; kartu status Rapor STS (tersedia / menunggu) dengan aksi «Buka rapor».
- Hub dipisah dua panel: «Laporan & capaian» dan «Aktivitas belajar» agar hierarki jelas.
- Boot memakai `initShell` + `inisial` dari `assets/shell-nav.js` (tanpa duplikasi logout/tanggal/TKA FOUC).
- File: `beranda.html`. Shell di halaman lain tidak diubah pada langkah ini.
- Antiregresi: §23.


## 2026-11-26e — Standarisasi template shell HTML

- **Satu pola shell** di semua halaman ortu: `aside.sidebar` (brand → Menu → hero-banner → Keluar), `header.top-header` (judul + tanggal + avatar + logout), `nav.bottom-nav` (Beranda · STS · Riwayat · TKA · Keluar).
- Urutan menu sidebar tetap: Beranda → STS → SAS (disabled) → Riwayat Belajar → Try Out TKA (`hidden` by default).
- Judul header diseragamkan: halaman STS memakai judul **STS** + tab bar; Riwayat memakai **Riwayat Belajar**; TKA memakai **Try Out TKA**.
- CSS utilitas shell (`.side-link-disabled`, `.sts-tabs`) dipindah ke `assets/style.css` agar tidak diduplikasi di `<style>` per halaman.
- Modul baru `assets/shell-nav.js`: `applyTkaVisibility` / `showTkaMenu` (anti-FOUC) sebagai sumber bersama; halaman mengimpor fungsi ini, tidak menyalin logika hide/show.
- File: keenam HTML di atas + `assets/style.css` + `assets/shell-nav.js` + CHANGELOG + ANTIREGRESI.
- Antiregresi: §23.


## 2026-11-26d — TKA tanpa FOUC + menu Riwayat Belajar

- **FOUC menu TKA diperbaiki.** Menu Try Out TKA (sidebar, bottom-nav, hub Beranda) sekarang **tersembunyi secara default** di HTML (`class="hidden"`). JS hanya *menampilkan* menu jika kelas anak 6A/6B (`showTkaMenu` / `applyTkaVisibility`), bukan menyembunyikan setelah tampil. Pengecekan pertama memakai `session.siswaKelas` secara sinkron agar tidak ada kedipan.
- **Menu Riwayat Belajar** ditambahkan di sidebar (di bawah SAS) dan bottom-nav. Saat ini mengarah ke `riwayat-tugas.html` (nilai & status tugas). Nantinya menjadi payung tahsin/tahfizh, tugas, dan kuis.
- Struktur menu: Beranda · STS · SAS (disabled) · Riwayat Belajar · Try Out TKA (hanya kelas 6).
- File: `beranda.html`, `rapor-sts.html`, `capaian.html`, `lima-besar.html`, `riwayat-tugas.html`, `tryout-tka.html`.
- Antiregresi: §20 diperbarui, §22.


## 2026-11-26c — Menu STS digabung + placeholder SAS

- **Sidebar & bottom-nav disederhanakan.** Tiga item terpisah («Rapor STS», «Ringkasan Capaian», «5 Besar Capaian») diganti menjadi **satu menu STS**.
- Di dalam halaman STS (`rapor-sts.html`, `capaian.html`, `lima-besar.html`) ditambahkan **tab bar** (Rapor | Capaian | 5 Besar) agar orang tua bisa berpindah tanpa kembali ke sidebar.
- Menu **SAS** ditambahkan sebagai placeholder disabled («Segera hadir»).
- Bottom-nav mobile: `Beranda · STS · TKA (jika kelas 6) · Keluar` — lebih lega.
- Try Out TKA tetap conditional kelas 6 (§20).
- **Belum** menambah menu Riwayat Belajar (akan menyusul setelah kerangka STS stabil).
- File: `beranda.html`, `rapor-sts.html`, `capaian.html`, `lima-besar.html`, `riwayat-tugas.html`, `tryout-tka.html`.
- Tidak mengubah data, query, atau `assets/firebase.js`.
- Antiregresi: §21.


## 2026-11-26b — Menu Try Out TKA hanya untuk orang tua kelas 6 + polish Beranda

- **Gejala:** menu «Try Out TKA» (sidebar, bottom-nav, baris hub di Beranda) selalu tampil untuk semua orang tua. Orang tua kelas non-6 yang membuka halaman mendapat peringatan kuning yang jelek («Khusus orang tua kelas 6… Anak Anda di kelas 5A»).
- **Perbaikan:**
  - Setelah kelas anak diketahui, menu TKA disembunyikan (`hidden`) di sidebar (`#navTryOutTka`), bottom-nav (`#navTryOutTkaBottom`), dan baris hub Beranda (`#hubTryOutTka`) bila kelas bukan 6A/6B.
  - Empty-state di `tryout-tka.html` diganti menjadi kartu netral dengan tombol kembali ke Beranda (bukan banner kuning).
  - Beranda diperhalus: kartu anak lebih jelas, stat-strip rapi, ikon hub konsisten SVG (bukan emoji), hierarki visual lebih baik.
- **File:** `beranda.html`, `rapor-sts.html`, `capaian.html`, `lima-besar.html`, `riwayat-tugas.html`, `tryout-tka.html`.
- Tidak mengubah data, query, atau `assets/firebase.js`. Logika kelas 6 tetap di `loadTryOutTkaAnak`.
- Antiregresi: §20.


## 2026-11-26 — Riwayat Tugas: nilai dan status tugas yang dibagikan guru

- **Baru:** halaman `riwayat-tugas.html`, dibuka dari baris «Riwayat Tugas» di Beranda (bagian «Yang dibagikan sekolah»). Menampilkan per tugas: judul, mata pelajaran, tanggal dibagikan, nilai, predikat, dan status («Sudah dinilai», «Perlu perbaikan», «Belum ada nilai»). Ada filter mata pelajaran bila lebih dari satu.
- **Isi sengaja hanya nilai dan status.** Tidak ada catatan guru, poin perbaikan, bukti, ranking, atau rata-rata.
- `assets/firebase.js`: fungsi baru `loadRiwayatTugasAnak(siswaId)` (hanya menambah ekspor; ekspor lain tidak berubah). Membaca `lms_tugas_hasil_ortu` dengan `siswaId == anak` dan `published == true`.
- `beranda.html`: satu baris hub baru + `?v=` firebase.js dinaikkan ke `20261126a`. Sidebar dan bottom-nav TIDAK berubah (tetap 5 menu + Keluar), halaman baru memakai menu yang sama dengan «Beranda» aktif.
- Sumber data ditulis oleh aplikasi LMS (tombol «Bagikan ke orang tua» di Daftar nilai tugas). Sebelum guru membagikan, halaman menampilkan «Belum ada tugas yang dibagikan guru.»
- **Deploy:** deploy `firestore.rules` terbaru dulu (koleksi baru `lms_tugas_hasil_ortu`), lalu hosting portal.
- Antiregresi: §19.

## 2026-11-22 — 5 Besar Capaian: aturan peringkat disamakan dengan Leger STS

- **Sebab:** peringkat dihitung dari rata-rata nilai akhir yang dibulatkan 1 desimal dan menerima siswa dengan jumlah mapel berbeda, berbeda dari Leger STS (jumlah nilai, hanya mapel lengkap).
- `assets/firebase.js` (`loadLimaBesarCapaian`): ranking dari jumlah nilai akhir, hanya siswa bermapel lengkap, seri berbagi peringkat; menambah `infoKelas`.
- `lima-besar.html`: penjelasan aturan peringkat dan keterangan jumlah siswa yang belum lengkap.
- Antiregresi: §18.

## 2026-11-21b — Try Out TKA: tabel 10 besar tetap tampil saat peringkat ananda belum sinkron

- **Gejala:** setelah pemeriksaan sinkron ditambahkan, kartu «Peringkat sedang diperbarui» tampil dan tabel 10 besar ikut hilang.
- **Perbaikan:** `loadTryOutTkaAnak` hanya menyembunyikan peringkat ananda; `top10ByTahap` tidak lagi dikosongkan karena dokumen 10 besar selalu yang terbaru.
- File: `assets/firebase.js`. Antiregresi: §17 butir 4.

## 2026-11-21 — Try Out TKA: peringkat tidak boleh kontradiktif + label «sementara»

- **Gejala:** kartu «Peringkat 6 dari 26 · rata-rata 65,40» tetapi tabel 10 besar menampilkan #6 = 72,00 dan hanya 6B; label «gabungan 6A & 6B» menyesatkan.
- **Akar:** peringkat ananda (`lms_tka_hasil_ortu`) dan 10 besar (`lms_tka_peringkat`) adalah dua snapshot terpisah yang bisa ditulis pada waktu berbeda.
- `assets/firebase.js` (`loadTryOutTkaAnak`): membandingkan `rankingId` kedua dokumen (data lama tanpa id: jumlah peserta, baris ananda di 10 besar, dan batas peringkat ke-10). Bila tidak sinkron, peringkat dan 10 besar tahap itu disembunyikan.
- `tryout-tka.html`: pesan «Peringkat sedang diperbarui oleh sekolah» bila tidak sinkron; label «sementara» + «baru n dari N siswa yang nilainya lengkap» bila peringkat belum mencakup semua siswa.
- Antiregresi: §17.

## 2026-11-12f — Menu dan tombol Keluar konsisten di semua halaman

- **Gejala:** berpindah dari Try Out TKA ke 5 Besar Capaian (atau Rapor / Capaian) membuat menu **Try Out TKA hilang** dari sidebar, dan tombol **Keluar** berubah menjadi tombol bawaan browser.
- **Akar:** menu ditulis ulang per halaman dan sudah menyimpang. `rapor-sts`, `capaian`, `lima-besar` tidak punya link Try Out TKA; `lima-besar` memakai kelas `btn-logout` yang tidak ada di CSS (bukan `side-logout`) dan bottom-nav-nya tidak punya tombol Keluar; bottom-nav HP tidak memuat TKA di mana pun kecuali `tryout-tka`, dan `tryout-tka` justru tidak memuat Capaian.
- **Perbaikan:** kelima halaman (`beranda`, `rapor-sts`, `capaian`, `lima-besar`, `tryout-tka`) kini memakai menu yang sama persis. Sidebar: Beranda, Rapor STS, Ringkasan Capaian, Try Out TKA, 5 Besar Capaian. Bottom-nav HP: Beranda, Rapor, Capaian, TKA, 5 Besar, Keluar. Tombol Keluar sidebar selalu `.side-logout`; `lima-besar` mendapat handler Keluar bottom-nav.
- `assets/style.css`: bottom-nav 6 item muat di layar sempit (`min-width:0`, font 10px di bawah 360px) dan tinggi baris label disamakan.
- File: `beranda.html`, `rapor-sts.html`, `capaian.html`, `lima-besar.html`, `tryout-tka.html`, `assets/style.css`.

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
