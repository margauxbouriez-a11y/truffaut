/* ============================================================
   JARDIN-BOUTIQUE — kit de dessin botanique
   Dégradés partagés, feuillages en volume, fleurs détaillées,
   pots de pépinière, sachets de bulbes, étiquettes prix.
   Chaque plante a son origine au pied (0,0) et pousse vers le haut.
   ============================================================ */
const JArt = (() => {
  const sh = (c, k) => Deco.shade(c, k);
  const f = (n) => Math.round(n * 10) / 10;
  const rng = (seed) => { let s = (Math.abs(Math.round(seed * 9973)) % 2147483646) + 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
  const tint = (c) => (c.toUpperCase() === '#FFFFFF' ? '#F8F3E7' : c);
  const at = (x, y, inner, extra = '') => `<g transform="translate(${f(x)} ${f(y)})${extra}">${inner}</g>`;

  /* ---------- dégradés partagés, injectés une seule fois dans la page ---------- */
  let host = null; const seen = new Set();
  function def(id, markup) {
    if (!host || !host.isConnected) {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
      s.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
      s.innerHTML = '<defs></defs>';
      document.body.appendChild(s); host = s.firstChild; seen.clear();
    }
    if (!seen.has(id)) { seen.add(id); host.insertAdjacentHTML('beforeend', markup); }
    return `url(#${id})`;
  }
  const hx = (c) => c.slice(1).toUpperCase();
  const nk = (k) => String(Math.round(k * 100)).replace('-', 'm');
  /* b : volume sphérique (lumière haut-gauche) · c : cylindre (pots, troncs)
     l : feuille/pétale (clair en haut) · v : dégradé vertical simple */
  function grad(kind, c, a = .35, b = -.35) {
    const id = `j${kind}${hx(c)}${nk(a)}${nk(b)}`;
    const stops = {
      b: `<stop offset="0" stop-color="${sh(c, a)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${sh(c, b)}"/>`,
      c: `<stop offset="0" stop-color="${sh(c, b)}"/><stop offset=".3" stop-color="${sh(c, a)}"/><stop offset=".62" stop-color="${c}"/><stop offset="1" stop-color="${sh(c, b * 1.25)}"/>`,
      l: `<stop offset="0" stop-color="${sh(c, a)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${sh(c, b)}"/>`,
      v: `<stop offset="0" stop-color="${sh(c, a)}"/><stop offset="1" stop-color="${sh(c, b)}"/>`,
    }[kind];
    const tag = kind === 'b' ? `<radialGradient id="${id}" cx=".36" cy=".3" r=".8">${stops}</radialGradient>`
      : kind === 'c' ? `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">${stops}</linearGradient>`
      : `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>`;
    return def(id, tag);
  }
  const shadowFill = () => def('jshadow', '<radialGradient id="jshadow"><stop offset="0" stop-color="#1B2A1E" stop-opacity=".38"/><stop offset=".6" stop-color="#1B2A1E" stop-opacity=".14"/><stop offset="1" stop-color="#1B2A1E" stop-opacity="0"/></radialGradient>');
  const shadow = (x, y, rx, ry = rx * .18) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${shadowFill()}"/>`;

  /* ---------- feuilles et feuillages ---------- */
  function leaf(x, y, L, ang, c, w = .38, rib = true) {
    const W = L * w, tr = `translate(${f(x)} ${f(y)}) rotate(${Math.round(ang)})`;
    const d = `M0 0C${f(L * .25)} ${f(-W)} ${f(L * .72)} ${f(-W * .85)} ${f(L)} 0C${f(L * .72)} ${f(W * .8)} ${f(L * .25)} ${f(W * .9)} 0 0Z`;
    return `<path transform="${tr}" d="${d}" fill="${grad('l', c, .28, -.28)}" stroke="${sh(c, -.55)}" stroke-width=".7"/>`
      + (rib && L > 13 ? `<path transform="${tr}" d="M${f(L * .1)} 0Q${f(L * .5)} ${f(-W * .12)} ${f(L * .88)} 0" fill="none" stroke="${sh(c, -.42)}" stroke-width=".6" opacity=".75"/>` : '');
  }
  /* Masse de feuillage : des dizaines de feuilles, plus claires côté lumière */
  function crown(cx, cy, rx, ry, { c = '#4C8A3E', n = 60, L = 18, w = .42, seed = 1, base = true, spread = 70, up = 0 } = {}) {
    const R = rng(seed);
    let g = base ? `<path d="${blob(cx, cy, rx * .9, ry * .86, 11, .16, seed + 2)}" fill="${grad('b', sh(c, -.4), .2, -.35)}"/>` : '';
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = R() * 6.2832, rr = Math.sqrt(R()) * 1.02, x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr;
      pts.push({ x, y, a, t: -((x - cx) / rx) * .45 - ((y - cy) / ry) * .7 + (R() - .5) * .45 });
    }
    pts.sort((p, q) => p.t - q.t).forEach((p) => {
      const tone = clamp(Math.round(p.t * 2), -2, 2) * .12, len = L * (.78 + R() * .45);
      const ang = p.a * 57.3 * (1 - up) + -90 * up + (R() - .5) * spread;
      g += leaf(p.x - Math.cos(p.a) * len * .3, p.y - Math.sin(p.a) * len * .3, len, ang, sh(c, tone), w);
    });
    return g;
  }
  const stalk = (x0, y0, x1, y1, w = 2.4, c = '#5A8A3C', bow = 0) => `<path d="M${f(x0)} ${f(y0)}Q${f((x0 + x1) / 2 + bow)} ${f((y0 + y1) / 2)} ${f(x1)} ${f(y1)}" fill="none" stroke="${sh(c, -.35)}" stroke-width="${f(w + 1)}" stroke-linecap="round"/><path d="M${f(x0)} ${f(y0)}Q${f((x0 + x1) / 2 + bow)} ${f((y0 + y1) / 2)} ${f(x1)} ${f(y1)}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="round"/>`;

  /* ---------- fleurs ---------- */
  function roseHead(x, y, r, c, rot = 0) {
    c = tint(c); const o = sh(c, -.5);
    let g = '';
    for (let i = 0; i < 5; i++) g += `<path d="M0 0C${f(-r * .95)} ${f(-r * .15)} ${f(-r * .85)} ${f(-r * 1.08)} 0 ${f(-r * 1.04)}C${f(r * .85)} ${f(-r * 1.08)} ${f(r * .95)} ${f(-r * .15)} 0 0Z" transform="rotate(${i * 72 + rot})" fill="${grad('b', sh(c, -.1), .3, -.3)}" stroke="${o}" stroke-width=".6"/>`;
    g += `<circle r="${f(r * .64)}" fill="${grad('b', c, .45, -.22)}" stroke="${o}" stroke-width=".6"/>`;
    g += `<path d="M${f(-r * .56)} ${f(r * .06)}A${f(r * .56)} ${f(r * .5)} 0 0 1 ${f(r * .46)} ${f(-r * .3)}M${f(-r * .3)} ${f(r * .32)}A${f(r * .42)} ${f(r * .4)} 0 0 0 ${f(r * .52)} ${f(r * .1)}M${f(-r * .18)} ${f(-r * .06)}A${f(r * .2)} ${f(r * .2)} 0 1 1 ${f(r * .1)} ${f(r * .17)}" fill="none" stroke="${sh(c, -.34)}" stroke-width="${f(Math.max(.6, r * .07))}" stroke-linecap="round"/>`;
    g += `<ellipse cx="${f(-r * .3)}" cy="${f(-r * .4)}" rx="${f(r * .24)}" ry="${f(r * .12)}" fill="#fff" opacity=".38" transform="rotate(-30 ${f(-r * .3)} ${f(-r * .4)})"/>`;
    return at(x, y, g);
  }
  function bud(x, y, r, c, ang = 0) {
    c = tint(c);
    return at(x, y, `<path d="M0 0C${f(-r)} ${f(-r * .6)} ${f(-r * .5)} ${f(-r * 1.8)} 0 ${f(-r * 2)}C${f(r * .5)} ${f(-r * 1.8)} ${f(r)} ${f(-r * .6)} 0 0Z" fill="${grad('b', c, .3, -.3)}" stroke="${sh(c, -.5)}" stroke-width=".6"/><path d="M0 0L${f(-r * .9)} ${f(-r * .95)}M0 0L${f(r * .9)} ${f(-r * 1.05)}M0 0L0 ${f(-r * 1.15)}" stroke="#4A7A35" stroke-width="${f(Math.max(.8, r * .32))}" stroke-linecap="round"/>`, ` rotate(${ang})`);
  }
  function doubleFlower(x, y, r, c) {
    c = tint(c); const o = sh(c, c === '#F8F3E7' ? -.28 : -.45);
    let g = '';
    [[9, 1, -.1, 0], [8, .76, -.02, 20], [6, .52, .08, 8], [5, .3, .16, 36]].forEach(([n, k, t, off]) => {
      const rr = r * k, col = sh(c, t);
      for (let i = 0; i < n; i++) g += `<ellipse cx="0" cy="${f(-rr * .55)}" rx="${f(rr * .48)}" ry="${f(rr * .56)}" transform="rotate(${Math.round(i * 360 / n + off)})" fill="${grad('l', col, .3, -.16)}" stroke="${o}" stroke-width=".5"/>`;
    });
    return at(x, y, g + `<circle r="${f(r * .12)}" fill="${sh(c, -.12)}"/>`);
  }
  function dahliaHead(x, y, r, c, pompon = false) {
    const o = sh(c, -.5); let g = '';
    const layers = pompon ? [[13, 1, -.2], [12, .82, -.08], [10, .63, .04], [8, .44, .14], [6, .26, .24]] : [[14, 1, -.16], [13, .8, -.05], [11, .58, .07], [8, .36, .18]];
    layers.forEach(([n, k, t], li) => {
      const rr = r * k, col = sh(c, t);
      for (let i = 0; i < n; i++) {
        const d = pompon ? `M${f(-rr * .25)} 0Q${f(-rr * .34)} ${f(-rr * .9)} 0 ${f(-rr)}Q${f(rr * .34)} ${f(-rr * .9)} ${f(rr * .25)} 0Z` : `M${f(-rr * .19)} 0Q${f(-rr * .27)} ${f(-rr * .66)} 0 ${f(-rr)}Q${f(rr * .27)} ${f(-rr * .66)} ${f(rr * .19)} 0Z`;
        g += `<path d="${d}" transform="rotate(${Math.round(i * 360 / n + li * 13)})" fill="${grad('l', col, .32, -.24)}" stroke="${o}" stroke-width=".5"/>`;
      }
    });
    return at(x, y, g + `<circle r="${f(r * .12)}" fill="${sh(c, .3)}"/>`);
  }
  function lilyHead(x, y, r, c, rot = 0) {
    const o = sh(c, -.5); let g = '';
    for (let i = 0; i < 6; i++) {
      const a = i * 60 + rot + (i % 2) * 6, k = i % 2 ? .9 : 1;
      g += `<g transform="rotate(${a})"><path d="M0 0C${f(-r * .38 * k)} ${f(-r * .3)} ${f(-r * .3 * k)} ${f(-r * .8 * k)} 0 ${f(-r * k)}C${f(r * .3 * k)} ${f(-r * .8 * k)} ${f(r * .38 * k)} ${f(-r * .3)} 0 0Z" fill="${grad('l', sh(c, i % 2 ? -.06 : .05), .38, -.26)}" stroke="${o}" stroke-width=".6"/>`
        + `<path d="M0 ${f(-r * .14)}V${f(-r * .72 * k)}" stroke="${sh(c, -.22)}" stroke-width=".7"/>`
        + [.28, .38, .48].map((t, j) => `<circle cx="${f((j % 2 ? 1 : -1) * r * .07)}" cy="${f(-r * t)}" r="${f(r * .028 + .35)}" fill="#8A3A1C"/>`).join('') + '</g>';
    }
    for (let i = 0; i < 6; i++) g += `<g transform="rotate(${i * 60 + 30 + rot})"><path d="M0 0V${f(-r * .5)}" stroke="#C9D27A" stroke-width=".8"/><ellipse cy="${f(-r * .53)}" rx="${f(r * .05 + .6)}" ry="${f(r * .1 + .8)}" fill="#9A4A1E"/></g>`;
    return at(x, y, g + `<circle r="${f(r * .08 + .6)}" fill="#7FA34A"/>`);
  }
  function funnel(x, y, s, c, side = 1) {
    const o = sh(c, -.48);
    return at(x, y, `<path d="M0 ${f(s * .2)}C${f(-s * 1.05)} ${f(-s * .2)} ${f(-s * 1.15)} ${f(-s * 1.15)} ${f(-s * .3)} ${f(-s * 1.2)}C${f(-s * .05)} ${f(-s * .9)} ${f(s * .05)} ${f(-s * .9)} ${f(s * .3)} ${f(-s * 1.2)}C${f(s * 1.15)} ${f(-s * 1.15)} ${f(s * 1.05)} ${f(-s * .2)} 0 ${f(s * .2)}Z" fill="${grad('l', c, .3, -.25)}" stroke="${o}" stroke-width=".55"/>`
      + `<path d="M0 ${f(s * .15)}C${f(-s * .7)} ${f(-s * .1)} ${f(-s * .5)} ${f(-s * .7)} 0 ${f(-s * .55)}C${f(s * .5)} ${f(-s * .7)} ${f(s * .7)} ${f(-s * .1)} 0 ${f(s * .15)}Z" fill="${grad('l', sh(c, .12), .35, -.15)}" stroke="${o}" stroke-width=".45"/>`
      + `<ellipse cy="${f(-s * .2)}" rx="${f(s * .18)}" ry="${f(s * .28)}" fill="${sh(c, .55)}" opacity=".9"/>`, ` rotate(${side * 14})`);
  }
  function gladSpike(x, y, h, c, lean = 0) {
    let g = stalk(x, y, x + lean, y - h, 2.2, '#5E8C3E', lean * .2);
    g += leaf(x, y - 4, h * .55, -96 + lean * .2, '#5E8C3E', .1, false) + leaf(x, y - 2, h * .45, -80, '#6B9A48', .1, false);
    for (let i = 7; i >= 0; i--) {
      const t = .38 + i * .085, px = x + lean * t * t, py = y - h * t, s = (1.08 - t * .6) * 10.5, side = i % 2 ? 1 : -1;
      g += t > .93 ? bud(px, py, 2.6, '#7DA650', side * 10) : funnel(px + side * s * .35, py, s, sh(c, (i % 3) * .05), side);
    }
    return g;
  }
  function freesiaSpray(x, y, h, c, dir = 1) {
    let g = stalk(x, y, x + dir * h * .3, y - h, 1.6, '#5E8C3E', -dir * 8);
    const tx = x + dir * h * .3, ty = y - h;
    g += `<path d="M${f(tx)} ${f(ty)}q${f(dir * 16)} -4 ${f(dir * 34)} 8" fill="none" stroke="#5E8C3E" stroke-width="1.4"/>`;
    for (let i = 0; i < 5; i++) {
      const px = tx + dir * (4 + i * 7.5), py = ty + (i > 2 ? (i - 2) * 2.5 : 0) - 1, s = i < 3 ? 7.5 - i * .6 : 0;
      g += s ? at(px, py, `<path d="M0 0C-5 -2 ${f(-s)} ${f(-s * 1.1)} ${f(-s * .2)} ${f(-s * 1.5)}C${f(s * .3)} ${f(-s * 1.7)} ${f(s * 1.1)} ${f(-s * 1.3)} ${f(s * .9)} ${f(-s * .7)}C${f(s * .7)} -2 3 1 0 0Z" fill="${grad('l', c, .35, -.2)}" stroke="${sh(c, -.45)}" stroke-width=".5"/><ellipse cx="${f(s * .1)}" cy="${f(-s * .9)}" rx="${f(s * .3)}" ry="${f(s * .25)}" fill="${sh(c, .45)}"/>`, ` rotate(${dir * -16})`)
        : `<ellipse cx="${f(px)}" cy="${f(py)}" rx="2.6" ry="1.7" fill="${grad('b', i === 3 ? sh(c, -.1) : '#8DB35A')}" stroke="#4E7A35" stroke-width=".4"/>`;
    }
    return g + leaf(x, y - 2, h * .5, -100 + dir * 10, '#6B9A48', .12, false);
  }
  function pansyFace(x, y, r, top, low, eye = '#2C1E3E') {
    const o = sh(low, -.5), petal = (cx, cy, rx, ry, a, c) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${a} ${f(cx)} ${f(cy)})" fill="${grad('b', c, .3, -.25)}" stroke="${o}" stroke-width=".55"/>`;
    let g = petal(-r * .42, -r * .5, r * .5, r * .55, -20, top) + petal(r * .42, -r * .5, r * .5, r * .55, 20, top)
      + petal(-r * .55, r * .05, r * .42, r * .38, 10, low) + petal(r * .55, r * .05, r * .42, r * .38, -10, low) + petal(0, r * .38, r * .58, r * .48, 0, low);
    g += `<path d="M0 ${f(r * .05)}L${f(-r * .4)} ${f(r * .45)}M0 ${f(r * .05)}L0 ${f(r * .7)}M0 ${f(r * .05)}L${f(r * .4)} ${f(r * .45)}M0 0L${f(-r * .62)} ${f(r * .02)}M0 0L${f(r * .62)} ${f(r * .02)}" stroke="${eye}" stroke-width="${f(r * .1)}" stroke-linecap="round" opacity=".8"/>`;
    g += `<ellipse cy="${f(r * .14)}" rx="${f(r * .36)}" ry="${f(r * .3)}" fill="${eye}" opacity=".55"/><circle cy="${f(r * .02)}" r="${f(r * .1)}" fill="#F7C531"/>`;
    return at(x, y, g);
  }
  function cycFlower(x, y, s, c, lean = 0) {
    const o = sh(c, -.45);
    const pet = (a, k) => `<path d="M0 0C${f(-s * .35)} ${f(-s * .5)} ${f(-s * .5)} ${f(-s * 1.4)} ${f(-s * .1)} ${f(-s * 2)}C${f(s * .25)} ${f(-s * 1.5)} ${f(s * .3)} ${f(-s * .6)} 0 0Z" transform="rotate(${a})" fill="${grad('l', sh(c, k), .35, -.2)}" stroke="${o}" stroke-width=".5"/>`;
    return at(x, y, pet(-30, -.06) + pet(26, -.02) + pet(-4, .06) + `<path d="M${f(-s * .3)} ${f(s * .1)}Q0 ${f(s * .45)} ${f(s * .3)} ${f(s * .1)}" fill="${sh(c, -.35)}" stroke="${o}" stroke-width=".4"/>`, ` rotate(${lean})`);
  }
  // fleuron d'hortensia à 4 pétales, en un seul tracé
  function floret4(x, y, s) {
    let d = '';
    [[0, -s * .55], [s * .55, 0], [0, s * .55], [-s * .55, 0]].forEach(([dx, dy]) => { const cx = x + dx, cy = y + dy, r = s * .5; d += `M${f(cx + r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0`; });
    return d;
  }
  function lavSpike(x, y, h, c = '#8E72C8', lean = 0, seed = 1) {
    const R = rng(seed);
    let g = `<path d="M${f(x)} ${f(y)}Q${f(x + lean * .4)} ${f(y - h * .55)} ${f(x + lean)} ${f(y - h)}" fill="none" stroke="#8FA27E" stroke-width="1.2"/>`;
    for (let i = 0; i < 8; i++) {
      const t = .62 + i * .052, px = x + lean * t * t, py = y - h * t, s = 3.2 - i * .22, col = sh(c, (R() - .5) * .2 + i * .02);
      g += `<ellipse cx="${f(px - s * .7)}" cy="${f(py)}" rx="${f(s)}" ry="${f(s * 1.25)}" fill="${grad('b', col, .3, -.3)}"/><ellipse cx="${f(px + s * .7)}" cy="${f(py - 1)}" rx="${f(s)}" ry="${f(s * 1.25)}" fill="${grad('b', sh(col, -.06), .3, -.3)}"/>`;
    }
    return g;
  }
  const fruit = (x, y, rx, ry, c, hl = .5) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${grad('b', c, hl, -.35)}" stroke="${sh(c, -.55)}" stroke-width=".6"/>`;
  function lemon(x, y, s, ang = 0) {
    return at(x, y, `<path d="M${f(-s * 1.1)} 0C${f(-s * 1.1)} ${f(-s * .9)} ${f(s * 1.1)} ${f(-s * .9)} ${f(s * 1.1)} 0C${f(s * 1.1)} ${f(s * .9)} ${f(-s * 1.1)} ${f(s * .9)} ${f(-s * 1.1)} 0Z" fill="${grad('b', '#F5CF2E', .55, -.3)}" stroke="#A88414" stroke-width=".6"/><path d="M${f(s * 1.05)} 0l${f(s * .3)} -1l0 2Z" fill="#E2B620"/><ellipse cx="${f(-s * .35)}" cy="${f(-s * .38)}" rx="${f(s * .35)}" ry="${f(s * .16)}" fill="#fff" opacity=".45"/>`, ` rotate(${ang})`);
  }
  function blossom(x, y, r, c = '#FFFFFF', heart = '#F1C94B') {
    c = tint(c); let g = '';
    for (let i = 0; i < 5; i++) g += `<ellipse cy="${f(-r * .55)}" rx="${f(r * .38)}" ry="${f(r * .55)}" transform="rotate(${i * 72})" fill="${grad('b', c, .3, -.15)}" stroke="${sh(c, -.3)}" stroke-width=".4"/>`;
    return at(x, y, g + `<circle r="${f(r * .22)}" fill="${heart}"/>`);
  }
  function strawberryFruit(x, y, s, ang = 0) {
    let seeds = '';
    for (let i = 0; i < 7; i++) seeds += `<circle cx="${f(((i % 3) - 1) * s * .38)}" cy="${f(s * (.2 + Math.floor(i / 3) * .38))}" r=".55" fill="#F6D46B"/>`;
    return at(x, y, `<path d="M${f(-s * .85)} 0C${f(-s * .95)} ${f(s * .8)} ${f(-s * .2)} ${f(s * 1.5)} 0 ${f(s * 1.55)}C${f(s * .2)} ${f(s * 1.5)} ${f(s * .95)} ${f(s * .8)} ${f(s * .85)} 0C${f(s * .5)} ${f(-s * .3)} ${f(-s * .5)} ${f(-s * .3)} ${f(-s * .85)} 0Z" fill="${grad('b', '#D9283A', .4, -.38)}" stroke="#7E1420" stroke-width=".55"/>${seeds}<path d="M0 0l${f(-s * .7)} ${f(-s * .1)}M0 0l${f(s * .7)} ${f(-s * .1)}M0 0l${f(-s * .3)} ${f(-s * .45)}M0 0l${f(s * .3)} ${f(-s * .45)}" stroke="#4A8A35" stroke-width="1.3" stroke-linecap="round"/>`, ` rotate(${ang})`);
  }
  function trifoliate(x, y, s, ang, c = '#3F8A3A') {
    return at(x, y, [-40, 0, 40].map((a) => `<g transform="rotate(${a})"><path d="M0 0C${f(-s * .5)} ${f(-s * .3)} ${f(-s * .55)} ${f(-s * 1.1)} 0 ${f(-s * 1.2)}C${f(s * .55)} ${f(-s * 1.1)} ${f(s * .5)} ${f(-s * .3)} 0 0Z" fill="${grad('l', sh(c, a ? -.05 : .08), .3, -.28)}" stroke="${sh(c, -.55)}" stroke-width=".55"/><path d="M0 -1V${f(-s * 1.05)}" stroke="${sh(c, -.4)}" stroke-width=".5"/></g>`).join(''), ` rotate(${ang})`);
  }

  /* ---------- contenants ---------- */
  // pot de pépinière en plastique noir, origine au fond
  function nursery(w, h, c = '#2F3431') {
    return shadow(0, 1, w * .62) + `<path d="M${f(-w / 2)} ${f(-h)}L${f(w / 2)} ${f(-h)}L${f(w * .4)} 0L${f(-w * .4)} 0Z" fill="${grad('c', c, .28, -.4)}" stroke="#151916" stroke-width=".8"/>`
      + `<rect x="${f(-w / 2 - 2)}" y="${f(-h - 5)}" width="${f(w + 4)}" height="7" rx="1.5" fill="${grad('c', sh(c, .1), .32, -.35)}" stroke="#151916" stroke-width=".8"/>`
      + `<path d="M${f(-w * .43)} ${f(-h * .45)}H${f(w * .43)}" stroke="#151916" stroke-width=".6" opacity=".5"/>`;
  }
  function terracotta(w, h, c = '#C66B40') {
    return shadow(0, 1, w * .62) + `<path d="M${f(-w / 2)} ${f(-h)}L${f(w / 2)} ${f(-h)}L${f(w * .38)} 0L${f(-w * .38)} 0Z" fill="${grad('c', c, .3, -.36)}" stroke="${sh(c, -.55)}" stroke-width=".8"/>`
      + `<rect x="${f(-w / 2 - 4)}" y="${f(-h - 11)}" width="${f(w + 8)}" height="13" rx="2.5" fill="${grad('c', sh(c, .05), .34, -.32)}" stroke="${sh(c, -.55)}" stroke-width=".8"/>`
      + `<path d="M${f(-w * .3)} ${f(-h * .75)}L${f(-w * .26)} ${f(-h * .12)}" stroke="#fff" stroke-width="3" opacity=".18" stroke-linecap="round"/>`;
  }
  const soil = (w, y) => `<ellipse cx="0" cy="${f(y)}" rx="${f(w / 2)}" ry="${f(w * .07 + 1)}" fill="#3A2A1E"/>`;
  // étiquette plastique piquée dans le pot, avec la « photo » de la plante
  const stake = (x, y, c) => at(x, y, `<path d="M-1.6 0V-10" stroke="#E9ECE6" stroke-width="3.2"/><rect x="-8" y="-28" width="16" height="20" rx="2" fill="#F7F8F4" stroke="#9AA197" stroke-width=".6"/><rect x="-6" y="-26" width="12" height="9" rx="1" fill="${grad('b', tint(c), .3, -.25)}"/><path d="M-5.5 -14.5h11M-5.5 -12h8" stroke="#9AA197" stroke-width=".9"/>`, ' rotate(-6)');
  // barquette de plants alvéolée
  function tray(w, n, c = '#25292A') {
    let g = shadow(0, 1, w * .56) + `<path d="M${f(-w / 2)} -18L${f(w / 2)} -18L${f(w / 2 - 4)} 0L${f(-w / 2 + 4)} 0Z" fill="${grad('c', c, .25, -.35)}" stroke="#101213" stroke-width=".8"/>`;
    for (let i = 1; i < n; i++) g += `<path d="M${f(-w / 2 + 2 + (w - 4) * i / n)} -16V-2" stroke="#101213" stroke-width=".7" opacity=".6"/>`;
    return g + `<path d="M${f(-w / 2)} -18H${f(w / 2)}" stroke="#545A5B" stroke-width="1.6"/>`;
  }
  // cagette en bois
  function crate(w, h) {
    const c = '#D4A86C';
    let g = shadow(0, 2, w * .6) + `<rect x="${f(-w / 2)}" y="${f(-h)}" width="${f(w)}" height="${f(h)}" fill="${sh(c, -.45)}"/>`;
    [0, .38, .72].forEach((t) => { g += `<rect x="${f(-w / 2)}" y="${f(-h + h * t)}" width="${f(w)}" height="${f(h * .24)}" fill="${grad('v', c, .18, -.18)}" stroke="${sh(c, -.5)}" stroke-width=".6"/>`; });
    g += `<rect x="${f(-w / 2 - 2)}" y="${f(-h - 2)}" width="8" height="${f(h + 2)}" fill="${grad('c', sh(c, -.08), .2, -.3)}" stroke="${sh(c, -.5)}" stroke-width=".6"/><rect x="${f(w / 2 - 6)}" y="${f(-h - 2)}" width="8" height="${f(h + 2)}" fill="${grad('c', sh(c, -.08), .2, -.3)}" stroke="${sh(c, -.5)}" stroke-width=".6"/>`;
    return g;
  }
  // sachet de bulbes : la fleur est « photographiée » dans la fenêtre
  function sachet(w, h, art, band = '#2E6B3F') {
    return `<rect x="${f(-w / 2)}" y="${f(-h)}" width="${f(w)}" height="${f(h)}" rx="2" fill="#FBF8F0" stroke="#B9B4A4" stroke-width=".7"/>`
      + `<rect x="${f(-w / 2)}" y="${f(-h)}" width="${f(w)}" height="${f(h * .14)}" rx="2" fill="${band}"/><circle cy="${f(-h + h * .07)}" r="2.4" fill="#F4F1E6"/>`
      + `<svg x="${f(-w / 2 + 4)}" y="${f(-h + h * .17)}" width="${f(w - 8)}" height="${f(h * .6)}" viewBox="-40 -80 80 80" preserveAspectRatio="xMidYMid slice"><rect x="-40" y="-80" width="80" height="80" fill="${grad('v', '#CFE6D6', .3, -.08)}"/><ellipse cy="0" rx="60" ry="14" fill="#9DC68A"/>${art}</svg>`
      + `<path d="M${f(-w / 2 + 6)} ${f(-h * .15)}h${f(w * .55)}M${f(-w / 2 + 6)} ${f(-h * .08)}h${f(w * .38)}" stroke="#7D7A70" stroke-width="1.6" stroke-linecap="round"/>`
      + `<circle cx="${f(w / 2 - 10)}" cy="${f(-h * .11)}" r="6.5" fill="#F0A830"/>`;
  }

  /* ---------- étiquette prix de rayon ---------- */
  function priceTag(name, price, note) {
    const w = 156;
    return `<g class="ptag"><rect x="${-w / 2}" y="0" width="${w}" height="46" rx="5" fill="#FFFFFF" stroke="#C9CEC4" stroke-width="1"/>
      <rect x="${-w / 2}" y="0" width="7" height="46" rx="3" fill="#2E6B3F"/>
      <text x="${-w / 2 + 15}" y="18" class="ptag-name">${esc(name)}</text>
      <text x="${-w / 2 + 15}" y="37" class="ptag-price">${esc(price)}</text>
      ${note ? `<text x="${w / 2 - 8}" y="37" text-anchor="end" class="ptag-note">${esc(note)}</text>` : ''}</g>`;
  }

  /* ============================================================
     LES PLANTES DU JARDIN-BOUTIQUE  (c = couleur, s = graine)
     ============================================================ */
  const DRAW = {
    rose: (c, s = 1) => {
      const R = rng(s + 3); let g = '';
      [-26, -12, 2, 14, 26].forEach((x, i) => { g += stalk(x * .3, -40, x, -120 - (i % 2) * 22, 2.2, '#5B7F3A', (i - 2) * 4); });
      g += crown(0, -138, 62, 50, { c: '#3F7D3A', n: 70, L: 15, w: .55, seed: s + 1 });
      const heads = [[-34, -150], [6, -172], [36, -142], [-12, -128], [20, -112], [-44, -116], [10, -146]];
      heads.forEach(([x, y], i) => { g += roseHead(x + R() * 4, y, 11 + R() * 3, sh(tint(c), (R() - .5) * .1), Math.round(R() * 60)); });
      [[-26, -178, -20], [30, -170, 25], [52, -120, 50], [-56, -140, -50]].forEach(([x, y, a]) => { g += bud(x, y, 4.5, c, a); });
      return soil(46, -44) + g + nursery(46, 44) + stake(14, -40, c);
    },
    climber: (c, s = 2) => {
      const R = rng(s + 11); let g = '';
      // treillage en éventail
      [-62, -40, -20, 0, 20, 40, 62].forEach((x) => { g += `<path d="M0 -52L${x} -300" stroke="#8B6A44" stroke-width="3.2" stroke-linecap="round"/><path d="M0 -52L${x} -300" stroke="#C49A66" stroke-width="1.4"/>`; });
      [-150, -220, -280].forEach((y) => { const k = (-y - 52) / 248; g += `<path d="M${f(-62 * k - 4)} ${y}Q0 ${y - 10} ${f(62 * k + 4)} ${y}" fill="none" stroke="#8B6A44" stroke-width="2.6"/>`; });
      g += crown(-20, -190, 44, 100, { c: '#3F7D3A', n: 70, L: 15, w: .55, seed: s, base: false });
      g += crown(28, -220, 46, 80, { c: '#468A3E', n: 55, L: 15, w: .55, seed: s + 4, base: false });
      for (let i = 0; i < 16; i++) { const x = -62 + R() * 124, y = -110 - R() * 190; g += roseHead(x, y, 9 + R() * 3, sh(tint(c), (R() - .5) * .14), Math.round(R() * 70)); }
      for (let i = 0; i < 6; i++) g += bud(-60 + R() * 120, -120 - R() * 180, 3.6, c, -40 + R() * 80);
      return soil(56, -52) + g + nursery(56, 52) + stake(-16, -48, c);
    },
    olive: (c, s = 3) => {
      const R = rng(s + 5);
      let g = `<path d="M-9 -58C-12 -100 4 -120 -4 -160C-8 -185 6 -200 2 -214L10 -214C14 -196 2 -182 6 -160C14 -122 -2 -100 9 -58Z" fill="${grad('c', '#8C826F', .3, -.4)}" stroke="#4B4436" stroke-width=".8"/>`
        + `<path d="M-4 -150q-2 -14 4 -26M2 -110q-4 -10 0 -22" stroke="#5E5546" stroke-width="1" fill="none"/>`;
      g += crown(0, -250, 88, 58, { c: '#8FA47E', n: 170, L: 19, w: .2, seed: s, spread: 90 });
      for (let i = 0; i < 16; i++) g += fruit(-70 + R() * 140, -270 + R() * 50, 3.4, 2.4, R() > .5 ? '#3E4630' : '#6C7A3E', .35);
      return soil(70, -62) + g + terracotta(70, 62) + stake(18, -58, '#7F9470');
    },
    lemon: (c, s = 4) => {
      const R = rng(s + 9);
      let g = `<path d="M-7 -70C-6 -120 -4 -160 -3 -200L4 -200C5 -160 7 -120 8 -70Z" fill="${grad('c', '#8A6B4A', .3, -.4)}" stroke="#4E3A26" stroke-width=".8"/>`;
      g += crown(0, -240, 80, 70, { c: '#327535', n: 110, L: 18, w: .45, seed: s });
      for (let i = 0; i < 9; i++) g += lemon(-60 + R() * 120, -275 + R() * 80, 8 + R() * 2, -30 + R() * 60);
      for (let i = 0; i < 6; i++) g += blossom(-60 + R() * 120, -280 + R() * 80, 4);
      return soil(80, -70) + g + terracotta(80, 70, '#E5D6B8') + stake(-22, -66, '#F5CF2E');
    },
    lavender: (c = '#8E72C8', s = 5) => [-62, 0, 62].map((x, i) => {
      let g = crown(0, -42, 32, 18, { c: '#8FA27E', n: 46, L: 12, w: .16, seed: s + i, up: .6, spread: 80 });
      for (let k = 0; k < 13; k++) g += lavSpike((k - 6) * 3.4, -36, 70 + (k * 7) % 22, c, (k - 6) * 4.2, s + k + i);
      return at(x, 0, soil(34, -30) + g + nursery(34, 30) + (i === 1 ? stake(9, -27, c) : ''));
    }).join(''),
    mimosa: (c = '#FFE04D', s = 6) => {
      const R = rng(s + 2);
      let g = `<path d="M-7 -62C-8 -110 -2 -150 -2 -190L5 -190C6 -150 9 -110 8 -62Z" fill="${grad('c', '#7B6650', .3, -.4)}" stroke="#46392A" stroke-width=".8"/>`;
      g += crown(0, -235, 96, 66, { c: '#6E9A4A', n: 120, L: 24, w: .14, seed: s, spread: 90 });
      for (let i = 0; i < 46; i++) {
        const x = -86 + R() * 172, y = -290 + R() * 106, a = -90 + (x / 86) * 60 + (R() - .5) * 50, L = 10 + R() * 5;
        g += at(x, y, `<rect x="0" y="-3.2" width="${f(L)}" height="6.4" rx="3.2" fill="${grad('b', sh('#F6D02C', (R() - .5) * .14), .55, -.22)}" stroke="#C9A21E" stroke-width="1.4" stroke-dasharray="1 1.4"/>`, ` rotate(${Math.round(a)})`);
      }
      return soil(70, -62) + g + terracotta(70, 62) + stake(16, -58, '#F6D02C');
    },
    hydrangea: (c = '#F4EEDC', s = 7) => {
      const R = rng(s + 7);
      let g = crown(0, -112, 84, 56, { c: '#4C8A3E', n: 70, L: 22, w: .55, seed: s });
      const cream = tint(c);
      [[-52, -150, -14], [-14, -178, -4], [28, -168, 10], [60, -138, 22], [-30, -122, -10], [8, -130, 4]].forEach(([x, y, a]) => {
        const h = 54 + R() * 14, w = 30 + R() * 6;
        let p = `<path d="M${f(-w / 2)} 0C${f(-w / 2)} ${f(-h * .5)} ${f(-w * .18)} ${f(-h)} 0 ${f(-h)}C${f(w * .18)} ${f(-h)} ${f(w / 2)} ${f(-h * .5)} ${f(w / 2)} 0C${f(w / 4)} ${f(h * .14)} ${f(-w / 4)} ${f(h * .14)} ${f(-w / 2)} 0Z" fill="${grad('b', sh(cream, -.08), .3, -.25)}" stroke="${sh(cream, -.35)}" stroke-width=".6"/>`;
        let d1 = '', d2 = '';
        for (let k = 0; k < 46; k++) { const t = R(), yy = -h * t * .95, half = (w / 2) * (1 - t * .8) * .9, xx = (R() * 2 - 1) * half, fs = 2.1 + (1 - t) * 1.1; (R() > .62 ? (d2 += floret4(xx, yy, fs)) : (d1 += floret4(xx, yy, fs))); }
        p += `<path d="${d1}" fill="${cream}" stroke="${sh(cream, -.3)}" stroke-width=".35"/><path d="${d2}" fill="${sh('#F2C9CF', .2)}" stroke="${sh('#E6A8B2', -.15)}" stroke-width=".35"/>`;
        g += at(x, y, p, ` rotate(${a})`);
      });
      return soil(64, -54) + g + nursery(64, 54) + stake(-20, -50, cream);
    },
    camellia: (c = '#FFFFFF', s = 8) => {
      const R = rng(s + 13);
      let g = stalk(0, -46, 0, -90, 4, '#6B5236');
      g += crown(0, -150, 60, 92, { c: '#255E33', n: 95, L: 18, w: .5, seed: s });
      for (let i = 0; i < 18; i++) { const x = -48 + R() * 96, y = -220 + R() * 140; g += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="4" ry="1.6" fill="#fff" opacity=".22" transform="rotate(-35 ${f(x)} ${f(y)})"/>`; }
      [[-30, -196], [22, -214], [36, -150], [-40, -130], [4, -164], [-8, -104], [30, -98]].forEach(([x, y]) => { g += doubleFlower(x + R() * 4, y, 12 + R() * 3, c); });
      return soil(54, -50) + g + nursery(54, 50) + stake(14, -46, c);
    },
    bamboo: (c, s = 9) => {
      const R = rng(s + 1); let g = '', l = '';
      for (let i = 0; i < 13; i++) {
        const x0 = -16 + i * 2.6, x1 = (i - 6) * 13 + (R() - .5) * 10, y1 = -260 - R() * 70;
        g += `<path d="M${f(x0)} -46Q${f(x0 + (x1 - x0) * .2)} ${f((y1 - 46) / 2)} ${f(x1)} ${f(y1)}" fill="none" stroke="#5E7E3A" stroke-width="3.6" stroke-linecap="round"/><path d="M${f(x0)} -46Q${f(x0 + (x1 - x0) * .2)} ${f((y1 - 46) / 2)} ${f(x1)} ${f(y1)}" fill="none" stroke="#9DBB62" stroke-width="1.6" stroke-linecap="round"/>`;
        for (let k = 1; k < 6; k++) { const t = k / 6, xx = x0 + (x1 - x0) * (t * t * .8 + t * .2), yy = -46 + (y1 + 46) * t; g += `<path d="M${f(xx - 2.2)} ${f(yy)}h4.4" stroke="#4A6630" stroke-width="1.2"/>`; if (t > .35) l += `<g>${leaf(xx, yy, 20 + R() * 8, (x1 > 0 ? -20 : -160) + (R() - .5) * 60, sh('#6A9E45', (R() - .5) * .3), .15, false)}</g>`; }
      }
      return soil(52, -48) + g + l + crown(0, -250, 70, 70, { c: '#5E9640', n: 70, L: 22, w: .15, seed: s + 3, base: false }) + nursery(52, 48) + stake(-12, -44, '#6A9E45');
    },
    cyclamen: (c = '#E14C8B', s = 10) => {
      const R = rng(s + 4);
      let g = '';
      for (let i = 0; i < 16; i++) {
        const x = -52 + i * 7 + (R() - .5) * 6, y = -30 - R() * 14;
        g += at(x, y, `<path d="M0 0C-12 -2 -14 -16 -6 -20C-2 -22 0 -18 0 -16C0 -18 2 -22 6 -20C14 -16 12 -2 0 0Z" fill="${grad('l', '#2F5E35', .2, -.3)}" stroke="#1D3B22" stroke-width=".55"/><path d="M0 -3C-6 -5 -8 -13 -4 -15C-2 -16 0 -13 0 -12C0 -13 2 -16 4 -15C8 -13 6 -5 0 -3Z" fill="none" stroke="#B9CDB0" stroke-width="1.2" opacity=".75"/>`, ` rotate(${Math.round((R() - .5) * 40)}) scale(${f(.9 + R() * .3)})`);
      }
      for (let i = 0; i < 11; i++) { const x = -48 + i * 9.6 + (R() - .5) * 5, top = -70 - R() * 22; g += `<path d="M${f(x)} -30Q${f(x + 3)} ${f(top + 10)} ${f(x)} ${f(top + 4)}" fill="none" stroke="#7A2E4A" stroke-width="1.1"/>` + cycFlower(x, top + 4, 7 + R() * 1.5, sh(c, (R() - .5) * .16), (R() - .5) * 20); }
      const pc = '#5D6D63';
      return shadow(0, 1, 70) + g + `<path d="M-64 -32H64L60 0H-60Z" fill="${grad('c', pc, .25, -.35)}" stroke="#2C3530" stroke-width=".8"/><rect x="-66" y="-36" width="132" height="7" rx="1.5" fill="${grad('c', sh(pc, .1), .3, -.3)}" stroke="#2C3530" stroke-width=".8"/>`;
    },
    pansy: (c, s = 11) => {
      const R = rng(s + 2), cols = [['#4B2F8F', '#7A5BD0'], ['#F6C230', '#FFD94F'], ['#6E82D8', '#F4F2FA'], ['#E36A2E', '#F79A3C'], ['#8A2E6E', '#C25BA0']];
      let g = '';
      for (let i = 0; i < 5; i++) {
        const x = -52 + i * 26;
        g += crown(x, -24, 14, 9, { c: '#3F7D3A', n: 16, L: 9, w: .6, seed: s + i, base: false });
        const [t, l] = cols[(i + s) % 5];
        g += pansyFace(x - 5, -36 - R() * 4, 7.5, t, l) + pansyFace(x + 6, -28 - R() * 4, 6.5, t, l);
      }
      return g + tray(140, 5);
    },
    dahlia: (c, s = 12, p) => bulbDisplay('dahlia', c, s, p),
    lily: (c, s = 13, p) => bulbDisplay('lily', c, s, p),
    gladiolus: (c, s = 14, p) => bulbDisplay('glad', c, s, p),
    freesia: (c, s = 15, p) => bulbDisplay('freesia', c, s, p),
    strawberry: (c, s = 16) => {
      const R = rng(s + 3); let g = '';
      for (let i = 0; i < 6; i++) {
        const x = -55 + i * 22;
        for (let k = 0; k < 5; k++) g += `<path d="M${f(x)} -16Q${f(x + (k - 2) * 4)} -26 ${f(x + (k - 2) * 7)} -34" fill="none" stroke="#5E8C3E" stroke-width="1"/>` + trifoliate(x + (k - 2) * 7, -34, 6.5, (k - 2) * 22 + (R() - .5) * 10);
        if (i % 2 === 0) g += strawberryFruit(x + 7, -18, 4.6, -15) + blossom(x - 8, -40, 3.2);
        else g += strawberryFruit(x - 6, -16, 4, 20);
      }
      return g + tray(140, 6);
    },
    lettuce: (c, s = 17) => {
      let g = '';
      for (let i = 0; i < 6; i++) { const x = -60 + i * 24, red = i % 2 === 0; g += crown(x, -26, 13, 11, { c: red ? '#8E2E3A' : '#7DBA4A', n: 22, L: 10, w: .75, seed: s + i, base: true, spread: 40 }) + (red ? `<ellipse cx="${x}" cy="-28" rx="5" ry="4" fill="${grad('b', '#9CC65A', .3, -.2)}"/>` : ''); }
      return g + tray(150, 6);
    },
    tomato: (c, s = 18) => [-58, 0, 58].map((x, i) => {
      const R = rng(s + i);
      let g = `<path d="M8 -26V-150" stroke="#C49A5C" stroke-width="3"/><path d="M8 -26V-150" stroke="#E2C18A" stroke-width="1.2"/>`;
      g += stalk(0, -26, 4, -130, 2.4, '#5E8C3E', -6);
      [-50, -72, -94, -116].forEach((y, k) => { const d = k % 2 ? 1 : -1; g += stalk(2, y, 2 + d * 26, y - 10, 1.2, '#5E8C3E') + [0, 1, 2].map((j) => leaf(2 + d * (8 + j * 8), y - 3 - j * 3, 10, d > 0 ? -30 + j * 10 : -150 - j * 10, '#4A8A3E', .45)).join(''); });
      [[-12, -70], [16, -96]].forEach(([tx, ty]) => { for (let j = 0; j < 5; j++) g += fruit(tx + (j % 3) * 4.5 - 4, ty + Math.floor(j / 3) * 6 + j * 1.5, 3.6, 3.6, j === 4 ? '#F0A13A' : '#E2402E'); });
      return at(x, 0, soil(30, -26) + g + nursery(30, 26) + (i === 1 ? stake(-9, -24, '#E2402E') : ''));
    }).join(''),
    herb: (c = '#5E8C61', s = 19, p) => {
      const romarin = p ? p.id === 'romarin' : c === '#5E8C61';
      return [-56, 0, 56].map((x, i) => {
        const g = romarin
          ? crown(0, -62, 25, 34, { c: '#5A8466', n: 150, L: 11, w: .12, seed: s + i, up: .55, spread: 50, base: false }) + Array.from({ length: 8 }, (_, k) => `<circle cx="${f(-16 + k * 4.5)}" cy="${f(-64 - (k * 7) % 18)}" r="1.6" fill="#A9B8E8"/>`).join('')
          : crown(0, -54, 28, 26, { c: '#4FA34E', n: 64, L: 13, w: .62, seed: s + i, spread: 60 });
        return at(x, 0, soil(30, -26) + g + nursery(30, 26) + (i === 1 ? stake(9, -24, romarin ? '#A9B8E8' : '#4FA34E') : ''));
      }).join('');
    },
    chive: (c, s = 20) => [-56, 0, 56].map((x, i) => {
      const R = rng(s + i); let g = '';
      for (let k = 0; k < 18; k++) { const bx = -10 + k * 1.2, tx = (k - 9) * 3.2 + (R() - .5) * 4, ty = -80 - R() * 26; g += `<path d="M${f(bx)} -26Q${f(bx + (tx - bx) * .3)} -60 ${f(tx)} ${f(ty)}" fill="none" stroke="${sh('#4E9E4E', (R() - .5) * .3)}" stroke-width="1.7" stroke-linecap="round"/>`; }
      [[-12, -100], [6, -110], [16, -92]].forEach(([fx, fy]) => { g += `<circle cx="${fx}" cy="${fy}" r="5.5" fill="${grad('b', '#B48AD9', .4, -.3)}" stroke="#7A5AA0" stroke-width=".5"/>` + Array.from({ length: 6 }, (_, k) => `<path d="M${fx} ${fy}l${f(Math.cos(k) * 5)} ${f(Math.sin(k) * 5)}" stroke="#E2CDF2" stroke-width=".6"/>`).join(''); });
      return at(x, 0, soil(30, -26) + g + nursery(30, 26) + (i === 1 ? stake(9, -24, '#B48AD9') : ''));
    }).join(''),
    garlic: (c = '#EDE3C8', s = 21, p) => {
      const shallot = p ? p.id.startsWith('echalote') : c !== '#EDE3C8';
      const bulb = (x, y, k) => shallot
        ? `<path d="M${f(x)} ${f(y + 9 * k)}C${f(x - 9 * k)} ${f(y + 6 * k)} ${f(x - 7 * k)} ${f(y - 6 * k)} ${f(x)} ${f(y - 12 * k)}C${f(x + 7 * k)} ${f(y - 6 * k)} ${f(x + 9 * k)} ${f(y + 6 * k)} ${f(x)} ${f(y + 9 * k)}Z" fill="${grad('b', '#B8683E', .35, -.35)}" stroke="#6E3618" stroke-width=".55"/>`
        : `<path d="M${f(x)} ${f(y + 8 * k)}C${f(x - 12 * k)} ${f(y + 7 * k)} ${f(x - 11 * k)} ${f(y - 6 * k)} ${f(x)} ${f(y - 10 * k)}C${f(x + 11 * k)} ${f(y - 6 * k)} ${f(x + 12 * k)} ${f(y + 7 * k)} ${f(x)} ${f(y + 8 * k)}Z" fill="${grad('b', '#F1E8D6', .4, -.22)}" stroke="#9C8E70" stroke-width=".55"/><path d="M${f(x - 4 * k)} ${f(y + 6 * k)}Q${f(x - 5 * k)} ${f(y - 2 * k)} ${f(x)} ${f(y - 9 * k)}M${f(x + 4 * k)} ${f(y + 6 * k)}Q${f(x + 5 * k)} ${f(y - 2 * k)} ${f(x)} ${f(y - 9 * k)}" stroke="#C4A0B8" stroke-width=".7" fill="none"/>`;
      let g = '';
      [[-36, 0], [0, -6], [36, 0]].forEach(([bx, by], i) => {
        let b = '';
        [[-9, -36], [8, -38], [0, -24], [-10, -16], [10, -18], [0, -50]].forEach(([x, y]) => { b += bulb(x, y, 1); });
        const net = shallot ? '#C8462E' : '#E2DCC6', nid = shallot ? 'jnetR' : 'jnetW';
        const pat = def(nid, `<pattern id="${nid}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H7M0 0V7" stroke="${net}" stroke-width="1.2"/></pattern>`);
        b += `<path d="M-22 -10C-26 -40 -14 -60 0 -64C14 -60 26 -40 22 -10Z" fill="${pat}" stroke="${net}" stroke-width="1"/>`;
        b += `<path d="M-3 -64q3 -10 8 -6l-5 6" fill="none" stroke="${net}" stroke-width="1.6"/><rect x="-10" y="-70" width="20" height="8" rx="1" fill="#F6E7C1" stroke="#9C8E70" stroke-width=".5"/>`;
        g += at(bx, by - 26, b);
      });
      return crate(130, 40) + g;
    },
  };

  /* Présentoir de bulbes : cagette de bulbes + panneau de sachets illustrés */
  function bulbArt(type, c) {
    if (type === 'dahlia') {
      const pom = c === '#F6A0C0';
      return leaf(-30, -12, 26, -40, '#3F7D3A', .5) + leaf(26, -10, 24, -150, '#46863E', .5) + stalk(-6, 0, -12, -44, 2, '#5E8C3E') + stalk(4, 0, 16, -30, 2, '#5E8C3E')
        + dahliaHead(-12, -48, pom ? 17 : 22, c, pom) + dahliaHead(17, -28, pom ? 13 : 16, sh(c, .06), pom);
    }
    if (type === 'lily') return leaf(-20, -6, 22, -60, '#3F7D3A', .25) + leaf(18, -8, 22, -120, '#46863E', .25) + stalk(0, 0, -10, -36, 2, '#5E8C3E') + stalk(0, 0, 14, -28, 2, '#5E8C3E') + lilyHead(-11, -44, 22, c, 8) + lilyHead(16, -26, 16, sh(c, .05), -14);
    if (type === 'glad') return gladSpike(-18, 4, 78, '#F2694A', 6) + gladSpike(2, 4, 70, '#F7B0C8', -2) + gladSpike(20, 4, 64, '#FFD35A', -8);
    return freesiaSpray(-22, 2, 52, '#FFE36B', 1) + freesiaSpray(18, 2, 46, '#F6A0C0', -1) + freesiaSpray(-2, 2, 62, '#F4F2FA', 1);
  }
  function bulbsIn(type, s) {
    const R = rng(s); let g = '';
    for (let i = 0; i < 14; i++) {
      const x = -48 + (i % 7) * 16 + (R() - .5) * 6, y = -36 - Math.floor(i / 7) * 8 + (R() - .5) * 4;
      if (type === 'dahlia') g += at(x, y, [-18, 10, 40].map((a) => `<ellipse cx="0" cy="-6" rx="3.6" ry="8" transform="rotate(${a})" fill="${grad('b', '#9A6B43', .3, -.35)}" stroke="#5C3C22" stroke-width=".5"/>`).join(''));
      else if (type === 'lily') g += at(x, y, `<ellipse rx="8" ry="6.5" fill="${grad('b', '#E9C8B8', .35, -.3)}" stroke="#9C7464" stroke-width=".5"/><path d="M-4 -4q4 -6 8 0M-6 1q6 -6 12 0" stroke="#B99484" stroke-width=".6" fill="none"/>`);
      else g += at(x, y, `<ellipse rx="${type === 'glad' ? 8 : 5}" ry="${type === 'glad' ? 4.5 : 4.5}" fill="${grad('b', '#B88A5A', .35, -.35)}" stroke="#6E4C2E" stroke-width=".5"/><path d="M0 -4v-3" stroke="#9AB46A" stroke-width="1"/>`);
    }
    return g;
  }
  function bulbDisplay(type, c, s, p) {
    const art = bulbArt(type, c);
    let g = `<path d="M-58 -40V-262M58 -40V-262" stroke="#5E4630" stroke-width="5"/><path d="M-58 -40V-262M58 -40V-262" stroke="#8C6A48" stroke-width="2.4"/>`
      + `<rect x="-74" y="-270" width="148" height="172" rx="4" fill="${grad('v', '#E9DCC0', .1, -.08)}" stroke="#8C7A5C" stroke-width=".8"/>`
      + `<rect x="-74" y="-270" width="148" height="20" rx="4" fill="#2E6B3F"/><text x="0" y="-256" text-anchor="middle" class="rack-head">BULBES</text>`;
    g += at(-35, -104, `<path d="M0 -142v-6" stroke="#6E6A60" stroke-width="1.4"/>` + sachet(66, 140, art)) + at(35, -104, `<path d="M0 -142v-6" stroke="#6E6A60" stroke-width="1.4"/>` + sachet(66, 140, art));
    return g + crate(118, 44) + bulbsIn(type, s);
  }

  return { DRAW, grad, shadow, leaf, crown, stalk, roseHead, blossom, dahliaHead, lilyHead, pansyFace, nursery, terracotta, crate, priceTag, tint, rng, f, at, sh };
})();
