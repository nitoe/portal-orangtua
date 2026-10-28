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
