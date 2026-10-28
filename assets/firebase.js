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
  const snap = await fsMod.getDocs(fsMod.collection(db, 'siswa'));
  const byKelas = {};
  snap.forEach((doc) => {
    const d = doc.data();
    const kelas = d.kelas || '—';
    if (!byKelas[kelas]) byKelas[kelas] = [];
    byKelas[kelas].push({
      id: doc.id,
      nama: d.nama || doc.id,
      nis: d.nis || d.nisn || '',
    });
  });
  // Urut nama di tiap kelas
  Object.keys(byKelas).forEach((k) => {
    byKelas[k].sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
  });
  return byKelas;
}

/**
 * Login orang tua: pilih siswa + password.
 * Produksi: cari user role=orangtua yang anakIds mengandung siswaId,
 * lalu signInWithEmailAndPassword (email dari profil ortu).
 * Password = password akun Firebase Auth orang tua.
 */
export async function loginOrangtua({ siswaId, password }) {
  if (!siswaId || !password) throw new Error('Pilih siswa dan isi password.');

  if (DEMO_MODE) {
    _seedDemo();
    await new Promise((r) => setTimeout(r, 300));
    const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
    const ortu = users.find(
      (u) =>
        u.role === 'orangtua' &&
        Array.isArray(u.anakIds) &&
        u.anakIds.includes(siswaId) &&
        u.password === password
    );
    if (!ortu) throw Object.assign(new Error('Password salah atau akun tidak terhubung ke siswa ini.'), { code: 'auth/invalid-credential' });
    const session = {
      uid: 'demo-' + ortu.email,
      email: ortu.email,
      nama: ortu.nama,
      role: 'orangtua',
      anakIds: ortu.anakIds,
      siswaAktifId: siswaId,
    };
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  const { auth, db, authMod, fsMod } = window.__fb;

  // Cari profil orang tua yang terhubung ke siswaId
  const q = fsMod.query(
    fsMod.collection(db, 'users'),
    fsMod.where('role', '==', 'orangtua'),
    fsMod.where('anakIds', 'array-contains', siswaId)
  );
  const snap = await fsMod.getDocs(q);
  if (snap.empty) {
    throw Object.assign(
      new Error('Belum ada akun orang tua yang terhubung ke siswa ini. Hubungi admin sekolah.'),
      { code: 'auth/user-not-found' }
    );
  }

  // Ambil kandidat yang status approved (jika field ada)
  let profileDoc = null;
  snap.forEach((doc) => {
    const d = doc.data();
    if (d.status && d.status !== 'approved') return;
    if (d.aktif === false) return;
    if (!profileDoc) profileDoc = { id: doc.id, ...d };
  });
  if (!profileDoc) {
    throw Object.assign(
      new Error('Akun orang tua belum disetujui admin atau dinonaktifkan.'),
      { code: 'auth/user-disabled' }
    );
  }

  const email = (profileDoc.email || '').trim().toLowerCase();
  if (!email) {
    throw new Error('Profil orang tua tidak memiliki email login. Hubungi admin.');
  }

  const cred = await authMod.signInWithEmailAndPassword(auth, email, password);
  const session = {
    uid: cred.user.uid,
    email: cred.user.email,
    nama: profileDoc.nama || cred.user.email,
    role: 'orangtua',
    anakIds: profileDoc.anakIds || [siswaId],
    siswaAktifId: siswaId,
  };
  return session;
}

/**
 * Login admin — memakai akun admin SDM01Penilaian yang sudah ada.
 * Email + password sama seperti di https://penilaian.sdmuhammadiyah01kks.sch.id
 */
export async function loginAdmin({ email, password }) {
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
  if (DEMO_MODE) {
    localStorage.removeItem(DEMO_SESSION_KEY);
    return;
  }
  const { auth, authMod } = window.__fb;
  await authMod.signOut(auth);
}

/**
 * Sesi saat ini (sync untuk gate halaman).
 * Di produksi Firebase, null sampai onAuthChange mengisi cache.
 */
let _sessionCache = null;

export function currentSession() {
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

export function terjemahkanErrorLogin(err) {
  const code = err && err.code ? String(err.code) : '';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
    return 'Email atau password salah.';
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
