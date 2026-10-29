# Changelog — Portal Orang Tua

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
