/**
 * firebase.js — Portal Orang Tua
 * SD Muhammadiyah 01 Kukusan
 *
 * Memakai Firebase project yang SAMA dengan penilaian-v2
 * (sdm01-penilaianv2) agar data siswa & nilai satu sumber.
 *
 * Ganti firebaseConfig jika project berbeda, atau biarkan
 * placeholder untuk DEMO_MODE.
 */

const firebaseConfig = {
  apiKey: "AIzaSyA52_m-tU18t2ULV268v7j3X8HDkWVBGi0",
  authDomain: "sdm01-penilaianv2.firebaseapp.com",
  projectId: "sdm01-penilaianv2",
  storageBucket: "sdm01-penilaianv2.firebasestorage.app",
  messagingSenderId: "437694245628",
  appId: "1:437694245628:web:14d0fc8350f59be0364579",
};

export const DEMO_MODE = !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('TODO');

let app = null, auth = null, db = null;

if (!DEMO_MODE) {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
  const authMod = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
  const fsMod = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

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
   DEMO data
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
    // Mapping: password per "akun ortu" yang terhubung ke siswa
    // Di produksi: users/{uid} role=orangtua, anakIds=[...], login via email
    // Untuk UX pilih-siswa: kita simpan parentPassword di dokumen siswa
    // atau lookup users yang anakIds contains siswaId.
    const users = [
      {
        email: 'admin@sdm01kukusan.sch.id',
        password: 'admin123',
        nama: 'Admin Sekolah',
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
  return byKelas;
}

/**
 * Login orang tua dengan memilih siswa + password.
 * Mencari user role=orangtua yang anakIds mengandung siswaId,
 * lalu verifikasi password (demo) / signIn (produksi lewat email tersimpan).
 *
 * Catatan desain produksi:
 * - Setiap orang tua punya email + password di Firebase Auth.
 * - Dokumen users/{uid} berisi role, anakIds.
 * - Untuk UX "pilih anak dulu": kita lookup user yang punya anakIds berisi siswaId,
 *   lalu signInWithEmailAndPassword(email, password).
 * - Password diganti orang tua sendiri; admin bisa reset lewat Firebase Auth / panel.
 */
export async function loginOrangtuaBySiswa({ siswaId, password }) {
  if (DEMO_MODE) {
    _seedDemo();
    await new Promise((r) => setTimeout(r, 450));
    const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
    const found = users.find(
      (u) =>
        u.role === 'orangtua' &&
        Array.isArray(u.anakIds) &&
        u.anakIds.includes(siswaId) &&
        u.password === password
    );
    if (!found) {
      const err = new Error('demo/invalid-credential');
      err.code = 'demo/invalid-credential';
      throw err;
    }
    const session = {
      uid: 'demo-' + btoa(found.email),
      email: found.email,
      nama: found.nama,
      role: 'orangtua',
      anakIds: found.anakIds || [],
      siswaAktifId: siswaId,
    };
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  const { db, fsMod, auth, authMod } = window.__fb;

  // Cari user orangtua yang terhubung ke siswa ini
  const q = fsMod.query(
    fsMod.collection(db, 'users'),
    fsMod.where('role', '==', 'orangtua'),
    fsMod.where('anakIds', 'array-contains', siswaId)
  );
  const snap = await fsMod.getDocs(q);
  if (snap.empty) {
    const err = new Error('portal/no-parent-for-siswa');
    err.code = 'portal/no-parent-for-siswa';
    throw err;
  }
  // Ambil email dari dokumen pertama (biasanya 1 ortu per anak di fase awal)
  const parentDoc = snap.docs[0];
  const parent = parentDoc.data();
  const email = parent.email || parentDoc.id; // fallback jika email disimpan di doc

  // Login Firebase Auth
  await authMod.setPersistence(auth, authMod.browserLocalPersistence);
  const cred = await authMod.signInWithEmailAndPassword(auth, email, password);

  return {
    uid: cred.user.uid,
    email: cred.user.email,
    nama: parent.nama || cred.user.email,
    role: 'orangtua',
    anakIds: parent.anakIds || [],
    siswaAktifId: siswaId,
  };
}

/**
 * Login admin (email + password), role harus admin.
 */
export async function loginAdmin(email, password, rememberMe = true) {
  if (DEMO_MODE) {
    _seedDemo();
    await new Promise((r) => setTimeout(r, 450));
    const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
    const found = users.find(
      (u) =>
        u.role === 'admin' &&
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );
    if (!found) {
      const err = new Error('demo/invalid-credential');
      err.code = 'demo/invalid-credential';
      throw err;
    }
    const session = {
      uid: 'demo-admin',
      email: found.email,
      nama: found.nama,
      role: 'admin',
    };
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  const { auth, authMod, db, fsMod } = window.__fb;
  await authMod.setPersistence(
    auth,
    rememberMe ? authMod.browserLocalPersistence : authMod.browserSessionPersistence
  );
  const cred = await authMod.signInWithEmailAndPassword(auth, email, password);
  const snap = await fsMod.getDoc(fsMod.doc(db, 'users', cred.user.uid));
  const profile = snap.exists() ? snap.data() : {};
  if (profile.role !== 'admin') {
    await authMod.signOut(auth);
    const err = new Error('portal/not-admin');
    err.code = 'portal/not-admin';
    throw err;
  }
  return {
    uid: cred.user.uid,
    email: cred.user.email,
    nama: profile.nama || cred.user.email,
    role: 'admin',
  };
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
 * Skema fleksibel — menyesuaikan koleksi yang dipakai penilaian-v2.
 *
 * DEMO: s1 & s2 punya nilai published; s3 belum publish.
 *
 * Produksi (usulan):
 *   - sts_publish/{kelas}_{semesterId}  → { published: true, publishedAt, periodeLabel }
 *   - nilai_sts/{siswaId}_{mapel}_{semesterId} atau subcollection
 * Untuk sementara: baca koleksi `nilai_sts` filter siswaId + published==true
 * atau dokumen publish per kelas.
 *
 * @returns {Promise<{published:boolean, periodeLabel:string, publishedAt:string|null, items:Array<{mapel,nilai,predikat,keterangan}>}>}
 */
export async function loadNilaiStsPublished(siswaId) {
  if (DEMO_MODE) {
    _seedDemo();
    await new Promise((r) => setTimeout(r, 350));
    const periodeLabel = 'STS · Semester 1 · 2025/2026';
    // Demo: s1 & s2 published, lainnya belum
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
    // s3 dan lainnya: belum publish
    return {
      published: false,
      periodeLabel,
      publishedAt: null,
      items: [],
    };
  }

  const { db, fsMod } = window.__fb;

  // 1) Cek status publish — usulan koleksi sts_publish
  //    Doc id bisa kelas_semester atau global semester.
  //    Fallback: jika ada nilai dengan flag published, anggap published.
  let periodeLabel = 'Semester berjalan';
  let publishedAt = null;
  let published = false;

  try {
    const cfg = await fsMod.getDoc(fsMod.doc(db, 'config', 'akademik'));
    if (cfg.exists()) {
      const c = cfg.data();
      if (c.semesterLabel) periodeLabel = 'STS · ' + c.semesterLabel;
      else if (c.tahunAjaran && c.semester) {
        periodeLabel = `STS · Semester ${c.semester} · ${c.tahunAjaran}`;
      }
    }
  } catch (_) { /* ignore */ }

  // 2) Ambil nilai STS siswa
  // Prefer: collection nilai_sts where siswaId == X and jenis == 'STS' and published == true
  const items = [];
  try {
    const q = fsMod.query(
      fsMod.collection(db, 'nilai_sts'),
      fsMod.where('siswaId', '==', siswaId)
    );
    const snap = await fsMod.getDocs(q);
    snap.forEach((doc) => {
      const d = doc.data();
      // Hanya tampilkan yang published (field di dokumen nilai atau di publish kelas)
      if (d.published === false) return;
      if (d.published === true) published = true;
      items.push({
        mapel: d.mapel || d.namaMapel || 'Mapel',
        nilai: d.nilai != null ? d.nilai : d.skor,
        predikat: d.predikat || '',
        keterangan: d.keterangan || 'Sumatif Tengah Semester',
      });
      if (d.publishedAt && !publishedAt) {
        try {
          const ts = d.publishedAt.toDate ? d.publishedAt.toDate() : new Date(d.publishedAt);
          publishedAt = ts.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (_) {}
      }
    });
    // Jika ada item tanpa flag published eksplisit, anggap published
    if (items.length && !published) published = true;
  } catch (err) {
    console.warn('nilai_sts query:', err);
  }

  // Urutkan alphabet mapel
  items.sort((a, b) => String(a.mapel).localeCompare(String(b.mapel), 'id'));

  return {
    published: published && items.length > 0 ? true : published,
    periodeLabel,
    publishedAt,
    items: published ? items : [],
  };
}

export function terjemahkanErrorLogin(err) {
  const code = err?.code || '';
  const map = {
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/user-not-found': 'Akun tidak ditemukan.',
    'auth/wrong-password': 'Password salah.',
    'auth/invalid-credential': 'Email atau password salah.',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
    'auth/network-request-failed': 'Koneksi bermasalah. Periksa internet Anda.',
    'demo/invalid-credential': 'Nama anak atau password tidak sesuai.',
    'portal/no-parent-for-siswa': 'Belum ada akun orang tua terhubung ke anak ini. Hubungi admin.',
    'portal/not-admin': 'Akun ini bukan admin portal.',
  };
  return map[code] || 'Login gagal. Silakan coba lagi.';
}

export function currentSession() {
  if (DEMO_MODE) {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  return null;
}

export async function logout() {
  if (DEMO_MODE) {
    localStorage.removeItem(DEMO_SESSION_KEY);
    return;
  }
  const { authMod, auth } = window.__fb;
  await authMod.signOut(auth);
}

export function onAuthChange(callback) {
  if (DEMO_MODE) {
    callback(currentSession());
    return () => {};
  }
  const { authMod, auth, db, fsMod } = window.__fb;
  return authMod.onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      callback(null);
      return;
    }
    try {
      const snap = await fsMod.getDoc(fsMod.doc(db, 'users', fbUser.uid));
      const profile = snap.exists() ? snap.data() : {};
      callback({
        uid: fbUser.uid,
        email: fbUser.email,
        nama: profile.nama || fbUser.email,
        role: profile.role || '',
        anakIds: profile.anakIds || [],
      });
    } catch {
      callback({ uid: fbUser.uid, email: fbUser.email, nama: fbUser.email, role: '', anakIds: [] });
    }
  });
}
