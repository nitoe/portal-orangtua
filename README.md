# Portal Orang Tua — SD Muhammadiyah 01 Kukusan

Portal terpisah dari aplikasi penilaian (`nitoe/SDM01Penilaian`), project Firebase **`sdm01kukusan-2e735`**.

## Login orang tua (tanpa daftar akun)

1. Pilih **kelas**
2. Pilih **nama anak**
3. Masukkan **NISN** anak (field `nisn` di koleksi `siswa`; jika kosong, fallback `nis` / `nipd`)

Tidak ada akun Firebase Auth untuk orang tua. Sesi disimpan di `localStorage` (`po_ortu_session`).

## Login admin

Email + password akun **admin** yang sama dengan aplikasi penilaian.

## Design

Mengikuti `DESIGN.md` SDM01Penilaian: merek `#313083`, permukaan datar, Inter, tanpa gradient.

## Firestore rules (wajib untuk login ortu)

Guest harus bisa **list/get** koleksi `siswa` agar dropdown kelas/nama dan verifikasi NISN berjalan.

**Risiko:** klien bisa membaca field `nisn`. Mitigasi ideal: Cloud Function verifikasi NISN (tidak mengirim NISN ke browser untuk daftar). Untuk tahap ini, pastikan hanya perangkat/orang tua yang dimaksud yang memakai portal.

Contoh longgar (hanya jika Anda menerima risikonya):

```
match /siswa/{id} {
  allow get, list: if true; // portal ortu — pertimbangkan CF di masa depan
  allow write: if isAdmin();
}
```

Atau batasi domain hosting + App Check.

Nilai STS: ortu hanya melihat data yang sudah `published` (lihat `loadNilaiStsPublished`).

## Demo offline

```js
localStorage.setItem('po_force_demo', '1')
```

Password demo: NIS siswa di seed, atau `ortu123`.
