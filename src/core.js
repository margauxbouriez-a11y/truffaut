/* ============================================================
   CŒUR : outils, stockage, notifications, fenêtres, routeur
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const euro = (n) => (n == null ? 'Prix en magasin' : n.toFixed(2).replace('.', ',') + ' €');
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const todayISO = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };

const store = {
  get(key, fallback) { try { const v = localStorage.getItem('gj-' + key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
  set(key, value) { try { localStorage.setItem('gj-' + key, JSON.stringify(value)); return true; } catch (e) { return false; } },
};

function toast(icon, title, text = '', ms = 4200) {
  const box = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `<div class="ico" aria-hidden="true">${icon}</div><div><b>${esc(title)}</b>${text ? `<span>${esc(text)}</span>` : ''}</div>`;
  box.appendChild(el);
  while (box.children.length > 3) box.firstElementChild.remove();
  setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 320); }, ms);
}

function modal(html, { onMount, wide } = {}) {
  closeModal();
  const back = document.createElement('div');
  back.className = 'modal-back';
  back.id = 'modal-back';
  back.innerHTML = `<div class="modal" role="dialog" aria-modal="true" ${wide ? 'style="width:min(760px,100%)"' : ''}>
      <button class="close" type="button" aria-label="Fermer">×</button>${html}</div>`;
  document.body.appendChild(back);
  const box = $('.modal', back);
  back.addEventListener('click', (e) => { if (e.target === back) closeModal(); });
  $('.close', back).addEventListener('click', closeModal);
  const first = box.querySelector('button:not(.close), a, input, select');
  (first || $('.close', back)).focus();
  if (onMount) onMount(box);
  return box;
}
function closeModal() { const m = $('#modal-back'); if (m) m.remove(); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* Shared hand-drawn helpers (SVG strings) */
const INK = '#1F3A2E';
const S = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
const C = (x, y, r, fill, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="3" ${extra}/>`;
// a soft, irregular blob (for bushes, clouds, islands)
function blob(cx, cy, rx, ry, n = 9, jitter = 0.18, seed = 1) {
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (rnd() - 0.5) * jitter * 2;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    if (i === 0) d += `M${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

/* ---------- Router ---------- */
const ROUTES = {};
let current = null;
function route(path, mod) { ROUTES[path] = mod; }
function go(path) { location.hash = "#" + path; }
function render() {
  const path = (location.hash.replace(/^#\/?/, '') || '').split('?')[0];
  const mod = ROUTES[path] || ROUTES[''];
  if (current && current.unmount) current.unmount();
  closeModal();
  const view = $('#view');
  view.innerHTML = '';
  view.className = 'view view-' + (path || 'hub');
  current = mod;
  document.title = (mod.title ? mod.title + ' — ' : '') + 'Le Grand Jardin';
  $('#home-btn').hidden = !path;
  mod.mount(view);
  window.scrollTo(0, 0);
  const h = view.querySelector('h1');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}
window.addEventListener('hashchange', render);

/* ---------- Hub : la carte de l'île ---------- */
const PLACES = [
  { path: 'potager', em: '🥕', name: 'Silence ça truffe', sub: 'Ton potager virtuel qui pousse avec la météo' },
  { path: 'jardin', em: '🧺', name: 'Le jardin-boutique', sub: 'Balade-toi et cueille plantes et bulbes' },
  { path: 'bouquet', em: '💐', name: 'Mon bouquet', sub: 'Compose ton bouquet sur la table du fleuriste' },
  { path: 'noel', em: '🎄', name: 'Le village de Noël', sub: 'Un village enneigé où tout s’achète en miniature' },
  { path: 'galerie', em: '📸', name: 'Montre ton jardin', sub: 'Partage une photo, reçois un bon de réduction' },
  { path: 'clinique', em: '🔍', name: 'Ma plante est envahie', sub: 'Trouve l’intrus et le bon remède' },
];

function hubMap() {
  const sea = `<rect width="1200" height="760" fill="#A9D3DB"/><rect width="1200" height="760" fill="url(#hatchL)"/>
    <g class="wave" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7">
      <path d="M60 90 q15 -10 30 0 t30 0"/><path d="M1080 650 q15 -10 30 0 t30 0"/><path d="M120 640 q15 -10 30 0 t30 0"/><path d="M1060 120 q15 -10 30 0 t30 0"/>
    </g>`;
  const island = `<path d="${blob(600, 395, 545, 330, 14, 0.12, 7)}" fill="#EBD9A8" stroke="${INK}" stroke-width="4"/>
    <path d="${blob(600, 388, 515, 300, 14, 0.12, 7)}" fill="#A9CB86" stroke="${INK}" stroke-width="3"/>`;
  const river = `<path d="M600 95 C640 200 560 260 610 360 S700 520 640 690" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>
    <path d="M600 95 C640 200 560 260 610 360 S700 520 640 690" fill="none" stroke="#8CC3CF" stroke-width="22" stroke-linecap="round"/>
    <rect x="575" y="342" width="70" height="30" rx="6" fill="#C48A55" stroke="${INK}" stroke-width="3" transform="rotate(-8 610 357)"/>`;
  const paths = `<path d="M330 250 Q450 330 600 360 T880 270 M600 360 Q480 480 330 560 M600 360 Q760 470 900 560 M600 360 L600 420" fill="none" stroke="#E3CF9C" stroke-width="18" stroke-linecap="round" stroke-dasharray="1 0"/>`;
  const tree = (x, y, i) => `<g><rect x="${x - 5}" y="${y}" width="10" height="24" fill="#7E5432" stroke="${INK}" stroke-width="3"/><path d="${blob(x, y - 12, 32, 28, 9, .16, i + 3)}" fill="${i % 2 ? '#4E7D3A' : '#5E9446'}" stroke="${INK}" stroke-width="3"/><path d="${blob(x + 7, y - 6, 22, 18, 8, .16, i + 9)}" fill="url(#hatch)"/>${[0, 1, 2, 3].map((k) => `<path d="M${x - 16 + (k * 11)} ${y - 18 + (k % 2) * 10} q5 -6 10 0" fill="none" stroke="${INK}" stroke-width="1" opacity=".6"/>`).join('')}${i % 3 === 0 ? Deco.berries(x + 10, y - 20, '#E04E2E') : ''}</g>`;
  const trees = [[180, 400], [230, 450], [990, 400], [1040, 340], [470, 620], [760, 640], [420, 170], [800, 170], [700, 250], [140, 300]].map(([x, y], i) => tree(x, y, i)).join('');
  const cluster = (x, y, i, n = 6) => Array.from({ length: n }, (_, k) => { const a = k * 2.3 + i, r = 6 + k * 3.2, fx = x + Math.cos(a) * r, fy = y + Math.sin(a) * r * .6;
      return (k % 4 === 0 ? Deco.leaf(fx - 6, fy + 4, 13, -40 - k * 20, '#4E7D3A') : '') + (k % 3 === 2 ? Deco.tulip(fx, fy + 8, .62, ['#E04E2E', '#F0A830', '#EE9AAE'][(i + k) % 3]) : Deco.daisy(fx, fy, 10, ['#FFFFFF', '#EE9AAE', '#F0A830', '#8E7CC3', '#FFFFFF'][(i + k) % 5], '#F0A830', 9)); }).join('');
  const meadow = [[520, 470], [700, 470], [560, 560], [380, 470], [820, 420], [930, 650], [140, 470], [1080, 450], [480, 300], [740, 545], [300, 420], [1000, 200], [660, 150], [560, 205], [250, 640], [1110, 560], [820, 690], [390, 700]]
    .map(([x, y], i) => cluster(x, y, i)).join('')
    + Array.from({ length: 30 }, (_, k) => { const a = (k / 30) * Math.PI * 2; return cluster(600 + Math.cos(a) * 488, 392 + Math.sin(a) * 282, k, 3); }).join('');
  const shore = `<path d="${blob(600, 395, 545, 330, 14, 0.12, 7)}" fill="url(#dots)"/>`;
  const arch = `<g transform="translate(610 345)"><path d="M-46 14 V-26 Q0 -66 46 -26 V14" fill="none" stroke="${INK}" stroke-width="7"/><path d="M-46 14 V-26 Q0 -66 46 -26 V14" fill="none" stroke="#B98556" stroke-width="4"/>${[[-46, -10], [-40, -36], [-20, -52], [6, -55], [30, -46], [46, -22], [46, 4]].map(([x, y], k) => Deco.leaf(x, y, 12, k * 50, '#4E7D3A') + Deco.rose(x, y, 6, k % 2 ? '#EE9AAE' : '#D9475C')).join('')}</g>`;

  const sign = (x, y, label, w) => `<g class="sign" transform="translate(${x} ${y})">
      <rect x="-3" y="0" width="6" height="34" fill="#8C5A31" stroke="${INK}" stroke-width="3"/>
      <rect x="${-w / 2}" y="-32" width="${w}" height="40" rx="5" fill="#E9CFA0" stroke="${INK}" stroke-width="3"/><path d="M${-w / 2 + 8} -24 h${w * .4} M${w * .1} 2 h${w * .35}" stroke="${INK}" stroke-width=".8" opacity=".4"/>
      <text x="0" y="-3" text-anchor="middle">${label}</text></g>`;

  const potager = `<g class="bob">
      ${[0, 1, 2].map((i) => `<rect x="${250 + i * 60}" y="210" width="48" height="90" rx="10" fill="#8B5E3C" stroke="${INK}" stroke-width="3"/>
      ${[0, 1, 2].map((j) => `<path d="M${274 + i * 60} ${236 + j * 26} q-10 -14 0 -20 q10 6 0 20" fill="#5DB565" stroke="${INK}" stroke-width="2.5"/>`).join('')}`).join('')}
      <path d="M445 300 L445 220 M425 245 L465 245" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      <path d="M432 244 h26 l-4 30 h-18 z" fill="#C25B4A" stroke="${INK}" stroke-width="2"/><path d="M436 252 h18 M435 262 h20" stroke="${INK}" stroke-width="1" opacity=".5"/>
      <circle cx="445" cy="208" r="15" fill="#F3E2C0" stroke="${INK}" stroke-width="3"/><path d="M439 205 l3 3 M442 205 l-3 3 M448 205 l3 3 M451 205 l-3 3" stroke="${INK}" stroke-width="1.5"/><path d="M439 215 q6 4 12 0" stroke="${INK}" stroke-width="1.5" fill="none"/>
      <g transform="translate(470 222) rotate(10)"><path d="M0 0 c10 -10 22 -4 18 6 l-8 2 l-4 6 z" fill="#2B2B2B" stroke="${INK}" stroke-width="1.5"/><circle cx="12" cy="0" r="1.5" fill="#fff"/></g>
      <path d="M425 200 L465 200 L455 186 L435 186 Z" fill="#E7B84A" stroke="${INK}" stroke-width="3"/>
    </g>${sign(350, 320, 'Silence ça truffe', 210)}`;
  const serre = `<g class="bob">
      <path d="M770 300 L770 230 Q840 170 910 230 L910 300 Z" fill="#CFEFF6" stroke="${INK}" stroke-width="3"/>
      <path d="M793 300 L793 212 M817 300 L817 196 M840 300 L840 190 M863 300 L863 196 M887 300 L887 212 M770 262 L910 262" stroke="${INK}" stroke-width="2.5" fill="none"/>
      ${Deco.leaf(782, 296, 22, -60, '#4E7D3A')}${Deco.leaf(820, 298, 24, -110, '#5E9446')}${Deco.leaf(850, 296, 20, -70, '#4E7D3A')}${Deco.leaf(892, 298, 22, -120, '#5E9446')}
      ${Deco.rose(802, 284, 9, '#EE9AAE')}${Deco.daisy(840, 276, 9, '#FFFFFF')}${Deco.tulip(870, 300, .6, '#F0A830')}${Deco.rose(890, 282, 8, '#D9475C')}
      <path d="M770 300 L770 230 Q840 170 910 230 L910 300" fill="url(#hatchL)"/>
    </g>${sign(830, 330, 'Le jardin-boutique', 200)}`;
  const atelier = `<g class="bob" transform="translate(130 40)">
      <rect x="240" y="500" width="130" height="80" fill="#F7D9C4" stroke="${INK}" stroke-width="3"/>
      <path d="M228 504 L305 450 L382 504 Z" fill="#E86F5A" stroke="${INK}" stroke-width="3"/>
      <path d="M240 520 h130 M240 540 h130 M240 560 h130" stroke="${INK}" stroke-width=".8" opacity=".25"/><rect x="335" y="500" width="35" height="80" fill="url(#hatch)"/>
      <path d="M246 488 L364 488 M262 474 L348 474 M282 462 L330 462" stroke="${INK}" stroke-width="1" opacity=".5"/>
      <rect x="290" y="530" width="30" height="50" fill="#C48A55" stroke="${INK}" stroke-width="3"/><circle cx="314" cy="556" r="2.5" fill="${INK}"/>
      <rect x="246" y="544" width="36" height="9" fill="#B98556" stroke="${INK}" stroke-width="2"/>${Deco.daisy(252, 542, 5, '#EE9AAE', '#F0A830', 8)}${Deco.daisy(264, 540, 5, '#FFFFFF', '#F0A830', 8)}${Deco.daisy(276, 542, 5, '#F0A830', '#E04E2E', 8)}
      <rect x="250" y="520" width="28" height="24" fill="#CFEFF6" stroke="${INK}" stroke-width="3"/>
      <rect x="390" y="545" width="60" height="30" rx="5" fill="#C48A55" stroke="${INK}" stroke-width="3"/>
      ${['#F5A3BC', '#FFD35A', '#8E7BD9', '#FF8A4C'].map((c, i) => `<circle cx="${400 + i * 13}" cy="${538 - (i % 2) * 6}" r="8" fill="${c}" stroke="${INK}" stroke-width="2.5"/>`).join('')}
    </g>${sign(450, 650, 'Mon bouquet', 160)}`;
  const noel = `<g class="bob">
      <path d="${blob(905, 520, 120, 70, 10, .1, 4)}" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/>
      <rect x="850" y="490" width="44" height="40" fill="#E86F5A" stroke="${INK}" stroke-width="3"/><path d="M843 492 L872 466 L901 492 Z" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <rect x="912" y="498" width="40" height="34" fill="#5B8FD6" stroke="${INK}" stroke-width="3"/><path d="M906 500 L932 478 L958 500 Z" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <rect x="864" y="505" width="14" height="12" fill="#FFD35A" stroke="${INK}" stroke-width="2"/><rect x="925" y="510" width="12" height="10" fill="#FFD35A" stroke="${INK}" stroke-width="2"/>
      <path d="M975 530 L990 480 L1005 530 Z" fill="#3D8B4C" stroke="${INK}" stroke-width="3"/><circle cx="990" cy="478" r="5" fill="#FFD35A" stroke="${INK}" stroke-width="2"/>
    </g>${sign(905, 610, 'Le village de Noël', 210)}`;
  const galerie = `<g class="bob" transform="translate(-15 150)">
      <rect x="160" y="300" width="8" height="60" fill="#8C5A31" stroke="${INK}" stroke-width="3"/><rect x="262" y="300" width="8" height="60" fill="#8C5A31" stroke="${INK}" stroke-width="3"/>
      <rect x="150" y="240" width="130" height="80" rx="8" fill="#C48A55" stroke="${INK}" stroke-width="3"/>
      <rect x="162" y="252" width="40" height="30" fill="#BFE6A8" stroke="${INK}" stroke-width="2.5" transform="rotate(-6 182 267)"/>
      <rect x="212" y="256" width="40" height="30" fill="#FCE6A0" stroke="${INK}" stroke-width="2.5" transform="rotate(5 232 271)"/>
      <rect x="190" y="286" width="44" height="26" fill="#F7C9D6" stroke="${INK}" stroke-width="2.5"/>
    </g>${sign(200, 545, 'Montre ton jardin', 200)}`;
  const clinique = `<g class="bob" transform="translate(15 0)">
      <rect x="975" y="230" width="100" height="70" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/>
      <path d="M965 234 L1025 190 L1085 234 Z" fill="#5DB565" stroke="${INK}" stroke-width="3"/>
      <rect x="1012" y="258" width="26" height="42" fill="#C48A55" stroke="${INK}" stroke-width="3"/>
      <circle cx="1025" cy="214" r="11" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <path d="M1025 207 V221 M1018 214 H1032" stroke="${INK}" stroke-width="3"/><rect x="1045" y="234" width="30" height="66" fill="url(#hatch)"/>
      ${Deco.daisy(985, 296, 6, '#EE9AAE', '#F0A830', 8)}${Deco.daisy(998, 300, 6, '#FFFFFF', '#F0A830', 8)}${Deco.tulip(1060, 304, .5, '#E04E2E')}
      <circle cx="1095" cy="275" r="15" fill="#CFEFF6" stroke="${INK}" stroke-width="4"/><path d="M1105 287 L1120 302" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
    </g>${sign(1048, 330, 'Plante envahie ?', 180)}`;

  const clouds = `<g class="cloud"><path d="${blob(120, 70, 70, 26, 9, .2, 11)}" fill="#fff" stroke="${INK}" stroke-width="3" opacity=".95"/></g>
    <g class="cloud c2"><path d="${blob(80, 150, 55, 20, 9, .2, 21)}" fill="#fff" stroke="${INK}" stroke-width="3" opacity=".95"/></g>`;

  const place = (path, label, inner) => `<a class="place" href="#${path}" aria-label="${label}">${inner}</a>`;
  return `<svg viewBox="0 0 1200 760" role="img" aria-label="Carte de l’île du Grand Jardin">
    ${sea}${island}${shore}${river}${paths}${meadow}${trees}${arch}
    ${place('potager', 'Silence ça truffe, ton potager virtuel', potager)}
    ${place('jardin', 'Le jardin-boutique', serre)}
    ${place('bouquet', 'Mon bouquet, l’atelier du fleuriste', atelier)}
    ${place('noel', 'Le village de Noël', noel)}
    ${place('galerie', 'Montre ton jardin', galerie)}
    ${place('clinique', 'Ma plante est envahie', clinique)}
    ${clouds}
  </svg>`;
}

route('', {
  title: '',
  mount(el) {
    el.innerHTML = `<div class="hub">
      <div class="hub-intro">
        <h1>Le Grand<br>Jardin</h1>
        <p>Une île où les tomates poussent avec la vraie météo, où l’on cueille les rosiers au lieu de les commander, et où un escargot a un avis sur tout. Choisis un endroit sur la carte.</p>
        ${Deco.gaston(['Bienvenue. Je fais la visite, mais prévois la journée.', 'Le potager, c’est par là. Enfin, je crois.', 'On m’a dit qu’il y avait des churros au village de Noël.'])}
      </div>
      <div class="map-wrap">${hubMap()}</div>
      <nav class="hub-list" aria-label="Tous les espaces">
        ${PLACES.map((p) => `<a class="hub-card panel" href="#${p.path}"><span class="em" aria-hidden="true">${p.em}</span><span><b>${p.name}</b><span>${p.sub}</span></span></a>`).join('')}
        <a class="hub-card panel" href="#coulisses"><span class="em" aria-hidden="true">⚙️</span><span><b>Dans les coulisses</b><span>Les automatisations qui font tourner l’île</span></span></a>
      </nav>
    </div>`;
  },
});
