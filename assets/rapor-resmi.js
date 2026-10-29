/**
 * Lembar rapor STS — HTML + CSS disalin dari SDM01Penilaian src/lib/raporHtml.ts
 * (buildBodyPrintSts + PRINT_CSS + cssHalaman). Jangan mengubah rumus di sini.
 * Data sudah final dari dokumen rapor_sts_ortu.
 */

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}

const CSS_ISI = `
.rpr-title{text-align:center;font-size:14pt;font-weight:bold;text-transform:uppercase;letter-spacing:.4px;margin-bottom:2pt}
.rpr-subtitle{text-align:center;font-size:11pt;font-weight:bold;margin-bottom:10pt}
.rpr-header{border-bottom:3pt double #000;padding-bottom:9pt;margin-bottom:12pt}
.rpr-info-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:1pt 20pt}
.rpr-info-kanan{justify-self:end}
.rpr-info-row{display:flex;font-size:10.5pt}
.rpr-info-label{width:92pt;flex-shrink:0;font-weight:bold}
.rpr-info-kanan .rpr-info-label{width:92pt}
.rpr-info-sep{width:7pt;flex-shrink:0;margin-right:2pt}
.rpr-info-val{flex:1}
.rpr-section{margin-top:12pt}
.rpr-section-title{font-size:10.5pt;font-weight:bold;text-transform:uppercase;letter-spacing:.3px;border-bottom:1pt solid #000;padding-bottom:2pt;margin-bottom:6pt;page-break-after:avoid;break-after:avoid}
.rpr-sub-title{font-size:10.5pt;font-weight:bold;margin:6pt 0 4pt;page-break-after:avoid;break-after:avoid}
table{width:100%;border-collapse:collapse;font-size:10.5pt}
thead{display:table-header-group}
th{border:1pt solid #000;padding:4pt 6pt;background:#e0e0e0;font-weight:bold;text-align:center;font-size:10pt}
td{border:1pt solid #000;padding:4pt 6pt;vertical-align:top}
tr{page-break-inside:avoid;break-inside:avoid}
.td-no{text-align:center;width:24pt;font-size:9.5pt;color:#444}
.td-mapel{width:100pt}
.td-nilai{text-align:center;width:42pt;font-size:10.5pt}
.td-capaian{line-height:1.55;text-align:justify}
.desc-best{margin-bottom:2pt}
.kosong{color:#999;font-style:italic}
.rpr-ttd-wrap{margin-top:18pt}
.rpr-ttd-tempat{min-height:18pt;margin-bottom:10pt;font-size:10.5pt;line-height:1.3}
.rpr-ttd-jabatan{margin-bottom:2pt}
.rpr-ttd{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8pt;font-size:10.5pt}
.rpr-ttd-col{text-align:center}
.rpr-ttd-space{height:72pt;min-height:72pt;display:flex;align-items:flex-end;justify-content:center;background:transparent}
.rpr-ttd-space--stempel{position:relative;height:72pt;min-height:72pt;align-items:center;justify-content:center;background:#fff}
.rpr-stempel{position:absolute;left:40%;top:50%;transform:translate(-50%,-48%);max-height:66pt;max-width:66pt;width:auto;height:auto;object-fit:contain;z-index:1;pointer-events:none}
.rpr-ttd-img{max-height:60pt;max-width:130pt;object-fit:contain;display:block;position:relative;z-index:2;background:transparent}
.rpr-ttd-img--atas-stempel{max-height:60pt;max-width:130pt;margin-left:10pt;z-index:2}
.rpr-ttd-name{font-weight:bold;border-top:1pt solid #000;padding-top:2pt}
.rpr-ttd-nbm{font-size:9.5pt;color:#444;min-height:12pt}
.rpr-ttd-wrap,.rpr-ttd,.rpr-footer-group{page-break-inside:avoid;break-inside:avoid}
`;

const PRINT_BASE = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,Helvetica,sans-serif;font-size:10.5pt;line-height:1.45;color:#000;background:#fff}
${CSS_ISI}
`;

function info(label, nilai) {
  return `<div class="rpr-info-row"><span class="rpr-info-label">${label}</span><span class="rpr-info-sep">:</span><span class="rpr-info-val">${esc(nilai)}</span></div>`;
}

function barisTabel(no, item) {
  const nilai = item.nilaiAkhir == null || item.nilaiAkhir === '' ? '—' : String(item.nilaiAkhir);
  const kalimat = Array.isArray(item.capaian) ? item.capaian.filter(Boolean) : [];
  const capaian = kalimat.length
    ? kalimat.map((k, i) => `<div class="${i === 0 ? 'desc-best' : 'desc-worst'}">${esc(k)}</div>`).join('')
    : nilai === '—'
      ? '<span class="kosong">Belum ada nilai</span>'
      : '<span class="kosong">Deskripsi KKTP belum diisi</span>';
  return `<tr>
    <td class="td-no">${no}</td>
    <td class="td-mapel">${esc(item.mapel)}</td>
    <td class="td-nilai">${esc(nilai)}</td>
    <td class="td-capaian">${capaian}</td>
  </tr>`;
}

const KEPALA =
  '<thead><tr><th class="td-no">No.</th><th>Mata Pelajaran</th><th class="td-nilai">Nilai<br>Akhir</th><th>Capaian Kompetensi</th></tr></thead>';

function bagianNilai(baris) {
  const list = Array.isArray(baris) ? baris : [];
  const wajib = list.filter((b) => b.muatan !== 'yayasan');
  const yayasan = list.filter((b) => b.muatan === 'yayasan');
  let no = 0;
  const barisWajib = wajib.map((b) => barisTabel(++no, b)).join('');
  const barisYayasan = yayasan.map((b) => barisTabel(++no, b)).join('');
  const kosong = `<tr><td colspan="4" class="kosong" style="text-align:center;font-style:italic">Belum ada mata pelajaran terdaftar.</td></tr>`;
  const blokYayasan = yayasan.length
    ? `<div class="rpr-sub-title" style="margin-top:8pt">A.2. Muatan Yayasan</div>
  <table>${KEPALA}<tbody>${barisYayasan}</tbody></table>`
    : '';
  return `<div class="rpr-section">
  <div class="rpr-section-title">A. Nilai dan Ketercapaian Kompetensi</div>
  <div class="rpr-sub-title">A.1. Muatan Wajib</div>
  <table>${KEPALA}<tbody>${barisWajib || kosong}</tbody></table>
  ${blokYayasan}
</div>`;
}

function ruangTtd(opts) {
  const ttd = String(opts.ttdUrl || '').trim();
  const stempel = String(opts.stempelUrl || '').trim();
  if (opts.denganStempel && stempel) {
    const imgTtd = ttd
      ? `<img class="rpr-ttd-img rpr-ttd-img--atas-stempel" src="${esc(ttd)}" alt="" />`
      : '';
    return `<div class="rpr-ttd-space rpr-ttd-space--stempel">${imgTtd}<img class="rpr-stempel" src="${esc(stempel)}" alt="" /></div>`;
  }
  if (ttd) return `<div class="rpr-ttd-space"><img class="rpr-ttd-img" src="${esc(ttd)}" alt="" /></div>`;
  return `<div class="rpr-ttd-space"></div>`;
}

function kolom(peran, nama, nbm, tempat, opts) {
  return `<div class="rpr-ttd-col"><div class="rpr-ttd-tempat">${tempat || '&nbsp;'}</div><div class="rpr-ttd-jabatan">${peran}</div>${ruangTtd(opts || {})}<div class="rpr-ttd-name">${nama}</div><div class="rpr-ttd-nbm">${nbm}</div></div>`;
}

function tandaTangan(d) {
  const tempat = `${esc(d.kota || 'Depok')}, ${esc(d.tanggal || '')}`;
  const ortu = kolom('Orang Tua/Wali', '(………………………………)');
  const wali = kolom(
    'Wali Kelas,',
    esc(d.waliNama || '—'),
    d.waliNbm ? `NBM. ${esc(d.waliNbm)}` : '',
    '',
    { ttdUrl: d.ttdWaliUrl },
  );
  const kepsek = kolom(
    'Kepala Sekolah,',
    esc(d.namaKepsek || '—'),
    d.nbmKepsek ? `NBM. ${esc(d.nbmKepsek)}` : '',
    tempat,
    { ttdUrl: d.ttdKepsekUrl, stempelUrl: d.stempelUrl, denganStempel: true },
  );
  return `<div class="rpr-footer-group"><div class="rpr-ttd-wrap"><div class="rpr-ttd">${ortu}${wali}${kepsek}</div></div></div>`;
}

export function badanRaporSts(d) {
  const sem = String(d.semester) === '2' ? 'II (Genap)' : 'I (Ganjil)';
  const kepala = `<div class="rpr-title">Laporan Hasil Belajar</div>
<div class="rpr-subtitle">Sumatif Tengah Semester</div>
<div class="rpr-header">
  <div class="rpr-info-grid">
    <div>
      ${info('Nama', d.nama || '—')}
      ${info('NISN', d.nisn || '—')}
      ${info('Sekolah', d.sekolah || 'SD Muhammadiyah 01 Kukusan')}
      ${info('Alamat', d.alamat || '—')}
    </div>
    <div class="rpr-info-kanan">
      ${info('Kelas', d.kelas || '—')}
      ${info('Fase', d.fase || '—')}
      ${info('Semester', sem)}
      ${info('Tahun Pelajaran', d.tahunAjaran || '—')}
    </div>
  </div>
</div>`;
  return `<section class="rpr-page">\n${kepala}\n${bagianNilai(d.baris)}\n${tandaTangan(d)}\n</section>`;
}

function cssHalaman(d) {
  const nisn = d.nisn || '—';
  const teks = `Kelas ${d.kelas || ''} | ${d.nama || ''} | ${nisn}`.replace(/["\\]/g, '');
  return `@page{
  size:A4;margin:1.5cm 1.5cm 1.8cm;
  @bottom-left{content:"${teks}";font-family:Arial,sans-serif;font-size:8.5pt;color:#888;border-top:1px solid #ccc;vertical-align:top;padding-top:3pt}
  @bottom-right{content:"Halaman " counter(page) " dari " counter(pages);font-family:Arial,sans-serif;font-size:8.5pt;color:#888;border-top:1px solid #ccc;vertical-align:top;padding-top:3pt}
}`;
}

export function dokumenRaporSts(d, mode) {
  const layar = mode !== 'cetak';
  const css = layar
    ? `${PRINT_BASE}body{padding:18pt 22pt;max-width:640pt;margin:0 auto}`
    : `${cssHalaman(d)}${PRINT_BASE}`;
  const judul = `Rapor STS - ${String(d.nama || '').replace(/[\\/:*?"<>|]+/g, ' ')}`.trim();
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>${esc(judul)}</title><style>${css}</style></head><body>${badanRaporSts(d)}</body></html>`;
}

export function cetakRaporSts(d) {
  const html = dokumenRaporSts(d, 'cetak');
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  doc.open();
  doc.write(html);
  doc.close();
  const cetak = () => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } finally {
      setTimeout(() => iframe.remove(), 1000);
    }
  };
  if (iframe.contentWindow.document.readyState === 'complete') setTimeout(cetak, 250);
  else iframe.onload = () => setTimeout(cetak, 250);
}
