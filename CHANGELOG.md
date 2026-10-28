# Changelog — Portal Orang Tua

## 2026-10-28e

### Fitur — Panel admin
- Daftar akun `role == orangtua` (pending / disetujui / nonaktif)
- Statistik total, pending, aktif
- Cari nama/email + filter status
- **Setujui** / tarik persetujuan / nonaktifkan / aktifkan
- **Hubungkan anak** (multi-select siswa → `anakIds`)
- **Email reset password** via `sendPasswordResetEmail` (bukan set password langsung)

### API baru di `firebase.js`
- `listAkunOrangtua`, `updateAkunOrangtua`, `listSemuaSiswa`, `kirimResetPasswordOrangtua`

## 2026-10-28d
- Perbaikan signature `loginAdmin` (objek vs 2 argumen)

## 2026-10-28c
- Alias `loginOrangtuaBySiswa`, hero gradient, soft-fail roster
