/* ============================================================
   PAGE D'ACCUEIL — plan du magasin en vue isométrique
   Survoler un espace l'entoure et ouvre sa fiche ; cliquer y entre.
   ============================================================ */
const HubMap = (() => {
  const VW = 1048, VH = 836;
  const OX = 468, OY = 238, U = 14;
  const COS = Math.cos(Math.PI / 6), SIN = .5;
  const P = (x, y, z = 0) => [OX + (x - y) * COS * U, OY + (x + y) * SIN * U - z * U];
  const pts = (a) => a.map((p) => P(...p).map((v) => v.toFixed(1)).join(',')).join(' ');
  const sh = (c, k) => Deco.shade(c, k);
  const poly = (a, fill, extra = '') => `<polygon points="${pts(a)}" fill="${fill}" ${extra}/>`;
  const G = .62; // hauteur du sol (socle)

  /* Les 7 espaces : route, numéro, couleur, nom, sous-titre, texte de la fiche, mots-clés, emprise au sol, point d'ancrage */
  const ZONES7 = [
    { r: 'jardin', n: 1, c: '#0F4D36', name: 'La grande serre', sub: 'Plantes en pot et bulbes', cta: 'Entrer dans la serre',
      txt: () => `Pépinière, ombrière et serre chaude : ${SHOP.length} plantes à cueillir en pot ou en bulbe, avec leurs vrais prix.`, tags: ['Roseraie', 'Méditerranée', 'Plantes d’intérieur', 'Bulbes'],
      foot: [[17, -.6], [42.2, -.6], [42.2, 11.6], [17, 11.6]], at: [25.5, 5.5, 6.6] },
    { r: 'potager', n: 2, c: '#C4513B', name: 'Le potager', sub: 'Il pousse avec ta météo', cta: 'Voir mon potager',
      txt: () => 'Recrée ton potager : il pousse avec la vraie météo de ta ville, et Gaston te prévient quand il a soif.', tags: ['Météo', 'Arrosage', 'Récolte'],
      foot: [[-.4, -.4], [13.4, -.4], [13.4, 12.6], [-.4, 12.6]], at: [6.5, 4.5, .9] },
    { r: 'bouquet', n: 3, c: '#D2527F', name: 'L’atelier bouquet', sub: 'Compose ton bouquet', cta: 'Composer un bouquet',
      txt: () => `${typeof STEMS !== 'undefined' ? STEMS.length : 82} fleurs et feuillages à poser sur la table du fleuriste, et 12 plantes en pot à offrir avec.`, tags: ['Roses', 'Feuillages', 'Exotiques'],
      foot: [[.4, 13.4], [8.6, 13.4], [8.6, 21.2], [.4, 21.2]], at: [4.5, 16.5, 3] },
    { r: 'noel', n: 4, c: '#2F4A8A', name: 'Le village de Noël', sub: '27 pièces Lemax', cta: 'Visiter le village',
      txt: () => 'Une balade en cinq scènes enneigées : chaque point lumineux ouvre une pièce du village vendue chez Truffaut.', tags: ['5 scènes', 'Lemax'],
      foot: [[29.6, 24.6], [42.4, 24.6], [42.4, 32.4], [29.6, 32.4]], at: [36, 28.5, 2.6] },
    { r: 'galerie', n: 5, c: '#C9962E', name: 'La galerie', sub: 'Ton jardin en photo', cta: 'Voir la galerie',
      txt: () => 'Publie une photo de ton jardin ou de ton potager sur le mur des jardiniers, et reçois un bon de réduction.', tags: ['Photos', 'Bon offert'],
      foot: [[18.6, 13.6], [27.4, 13.6], [27.4, 19.4], [18.6, 19.4]], at: [23, 16.5, 3] },
    { r: 'clinique', n: 6, c: '#1F7F8C', name: 'La clinique des plantes', sub: 'Une tache ? Trouve l’intrus', cta: 'Soigner ma plante',
      txt: () => '14 ravageurs et maladies en images : trouve le coupable, puis le remède doux, le remède fort et les plantes résistantes.', tags: ['Ravageurs', 'Remèdes'],
      foot: [[28.6, 13.6], [34.4, 13.6], [34.4, 18.4], [28.6, 18.4]], at: [31.5, 16, 3.4] },
    { r: 'coulisses', n: 7, c: '#6B7670', name: 'Les coulisses', sub: 'Ce qui fait tourner le magasin', cta: 'Voir les coulisses',
      txt: () => 'Les automatisations derrière le site : météo, alertes, catalogue synchronisé, bons envoyés automatiquement.', tags: ['n8n', 'Automatisations'],
      foot: [[35.6, 13.6], [41.4, 13.6], [41.4, 19.4], [35.6, 19.4]], at: [38.5, 16.5, 3] },
  ];

  /* ---------- briques de dessin ---------- */
  const f1 = (v) => v.toFixed(1);
  function box(x, y, w, d, h, c, { z = 0, top = null, front = null, side = null } = {}) {
    return poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], front || sh(c, -.18))
      + poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], side || sh(c, -.32))
      + poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], top || c);
  }
  // maison à toit à deux pentes ; ridge 'x' = faîtage parallèle à x (pignon visible à droite), 'y' = pignon visible devant
  function gable(x, y, w, d, h, rh, wall, roof, { z = G, ridge = 'y', edge = null, o = .18 } = {}) {
    const t = z + h, r = t + rh; let s = '';
    if (ridge === 'y') {
      const m = x + w / 2;
      s += poly([[x - o, y - o, t - .1], [m, y - o, r], [m, y + d + o, r], [x - o, y + d + o, t - .1]], sh(roof, .14));          // pente gauche (arrière)
      s += poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [m, y + d, r], [x, y + d, t]], sh(wall, -.12));           // pignon avant
      s += poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]], sh(wall, -.3));                          // mur droit
      s += poly([[m, y - o, r], [x + w + o, y - o, t - .1], [x + w + o, y + d + o, t - .1], [m, y + d + o, r]], roof);          // pente droite
      if (edge) s += `<polyline points="${pts([[x - o, y + d + o, t - .1], [m, y + d + o, r], [x + w + o, y + d + o, t - .1]])}" fill="none" stroke="${edge}" stroke-width="2.2" stroke-linejoin="round"/>`;
    } else {
      const m = y + d / 2;
      s += poly([[x - o, y - o, t - .1], [x + w + o, y - o, t - .1], [x + w + o, m, r], [x - o, m, r]], sh(roof, .14));
      s += poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, m, r], [x + w, y, t]], sh(wall, -.3));
      s += poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]], sh(wall, -.12));
      s += poly([[x - o, m, r], [x + w + o, m, r], [x + w + o, y + d + o, t - .1], [x - o, y + d + o, t - .1]], roof);
      if (edge) s += `<polyline points="${pts([[x - o, y + d + o, t - .1], [x + w + o, y + d + o, t - .1]])}" fill="none" stroke="${edge}" stroke-width="2.2"/>`;
    }
    return s;
  }
  // rectangle sur une façade : 'f' = façade avant (y fixe), 'r' = façade droite (x fixe)
  const pane = (face, k, a0, a1, z0, z1, c, extra = '') => poly(face === 'f' ? [[a0, k, z0], [a1, k, z0], [a1, k, z1], [a0, k, z1]] : [[k, a0, z0], [k, a1, z0], [k, a1, z1], [k, a0, z1]], c, extra);
  const shadow = (x, y, w, d, k = 1.2) => poly([[x + k, y + k, G], [x + w + k * 1.6, y + k, G], [x + w + k * 1.6, y + d + k * 1.6, G], [x + k, y + d + k * 1.6, G]], '#3B4A3F', 'opacity=".12"');
  function tree(x, y, r = 1, c = '#5E9A5A') {
    const [a, b] = P(x, y, G);
    return `<ellipse cx="${f1(a)}" cy="${f1(b)}" rx="${f1(r * U * 1.1)}" ry="${f1(r * U * .55)}" fill="#000" opacity=".1"/><rect x="${f1(a - 1.5)}" y="${f1(b - r * U * 1.3)}" width="3" height="${f1(r * U * 1.3)}" fill="#7A5B3E"/><circle cx="${f1(a)}" cy="${f1(b - r * U * 1.7)}" r="${f1(r * U * .95)}" fill="${c}"/><circle cx="${f1(a - r * U * .3)}" cy="${f1(b - r * U * 2)}" r="${f1(r * U * .5)}" fill="${sh(c, .22)}"/>`;
  }
  function fir(x, y, s = 1, { snow = true, c = '#2F6B45' } = {}) {
    const [a, b] = P(x, y, G), H = 34 * s, W = 13 * s; let o = `<ellipse cx="${f1(a)}" cy="${f1(b)}" rx="${f1(W * .9)}" ry="${f1(W * .38)}" fill="#000" opacity=".1"/><rect x="${f1(a - 1.6 * s)}" y="${f1(b - 6 * s)}" width="${f1(3.2 * s)}" height="${f1(6 * s)}" fill="#6B4A30"/>`;
    [[0, 1], [.3, .78], [.56, .55]].forEach(([k, wk]) => { const yb = b - 5 * s - H * k, yt = yb - H * .5; o += `<polygon points="${f1(a)},${f1(yt)} ${f1(a - W * wk)},${f1(yb)} ${f1(a + W * wk)},${f1(yb)}" fill="${c}"/><polygon points="${f1(a)},${f1(yt)} ${f1(a + W * wk)},${f1(yb)} ${f1(a)},${f1(yb)}" fill="${sh(c, -.22)}"/>`; if (snow) o += `<path d="M${f1(a - W * wk * .8)} ${f1(yb - 1)}q${f1(W * wk * .4)} -3 ${f1(W * wk * .8)} 0q${f1(W * wk * .4)} -3 ${f1(W * wk * .8)} 0" fill="none" stroke="#fff" stroke-width="${f1(2 * s)}" stroke-linecap="round"/>`; });
    return o;
  }
  const dot = (x, y, z, r, c, extra = '') => { const [a, b] = P(x, y, z); return `<circle cx="${f1(a)}" cy="${f1(b)}" r="${r}" fill="${c}" ${extra}/>`; };
  function garland(p0, p1, n, cols = ['#FFD36B', '#F25C54', '#7CC6FE', '#FFD36B', '#8BE38B']) {
    let o = ''; for (let i = 0; i <= n; i++) { const t = i / n; o += dot(p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, p0[2] + (p1[2] - p0[2]) * t - Math.sin(t * Math.PI * 2) * .05, 1.6, cols[i % cols.length]); }
    return o;
  }
  function lamp(x, y, warm = false) {
    const [a, b] = P(x, y, G), [, t] = P(x, y, G + 2.6);
    return `${warm ? `<circle cx="${f1(a)}" cy="${f1(t)}" r="12" fill="#FFE7A3" opacity=".45"/>` : ''}<line x1="${f1(a)}" y1="${f1(b)}" x2="${f1(a)}" y2="${f1(t)}" stroke="#3B4542" stroke-width="1.8"/><rect x="${f1(a - 4)}" y="${f1(t - 3)}" width="8" height="4" rx="1.5" fill="#3B4542"/><ellipse cx="${f1(a)}" cy="${f1(t + 2)}" rx="3.2" ry="1.4" fill="${warm ? '#FFD36B' : '#FFF6D0'}"/>`;
  }
  // voiture garée, longueur selon y
  function car(x, y, c) {
    let o = poly([[x - .1, y - .1, G + .13], [x + 1.4, y - .1, G + .13], [x + 1.4, y + 2.4, G + .13], [x - .1, y + 2.4, G + .13]], '#000', 'opacity=".16"');
    o += box(x, y, 1.3, 2.3, .45, c, { z: G + .2 });
    o += box(x + .1, y + .55, 1.1, 1.25, .36, c, { z: G + .65, front: '#2E3D49', side: '#3C5060', top: sh(c, .08) });
    o += pane('f', y + 2.3, x + .15, x + .35, G + .45, G + .55, '#FFF5C2') + pane('f', y + 2.3, x + .95, x + 1.15, G + .45, G + .55, '#FFF5C2');
    [[x + 1.3, y + .4], [x + 1.3, y + 1.9]].forEach(([wx, wy]) => { o += dot(wx, wy, G + .22, 2.6, '#1E2422'); });
    return o;
  }
  function person(x, y, c, cartOn = false) {
    const [a, b] = P(x, y, G);
    let o = `<ellipse cx="${f1(a)}" cy="${f1(b)}" rx="4" ry="1.6" fill="#000" opacity=".15"/><rect x="${f1(a - 2.2)}" y="${f1(b - 11)}" width="4.4" height="11" rx="2.2" fill="${c}"/><circle cx="${f1(a)}" cy="${f1(b - 13.5)}" r="2.6" fill="#F0C9A8"/><path d="M${f1(a - 2.6)} ${f1(b - 14.5)}a2.6 2.6 0 0 1 5.2 0" fill="#3A2A20"/>`;
    if (cartOn) { const [c1, d1] = P(x + .55, y, G); o += `<rect x="${f1(c1 - 1)}" y="${f1(d1 - 7)}" width="8" height="5" rx="1" fill="none" stroke="#7D8681" stroke-width="1.3"/><circle cx="${f1(c1)}" cy="${f1(d1 - 1)}" r="1.1" fill="#3B4542"/><circle cx="${f1(c1 + 6)}" cy="${f1(d1 - 1)}" r="1.1" fill="#3B4542"/><circle cx="${f1(c1 + 3)}" cy="${f1(d1 - 7)}" r="2.2" fill="#5E9A5A"/>`; }
    return o;
  }
  // texte posé sur une façade (avant : le long de x ; droite : le long de y)
  function facadeText(face, k, a0, a1, z, txt, size = 11, col = '#fff', font = 'DM Sans, sans-serif', weight = 700) {
    const p0 = face === 'f' ? P(a0, k, z) : P(k, a0, z), p1 = face === 'f' ? P(a1, k, z) : P(k, a1, z);
    const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180 / Math.PI;
    return `<text transform="translate(${f1((p0[0] + p1[0]) / 2)} ${f1((p0[1] + p1[1]) / 2)}) skewY(${ang.toFixed(1)})" text-anchor="middle" font-family="${font}" font-weight="${weight}" font-size="${size}" letter-spacing=".04em" fill="${col}">${txt}</text>`;
  }

  /* ---------- décor (non cliquable) ---------- */
  function ground() {
    let o = box(-4, -4, 48, 38, G, '#D9C9A6', { top: '#BFD69C' });
    for (let i = 0; i < 260; i++) o += dot(-2 + ((i * 37) % 440) / 10, -2 + ((i * 53) % 340) / 10, G, 1, '#93B86C');
    for (let i = 0; i < 44; i += 1.2) o += box(-3.4 + i, -3.4, 1.1, .8, .9, '#5E9A4E', { z: G, top: '#78B45F' });
    for (let i = 0; i < 34; i += 1.2) o += box(42.6, -3.4 + i, .8, 1.1, .9, '#5E9A4E', { z: G, top: '#78B45F' });
    // allées principales (pavés clairs) et parvis
    o += poly([[14, 22, G], [42, 22, G], [42, 24.5, G], [14, 24.5, G]], '#EFE3C8') + poly([[14, -2, G], [16.5, -2, G], [16.5, 33, G], [14, 33, G]], '#EFE3C8');
    for (let i = 0; i < 28; i++) o += dot(14.6 + i, 23.25, G, 1, '#D8C7A2');
    o += poly([[13.2, 20.6, G + .01], [17.6, 20.6, G + .01], [17.6, 25.2, G + .01], [13.2, 25.2, G + .01]], '#E6D6B4');
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if ((i + j) % 2) o += poly([[13.2 + i * .88, 20.6 + j * .92, G + .02], [14.08 + i * .88, 20.6 + j * .92, G + .02], [14.08 + i * .88, 21.52 + j * .92, G + .02], [13.2 + i * .88, 21.52 + j * .92, G + .02]], '#DCCAA4');
    o += parking();
    // passage piéton entre le parking et le parvis
    for (let i = 0; i < 6; i++) o += poly([[13.25, 26.4 + i * .42, G + .03], [14, 26.4 + i * .42, G + .03], [14, 26.62 + i * .42, G + .03], [13.25, 26.62 + i * .42, G + .03]], '#F7F7F2');
    // bassin
    let d = ''; for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; const [x, y] = P(26 + Math.cos(a) * 2.6, 20.2 + Math.sin(a) * 1.4, G); d += (k ? 'L' : 'M') + f1(x) + ' ' + f1(y); }
    o += `<path d="${d}Z" fill="#8EC6D6" stroke="#6FAFC2" stroke-width="2"/>`;
    o += dot(25.2, 20, G + .02, 3.2, '#7FC07A') + dot(26.8, 20.6, G + .02, 2.6, '#7FC07A') + dot(26.8, 20.6, G + .05, 1.2, '#F3A6B8');
    // massifs fleuris le long de l'allée
    [[17.8, 21.2, 7.6], [30, 21.2, 9]].forEach(([x, y, w]) => { o += box(x, y, w, .7, .25, '#8A5A36', { z: G, top: '#6B4A30' }); for (let k = 0; k < w * 3; k++) o += dot(x + .2 + k * .33, y + .35, G + .32, 2.6, ['#E85B7A', '#F2C44E', '#9C7FD6', '#F6F1F4', '#E86B4F'][k % 5]); });
    return o;
  }
  function parking() {
    const X0 = -1.8, X1 = 13.2, Y0 = 22.2, Y1 = 32.2, A = G + .12;
    let o = box(X0, Y0, X1 - X0, Y1 - Y0, .12, '#D6D3CA', { z: G, top: '#5F6564' });
    // bandes de places (2 rangées de 7) et allée de circulation
    for (let i = 0; i <= 7; i++) { const x = X0 + .4 + i * 2; [[Y0 + .3, Y0 + 2.9], [Y1 - 2.9, Y1 - .3]].forEach(([a, b]) => { o += poly([[x, a, A], [x + .08, a, A], [x + .08, b, A], [x, b, A]], '#F2F2EC'); }); }
    o += poly([[X0 + .4, Y0 + 2.9, A], [X0 + 14.48, Y0 + 2.9, A], [X0 + 14.48, Y0 + 2.98, A], [X0 + .4, Y0 + 2.98, A]], '#F2F2EC') + poly([[X0 + .4, Y1 - 2.98, A], [X0 + 14.48, Y1 - 2.98, A], [X0 + 14.48, Y1 - 2.9, A], [X0 + .4, Y1 - 2.9, A]], '#F2F2EC');
    // flèches au sol
    [2, 7.5].forEach((x) => { const y = (Y0 + Y1) / 2; o += poly([[x, y - .14, A], [x + 1.3, y - .14, A], [x + 1.3, y - .38, A], [x + 1.9, y, A], [x + 1.3, y + .38, A], [x + 1.3, y + .14, A], [x, y + .14, A]], '#F2F2EC'); });
    // place PMR
    o += poly([[X0 + 12.48, Y0 + .3, A + .005], [X0 + 14.4, Y0 + .3, A + .005], [X0 + 14.4, Y0 + 2.9, A + .005], [X0 + 12.48, Y0 + 2.9, A + .005]], '#3D6FB6', 'opacity=".75"');
    // voitures
    const colors = ['#C04A3A', '#E9E7E1', '#3D5A8C', '#2F3A36', '#7FA7C9', '#E7B84A', '#9AA39E', '#E9E7E1'];
    [0, 1, 3, 4, 6].forEach((i, k) => { o += car(X0 + .75 + i * 2, Y0 + .45, colors[k]); });
    [1, 2, 4, 5].forEach((i, k) => { o += car(X0 + .75 + i * 2, Y1 - 2.75, colors[k + 4]); });
    // îlots plantés, lampadaires, abri à chariots, panneau P
    o += box(X0 + .1, (Y0 + Y1) / 2 - .5, .8, 1, .2, '#7F8A6E', { z: A, top: '#86B866' }) + tree(X0 + .5, (Y0 + Y1) / 2, .75, '#5E9A5A');
    o += lamp(4.2, (Y0 + Y1) / 2) + lamp(10.2, (Y0 + Y1) / 2);
    const cx = 11.2, cy = Y1 - 2.7;
    o += box(cx, cy, 1.6, 2.2, .06, '#A9B0AD', { z: A }) + poly([[cx, cy + 2.2, A + 1.1], [cx + 1.6, cy + 2.2, A + 1.1], [cx + 1.6, cy, A + 1.1], [cx, cy, A + 1.1]], '#2EBB99', 'opacity=".85"');
    for (let k = 0; k < 4; k++) o += box(cx + .2, cy + .2 + k * .45, 1.1, .35, .5, '#C9CECB', { z: A, top: '#E4E7E5' });
    [[cx, cy + 2.2], [cx + 1.6, cy + 2.2], [cx + 1.6, cy]].forEach(([px, py]) => { o += `<polyline points="${pts([[px, py, A], [px, py, A + 1.1]])}" stroke="#55605B" stroke-width="1.4" fill="none"/>`; });
    const [pa, pb] = P(X0 + .2, Y0 - .2, G), [, pt] = P(X0 + .2, Y0 - .2, G + 2.4);
    o += `<line x1="${f1(pa)}" y1="${f1(pb)}" x2="${f1(pa)}" y2="${f1(pt + 10)}" stroke="#55605B" stroke-width="2"/><rect x="${f1(pa - 10)}" y="${f1(pt - 10)}" width="20" height="20" rx="3" fill="#2F5DA8" stroke="#fff" stroke-width="1.5"/><text x="${f1(pa)}" y="${f1(pt + 5)}" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="15" fill="#fff">P</text>`;
    return o;
  }
  function entrance() {
    // auvent d'entrée au-dessus de l'allée + totem
    let o = '';
    [[13.6, 21], [16.9, 21]].forEach(([x, y]) => { o += box(x, y, .22, .22, 2.4, '#0F4D36', { z: G }); });
    o += box(13.4, 20.6, 3.9, 1.0, .28, '#0F4D36', { z: G + 2.4, top: '#2EBB99' });
    o += facadeText('f', 21.6, 13.4, 17.3, G + 2.45, 'ENTRÉE', 9.5);
    // jardinières de part et d'autre
    [[13.3, 24.4], [16.8, 24.4]].forEach(([x, y]) => { o += box(x, y, .7, .7, .4, '#C46A43', { z: G }); o += dot(x + .35, y + .35, G + .65, 5, '#5E9A5A') + dot(x + .2, y + .3, G + .8, 2, '#F3A6B8') + dot(x + .5, y + .45, G + .78, 2, '#F2C44E'); });
    const [a, b] = P(18.7, 25.4, G), [, t] = P(18.7, 25.4, G + 3.2);
    o += `<rect x="${f1(a - 8)}" y="${f1(t)}" width="16" height="${f1(b - t)}" rx="2" fill="#0F4D36"/><circle cx="${f1(a)}" cy="${f1(t + 12)}" r="6" fill="#2EBB99"/><path d="M${f1(a - 3)} ${f1(t + 15)}c0-4 3-6 6-6-1 4-3 6-6 6z" fill="#fff"/><text x="${f1(a)}" y="${f1(t + 30)}" text-anchor="middle" font-family="Brygada 1918, serif" font-weight="700" font-size="7" fill="#fff">LE</text><text x="${f1(a)}" y="${f1(t + 39)}" text-anchor="middle" font-family="Brygada 1918, serif" font-weight="700" font-size="6" fill="#fff">GRAND</text><text x="${f1(a)}" y="${f1(t + 47)}" text-anchor="middle" font-family="Brygada 1918, serif" font-weight="700" font-size="6" fill="#fff">JARDIN</text>`;
    return o;
  }
  function people() {
    return [[15.2, 9, '#2EBB99', 1], [15.4, 17, '#C4513B', 0], [20, 22.8, '#2F4A8A', 1], [26, 23.3, '#E7B84A', 0], [32, 23, '#D2527F', 1], [12.6, 27.6, '#1F7F8C', 1], [6, 27.4, '#6B7670', 0], [15.6, 25.6, '#8E72C8', 1]]
      .map(([x, y, c, k]) => person(x, y, c, !!k)).join('');
  }
  const trees = () => [[-1, 12], [-1, 15], [14.8, 1], [14.8, 6], [14.8, 11], [14.8, 15], [14.8, 19], [28, 20.3], [12, 12], [24, 12], [28.5, 12.2]]
    .map(([x, y], i) => tree(x, y, .8 + (i % 3) * .15, ['#5E9A5A', '#4E8A4C', '#6FA764'][i % 3])).join('')
    + [[16.6, 4], [16.6, 12], [16.6, 19.6]].map(([x, y]) => lamp(x, y)).join('');

  /* ---------- les espaces ---------- */
  const DRAWZ = {
    jardin() {
      let o = shadow(17.5, 0, 16, 11) + box(17.5, 0, 16, 11, .5, '#F1F3F0', { z: G });
      const gx = 17.5, gy = 0, gw = 16, gd = 11, gh = 4.8, z0 = G + .5;
      o += poly([[gx, gy + gd, z0], [gx + gw, gy + gd, z0], [gx + gw, gy + gd, gh], [gx, gy + gd, gh]], '#CFE6EC', 'opacity=".9"');
      o += poly([[gx + gw, gy, z0], [gx + gw, gy + gd, z0], [gx + gw, gy + gd, gh], [gx + gw, gy, gh]], '#B7D3DC', 'opacity=".9"');
      for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) { const x = gx + 1 + k * 2.5, y = gy + 1.2 + r * 2.5; o += box(x, y, 2, 1.4, .5, '#C9A06A', { z: z0, top: '#D8B27A' }); for (let q = 0; q < 4; q++) o += dot(x + .4 + (q % 2) * 1.1, y + .35 + Math.floor(q / 2) * .65, z0 + .6, U * .35, ['#4F9A4C', '#E06A8E', '#63A94F', '#F2C44E'][(r + k + q) % 4]); }
      for (let i = 0; i <= 8; i++) { const x = gx + i * 2; o += poly([[x, gy + gd, z0], [x + .08, gy + gd, z0], [x + .08, gy + gd, gh], [x, gy + gd, gh]], '#FFFFFF'); }
      for (let i = 0; i <= 5; i++) { const y = gy + i * 2.2; o += poly([[gx + gw, y, z0], [gx + gw, y + .08, z0], [gx + gw, y + .08, gh], [gx + gw, y, gh]], '#FFFFFF'); }
      for (let i = 0; i < 4; i++) { const x = gx + i * 4; o += poly([[x, gy, gh], [x + 2, gy, gh + 1.6], [x + 2, gy + gd, gh + 1.6], [x, gy + gd, gh]], '#DDEEF2', 'opacity=".75" stroke="#FFFFFF" stroke-width="1.2"') + poly([[x + 2, gy, gh + 1.6], [x + 4, gy, gh], [x + 4, gy + gd, gh], [x + 2, gy + gd, gh + 1.6]], '#C2DDE6', 'opacity=".85" stroke="#FFFFFF" stroke-width="1.2"'); }
      const [a, b] = P(gx + 4, gy + gd, gh - .1), [c2, d2] = P(gx + 12, gy + gd, gh - .1), ang = Math.atan2(d2 - b, c2 - a) * 180 / Math.PI;
      o += `<polygon points="${a},${b} ${c2},${d2} ${c2},${d2 + 17} ${a},${b + 17}" fill="#0F4D36"/><text transform="translate(${(a + c2) / 2} ${(b + d2) / 2 + 12.5}) skewY(${ang.toFixed(1)})" text-anchor="middle" font-family="Brygada 1918, serif" font-weight="600" font-size="11.5" fill="#fff">La grande serre</text>`;
      // ombrière (pépinière extérieure)
      o += shadow(34.5, 0, 7, 11, .6);
      for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) { const x = 35 + k * 3.2, y = .8 + r * 2.6; for (let q = 0; q < 6; q++) o += dot(x + (q % 3) * .9, y + Math.floor(q / 3) * .9, G + .4, U * .4, ['#3F7D3A', '#F3A6B8', '#5E9A5A', '#C8243C', '#8FA47E', '#9C7FD6'][(q + r + k) % 6]); }
      [[34.6, .2], [41.4, .2], [34.6, 10.8], [41.4, 10.8]].forEach(([x, y]) => { o += poly([[x, y, G], [x + .15, y, G], [x + .15, y, G + 3], [x, y, G + 3]], '#5E6662'); });
      return o + poly([[34.5, 0, G + 3], [41.5, 0, G + 3], [41.5, 11, G + 3], [34.5, 11, G + 3]], '#1E3B2C', 'opacity=".55"');
    },
    potager() {
      let o = poly([[0, 0, G], [13, 0, G], [13, 9.4, G], [0, 9.4, G]], '#D9C59C');
      for (let r = 0; r < 4; r++) {
        o += box(.8, .8 + r * 2.1, 9.6, 1.3, .4, '#8A5A36', { z: G, top: '#6B4A30' });
        for (let k = 0; k < 9; k++) { const c = ['#5DA14E', '#E2483A', '#7FBF5A', '#F09A3A'][r]; o += dot(1.3 + k * 1.05, 1.45 + r * 2.1, G + .5, U * .3, '#4E8A3E') + dot(1.3 + k * 1.05, 1.45 + r * 2.1, G + .7, U * .16, c); }
      }
      // tunnel de culture
      o += box(10.9, .8, 1.6, 7.6, .1, '#E9E3D3', { z: G });
      for (let i = 0; i < 6; i++) { const y = .8 + i * 1.52; o += `<path d="${(() => { const a = P(10.9, y, G), b = P(11.7, y, G + 1.4), c = P(12.5, y, G); return `M${f1(a[0])} ${f1(a[1])}Q${f1(b[0])} ${f1(b[1] - 14)} ${f1(c[0])} ${f1(c[1])}`; })()}" fill="none" stroke="#FFFFFF" stroke-width="1.6" opacity=".9"/>`; }
      o += poly([[12.5, .8, G], [12.5, 8.4, G], [12.5, 8.4, G + .9], [12.5, .8, G + .9]], '#DCEFF2', 'opacity=".6"');
      // clôture en piquets (côtés visibles)
      for (let x = 0; x < 13; x += .55) o += box(x, 9.3, .1, .1, .7, '#F4EFE4', { z: G });
      for (let y = 0; y < 9.4; y += .55) o += box(12.9, y, .1, .1, .7, '#F4EFE4', { z: G });
      o += poly([[0, 9.4, G + .5], [13, 9.4, G + .5], [13, 9.4, G + .58], [0, 9.4, G + .58]], '#E3DCCB') + poly([[13, 0, G + .5], [13, 9.4, G + .5], [13, 9.4, G + .58], [13, 0, G + .58]], '#D3CBB8');
      // cabane de jardin et composteur
      o += shadow(.6, 10.2, 3, 2.2, .5) + gable(.6, 10.2, 3, 2.2, 1.5, 1.0, '#B78E5E', '#8F3D2E', { ridge: 'x' });
      o += pane('f', 12.4, 1.6, 2.3, G, G + 1.2, '#6B4A30') + pane('f', 12.4, 2.7, 3.3, G + .7, G + 1.2, '#CFE6EC');
      o += box(4.4, 10.6, 1.2, 1.2, .7, '#7A5B3E', { z: G, top: '#4E3A26' });
      return o;
    },
    bouquet() {
      let o = shadow(1, 14, 7, 5) + box(1, 14, 7, 5, 2.6, '#F7F1E8', { z: G, top: '#E9E1D3' });
      // vitrines et porte sur la façade avant
      o += pane('f', 19, 1.5, 3.6, G + .35, G + 1.9, '#CFE6EC') + pane('f', 19, 5.4, 7.5, G + .35, G + 1.9, '#CFE6EC') + pane('f', 19, 4, 5, G, G + 1.9, '#2F5045');
      for (let i = 0; i < 6; i++) o += dot(1.8 + i * .32, 19, G + .55, 2.2, ['#E85B7A', '#F2C44E', '#F6F1F4'][i % 3]) + dot(5.7 + i * .32, 19, G + .55, 2.2, ['#C8243C', '#F3A6B8', '#9C7FD6'][i % 3]);
      o += pane('r', 8, 14.6, 18.2, G + .4, G + 1.9, '#BFD9E0');
      // enseigne
      o += pane('f', 19, 1, 8, G + 2.1, G + 2.6, '#D2527F') + facadeText('f', 19, 1, 8, G + 2.2, 'ATELIER BOUQUET', 9.5);
      // store rayé
      for (let i = 0; i < 6; i++) o += poly([[1 + i * 7 / 6, 19, G + 2.05], [1 + (i + 1) * 7 / 6, 19, G + 2.05], [1 + (i + 1) * 7 / 6, 20, G + 1.6], [1 + i * 7 / 6, 20, G + 1.6]], i % 2 ? '#FFFFFF' : '#D2527F');
      // étal de seaux en gradins
      o += box(1.3, 20.3, 6.4, .55, .3, '#B48C60', { z: G }) + box(1.3, 20.85, 6.4, .55, .15, '#B48C60', { z: G });
      for (let k = 0; k < 10; k++) { const x = 1.6 + k * .64; o += dot(x, 20.55, G + .5, 3.6, '#AEB8BC') + dot(x - .08, 20.5, G + .8, 3.2, ['#E85B7A', '#F2C44E', '#F6F1F4', '#C8243C', '#F3A6B8', '#9C7FD6', '#E86B4F'][k % 7]) + dot(x + .12, 20.6, G + .78, 2.6, ['#F3A6B8', '#E85B7A', '#F2C44E', '#9C7FD6', '#F6F1F4'][k % 5]); }
      return o;
    },
    noel() {
      const S = G + .06;
      let o = box(29.6, 24.6, 12.8, 7.8, .06, '#E6EDF3', { z: G, top: '#F4F8FB' });
      // reflets de neige
      for (let i = 0; i < 40; i++) o += dot(29.8 + ((i * 37) % 124) / 10, 24.8 + ((i * 53) % 74) / 10, S, 1.2, '#DCE7F0');
      // allée damée en boucle
      let d = ''; for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2; const [x, y] = P(35.8 + Math.cos(a) * 3.6, 28.4 + Math.sin(a) * 2.3, S); d += (k ? 'L' : 'M') + f1(x) + ' ' + f1(y); }
      o += `<path d="${d}" fill="none" stroke="#E3DCCF" stroke-width="9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#EDE7DC" stroke-width="6"/>`;
      o += poly([[35.2, 30.6, S], [36.4, 30.6, S], [36.4, 32.4, S], [35.2, 32.4, S]], '#EDE7DC');
      // patinoire
      let r = ''; for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; const [x, y] = P(32.1 + Math.cos(a) * 1.5, 30.6 + Math.sin(a) * .95, S + .02); r += (k ? 'L' : 'M') + f1(x) + ' ' + f1(y); }
      o += `<path d="${r}Z" fill="#BFE3F2" stroke="#FFFFFF" stroke-width="3"/><path d="${r}Z" fill="none" stroke="#9CCBE0" stroke-width="1" stroke-dasharray="3 4"/>`;
      o += person(31.6, 30.4, '#C0392B') + person(32.7, 30.9, '#2F4A8A');
      // chalets : toit enneigé, fenêtres allumées, guirlandes
      const chalets = [[30.3, 25.1, '#B97A4E'], [33, 25, '#A86B43'], [38.6, 25.1, '#B97A4E'], [39.6, 28.9, '#A86B43']];
      chalets.forEach(([x, y, w]) => {
        const W = 2.2, D = 2.0, H = 1.25, RH = .95;
        o += shadow(x, y, W, D, .4) + gable(x, y, W, D, H, RH, w, '#F5F8FB', { ridge: 'y', edge: '#C9D6E2', z: S });
        o += pane('f', y + D, x + .25, x + .75, S + .45, S + .95, '#FFD36B', 'filter="url(#pm-glow)"') + pane('f', y + D, x + 1.45, x + 1.95, S + .45, S + .95, '#FFD36B', 'filter="url(#pm-glow)"');
        o += pane('f', y + D, x + .9, x + 1.3, S, S + .95, '#5A3420') + pane('r', x + W, y + .5, y + 1.5, S + .5, S + .9, '#FFC94F');
        o += garland([x - .1, y + D + .2, S + H], [x + W / 2, y + D + .2, S + H + RH - .05], 6) + garland([x + W / 2, y + D + .2, S + H + RH - .05], [x + W + .1, y + D + .2, S + H], 6);
        o += pane('f', y + D, x + .2, x + 2, S + 1.05, S + 1.2, '#C0392B');
      });
      // grand sapin décoré au centre, cadeaux
      const [ta, tb] = P(35.8, 28.3, S); const H = 76, W = 29;
      o += `<ellipse cx="${f1(ta)}" cy="${f1(tb)}" rx="30" ry="11" fill="#000" opacity=".1"/><rect x="${f1(ta - 4)}" y="${f1(tb - 12)}" width="8" height="12" fill="#6B4A30"/>`;
      [[0, 1], [.27, .8], [.5, .6], [.7, .38]].forEach(([k, wk]) => { const yb = tb - 10 - H * k, yt = yb - H * .42; o += `<polygon points="${f1(ta)},${f1(yt)} ${f1(ta - W * wk)},${f1(yb)} ${f1(ta + W * wk)},${f1(yb)}" fill="#2F6B45"/><polygon points="${f1(ta)},${f1(yt)} ${f1(ta + W * wk)},${f1(yb)} ${f1(ta)},${f1(yb)}" fill="#245637"/><path d="M${f1(ta - W * wk * .85)} ${f1(yb - 1)}q${f1(W * wk * .42)} -4 ${f1(W * wk * .85)} 0q${f1(W * wk * .42)} -4 ${f1(W * wk * .85)} 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`; });
      for (let i = 0; i < 22; i++) { const t = (i * .37) % 1, k = .1 + (i * .61) % .85, w = W * (1 - k * .75) * .8; o += `<circle cx="${f1(ta + (t - .5) * 2 * w)}" cy="${f1(tb - 14 - H * k * .98)}" r="2.3" fill="${['#F25C54', '#FFD36B', '#7CC6FE', '#F6F1F4', '#E7B84A'][i % 5]}"/>`; }
      o += `<polygon points="${f1(ta)},${f1(tb - H * 1.2 - 16)} ${f1(ta + 3)},${f1(tb - H * 1.2 - 8)} ${f1(ta + 10)},${f1(tb - H * 1.2 - 7)} ${f1(ta + 4)},${f1(tb - H * 1.2 - 2)} ${f1(ta + 6)},${f1(tb - H * 1.2 + 5)} ${f1(ta)},${f1(tb - H * 1.2 + 1)} ${f1(ta - 6)},${f1(tb - H * 1.2 + 5)} ${f1(ta - 4)},${f1(tb - H * 1.2 - 2)} ${f1(ta - 10)},${f1(tb - H * 1.2 - 7)} ${f1(ta - 3)},${f1(tb - H * 1.2 - 8)}" fill="#FFD36B" filter="url(#pm-glow)"/>`;
      [[35.1, 28.9, '#C0392B'], [36.3, 29, '#2F4A8A'], [36.6, 28.4, '#E7B84A'], [35, 28.2, '#2EBB99']].forEach(([x, y, c]) => { o += box(x, y, .45, .45, .4, c, { z: S }) + poly([[x + .2, y, S + .4], [x + .25, y, S + .4], [x + .25, y + .45, S + .4], [x + .2, y + .45, S + .4]], '#fff'); });
      // sapins enneigés, lampadaires chauds
      [[29.9, 24.9, .8], [42, 24.9, .9], [42, 32, .8], [29.9, 32.1, .7], [36.8, 24.9, .75], [41.8, 27.6, .7]].forEach(([x, y, s]) => { o += fir(x, y, s); });
      o += lamp(33.4, 27.8, true) + lamp(38.4, 28.1, true) + lamp(34.6, 31.6, true) + lamp(37.2, 31.6, true);
      // arche d'entrée
      [[34.6, 32.2], [37, 32.2]].forEach(([x, y]) => { o += box(x, y, .2, .2, 2.2, '#8E2B22', { z: G }); });
      o += box(34.4, 32.15, 2.9, .3, .55, '#C0392B', { z: G + 2.2 }) + facadeText('f', 32.45, 34.4, 37.3, G + 2.32, 'NOËL', 8.5, '#FFF4D6', 'Brygada 1918, serif') + garland([34.4, 32.5, G + 2.8], [37.3, 32.5, G + 2.8], 10);
      return o;
    },
    galerie() {
      let o = poly([[19, 14, G], [27, 14, G], [27, 19, G], [19, 19, G]], '#EADBBB');
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) o += box(19.2 + i * 2.5, 14.2 + j * 4.4, .3, .3, 2.6, '#9A7650', { z: G });
      for (let i = 0; i < 9; i++) o += box(19 + i, 14, .2, 5, .2, '#B48C60', { z: G + 2.6 });
      // glycine sur la pergola
      for (let i = 0; i < 14; i++) o += dot(19.4 + (i * 0.57) % 7.6, 14.3 + ((i * 1.7) % 4.4), G + 2.85, 3.2, i % 3 ? '#B39DDB' : '#7FB06A');
      for (let i = 0; i < 3; i++) { const [a, b] = P(20.4 + i * 2.5, 19, G + 1.8); o += `<rect x="${f1(a - 10)}" y="${f1(b - 11)}" width="20" height="15" fill="#fff" stroke="#9A7650"/><rect x="${f1(a - 8)}" y="${f1(b - 9)}" width="16" height="11" fill="${['#8FC5A0', '#F0B9C8', '#A8C9E6'][i]}"/>`; }
      o += box(21, 16.4, 1.8, .5, .35, '#9A7650', { z: G }) + box(23.8, 16.4, 1.8, .5, .35, '#9A7650', { z: G });
      return o;
    },
    clinique() {
      let o = shadow(29, 14, 5, 4) + box(29, 14, 5, 4, 2.2, '#FFFFFF', { z: G });
      o += poly([[29, 14, G + 2.2], [34, 14, G + 2.2], [34, 16, G + 3.2], [29, 16, G + 3.2]], '#1F7F8C') + poly([[29, 16, G + 3.2], [34, 16, G + 3.2], [34, 18, G + 2.2], [29, 18, G + 2.2]], '#2A97A6');
      o += pane('f', 18, 29.5, 31, G + .5, G + 1.6, '#CFE6EC') + pane('f', 18, 32.2, 33.6, G + .5, G + 1.6, '#CFE6EC') + pane('f', 18, 31.2, 32, G, G + 1.6, '#2F5045');
      o += pane('r', 34, 14.6, 17.4, G + .6, G + 1.6, '#BFD9E0');
      const [a, b] = P(31.6, 18, G + 1.95);
      o += `<rect x="${f1(a - 7)}" y="${f1(b - 7)}" width="14" height="14" rx="3" fill="#1F7F8C"/><path d="M${f1(a)} ${f1(b - 4.5)}v9M${f1(a - 4.5)} ${f1(b)}h9" stroke="#fff" stroke-width="2.4"/>`;
      [[29.4, 18.4], [33.4, 18.4]].forEach(([x, y]) => { o += box(x, y, .5, .5, .35, '#C46A43', { z: G }) + dot(x + .25, y + .25, G + .6, 4.5, '#5E9A5A'); });
      return o;
    },
    coulisses() {
      let o = shadow(36, 14, 5.4, 5) + box(36, 14, 5.4, 5, 2.6, '#C9CCC4', { z: G, top: '#B9BDB4' });
      for (let i = 0; i < 2; i++) { const x0 = 36.5 + i * 2.5; o += pane('f', 19, x0, x0 + 1.8, G, G + 1.7, '#9AA39E'); for (let k = 1; k < 8; k++) o += pane('f', 19, x0, x0 + 1.8, G + k * .21, G + k * .21 + .03, '#7F8883'); }
      o += box(37.2, 15, 1.4, 1.2, .8, '#9AA39E', { z: G + 2.6 }) + box(39.4, 15.4, .9, .9, .5, '#A9B0AD', { z: G + 2.6 });
      o += box(36, 19, 5.4, .8, .3, '#B6BAB2', { z: G });
      // camion de livraison aux couleurs du magasin
      o += poly([[36.2, 19.9, G + .01], [40.4, 19.9, G + .01], [40.4, 21.3, G + .01], [36.2, 21.3, G + .01]], '#000', 'opacity=".14"');
      o += box(36.3, 19.9, 2.9, 1.2, 1.35, '#F4F4F1', { z: G + .25 }) + pane('f', 21.1, 36.5, 39, G + .55, G + 1.05, '#0F4D36') + facadeText('f', 21.1, 36.4, 38.9, G + .72, 'GRAND JARDIN', 4.4, '#fff', 'Brygada 1918, serif');
      o += box(39.25, 19.95, .9, 1.1, 1.05, '#0F4D36', { z: G + .25 }) + pane('r', 40.15, 20.1, 20.9, G + .85, G + 1.2, '#2E3D49');
      [[36.8, 21.1], [38.6, 21.1], [39.8, 21.05]].forEach(([x, y]) => { o += dot(x, y, G + .25, 3, '#1E2422'); });
      return o;
    },
  };
  function pin(z) {
    const [a, b] = P(...z.at);
    return `<g class="pin"><line x1="${a}" y1="${b}" x2="${a}" y2="${b - 26}" stroke="${z.c}" stroke-width="2"/><circle cx="${a}" cy="${b - 38}" r="14" fill="${z.c}" stroke="#fff" stroke-width="3"/><text x="${a}" y="${b - 33}" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="14" fill="#fff">${z.n}</text></g>`;
  }

  function svg() {
    const zones = ZONES7.map((z) => `<g class="pz" data-r="${z.r}" tabindex="0" role="link" aria-label="${esc(z.name)} : ${esc(z.sub)}">
        ${DRAWZ[z.r]()}
        <polygon class="pz-hit" points="${pts(z.foot.map(([x, y]) => [x, y, G]))}"/>
        <polygon class="pz-ring" points="${pts(z.foot.map(([x, y]) => [x, y, G]))}" style="--c:${z.c}"/>
      </g>`).join('');
    return `<svg class="plan-svg" viewBox="0 0 ${VW} ${VH}" role="group" aria-label="Plan du magasin : 7 espaces">
      <defs><filter id="pm-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      ${ground()}${trees()}${zones}${entrance()}${people()}${ZONES7.map(pin).join('')}
    </svg>`;
  }

  let el, cur = null;
  function show(r) {
    const z = ZONES7.find((x) => x.r === r); if (!z || !el) return;
    cur = r;
    $$('.pz', el).forEach((g) => g.classList.toggle('on', g.dataset.r === r));
    $$('.plan-list a', el).forEach((a) => a.classList.toggle('on', a.dataset.r === r));
    const tip = $('.plan-tip', el), [a, b] = P(...z.at);
    tip.innerHTML = `<div class="k" style="color:${z.c}">Espace ${z.n}</div><h3>${esc(z.name)}</h3><p>${esc(z.txt())}</p>
      <div class="row">${z.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div><a class="go" href="#${z.r}">${esc(z.cta)} →</a>`;
    // fiche à droite du repère, ou à gauche s'il est trop près du bord
    const left = a / VW * 100, top = (b - 46) / VH * 100;
    tip.style.top = `max(12px, calc(${top}% - 150px))`;
    if (left > 62) { tip.style.left = ''; tip.style.right = `calc(${100 - left}% + 26px)`; } else { tip.style.right = ''; tip.style.left = `calc(${left}% + 26px)`; }
    tip.hidden = false;
  }

  function mount(view) {
    el = view;
    el.innerHTML = `<div class="plan">
      <section class="plan-map">
        <div class="plan-title"><h1>Bienvenue au Grand Jardin</h1><p>Survolez un espace du plan, cliquez pour y entrer.</p></div>
        ${svg()}
        <div class="plan-tip" hidden></div>
        <div class="plan-legend"><span><i style="background:#2EBB99"></i>Espaces de vente</span><span><i style="background:#E7B84A"></i>Ateliers & services</span><span><i style="background:#9AA39E"></i>Allées & parking</span></div>
      </section>
      <aside class="plan-side">
        <h2>Plan du magasin</h2><p>7 espaces à explorer, comme en vrai.</p>
        <nav class="plan-list" aria-label="Les espaces">${ZONES7.map((z) => `<a href="#${z.r}" data-r="${z.r}"><span class="n" style="background:${z.c}">${z.n}</span><span><b>${esc(z.name)}</b><small>${esc(z.sub)}</small></span><em>${z.r === 'jardin' ? 'Entrer' : 'Voir'}</em></a>`).join('')}</nav>
        <div class="plan-note"><b>Nouveau</b> La serre chaude et ses plantes d’intérieur : orchidées, monstera, bonsaïs…</div>
      </aside>
    </div>`;
    $$('.pz', el).forEach((g) => {
      g.addEventListener('mouseenter', () => show(g.dataset.r));
      g.addEventListener('focus', () => show(g.dataset.r));
      g.addEventListener('click', () => go(g.dataset.r));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(g.dataset.r); } });
    });
    $$('.plan-list a', el).forEach((a) => { a.addEventListener('mouseenter', () => show(a.dataset.r)); a.addEventListener('focus', () => show(a.dataset.r)); });
    show('jardin');
  }
  return { mount, ZONES7 };
})();
route('', { title: '', mount: (el) => HubMap.mount(el) });
