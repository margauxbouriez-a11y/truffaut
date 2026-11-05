/* ============================================================
   LA GRANDE SERRE — allée en perspective, à hauteur d'œil
   On avance de table en table ; chaque groupe de plantes est cliquable.
   Dessins : JArt.DRAW (jardin-art.js) ou illustrations img/serre/*.svg.
   ============================================================ */
const Jardin = (() => {
  const VW = 1440, VH = 836, VX = 720, VY = 300, F = 720, CAM = 1.72;
  const STEP = 3.2;            // distance entre deux tables (m)
  const START = 3.0;           // première table devant la caméra
  const TABLE_Y = .78;
  const U = .005;              // 1 unité de dessin JArt = 5 mm
  const DRAW = JArt.DRAW;

  let el, camZ = 0, slot = 0, anim = null, keyHandler = null, resizeHandler = null, vbW = VW;
  const basket = () => store.get('basket', []);
  const setBasket = (b) => { store.set('basket', b); updateCount(); };
  function updateCount() { const n = basket().reduce((s, x) => s + x.qty, 0); const c = $('#basket-count'); if (c) c.textContent = n || ''; }

  /* ---------- rangement des produits dans l'allée ---------- */
  const FLOOR = ['climber', 'olive', 'lemon', 'mimosa', 'hydrangea', 'camellia', 'bamboo', 'dahlia', 'lily', 'gladiolus', 'freesia', 'garlic'];
  const ZNAMES = { roseraie: ['La roseraie', 'ROSIERS · GRIMPANTS'], mediterranee: ['Méditerranée', 'OLIVIERS · AGRUMES · LAVANDES'], ombre: ['Le sous-bois', 'OMBRE · MI-OMBRE'], interieur: ['Plantes d’intérieur', 'VERTES · FLEURIES · CACTÉES'], massif: ['Massifs à bulbes', 'BULBES · PLANTES À MASSIF'], potager: ['Le potager', 'PLANTS · AROMATIQUES'] };
  const FLAGS = { 'rosier-ep': ['COUP DE CŒUR', '#E86B4F'], orchidee: ['FLEURI', '#D2527F'], sansevieria: ['FACILE', '#2EBB99'], fraisier: ['DE SAISON', '#E7A23A'], lavande: ['PARFUMÉ', '#8E72C8'] };
  let BAYS = [], ZSTART = {}, END = 0;
  function layout() {
    BAYS = []; ZSTART = {};
    let s = 0;
    ZONES.forEach((z) => {
      const list = SHOP.filter((p) => p.zone === z.id);
      if (!list.length) return;
      ZSTART[z.id] = s;
      list.forEach((p, i) => { BAYS.push({ p, side: i % 2 ? 1 : -1, slot: s + Math.floor(i / 2), zone: z.id, floor: FLOOR.includes(p.kind) && !p.img || ['olive', 'lemon'].includes(p.kind) }); });
      s += Math.ceil(list.length / 2);
    });
    END = s;
  }
  const zOf = (sl) => START + sl * STEP;

  /* ---------- symboles (un dessin par produit, réutilisé) ---------- */
  function symbols() {
    return SHOP.map((p) => p.img
      ? `<symbol id="sp-${p.id}" viewBox="-150 -325 300 340" overflow="visible"><image href="img/serre/${p.img}.svg" x="-150" y="-325" width="300" height="340"/></symbol>`
      : `<symbol id="sp-${p.id}" viewBox="-150 -345 300 350" overflow="visible">${DRAW[p.kind](p.color, 3, p)}</symbol>`).join('');
  }
  // taille réelle (m) d'un symbole : largeur, hauteur de la boîte
  const symSize = (p) => (p.img ? [300 * p.h / 325, 340 * p.h / 325] : [300 * U, 350 * U]);
  const symFoot = (p) => (p.img ? 325 / 340 : 345 / 350); // position du pied dans la boîte

  /* ---------- projection ---------- */
  const P = (X, Y, Z) => [VX + F * X / Z, VY + F * (CAM - Y) / Z];
  const pts = (a) => a.map(([X, Y, Z]) => P(X, Y, Z).map((v) => v.toFixed(1)).join(',')).join(' ');
  const q = (n) => n.toFixed(1);

  /* ---------- la serre (structure) ---------- */
  function shell(cz) {
    const ZB = 46; let g = '';
    const zw = (w) => w - cz; // monde -> caméra
    g += `<rect x="-400" y="-50" width="2240" height="${VH + 100}" fill="url(#js-sky)"/>`;
    [[260, 90, 90], [520, 60, 70], [980, 80, 110], [1240, 120, 80], [760, 150, 60], [60, 140, 70]].forEach(([x, y, r]) => { g += `<g opacity=".9"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .32}" fill="#fff"/><ellipse cx="${x + r * .35}" cy="${y - r * .18}" rx="${r * .55}" ry="${r * .3}" fill="#fff"/></g>`; });
    g += `<polygon points="${pts([[-4.4, 0, ZB], [4.4, 0, ZB], [4.4, 3.1, ZB], [0, 4.9, ZB], [-4.4, 3.1, ZB]])}" fill="#F3F1E4"/><ellipse cx="${VX}" cy="${VY - 30}" rx="420" ry="260" fill="url(#js-glow)"/>`;
    g += `<polygon points="${pts([[-4.4, 0, 1.2], [4.4, 0, 1.2], [4.4, 0, ZB], [-4.4, 0, ZB]])}" fill="url(#js-floor)"/>`;
    // tapis central en carreaux et bordures vertes
    const t0 = Math.floor((cz + 1.2) / .9) * .9;
    for (let w = t0; w < cz + ZB; w += .9) { const z = zw(w); if (z < 1.2) continue; const k = Math.round(w / .9) % 2; g += `<polygon points="${pts([[-.55, 0, z], [.55, 0, z], [.55, 0, z + .82], [-.55, 0, z + .82]])}" fill="${k ? '#D9C3A3' : '#E3CFB0'}"/>`; }
    [-1.25, 1.25].forEach((x) => { g += `<polygon points="${pts([[x - .05, 0, 1.2], [x + .05, 0, 1.2], [x + .05, 0, ZB], [x - .05, 0, ZB]])}" fill="#2EBB99" opacity=".7"/>`; });
    // taches de soleil (fixes dans le monde)
    for (let k = 0; k < 40; k++) { const w = 4 + k * 4.3, z = zw(w); if (z < 1.6 || z > ZB) continue; const x = [-1.6, 1.2, -.4, 1.6, -1.2][k % 5], r = [1.3, 1.1, 1, .9, .8][k % 5]; const [a, b] = P(x, 0, z); g += `<ellipse cx="${q(a)}" cy="${q(b)}" rx="${q(F / z * r)}" ry="${q(F / z * r * .22)}" fill="url(#js-sun)"/>`; }
    // parois vitrées et soubassement
    [-4.4, 4.4].forEach((x) => { g += `<polygon points="${pts([[x, 0, 1.2], [x, 0, ZB], [x, 3.1, ZB], [x, 3.1, 1.2]])}" fill="url(#js-wall)" opacity=".75"/><polygon points="${pts([[x, 0, 1.2], [x, 0, ZB], [x, .6, ZB], [x, .6, 1.2]])}" fill="#F3F4F1"/>`; });
    for (let k = 0; k < 60; k++) { const w = k * 1.6, z = zw(w); if (z < 2 || z > ZB) continue; [-1, 1].forEach((s) => { const [x, y] = P(s * 5.2, 1.6, z), r = F / z * .9; g += `<ellipse cx="${q(x)}" cy="${q(y)}" rx="${q(r * .7)}" ry="${q(r)}" fill="#8DBF85" opacity=".45"/>`; }); }
    // toiture
    g += `<polygon points="${pts([[-4.4, 3.1, 1.2], [0, 4.9, 1.2], [0, 4.9, ZB], [-4.4, 3.1, ZB]])}" fill="#D8E9F0" opacity=".5"/><polygon points="${pts([[4.4, 3.1, 1.2], [0, 4.9, 1.2], [0, 4.9, ZB], [4.4, 3.1, ZB]])}" fill="#CFE3EC" opacity=".5"/>`;
    for (let i = 0; i <= 8; i++) { const t = i / 8; [[-4.4 + 4.4 * t, 3.1 + 1.8 * t], [4.4 - 4.4 * t, 3.1 + 1.8 * t]].forEach(([x, y]) => { g += `<polyline points="${pts([[x, y, 1.2], [x, y, ZB]])}" stroke="#fff" stroke-width="1.2" fill="none" opacity=".85"/>`; }); }
    [.6, 1.6, 2.4, 3.1].forEach((y) => [-4.4, 4.4].forEach((x) => { g += `<polyline points="${pts([[x, y, 1.2], [x, y, ZB]])}" stroke="#fff" stroke-width="2" fill="none"/>`; }));
    // rayons de soleil
    for (let k = 0; k < 14; k++) { const w = 2 + k * 5.5, z = zw(w); if (z < 1.5 || z > 30) continue; const x = [-3.6, -1.2, 1.8][k % 3], wd = [1.6, 1.2, 1.4][k % 3]; g += `<polygon points="${pts([[x - 1.2, 4.6, Math.max(1.2, z - 2)], [x - 1.2 + wd, 4.6, Math.max(1.2, z - 2)], [x + wd + 1.4, 0, z + 3], [x + 1.4, 0, z + 3]])}" fill="url(#js-ray)" opacity=".5"/>`; }
    // portiques blancs tous les 3 m + rampes d'éclairage
    const roof = (z) => [[-4.4, 3.1, z], [0, 4.9, z], [4.4, 3.1, z]];
    const p0 = Math.ceil((cz + 1.3 - 2.2) / 3) * 3 + 2.2;
    for (let w = p0; w < cz + ZB; w += 3) {
      const z = zw(w), sw = q(F / z * .07);
      g += `<polyline points="${pts([[-4.4, 0, z], ...roof(z), [4.4, 0, z]])}" stroke="#fff" stroke-width="${sw}" fill="none" stroke-linejoin="round"/><polyline points="${pts([[-4.4, 3.1, z], [4.4, 3.1, z]])}" stroke="#fff" stroke-width="${q(sw * .45)}" fill="none"/>`;
      for (let k = 0; k < 8; k++) { const x0 = -4.4 + k * 1.1; g += `<polyline points="${pts([[x0, 3.1, z], [x0 + .55, 3.45, z], [x0 + 1.1, 3.1, z]])}" stroke="#fff" stroke-width="${q(sw * .22)}" fill="none" opacity=".9"/>`; }
      [-2, 2].forEach((x) => { const [a, b] = P(x, 2.98, z + .4); g += `<ellipse cx="${q(a)}" cy="${q(b + 2)}" rx="${q(F / z * .12)}" ry="${q(F / z * .03)}" fill="#FFF7D6" opacity=".9"/>`; });
    }
    [-2, 2].forEach((x) => { g += `<polyline points="${pts([[x, 3.0, 1.2], [x, 3.0, ZB]])}" stroke="#2F3A36" stroke-width="2.4" fill="none" opacity=".5"/>`; });
    return g;
  }

  /* ---------- objets de l'allée (triés par profondeur) ---------- */
  function table(side, z1, z2) {
    const s = side, xa = s * 1.45, xb = s * 3.6, Y = TABLE_Y; let t = '';
    t += `<polygon points="${pts([[xa, 0, z1], [xb, 0, z1], [xb, 0, z2], [xa, 0, z2]])}" fill="#000" opacity=".1"/>`;
    [[xa + s * .08, z1 + .1], [xb - s * .08, z1 + .1], [xa + s * .08, z2 - .1], [xb - s * .08, z2 - .1]].forEach(([x, z]) => {
      t += `<polyline points="${pts([[x, .08, z], [x, Y - .04, z]])}" stroke="#1F5A43" stroke-width="${q(F / z * .035)}" fill="none"/>`;
      const [cx, cy] = P(x, .04, z); t += `<circle cx="${q(cx)}" cy="${q(cy)}" r="${q(F / z * .045)}" fill="#2F3532"/>`;
    });
    t += `<polygon points="${pts([[xa, .22, z1], [xa, .26, z1], [xa, .26, z2], [xa, .22, z2]])}" fill="#2A6B52"/>`;
    t += `<polygon points="${pts([[xa, Y, z1], [xb, Y, z1], [xb, Y, z2], [xa, Y, z2]])}" fill="url(#js-top)"/>`;
    for (let k = 1; k < 6; k++) { const xx = xa + (xb - xa) * k / 6; t += `<polyline points="${pts([[xx, Y, z1], [xx, Y, z2]])}" stroke="#A97C45" stroke-width="${q(F / z1 * .006)}" fill="none" opacity=".6"/>`; }
    t += `<polygon points="${pts([[xa, Y - .11, z1], [xa, Y, z1], [xa, Y, z2], [xa, Y - .11, z2]])}" fill="#0F4D36"/><polygon points="${pts([[xa, Y - .11, z1], [xa, Y - .095, z1], [xa, Y - .095, z2], [xa, Y - .11, z2]])}" fill="#2EBB99"/>`;
    t += `<polygon points="${pts([[xa, Y - .11, z1], [xb, Y - .11, z1], [xb, Y, z1], [xa, Y, z1]])}" fill="#1C6A50"/>`;
    return t;
  }
  function use(p, X, Y, Z, k = 1) {
    const [w, h] = symSize(p), wp = F * w * k / Z, hp = F * h * k / Z, [x, y] = P(X, Y, Z);
    return `<ellipse cx="${q(x)}" cy="${q(y)}" rx="${q(wp * .22)}" ry="${q(wp * .045)}" fill="url(#js-shad)"/><use href="#sp-${p.id}" x="${q(x - wp / 2)}" y="${q(y - hp * symFoot(p))}" width="${q(wp)}" height="${q(hp)}"/>`;
  }
  // nombre de pots par rangée et pas entre rangées selon la taille du dessin
  function stock(p) {
    if (p.img) return p.h > .7 ? [2, .7] : [3, .45];
    return { rose: [2, .8], cyclamen: [2, .6], pansy: [2, .5], strawberry: [2, .5], lettuce: [2, .5], tomato: [2, .7], herb: [2, .55], chive: [2, .55], lavender: [2, .6] }[p.kind] || [2, .7];
  }
  function tag(p, side, Z, Y) {
    const f = p.forms.plante || p.forms.bulbe, [x, y] = P(side * 1.5, Y, Z), k = F / Z / 330, w = 156 * k, h = 52 * k;
    const name = p.name.replace(/^Rosier( grimpant)? /, 'Rosier ').replace(/ en (jardinière|mélange)$/, '').replace(/'([^']+)'.*$/, '‘$1’').slice(0, 24);
    const fmt = f.label.split(',')[0].slice(0, 16);
    return `<g class="tag" transform="translate(${q(x - (side < 0 ? w * .12 : w * .88))} ${q(y - h * .6)})"><rect width="${q(w)}" height="${q(h)}" rx="${q(4 * k)}" fill="#fff" stroke="#D8DCD6" stroke-width="${q(.6 * k)}"/><rect width="${q(6 * k)}" height="${q(h)}" rx="${q(2 * k)}" fill="#0F4D36"/>
      <text x="${q(12 * k)}" y="${q(18 * k)}" font-family="DM Sans, sans-serif" font-weight="600" font-size="${q(12.5 * k)}" fill="#1D2A24">${esc(name)}</text>
      <text x="${q(12 * k)}" y="${q(41 * k)}" font-family="DM Sans, sans-serif" font-weight="700" font-size="${q(f.price == null ? 12 * k : 19 * k)}" fill="#0F4D36">${f.price == null ? 'Voir le prix' : euro(f.price)}</text>
      <text x="${q(w - 8 * k)}" y="${q(41 * k)}" text-anchor="end" font-family="DM Sans, sans-serif" font-size="${q(9 * k)}" fill="#7A847E">${esc(fmt)}</text></g>`;
  }
  function flag(side, Z, Y, [txt, col]) {
    const [x, y] = P(side * 1.62, Y, Z), [, y2] = P(side * 1.62, Y + .55, Z), k = F / Z / 250;
    return `<line x1="${q(x)}" y1="${q(y)}" x2="${q(x)}" y2="${q(y2)}" stroke="#5E4630" stroke-width="${q(Math.max(1, 2 * k))}"/><path d="M${q(x)} ${q(y2)}h${q(70 * k)}l${q(-10 * k)} ${q(11 * k)}l${q(10 * k)} ${q(11 * k)}h${q(-70 * k)}z" fill="${col}"/><text x="${q(x + 6 * k)}" y="${q(y2 + 15 * k)}" font-family="DM Sans, sans-serif" font-weight="700" font-size="${q(8.6 * k)}" fill="#fff">${txt}</text>`;
  }
  function bay(b, cz) {
    const z1 = zOf(b.slot) - cz, z2 = z1 + 2.6, s = b.side, p = b.p;
    let o = `<g class="bay" data-id="${p.id}" tabindex="0" role="button" aria-label="${esc(p.name)}, ${esc(euro((p.forms.plante || p.forms.bulbe).price))}. Ouvrir la fiche.">`;
    if (b.floor) {
      // grands sujets posés au sol, deux exemplaires
      const pos = [[s * 2.95, z1 + 1.9], [s * 2.05, z1 + 1.1]];
      if (z1 + .9 > 1.3) pos.forEach(([X, Z]) => { if (Z > 1.3) o += use(p, X, 0, Z); });
      o += `<polygon class="hit" points="${pts([[s * 1.4, 0, Math.max(1.3, z1)], [s * 3.6, 0, Math.max(1.3, z1)], [s * 3.6, 2.2, Math.max(1.3, z1)], [s * 1.4, 2.2, Math.max(1.3, z1)]])}"/>`;
      if (z1 + .8 > 1.4) o += tag(p, s, z1 + .8, .9);
    } else {
      o += table(s, Math.max(1.25, z1), z2);
      const [cols, step] = stock(p), gap = cols > 1 ? (3.4 - 1.72) / (cols - 1) : 0;
      const items = [];
      for (let z = z2 - .3; z > z1 + .15; z -= step) for (let c = 0; c < cols; c++) { if (z < 1.35) continue; items.push([s * (1.72 + c * gap + ((z * 7.3 + c) % 1) * .06), z, .94 + ((z * 13 + c * 3) % 1) * .1]); }
      items.sort((a, c) => c[1] - a[1]).forEach(([X, Z, k]) => { o += use(p, X, TABLE_Y, Z, k); });
      if (p.hang) [[s * 2.3, z1 + 1.4], [s * 3.1, z1 + 1.9]].forEach(([X, Z]) => { if (Z < 1.5) return; const [a, b2] = P(X, 3.0, Z), [, b3] = P(X, 2.25, Z); o += `<line x1="${q(a)}" y1="${q(b2)}" x2="${q(a)}" y2="${q(b3)}" stroke="#5E6662" stroke-width="1"/>` + use(p, X, 1.78, Z); });
      if (z1 + .9 > 1.4) o += tag(p, s, z1 + .9, TABLE_Y);
    }
    if (FLAGS[p.id] && z1 + 2 > 1.5) o += flag(s, z1 + 2, b.floor ? 0 : TABLE_Y, FLAGS[p.id]);
    return o + '</g>';
  }
  function sign(Z, title, sub) {
    const w = 2.6, [x1, y1] = P(-w / 2, 2.72, Z), [x2, y2] = P(w / 2, 2.3, Z), [ax] = P(-w / 2 + .15, 3.05, Z), [bx] = P(w / 2 - .15, 3.05, Z), [, yt] = P(0, 3.05, Z), k = F / Z / 200;
    return `<g class="zsign"><line x1="${q(ax)}" y1="${q(yt)}" x2="${q(ax)}" y2="${q(y1)}" stroke="#4A524E" stroke-width="${q(Math.max(.6, k))}"/><line x1="${q(bx)}" y1="${q(yt)}" x2="${q(bx)}" y2="${q(y1)}" stroke="#4A524E" stroke-width="${q(Math.max(.6, k))}"/>
      <rect x="${q(x1)}" y="${q(y1)}" width="${q(x2 - x1)}" height="${q(y2 - y1)}" rx="${q(3 * k)}" fill="url(#js-sign)"/><rect x="${q(x1)}" y="${q(y2 - 4 * k)}" width="${q(x2 - x1)}" height="${q(4 * k)}" fill="#2EBB99"/>
      <text x="${q((x1 + x2) / 2)}" y="${q(y1 + (y2 - y1) * .52)}" text-anchor="middle" font-family="Brygada 1918, serif" font-weight="600" font-size="${q((y2 - y1) * .34)}" fill="#fff">${esc(title)}</text>
      <text x="${q((x1 + x2) / 2)}" y="${q(y1 + (y2 - y1) * .8)}" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="500" letter-spacing="${q(k)}" font-size="${q((y2 - y1) * .15)}" fill="#BFE6D8">${esc(sub)}</text></g>`;
  }
  function checkout(Z) {
    // les caisses au fond de l'allée
    let o = `<g class="checkout" tabindex="0" role="button" aria-label="Passer en caisse : ouvrir mon panier">`;
    o += `<polygon points="${pts([[-2.4, 0, Z], [2.4, 0, Z], [2.4, 1.0, Z], [-2.4, 1.0, Z]])}" fill="#C39558"/><polygon points="${pts([[-2.5, 1.0, Z - .2], [2.5, 1.0, Z - .2], [2.5, 1.06, Z - .2], [-2.5, 1.06, Z - .2]])}" fill="#EDE7DA"/>`;
    for (let k = 0; k < 6; k++) { const x = -2.2 + k * .88; o += `<polyline points="${pts([[x, .1, Z - .01], [x, .9, Z - .01]])}" stroke="#A97C45" stroke-width="${q(F / Z * .01)}" fill="none"/>`; }
    const [a, b] = P(1.2, 1.06, Z - .2), k = F / Z / 100;
    o += `<rect x="${q(a - 14 * k)}" y="${q(b - 18 * k)}" width="${q(28 * k)}" height="${q(18 * k)}" rx="${q(2 * k)}" fill="#3C4743"/><rect x="${q(a - 11 * k)}" y="${q(b - 15 * k)}" width="${q(22 * k)}" height="${q(9 * k)}" fill="#9FD3B2"/>`;
    o += sign(Z - .3, 'Caisses', 'CLIQUEZ POUR PAYER');
    return o + '</g>';
  }

  /* ---------- rendu ---------- */
  function scene(cz) {
    const parts = [];
    BAYS.forEach((b) => { const z = zOf(b.slot) - cz; if (z + 2.6 > 1.25 && z < 34) parts.push([z + 1.3, () => bay(b, cz)]); });
    ZONES.forEach((zn) => { if (ZSTART[zn.id] == null) return; const z = zOf(ZSTART[zn.id]) - cz + 1.6; if (z > 2.2 && z < 34) parts.push([z + .01, () => sign(z, ...ZNAMES[zn.id])]); });
    const zc = zOf(END) - cz + .8; if (zc > 1.5 && zc < 40) parts.push([zc, () => checkout(zc)]);
    parts.sort((a, b) => b[0] - a[0]);
    return shell(cz) + parts.map(([, f]) => f()).join('');
  }
  function draw() {
    const g = $('#js-world', el); if (!g) return;
    g.innerHTML = scene(camZ);
    bindBays();
  }
  function frame() {
    const s = $('.serre-svg', el); if (!s) return;
    const box = s.getBoundingClientRect(); const ratio = box.width / Math.max(1, box.height);
    vbW = Math.max(640, Math.min(VW, VH * ratio));
    s.setAttribute('viewBox', `${q(VX - vbW / 2)} 0 ${q(vbW)} ${VH}`);
  }
  function walkTo(target) {
    target = clamp(target, 0, Math.max(0, END - 1));
    if (target === slot && !anim) return;
    slot = target;
    const from = camZ, to = slot * STEP, t0 = performance.now(), dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : Math.min(1400, 420 + Math.abs(to - from) * 60);
    if (anim) cancelAnimationFrame(anim);
    hideCard();
    const tick = (t) => {
      const k = dur ? Math.min(1, (t - t0) / dur) : 1, e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      camZ = from + (to - from) * e; draw();
      if (k < 1) anim = requestAnimationFrame(tick); else { anim = null; updateHud(); }
    };
    anim = requestAnimationFrame(tick);
    updateHud();
  }
  function zoneAt(sl) { let z = ZONES[0].id; ZONES.forEach((zn) => { if (ZSTART[zn.id] != null && sl >= ZSTART[zn.id]) z = zn.id; }); return z; }
  function updateHud() {
    const z = zoneAt(slot), zn = ZONES.find((x) => x.id === z);
    $('#serre-zone', el).textContent = ZNAMES[z][0];
    $('#serre-sub', el).textContent = `${SHOP.filter((p) => p.zone === z).length} plantes · table ${slot - ZSTART[z] + 1}`;
    $('#serre-crumb', el).textContent = zn ? zn.name : '';
    $$('.serre-steps i', el).forEach((i) => i.classList.toggle('on', ZSTART[i.dataset.z] <= slot));
    $$('.serre-mini li', el).forEach((li) => li.classList.toggle('on', li.dataset.z === z));
    $('#go-back', el).disabled = slot <= 0; $('#go-fwd', el).disabled = slot >= END - 1;
  }

  /* ---------- fiche au survol et cueillette ---------- */
  const art = (p) => (p.img ? `<img src="img/serre/${p.img}.svg" alt="">` : `<svg viewBox="-150 -345 300 350" aria-hidden="true">${DRAW[p.kind](p.color, 3, p)}</svg>`);
  function hideCard() { const c = $('.serre-card', el); if (c) c.hidden = true; }
  function showCard(id, g) {
    const p = SHOP.find((x) => x.id === id), c = $('.serre-card', el), f = p.forms.plante || p.forms.bulbe, zn = ZONES.find((z) => z.id === p.zone);
    c.innerHTML = `<div class="sc-ph">${art(p)}</div><div class="bd"><div class="rayon">${esc(zn ? zn.name : '')}</div><h3>${esc(p.name)}</h3>${p.latin ? `<i>${esc(p.latin)}</i>` : ''}
      <div class="row"><b>${f.price == null ? 'Prix sur la fiche' : euro(f.price)}</b><small>${esc(f.label)}</small></div>
      <div class="opts"><span class="${p.forms.plante ? '' : 'off'}">Plante en pot</span><span class="${p.forms.bulbe ? '' : 'off'}">Bulbe</span></div>
      <button class="btn" type="button" data-pick="${p.id}">Choisir et ajouter</button></div>`;
    const sc = $('.serre-stage', el).getBoundingClientRect(), r = g.getBoundingClientRect();
    const right = r.left + r.width / 2 > sc.left + sc.width / 2;
    c.style.left = right ? `${Math.max(8, r.left - sc.left - 290)}px` : `${Math.min(sc.width - 290, r.right - sc.left + 10)}px`;
    c.style.top = `${clamp(r.top - sc.top - 40, 70, sc.height - 360)}px`;
    c.hidden = false;
    $('[data-pick]', c).addEventListener('click', () => chooseForm(p));
  }
  function bindBays() {
    $$('.bay', el).forEach((g) => {
      g.addEventListener('mouseenter', () => { if (!anim) showCard(g.dataset.id, g); });
      g.addEventListener('focus', () => showCard(g.dataset.id, g));
      g.addEventListener('click', () => chooseForm(SHOP.find((x) => x.id === g.dataset.id)));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chooseForm(SHOP.find((x) => x.id === g.dataset.id)); } });
    });
    const co = $('.checkout', el);
    if (co) { co.addEventListener('click', openBasket); co.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBasket(); } }); }
  }
  function chooseForm(item) {
    const opt = (key, title) => {
      const f = item.forms[key];
      return f ? `<div class="form-opt"><div><b>${title}</b><span>${esc(f.label)}</span><span class="fo-price">${euro(f.price)}</span></div>
          <button class="btn small" data-form="${key}" type="button">Ajouter au panier</button></div>`
        : `<div class="form-opt off"><div><b>${title}</b><span>Pas vendu sous cette forme en ligne</span></div></div>`;
    };
    const box = modal(`<div class="pick-head"><div class="pick-art">${art(item)}</div><div><h2>${esc(item.name)}</h2>${item.latin ? `<p class="pick-latin">${esc(item.latin)}</p>` : ''}</div></div>
      ${opt('plante', 'Plante en pot')}${opt('bulbe', 'Bulbe à planter')}
      <p class="small"><a href="${(item.forms.plante || item.forms.bulbe).url}" target="_blank" rel="noopener">Voir la fiche produit sur truffaut.com</a></p>`);
    $$('[data-form]', box).forEach((b) => b.addEventListener('click', () => { add(item, b.dataset.form); closeModal(); }));
  }
  function add(item, form) {
    const b = basket(); const ex = b.find((x) => x.id === item.id && x.form === form);
    if (ex) ex.qty++; else b.push({ id: item.id, form, qty: 1 });
    setBasket(b);
    const btn = $('#basket-btn'); btn.classList.remove('jiggle'); void btn.offsetWidth; btn.classList.add('jiggle');
    toast('🛒', `${item.name} dans ton panier`, form === 'bulbe' ? 'En bulbes, à planter.' : 'En plante, prête à planter.', 2600);
  }

  function openBasket() {
    const b = basket();
    const rows = b.map((x, i) => { const p = SHOP.find((s) => s.id === x.id); if (!p) return ''; const f = p.forms[x.form];
      return `<li><div><b>${esc(p.name)}</b><span>${x.form === 'bulbe' ? 'Bulbe' : 'Plante'} · ${esc(f.label)} · ${euro(f.price)}</span></div>
        <div class="qty"><button type="button" data-i="${i}" data-d="-1" aria-label="Retirer un">−</button><b>${x.qty}</b><button type="button" data-i="${i}" data-d="1" aria-label="Ajouter un">+</button></div></li>`; }).join('');
    const known = b.filter((x) => SHOP.find((p) => p.id === x.id));
    const total = known.reduce((s, x) => { const f = SHOP.find((p) => p.id === x.id).forms[x.form]; return s + (f.price || 0) * x.qty; }, 0);
    const unknown = known.some((x) => SHOP.find((p) => p.id === x.id).forms[x.form].price == null);
    const box = modal(`<h2>Mon panier</h2>
      ${known.length ? `<ul class="basket-list">${rows}</ul>
        <p class="basket-total">Total : <b>${euro(total)}</b>${unknown ? '<br><span class="small">+ articles dont le prix s’affiche sur la fiche produit</span>' : ''}</p>
        <div class="actions"><button class="btn sun" id="order" type="button">Commander</button><button class="btn white" id="empty" type="button">Vider le panier</button></div>`
      : `<p>Ton panier est vide. Promène-toi dans la grande serre et clique sur les plantes pour les ajouter.</p>
         <div class="actions"><a class="btn" href="#jardin" id="to-garden">Aller dans la serre</a></div>`}`);
    $$('.qty button', box).forEach((btn) => btn.addEventListener('click', () => {
      const bb = basket(); const it = bb[+btn.dataset.i]; it.qty += +btn.dataset.d; if (it.qty <= 0) bb.splice(+btn.dataset.i, 1); setBasket(bb); openBasket();
    }));
    const tg = $('#to-garden', box); if (tg) tg.addEventListener('click', closeModal);
    const em = $('#empty', box); if (em) em.addEventListener('click', () => { setBasket([]); openBasket(); });
    const or = $('#order', box); if (or) or.addEventListener('click', () => {
      modal(`<h2>Finaliser sur truffaut.com</h2>
        <p>Dans la version en ligne, ton panier serait transmis directement au panier Truffaut. Dans cette maquette, ouvre chaque fiche pour commander :</p>
        <ul class="link-list">${basket().map((x) => { const p = SHOP.find((s) => s.id === x.id); if (!p) return ''; const f = p.forms[x.form]; return `<li><a href="${f.url}" target="_blank" rel="noopener">${esc(p.name)} (${x.qty})</a></li>`; }).join('')}</ul>`);
    });
  }

  /* ---------- montage ---------- */
  function mount(view) {
    el = view; layout();
    camZ = slot * STEP;
    const zl = ZONES.filter((z) => ZSTART[z.id] != null);
    el.innerHTML = `<div class="serre">
      <div class="serre-stage">
        <svg class="serre-svg" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid slice" role="group" aria-label="L’allée de la grande serre. Flèches gauche et droite pour avancer ou reculer.">
          <defs>
            <linearGradient id="js-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8EC3E6"/><stop offset=".45" stop-color="#CFE6F2"/><stop offset="1" stop-color="#F6F4EC"/></linearGradient>
            <linearGradient id="js-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFE7D6"/><stop offset=".5" stop-color="#E4D9C3"/><stop offset="1" stop-color="#D6C8AE"/></linearGradient>
            <linearGradient id="js-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#DCEAEE"/><stop offset="1" stop-color="#EEF4F2"/></linearGradient>
            <linearGradient id="js-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8B27A"/><stop offset="1" stop-color="#C39558"/></linearGradient>
            <linearGradient id="js-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4CF" stop-opacity=".55"/><stop offset="1" stop-color="#FFF4CF" stop-opacity="0"/></linearGradient>
            <radialGradient id="js-sun"><stop offset="0" stop-color="#FFF6D6" stop-opacity=".75"/><stop offset="1" stop-color="#FFF6D6" stop-opacity="0"/></radialGradient>
            <radialGradient id="js-glow" cx=".5" cy=".42" r=".5"><stop offset="0" stop-color="#FFF6D6"/><stop offset="1" stop-color="#FFF6D6" stop-opacity="0"/></radialGradient>
            <linearGradient id="js-sign" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16614A"/><stop offset="1" stop-color="#0E4A36"/></linearGradient>
            <radialGradient id="js-shad"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
            ${symbols()}
          </defs>
          <g id="js-world"></g>
        </svg>
        <div class="serre-crumb">La grande serre <span>›</span> <b id="serre-crumb"></b></div>
        <div class="serre-mini"><h4>Plan de la serre <span>Vous êtes ici</span></h4><ol>${zl.map((z) => `<li data-z="${z.id}"><button type="button" data-z="${z.id}">${esc(ZNAMES[z.id][0])}<small>${SHOP.filter((p) => p.zone === z.id).length}</small></button></li>`).join('')}<li data-z="caisse"><button type="button" data-z="caisse">Caisses</button></li></ol></div>
        <div class="serre-card" hidden></div>
        <div class="serre-walk">
          <button class="b" id="go-back" type="button">← Reculer</button>
          <div class="serre-steps">${zl.map((z) => `<i data-z="${z.id}" title="${esc(ZNAMES[z.id][0])}"></i>`).join('')}</div>
          <div class="lbl"><b id="serre-zone"></b><span id="serre-sub"></span></div>
          <button class="b go" id="go-fwd" type="button">Avancer →</button>
        </div>
      </div>
      <p class="serre-hint">Astuce : flèches ← → pour vous déplacer, survolez une table pour voir la fiche, cliquez pour ajouter au panier. Les caisses sont au bout de l’allée.</p>
    </div>`;
    frame(); draw(); updateHud();
    $('#go-back', el).addEventListener('click', () => walkTo(slot - 1));
    $('#go-fwd', el).addEventListener('click', () => walkTo(slot + 1));
    $$('.serre-mini button', el).forEach((b) => b.addEventListener('click', () => walkTo(b.dataset.z === 'caisse' ? END - 1 : ZSTART[b.dataset.z])));
    $('.serre-stage', el).addEventListener('mouseleave', hideCard);
    keyHandler = (e) => { if (document.querySelector('#modal-back')) return; if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); walkTo(slot + 1); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); walkTo(slot - 1); } };
    window.addEventListener('keydown', keyHandler);
    resizeHandler = () => { frame(); };
    window.addEventListener('resize', resizeHandler);
  }

  return {
    title: 'La grande serre', mount,
    unmount() { if (anim) cancelAnimationFrame(anim); anim = null; window.removeEventListener('keydown', keyHandler); window.removeEventListener('resize', resizeHandler); },
    openBasket, updateCount, DRAW,
  };
})();
route('jardin', Jardin);
