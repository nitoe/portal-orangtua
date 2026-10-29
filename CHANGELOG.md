# Changelog — Portal Orang Tua

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

## 2026-10-28f

### Login orang tua: NISN, tanpa registrasi
- Pilih kelas → nama anak → **NISN** (bukan akun email ortu).
- Sesi `po_ortu_session` di localStorage; tidak membuat user Auth orang tua.
- Verifikasi: `siswa.nisn` (fallback `nis` / `nipd`).

### UI selaras SDM01Penilaian (DESIGN.md)
- Token merek biru `#313083`, canvas datar, Inter, tanpa gradient hijau lama.
- Login, admin (sidebar ringkas), style.css diganti total.

### Admin
- Panel ringkas: statistik roster + catatan teknis (bukan kelola akun ortu).

## 2026-10-28e
- Panel admin kelola akun ortu (digantikan model NISN).

## 2026-10-28g

### Nilai STS produksi
- Baca koleksi `nilai_sts` (filter `siswaId`, semester & tahun ajaran dari `config/akademik`).
- Agregasi rata-rata per **mapel** (beberapa TP digabung).
- Gerbang opsional: `sts_publikasi/{kelas}_{tahunAjaran}_{semester}` dengan `published: true`.
- Jika dokumen publikasi tidak ada: tampilkan nilai selama ada data (kompatibel).
- Beranda diselaraskan ke design system biru penilaian.

## 2026-10-28h

### UI/UX orang tua
- Login: langkah 1–2–3 di hero, copy lebih ringkas, mobile brand bar.
- Beranda: kartu anak, daftar **Nilai yang dibagikan** (STS aktif; slot nilai lain disabled untuk masa depan).
- Detail STS: tabel mapel datar, status publikasi jelas, empty state ramah.
- Design system tetap biru `#313083` (DESIGN.md penilaian).

### Kebijakan konten
- Hanya STS untuk saat ini; nilai lain menyusul jika guru membagikan.
- Publikasi: `sts_publikasi` · opsional `window.__PO_REQUIRE_PUBLISH = true` untuk gerbang ketat.

## 2026-10-28i

### Layout = shell SDM01Penilaian (Layout.tsx)
- `app-frame` + `app-shell` (putih, border, radius di desktop)
- Sidebar kiri: brand, menu, banner profil, keluar
- Header sticky: judul halaman + tanggal + avatar
- Bottom nav mobile
- Konten: `page-header`, `stat-strip`, `hub-panel` / `hub-row` seperti modul penilaian
- Beranda ortu & admin memakai pola yang sama

## 2026-10-28n

### Rapor STS di portal (bukan leger)
- Beranda ortu menampilkan **lembar rapor STS**: kop sekolah, identitas anak, tabel nilai akhir mapel + predikat, area tanda tangan.
- Hanya setelah publikasi.
- State menunggu publikasi.
- Cetak / simpan PDF via browser.
- Chart & ranking tidak di halaman utama rapor.

## 2026-10-29a

### Rapor STS disamakan dengan cetak aplikasi penilaian
- Portal tidak lagi merata-ratakan `nilai_sts` (angka dan predikat itu bukan rapor resmi).
- Halaman `rapor-sts.html` menampilkan salinan `rapor_sts_ortu`: identitas, muatan wajib/yayasan, nilai akhir, deskripsi capaian, tanda tangan wali + kepala sekolah, stempel.
- Sumber data ditulis oleh SDM01Penilaian saat **Publikasikan** ulang. Publikasi lama tidak otomatis berubah.

## 2026-10-29b

### Login responsif saat zoom-out / layar lebar
- Perbaikan: saat browser di-zoom-out (atau layar sangat lebar), kartu login dan panel hero tetap berukuran tetap sehingga muncul banyak ruang kosong di kiri dan kanan.
- `index.html`: seluruh ukuran halaman login diubah dari `px` ke `rem`. Pada viewport ≥ 1280px, ukuran dasar (`html font-size`) ikut membesar mengikuti lebar dan tinggi viewport (`clamp(16px, min(1.25vw, 2.6vh), 80px)`). Kartu login kini selalu sekitar 28–31% lebar layar pada zoom berapa pun.
- Komponen bersama dari `style.css` (field, select, tombol, spinner) disesuaikan ke `rem` hanya di dalam `.panel-card` pada `index.html`; `style.css` tidak diubah, sehingga `beranda.html`, `admin.html`, dan `rapor-sts.html` tidak terpengaruh.
- Tampilan di bawah 1280px (termasuk mobile ≤ 900px) tidak berubah. Logika JavaScript, id elemen, dan import `firebase.js` tidak diubah.

## 2026-10-29c

### Rapor STS: hilangkan tulisan "undefined" di bawah kolom Orang Tua/Wali
- Perbaikan: di area tanda tangan rapor STS, di bawah garis `(………………………………)` kolom **Orang Tua/Wali** muncul tulisan `undefined`, sedangkan rapor cetak di aplikasi penilaian kosong.
- Penyebab: `kolom()` di `assets/rapor-resmi.js` menerima parameter `nbm`, tetapi kolom Orang Tua/Wali dipanggil tanpa argumen itu, sehingga nilainya `undefined` dan ikut disisipkan ke template string.
- `assets/rapor-resmi.js`: parameter `nbm` diberi nilai bawaan string kosong (`nbm = ''`). Kolom Orang Tua/Wali kini kosong di bawah garis, sama dengan rapor cetak aplikasi penilaian. Kolom Wali Kelas dan Kepala Sekolah tidak berubah (tetap `NBM. …` bila ada).
- `rapor-sts.html`: `?v=` import `rapor-resmi.js` dinaikkan ke `20261029q` agar browser memuat modul baru.
- Tidak ada perubahan di rumus capaian, `firebase.js`, data Firestore, maupun aplikasi penilaian (SDM01Penilaian). Tidak perlu publikasi ulang rapor.

## 2026-10-29d

### Persiapan deploy ke Firebase Hosting
- Ditambahkan konfigurasi Hosting: `firebase.json` (target `portal-ortu`, public `.`), `.firebaserc` (project `sdm01kukusan-2e735`, situs `sdm01-portal-ortu`), dan `DEPLOY.md`.
- Situs terpisah di project Firebase yang sama dengan Penilaian / Perpustakaan / Sarpras.
- Header keamanan dasar + cache control (HTML/JS/CSS no-cache, aset gambar immutable).
- Catatan: perlu penyesuaian kecil di `firestore.rules` (repo SDM01Penilaian) agar `config/akademik` bisa dibaca tanpa Auth (periode aktif). Rules tidak di-deploy dari repo ini.
- `.gitignore` ditambahkan (abaikan `.env`, `.firebase/`).

## 2026-10-29e

### Ringkasan Capaian (halaman pendamping rapor STS)
- Halaman baru `capaian.html`: penjelasan pendamping, bukan rapor resmi.
- Sumber data sama persis dengan rapor STS (`loadRaporStsResmi` / dokumen `rapor_sts_ortu`). Tidak ada angka baru, tidak menghitung ulang.
- Kartu per mapel memisahkan kalimat capaian: “Sudah dikuasai” (kalimat pertama / capaian terbaik) dan “Perlu didampingi” (kalimat sisanya).
- Daftar tindak lanjut di bagian atas: semua poin “perlu didampingi” dikumpulkan di satu tempat.
- Batang nilai akhir antar mapel milik anak itu sendiri (tanpa ranking / perbandingan dengan siswa lain).
- Penjelasan “Cara membaca nilai” memakai ambang default dari aplikasi penilaian (`LEVEL_RANGE_DEFAULT` di `akademikRumus.ts`): 90–100 Sangat Baik, 84–89 Baik, 75–83 Cukup, 0–74 Perlu Bimbingan.
- Menu ditambahkan di sidebar dan bottom-nav pada `beranda.html` dan `rapor-sts.html`, serta kartu di hub beranda.
- Lembar rapor resmi (`rapor-sts.html`, `rapor-resmi.js`) tidak diubah.

## 2026-10-29f

### Ringkasan Capaian: klasifikasi lebih selektif + tampilan ringkas
- Klasifikasi “perlu didampingi” sekarang berdasarkan awalan kalimat, bukan posisi array.
  Hanya kalimat yang berawalan “Masih memerlukan bimbingan” atau “Perlu peningkatan” yang masuk daftar perlu.
  Kalimat “Mencapai kompetensi dengan baik/sangat baik” tetap di “sudah dikuasai” meskipun berada di indeks kedua.
- Tampilan dirombak: chip ringkasan jumlah, filter (Semua / Perlu didampingi / Sudah baik), kartu lebih ringkas dengan badge status, rincian kalimat disembunyikan di dalam `<details>` agar halaman tidak panjang.
- Daftar “Perlu didampingi” di atas hanya menampilkan poin yang benar-benar perlu tindakan.
- Batang nilai hanya muncul pada filter “Semua”.
- Sumber data tetap `rapor_sts_ortu` (tidak ada angka baru). Lembar rapor resmi tidak diubah.

## 2026-10-29g

### Ringkasan Capaian: hilangkan kalimat teknis di bawah tabel nilai
- Paragraf “Ambang dari LEVEL_RANGE_DEFAULT …” di bagian “Cara membaca nilai” dihapus.
- Tabel ambang predikat tetap ada; keterangan teknis tidak perlu dibaca wali murid.

## 2026-10-29h

### Keluar dari halaman Rapor STS dan Ringkasan Capaian
- **Bug**: tombol Keluar di halaman selain Beranda tidak berfungsi. Di `rapor-sts.html` handler tidak dipasang sama sekali. Di `capaian.html` sesi dihapus tetapi tidak dialihkan ke halaman login, sehingga baru terasa keluar setelah membuka Beranda.
- **Perbaikan**: kedua halaman memakai pola yang sama dengan Beranda — `doLogout()` memanggil `logout()` lalu `location.href = 'index.html'`. Tombol sidebar, header, dan bottom-nav semuanya terhubung.

## 2026-10-29i

### Halaman login lebih ramah sebagai kesan pertama
- Hero kiri memakai latar kelas (assets/hero-kelas.png) dengan overlay biru sekolah.
- Narasi disesuaikan untuk orang tua: mendampingi perkembangan, bukan sekadar “masuk lihat nilai”.
- Pills: Rapor STS, Ringkasan capaian, Tanpa akun baru.
- Kutipan HR. Muslim di bagian bawah hero.
- Panel kanan: sapaan “Hai, Bapak dan Ibu.”, petunjuk NISN lebih jelas, tombol “Masuk & lihat perkembangan”.
- Form, id elemen, tab Orang Tua/Admin, dan logika login tidak diubah. Skala fluid (ANTIREGRESI §9) tetap.

## 2026-10-29j

### API key Firebase tidak lagi tertulis di file yang di-commit
- Config dipindah dari `assets/firebase.js` ke `assets/firebase-config.js`.
- `firebase-config.js` masuk `.gitignore`. Contoh ada di `assets/firebase-config.example.js`.
- `assets/firebase.js` hanya mengimpor config. Jika file config tidak ada atau masih placeholder, portal masuk DEMO_MODE.
- Kunci klien Firebase tetap perlu ada di mesin yang men-deploy (dan akan terlihat di browser setelah deploy). Perlindungan utama: batasi HTTP referrer kunci di Google Cloud Console + Firestore rules.
