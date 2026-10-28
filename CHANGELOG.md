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
