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
  const reseed = (s) => { seed = 1 + Math.abs(Math.round(s * 7919)) % 2147483000; for (let i = 0; i < 12; i++) rnd(); };

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

  // Germini : mini-gerbera vu de trois quarts
  function gerbera(f) {
    return `<g transform="rotate(-8) scale(1.12)">${ray({ id: f.id, c: f.petal, heart: f.heart, n: 22, L: 31, w: 4, sq: .66, disc: 10, notch: 1.6 })}</g>`;
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

  /* =================== NOUVELLES ESPÈCES (tous les bouquets Truffaut) =================== */
  const lum = (c) => { const n = parseInt(c.slice(1), 16); return ((n >> 16) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11) / 255; };
  // Tige fine (rameau) ombrée
  function twig(x0, y0, x1, y1, w = 1.4, col = '#5E9A48', bow = 0) {
    const d = `M${n1(x0)} ${n1(y0)} Q${n1((x0 + x1) / 2 + bow)} ${n1((y0 + y1) / 2)} ${n1(x1)} ${n1(y1)}`;
    return `<path d="${d}" stroke="${sh(col, -.5)}" stroke-width="${n1(w + .7)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${col}" stroke-width="${n1(w)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${sh(col, .35)}" stroke-width="${n1(w * .3)}" fill="none" stroke-linecap="round" transform="translate(${n1(-w * .2)} 0)"/>`;
  }
  const leaves = (ys, L, o = {}, x = 40) => ys.map((y, i) => leaf(x, y, L * r(.9, 1.08), i % 2 ? -28 + r(-8, 8) : -152 + r(-8, 8), o)).join('');
  const isDark = (c) => lum(c) < .35;

  // Fleur radiée générique : germini, tournesol, marguerites…
  function ray({ id, c, heart, n = 20, L = 28, w = 4, sq = .66, inner = true, notch = 1.4, disc = 10, tip = .2, discFill, ring, seeds = 0, outline }) {
    const ol = outline || sh(c, -.5);
    const layer = (n, L, w, off, fill) => {
      let back = '', front = '';
      for (let i = 0; i < n; i++) {
        const a = off + i * 360 / n + r(-3, 3), rad = a * Math.PI / 180;
        const p = `<g transform="scale(1 ${sq}) rotate(${n1(a)})"><path d="${petalPath(L * r(.93, 1.05), w, { notch, base: .05, tip })}" fill="${fill}" stroke="${ol}" stroke-width=".45"/><path d="M0 ${-disc * .4} L0 ${n1(-L * .85)}" stroke="${sh(c, -.25)}" stroke-width=".45" opacity=".55"/></g>`;
        if (Math.cos(rad) > 0) back += p; else front += p;
      }
      return back + front;
    };
    let g = layer(n, L, w, 0, `url(#fl-${id}-sat)`);
    if (inner) g += layer(Math.round(n * .9), L * .78, w * .9, 180 / n, `url(#fl-${id}-in)`);
    const dark = isDark(heart), dRy = disc * sq;
    g += `<ellipse cy="1" rx="${n1(disc * 1.2)}" ry="${n1(dRy * 1.2)}" fill="url(#fl-shadow)"/><ellipse rx="${disc}" ry="${n1(dRy)}" fill="${discFill || (dark ? 'url(#fl-ger-disc)' : `url(#fl-${id}-h-dome)`)}"/>`;
    if (seeds) for (let i = 0; i < seeds; i++) { const a = i * 2.39996, rr = Math.sqrt(i / seeds) * disc * .92; g += `<circle cx="${n1(Math.cos(a) * rr)}" cy="${n1(Math.sin(a) * rr * sq)}" r="${n1(.35 + rr / disc * .35)}" fill="${i % 4 ? '#6A3E18' : '#C88A2A'}"/>`; }
    else {
      const rn = Math.round(disc * 2.6);
      for (let i = 0; i < rn; i++) { const a = i / rn * Math.PI * 2; g += `<circle cx="${n1(Math.cos(a) * disc * .82)}" cy="${n1(Math.sin(a) * disc * .82 * sq)}" r="${n1(disc * .12)}" fill="${ring || (dark ? (i % 3 ? '#F2B230' : '#FFD25A') : sh(heart, .45))}"/>`; }
    }
    g += `<ellipse cx="${n1(-disc * .28)}" cy="${n1(-dRy * .3)}" rx="${n1(disc * .34)}" ry="${n1(dRy * .25)}" fill="#fff" opacity=".2"/>`;
    return g;
  }

  // Rosette de lobes froncés (pivoine, chou)
  function rosette(layers, id, sq = .72) {
    return layers.map(({ n, L, W, off = 0, fill, waves = 5, amp = .1, dy = 0, sy = 1, vein }) => {
      const items = [];
      for (let i = 0; i < n; i++) {
        const a = off + i * 360 / n + r(-7, 7), rad = a * Math.PI / 180, lobe = ruffleLobe(L * r(.9, 1.07), W * r(.92, 1.06), waves, amp);
        const col = fill.startsWith('url') ? null : fill;
        items.push([Math.cos(rad), `<g transform="scale(1 ${sq}) rotate(${n1(a)})"><path d="${lobe}" fill="${fill}" stroke="${col ? sh(col, -.45) : 'rgba(80,20,30,.45)'}" stroke-width=".45"/><path d="${lobe}" fill="url(#fl-ao)" opacity=".65"/>${vein ? `<path d="M0 -2 L0 ${n1(-L * .8)}" stroke="${vein}" stroke-width=".6" opacity=".7"/>` : ''}</g>`]);
      }
      return `<g transform="translate(0 ${dy}) scale(1 ${sy})">${items.sort((a, b) => b[0] - a[0]).map((x) => x[1]).join('')}</g>`;
    }).join('');
  }
  // Disque froncé (fleurons de giroflée)
  function ruffDisc(R, waves = 7, amp = .14) {
    const pts = []; for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, k = R * (1 + amp * Math.sin(a * waves + R)); pts.push([Math.cos(a) * k, Math.sin(a) * k]); }
    return smooth(pts);
  }

  /* ----- Roses branchues ----- */
  function rosebud(f, x, y, ang, s) {
    return `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(ang)}) scale(${n1(s)})"><path d="M0 2 C-5 -2 -5 -11 0 -16 C5 -11 5 -2 0 2Z" fill="url(#fl-${f.id})" stroke="${sh(f.petal, -.55)}" stroke-width=".6"/><path d="M-1 -14 C1 -10 1 -5 -1 0" stroke="${sh(f.petal, -.4)}" stroke-width=".6" fill="none"/>
      <path d="M0 3 C-4 0 -7 -4 -6 -8 C-4 -4 -2 -2 0 0 C2 -2 4 -4 6 -8 C7 -4 4 0 0 3Z" fill="#4C7F36" stroke="#21401A" stroke-width=".4"/></g>`;
  }
  function sprayrose(f) {
    let g = stalk(110, { w: 2.8 }) + leaves([180, 150], 22, { col: '#3F6E30', serr: .18 });
    const heads = [[22, 52, .5], [40, 34, .58], [58, 50, .5]];
    heads.forEach(([x, y]) => { g += twig(40, 110, x, y + 10, 1.5, '#5E9A48', (x - 40) * -.2); });
    g += twig(40, 90, 14, 32, 1.1) + twig(40, 96, 66, 30, 1.1);
    g += rosebud(f, 14, 32, -25, .7) + rosebud(f, 66, 30, 25, .65);
    heads.forEach(([x, y, s]) => { g += `<g transform="translate(${x} ${y}) scale(${s})">${rose(f)}</g>`; });
    return g;
  }

  /* ----- Chrysanthèmes ----- */
  function disbud(f) {
    // Grosse boule de pétales incurvés (chrysanthème unifleur), vue un peu en plongée
    const c = f.petal, h = f.heart, R = 24;
    const pet = 'M0 0 C-4.4 -2 -5.6 -9 -3 -12.6 C-1.6 -14.4 1.6 -14.4 3 -12.6 C5.6 -9 4.4 -2 0 0Z';
    const items = [];
    for (let k = 0; k < 10; k++) {
      const phi = -.5 + k * .17, rr = Math.cos(phi), y0 = -Math.sin(phi) * R * .9, n = Math.round(30 * rr) + 4;
      for (let i = 0; i < n; i++) {
        const th = (i / n) * Math.PI * 2 + k * .37, z = Math.sin(th) * rr;
        if (z < -.35 && k < 8) continue;
        const x = Math.cos(th) * rr * R, y = y0 + Math.sin(th) * rr * R * .32;
        const ax = 0, ay = -R * .95, ang = Math.atan2(ax - x, -(ay - y)) * 180 / Math.PI;
        const light = -(x / R) * .25 - (y / R) * .22 + z * .12 + (k > 8 ? .1 : 0);
        const base = k > 8 ? sh(h, .3) : c, sc = (.5 + .45 * rr) * (1 - Math.max(0, k - 6) * .08);
        items.push([z + k * .05, `<g transform="translate(${n1(x)} ${n1(y + 7)}) rotate(${n1(ang + r(-8, 8))}) scale(${n1(sc * .95)} ${n1(sc)})"><path d="${pet}" fill="${sh(base, Math.max(-.48, Math.min(.38, light)))}" stroke="${sh(base, -.5)}" stroke-width=".4"/><path d="M-2.6 -12 C-1.2 -13.6 1.2 -13.6 2.6 -12" stroke="${sh(base, Math.min(.6, light + .35))}" stroke-width=".9" fill="none" stroke-linecap="round"/></g>`]);
      }
    }
    for (let i = 0; i < 9; i++) { const a = i * 40 + r(-10, 10); items.push([9, `<g transform="translate(${n1(Math.cos(i) * 2.5)} ${n1(-R * .78 + Math.sin(i) * 1.6)}) rotate(${n1(a)}) scale(.42)"><path d="${pet}" fill="${sh(h, .2 + r(-.1, .1))}" stroke="${sh(h, -.4)}" stroke-width=".6"/></g>`]); }
    items.sort((a, b) => a[0] - b[0]);
    return `<g><ellipse cx="0" cy="16" rx="18" ry="5" fill="url(#fl-shadow)"/><ellipse cx="0" cy="13" rx="9" ry="4.4" fill="#4C7A36"/>${items.map((x) => x[1]).join('')}<ellipse cx="-8" cy="-10" rx="10" ry="7" fill="url(#fl-gloss)" opacity=".5"/></g>`;
  }
  const chrysLeaf = (x, y, L, ang) => leaf(x, y, L, ang, { col: '#4C7A3A', w: .42, serr: .3, gloss: .15 });
  function sprayHeads(f, pts, head, { split = 96, leafY = [170, 135], leafFn = chrysLeaf } = {}) {
    let g = stalk(split, { w: 2.8 }) + leafY.map((y, i) => leafFn(40, y, 28, i % 2 ? -30 : -150)).join('');
    pts.forEach(([x, y], i) => { g += twig(40, split, x, y + 3, 1.3, '#5E9A48', (x - 40) * -.25 + (i % 2 ? 3 : -3)); });
    [...pts].sort((a, b) => a[1] - b[1]).forEach(([x, y, s = 1]) => { g += `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(r(-14, 14))}) scale(${n1(s)})">${head()}</g>`; });
    return g;
  }
  function santini(f) {
    const mid = isDark(f.petal) && !isDark(f.heart);
    return sprayHeads(f, [[20, 44, .9], [40, 26, 1], [60, 40, .95], [28, 66, .85], [53, 64, .85]], () => ray({ id: f.id, c: f.petal, heart: f.heart, n: 16, L: 11, w: 2.7, sq: .8, disc: 4.2, notch: .6, ring: mid ? sh(f.heart, -.2) : null }));
  }
  function asters(f) {
    return sprayHeads(f, [[16, 46, .9], [30, 32, 1], [46, 22, 1], [62, 36, .95], [24, 62, .85], [50, 52, .9], [66, 58, .8]], () => ray({ id: f.id, c: f.petal, heart: f.heart, n: 18, L: 8.5, w: 1.5, sq: .78, disc: 2.8, notch: 0, inner: false, tip: .6, outline: '#9AA090' }), { split: 100, leafFn: (x, y, L, a) => leaf(x, y, L * .8, a, { col: '#4E7D3A', w: .18 }) });
  }
  function matricaria(f) {
    const pts = [[14, 50, .85], [26, 36, .95], [40, 26, 1], [55, 34, .95], [67, 48, .85], [22, 62, .8], [40, 50, .9], [58, 62, .8], [32, 74, .75]];
    return sprayHeads(f, pts, () => ray({ id: f.id, c: f.petal, heart: f.heart, n: 13, L: 6.5, w: 2.1, sq: .8, disc: 3.2, notch: .5, inner: false, ring: '#F8DA4A', outline: '#9AA090' }) + `<ellipse cy="-1" rx="2.6" ry="1.8" fill="#F8D23A"/><ellipse cx="-.8" cy="-1.6" rx="1" ry=".6" fill="#FFF3A0"/>`,
      { split: 104, leafFn: (x, y, L, a) => leaf(x, y, L * .9, a, { col: '#5E8E44', w: .3, serr: .45, gloss: 0, veins: 2 }) });
  }
  function sunflower(f) {
    let g = stalk(52, { w: 4.6, col: '#5E8E40' }) + leaf(40, 170, 40, -160, { col: '#4E7D34', w: .55, serr: .08 }) + leaf(39, 120, 36, -22, { col: '#5A8A3E', w: .55, serr: .08 });
    for (let y = 60; y < 230; y += 6) g += `<path d="M${40 + (y % 12 ? 2.5 : -2.5)} ${y} l${y % 12 ? 1.6 : -1.6} -1.2" stroke="#B9D69A" stroke-width=".5"/>`;
    g += `<g transform="translate(40 38) rotate(-6)">${ray({ id: f.id, c: f.petal, heart: f.heart, n: 24, L: 23, w: 5, sq: .72, disc: 13, notch: 0, tip: .55, seeds: 150, discFill: 'url(#fl-ger-disc)' })}</g>`;
    return g;
  }

  /* ----- Dahlia ----- */
  function dahlia(f) {
    const id = f.id, c = f.petal, sq = .7;
    let g = `<ellipse cy="4" rx="26" ry="10" fill="url(#fl-shadow)"/>`;
    [[16, 27, 6], [15, 22, 5.6], [14, 17.5, 4.8], [12, 13, 4], [10, 9, 3.2], [8, 5.5, 2.4]].forEach(([n, L, w], k) => {
      let back = '', front = '';
      for (let i = 0; i < n; i++) {
        const a = k * 11 + i * 360 / n + r(-3, 3), rad = a * Math.PI / 180;
        const p = `<g transform="scale(1 ${sq}) rotate(${n1(a)})"><path d="${petalPath(L, w, { tip: .95, base: .05 })}" fill="url(#fl-${id}${k % 2 ? '' : '-sat'})" stroke="${sh(c, -.5)}" stroke-width=".4"/><path d="M0 -2 L0 ${n1(-L * .82)}" stroke="${sh(c, -.3)}" stroke-width=".7" opacity=".5"/><path d="M${n1(-w * .35)} ${n1(-L * .25)} Q${n1(-w * .45)} ${n1(-L * .6)} ${n1(-w * .1)} ${n1(-L * .85)}" stroke="#fff" stroke-width=".6" fill="none" opacity=".35"/></g>`;
        if (Math.cos(rad) > 0) back += p; else front += p;
      }
      g += `<g transform="translate(0 ${n1(-k * 2)})">${back}${front}</g>`;
    });
    g += `<g transform="translate(0 -12)">${Array.from({ length: 9 }, (_, i) => `<circle cx="${n1(Math.cos(i * 2.4) * i * .3)}" cy="${n1(Math.sin(i * 2.4) * i * .22)}" r="1.5" fill="${sh(f.heart, i % 2 ? .1 : -.15)}"/>`).join('')}</g>`;
    return `<g>${g}</g>`;
  }

  /* ----- Pivoine ----- */
  function peony(f) {
    const id = f.id, c = f.petal;
    return `<g><ellipse cy="12" rx="22" ry="6" fill="url(#fl-shadow)"/>
      <g transform="translate(0 12)">${[-140, -40, 90].map((a) => `<path d="M0 0 C-3 5 -3 12 0 16 C3 12 3 5 0 0Z" fill="#4C7F36" transform="rotate(${a + 180})"/>`).join('')}</g>
      ${rosette([
        { n: 6, L: 27, W: 16, waves: 3, amp: .06, fill: `url(#fl-${id}-in)` },
        { n: 7, L: 22, W: 13, off: 25, waves: 4, amp: .09, fill: `url(#fl-${id})`, dy: -4, sy: .95 },
        { n: 9, L: 15, W: 9, off: 10, waves: 5, amp: .16, fill: sh(c, .12), dy: -9, sy: .9 },
        { n: 9, L: 10, W: 6.5, off: 30, waves: 4, amp: .2, fill: sh(c, .28), dy: -13, sy: .85 },
        { n: 6, L: 6, W: 4.5, off: 0, waves: 3, amp: .22, fill: sh(c, .4), dy: -16, sy: .8 },
      ], id, .7)}
      ${lum(f.heart) > .6 && f.heart !== '#F7D7E2' ? Array.from({ length: 10 }, (_, i) => `<circle cx="${n1(Math.cos(i * 2.4) * (2 + i * .4))}" cy="${n1(-16 + Math.sin(i * 2.4) * (1 + i * .25))}" r=".9" fill="${f.heart}"/>`).join('') : ''}
      <ellipse cx="-8" cy="-12" rx="10" ry="6" fill="url(#fl-gloss)" opacity=".45"/></g>`;
  }

  /* ----- Lys ----- */
  function lilyHead(f) {
    const id = f.id, c = f.petal, sq = .74;
    let back = '', front = '';
    for (let i = 0; i < 6; i++) {
      const a = i * 60 + 30 + r(-5, 5), rad = a * Math.PI / 180, outer = i % 2 === 0, L = outer ? 29 : 31, w = outer ? 6.2 : 7.8;
      let spots = '';
      if (f.spots) for (let k = 0; k < 9; k++) spots += `<circle cx="${n1(r(-w * .5, w * .5))}" cy="${n1(-r(4, L * .55))}" r="${n1(r(.5, 1))}" fill="${sh(f.heart, -.25)}"/>`;
      const p = `<g transform="scale(1 ${sq}) rotate(${n1(a)})"><path d="${petalPath(L, w, { tip: .95, base: .06, wave: f.spots ? .45 : 0 })}" fill="url(#fl-${id})" stroke="${sh(c, -.42)}" stroke-width=".45"/>
        <path d="M0 -3 L0 ${n1(-L * .78)}" stroke="${f.spots ? f.heart : '#C9D88A'}" stroke-width="${f.spots ? 2 : 1.4}" opacity=".6" stroke-linecap="round"/>${spots}
        <path d="M${n1(-w * .45)} ${n1(-L * .3)} Q${n1(-w * .5)} ${n1(-L * .62)} ${n1(-w * .15)} ${n1(-L * .86)}" stroke="#fff" stroke-width=".8" fill="none" opacity=".45"/></g>`;
      if (Math.cos(rad) > 0) back += p; else front += p;
    }
    let st = `<circle r="3.2" fill="#B9C870"/>`;
    for (let i = 0; i < 6; i++) { const a = i * 60 - 60 + r(-8, 8), rad = a * Math.PI / 180, ex = Math.sin(rad) * 13, ey = -Math.cos(rad) * 13 * sq - 9;
      st += `<path d="M0 0 Q${n1(ex * .4)} ${n1(ey * .8)} ${n1(ex)} ${n1(ey)}" stroke="#D8DFA8" stroke-width=".7" fill="none"/><ellipse cx="${n1(ex)}" cy="${n1(ey)}" rx="2.4" ry=".9" fill="#9A4A1E" transform="rotate(${n1(r(-30, 30))} ${n1(ex)} ${n1(ey)})"/>`; }
    st += `<path d="M0 0 Q1 -8 2 -15" stroke="#B9C870" stroke-width="1.1" fill="none"/><circle cx="2" cy="-15.5" r="1.5" fill="#8EA650"/>`;
    return back + st + front;
  }
  function lily(f) {
    let g = stalk(50, { w: 3.4 });
    for (let i = 0; i < 9; i++) g += leaf(40, 220 - i * 17, 26 - i, i % 2 ? -40 : -140, { col: '#4C8038', w: .16, veins: 0, gloss: .3 });
    g += twig(40, 80, 64, 58, 1.6) + `<g transform="translate(64 58) rotate(28)"><path d="M0 2 C-5 -6 -4 -22 0 -30 C4 -22 5 -6 0 2Z" fill="${lum(f.petal) > .85 ? '#DDE6C2' : sh(f.petal, -.05)}" stroke="#5E7A3E" stroke-width=".5"/><path d="M0 -2 L0 -27" stroke="#9AB070" stroke-width=".5"/><path d="M-2 -8 Q-3 -18 -1 -25" stroke="#fff" stroke-width=".8" opacity=".45" fill="none"/></g>`;
    g += `<g transform="translate(40 38) rotate(-8) scale(1.05)">${lilyHead(f)}</g>`;
    return g;
  }

  /* ----- Calla ----- */
  function calla(f) {
    const id = f.id, c = f.petal;
    return stalk(56, { w: 4.2, col: '#6BA24E', bend: -6 }) + `<g transform="translate(40 40) rotate(-14)">
      <path d="M-10 -18 C-13 -33 5 -40 15 -30 C11 -24 5 -19 -1 -15 Z" fill="url(#fl-${id}-in)" stroke="${sh(c, -.45)}" stroke-width=".5"/>
      <path d="M-1 6 C-2 -5 0 -15 3 -22" stroke="${sh(f.heart, -.1)}" stroke-width="3.6" stroke-linecap="round" fill="none"/><path d="M-1.6 2 C-2.4 -6 -1 -14 1.6 -20" stroke="#FFE27A" stroke-width="1" stroke-linecap="round" fill="none"/>
      <path d="M0 20 C-8 12 -14 -4 -12 -19 C-10 -26 -4 -24 -2 -15 C2 -19 10 -24 16 -30 C13 -13 8 6 0 20Z" fill="url(#fl-${id})" stroke="${sh(c, -.45)}" stroke-width=".5"/>
      <path d="M-12 -19 C-9 -24 -5 -22 -2 -15 M-2 -15 C4 -20 10 -25 16 -30" fill="none" stroke="${sh(c, .55)}" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M-9 -6 C-8 4 -4 12 0 16" stroke="#fff" stroke-width="1.4" opacity=".45" fill="none" stroke-linecap="round"/>
      <path d="M-3 16 C-1 19 1 20 2 21 C2 23 -1 24 -3 21Z" fill="#7FB05A"/></g>`;
  }

  /* ----- Hortensia ----- */
  function hydrangea(f) {
    const c = f.petal, RX = 26, RY = 20;
    let g = stalk(52, { w: 4, col: '#5E8E40' }) + leaf(40, 150, 40, -155, { col: '#3F7230', w: .5, serr: .1 }) + leaf(39, 112, 38, -25, { col: '#487C36', w: .5, serr: .1 });
    let h = `<ellipse cy="8" rx="${RX * .8}" ry="8" fill="#3E6630"/><ellipse rx="${RX}" ry="${RY}" fill="url(#fl-${f.id}-dome)"/>`;
    const pts = []; for (let i = 0; i < 64; i++) { let u, v; do { u = r(-1, 1); v = r(-1, 1); } while (u * u + v * v > .95); pts.push([u * RX, v * RY - (1 - u * u - v * v) * 5]); }
    pts.sort((a, b) => a[1] - b[1]).forEach(([x, y]) => {
      const light = -(x / RX) * .25 - (y / RY) * .3 + r(-.06, .06), col = sh(lum(c) > .5 ? c : sh(c, r(-.05, .1)), Math.max(-.4, Math.min(.4, light)));
      const s = r(.85, 1.15), rot = r(0, 90);
      h += `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)}) scale(${n1(s)})">${[0, 90, 180, 270].map((k) => `<ellipse cy="-2.6" rx="2.3" ry="2.9" fill="${col}" stroke="${sh(c, -.45)}" stroke-width=".3" transform="rotate(${k})"/>`).join('')}<circle r=".8" fill="${sh(c, .5)}"/></g>`;
    });
    return g + `<g transform="translate(40 36)">${h}<ellipse cx="-9" cy="-8" rx="10" ry="6" fill="url(#fl-gloss)" opacity=".35"/></g>`;
  }

  /* ----- Œillets ----- */
  function carnHead(f, s = 1) {
    const id = f.id;
    let g = `<path d="M-4 18 C-4.5 11 -5 5 -6 0 L6 0 C5 5 4.5 11 4 18Z" fill="#86AE76" stroke="#3E5E32" stroke-width=".5"/><path d="M-3.2 16 C-3.6 10 -4 5 -4.6 1" stroke="#C4DCB4" stroke-width="1" fill="none"/>
      <path d="M-6 1 L-4.5 -3 L-3 1 M3 1 L4.5 -3 L6 1" fill="#86AE76" stroke="#3E5E32" stroke-width=".4"/>`;
    [[[-70, -38, -6, 26, 70], 15, 7.5, `url(#fl-${id}-in)`, 0], [[-50, -18, 18, 50], 12.5, 6.8, `url(#fl-${id})`, -1.5], [[-30, 0, 30], 9.5, 5.6, `url(#fl-${id}-sat)`, -3]].forEach(([angs, L, W, fill, dy]) => {
      [...angs].sort((a, b) => Math.abs(b) - Math.abs(a)).forEach((a) => {
        g += `<g transform="translate(0 ${-1 + dy}) rotate(${n1(a + r(-5, 5))}) scale(1 .85)"><path d="${ruffleLobe(L * r(.92, 1.06), W, 11, .09)}" fill="${fill}" stroke="${sh(f.petal, -.45)}" stroke-width=".4"/><path d="M0 -2 L0 ${n1(-L * .7)}" stroke="${sh(f.petal, -.3)}" stroke-width=".4" opacity=".5"/></g>`;
      });
    });
    g += `<ellipse cx="-4" cy="-11" rx="5" ry="3" fill="url(#fl-gloss)" opacity=".45"/>`;
    return `<g transform="scale(${s})">${g}</g>`;
  }
  const narrowLeaves = (ys, col = '#6E9E8E') => ys.map((y, i) => leaf(40, y, 26, i % 2 ? -35 : -145, { col, w: .12, veins: 0, gloss: .2 })).join('');
  function carnation(f) { return stalk(56, { w: 3, col: '#78A88E' }) + narrowLeaves([200, 170, 140, 110]) + `<g transform="translate(40 42) rotate(-6)">${carnHead(f, 1.65)}</g>`; }
  function minicarnation(f) {
    let g = stalk(100, { w: 2.6, col: '#78A88E' }) + narrowLeaves([200, 165, 132]);
    [[22, 40, .75], [42, 28, .85], [60, 46, .72]].forEach(([x, y]) => { g += twig(40, 100, x, y + 14, 1.4, '#78A88E', (x - 40) * -.2); });
    g += twig(40, 104, 70, 70, 1.1, '#78A88E') + `<g transform="translate(70 70) rotate(30) scale(.6)"><path d="M-4 14 C-4.5 9 -5 4 -5 0 L5 0 C5 4 4.5 9 4 14Z" fill="#86AE76" stroke="#3E5E32" stroke-width=".5"/><path d="M-4 0 C-3 -5 3 -5 4 0Z" fill="url(#fl-${f.id})"/></g>`;
    [[22, 40, 1], [42, 28, 1.12], [60, 46, .95]].forEach(([x, y, s]) => { g += `<g transform="translate(${x} ${y}) rotate(${n1(r(-12, 12))})">${carnHead(f, s)}</g>`; });
    return g;
  }
  function barbatus(f) {
    let g = stalk(52, { w: 3, col: '#5E8E50' }) + narrowLeaves([200, 165, 130, 95], '#4E7E40');
    let h = `<ellipse cy="5" rx="20" ry="7" fill="#3E6630"/>${Array.from({ length: 12 }, (_, i) => `<path d="M0 0 L-1.4 -9 L1.4 -9Z" fill="#5E8E44" transform="rotate(${i * 30}) scale(1 .45)"/>`).join('')}`;
    const pts = []; for (let i = 0; i < 26; i++) { let u, v; do { u = r(-1, 1); v = r(-1, 1); } while (u * u + v * v > 1); pts.push([u * 18, v * 8 - (1 - u * u - v * v) * 4]); }
    pts.sort((a, b) => a[1] - b[1]).forEach(([x, y], k) => {
      const col = sh(k % 3 ? f.petal : sh(f.petal, .35), -(y / 8) * .15 - (x / 18) * .1);
      h += `<g transform="translate(${n1(x)} ${n1(y)}) scale(1 .8) rotate(${n1(r(0, 72))})">${[0, 72, 144, 216, 288].map((a) => `<path d="${ruffleLobe(4.4, 2.2, 5, .12)}" fill="${col}" stroke="${sh(f.petal, -.45)}" stroke-width=".25" transform="rotate(${a})"/>`).join('')}<circle r="1.6" fill="none" stroke="${f.heart}" stroke-width="1"/><circle r=".6" fill="#fff"/></g>`;
    });
    return g + `<g transform="translate(40 40)">${h}</g>`;
  }

  /* ----- Agapanthe ----- */
  function agapanthus(f) {
    const c = f.petal;
    let g = stalk(52, { w: 3.8, col: '#6E9E5A', bend: -3 });
    let h = '';
    const pts = []; for (let i = 0; i < 52; i++) { const u = 1 - 2 * (i + .5) / 52, th = i * 2.39996 + r(-.2, .2), rr = Math.sqrt(1 - u * u); pts.push([Math.cos(th) * rr, u, Math.sin(th) * rr]); }
    pts.sort((a, b) => a[2] - b[2]).forEach(([x, y, z]) => {
      const px = x * 22, py = y * 19 - 4, ang = Math.atan2(px, -(py + 4)) * 180 / Math.PI;
      h += `<path d="M0 6 L${n1(px * .85)} ${n1(py * .85)}" stroke="#7FA86A" stroke-width=".55"/>`;
      const sc = 1 + z * .15, tint = sh(c, -.12 + z * .12);
      h += `<g transform="translate(${n1(px)} ${n1(py)}) rotate(${n1(ang)}) scale(${n1(sc)})">${[-34, 0, 34].map((a) => `<path d="${petalPath(7.5, 2, { tip: .8 })}" fill="${tint}" stroke="#7E8CA4" stroke-width=".4" transform="rotate(${a})"/><path d="M0 -1 L0 -6" stroke="${sh(f.heart, -.25)}" stroke-width=".8" transform="rotate(${a})"/>`).join('')}</g>`;
    });
    return g + `<g transform="translate(40 38)">${h}</g>`;
  }

  /* ----- Giroflée ----- */
  function stock(f) {
    const c = f.petal;
    let g = stalk(14, { w: 3.6, col: '#7E9E86' }) + leaves([215, 195, 175, 155, 135], 26, { col: '#7E9E86', w: .2, gloss: .15, veins: 0 });
    for (let i = 0; i < 20; i++) {
      const t = i / 19, y = 14 + t * 102, col = i % 3, x = 40 + (col - 1) * (4 + t * 5) + r(-1, 1), R = 2.5 + t * 4.2;
      if (t < .15) { g += `<ellipse cx="${n1(x)}" cy="${n1(y)}" rx="${n1(R * .6)}" ry="${n1(R)}" fill="#AFC48E" stroke="#5E7A4E" stroke-width=".4"/><ellipse cx="${n1(x)}" cy="${n1(y - R * .4)}" rx="${n1(R * .4)}" ry="${n1(R * .5)}" fill="${sh(c, .1)}"/>`; continue; }
      g += `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(r(0, 60))})"><path d="${ruffDisc(R, 6)}" fill="${sh(c, col === 1 ? .05 : -.12)}" stroke="${sh(c, -.45)}" stroke-width=".4"/><path d="${ruffDisc(R * .62, 5, .18)}" fill="${sh(c, .25)}" stroke="${sh(c, -.3)}" stroke-width=".3"/><circle r="${n1(R * .18)}" fill="${sh(c, -.25)}"/><ellipse cx="${n1(-R * .3)}" cy="${n1(-R * .35)}" rx="${n1(R * .3)}" ry="${n1(R * .18)}" fill="#fff" opacity=".4"/></g>`;
    }
    return g;
  }

  /* ----- Gypsophile ----- */
  function gypso() {
    let st = '', fl = '';
    const br = (x, y, ang, len, d) => {
      const rad = ang * Math.PI / 180, x2 = x + Math.sin(rad) * len, y2 = y - Math.cos(rad) * len;
      st += `<path d="M${n1(x)} ${n1(y)} L${n1(x2)} ${n1(y2)}" stroke="#7E9A6E" stroke-width="${n1(.4 + d * .3)}"/>`;
      if (!d) { for (let k = 0; k < 4; k++) { const fx = x2 + r(-2.4, 2.4), fy = y2 + r(-2.4, 2.4); fl += `<circle cx="${n1(fx)}" cy="${n1(fy)}" r="${n1(r(1, 1.5))}" fill="#FFFFFF" stroke="#C9CDBE" stroke-width=".3"/><circle cx="${n1(fx - .3)}" cy="${n1(fy - .3)}" r=".45" fill="#F6F2E0"/>`; } return; }
      for (let k = 0; k < 3; k++) br(x2, y2, ang + r(-35, 35), len * r(.55, .7), d - 1);
    };
    [-28, -10, 8, 26].forEach((a) => br(40, 108, a + r(-5, 5), r(26, 32), 3));
    return stalk(108, { w: 2, col: '#7E9A6E' }) + leaf(40, 190, 18, -150, { col: '#6E8E5E', w: .14, veins: 0 }) + st + fl;
  }

  /* ----- Astilbe ----- */
  function astilbe(f) {
    let g = stalk(16, { w: 2.4, col: '#7A5A44', bend: -3 }) + leaf(40, 190, 22, -150, { col: '#3F6E30', serr: .22 }) + leaf(40, 170, 20, -30, { col: '#3F6E30', serr: .22 }) + leaf(40, 150, 18, -200, { col: '#4A7D38', serr: .22 });
    let d = '';
    for (let i = 0; i < 22; i++) {
      const t = i / 21, y = 18 + t * 92, len = 3 + t * 15, side = i % 2 ? 1 : -1;
      g += `<path d="M40 ${n1(y)} q${n1(side * len * .5)} ${n1(-len * .5)} ${n1(side * len)} ${n1(-len * .7)}" stroke="#9A5A5E" stroke-width=".45" fill="none"/>`;
      for (let k = 0; k < 4 + t * 8; k++) {
        const u = k / (4 + t * 8), px = 40 + side * len * u + r(-1.3, 1.3), py = y - len * .7 * u * u - len * .2 * u + r(-1.3, 1.3);
        d += `<circle cx="${n1(px)}" cy="${n1(py)}" r="${n1(r(.7, 1.1))}" fill="${sh(f.petal, r(-.25, .3) - (px - 40) * .008)}"/>`;
      }
    }
    return g + d;
  }

  /* ----- Kniphofia ----- */
  function kniphofia(f) {
    let g = stalk(70, { w: 3.6, col: '#6E9A50' });
    const mix = (a, b, t) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const ch = (s) => Math.round(((A >> s) & 255) * (1 - t) + ((B >> s) & 255) * t); return '#' + ((1 << 24) + (ch(16) << 16) + (ch(8) << 8) + ch(0)).toString(16).slice(1); };
    for (let row = 0; row < 16; row++) {
      const t = row / 15, y = 12 + t * 58, n = 5;
      for (let k = 0; k < n; k++) {
        const u = (k / (n - 1)) * 2 - 1, x = 40 + u * (5 + t * 3), col = t < .12 ? mix('#9AB860', f.petal, t / .12) : mix(f.petal, f.heart, Math.min(1, Math.max(0, (t - .35) / .6)));
        g += `<path d="M0 0 C-1.4 2.5 -1.3 8 0 11 C1.3 8 1.4 2.5 0 0Z" fill="${sh(col, -u * .12 * Math.sign(u) - .02)}" stroke="${sh(col, -.45)}" stroke-width=".3" transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(u * 28)}) scale(${n1(.8 + t * .3)})"/>`;
      }
    }
    return g;
  }

  /* ----- Carthame ----- */
  function carthHead(f) {
    let g = `<ellipse cy="2" rx="7" ry="8" fill="#6E9A48" stroke="#3E5E2A" stroke-width=".5"/>`;
    for (let i = 0; i < 9; i++) g += `<path d="M0 0 L-2 -9 L2 -9Z" fill="#7FA858" stroke="#3E5E2A" stroke-width=".3" transform="translate(0 4) rotate(${-120 + i * 30})"/>`;
    g += `<ellipse cy="-1" rx="5" ry="3" fill="#8DB662"/>`;
    for (let i = 0; i < 26; i++) { const x = r(-4.5, 4.5), h = r(4, 9); g += `<path d="M${n1(x * .6)} -2 Q${n1(x)} ${n1(-h * .6)} ${n1(x * 1.3)} ${n1(-h)}" stroke="${sh(f.petal, r(-.2, .25))}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`; }
    return g;
  }
  function carthamus(f) {
    let g = stalk(100, { w: 2.8, col: '#7FA858' }) + leaf(40, 180, 26, -150, { col: '#5E8E40', serr: .35, w: .3 }) + leaf(40, 140, 22, -30, { col: '#5E8E40', serr: .35, w: .3 });
    const pts = [[24, 44], [42, 30], [58, 48]];
    pts.forEach(([x, y]) => { g += twig(40, 100, x, y + 8, 1.6, '#7FA858', (x - 40) * -.2) + leaf(x + (x - 40) * .1, y + 26, 12, x < 40 ? -150 : -30, { col: '#5E8E40', serr: .35, w: .3, veins: 1 }); });
    pts.forEach(([x, y]) => { g += `<g transform="translate(${x} ${y}) rotate(${n1((x - 40) * .4)})">${carthHead(f)}</g>`; });
    return g;
  }

  /* ----- Amarante ----- */
  function amaranth(f) {
    let g = stalk(40, { w: 3, col: f.upright ? '#7E9E50' : '#7A3A40' }) + leaves([190, 160, 125], 26, { col: f.upright ? '#5E8E40' : '#6E5040', w: .38 });
    const chain = (x0, y0, pts, rad0) => {
      let s = '';
      pts.forEach(([x, y], i) => { const t = i / pts.length, rr = rad0 * (1 - t * .55); for (let k = 0; k < 3; k++) s += `<circle cx="${n1(x + r(-rr * .6, rr * .6))}" cy="${n1(y + r(-1, 1))}" r="${n1(rr * r(.5, .8))}" fill="${sh(f.petal, r(-.25, .2) - t * .1)}"/>`; });
      return s;
    };
    const curve = (x0, y0, dx, dy, n, up) => Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return up ? [x0 + dx * t + Math.sin(t * 3) * 2, y0 - dy * t] : [x0 + dx * t * (1 - t * .6), y0 + dy * t * t + t * 8]; });
    if (f.upright) {
      [[40, 44, 0, 34, 3.6], [40, 54, -12, 22, 2.8], [40, 54, 12, 24, 2.8], [40, 66, -18, 14, 2.2], [40, 66, 17, 14, 2.2]].forEach(([x, y, dx, dy, rr]) => { g += twig(40, 72, x + dx * .1, y, 1.2, '#7E9E50') + chain(x, y, curve(x, y, dx, dy, 14, true), rr); });
    } else {
      [[40, 40, -18, 70, 3.4], [40, 40, 14, 80, 3.6], [40, 42, -4, 92, 3.8], [40, 44, 22, 52, 2.8], [40, 44, -26, 46, 2.6]].forEach(([x, y, dx, dy, rr]) => { g += chain(x, y, curve(x, y, dx, dy, 22, false), rr); });
      g += `<ellipse cx="40" cy="40" rx="6" ry="4" fill="${sh(f.petal, -.2)}"/>`;
    }
    return g;
  }

  /* ----- Hypericum ----- */
  function berry(f, x, y, s) {
    return `<g transform="translate(${n1(x)} ${n1(y)}) scale(${n1(s)})"><path d="M-2 3.4 L-3.6 5.4 M2 3.4 L3.6 5.4 M0 4 L0 6" stroke="#4E7D3A" stroke-width=".8"/><ellipse rx="3.3" ry="4" fill="url(#fl-${f.id}-dome)" stroke="${sh(f.petal, -.5)}" stroke-width=".4"/><ellipse cx="-1.1" cy="-1.5" rx="1.1" ry="1.5" fill="#fff" opacity=".55"/><circle cy="-4" r=".55" fill="${sh(f.heart, -.5)}"/></g>`;
  }
  function hypericum(f) {
    let g = stalk(104, { w: 2.4, col: '#7A6A44' }) + leaves([196, 176, 150, 128], 18, { col: '#4E8038', w: .4, veins: 2 });
    const clusters = [[20, 52], [40, 36], [60, 50], [30, 74], [54, 76]];
    clusters.forEach(([x, y]) => { g += twig(40, 104, x, y + 6, 1.1, '#7A6A44', (x - 40) * -.2) + leaf(x, y + 14, 11, x < 40 ? -160 : -20, { col: '#4E8038', w: .4, veins: 1 }); });
    clusters.forEach(([x, y]) => { for (let k = 0; k < 5; k++) { const bx = x + Math.cos(k * 1.3) * 4.5, by = y + Math.sin(k * 1.3) * 3 - (k ? 0 : 3); g += `<path d="M${x} ${y + 5} L${n1(bx)} ${n1(by + 3)}" stroke="#6A7A44" stroke-width=".6"/>` + berry(f, bx, by, r(.85, 1.05)); } });
    return g;
  }

  /* ----- Thlaspi ----- */
  function thlaspi(f) {
    let g = stalk(110, { w: 2.2, col: '#8EAA48' }) + leaves([196, 170], 16, { col: '#7E9E40', w: .3 });
    [[26, 20, -14], [42, 12, 0], [58, 22, 14]].forEach(([x, y, a]) => {
      g += twig(40, 110, x, y, 1.1, '#8EAA48', -a * .2);
      for (let k = 0; k < 13; k++) { const t = k / 12, px = 40 + (x - 40) * (1 - t * .55) + (k % 2 ? 4 : -4), py = y + (110 - y) * t * .7, s = 1 - t * .35;
        g += `<path d="M${n1(px - (k % 2 ? 4 : -4))} ${n1(py + 2)} L${n1(px)} ${n1(py)}" stroke="#8EAA48" stroke-width=".5"/><g transform="translate(${n1(px)} ${n1(py)}) scale(${n1(s)})"><path d="M0 2.6 C-3.4 2.6 -3.4 -2.8 -.6 -2.6 L0 -1.4 L.6 -2.6 C3.4 -2.8 3.4 2.6 0 2.6Z" fill="${sh(f.petal, r(-.12, .12))}" stroke="${sh(f.petal, -.45)}" stroke-width=".35"/><ellipse cx="-.9" cy=".2" rx=".8" ry="1.1" fill="#fff" opacity=".35"/></g>`; }
    });
    return g;
  }

  /* ----- Alchémille / buplèvre ----- */
  function alchemilla(f) {
    let g = stalk(104, { w: 2.2, col: '#8EAA48' });
    for (let i = 0; i < 4; i++) { const y = 200 - i * 26; g += `<g transform="translate(40 ${y}) rotate(${i % 2 ? 12 : -12})"><ellipse rx="${n1(11 - i)}" ry="${n1(9.5 - i * .8)}" fill="url(#fl-${f.id}-h-dome)" stroke="${sh(f.heart, -.45)}" stroke-width=".4"/><path d="M${n1(-9 + i)} 0 L${n1(9 - i)} 0" stroke="${sh(f.heart, .4)}" stroke-width=".5"/></g>`; }
    [[18, 46], [32, 30], [48, 26], [62, 42], [26, 64], [54, 62]].forEach(([x, y]) => {
      g += twig(40, 104, x, y, .9, '#8EAA48', (x - 40) * -.2);
      for (let k = 0; k < 14; k++) { const px = x + r(-6, 6), py = y + r(-4.5, 4.5); g += `<g transform="translate(${n1(px)} ${n1(py)}) rotate(${n1(r(0, 90))})"><path d="M0 -1.6 L.5 -.5 L1.6 0 L.5 .5 L0 1.6 L-.5 .5 L-1.6 0 L-.5 -.5Z" fill="${sh(f.petal, r(-.2, .25))}"/></g>`; }
    });
    return g;
  }

  /* ----- Solidago ----- */
  function solidago(f) {
    let g = stalk(20, { w: 2.4, col: '#7E9A4A', bend: -2 }) + leaves([210, 190, 170, 150, 132, 116], 20, { col: '#5E8E40', w: .16, veins: 0, serr: .08 });
    for (let i = 0; i < 12; i++) {
      const t = i / 11, y = 22 + t * 78, len = 4 + t * 18, side = i % 2 ? 1 : -1;
      g += `<path d="M40 ${n1(y)} q${n1(side * len * .6)} ${n1(-len * .5)} ${n1(side * len)} ${n1(-len * .1)}" stroke="#7E9A4A" stroke-width=".6" fill="none"/>`;
      for (let k = 0; k < len * .9; k++) { const u = k / (len * .9), px = 40 + side * len * u, py = y - len * .5 * Math.sin(u * Math.PI * .8) * .9 - 1.4; g += `<circle cx="${n1(px + r(-.6, .6))}" cy="${n1(py)}" r="${n1(r(.8, 1.2))}" fill="${sh(f.petal, r(-.18, .25))}"/>`; }
    }
    return g;
  }

  /* ----- Exotiques ----- */
  function nutans(f) {
    let g = stalk(56, { w: 4, col: '#6E8E60' });
    for (let i = 0; i < 9; i++) g += `<g transform="translate(40 ${200 - i * 16}) rotate(${i % 2 ? -40 : 220})"><path d="M0 0 C4 -5 14 -6 17 -2 C14 3 4 4 0 0Z" fill="${sh('#7E9A78', r(-.1, .1))}" stroke="#4E6A48" stroke-width=".5"/><path d="M15 -3 L18 -2.2 L15 -.8" fill="#C84A2A"/></g>`;
    let h = `<ellipse cy="8" rx="15" ry="6" fill="#7E9A68"/><ellipse cy="2" rx="13" ry="9" fill="url(#fl-${f.id}-dome)"/>`;
    const styles = [];
    for (let i = 0; i < 46; i++) { const a = r(-170, -10) * Math.PI / 180, rr = r(.2, 1), L = 18 + r(-3, 3); styles.push([Math.cos(a) * rr * 8, Math.sin(a) * rr * 4, Math.cos(a), Math.sin(a), L, Math.sin(a) * rr]); }
    styles.sort((a, b) => b[5] - a[5]).forEach(([x, y, cx, cy, L]) => {
      const ex = x + cx * L, ey = y + cy * L * .9 - 6, mx = x + cx * L * .3, my = y + cy * L * .9 - 10;
      h += `<path d="M${n1(x)} ${n1(y)} Q${n1(mx)} ${n1(my)} ${n1(ex)} ${n1(ey)}" stroke="${sh(f.petal, -.3)}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${n1(x)} ${n1(y)} Q${n1(mx)} ${n1(my)} ${n1(ex)} ${n1(ey)}" stroke="${sh(f.petal, .15)}" stroke-width=".8" fill="none" stroke-linecap="round"/><ellipse cx="${n1(ex)}" cy="${n1(ey)}" rx="1.6" ry="1.2" fill="${f.heart}" stroke="${sh(f.heart, -.45)}" stroke-width=".3"/>`;
    });
    return g + `<g transform="translate(40 46)">${h}</g>`;
  }
  function heliconia(f) {
    let g = stalk(110, { w: 4, col: '#4E7E3A' });
    let pts = '';
    for (let i = 0; i < 7; i++) {
      const t = i / 6, y = 110 - t * 92, side = i % 2 ? 1 : -1, x = 40 + side * 2, s = 1.1 - t * .45;
      pts += `${i ? 'L' : 'M'}${x} ${y} `;
      g += `<g transform="translate(${x} ${y}) scale(${n1(side * s)} ${n1(s)})"><path d="M0 0 C6 1 20 -2 26 -14 C18 -12 8 -9 0 -6Z" fill="url(#fl-${f.id}-sat)" stroke="${sh(f.petal, -.5)}" stroke-width=".5"/><path d="M0 -6 C8 -9 18 -12 26 -14" stroke="${f.heart}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M4 -2 C10 -3 16 -5 21 -10" stroke="#fff" stroke-width=".8" opacity=".4" fill="none"/>${i < 5 ? `<path d="M8 -9 l3 -6 l2 5" fill="#E6D25A" stroke="#8A7A2A" stroke-width=".3"/>` : ''}</g>`;
    }
    g = g.replace(stalk(110, { w: 4, col: '#4E7E3A' }), stalk(110, { w: 4, col: '#4E7E3A' }) + `<path d="${pts}" stroke="${sh(f.petal, -.3)}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>`);
    return g;
  }
  function alpinia(f) {
    let g = stalk(62, { w: 4, col: '#4E7E3A' }) + leaf(40, 200, 48, -160, { col: '#3E7230', w: .22 });
    for (let row = 0; row < 11; row++) {
      const t = row / 10, y = 64 - t * 48, w = 12 - t * 7;
      for (let k = -1; k <= 1; k++) {
        const x = 40 + k * w * .6 + (row % 2 ? 2 : -2);
        g += `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(k * 22)})"><path d="M0 4 C-${n1(w * .55)} 2 -${n1(w * .5)} -6 0 -9 C${n1(w * .5)} -6 ${n1(w * .55)} 2 0 4Z" fill="${sh(f.petal, -k * .1 - t * .05 + (row % 2 ? .05 : -.05))}" stroke="${sh(f.petal, -.5)}" stroke-width=".4"/><path d="M-${n1(w * .2)} -1 Q-${n1(w * .25)} -5 0 -7" stroke="#fff" stroke-width=".7" opacity=".4" fill="none"/></g>`;
        if (row % 3 === 1 && k === 1) g += `<path d="M${n1(x + 3)} ${n1(y - 2)} q4 -2 6 1 q-3 2 -6 -1z" fill="#FBF6EA" stroke="#C8B8A0" stroke-width=".3"/>`;
      }
    }
    return g;
  }
  function ananas(f) {
    let g = stalk(62, { w: 4, col: '#8E8A60' });
    let fr = `<ellipse rx="10" ry="13" fill="url(#fl-${f.id}-dome)" stroke="${sh(f.petal, -.5)}" stroke-width=".5"/>`;
    for (let i = -3; i <= 3; i++) for (let j = -4; j <= 4; j++) { const x = i * 3 + (j % 2 ? 1.5 : 0), y = j * 3; if ((x / 10) ** 2 + (y / 13) ** 2 > .82) continue;
      fr += `<path d="M${n1(x)} ${n1(y - 1.6)} L${n1(x + 1.5)} ${n1(y)} L${n1(x)} ${n1(y + 1.6)} L${n1(x - 1.5)} ${n1(y)}Z" fill="none" stroke="${sh(f.petal, -.45)}" stroke-width=".45"/><circle cx="${n1(x)}" cy="${n1(y)}" r=".4" fill="#5A3A1A"/>`; }
    fr += `<ellipse cx="-3.5" cy="-4" rx="3" ry="5" fill="#fff" opacity=".2"/>`;
    let crown = '';
    for (let i = 0; i < 11; i++) { const a = -60 + i * 12; crown += `<path d="M0 0 C-1.6 -6 -1 -14 0 ${-18 + Math.abs(a) * .12} C1 -14 1.6 -6 0 0Z" fill="${sh(f.heart, (i % 2 ? .1 : -.15))}" stroke="${sh(f.heart, -.5)}" stroke-width=".35" transform="rotate(${a})"/>`; }
    return g + `<g transform="translate(40 30) scale(1.25)">${crown}</g><g transform="translate(40 48) scale(1.3)">${fr}</g>`;
  }

  /* ----- Feuillages ----- */
  function oakLeaf(x, y, L, ang, col) {
    const W = L * .36, top = [], bot = [], N = 30;
    for (let i = 0; i <= N; i++) { const t = i / N, lobe = .6 + .4 * Math.abs(Math.sin(t * Math.PI * 4.5)), prof = Math.pow(Math.sin(Math.PI * Math.pow(t, .8)), .8) * lobe; top.push([L * t, -W * prof]); bot.push([L * t, W * prof * .95]); }
    const d = smooth([...top, ...bot.reverse()]);
    return `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(ang)})"><path d="${d}" fill="${col}" stroke="${sh(col, -.5)}" stroke-width=".5"/><path d="${d}" fill="url(#fl-leafshade)"/><path d="M0 0 L${n1(L * .95)} 0" stroke="${sh(col, .35)}" stroke-width=".8"/>${[.25, .45, .65].map((t) => `<path d="M${n1(L * t)} 0 l${n1(L * .1)} ${n1(-W * .6)} M${n1(L * t)} 0 l${n1(L * .1)} ${n1(W * .6)}" stroke="${sh(col, .3)}" stroke-width=".5"/>`).join('')}</g>`;
  }
  function oak(f) {
    let g = stalk(20, { w: 2.4, col: '#7A5A3A', bend: -3 });
    [[.12, -150], [.28, -30], [.44, -160], [.6, -24], [.74, -150], [.88, -40]].forEach(([t, a], i) => { const [x, y] = pointOn(20, t, -3); g += oakLeaf(x, y, 30 - i * 2, a + r(-8, 8), sh(i % 2 ? f.petal : f.heart, r(-.05, .08))); });
    return g + oakLeaf(40, 22, 24, -96, f.petal);
  }
  function panicum(f) {
    let g = stalk(30, { w: 1.8, col: '#8E6A5A', bend: -2 });
    for (let i = 0; i < 4; i++) g += leaf(40, 210 - i * 30, 46, i % 2 ? -62 : -118, { col: '#7E8A5A', w: .06, veins: 0, gloss: .2 });
    let st = '', sd = '';
    const br = (x, y, ang, len, d) => {
      const rad = ang * Math.PI / 180, x2 = x + Math.sin(rad) * len, y2 = y - Math.cos(rad) * len;
      st += `<path d="M${n1(x)} ${n1(y)} L${n1(x2)} ${n1(y2)}" stroke="${f.petal}" stroke-width="${n1(.25 + d * .15)}"/>`;
      if (!d) { sd += `<ellipse cx="${n1(x2)}" cy="${n1(y2)}" rx=".7" ry="1.1" fill="${sh(f.petal, r(-.2, .2))}" transform="rotate(${n1(ang)} ${n1(x2)} ${n1(y2)})"/>`; return; }
      for (let k = 0; k < 3; k++) br(x2, y2, ang + r(-30, 30), len * r(.5, .7), d - 1);
    };
    for (let i = 0; i < 8; i++) { const y = 34 + i * 9; br(40, y, (i % 2 ? 1 : -1) * r(20, 50), 12 + i * 2.5, 2); }
    br(40, 32, 0, 14, 2);
    return g + st + sd;
  }
  function aralia(f) {
    let g = stalk(62, { w: 2.8, col: '#5E8E40', bend: -3 });
    let h = '';
    const lobes = 9;
    for (let i = 0; i < lobes; i++) {
      const a = -100 + i * (200 / (lobes - 1)), L = 30 - Math.abs(a) * .06;
      h += `<g transform="scale(1 .82) rotate(${n1(a)})"><path d="${petalPath(L, 6.5, { tip: .9, base: .02, wave: .5 })}" fill="${sh(f.petal, i % 2 ? .05 : -.05)}" stroke="${sh(f.petal, -.5)}" stroke-width=".5"/><path d="M0 0 L0 ${n1(-L * .92)}" stroke="${sh(f.petal, .45)}" stroke-width=".8"/><path d="M-2 ${n1(-L * .3)} Q-3.4 ${n1(-L * .55)} -1.6 ${n1(-L * .8)}" stroke="#fff" stroke-width="1" opacity=".35" fill="none"/></g>`;
    }
    return g + `<g transform="translate(40 62) scale(1.55)">${h}<circle r="2.4" fill="${sh(f.petal, .3)}"/></g>`;
  }
  function phoenix(f) {
    let g = '';
    const rach = (t) => [40 - 10 * t * t, 238 - 222 * t];
    g += `<path d="M40 238 Q40 120 30 16" stroke="${sh(f.petal, -.45)}" stroke-width="2.6" fill="none"/><path d="M40 238 Q40 120 30 16" stroke="${sh(f.petal, .15)}" stroke-width="1.6" fill="none"/>`;
    for (let i = 0; i < 26; i++) {
      const t = .22 + i * .03, [x, y] = rach(t), L = 30 - i * .7;
      g += leaf(x, y, L, -150 + i * 1.5, { col: sh(f.petal, i % 2 ? .05 : -.08), w: .07, veins: 0, gloss: .25 }) + leaf(x, y, L, -30 - i * 1.5, { col: sh(f.petal, i % 2 ? -.08 : .05), w: .07, veins: 0, gloss: .25 });
    }
    return g;
  }
  function beargrass(f) {
    let g = '';
    for (let i = 0; i < 16; i++) {
      const a = r(-1, 1), ex = 40 + a * 30, ey = 14 + Math.abs(a) * 30 + r(0, 14), cx = 40 + a * 6;
      const col = sh(f.petal, r(-.15, .15));
      g += `<path d="M${n1(39 + r(-1.2, 1.2))} 238 Q${n1(cx)} 100 ${n1(ex)} ${n1(ey)}" stroke="${sh(col, -.4)}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${n1(39.2)} 238 Q${n1(cx)} 100 ${n1(ex)} ${n1(ey)}" stroke="${col}" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
    }
    return g;
  }
  function dracaena(f) {
    let g = stalk(100, { w: 3.4, col: '#6E5A4A' });
    [-60, -38, -18, 0, 16, 36, 58].forEach((a, i) => { g += leaf(40, 100 - Math.abs(a) * .2, 64 - Math.abs(a) * .3, a - 90, { col: sh(f.petal, i % 2 ? .06 : -.06), w: .13, gloss: .3, veins: 0 }); });
    return g;
  }
  function eucababy(f) {
    let g = stalk(14, { w: 2, col: '#8C7466', bend: -3 });
    [[.35, 20, -28], [.55, -18, -24], [.7, 16, -18]].forEach(([t, dx, dy]) => { const [x, y] = pointOn(14, t, -3); g += twig(x, y, x + dx, y + dy, 1, '#8C7466'); });
    const spots = [];
    for (let i = 0; i < 46; i++) { const t = .05 + i * .02, [x, y] = pointOn(14, t, -3); spots.push([x + r(-11, 11) * (1 - t * .4), y + r(-3, 3), r(4, 6.5) * (1 - t * .3)]); }
    [[.35, 20, -28], [.55, -18, -24], [.7, 16, -18]].forEach(([t, dx, dy]) => { const [x, y] = pointOn(14, t, -3); for (let k = 0; k < 6; k++) spots.push([x + dx * k / 5 + r(-3, 3), y + dy * k / 5 + r(-3, 3), r(3.5, 5)]); });
    spots.forEach(([x, y, R]) => { g += `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(r(0, 180))})"><ellipse rx="${n1(R)}" ry="${n1(R * r(.55, .9))}" fill="url(#fl-euca)" stroke="#557A70" stroke-width=".4"/><ellipse cx="${n1(-R * .3)}" cy="${n1(-R * .25)}" rx="${n1(R * .3)}" ry="${n1(R * .15)}" fill="#fff" opacity=".3"/></g>`; });
    return g;
  }

  /* ----- Alstroemeria ----- */
  function alstroFlower(f) {
    const id = f.id, c = f.petal, sq = .78;
    let back = '', front = '';
    for (let i = 0; i < 6; i++) {
      const a = i * 60 + r(-6, 6), rad = a * Math.PI / 180, outer = i % 2 === 0, L = outer ? 13 : 12.5, w = outer ? 5.6 : 3.8;
      let streaks = '';
      if (!outer && i !== 0) for (let k = 0; k < 5; k++) streaks += `<path d="M${n1(r(-1.4, 1.4))} ${n1(-r(3, 5))} l${n1(r(-.4, .4))} ${n1(-r(1.6, 3))}" stroke="#4A1E2A" stroke-width=".45" stroke-linecap="round"/>`;
      const p = `<g transform="scale(1 ${sq}) rotate(${n1(a)})"><path d="${petalPath(L, w, { tip: .5, base: .08, notch: outer ? 0 : 0 })}" fill="url(#fl-${id}${outer ? '-sat' : '-in'})" stroke="${sh(c, -.45)}" stroke-width=".4"/>
        ${!outer ? `<path d="${petalPath(L * .55, w * .75, { tip: .5, base: .1 })}" fill="${f.heart}" opacity=".85"/>` : `<path d="M0 -2 L0 ${n1(-L * .8)}" stroke="${sh(c, -.2)}" stroke-width=".4" opacity=".5"/><ellipse cx="0" cy="${n1(-L * .92)}" rx="1" ry=".6" fill="#6E9A48"/>`}${streaks}</g>`;
      if (Math.cos(rad) > 0) back += p; else front += p;
    }
    let st = '';
    for (let i = 0; i < 6; i++) { const ex = -6 + i * 2.4, ey = -9 - Math.abs(i - 2.5) * .6; st += `<path d="M0 0 Q${n1(ex * .4)} ${n1(ey * .4)} ${n1(ex)} ${n1(ey)}" stroke="${sh(c, .3)}" stroke-width=".55" fill="none"/><ellipse cx="${n1(ex)}" cy="${n1(ey)}" rx="1" ry=".55" fill="#7A3A2A"/>`; }
    return back + st + front;
  }
  function alstro(f) {
    let g = stalk(84, { w: 2.8 });
    for (let i = 0; i < 7; i++) g += leaf(40, 210 - i * 17, 22, i % 2 ? -30 : -150, { col: '#5A8E44', w: .16, veins: 0, curl: i % 2 ? 1 : -1 });
    const fl = [[18, 46, .95, -22], [38, 32, 1.05, -4], [60, 44, .95, 20], [28, 64, .85, -30], [54, 66, .85, 28]];
    for (let i = 0; i < 7; i++) g += leaf(40, 86, 13, -180 + i * 30, { col: '#5A8E44', w: .2, veins: 0 });
    fl.forEach(([x, y]) => { g += twig(40, 84, x, y + 4, 1.1, '#6E9E52', (x - 40) * -.3); });
    g += twig(40, 84, 70, 74, .9, '#6E9E52') + `<g transform="translate(70 74) rotate(50)"><path d="M0 2 C-3 -2 -2.6 -9 0 -11 C2.6 -9 3 -2 0 2Z" fill="${sh(f.petal, -.05)}" stroke="#5E7A3E" stroke-width=".4"/><path d="M0 -10 L0 -2" stroke="#7FA858" stroke-width=".8"/></g>`;
    fl.sort((a, b) => a[1] - b[1]).forEach(([x, y, s, rot]) => { g += `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${alstroFlower(f)}</g>`; });
    return g;
  }

  const FULL = { sprayrose, alstro, disbud: (f) => stalk(54, { w: 3.6 }) + chrysLeaf(40, 165, 34, -155) + chrysLeaf(39, 125, 32, -25) + `<g transform="translate(40 40)">${disbud(f)}</g>`,
    santini, asters, matricaria, sunflower, dahlia: (f) => stalk(50, { w: 3.4 }) + leaf(40, 160, 34, -155, { col: '#3F6E30', w: .4, serr: .12 }) + leaf(39, 118, 30, -25, { col: '#487A38', w: .4, serr: .12 }) + `<g transform="translate(40 42)">${dahlia(f)}</g>`,
    peony: (f) => stalk(54, { w: 3.6 }) + leaf(40, 160, 34, -155, { col: '#3F6E30', w: .3 }) + leaf(39, 120, 30, -25, { col: '#487A38', w: .3 }) + `<g transform="translate(40 42) scale(1.05)">${peony(f)}</g>`,
    lily, calla, hydrangea, carnation, minicarnation, barbatus, agapanthus, stock, gypso, astilbe, kniphofia, carthamus, amaranth, hypericum, thlaspi, alchemilla, solidago,
    nutans, heliconia, alpinia, ananas, oak, panicum, aralia, phoenix, beargrass, dracaena, eucababy };
  const FOLIAGE = ['foliage', 'euca', 'eucababy', 'oak', 'panicum', 'aralia', 'phoenix', 'beargrass', 'dracaena'];

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
    if (FULL[f.type]) return FULL[f.type](f);
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
    const fan = FOLIAGE.includes(f.type) ? [-16, 0, 16] : [-15, -5, 5, 15];
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

  return { DEFS, stem, stemInner, bucket, hand, wrap, FOLIAGE };
})();
