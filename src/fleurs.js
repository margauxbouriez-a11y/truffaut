/* ============================================================
   FLEURS ILLUSTRÉES — rendu « film d'animation » pour l'atelier bouquet
   Volume, lumière venant d'en haut à gauche, dégradés, pas de contour noir.
   Chaque tige se dessine dans un cadre 80 × 240 (base de la tige en bas au milieu).
   ============================================================ */
const Fleurs = (() => {
  const sh = (c, k) => Deco.shade(c, k);
  const n1 = (v) => (+v).toFixed(1);
  let seed = 1;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const r = (a, b) => a + rnd() * (b - a);
  const reseed = (s) => { seed = 1 + Math.abs(Math.round(s * 7919)) % 2147483000; for (let i = 0; i < 4; i++) rnd(); };

  /* ---------- dégradés partagés ---------- */
  const petalGrad = (id, c) => `
    <linearGradient id="fl-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sh(c, .5)}"/><stop offset=".42" stop-color="${sh(c, .08)}"/><stop offset="1" stop-color="${sh(c, -.38)}"/></linearGradient>
    <linearGradient id="fl-${id}-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sh(c, .15)}"/><stop offset="1" stop-color="${sh(c, -.5)}"/></linearGradient>
    <linearGradient id="fl-${id}-sat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sh(c, .28)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${sh(c, -.32)}"/></linearGradient>
    <radialGradient id="fl-${id}-dome" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="${sh(c, .4)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${sh(c, -.5)}"/></radialGradient>`;
  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    ${STEMS.map((f) => petalGrad(f.id, f.petal) + petalGrad(f.id + '-h', f.heart)).join('')}
    <linearGradient id="fl-ao" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1d1206" stop-opacity=".45"/><stop offset=".55" stop-color="#1d1206" stop-opacity="0"/></linearGradient>
    <linearGradient id="fl-leafshade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d2208" stop-opacity=".38"/><stop offset=".5" stop-color="#0d2208" stop-opacity="0"/><stop offset="1" stop-color="#fff8c0" stop-opacity=".12"/></linearGradient>
    <radialGradient id="fl-shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1d1206" stop-opacity=".35"/><stop offset="1" stop-color="#1d1206" stop-opacity="0"/></radialGradient>
    <radialGradient id="fl-gloss" cx=".35" cy=".3" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="fl-euca" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#E4EFEA"/><stop offset=".45" stop-color="#A9C7BD"/><stop offset="1" stop-color="#6C9488"/></radialGradient>
    <radialGradient id="fl-ger-disc" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#3A2112"/><stop offset=".7" stop-color="#5A3418"/><stop offset="1" stop-color="#2A160A"/></radialGradient>
    <linearGradient id="fl-zinc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6F7E86"/><stop offset=".22" stop-color="#C9D3D8"/><stop offset=".38" stop-color="#F2F6F7"/><stop offset=".6" stop-color="#A9B6BD"/><stop offset="1" stop-color="#5E6C74"/></linearGradient>
    <linearGradient id="fl-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E3E45"/><stop offset="1" stop-color="#55707A"/></linearGradient>
    <linearGradient id="fl-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBE0CB"/><stop offset=".6" stop-color="#F0C4A4"/><stop offset="1" stop-color="#D99C7A"/></linearGradient>
    <linearGradient id="fl-kraft" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B98C5A"/><stop offset=".3" stop-color="#E2C08F"/><stop offset=".55" stop-color="#D3AC77"/><stop offset="1" stop-color="#A57744"/></linearGradient>
    <linearGradient id="fl-ribbon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58A74"/><stop offset=".5" stop-color="#E04E3A"/><stop offset="1" stop-color="#A92A1E"/></linearGradient>
  </defs></svg>`;

  /* ---------- outils de forme ---------- */
  // Contour fermé à partir de points, lissé (Catmull-Rom → Bézier)
  function smooth(pts, closed = true) {
    const P = pts, n = P.length; let d = `M${n1(P[0][0])} ${n1(P[0][1])}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
      const a = closed || i > 0 ? p0 : p1, b = closed || i < n - 2 ? p3 : p2;
      d += ` C${n1(p1[0] + (p2[0] - a[0]) / 6)} ${n1(p1[1] + (p2[1] - a[1]) / 6)} ${n1(p2[0] - (b[0] - p1[0]) / 6)} ${n1(p2[1] - (b[1] - p1[1]) / 6)} ${n1(p2[0])} ${n1(p2[1])}`;
    }
    return d + (closed ? 'Z' : '');
  }
  // Pétale vertical (base en 0,0, pointe vers le haut) : largeur maxi w, longueur L
  function petalPath(L, w, { tip = .55, notch = 0, wave = 0, base = .12 } = {}) {
    const pts = [[0, 0]], N = 9;
    for (let i = 1; i <= N; i++) { const t = i / N, y = -L * t, ww = w * Math.pow(Math.sin(Math.PI * (base + (1 - base) * t * (1 - tip * .3))), .8) * (t > .85 ? 1 - (t - .85) * 2.6 : 1); pts.push([ww + (wave ? Math.sin(t * 11) * wave : 0), y]); }
    pts.push([w * .18, -L - (notch ? 0 : w * .1)]);
    if (notch) pts.push([0, -L + notch]);
    pts.push([-w * .18, -L - (notch ? 0 : w * .1)]);
    for (let i = N; i >= 1; i--) { const p = pts[i]; pts.push([-p[0] + (wave ? Math.sin(i * 1.7) * wave * .6 : 0), p[1]]); }
    return smooth(pts);
  }
  // Bord froncé (chou) : lobe arrondi ondulé
  function ruffleLobe(L, W, waves = 5, amp = .1) {
    const pts = [[0, 0]], N = 26;
    for (let i = 0; i <= N; i++) {
      const a = Math.PI * i / N, k = 1 + amp * Math.sin(a * waves * 2 + .6);
      pts.push([-W * Math.cos(a) * k, (-L * .45 - L * .55 * Math.sin(a)) * k]);
    }
    return smooth(pts);
  }

  /* ---------- feuille réaliste : deux moitiés (pli central), nervures, brillance ---------- */
  function leaf(x, y, L, ang, { col = '#4E8A3A', w = .36, serr = 0, curl = 0, gloss = .25, veins = 4 } = {}) {
    const W = L * w, N = serr ? 22 : 12, top = [], bot = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, prof = Math.pow(Math.sin(Math.PI * Math.pow(t, .72)), .9), z = serr && i % 2 && i < N ? 1 - serr : 1;
      const mid = -W * .12 * Math.sin(Math.PI * t) + curl * t * t * L * .2;
      top.push([L * t, mid - W * prof * z]); bot.push([L * t, mid + W * prof * .92 * z]);
    }
    const ribPts = top.map((p, i) => [p[0], (p[1] + bot[i][1]) / 2]);
    const line = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${n1(p[0])} ${n1(p[1])}`).join(' ');
    const upper = line(top) + ' ' + line([...ribPts].reverse()).replace('M', 'L') + 'Z';
    const lower = line(bot) + ' ' + line([...ribPts].reverse()).replace('M', 'L') + 'Z';
    const all = line(top) + ' ' + line([...bot].reverse()).replace('M', 'L') + 'Z';
    let v = '';
    for (let i = 1; i <= veins; i++) { const t = i / (veins + 1.2), k = Math.round(t * N), rp = ribPts[k]; const k2 = Math.min(N, k + 2);
      v += `<path d="M${n1(rp[0])} ${n1(rp[1])} Q${n1(top[k2][0] - L * .02)} ${n1((rp[1] + top[k2][1]) / 2)} ${n1(top[k2][0])} ${n1(top[k2][1] * .8 + rp[1] * .2)} M${n1(rp[0])} ${n1(rp[1])} Q${n1(bot[k2][0] - L * .02)} ${n1((rp[1] + bot[k2][1]) / 2)} ${n1(bot[k2][0])} ${n1(bot[k2][1] * .8 + rp[1] * .2)}" fill="none" stroke="${sh(col, .35)}" stroke-width=".5" opacity=".7"/>`; }
    return `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(ang)})">
      <path d="${lower}" fill="${sh(col, -.2)}"/><path d="${upper}" fill="${sh(col, .14)}"/>
      <path d="${all}" fill="url(#fl-leafshade)"/>${v}
      <path d="${line(ribPts)}" fill="none" stroke="${sh(col, .45)}" stroke-width=".8" stroke-linecap="round"/>
      ${gloss ? `<path d="M${n1(L * .2)} ${n1(top[3][1] * .45)} Q${n1(L * .45)} ${n1(top[6][1] * .7)} ${n1(L * .7)} ${n1(top[Math.round(N * .7)][1] * .5)}" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity="${gloss}"/>` : ''}
      <path d="${all}" fill="none" stroke="${sh(col, -.5)}" stroke-width=".6" stroke-linejoin="round"/></g>`;
  }

  /* ---------- tige cylindrique (ombre à droite, reflet à gauche) ---------- */
  function stalk(top, { w = 3.4, col = '#5E9A48', bend = -4, x2 = 40 } = {}) {
    const d = `M40 238 Q${40 + bend} ${(238 + top) / 2} ${x2} ${top}`;
    return `<path d="${d}" stroke="${sh(col, -.55)}" stroke-width="${w + 1.2}" fill="none" stroke-linecap="round"/>
      <path d="${d}" stroke="${sh(col, -.12)}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
      <path d="${d}" stroke="${sh(col, .3)}" stroke-width="${w * .32}" fill="none" stroke-linecap="round" transform="translate(${-w * .22} 0)" opacity=".9"/>
      <ellipse cx="40" cy="237.5" rx="${w * .55}" ry="${w * .22}" fill="${sh(col, .45)}"/>`;
  }
  const pointOn = (top, t, bend = -4, x2 = 40) => { const u = 1 - t; return [u * u * 40 + 2 * u * t * (40 + bend) + t * t * x2, u * u * 238 + 2 * u * t * ((238 + top) / 2) + t * t * top]; };

  /* =================== LES FLEURS =================== */

  // Rose 'Heidi' : rose en coupe vue de trois quarts
  function rose(f) {
    const id = f.id, c = f.petal, ol = sh(c, -.55);
    const P = (d, fill, sw = .6) => `<path d="${d}" fill="${fill}" stroke="${ol}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    const sepal = (a) => `<path d="M0 0 C-3 4 -4 12 -1 18 C1 12 2 5 2 0Z" fill="#4C7F36" stroke="#21401A" stroke-width=".5" transform="rotate(${a})"/>`;
    return `<g>
      <g transform="translate(0 15)">${[-120, -70, 70, 120, 180].map(sepal).join('')}</g>
      ${P('M-2 -4 C-10 -27 -30 -26 -31 -12 C-32 -3 -26 5 -17 9 Z', `url(#fl-${id}-in)`)}
      ${P('M2 -4 C10 -29 31 -27 31 -11 C32 -2 26 6 17 9 Z', `url(#fl-${id}-in)`)}
      ${P('M-13 -6 C-12 -31 13 -33 15 -7 Z', `url(#fl-${id}-in)`)}
      <path d="M-29 -14 C-26 -22 -16 -24 -10 -19 M28 -14 C25 -23 14 -25 9 -20 M-10 -25 C-5 -31 5 -31 10 -26" fill="none" stroke="${sh(c, .4)}" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>
      ${P('M-13 -8 C-13 -21 13 -23 13 -8 C13 1 -13 1 -13 -8Z', `url(#fl-${id}-h-in)`)}
      <path d="M-7 -10 C-6 -17 7 -17 6 -10 C5 -5 -3 -5 -3 -10 C-3 -13 2 -13 2 -10" fill="none" stroke="${sh(f.heart, -.5)}" stroke-width="1" stroke-linecap="round"/>
      <path d="M-9 -15 C-6 -19 0 -19 3 -17" fill="none" stroke="${sh(c, .6)}" stroke-width="1.3" stroke-linecap="round"/>
      ${P('M-27 -7 C-32 8 -19 23 -2 23 C-7 12 -9 0 -5 -9 C-13 -13 -23 -13 -27 -7Z', `url(#fl-${id})`)}
      ${P('M27 -7 C32 8 19 23 2 23 C7 12 9 0 5 -9 C13 -13 23 -13 27 -7Z', `url(#fl-${id})`)}
      ${P('M-17 -3 C-17 14 -8 23 0 23 C8 23 17 14 17 -3 C10 4 -10 4 -17 -3Z', `url(#fl-${id})`)}
      <path d="M-17 -3 C-10 4 10 4 17 -3 C11 8 -11 8 -17 -3Z" fill="${sh(c, .55)}" opacity=".95"/>
      <path d="M-27 -7 C-23 -12 -14 -13 -6 -9 C-14 -8 -22 -6 -27 -7Z M27 -7 C23 -12 14 -13 6 -9 C14 -8 22 -6 27 -7Z" fill="${sh(c, .6)}"/>
      <path d="M-22 4 C-20 12 -14 17 -8 19 M9 10 C10 15 8 19 5 21" fill="none" stroke="${sh(c, -.35)}" stroke-width=".8" opacity=".7"/>
      <path d="M-24 0 C-23 6 -20 10 -16 13" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>
      <ellipse cx="0" cy="20" rx="17" ry="4" fill="url(#fl-shadow)"/>
    </g>`;
  }

  // Chrysanthème 'Serenity' : pompon en dôme, centaines de pétales-cuillères
  function pompom(f) {
    const c = f.petal, h = f.heart, RX = 25, RY = 20, H = 11;
    const spoon = 'M0 0 C-2.6 -1.5 -3.6 -6.5 -1.6 -8.6 C-.6 -9.6 .6 -9.6 1.6 -8.6 C3.6 -6.5 2.6 -1.5 0 0Z';
    let g = `<ellipse cx="0" cy="8" rx="${RX * .85}" ry="${RY * .55}" fill="${sh('#5B8A3C', -.3)}"/>`;
    const rings = [1, .88, .76, .64, .53, .43, .33, .24, .15, .07];
    rings.forEach((rr, j) => {
      const n = Math.max(5, Math.round(30 * rr) + 3);
      for (let i = 0; i < n; i++) {
        const th = (i / n) * Math.PI * 2 + j * .37 + r(-.06, .06);
        const px = Math.cos(th) * rr * RX, py = Math.sin(th) * rr * RY - (1 - rr * rr) * H;
        const light = -(px / RX) * .22 - (py / RY) * .28 + (1 - rr) * .15 - (rr > .9 && Math.sin(th) > 0 ? .12 : 0);
        const base = rr < .2 ? h : (rr < .35 ? sh(h, .45) : c);
        const fill = sh(base, Math.max(-.45, Math.min(.35, light - .05)));
        const s = (.62 + .55 * rr) * r(.9, 1.1);
        g += `<path d="${spoon}" fill="${fill}" stroke="${sh(base, -.42)}" stroke-width=".35" transform="translate(${n1(px)} ${n1(py)}) rotate(${n1(th * 180 / Math.PI + 90)}) scale(${n1(s)} ${n1(s * (.75 + .25 * Math.abs(Math.cos(th))))})"/>`;
      }
    });
    g += `<ellipse cx="-7" cy="-11" rx="12" ry="8" fill="url(#fl-gloss)" opacity=".7"/>`;
    return `<g>${g}</g>`;
  }

  // Germini 'Lollipop' : mini-gerbera vu de trois quarts, cœur sombre à couronne dorée
  function gerbera(f) {
    const id = f.id, c = f.petal, sq = .66;
    let back = '', front = '';
    const pet = (n, L, w, off, fill, op = 1) => {
      let out = '';
      for (let i = 0; i < n; i++) {
        const a = off + i * 360 / n + r(-3, 3), rad = a * Math.PI / 180;
        const p = `<g transform="scale(1 ${sq}) rotate(${n1(a)})"><path d="${petalPath(L * r(.94, 1.04), w, { notch: 1.6, base: .05, tip: .2 })}" fill="${fill}" stroke="${sh(c, -.5)}" stroke-width=".45" opacity="${op}"/><path d="M0 -4 L0 ${-L * .85}" stroke="${sh(c, -.3)}" stroke-width=".5" opacity=".6"/></g>`;
        if (Math.cos(rad) > 0) back += p; else front += p; // pétales du haut (derrière) puis du bas
      }
      return '';
    };
    pet(22, 31, 4, 0, `url(#fl-${id}-sat)`); const outer = back + front; back = ''; front = '';
    pet(20, 24, 3.6, 8, `url(#fl-${id}-in)`); const inner = back + front;
    let disc = `<ellipse cx="0" cy="1" rx="11" ry="${n1(11 * sq)}" fill="url(#fl-shadow)"/><ellipse rx="10" ry="${n1(10 * sq)}" fill="url(#fl-ger-disc)"/>`;
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; disc += `<circle cx="${n1(Math.cos(a) * 8.4)}" cy="${n1(Math.sin(a) * 8.4 * sq)}" r="1.2" fill="${i % 3 ? '#F2B230' : '#FFD25A'}"/>`; }
    for (let i = 0; i < 14; i++) { const a = i * 2.4, rr = 1.2 + i * .28; disc += `<circle cx="${n1(Math.cos(a) * rr)}" cy="${n1(Math.sin(a) * rr * sq)}" r=".55" fill="#7A4A22"/>`; }
    disc += `<ellipse cx="-2.5" cy="-1.6" rx="3.2" ry="1.4" fill="#fff" opacity=".18"/>`;
    return `<g transform="rotate(-8) scale(1.12)">${outer}${inner}${disc}</g>`;
  }

  // Trachelium : dôme de minuscules fleurs étoilées violettes
  function trachelium(f) {
    const c = f.petal, RX = 24, RY = 17;
    let g = `<ellipse cx="0" cy="6" rx="${RX * .7}" ry="7" fill="#3E6630"/><ellipse cx="0" cy="0" rx="${RX}" ry="${RY}" fill="url(#fl-${f.id}-dome)"/>`;
    const pts = [];
    for (let i = 0; i < 170; i++) { let u, v; do { u = r(-1, 1); v = r(-1, 1); } while (u * u + v * v > 1); pts.push([u * RX * 1.02, v * RY - (1 - u * u - v * v) * 4]); }
    pts.sort((a, b) => a[1] - b[1]).forEach(([x, y]) => {
      const light = -(x / RX) * .25 - (y / RY) * .3;
      const fill = sh(c, Math.max(-.45, Math.min(.42, light + r(-.08, .08))));
      const rot = r(0, 72);
      g += `<path d="M0 -2.3 L.7 -.7 L2.2 -.7 L1 .3 L1.4 1.9 L0 1 L-1.4 1.9 L-1 .3 L-2.2 -.7 L-.7 -.7Z" fill="${fill}" stroke="${sh(c, -.45)}" stroke-width=".25" transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})"/>`;
      if (rnd() < .35) g += `<path d="M${n1(x)} ${n1(y)} l${n1(r(-1.5, 1.5))} ${n1(r(-3.5, -2))}" stroke="${sh(c, .55)}" stroke-width=".35"/>`;
    });
    g += `<ellipse cx="-8" cy="-7" rx="10" ry="6" fill="url(#fl-gloss)" opacity=".5"/>`;
    return `<g>${g}</g>`;
  }

  // Limonium (statice) : tiges ramifiées et grappes de calices papier
  function limonium(f) {
    const c = f.petal;
    let st = '', fl = '';
    const tips = [];
    const branch = (x, y, ang, len, depth) => {
      const rad = ang * Math.PI / 180, x2 = x + Math.sin(rad) * len, y2 = y - Math.cos(rad) * len;
      st += `<path d="M${n1(x)} ${n1(y)} Q${n1((x + x2) / 2 + r(-2, 2))} ${n1((y + y2) / 2)} ${n1(x2)} ${n1(y2)}" stroke="#6F8F5A" stroke-width="${n1(1.6 - (3 - depth) * .35)}" fill="none" stroke-linecap="round"/>`;
      if (depth <= 0) { tips.push([x2, y2, ang]); return; }
      branch(x2, y2, ang - r(18, 30), len * r(.6, .75), depth - 1);
      branch(x2, y2, ang + r(18, 30), len * r(.6, .75), depth - 1);
      if (rnd() < .5) tips.push([(x + x2) / 2, (y + y2) / 2, ang + 40]);
    };
    [-24, -6, 12, 28].forEach((a) => branch(40, 118, a + r(-4, 4), r(30, 38), 2));
    tips.forEach(([x, y, a]) => {
      for (let k = 0; k < 5; k++) {
        const t = k / 5, rad = a * Math.PI / 180, cx = x - Math.sin(rad) * t * 9 + (k % 2 ? 2 : -2), cy = y + Math.cos(rad) * t * 9 - 1;
        const col = sh(c, r(-.3, .25));
        fl += `<path d="M${n1(cx - 2.6)} ${n1(cy + 1)} C${n1(cx - 3)} ${n1(cy - 2.6)} ${n1(cx + 2.8)} ${n1(cy - 3)} ${n1(cx + 2.6)} ${n1(cy + .6)} C${n1(cx + 1)} ${n1(cy + 2.2)} ${n1(cx - 1)} ${n1(cy + 2.2)} ${n1(cx - 2.6)} ${n1(cy + 1)}Z" fill="${col}" stroke="${sh(c, -.5)}" stroke-width=".3"/>`;
        if (rnd() < .6) fl += `<circle cx="${n1(cx + r(-.6, .6))}" cy="${n1(cy - 1.4)}" r=".9" fill="#FFF8E6"/>`;
      }
    });
    return st + fl;
  }

  // Chou d'ornement 'Crane Queen' : rosette froncée, cœur fuchsia
  function cabbage(f) {
    const c = f.petal, h = f.heart, sq = .74;
    const layer = (n, L, W, off, col, waves, vein) => {
      const items = [];
      for (let i = 0; i < n; i++) {
        const a = off + i * 360 / n + r(-6, 6), rad = a * Math.PI / 180;
        const lobe = ruffleLobe(L * r(.92, 1.06), W, waves, .14);
        items.push([Math.cos(rad), `<g transform="scale(1 ${sq}) rotate(${n1(a)})"><path d="${lobe}" fill="${col}" stroke="${sh(col, -.5)}" stroke-width=".5"/><path d="${lobe}" fill="url(#fl-ao)" opacity=".8"/>
          <path d="M0 -2 L0 ${-L * .85} M0 ${-L * .4} l${-W * .5} ${-L * .3} M0 ${-L * .4} l${W * .5} ${-L * .3} M0 ${-L * .62} l${-W * .35} ${-L * .22} M0 ${-L * .62} l${W * .35} ${-L * .22}" stroke="${vein}" stroke-width=".7" fill="none" opacity=".85"/></g>`]);
      }
      return items.sort((a, b) => b[0] - a[0]).map((x) => x[1]).join('');
    };
    return `<g transform="translate(0 4)">
      <ellipse cx="0" cy="10" rx="24" ry="7" fill="url(#fl-shadow)"/>
      ${layer(8, 30, 15, 10, '#86A893', 7, '#E8D7E4')}
      <g transform="translate(0 -6) scale(1 .95)">${layer(7, 23, 12, 34, sh(c, -.12), 6, '#F7E6F0')}</g>
      <g transform="translate(0 -11) scale(1 .9)">${layer(6, 16, 10, 5, sh(h, .25), 5, sh(h, .6))}</g>
      <g transform="translate(0 -15) scale(1 .85)">${layer(5, 9, 7, 20, sh(h, -.05), 4, sh(h, .5))}</g>
      <g transform="translate(0 -17)"><ellipse rx="6" ry="4.4" fill="url(#fl-${f.id}-h-dome)"/>
        <path d="M-5 -1 q2 -3 4 -1 q2 -3 4 0 M-3 2 q2 -2 4 0 q1 -2 3 0" fill="none" stroke="${sh(h, -.45)}" stroke-width=".7"/>
        <ellipse cx="-2" cy="-1.6" rx="3" ry="1.4" fill="#fff" opacity=".25"/></g>
    </g>`;
  }

  // Muflier (gueule-de-loup) : épi de fleurs à deux lèvres, boutons au sommet
  function snapdragon(f) {
    const c = f.petal, ol = sh(c, -.55);
    let g = '';
    const N = 17;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1), y = 12 + t * 100, side = i % 2 ? 1 : -1, x = 40 + side * .8;
      if (t < .26) { // boutons serrés au sommet
        const s = .45 + t * 1.8;
        g += `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${side * 28}) scale(${n1(s)})"><path d="M0 2 C-3 -2 -2.5 -8 0 -10 C2.5 -8 3 -2 0 2Z" fill="${t < .1 ? '#A5C46E' : `url(#fl-${f.id}-sat)`}" stroke="${ol}" stroke-width=".5"/><path d="M-2.6 1 L0 4.5 L2.6 1" fill="#5E8C3E"/></g>`;
        continue;
      }
      const s = .5 + t * .38;
      g += `<g transform="translate(${n1(x)} ${n1(y)}) scale(${n1(side * s)} ${n1(s)}) rotate(${n1(-6 + r(-6, 6))})">
        <path d="M-1 1 L3 5 L4 -1Z" fill="#5E8C3E"/>
        <path d="M1 -1.5 C4 -6 8 -10 12.5 -10 C14 -13 18 -12.5 18 -9 C21 -10.5 23.5 -6.5 20.5 -4 C16 -2.5 8 -1.5 1 -1.5Z" fill="url(#fl-${f.id})" stroke="${ol}" stroke-width=".5"/>
        <path d="M14.5 -10 C14.5 -7.5 16 -5.5 18 -5" fill="none" stroke="${ol}" stroke-width=".45" opacity=".7"/>
        <path d="M1 0 C7 1 14 .8 20 0 C23.5 1.2 24 5.5 20 6.5 C18 9.5 12.5 9.5 10.5 7.5 C7 7.5 2.5 4.5 1 0Z" fill="url(#fl-${f.id}-sat)" stroke="${ol}" stroke-width=".5"/>
        <path d="M13 5 C14 7 16 8 18 7.5" fill="none" stroke="${ol}" stroke-width=".4" opacity=".6"/>
        <path d="M9 -1.2 C13 -.6 17 -.6 21 -1.6" fill="none" stroke="${sh(c, -.65)}" stroke-width="1" stroke-linecap="round"/>
        <ellipse cx="15.5" cy="1.8" rx="3.6" ry="1.7" fill="#F5C842"/><ellipse cx="15" cy="1.3" rx="1.6" ry=".7" fill="#FFF0A8"/>
        <path d="M4 -4 C7 -7.5 10 -8.6 13 -8.6" fill="none" stroke="#fff" stroke-width=".9" opacity=".55" stroke-linecap="round"/></g>`;
    }
    return g;
  }

  // Feuillage de pistachier : feuilles composées vernissées, rachis rougeâtre
  function pistachio(f) {
    let g = '';
    const compound = (x, y, ang, len, k) => {
      let s = `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(ang)})"><path d="M0 0 Q${n1(len * .1)} ${n1(-len * .5)} 0 ${n1(-len)}" stroke="#8A4E3A" stroke-width="1.1" fill="none"/>`;
      const pairs = 4;
      for (let i = 0; i < pairs; i++) {
        const t = .18 + i * .21, yy = -len * t, L = 15 - i * 1.2;
        const col = [f.petal, f.heart, '#3F6E34'][(i + k) % 3];
        s += leaf(0, yy, L, -150 + i * 8, { col, w: .34, gloss: .4, veins: 2 }) + leaf(0, yy, L, -30 - i * 8, { col: sh(col, -.08), w: .34, gloss: .4, veins: 2 });
      }
      s += leaf(0, -len, 13, -90, { col: f.petal, w: .34, gloss: .4, veins: 2 }) + '</g>';
      return s;
    };
    g += stalk(16, { w: 2.6, col: '#7B5A3E', bend: -3 });
    [[.12, -48], [.3, 42], [.46, -40], [.6, 38], [.74, -30], [.86, 24]].forEach(([t, a], k) => {
      const [x, y] = pointOn(16, t, -3); g += compound(x, y, a, 46 - k * 3, k);
    });
    g += compound(40, 18, -4, 34, 2);
    return g;
  }

  // Eucalyptus 'Cinerea' : feuilles rondes argentées, paires opposées
  function eucalyptus() {
    let g = stalk(12, { w: 2.2, col: '#8C7466', bend: -3 });
    const one = (x, y, side, R, tilt) => {
      const rx = R, ry = R * r(.78, .92), ang = side * tilt;
      return `<g transform="translate(${n1(x + side * R * .78)} ${n1(y - R * .25)}) rotate(${n1(ang)})"><path d="M${n1(-rx)} 0 C${n1(-rx)} ${n1(-ry * 1.1)} ${n1(rx * .9)} ${n1(-ry * 1.15)} ${n1(rx)} ${n1(-ry * .1)} C${n1(rx * 1.02)} ${n1(ry * .9)} ${n1(-rx * .95)} ${n1(ry * 1.1)} ${n1(-rx)} 0Z" fill="url(#fl-euca)" stroke="#557A70" stroke-width=".5" transform="scale(${side} 1)"/>
        <path d="M${n1(-side * rx * .95)} 0 Q0 ${n1(-ry * .12)} ${n1(side * rx * .75)} ${n1(-ry * .2)}" stroke="#E8F2EE" stroke-width=".55" fill="none" opacity=".75"/>
        <ellipse cx="${n1(-rx * .25)}" cy="${n1(-ry * .4)}" rx="${n1(rx * .32)}" ry="${n1(ry * .18)}" fill="#fff" opacity=".3"/></g>`;
    };
    for (let i = 0; i < 12; i++) {
      const t = .07 + i * .079, [x, y] = pointOn(12, t, -3), R = 13.5 - i * .7;
      const front = i % 2 ? one(x, y, 1, R * r(.9, 1.05), r(-28, -12)) : one(x, y, -1, R * r(.9, 1.05), r(-28, -12));
      const back = i % 2 ? one(x, y + 3, -1, R * r(.75, .9), r(-30, -15)) : one(x, y + 3, 1, R * r(.75, .9), r(-30, -15));
      g += back + front;
    }
    return g;
  }

  /* ---------- assemblage d'une tige ---------- */
  const CFG = {
    rose: { top: 52, at: [40, 40], leaves: (s) => leaf(40, 150, 26, -150, { col: '#3F6E30', serr: .18 }) + leaf(39, 150, 22, -100, { col: '#4A7D38', serr: .18 }) + leaf(41, 150, 22, -205, { col: '#4A7D38', serr: .18 }) + leaf(39, 105, 24, -28, { col: '#45783A', serr: .18 }) + [190, 172, 128, 90].map((y, i) => `<path d="M${40 + (i % 2 ? 1.8 : -1.8)} ${y} l${i % 2 ? 3.5 : -3.5} -1.5 l${i % 2 ? -3.2 : 3.2} -1.8z" fill="#7A4A2A"/>`).join('') },
    pompom: { top: 50, at: [40, 38], leaves: () => leaf(40, 160, 34, -155, { col: '#4C7A3A', w: .42, serr: .28, gloss: .15 }) + leaf(39, 120, 32, -25, { col: '#557F40', w: .42, serr: .28, gloss: .15 }) },
    daisy: { top: 40, at: [40, 36], leaves: () => '', hairy: true },
    cloud: { top: 44, at: [40, 36], leaves: () => leaf(40, 150, 30, -150, { col: '#4E7D3A', serr: .12 }) + leaf(39, 108, 28, -30, { col: '#58864A', serr: .12 }) + leaf(39, 75, 20, -160, { col: '#4E7D3A', serr: .1 }) },
    spray: { top: 118, at: [0, 0], leaves: () => leaf(40, 196, 16, -160, { col: '#6F8F5A', w: .22 }) + leaf(40, 160, 14, -20, { col: '#6F8F5A', w: .22 }), col: '#6F8F5A', w: 2.4 },
    cabbage: { top: 52, at: [40, 40], leaves: () => [200, 176, 150, 124, 98].map((y, i) => `<path d="M37.4 ${y} q2.6 -2 5.2 0" stroke="#7F9C78" stroke-width="1" fill="none"/>`).join(''), col: '#9DB98E', w: 5.2 },
    spike: { top: 12, at: [0, 0], leaves: () => leaf(40, 205, 34, -160, { col: '#4F7E3C', w: .18 }) + leaf(40, 180, 32, -18, { col: '#5A8A45', w: .18 }) + leaf(40, 150, 28, -165, { col: '#4F7E3C', w: .18 }) + leaf(40, 128, 24, -12, { col: '#5A8A45', w: .18 }) },
  };
  const HEADS = { rose, pompom: pompom, daisy: gerbera, cloud: trachelium, spray: limonium, cabbage, spike: snapdragon, foliage: pistachio, euca: eucalyptus };

  function stemInner(f, v = 0) {
    reseed(v + f.id.length * 31 + f.id.charCodeAt(0));
    if (f.type === 'foliage' || f.type === 'euca') return HEADS[f.type](f);
    const C = CFG[f.type];
    let s = stalk(C.top, { w: C.w || 3.2, col: C.col || '#5E9A48' }) + C.leaves(v);
    if (C.hairy) for (let y = 60; y < 230; y += 7) s += `<path d="M${40 + (y % 14 ? 1.8 : -1.8)} ${y} l${y % 14 ? 1.6 : -1.6} -1.2" stroke="#B9D69A" stroke-width=".5"/>`;
    const head = HEADS[f.type](f);
    s += f.type === 'spray' || f.type === 'spike' ? head : `<g transform="translate(${C.at[0]} ${C.at[1]})">${head}</g>`;
    return s;
  }
  function stem(f, v = 0, W = 80, H = 240) {
    return `<svg viewBox="0 0 80 240" width="${W}" height="${H}" overflow="visible" aria-hidden="true">${stemInner(f, v)}</svg>`;
  }

  /* ---------- seau en zinc garni ---------- */
  function bucket(f) {
    const fan = f.type === 'foliage' || f.type === 'euca' ? [-16, 0, 16] : [-15, -5, 5, 15];
    const stems = fan.map((a, i) => `<g transform="translate(55 128) rotate(${a}) translate(-20 -118) scale(.5)">${stemInner(f, i + 1)}</g>`).join('');
    return `<svg class="b-scene" viewBox="0 0 110 160" overflow="visible" aria-hidden="true">
      <ellipse cx="55" cy="156" rx="34" ry="4" fill="url(#fl-shadow)"/>
      <ellipse cx="55" cy="104" rx="33" ry="7" fill="url(#fl-water)"/>
      ${stems}
      <path d="M22 104 L28 152 Q55 158 82 152 L88 104 Q55 113 22 104Z" fill="url(#fl-zinc)" stroke="#4E5B62" stroke-width=".8"/>
      <path d="M24 118 Q55 126 86 118 M26.5 138 Q55 145 83.5 138" fill="none" stroke="#7D8C93" stroke-width="1.6"/>
      <path d="M24 119.4 Q55 127.4 86 119.4 M26.5 139.4 Q55 146.4 83.5 139.4" fill="none" stroke="#F4F8F9" stroke-width=".7" opacity=".8"/>
      <path d="M21 104 Q55 114 89 104" fill="none" stroke="#E9EFF1" stroke-width="3.4" stroke-linecap="round"/><path d="M21 104 Q55 114 89 104" fill="none" stroke="#4E5B62" stroke-width=".7"/>
      <circle cx="24.5" cy="110" r="2.4" fill="#9AA8AF" stroke="#4E5B62" stroke-width=".6"/><circle cx="85.5" cy="110" r="2.4" fill="#9AA8AF" stroke="#4E5B62" stroke-width=".6"/>
      <path d="M36 112 L39 150" stroke="#fff" stroke-width="3" opacity=".25" stroke-linecap="round"/>
    </svg>`;
  }

  /* ---------- main du fleuriste ---------- */
  const hand = () => `<svg class="hand-svg" viewBox="0 0 80 70" overflow="visible"><path d="M18 30 q-6 -18 8 -18 q6 0 8 10 q2 -14 12 -12 q8 2 6 14 q6 -10 14 -4 q6 6 -2 18 q-4 24 -26 26 q-22 0 -24 -20 q-8 -8 -2 -14z" fill="url(#fl-skin)" stroke="#B57A5A" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M34 22 q1 7 0 14 M46 24 q1 6 0 12" stroke="#C98A68" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <path d="M24 16 q3 -2 6 1 M38 13 q3 -2 6 1 M57 21 q2 -2 5 0" stroke="#fff" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".55"/>
    <path d="M22 50 q14 14 34 2" stroke="#C98A68" stroke-width="1" fill="none" opacity=".6"/></svg>`;

  /* ---------- papier kraft et ruban ---------- */
  const wrap = (cx = 0, cy = 0) => `
    <path d="M${cx - 72} ${cy - 72} Q${cx} ${cy - 84} ${cx + 72} ${cy - 72} L${cx + 14} ${cy + 30} L${cx - 14} ${cy + 30} Z" fill="url(#fl-kraft)" stroke="#8A6236" stroke-width="1" stroke-linejoin="round"/>
    <path d="M${cx - 72} ${cy - 72} L${cx - 40} ${cy - 50} L${cx - 14} ${cy + 30}Z" fill="#9C7040" opacity=".35"/>
    <path d="M${cx + 72} ${cy - 72} L${cx + 42} ${cy - 48} L${cx + 14} ${cy + 30}" fill="none" stroke="#F3DDB4" stroke-width="1.2" opacity=".8"/>
    <path d="M${cx - 30} ${cy - 60} L${cx - 6} ${cy + 20} M${cx + 26} ${cy - 62} L${cx + 6} ${cy + 18}" stroke="#8A6236" stroke-width=".7" opacity=".5"/>
    <path d="M${cx - 22} ${cy - 6} q-24 -18 -6 -22 q14 0 6 22 q16 -24 26 -12 q4 14 -26 12" fill="url(#fl-ribbon)" stroke="#8E2216" stroke-width="1"/>
    <path d="M${cx - 4} ${cy - 4} q-4 14 -10 26 M${cx + 2} ${cy - 4} q6 12 12 24" stroke="#C93A2A" stroke-width="4" stroke-linecap="round" fill="none"/>
    <ellipse cx="${cx - 2}" cy="${cy - 5}" rx="4" ry="3.4" fill="#C93A2A" stroke="#8E2216" stroke-width=".8"/>
    <path d="M${cx - 26} ${cy - 18} q4 -4 8 -1" stroke="#fff" stroke-width="1.2" fill="none" opacity=".5" stroke-linecap="round"/>`;

  return { DEFS, stem, stemInner, bucket, hand, wrap };
})();
