/**
 * firebase.js — Portal Orang Tua
 * SD Muhammadiyah 01 Kukusan
 *
 * Memakai Firebase project yang SAMA dengan SDM01Penilaian
 * (nitoe/SDM01Penilaian → project sdm01kukusan-2e735).
 *
 * Admin login = akun admin yang sudah ada di aplikasi penilaian
 * (https://penilaian.sdmuhammadiyah01kks.sch.id). Jangan buat akun admin baru.
 *
 * Config di bawah diambil dari app web yang sudah deploy (public by design).
 * DEMO_MODE hanya aktif jika config kosong / placeholder, ATAU
 * localStorage.setItem('po_force_demo','1') untuk uji UI offline.
 */

const firebaseConfig = {
  apiKey: 'AIzaSyBvVulB3Kwjs9CYBeKo2lyXA14nCSpJfwk',
  authDomain: 'sdm01kukusan-2e735.firebaseapp.com',
  projectId: 'sdm01kukusan-2e735',
  storageBucket: 'sdm01kukusan-2e735.firebasestorage.app',
  messagingSenderId: '970181491299',
  appId: '1:970181491299:web:8d6798fbbb43c231879656',
};

const forceDemo =
  typeof localStorage !== 'undefined' && localStorage.getItem('po_force_demo') === '1';

export const DEMO_MODE =
  forceDemo ||
  !firebaseConfig.apiKey ||
  firebaseConfig.apiKey.startsWith('TODO') ||
  firebaseConfig.apiKey.startsWith('ganti_');

let app = null,
  auth = null,
  db = null;

if (!DEMO_MODE) {
  const { initializeApp } = await import(
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'
  );
  const authMod = await import(
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'
  );
  const fsMod = await import(
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'
  );

  app = initializeApp(firebaseConfig);
  auth = authMod.getAuth(app);
  db = fsMod.getFirestore(app);
  window.__fb = { app, auth, db, authMod, fsMod };
} else {
  console.warn(
    '%c[Portal Orang Tua] DEMO_MODE aktif — data simulasi lokal.',
    'color:#c9882a;font-weight:bold;'
  );
}

export { app, auth, db };

/* --------------------------------------------------------------------------
   DEMO data (hanya jika DEMO_MODE)
   -------------------------------------------------------------------------- */
const DEMO_SESSION_KEY = 'po_demo_session';
const DEMO_USERS_KEY = 'po_demo_users';
const DEMO_SISWA_KEY = 'po_demo_siswa';

function _seedDemo() {
  if (!localStorage.getItem(DEMO_SISWA_KEY)) {
    const siswa = [
      { id: 's1', nama: 'Ahmad Fauzan', nis: '2024001', kelas: '5A' },
      { id: 's2', nama: 'Siti Aisyah', nis: '2024002', kelas: '5A' },
      { id: 's3', nama: 'Muhammad Rizki', nis: '2024003', kelas: '5A' },
      { id: 's4', nama: 'Nurul Hidayah', nis: '2024004', kelas: '5B' },
      { id: 's5', nama: 'Budi Santoso', nis: '2024005', kelas: '5B' },
      { id: 's6', nama: 'Fatimah Zahra', nis: '2024006', kelas: '4A' },
      { id: 's7', nama: 'Raka Pratama', nis: '2024007', kelas: '4A' },
      { id: 's8', nama: 'Anisa Putri', nis: '2024008', kelas: '6A' },
    ];
    localStorage.setItem(DEMO_SISWA_KEY, JSON.stringify(siswa));
  }
  if (!localStorage.getItem(DEMO_USERS_KEY)) {
    // Hanya untuk uji UI offline. Admin produksi = akun di Firebase SDM01Penilaian.
    const users = [
      {
        email: 'demo-admin-offline@local',
        password: 'demo-only',
        nama: 'Admin (demo offline)',
        role: 'admin',
      },
      {
        email: 'ortu.fauzan@contoh.com',
        password: 'ortu123',
        nama: 'Bapak Fauzan',
        role: 'orangtua',
        anakIds: ['s1'],
      },
      {
        email: 'ortu.aisyah@contoh.com',
        password: 'ortu123',
        nama: 'Ibu Aisyah',
        role: 'orangtua',
        anakIds: ['s2'],
      },
      {
        email: 'ortu.rizki@contoh.com',
        password: 'ortu123',
        nama: 'Bapak Rizki',
        role: 'orangtua',
        anakIds: ['s3'],
      },
    ];
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  }
}

/**
 * Muat daftar kelas → siswa untuk dropdown login.
 * @returns {Promise<Record<string, Array<{id:string,nama:string,nis:string}>>>}
 */
export async function loadKelasDanSiswa() {
  if (DEMO_MODE) {
    _seedDemo();
    await new Promise((r) => setTimeout(r, 200));
    const list = JSON.parse(localStorage.getItem(DEMO_SISWA_KEY) || '[]');
    const byKelas = {};
    list.forEach((s) => {
      if (!byKelas[s.kelas]) byKelas[s.kelas] = [];
      byKelas[s.kelas].push({ id: s.id, nama: s.nama, nis: s.nis || '' });
    });
    return byKelas;
  }

  const { db, fsMod } = window.__fb;
  // Koleksi siswa dilindungi rules: guest (belum login) tidak boleh list.
  // Gagal permission → kembalikan {} agar form admin tetap bisa dipakai;
  // dropdown ortu akan kosong sampai ada endpoint/roster publik atau login.
  try {
    const snap = await fsMod.getDocs(fsMod.collection(db, 'siswa'));
    const byKelas = {};
    snap.forEach((doc) => {
      const d = doc.data();
      const kelas = d.kelas || '—';
      if (!byKelas[kelas]) byKelas[kelas] = [];
      byKelas[kelas].push({
        id: doc.id,
        nama: d.nama || doc.id,
        // Jangan kirim NISN ke dropdown (password login)
        nis: '',
      });
    });
    Object.keys(byKelas).forEach((k) => {
      byKelas[k].sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
    });
    return byKelas;
  } catch (err) {
    console.warn(
      '[Portal] loadKelasDanSiswa ditolak rules (perlu login / roster publik):',
      err && err.code ? err.code : err
    );
    return {};
  }
}

/**
 * Login orang tua: pilih siswa + password.
 * Produksi: cari user role=orangtua yang anakIds mengandung siswaId,
 * lalu signInWithEmailAndPassword (email dari profil ortu).
 * Password = password akun Firebase Auth orang tua.
 */
export async function loginOrangtua({ siswaId, password }) {
  if (!siswaId || !password) throw new Error('Pilih siswa dan isi NISN.');

  const nisnInput = String(password).trim();

  if (DEMO_MODE) {
    _seedDemo();
    await new Promise((r) => setTimeout(r, 250));
    const list = JSON.parse(localStorage.getItem(DEMO_SISWA_KEY) || '[]');
    const siswa = list.find((s) => s.id === siswaId);
    if (!siswa) {
      throw Object.assign(new Error('Siswa tidak ditemukan.'), { code: 'auth/user-not-found' });
    }
    // Demo: NISN = field nis, atau fallback ortu123
    const ok =
      String(siswa.nis || '') === nisnInput ||
      nisnInput === 'ortu123';
    if (!ok) {
      throw Object.assign(new Error('NISN tidak sesuai.'), { code: 'auth/invalid-credential' });
    }
    const session = {
      uid: 'ortu-' + siswaId,
      email: null,
      nama: 'Orang tua · ' + siswa.nama,
      role: 'orangtua',
      anakIds: [siswaId],
      siswaAktifId: siswaId,
      authMode: 'nisn',
    };
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  const { db, fsMod } = window.__fb;
  const snap = await fsMod.getDoc(fsMod.doc(db, 'siswa', siswaId));
  if (!snap.exists()) {
    throw Object.assign(new Error('Siswa tidak ditemukan.'), { code: 'auth/user-not-found' });
  }
  const d = snap.data();
  if (d.aktif === false) {
    throw Object.assign(new Error('Data siswa tidak aktif.'), { code: 'auth/user-disabled' });
  }

  // Password = NISN (prioritas), fallback NIS bila NISN kosong
  const nisn = String(d.nisn || '').trim();
  const nis = String(d.nis || d.nipd || '').trim();
  const match =
    (nisn && nisn === nisnInput) ||
    (!nisn && nis && nis === nisnInput);

  if (!match) {
    throw Object.assign(new Error('NISN tidak sesuai.'), { code: 'auth/invalid-credential' });
  }

  const session = {
    uid: 'ortu-' + siswaId,
    email: null,
    nama: 'Orang tua · ' + (d.nama || siswaId),
    role: 'orangtua',
    anakIds: [siswaId],
    siswaAktifId: siswaId,
    authMode: 'nisn',
    siswaNama: d.nama || '',
    siswaKelas: d.kelas || '',
  };
  // Sesi ortu berbasis NISN (bukan Firebase Auth email)
  localStorage.setItem('po_ortu_session', JSON.stringify(session));
  return session;
}

export const loginOrangtuaBySiswa = loginOrangtua;

export async function loginAdmin(emailOrOpts, passwordMaybe) {
  // Terima loginAdmin({ email, password }) ATAU loginAdmin(email, password)
  let email, password;
  if (emailOrOpts && typeof emailOrOpts === 'object') {
    email = emailOrOpts.email;
    password = emailOrOpts.password;
  } else {
    email = emailOrOpts;
    password = passwordMaybe;
  }
  if (!email || !password) throw new Error('Isi email dan password admin.');

  if (DEMO_MODE) {
    _seedDemo();
    await new Promise((r) => setTimeout(r, 300));
    const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
    const admin = users.find(
      (u) =>
        u.role === 'admin' &&
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!admin) {
      throw Object.assign(new Error('Email atau password admin salah (mode demo).'), {
        code: 'auth/invalid-credential',
      });
    }
    const session = {
      uid: 'demo-admin',
      email: admin.email,
      nama: admin.nama,
      role: 'admin',
    };
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  const { auth, db, authMod, fsMod } = window.__fb;
  const cred = await authMod.signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );
  const uid = cred.user.uid;
  const snap = await fsMod.getDoc(fsMod.doc(db, 'users', uid));
  if (!snap.exists()) {
    await authMod.signOut(auth);
    throw new Error(
      'Akun login ada di Firebase, tetapi profil staf tidak ditemukan. Hubungi administrator.'
    );
  }
  const profile = snap.data();
  if (profile.role !== 'admin') {
    await authMod.signOut(auth);
    throw new Error('Akun ini bukan admin. Gunakan tab Orang Tua untuk akun orang tua.');
  }
  if (profile.aktif === false) {
    await authMod.signOut(auth);
    throw new Error('Akun ini dinonaktifkan. Hubungi administrator.');
  }
  return {
    uid,
    email: cred.user.email,
    nama: profile.nama || cred.user.email,
    role: 'admin',
  };
}

export async function logout() {
  localStorage.removeItem('po_ortu_session');
  localStorage.removeItem(DEMO_SESSION_KEY);
  if (DEMO_MODE) return;
  try {
    const { auth, authMod } = window.__fb;
    if (auth && authMod) await authMod.signOut(auth);
  } catch (_) {}
}

/**
 * Sesi saat ini (sync untuk gate halaman).
 * Di produksi Firebase, null sampai onAuthChange mengisi cache.
 */
let _sessionCache = null;

export function currentSession() {
  // Sesi ortu (NISN) — tidak memakai Firebase Auth
  try {
    const ortu = localStorage.getItem('po_ortu_session');
    if (ortu) return JSON.parse(ortu);
  } catch (_) {}
  if (DEMO_MODE) {
    try {
      const raw = localStorage.getItem(DEMO_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  return _sessionCache;
}

/**
 * Dengarkan perubahan auth. Callback(session | null).
 */
export function onAuthChange(callback) {
  if (DEMO_MODE) {
    const s = currentSession();
    callback(s);
    return () => {};
  }
  const { auth, db, authMod, fsMod } = window.__fb;
  return authMod.onAuthStateChanged(auth, async (user) => {
    if (!user) {
      _sessionCache = null;
      callback(null);
      return;
    }
    try {
      const snap = await fsMod.getDoc(fsMod.doc(db, 'users', user.uid));
      if (!snap.exists()) {
        _sessionCache = null;
        callback(null);
        return;
      }
      const p = snap.data();
      _sessionCache = {
        uid: user.uid,
        email: user.email,
        nama: p.nama || user.email,
        role: p.role,
        anakIds: p.anakIds || [],
        siswaAktifId: null,
      };
      callback(_sessionCache);
    } catch (err) {
      console.error(err);
      _sessionCache = null;
      callback(null);
    }
  });
}

/**
 * Ambil detail siswa by list of IDs (NIS / doc id).
 * @returns {Promise<Array<{id,nama,nis,kelas}>>}
 */
export async function loadSiswaByIds(ids) {
  if (!ids || !ids.length) return [];
  if (DEMO_MODE) {
    _seedDemo();
    await new Promise((r) => setTimeout(r, 150));
    const list = JSON.parse(localStorage.getItem(DEMO_SISWA_KEY) || '[]');
    const map = Object.fromEntries(list.map((s) => [s.id, s]));
    return ids.map((id) => {
      const s = map[id];
      return s
        ? { id: s.id, nama: s.nama, nis: s.nis || '', kelas: s.kelas || '' }
        : { id, nama: id, nis: '', kelas: '' };
    });
  }
  const { db, fsMod } = window.__fb;
  const results = [];
  for (const id of ids) {
    const snap = await fsMod.getDoc(fsMod.doc(db, 'siswa', id));
    if (snap.exists()) {
      const d = snap.data();
      results.push({
        id: snap.id,
        nama: d.nama || snap.id,
        nis: d.nis || d.nisn || '',
        kelas: d.kelas || '',
      });
    } else {
      results.push({ id, nama: id, nis: '', kelas: '' });
    }
  }
  return results;
}

/**
 * Nilai STS yang sudah dipublish untuk satu siswa.
 * @returns {Promise<{published:boolean, periodeLabel:string, publishedAt:string|null, items:Array}>}
 */
export async function loadNilaiStsPublished(siswaId) {
  if (DEMO_MODE) {
    _seedDemo();
    await new Promise((r) => setTimeout(r, 350));
    const periodeLabel = 'STS · Semester 1 · 2025/2026';
    if (siswaId === 's1') {
      return {
        published: true,
        periodeLabel,
        publishedAt: '12 Okt 2025',
        items: [
          { mapel: 'Pendidikan Agama Islam', nilai: 88, predikat: 'Baik', keterangan: 'Sumatif Tengah Semester' },
          { mapel: 'Pendidikan Pancasila', nilai: 90, predikat: 'Sangat Baik', keterangan: 'Sumatif Tengah Semester' },
          { mapel: 'Bahasa Indonesia', nilai: 85, predikat: 'Baik', keterangan: 'Sumatif Tengah Semester' },
          { mapel: 'Matematika', nilai: 78, predikat: 'Cukup', keterangan: 'Sumatif Tengah Semester' },
          { mapel: 'IPAS', nilai: 82, predikat: 'Baik', keterangan: 'Sumatif Tengah Semester' },
          { mapel: 'Bahasa Inggris', nilai: 91, predikat: 'Sangat Baik', keterangan: 'Sumatif Tengah Semester' },
          { mapel: 'Seni Rupa', nilai: 87, predikat: 'Baik', keterangan: 'Sumatif Tengah Semester' },
          { mapel: 'Pendidikan Jasmani', nilai: 93, predikat: 'Sangat Baik', keterangan: 'Sumatif Tengah Semester' },
        ],
      };
    }
    if (siswaId === 's2') {
      return {
        published: true,
        periodeLabel,
        publishedAt: '12 Okt 2025',
        items: [
          { mapel: 'Pendidikan Agama Islam', nilai: 92, predikat: 'Sangat Baik', keterangan: 'Sumatif Tengah Semester' },
          { mapel: 'Bahasa Indonesia', nilai: 89, predikat: 'Baik', keterangan: 'Sumatif Tengah Semester' },
          { mapel: 'Matematika', nilai: 94, predikat: 'Sangat Baik', keterangan: 'Sumatif Tengah Semester' },
          { mapel: 'IPAS', nilai: 86, predikat: 'Baik', keterangan: 'Sumatif Tengah Semester' },
        ],
      };
    }
    return { published: false, periodeLabel, publishedAt: null, items: [] };
  }

  const { db, fsMod } = window.__fb;

  let periodeLabel = 'Semester berjalan';
  let publishedAt = null;
  let published = false;
  const items = [];

  try {
    const cfg = await fsMod.getDoc(fsMod.doc(db, 'config', 'akademik'));
    if (cfg.exists()) {
      const c = cfg.data();
      if (c.semesterLabel) periodeLabel = 'STS · ' + c.semesterLabel;
      else if (c.tahunAjaran && c.semester) {
        periodeLabel = `STS · Semester ${c.semester} · ${c.tahunAjaran}`;
      }
    }
  } catch (_) {
    /* ignore */
  }

  // Coba beberapa pola koleksi yang mungkin dipakai SDM01Penilaian
  const tryCollections = ['nilai_sts', 'nilaiSts', 'sts'];
  for (const colName of tryCollections) {
    try {
      const q = fsMod.query(
        fsMod.collection(db, colName),
        fsMod.where('siswaId', '==', siswaId)
      );
      const snap = await fsMod.getDocs(q);
      if (snap.empty) continue;
      snap.forEach((doc) => {
        const d = doc.data();
        if (d.published === false) return;
        if (d.published === true) published = true;
        // Filter jenis STS jika ada field jenis/fase
        if (d.jenis && String(d.jenis).toUpperCase() !== 'STS') return;
        items.push({
          mapel: d.mapel || d.namaMapel || 'Mapel',
          nilai: d.nilai != null ? d.nilai : d.skor,
          predikat: d.predikat || '',
          keterangan: d.keterangan || 'Sumatif Tengah Semester',
        });
        if (d.publishedAt && !publishedAt) {
          try {
            const ts = d.publishedAt.toDate
              ? d.publishedAt.toDate()
              : new Date(d.publishedAt);
            publishedAt = ts.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
          } catch (_) {}
        }
      });
      if (items.length) {
        if (!published) published = true;
        break;
      }
    } catch (err) {
      console.warn(colName, err);
    }
  }

  items.sort((a, b) => String(a.mapel).localeCompare(String(b.mapel), 'id'));

  return {
    published: published && items.length > 0 ? true : published,
    periodeLabel,
    publishedAt,
    items: published ? items : [],
  };
}



/* --------------------------------------------------------------------------
   Admin: kelola akun orang tua
   -------------------------------------------------------------------------- */

/**
 * Daftar semua akun role=orangtua (admin only).
 * @returns {Promise<Array<{uid,email,nama,status,aktif,anakIds,createdAt}>>}
 */
export async function listAkunOrangtua() {
  if (DEMO_MODE) {
    _seedDemo();
    await new Promise((r) => setTimeout(r, 200));
    const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
    return users
      .filter((u) => u.role === 'orangtua')
      .map((u, i) => ({
        uid: 'demo-ortu-' + i,
        email: u.email,
        nama: u.nama,
        status: u.status || 'approved',
        aktif: u.aktif !== false,
        anakIds: u.anakIds || [],
        createdAt: null,
      }));
  }
  const { db, fsMod } = window.__fb;
  const q = fsMod.query(
    fsMod.collection(db, 'users'),
    fsMod.where('role', '==', 'orangtua')
  );
  const snap = await fsMod.getDocs(q);
  const list = [];
  snap.forEach((doc) => {
    const d = doc.data();
    list.push({
      uid: doc.id,
      email: d.email || '',
      nama: d.nama || '',
      status: d.status || 'pending',
      aktif: d.aktif !== false,
      anakIds: Array.isArray(d.anakIds) ? d.anakIds : [],
      createdAt: d.createdAt || null,
    });
  });
  list.sort((a, b) => {
    // pending dulu, lalu nama
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (b.status === 'pending' && a.status !== 'pending') return 1;
    return String(a.nama || a.email).localeCompare(String(b.nama || b.email), 'id');
  });
  return list;
}

/**
 * Update profil orang tua (status, aktif, anakIds, nama).
 * Hanya field yang diizinkan rules untuk admin.
 */
export async function updateAkunOrangtua(uid, patch) {
  if (!uid) throw new Error('UID wajib.');
  if (DEMO_MODE) {
    _seedDemo();
    const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
    // demo: match by synthetic
    const idx = users.findIndex(
      (u, i) => u.role === 'orangtua' && 'demo-ortu-' + i === uid
    );
    if (idx < 0) throw new Error('Akun tidak ditemukan (demo).');
    if (patch.nama != null) users[idx].nama = patch.nama;
    if (patch.status != null) users[idx].status = patch.status;
    if (patch.aktif != null) users[idx].aktif = patch.aktif;
    if (patch.anakIds != null) users[idx].anakIds = patch.anakIds;
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
    return;
  }
  const { db, fsMod } = window.__fb;
  const ref = fsMod.doc(db, 'users', uid);
  const data = {};
  if (patch.nama != null) data.nama = String(patch.nama).trim();
  if (patch.status != null) data.status = patch.status;
  if (patch.aktif != null) data.aktif = !!patch.aktif;
  if (patch.anakIds != null) {
    data.anakIds = Array.isArray(patch.anakIds) ? patch.anakIds : [];
  }
  data.updatedAt = fsMod.serverTimestamp();
  await fsMod.updateDoc(ref, data);
}

/**
 * Semua siswa ringkas untuk picker anak (admin sudah login → rules izinkan).
 * @returns {Promise<Array<{id,nama,nis,kelas}>>}
 */
export async function listSemuaSiswa() {
  if (DEMO_MODE) {
    _seedDemo();
    const list = JSON.parse(localStorage.getItem(DEMO_SISWA_KEY) || '[]');
    return list.map((s) => ({
      id: s.id,
      nama: s.nama,
      nis: s.nis || '',
      kelas: s.kelas || '',
    }));
  }
  const { db, fsMod } = window.__fb;
  const snap = await fsMod.getDocs(fsMod.collection(db, 'siswa'));
  const list = [];
  snap.forEach((doc) => {
    const d = doc.data();
    if (d.aktif === false) return;
    list.push({
      id: doc.id,
      nama: d.nama || doc.id,
      nis: d.nis || d.nisn || d.nipd || '',
      kelas: d.kelas || '',
    });
  });
  list.sort((a, b) => {
    const kc = String(a.kelas).localeCompare(String(b.kelas), 'id', { numeric: true });
    if (kc !== 0) return kc;
    return a.nama.localeCompare(b.nama, 'id');
  });
  return list;
}

/**
 * Kirim email reset password Firebase ke alamat ortu.
 * Tidak mengubah password langsung (butuh Admin SDK / Cloud Function).
 */
export async function kirimResetPasswordOrangtua(email) {
  if (!email) throw new Error('Email wajib.');
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true, demo: true };
  }
  const { auth, authMod } = window.__fb;
  await authMod.sendPasswordResetEmail(auth, email.trim().toLowerCase());
  return { ok: true };
}

export function terjemahkanErrorLogin(err) {
  const code = err && err.code ? String(err.code) : '';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
    return 'NISN tidak sesuai atau email/password salah.';
  }
  if (code === 'auth/user-not-found') {
    return 'Akun tidak ditemukan.';
  }
  if (code === 'auth/user-disabled') {
    return 'Akun dinonaktifkan atau belum disetujui.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Terlalu banyak percobaan. Coba lagi nanti.';
  }
  if (code === 'auth/invalid-email') {
    return 'Format email tidak valid.';
  }
  if (err && err.message) return err.message;
  return 'Gagal masuk. Coba lagi.';
}
