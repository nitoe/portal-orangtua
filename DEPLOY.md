# Deploy — Portal Orang Tua

Portal statis (HTML + ES modules) ditayangkan di **Firebase Hosting** sebagai situs terpisah di project yang sama (`sdm01kukusan-2e735`).

Hasil sementara setelah deploy: `https://sdm01-portal-ortu.web.app`

## Prasyarat

- Node.js 20+
- Firebase CLI: `npm install -g firebase-tools`
- Sudah `firebase login` (akun yang punya akses ke project `sdm01kukusan-2e735`)

## 1. Buat situs Hosting baru (sekali saja)

```bash
firebase hosting:sites:create sdm01-portal-ortu --project sdm01kukusan-2e735
```

Bila nama sudah dipakai, ganti nama dan sesuaikan di `.firebaserc`.

## 2. Terapkan target (sekali saja, atau bila belum)

Dari root repo portal-orangtua:

```bash
firebase use sdm01kukusan-2e735
firebase target:apply hosting portal-ortu sdm01-portal-ortu
```

(`.firebaserc` sudah menyimpan pemetaan ini.)

## 3. Deploy

```bash
firebase deploy --only hosting:portal-ortu
```

Atau cukup:

```bash
firebase deploy --only hosting
```

## 4. Domain khusus (opsional, disarankan)

Di Firebase Console → Hosting → situs `sdm01-portal-ortu` → **Add custom domain**.

Contoh: `ortu.sdmuhammadiyah01kks.sch.id` atau `portal.sdmuhammadiyah01kks.sch.id`.

Catat catatan DNS di hPanel Hostinger (sama seperti penilaian/perpustakaan). Sertifikat HTTPS biasanya aktif dalam beberapa jam.

## 5. Authorized domains (untuk login admin)

Firebase Console → Authentication → Settings → **Authorized domains** → tambahkan:

- `sdm01-portal-ortu.web.app`
- domain khusus yang dipakai (mis. `ortu.sdmuhammadiyah01kks.sch.id`)

Tanpa ini, login admin (email/password) dari domain baru akan ditolak.

## 6. Firestore rules (di repo SDM01Penilaian)

Rules sudah membuka:

- `siswa` — `get` + `list` dengan `|| true` (dropdown kelas/nama + verifikasi NISN)
- `nilai_sts` — `read` dengan `|| true`
- `sts_publikasi` — `read: if true`
- `rapor_sts_ortu` — `read: if true`

**Perlu penyesuaian kecil** agar periode aktif terbaca tanpa Auth:

Di `firestore.rules` (repo SDM01Penilaian), ubah blok:

```
match /config/akademik {
  allow read: if isGuru();
  allow write: if isAdmin();
}
```

menjadi:

```
match /config/akademik {
  // Portal orang tua (tanpa Auth) membaca semesterAktif + tahunAjaran.
  // Dokumen hanya berisi periode + profil sekolah (bukan data siswa).
  allow read: if isGuru() || true;
  allow write: if isAdmin();
}
```

Lalu deploy rules **hanya dari repo SDM01Penilaian**:

```bash
npm run deploy:rules
# atau
firebase deploy --only firestore:rules
```

**Jangan** men-deploy rules dari repo portal-orangtua.

## 7. Uji

1. Buka URL hosting → halaman login muncul.
2. Pilih kelas → nama anak → masukkan NISN yang benar → masuk ke beranda.
3. Jika ada rapor STS yang sudah dipublikasikan, kartu “Nilai yang dibagikan” aktif.
4. Login admin (akun admin penilaian) berhasil.
5. Console browser tidak ada error permission-denied pada koleksi di atas.

## Catatan

- Situs ini **bukan SPA**. Setiap halaman (`index.html`, `beranda.html`, `rapor-sts.html`, `admin.html`) dilayani langsung.
- Cache HTML/JS/CSS di-set `no-cache` agar pembaruan cepat terlihat; aset gambar di `/assets/` di-cache panjang.
- Config Firebase sudah dihardcode di `assets/firebase.js` (sama dengan project penilaian).
