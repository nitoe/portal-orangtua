# Portal Orang Tua — SD Muhammadiyah 01 Kukusan

Portal khusus **orang tua** untuk melihat nilai STS anak setelah dipublish oleh guru kelas.

Berbagi **Firebase project yang sama** dengan aplikasi Penilaian (`sdm01-penilaianv2`), sehingga data siswa & nilai tetap satu sumber kebenaran.

## Siapa yang bisa masuk

| Peran | Cara login | Akses |
|-------|------------|--------|
| **Orang Tua** | Pilih kelas → pilih nama anak → masukkan password | Hanya data anak yang terhubung & nilai yang sudah dipublish |
| **Admin** | Email + password (akun admin yang sama dengan aplikasi penilaian) | Kelola akun orang tua, reset password, setujui linking anak |

Tidak ada login siswa atau guru di portal ini.

## Struktur

```
portal-orangtua/
├── index.html          # Halaman masuk (Orang Tua | Admin)
├── beranda.html        # Dashboard orang tua (placeholder)
├── admin.html          # Panel admin portal (placeholder)
├── assets/
│   ├── style.css       # Design tokens + komponen (selaras penilaian-v2)
│   ├── firebase.js     # Auth + Firestore (project yang sama)
│   └── logo.png        # Logo sekolah (salin dari penilaian-v2)
├── css/                # (opsional override)
└── js/
```

## Login Orang Tua (mekanisme)

1. Orang tua memilih **kelas**.
2. Dropdown **nama siswa** terisi otomatis dari data kelas tersebut.
3. Masukkan **password** akun orang tua yang terhubung ke siswa itu.
4. Setelah login berhasil, orang tua bisa:
   - Melihat nilai STS yang sudah dipublish
   - Mengganti password sendiri
5. Lupa password → hubungi admin (admin bisa reset dari panel).

Akun orang tua dibuat / di-link oleh **admin** (role `admin` dari aplikasi penilaian). Satu akun orang tua bisa terhubung ke satu atau beberapa anak (`anakIds`).

## Menjalankan lokal

```bash
npx serve .
# atau
python3 -m http.server 8080
```

Buka `http://localhost:8080`.

## Firebase

Isi `assets/firebase.js` dengan config project yang sama dengan penilaian-v2 (sudah diisi jika kamu menyalin dari sana).

Selama config masih placeholder, aplikasi berjalan dalam **DEMO_MODE** (data simulasi di localStorage).

## Status

- [x] Halaman masuk (UI)
- [ ] Auth orang tua (filter kelas + nama + password) tersambung Firebase
- [ ] Dashboard nilai STS
- [ ] Ganti password orang tua
- [ ] Panel admin: kelola akun ortu, reset password, approve linking
