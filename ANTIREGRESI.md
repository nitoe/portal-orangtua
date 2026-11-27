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

## §10 Parameter opsional di lembar rapor tidak boleh tercetak sebagai "undefined"

- Di `assets/rapor-resmi.js`, `kolom(peran, nama, nbm = '', tempat, opts)` dipanggil tiga kali (Orang Tua/Wali, Wali Kelas, Kepala Sekolah). Kolom Orang Tua/Wali **sengaja** tidak memberi `nbm`.
- **Wajib:** nilai bawaan `nbm = ''` jangan dihapus. Tanpa itu, template string menyisipkan teks `undefined` di bawah garis tanda tangan orang tua.
- Aturan umum: setiap parameter opsional yang disisipkan ke template HTML harus punya nilai bawaan `''` atau dibungkus `?? ''`. Jangan menyisipkan `${x}` mentah untuk nilai yang bisa kosong.
- Saat menyalin ulang `raporHtml.ts` dari SDM01Penilaian ke portal, cek ulang signature `kolom()` dan pemanggilnya; versi TypeScript tidak memperlihatkan masalah ini karena parameter tidak bernilai `undefined` di sana.
- Setelah ubah `rapor-resmi.js`, naikkan `?v=` di `rapor-sts.html` (lihat §5 dan §8).
- **Tes:** buka `rapor-sts.html` untuk anak yang sudah dipublikasikan → bagian bawah kolom Orang Tua/Wali hanya `(………………………………)` tanpa teks apa pun. Wali Kelas dan Kepala Sekolah tetap menampilkan `NBM. …`. Tes juga lewat Cetak / simpan PDF. Cari kata `undefined` di sumber iframe: tidak boleh ada.

## §11 Ringkasan Capaian adalah pendamping, bukan rapor resmi

- `capaian.html` hanya membaca dokumen `rapor_sts_ortu` yang sama dengan halaman Rapor STS (lewat `loadRaporStsResmi`).
- Jangan menambahkan perhitungan nilai baru di halaman ini. Nilai akhir dan kalimat capaian harus berasal dari dokumen yang sudah ditulis aplikasi penilaian saat Publikasikan.
- Pemisahan “Sudah dikuasai” / “Perlu didampingi” mengikuti struktur array `capaian` yang dihasilkan `kalimatCapaian()`: indeks 0 = terbaik, sisanya = perlu.
- Jangan menghidupkan kembali kode ranking atau perbandingan dengan siswa lain.
- Ambang predikat pada bagian “Cara membaca nilai” harus disalin dari `LEVEL_RANGE_DEFAULT` di `akademikRumus.ts` aplikasi penilaian. Jangan dikarang.
- Perubahan pada `rapor-sts.html` atau `rapor-resmi.js` tetap harus mengikuti aturan yang sudah ada (ANTIREGRESI §5, §8, §10). Halaman capaian tidak boleh menyentuh lembar resmi.

## §12 Klasifikasi “perlu didampingi” di Ringkasan Capaian

- Jangan mengelompokkan hanya berdasarkan indeks array `capaian` (0 = terbaik, sisanya = perlu).
- Kalimat kedua (dari TP terendah) bisa tetap positif bila level KKTP-nya 2–3.
- Klasifikasi wajib membaca awalan kalimat:
  - “Masih memerlukan bimbingan …” atau “Perlu peningkatan …” → perlu didampingi
  - “Mencapai kompetensi dengan baik/sangat baik/cukup baik …” → sudah dikuasai
- Awalan ini dihasilkan oleh `awalanCapaianTerbaik` / `awalanCapaianTerendah` di aplikasi penilaian. Jika fungsi itu berubah, sesuaikan juga `jenisKalimat()` di `capaian.html`.
- Jangan memasukkan kalimat positif ke daftar “Perlu didampingi”.

## §13 Tombol Keluar harus mengalihkan ke login di setiap halaman

- Setiap halaman yang punya tombol Keluar (`beranda.html`, `rapor-sts.html`, `capaian.html`, `admin.html`) wajib memasang handler yang:
  1. memanggil `logout()` (hapus `po_ortu_session` + signOut bila ada),
  2. lalu `location.href = 'index.html'`.
- Jangan hanya memanggil `logout()` tanpa redirect — pengguna tetap di halaman dan seolah tombol tidak bekerja.
- Jangan mengimpor `logout` tanpa memasangnya ke elemen. Cek `btnLogoutSide`, `btnLogoutTop`, dan `btnLogoutNav` bila ada.
- Setelah menambah halaman baru dengan shell yang sama, salin pola `doLogout` dari `beranda.html`.

## §14 Jangan menulis API key Firebase di file yang di-commit

- Jangan mengembalikan objek `firebaseConfig` dengan `apiKey: 'AIza…'` ke `assets/firebase.js`.
- Nilai asli hanya di `assets/firebase-config.js` (di-.gitignore). Template: `assets/firebase-config.example.js`.
- Saat clone baru: salin example → `firebase-config.js`, isi key, lalu deploy. Jangan `git add assets/firebase-config.js`.
- Kunci ini adalah kunci klien. Setelah deploy tetap terlihat di browser. Wajib batasi HTTP referrer di Google Cloud Console ke domain portal dan penilaian.
- `.env` portal tidak dipakai oleh situs statis ini. Jangan di-commit.

## §13 5 Besar Capaian — halaman terpisah, bukan di Ringkasan Capaian

- Ranking antar-siswa **tidak** ditampilkan di `capaian.html` (tetap berlaku §11).
- Fitur 5 besar hanya di halaman `lima-besar.html` + fungsi `loadLimaBesarCapaian()`.
- Sumber data: dokumen `rapor_sts_ortu` dengan `published === true`, difilter gerbang `sts_publikasi.published` untuk kelas/periode aktif.
- Metrik ranking: rata-rata `baris[].nilaiAkhir` (nilai resmi rapor), bukan rata-rata kasar `nilai_sts`.
- Portal **hanya membaca**; tidak menulis koleksi baru dan tidak mengubah aplikasi penilaian.
- Jangan mengembalikan perbandingan ranking per mapel ke Ringkasan Capaian pribadi.
- **Tes:** buka `lima-besar.html` setelah login ortu → filter kelas muncul untuk kelas yang sudah publish; kartu peringkat 1 punya animasi glow mahkota; jika ananda di 5 besar, label “Ananda” tampil. `capaian.html` tetap tanpa daftar ranking teman sekelas.

## §15 Halaman Try Out TKA: selisih nilai hanya apel-dengan-apel

- Tahap I hanya memuat BI + Matematika; tahap II–V memuat BI + Matematika + IPA (aturan rata-rata ranking di LMS, §106.3). Jadi **rata-rata tahap I tidak sebanding dengan rata-rata tahap II**.
- Selisih rata-rata (▲/▼) hanya boleh ditampilkan bila dua tahap memiliki himpunan mapel bernilai yang sama (`sidikMapel`). Selisih per mapel boleh, dibanding tahap sebelumnya yang punya nilai mapel itu.
- Jangan menampilkan selisih hanya dengan warna: wajib simbol ▲/▼ + angka, dan legenda teks (tooltip `title` tidak muncul di HP).
- Portal tetap **hanya membaca snapshot** `lms_tka_*` via `loadTryOutTkaAnak`. Jangan menambah perhitungan nilai/peringkat baru di halaman ini; selisih adalah satu-satunya turunan yang diizinkan.
- Semua teks dinamis (nama tahap, nama siswa, materi, catatan wali) wajib lewat `escapeHtml`. Catatan wali memakai `white-space:pre-line`, jangan diganti `innerHTML` mentah.
- Kelas CSS halaman ini berawalan `.to-*` dan hanya berada di `<style>` `tryout-tka.html`; `style.css` bersama tidak diubah. Jangan memakai kembali awalan lama `.tka-*` (tidak dipakai halaman lain).
- Pemilih tahap hanya berupa `<button>` untuk tahap yang dibuka; tahap terkunci berupa `<div>` ber-`aria-label`. Jangan menjadikan tahap terkunci bisa diklik.
- **Tes:** (1) akun 6A dengan tahap I dan II dibuka: tile II tidak menampilkan selisih rata-rata, kartu BI/MTK menampilkan ▲/▼; (2) tanpa tahap dibuka: muncul empty state; (3) lebar 375px: label hero tidak terpotong dan 5 tile muat tanpa scroll horizontal; (4) kelas non-6: pesan «Khusus orang tua kelas 6».
- Rata-rata (hero, tile, kartu, 10 besar, selisih rata-rata) wajib lewat `fmtRata` (dua desimal, `id-ID`). Jangan kembali memakai `fmtNilai` untuk rata-rata; `fmtNilai` hanya untuk nilai per mapel.

## §16 Menu sidebar, bottom-nav, dan tombol Keluar harus identik di semua halaman ortu

- Halaman ortu: `beranda`, `rapor-sts`, `capaian`, `tryout-tka`, `lima-besar`. Urutan **sidebar**: Beranda, Rapor STS, Ringkasan Capaian, Try Out TKA, 5 Besar Capaian. Urutan **bottom-nav**: Beranda, Rapor, Capaian, TKA, 5 Besar, Keluar.
- Menambah/mengubah/menghapus item menu = **ubah di kelima halaman sekaligus**. Hanya `class="active"` yang berbeda per halaman. (`admin.html` punya menu sendiri dan tidak termasuk.)
- Tombol Keluar sidebar wajib `class="side-logout"` + `id="btnLogoutSide"`. Jangan memakai kelas lain (`btn-logout` tidak ada di CSS → tampil sebagai tombol bawaan browser).
- Setiap halaman wajib memasang handler untuk `btnLogoutSide`, `btnLogoutTop`, dan `btnLogoutNav` (lihat §13).
- Bottom-nav berisi 6 item; jangan menambah item ke-7 tanpa menguji lebar 320px.
- **Tes:** buka tiap halaman lalu pindah ke halaman lain lewat sidebar dan bottom-nav; menu dan tombol Keluar tidak boleh berubah selain item aktif. Cek lebar 320, 360, dan ≥768px.

## §17 Peringkat TKA: jangan tampilkan peringkat yang saling bertentangan

- Peringkat ananda dan tabel 10 besar berasal dari dua dokumen. `loadTryOutTkaAnak` WAJIB memeriksa kesinkronannya (`rankingId`; cadangan: jumlah peserta, posisi ananda di 10 besar) dan mengosongkan peringkat + 10 besar bila tidak cocok. Jangan menampilkan keduanya "apa adanya".
- Peringkat selalu gabungan 6A & 6B. Bila `sementara === true`, label «sementara» dan keterangan «baru n dari N» wajib tampil.
- Rata-rata tetap lewat `fmtRata` (§15).
- **Tes:** (1) dokumen ananda peringkat 6 padahal tidak ada di 10 besar → tampil «sedang diperbarui»; (2) `rankingId` sama → peringkat tampil normal; (3) `sementara` → label tampil.

- §17 butir 4 (2026-11-21b): bila peringkat ananda tidak sinkron, sembunyikan HANYA peringkat ananda. Tabel 10 besar (`lms_tka_peringkat`) tidak boleh ikut dikosongkan — itu dokumen terbaru dan tetap benar. **Tes:** dokumen ananda basi (peringkat 6, tidak ada di 10 besar) → kartu «sedang diperbarui», tabel 10 besar tetap tampil.

## §18 5 Besar Capaian: aturan peringkat sama dengan Leger STS

- `loadLimaBesarCapaian` meranking dari JUMLAH nilai akhir mapel (bukan rata-rata terbulat), hanya siswa dengan jumlah mapel terbanyak di kelas; seri = peringkat sama. Siswa yang belum lengkap tidak diperingkat dan jumlahnya ditampilkan (`infoKelas`).
- Aturan ini harus identik dengan Leger STS (repo SDM01Penilaian, ANTIREGRESI §Peringkat-STS). Ubah keduanya sekaligus.
- **Tes:** kelas dengan satu siswa kehilangan 1 mapel → siswa itu tidak masuk daftar walau rata-ratanya tertinggi; keterangan «n siswa belum diperingkat» tampil.

## §19 Riwayat Tugas: hanya nilai dan status, hanya membaca salinan `lms_tugas_hasil_ortu`

- `riwayat-tugas.html` + `loadRiwayatTugasAnak` hanya membaca `lms_tugas_hasil_ortu` (`siswaId == anak`, `published == true`). Jangan membaca `lms_nilai_tugas`, `lms_pengumpulan`, atau `lms_tugas` dari portal, dan jangan membuka rules koleksi itu untuk guest.
- Hanya tampilkan nilai, predikat, status, judul, mapel, tanggal. Jangan menambah catatan guru, poin perbaikan, bukti, rata-rata, atau perbandingan antar siswa. Portal tidak menghitung nilai apa pun (sejalan dengan §8, §11, §15).
- Label status ada di `STATUS` pada `riwayat-tugas.html` (`dinilai`, `perbaikan`, `belum`). Status tak dikenal dianggap `belum`. Bila LMS menambah status, ubah juga `loadRiwayatTugasAnak` dan `STATUS`. Status selalu berupa teks (bukan hanya warna).
- Semua teks dinamis wajib lewat `escapeHtml` (judul tugas ditulis guru).
- Halaman ini bukan item menu baru: dibuka dari baris hub di `beranda.html`. Sidebar dan bottom-nav (§16) JANGAN ditambah item ke-7; bottom-nav sudah berisi 6 item. Halaman memakai menu yang identik dengan «Beranda» aktif.
- Kelas CSS halaman ini berawalan `.rt-*` dan hanya di `<style>` `riwayat-tugas.html`; `style.css` bersama tidak diubah.
- `?v=` firebase.js dinaikkan hanya di `beranda.html` dan `riwayat-tugas.html` (`20261126a`) karena hanya keduanya yang memakai ekspor baru. Perubahan firebase.js ini murni menambah ekspor, jadi halaman lain yang masih memakai `?v=` lama tidak terpengaruh. Bila suatu saat ekspor lama diubah, naikkan `?v=` di semua halaman (§5).
- **Tes:** (1) belum ada yang dibagikan → «Belum ada tugas yang dibagikan guru.», Beranda dan halaman lain normal; (2) guru membagikan → tugas muncul dengan nilai dan status; (3) guru menarik → tugas hilang; (4) dua mapel → filter muncul, satu mapel → filter tersembunyi; (5) lebar 320, 360, ≥768px tanpa scroll horizontal; (6) judul tugas berisi `<b>` tampil sebagai teks; (7) tombol Keluar di sidebar, header, dan bottom-nav kembali ke login (§13).

## §20 Menu Try Out TKA hanya untuk kelas 6

- Menu «Try Out TKA» (sidebar `#navTryOutTka`, bottom-nav `#navTryOutTkaBottom`, baris hub Beranda `#hubTryOutTka`) **wajib tersembunyi secara default** di HTML (`class="hidden"`). JS hanya *menampilkan* (`showTkaMenu` / `applyTkaVisibility`) bila kelas `6A`/`6B`. Jangan `hide` setelah render — itu menyebabkan FOUC (menu muncul sebentar lalu hilang).
- Pengecekan: `/^6[AB]$/i.test(String(anak.kelas || ''))` setelah `loadSiswaByIds` (atau fallback dari session).
- Fungsi `hideTkaMenu()` dipanggil di boot setiap halaman yang memuat menu: `beranda`, `rapor-sts`, `capaian`, `lima-besar`, `riwayat-tugas`, `tryout-tka`.
- Jangan mengandalkan peringatan di dalam halaman saja — menu tidak boleh muncul sama sekali untuk non-kelas 6.
- Empty-state di `tryout-tka.html` (jika URL dibuka langsung) harus netral (bukan banner kuning/oranye) dan menyediakan tautan kembali ke Beranda.
- **Tes:** login sebagai orang tua kelas 5A → sidebar dan bottom-nav tidak menampilkan TKA; baris «Hasil Try Out TKA» di Beranda hilang. Login kelas 6A → menu tetap ada. Buka `tryout-tka.html` langsung dari kelas non-6 → kartu netral + tombol kembali, tanpa menu TKA.

## §21 Menu STS digabung; SAS placeholder; tab bar wajib

- Sidebar hanya punya: **Beranda**, **STS**, **SAS** (disabled), **Try Out TKA** (conditional kelas 6). Jangan mengembalikan link terpisah «Rapor STS» / «Ringkasan Capaian» / «5 Besar Capaian» di sidebar atau bottom-nav.
- Ketiga halaman STS (`rapor-sts.html`, `capaian.html`, `lima-besar.html`) **wajib** menampilkan tab bar `.sts-tabs` di atas konten (`Rapor | Capaian | 5 Besar`), di **luar** `#mainContent` agar tidak terhapus saat JS mengisi konten.
- Menu STS di sidebar mengarah ke `rapor-sts.html` (tab default = Rapor). Kelas `active` pada side-link STS dipakai di ketiga halaman tersebut.
- Menu **SAS** memakai kelas `side-link-disabled` + `aria-disabled="true"`; jangan diaktifkan sebelum halaman SAS siap.
- Bottom-nav: Beranda, STS, TKA (id `navTryOutTkaBottom`), Keluar. Jangan menambah kembali item Capaian / 5 Besar di bottom-nav.
- **Tes:** (1) sidebar hanya 3–4 item (TKA hilang di non-kelas 6); (2) buka Rapor → tab Rapor aktif, klik Capaian → pindah halaman, tab Capaian aktif, side-link STS tetap aktif; (3) SAS tidak bisa diklik; (4) bottom-nav tidak overflow di 360px.

## §22 Menu Riwayat Belajar + urutan sidebar

- Sidebar wajib berurutan: **Beranda → STS → SAS (disabled) → Riwayat Belajar → Try Out TKA (hidden by default)**.
- «Riwayat Belajar» (`#navRiwayatBelajar`) mengarah ke `riwayat-tugas.html` untuk tahap ini. Jangan menghapus item ini dari sidebar/bottom-nav.
- Bottom-nav: Beranda · STS · Riwayat · TKA (hidden by default) · Keluar.
- Saat halaman `riwayat-tugas.html` aktif, side-link dan bottom-nav Riwayat memakai kelas `active`.
- **Tes FOUC TKA:** hard-refresh sebagai orang tua kelas 5A → menu TKA tidak pernah terlihat (bahkan 1 frame). Kelas 6A → menu TKA muncul tanpa kedipan.
- **Tes Riwayat:** klik «Riwayat Belajar» di sidebar → `riwayat-tugas.html`, item menu aktif.

## §23 Template shell HTML wajib identik

- Struktur shell (sidebar, top-header, bottom-nav, id elemen) **wajib sama** di: `beranda`, `rapor-sts`, `capaian`, `lima-besar`, `riwayat-tugas`, `tryout-tka`.
- ID yang tidak boleh diubah/dihapus: `sideNama`, `avatarInisial`, `tanggalHari`, `btnLogoutSide`, `btnLogoutTop`, `btnLogoutNav`, `navTryOutTka`, `navTryOutTkaBottom`, `navRiwayatBelajar`, `navRiwayatBelajarBottom`.
- Try Out TKA selalu `class="… hidden"` di HTML; tampilkan hanya lewat `applyTkaVisibility` dari `assets/shell-nav.js` (jangan salin fungsi hide/show ke halaman).
- CSS `.side-link-disabled` dan `.sts-tabs` hanya di `assets/style.css`, bukan di `<style>` halaman.
- Saat menambah halaman ortu baru: salin shell dari `beranda.html`, set `active` pada side-link/bottom-nav yang sesuai, impor `applyTkaVisibility`.
- **Tes:** buka keenam halaman → sidebar dan bottom-nav sama urutannya; hard-refresh kelas 5A → TKA tidak kedip; kelas 6A → TKA muncul; pindah STS antar tab → side-link STS tetap aktif.

## §24 Beranda sebagai wajah portal

- `beranda.html` wajib memakai `initShell` dari `assets/shell-nav.js` (tanggal, logout, TKA dari session). Jangan mengembalikan wiring logout/TKA manual yang menduplikasi shell.
- Elemen identitas: `#salamHari`, `#salamNama`, `#childAv`, `#profilNama`, `#profilMeta`, `#statusCard` / `#statStatus` / `#statPeriode`, hub STS + capaian + 5 besar + (TKA conditional) + riwayat tugas.
- Status rapor: kelas `is-ok` / `is-wait` / `is-neutral` pada `#statusCard` harus selaras dengan badge hub (`badge-ok` / `badge-pending`).
- **Tes:** login ortu → salam sesuai waktu; kartu anak terisi; status STS hijau jika published, kuning jika belum; menu TKA tetap tanpa FOUC (§20/§22/§23).

## §25 Empty state + initShell di halaman STS/Riwayat

- Halaman `rapor-sts`, `capaian`, `lima-besar`, `riwayat-tugas` wajib memanggil `initShell()` (bukan hanya `applyTkaVisibility` manual + wiring logout sendiri).
- Empty/waiting memakai kelas `.empty-state` dari `assets/style.css` (opsional `.empty-state-icon` / `.wait`). Jangan mengembalikan `.wait-box` generik untuk state kosong utama; countdown jadwal rilis STS boleh tetap di dalam empty-state.
- Setelah `loadSiswaByIds`, panggil lagi `applyTkaVisibility(anak.kelas)` agar kelas aktual menang.
- **Tes:** (1) rapor belum publish → empty-state + teks ramah + link Beranda; (2) ada jadwal → countdown tampil; (3) riwayat tanpa tugas → empty-state «Belum ada tugas»; (4) hard-refresh non-kelas 6 → TKA tidak kedip.

## §26 Overhaul visual — fondasi CSS + Beranda

- `assets/style.css` overhaul: sidebar gelap (`--muh-900`/`--muh-800`), `.app-shell` max-width + radius desktop, token bayangan/radius baru. Jangan mengembalikan sidebar putih datar tanpa keputusan desain ulang.
- Beranda: struktur hero (`.home-hero`), `.status-card`, `.feature-grid` / `.feature-card`. ID JS wajib tetap ada (`salamHari`, `salamNama`, `childAv`, `profilNama`, `statusCard`, `stsBadge`, `hubTryOutTka`, dll.).
- Cache-bust: `style.css?v=20261126h` di Beranda; naikkan `?v=` di halaman lain saat mereka ikut overhaul.
- **Tes:** desktop → sidebar gelap + shell berbingkai; mobile → bottom-nav; kelas 5A → TKA tetap hidden tanpa FOUC; rapor published → status hijau + badge Tersedia.

## §27 Densitas & lebar konten

- Di desktop (≥900px) `.main-inner` **tidak** dibatasi 720px di tengah — konten mengisi kolom utama agar tidak ada void putih besar.
- `.stat-strip` default 2 kolom; gunakan `.stat-strip--2` bila hanya dua metrik. Jangan menumpuk metrik vertikal satu-satu dengan margin besar.
- Padding `.main-body` mobile ~12–16px; desktop ~18–22px (bukan 28px+ yang membuat konten “mengambang”).
- **Tes PC:** buka Riwayat → daftar tugas hampir full lebar kolom; sidebar gelap + konten sejajar tanpa lautan putih.
- **Tes mobile (~390px):** filter+stat tidak overflow; baris tugas stack (judul lalu nilai/badge); bottom-nav tidak menutupi tombol terakhir (padding-bottom body ≥88px).

## §28 Full-bleed — jangan center shell

- Dilarang mengembalikan `max-width` + `margin: 0 auto` pada `.app-shell` / `.app-frame` yang membuat portal mengambang di tengah saat zoom-out atau monitor lebar.
- Layout: sidebar tetap lebar tetap; `.main-col` + `.main-inner` mengisi sisa viewport (`max-width: none` kecuali `.main-inner--narrow` sengaja).
- **Tes:** zoom browser 67% atau 50% di monitor lebar → konten tetap menempel kiri (setelah sidebar), tidak mengerucut ke tengah layar.

## §29 Sidebar pin bawah + salam

- Sidebar desktop: `min-height: 100vh` + `.sidebar-footer` membungkus hero-banner + tombol Keluar dengan `margin-top: auto`. Jangan biarkan blok «Masuk sebagai» mengambang di tengah tinggi nav.
- Salam Beranda wajib memuat **Assalamu'alaikum** (sekolah Islam). Jangan menampilkan panggilan «Orang» dari string sesi «Orang tua · …».
- **Tes:** viewport tinggi / konten pendek → sidebar gelap sampai bawah layar; footer sidebar di dasar. Login dengan nama sesi berisi «Orang tua · Fairel…» → judul «Selamat …, Fairel» (atau nama anak), bukan «Orang».

### §29b Sidebar fixed (wajib)

- Desktop (≥900px): `.sidebar` **wajib** `position: fixed; left: 0; top: 0; bottom: 0; height: 100dvh` (bukan hanya sticky/min-height). `.main-col` wajib `margin-left: var(--sidebar-w)`.
- **Tes:** scroll atau konten pendek → tidak ada strip putih di bawah tombol Keluar; kolom kiri gelap sampai tepi bawah jendela browser.

## §30 Riwayat Tugas: tenggat & status pengumpulan (2026-11-27)

1. Sumber data tetap **hanya** `lms_tugas_hasil_ortu` yang `published == true`. Jangan query `lms_tugas` / `lms_pengumpulan` dari portal (rules tidak membuka akses guest).
2. Field baru opsional: `tenggat` (timestamp|null), `statusKumpul` (`belum_kumpul`|`sudah_kumpul`). Dokumen lama tanpa field ini wajib tetap tampil (fallback label «Belum ada nilai»).
3. Rules `hasOnly` di `lms_tugas_hasil_ortu` harus memuat kedua field; deploy rules **sebelum** LMS menulis field baru.
4. Portal tidak menghitung nilai; tenggat relatif hanya untuk tampilan. Jangan menampilkan catatan guru / bukti.
5. **Tes:** demo mode menampilkan 5 baris dengan campuran status; filter tab «Perlu perhatian» mengisolasi belum kumpul + perbaikan; chip tenggat berwarna untuk lewat/hari ini/segera.

## §31 Header: logout selalu terlihat; jangan header transparan di atas body merek (2026-11-27)

1. `btnLogoutTop` **jangan** memakai kelas `mobile-only`. Di desktop sidebar punya Keluar, tetapi avatar inisial di pojok kanan tampak seperti tombol — pengguna mengkliknya. Logout header harus selalu ada dan di-wire oleh `initShell` (§13).
2. `.top-header` wajib **latar solid** (`var(--surface-2)` atau setara). Jangan `rgba(..., 0.9)` + `backdrop-filter` di atas `body { background: var(--muh-900) }` (desktop) — menghasilkan garis/rembesan ungu di tepi atas saat sticky.
3. Avatar inisial (`.avatar-btn`) **bukan** kontrol aksi; jangan memasang handler logout di avatar. Logout = `#btnLogoutTop` / sidebar / bottom-nav.
4. **Tes:** desktop ≥900px buka Beranda dan Riwayat → ikon keluar di header terlihat dan mengalihkan ke `index.html`; tidak ada garis ungu di atas header saat scroll.

