# Changelog — Portal Orang Tua

## 2026-10-28d

### Perbaikan
- **loginAdmin signature mismatch:** `index.html` memanggil `loginAdmin(email, password)` sementara `firebase.js` mendestructure `{ email, password }` → selalu dianggap kosong.
  - Perbaikan: pemanggil memakai objek; fungsi menerima kedua gaya (objek atau 2 argumen).

## 2026-10-28c

### Perbaikan regresi
- **Import putus:** alias `loginOrangtuaBySiswa`.
- **Hero pucat:** gradient solid tanpa layer kosong.
- **Permissions:** soft-fail `loadKelasDanSiswa`.

### Firebase
- Project: `sdm01kukusan-2e735` (SDM01Penilaian).

