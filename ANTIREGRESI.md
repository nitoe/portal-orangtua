# Antiregresi — Portal Orang Tua

Aturan agar perbaikan tidak rusak lagi. Append-only.

## §1 Nama ekspor auth harus sinkron dengan import di halaman

- `index.html` (dan halaman lain) mengimpor nama fungsi dari `assets/firebase.js`.
- **Wajib:** setiap rename export di `firebase.js` harus diikuti ubah import di semua halaman, **atau** sediakan alias export.
- Saat ini dipakai:
  - `loginOrangtua` dan alias `loginOrangtuaBySiswa`
  - `loginAdmin`
  - `loadKelasDanSiswa`
  - `loadSiswaByIds`
  - `loadNilaiStsPublished`
  - `logout`, `currentSession`, `onAuthChange`, `terjemahkanErrorLogin`, `DEMO_MODE`
- **Tes:** buka login → Console tidak boleh ada `does not provide an export named …`. Tab Orang Tua / Admin harus bisa diganti.

## §2 CSS hero tidak boleh layer kosong

- Jangan menulis `background: gradient, ;` atau `url(...)` ke file yang tidak ada.
- Setelah menghapus aset gambar, **sekaligus** bersihkan deklarasi `background`.
- **Tes:** panel kiri login harus hijau tua jelas, bukan abu/pucat.

## §3 Firebase project = SDM01Penilaian

- Hanya project **`sdm01kukusan-2e735`**.
- Jangan mengembalikan config `sdm01-penilaianv2` / key `AIzaSyA52…`.
- Admin = akun yang sudah ada di Auth + `users.role == 'admin'` project tersebut.
- **Tes:** request `identitytoolkit` memakai key `AIzaSyBvVul…`.

## §4 Guest tidak boleh mengandalkan list koleksi `siswa`

- Rules menolak `list` siswa tanpa role guru/admin.
- `loadKelasDanSiswa` harus catch permission-denied dan return `{}`, bukan melempar uncaught yang merusak UX.
- Dropdown ortu boleh kosong sampai ada solusi roster publik / Cloud Function.

## §5 Cache modul ES

- Setelah ubah `firebase.js`, naikkan query `?v=` di import `index.html` (dan halaman lain) agar browser tidak memakai modul lama.

## §6 Signature pemanggilan auth harus konsisten

- `loginAdmin` dan `loginOrangtua` / `loginOrangtuaBySiswa` menerima **satu objek** `{ email, password }` / `{ siswaId, password }`.
- Jangan memanggil `loginAdmin(email, password)` (dua argumen string) — `email` akan jadi string, destructuring gagal, muncul error "Isi email dan password admin" padahal form sudah terisi.
- Implementasi `loginAdmin` saat ini menerima **kedua gaya** (objek atau dua argumen) agar tahan regresi; tetap utamakan gaya objek di pemanggil.
- **Tes:** isi email+password admin → submit → tidak muncul error kosong; request Auth jalan.

## §7 Panel admin & field users orangtua

- Field yang diubah admin di portal: `status` (`pending`|`approved`), `aktif` (bool), `anakIds` (array id dokumen `siswa`), opsional `nama`.
- Jangan menulis `role` dari panel ini kecuali alur khusus teruji di rules.
- Reset password: hanya **kirim email reset** (`sendPasswordResetEmail`). Set password langsung butuh Admin SDK / Cloud Function — jangan pura-pura mengubah password lewat client SDK.
- Query `users where role == orangtua` dan `list` koleksi `siswa` mengandalkan sesi **admin** yang valid.
- **Tes:** login admin → lihat daftar → setujui pending → hubungkan ≥1 anak → ortu dengan status approved + anakIds bisa login (setelah akun Auth ada).

## §8 Rapor STS resmi bukan rata-rata nilai_sts

- Jangan mengembalikan tabel predikat dari `loadNilaiStsPublished` ke halaman rapor orang tua. Angka itu rata-rata kasar per mapel, bukan nilai akhir rapor (bobot cakupan STS) dan tidak punya capaian kompetensi.
- Satu-satunya sumber tampilan rapor: `loadRaporStsResmi` → koleksi `rapor_sts_ortu` yang `published == true` **dan** gerbang `sts_publikasi` untuk kelas/tahun/semester yang sama juga `published == true`.
- HTML/CSS lembar ada di `assets/rapor-resmi.js` (salinan `raporHtml.ts`). Jangan mengubah rumus capaian di portal. Ubah rumus hanya di aplikasi penilaian, lalu publikasikan ulang.
- Setelah ubah `firebase.js` atau `rapor-resmi.js`, naikkan `?v=` di `rapor-sts.html`.
- **Tes:** setelah wali menekan Publikasikan ulang, rapor anak di portal memuat NISN, fase, tahun pelajaran, kolom Capaian Kompetensi, nama wali + NBM, nama kepsek + stempel. Sebelum dipublikasikan ulang, halaman tidak boleh menampilkan tabel rata-rata lama seolah-olah itu rapor resmi.

## §9 Login harus fluid (rem + skala viewport), bukan px tetap

- Ukuran di `index.html` memakai `rem`. Jangan kembalikan `px` / `max-width` tetap untuk `.hero-inner`, `.panel-card`, font, padding, atau ikon di halaman login: saat browser di-zoom-out viewport melebar dan kartu tampak kecil dengan ruang kosong di kiri-kanan.
- Skala berasal dari `html { font-size: clamp(16px, min(1.25vw, 2.6vh), 80px) }` di dalam `@media (min-width: 1280px)` pada `index.html`. Jangan memindahkannya ke `assets/style.css` karena `beranda.html`, `admin.html`, dan `rapor-sts.html` ikut terdampak.
- Override komponen bersama (`.field`, `select`, `.btn-primary`, `.spinner`, `.toggle-visibility`) harus tetap di-scope `.panel-card` agar `style.css` tidak perlu diubah. Komponen baru di login harus ikut memakai `rem`.
- Media query (`max-width: 900px`, `min-width: 768px`, `min-width: 1280px`) tetap dalam `px`. Jangan diubah ke `rem`/`em`.
- Batas tinggi (`vh`) pada rumus jangan diperketat: viewport umum berbentuk lebar-pendek (mis. 1909×871) dan batas `vh` yang terlalu kecil membuat skala jatuh ke 16px sehingga perbaikan tidak terlihat. Kartu + padding setinggi ±36rem harus tetap muat di tinggi viewport.
- **Tes:** buka login, uji juga di viewport 1909×871, zoom browser 100%, 67%, 50%, 33%, 25%. Kartu login harus selalu sekitar 28–31% lebar layar (viewport ≥ 1280px), tanpa scroll horizontal. Cek juga lebar 375px (mobile brand muncul, hero tersembunyi), tab Admin bisa dibuka, dan toast tampil. Console tidak boleh ada error JavaScript.
