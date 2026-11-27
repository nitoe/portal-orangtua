/**
 * Shell navigasi bersama — Portal Orang Tua
 * Satu sumber kebenaran untuk TKA visibility, tanggal, logout, inisial.
 * Jangan duplikasi logika ini di halaman individual.
 */
import { currentSession, logout } from './firebase.js?v=20261127d';

const $ = (id) => document.getElementById(id);

export function inisial(nama) {
  if (!nama) return '?';
  const p = String(nama).trim().split(/\s+/);
  return p.length === 1
    ? p[0].slice(0, 2).toUpperCase()
    : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

export function setTanggalHari(elId = 'tanggalHari') {
  const el = $(elId);
  if (!el) return;
  el.textContent = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());
}

/** Tampilkan menu TKA (default HTML: class="hidden"). */
export function showTkaMenu() {
  const nav = $('navTryOutTka');
  if (nav) nav.classList.remove('hidden');
  const navB = $('navTryOutTkaBottom');
  if (navB) navB.classList.remove('hidden');
  const hub = $('hubTryOutTka');
  if (hub) hub.classList.remove('hidden');
}

/** Panggil dengan kelas anak. Hanya kelas 6A/6B yang menampilkan TKA. */
export function applyTkaVisibility(kelas) {
  if (/^6[AB]$/i.test(String(kelas || ''))) showTkaMenu();
}

export async function doLogout() {
  await logout();
  location.href = 'index.html';
}

/**
 * Wire tombol logout + tanggal + TKA dari session (sinkron, anti-FOUC).
 * @returns {object|null} session ortu atau null (sudah redirect)
 */
export function initShell() {
  const s = currentSession();
  if (!s || s.role !== 'orangtua') {
    location.href = 'index.html';
    return null;
  }
  setTanggalHari();
  const sideNama = $('sideNama');
  if (sideNama) sideNama.textContent = s.nama || 'Orang tua';
  // TKA: cek session dulu agar tidak kedip
  applyTkaVisibility(s.siswaKelas);

  const side = $('btnLogoutSide');
  const top = $('btnLogoutTop');
  const nav = $('btnLogoutNav');
  if (side) side.onclick = doLogout;
  if (top) top.onclick = doLogout;
  if (nav) nav.onclick = doLogout;

  return s;
}

export { currentSession, $ };
