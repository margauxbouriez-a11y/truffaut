/* ============================================================
   LE JARDIN-BOUTIQUE — balade dans une jardinerie dessinée
   Entrée → pépinière (roseraie, coin méditerranéen) → ombrière (sous-bois)
   → serre vitrée (massifs à bulbes, potager) → caisses.
   Les dessins des plantes sont dans jardin-art.js (JArt).
   ============================================================ */
const Jardin = (() => {
  let el, walkerX = 210, target = 210, raf = null, facing = 1, keyHandler = null, k = 1, geo = null;
  const H = 640, BACK = 470, FLOOR = 548, TOP = 458, FEET = 624;
  const { grad, shadow, crown, nursery, priceTag, tint, rng, f, at, sh } = JArt;
  const DRAW = JArt.DRAW;
  const basket = () => store.get('basket', []);
  const setBasket = (b) => { store.set('basket', b); updateCount(); };
  function updateCount() { const n = basket().reduce((s, x) => s + x.qty, 0); const c = $('#basket-count'); if (c) c.textContent = n || ''; }

  const STYLE = { roseraie: 'outdoor', mediterranee: 'outdoor', ombre: 'shade', massif: 'serre', potager: 'serre' };
  const TABLE = ['lavender', 'cyclamen', 'pansy', 'strawberry', 'lettuce', 'tomato', 'herb', 'chive'];
  const WIDTH = { rose: 200, climber: 230, olive: 250, lemon: 240, mimosa: 270, hydrangea: 240, camellia: 205, bamboo: 210, dahlia: 200, lily: 196, gladiolus: 196, freesia: 196, garlic: 196, lavender: 230, cyclamen: 200, pansy: 200, strawberry: 200, lettuce: 210, tomato: 220, herb: 210, chive: 210 };
  const SCALE = { pansy: 1.25, strawberry: 1.25, lettuce: 1.2, cyclamen: 1.15 };
  const shortName = (n) => n.replace(/^Rosier( grimpant)? /, 'Rosier ').replace(/ (non traçant|décoratif|sur tige|officinale)/, '').replace(/ ?—.*$/, '').replace(/'([^']+)'.*$/, '‘$1’').replace(/ en (jardinière|mélange)$/, '').slice(0, 22);
  const shortForm = (l) => l.split(',')[0].replace('Barquette de', 'Barq.').replace('Conteneur de', 'Cont.').replace('Bulbes, spécial pot', 'Spécial pot').replace('Bulbes en mélange', 'En mélange').slice(0, 15);

  /* ---------- plan de la jardinerie ---------- */
  function layout() {
    let x = 330; const items = [], zones = [];
    ZONES.forEach((z) => {
      const zone = { ...z, style: STYLE[z.id] || 'outdoor', x0: x - 40, signX: x + 70 };
      x += 190;
      SHOP.filter((p) => p.zone === z.id).forEach((p, i) => {
        const w = WIDTH[p.kind] || 210;
        items.push({ p, x: x + w / 2, w, table: TABLE.includes(p.kind), depth: TABLE.includes(p.kind) ? 0 : i % 2, zone: z.id });
        x += w;
      });
      x += 80; zone.x1 = x; zones.push(zone);
    });
    // les tables de présentation regroupent les articles voisins de petite taille
    const tables = [];
    items.forEach((it, i) => {
      if (!it.table) return;
      const prev = items[i - 1];
      if (prev && prev.table && prev.zone === it.zone) tables[tables.length - 1].x1 = it.x + it.w / 2 - 6;
      else tables.push({ x0: it.x - it.w / 2 + 6, x1: it.x + it.w / 2 - 6 });
    });
    const checkout = { x0: x, x1: x + 400 };
    return { items, zones, tables, checkout, W: x + 400 };
  }

  /* ---------- décor lointain (parallaxe) ---------- */
  function farLayer(W) {
    const R = rng(7); let g = '';
    const W2 = W * 1.4;
    g += `<path d="M0 360 ${Array.from({ length: Math.ceil(W2 / 300) + 1 }, (_, i) => `Q${i * 300 + 150} ${300 + (i % 3) * 18} ${(i + 1) * 300} ${352 + (i % 2) * 14}`).join(' ')} V${BACK} H0Z" fill="#B9CFAE"/>`;
    for (let x = -40; x < W2; x += 70 + R() * 50) {
      const h = 70 + R() * 70, w = 34 + R() * 26, y = 400 + R() * 20;
      g += `<path d="${blob(x, y - h * .5, w, h * .55, 9, .18, Math.round(x))}" fill="${sh('#7FA27A', (R() - .5) * .2)}" opacity=".85"/>`;
    }
    for (let x = 0; x < W2; x += 120 + R() * 60) g += `<path d="${blob(x, 438, 70, 26, 9, .2, Math.round(x) + 3)}" fill="#97B78A"/>`;
    for (let x = 300; x < W2; x += 700 + R() * 400) {
      const y = 70 + R() * 70;
      g += `<g opacity=".95"><path d="${blob(x, y, 70, 20, 10, .2, Math.round(x))}" fill="#FFFFFF"/><path d="${blob(x + 30, y - 12, 44, 18, 9, .2, Math.round(x) + 1)}" fill="#FFFFFF"/><path d="${blob(x + 6, y + 8, 60, 9, 9, .1, Math.round(x) + 2)}" fill="#E4EEF2"/></g>`;
    }
    return g;
  }

  /* ---------- façade d'entrée ---------- */
  function entrance() {
    let g = `<rect x="0" y="150" width="320" height="${BACK - 150}" fill="${grad('v', '#EEE6D3', .1, -.1)}"/>`;
    for (let x = 8; x < 320; x += 16) g += `<path d="M${x} 176V${BACK}" stroke="#D6CBB3" stroke-width="1"/>`;
    g += `<path d="M-10 150H330L320 176H0Z" fill="${grad('v', '#2E6B3F', .15, -.25)}"/><path d="M0 176H320" stroke="#1E4A2B" stroke-width="2"/>`;
    g += `<rect x="30" y="192" width="270" height="64" rx="8" fill="${grad('v', '#2E6B3F', .12, -.2)}" stroke="#1E4A2B" stroke-width="1.5"/>
      <g transform="translate(70 224)"><circle r="17" fill="#F4F1E6"/><path d="M-8 8C-10 -6 0 -12 10 -10C10 2 2 10 -8 8ZM-8 8L4 -4" fill="#4E9A4E" stroke="#2E6B3F" stroke-width="1.6" stroke-linecap="round"/></g>
      <text x="96" y="222" class="store-sign">Le Grand Jardin</text><text x="97" y="243" class="store-sub">JARDINERIE · FLEURS · POTAGER</text>`;
    g += `<rect x="92" y="282" width="136" height="${BACK - 282}" fill="#2D3B35"/><rect x="98" y="288" width="60" height="${BACK - 288}" fill="${grad('v', '#5E7C70', .15, -.3)}" stroke="#AEB5B0" stroke-width="2"/><rect x="162" y="288" width="60" height="${BACK - 288}" fill="${grad('v', '#5E7C70', .15, -.3)}" stroke="#AEB5B0" stroke-width="2"/>
      <path d="M104 300L150 260M112 420L156 370M168 330L214 290" stroke="#fff" stroke-width="8" opacity=".12"/><rect x="88" y="276" width="144" height="8" fill="#AEB5B0"/>
      <text x="160" y="310" text-anchor="middle" class="door-label">Bienvenue</text>`;
    [44, 276].forEach((x, i) => { g += at(x, BACK + 6, `${shadow(0, 0, 30)}<path d="M-3 -40V-78" stroke="#6B5236" stroke-width="5"/>${crown(0, -100, 30, 30, { c: '#3E7D3A', n: 50, L: 11, w: .5, seed: 40 + i })}${JArt.terracotta(40, 40, '#B65A35')}`); });
    return g;
  }

  /* ---------- fonds de chaque espace ---------- */
  function hedge(x0, x1, y = 396) {
    let g = `<path d="M${x0} ${BACK}V${y + 20}${Array.from({ length: Math.ceil((x1 - x0) / 60) }, (_, i) => `q30 ${-22 - (i % 3) * 6} 60 0`).join('')}V${BACK}Z" fill="${grad('v', '#4A7C43', .1, -.3)}"/>`;
    for (let x = x0 + 30; x < x1 - 10; x += 110) g += crown(x, y + 26, 52, 22, { c: '#4E8446', n: 26, L: 13, w: .5, seed: Math.round(x), base: false });
    return g;
  }
  function backStock(x0, x1, y, palette, seed) {
    const R = rng(seed); let g = '';
    for (let x = x0 + 24; x < x1 - 20; x += 40 + R() * 10) {
      const c = palette[Math.floor(R() * palette.length)], h = 18 + R() * 12;
      g += at(x, y, `<path d="M-11 -14H11L9 0H-9Z" fill="#33393A"/><path d="${blob(0, -14 - h * .5, 15, h * .6, 8, .2, Math.round(x))}" fill="${grad('b', '#5F8C55', .2, -.3)}"/>`
        + (c ? Array.from({ length: 5 }, (_, i) => `<circle cx="${f(-9 + i * 4.5 + R() * 2)}" cy="${f(-14 - h * (.4 + R() * .6))}" r="${f(2.4 + R() * 1.4)}" fill="${grad('b', c, .4, -.3)}"/>`).join('') : ''));
    }
    return `<g opacity=".92">${g}</g>`;
  }
  function pergola(x0, x1) {
    let g = '';
    for (let x = x0 + 60; x < x1; x += 220) g += `<rect x="${x - 6}" y="250" width="12" height="${BACK - 246}" fill="${grad('c', '#9A7650', .25, -.35)}" stroke="#5E4630" stroke-width=".8"/>`;
    g += `<rect x="${x0}" y="240" width="${x1 - x0}" height="14" fill="${grad('v', '#A98258', .2, -.3)}" stroke="#5E4630" stroke-width=".8"/>`;
    for (let x = x0 + 20; x < x1; x += 46) g += `<rect x="${x - 4}" y="232" width="8" height="30" rx="2" fill="${grad('c', '#B48C60', .2, -.3)}" stroke="#5E4630" stroke-width=".6"/>`;
    const R = rng(x0);
    for (let x = x0 + 30; x < x1; x += 90) {
      g += crown(x, 246, 50, 16, { c: '#4A8440', n: 22, L: 12, w: .5, seed: Math.round(x), base: false });
      for (let i = 0; i < 4; i++) g += `<circle cx="${f(x - 40 + R() * 80)}" cy="${f(236 + R() * 24)}" r="${f(4 + R() * 2)}" fill="${grad('b', R() > .5 ? '#F2B6C4' : '#E7859C', .4, -.3)}"/>`;
    }
    for (let x = x0 + 60; x < x1; x += 220) g += crown(x, 340, 14, 80, { c: '#4A8440', n: 24, L: 11, w: .5, seed: Math.round(x) + 9, base: false });
    return g;
  }
  function stoneWall(x0, x1) {
    const R = rng(x0 + 1);
    let g = '';
    for (let x = x0 + 50; x < x1; x += 130 + R() * 60) g += `<path d="M${f(x)} ${BACK - 30}C${f(x - 22)} 380 ${f(x - 10)} 260 ${f(x)} ${f(200 + R() * 30)}C${f(x + 10)} 260 ${f(x + 22)} 380 ${f(x)} ${BACK - 30}Z" fill="${grad('b', '#3E6A3E', .2, -.35)}"/>`;
    g += `<rect x="${x0}" y="420" width="${x1 - x0}" height="${BACK - 420}" fill="#CDBA94"/>`;
    for (let row = 0; row < 3; row++) for (let x = x0 - (row % 2) * 20; x < x1; x += 34 + R() * 12) {
      const w = 28 + R() * 12, y = 422 + row * 16;
      g += `<rect x="${f(x)}" y="${y}" width="${f(w)}" height="14" rx="5" fill="${grad('b', sh('#DCC9A2', (R() - .5) * .16), .25, -.2)}" stroke="#A48E66" stroke-width=".6"/>`;
    }
    g += `<rect x="${x0}" y="414" width="${x1 - x0}" height="9" rx="3" fill="${grad('v', '#E2D2AE', .1, -.15)}" stroke="#A48E66" stroke-width=".6"/>`;
    return g;
  }
  function ombriere(x0, x1) {
    const R = rng(x0 + 5);
    let g = `<rect x="${x0}" y="60" width="${x1 - x0}" height="${BACK - 60}" fill="${grad('v', '#5F8A64', .1, -.35)}"/>`;
    for (let x = x0 + 20; x < x1; x += 50 + R() * 40) g += `<path d="M${f(x)} ${BACK}V120" stroke="#3E5A40" stroke-width="${f(6 + R() * 8)}" opacity=".6"/>`;
    for (let x = x0; x < x1; x += 90) g += `<path d="${blob(x + R() * 30, 160 + R() * 60, 80, 50, 9, .2, Math.round(x))}" fill="${sh('#4D7A50', (R() - .5) * .2)}" opacity=".7"/>`;
    for (let x = x0 + 20; x < x1; x += 70) { const y = BACK - 2; for (let i = 0; i < 7; i++) { const a = -150 + i * 20; g += JArt.leaf(x, y, 34 + R() * 10, a, '#3F7A45', .22, false); } }
    for (let x = x0 + 10; x < x1; x += 260) g += `<rect x="${x - 4}" y="62" width="8" height="${BACK - 62}" fill="${grad('c', '#3D4B42', .3, -.3)}"/>`;
    const net = '#24402D';
    g += `<path d="M${x0} 50${Array.from({ length: Math.ceil((x1 - x0) / 260) }, () => 'q130 26 260 0').join('')}V80${Array.from({ length: Math.ceil((x1 - x0) / 260) }, () => 'q-130 26 -260 0').join('')}Z" fill="${net}" opacity=".88"/>`;
    g += `<path d="M${x0} 50${Array.from({ length: Math.ceil((x1 - x0) / 260) }, () => 'q130 26 260 0').join('')}" fill="none" stroke="#14261A" stroke-width="2"/>`;
    for (let i = 0; i < 26; i++) { const x = x0 + R() * (x1 - x0), y = 120 + R() * 320; g += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(10 + R() * 18)}" ry="${f(4 + R() * 6)}" fill="#F7F3D0" opacity=".14"/>`; }
    return g;
  }
  function serre(x0, x1) {
    let g = `<rect x="${x0}" y="128" width="${x1 - x0}" height="${BACK - 128}" fill="#FFFFFF" opacity=".26"/>`;
    // panneaux vitrés, reflets et montants
    for (let x = x0; x < x1; x += 100) {
      g += `<path d="M${x + 14} 330L${x + 60} 150M${x + 30} 440L${x + 90} 210" stroke="#FFFFFF" stroke-width="10" opacity=".14"/>`;
      g += `<rect x="${x - 3}" y="128" width="6" height="${BACK - 128}" fill="${grad('c', '#F2F4F1', .3, -.2)}" stroke="#AFB8B2" stroke-width=".6"/>`;
    }
    g += `<rect x="${x0}" y="300" width="${x1 - x0}" height="5" fill="#E9ECE8" stroke="#AFB8B2" stroke-width=".6"/>`;
    g += `<rect x="${x0}" y="430" width="${x1 - x0}" height="${BACK - 430}" fill="${grad('v', '#CFC9BC', .1, -.12)}"/><path d="M${x0} 430H${x1}" stroke="#A9A293" stroke-width="1.5"/>`;
    // toit en dents de scie (serre Venlo)
    let roof = '';
    for (let x = x0; x < x1; x += 160) roof += `<path d="M${x} 128L${x + 80} 44L${x + 160} 128Z" fill="#FFFFFF" fill-opacity=".22" stroke="#E8EBE7" stroke-width="4"/><path d="M${x + 80} 44V128M${x + 40} 86V128M${x + 120} 86V128" stroke="#E8EBE7" stroke-width="2"/>`;
    g += roof + `<rect x="${x0}" y="124" width="${x1 - x0}" height="10" fill="${grad('v', '#F4F6F3', .2, -.2)}" stroke="#AFB8B2" stroke-width=".7"/>`;
    // poutre treillis
    let tr = `<path d="M${x0} 150H${x1}M${x0} 168H${x1}" stroke="#EEF1ED" stroke-width="3"/>`;
    for (let x = x0; x < x1; x += 24) tr += `<path d="M${x} 150L${x + 12} 168L${x + 24} 150" fill="none" stroke="#EEF1ED" stroke-width="1.6"/>`;
    g += `<g opacity=".95">${tr}</g>`;
    // tablette du fond chargée de plantes
    g += `<rect x="${x0}" y="452" width="${x1 - x0}" height="8" fill="${grad('v', '#9AA49C', .2, -.2)}"/>`;
    return g;
  }
  function hangingBasket(x, seed, flower) {
    const R = rng(seed);
    let g = `<path d="M${x} 168L${x - 16} 228M${x} 168L${x + 16} 228M${x} 168V226" stroke="#6F7570" stroke-width=".9"/>`;
    let trail = '';
    for (let s = 0; s < 6; s++) { const sx = x - 22 + s * 9, len = 30 + R() * 50; for (let y = 236; y < 236 + len; y += 9) trail += JArt.leaf(sx + Math.sin(y * .2 + s) * 3, y, 9, s % 2 ? 60 : 120, '#4F9A4A', .6, false); if (flower) trail += `<circle cx="${f(sx)}" cy="${f(236 + len)}" r="3.2" fill="${grad('b', flower, .4, -.3)}"/>`; }
    g += `<path d="M${x - 24} 228Q${x} 262 ${x + 24} 228Z" fill="${grad('b', '#8C6A44', .25, -.35)}" stroke="#5E4630" stroke-width=".7"/>` + crown(x, 224, 26, 10, { c: '#4F9A4A', n: 22, L: 10, w: .6, seed, base: false }) + trail;
    return `<g class="hang" style="transform-origin:${x}px 168px">${g}</g>`;
  }
  function zoneSign(z) {
    if (z.style === 'serre') return `<g transform="translate(${z.signX} 0)"><path d="M-80 168V198M80 168V198" stroke="#6F7570" stroke-width="1"/><rect x="-128" y="196" width="256" height="46" rx="6" fill="${grad('v', '#2E6B3F', .12, -.2)}" stroke="#1E4A2B" stroke-width="1.2"/><text y="226" text-anchor="middle" class="zone-sign">${esc(z.name)}</text></g>`;
    const top = z.style === 'shade' ? 280 : 300;
    return `<g transform="translate(${z.signX} 0)">${shadow(0, FLOOR - 2, 50)}<rect x="-5" y="${top}" width="10" height="${FLOOR - top}" fill="${grad('c', '#3D4B42', .3, -.3)}"/>
      <rect x="-106" y="${top - 26}" width="212" height="52" rx="6" fill="${grad('v', '#2E6B3F', .12, -.2)}" stroke="#1E4A2B" stroke-width="1.2"/><text y="${top + 7}" text-anchor="middle" class="zone-sign">${esc(z.name)}</text></g>`;
  }

  /* ---------- sol ---------- */
  function floorSeg(x0, x1, style) {
    const base = { outdoor: '#E2D5B3', shade: '#CDBB97', serre: '#D9D4C8', entry: '#DAD3C4', checkout: '#D9D4C8' }[style];
    const pat = style === 'outdoor' || style === 'shade'
      ? JArt.grad('v', base, .1, -.12)
      : JArt.grad('v', base, .1, -.1);
    let g = `<rect x="${x0}" y="${BACK}" width="${x1 - x0}" height="${H - BACK}" fill="${pat}"/>`;
    if (style === 'outdoor' || style === 'shade') g += `<rect x="${x0}" y="${BACK}" width="${x1 - x0}" height="${H - BACK}" fill="url(#jgravel)"/>`;
    else for (let x = x0 + 80; x < x1; x += 160) g += `<path d="M${x} ${BACK}L${x - 40} ${H}" stroke="#BFB8A8" stroke-width="1"/>`;
    if (style !== 'outdoor' && style !== 'shade') g += `<path d="M${x0} 560H${x1}" stroke="#BFB8A8" stroke-width="1"/>`;
    g += `<rect x="${x0}" y="${BACK}" width="${x1 - x0}" height="16" fill="#000" opacity=".06"/>`;
    return g;
  }

  /* ---------- mobilier ---------- */
  function table(x0, x1) {
    let g = shadow((x0 + x1) / 2, FLOOR, (x1 - x0) / 2 + 10, 8);
    for (let x = x0 + 14; x <= x1 - 10; x += Math.max(60, (x1 - x0 - 28) / Math.max(1, Math.round((x1 - x0) / 220)))) g += `<rect x="${f(x - 3)}" y="${TOP + 10}" width="6" height="${FLOOR - TOP - 10}" fill="${grad('c', '#566760', .3, -.3)}"/>`;
    g += `<rect x="${x0 - 4}" y="${TOP - 4}" width="${x1 - x0 + 8}" height="10" fill="${grad('v', '#C99D69', .25, -.1)}"/>`;
    for (let x = x0; x < x1; x += 34) g += `<path d="M${x} ${TOP - 4}v10" stroke="#9C7448" stroke-width=".8"/>`;
    g += `<rect x="${x0 - 6}" y="${TOP + 6}" width="${x1 - x0 + 12}" height="12" rx="2" fill="${grad('v', '#A57A4C', .15, -.3)}" stroke="#6E4E2E" stroke-width=".8"/>`;
    g += `<rect x="${x0 + 10}" y="${FLOOR - 26}" width="${x1 - x0 - 20}" height="4" fill="#566760" opacity=".8"/>`;
    return g;
  }
  function checkoutSVG(c) {
    const x = c.x0 + 170;
    let g = floorSeg(c.x0, c.x1, 'checkout');
    g += `<rect x="${c.x0}" y="150" width="${c.x1 - c.x0}" height="${BACK - 150}" fill="${grad('v', '#EEE6D3', .1, -.1)}"/>`;
    for (let xx = c.x0 + 8; xx < c.x1; xx += 16) g += `<path d="M${xx} 150V${BACK}" stroke="#D6CBB3" stroke-width="1"/>`;
    g += `<g class="checkout" tabindex="0" role="button" aria-label="Passer en caisse : ouvrir mon panier">
      <path d="M${x - 80} 168V196M${x + 80} 168V196" stroke="#6F7570" stroke-width="1"/><path d="M${c.x0} 168H${c.x1}" stroke="#AFB8B2" stroke-width="3"/>
      <rect x="${x - 110}" y="194" width="220" height="50" rx="6" fill="${grad('v', '#2E6B3F', .12, -.2)}" stroke="#1E4A2B" stroke-width="1.2"/><text x="${x}" y="226" text-anchor="middle" class="zone-sign">Caisses →</text>
      ${shadow(x, FLOOR + 2, 130, 10)}
      <path d="M${x - 120} ${FLOOR}V420H${x + 120}V${FLOOR}Z" fill="${grad('v', '#C99D69', .15, -.25)}" stroke="#6E4E2E" stroke-width="1"/>
      <rect x="${x - 128}" y="410" width="256" height="14" rx="3" fill="${grad('v', '#E9E4D8', .2, -.15)}" stroke="#8E877A" stroke-width=".8"/>
      ${Array.from({ length: 7 }, (_, i) => `<path d="M${x - 110 + i * 36} 430V${FLOOR - 8}" stroke="#9C7448" stroke-width="1"/>`).join('')}
      <rect x="${x + 40}" y="366" width="56" height="40" rx="4" fill="${grad('v', '#3C4743', .2, -.3)}"/><rect x="${x + 46}" y="372" width="44" height="22" rx="2" fill="#9FD3B2"/><text x="${x + 68}" y="388" text-anchor="middle" class="till">0,00</text>
      <rect x="${x + 50}" y="402" width="36" height="8" fill="#3C4743"/>
      ${at(x - 80, 410, `<path d="M-20 0H20L16 -22H-16Z" fill="${grad('c', '#C66B40', .3, -.35)}"/>${crown(0, -34, 22, 16, { c: '#4C8A3E', n: 26, L: 9, w: .5, seed: 5 })}${JArt.roseHead(-8, -38, 6, '#F3A6B8')}${JArt.roseHead(8, -34, 5.5, '#F8F3E7')}`)}
      <g transform="translate(${x - 20} 380)"><rect x="-26" y="0" width="52" height="30" rx="3" fill="#FBF8F0" stroke="#B9B4A4"/><text y="13" text-anchor="middle" class="till-note">Clique ici</text><text y="24" text-anchor="middle" class="till-note">pour payer</text></g>
    </g>`;
    return g;
  }

  /* ---------- la scène complète ---------- */
  function sceneSVG() {
    geo = layout();
    const { items, zones, tables, checkout, W } = geo;
    def();
    let back = '', floor = floorSeg(0, 330, 'entry'), stock = '', signs = '', light = '';
    zones.forEach((z, i) => {
      const x0 = z.x0, x1 = (zones[i + 1] ? zones[i + 1].x0 : z.x1) + 1;
      floor += floorSeg(x0, x1, z.style);
      if (z.style === 'outdoor') {
        back += hedge(x0, x1) + (z.id === 'roseraie' ? pergola(x0, x1) : stoneWall(x0, x1));
        stock += backStock(x0, x1, BACK + 8, z.id === 'roseraie' ? ['#F3A6B8', '#C8243C', '#F8F3E7', null] : ['#9C7FD6', null, '#F5CF2E', null], i + 1);
        for (let x = x0 + 100; x < x1; x += 520) light += `<path d="M${x} 0L${x + 140} 0L${x + 340} ${BACK}L${x + 120} ${BACK}Z" fill="url(#jray)"/>`;
      } else if (z.style === 'shade') {
        back += ombriere(x0, x1);
        stock += backStock(x0, x1, BACK + 8, ['#F8F3E7', null, '#E14C8B', null], i + 9);
      } else {
        back += serre(x0, x1);
        stock += backStock(x0, x1, 456, z.id === 'massif' ? ['#7A5BD0', '#FFD35A', '#F28DB2', '#F2694A'] : [null, '#E2402E', null, '#F5CF2E'], i + 17);
        for (let x = x0 + 140; x < x1 - 60; x += 300) stock += hangingBasket(x, Math.round(x), ['#E0447A', '#F28DB2', null][Math.round(x / 300) % 3]);
        for (let x = x0 + 60; x < x1; x += 480) light += `<path d="M${x} 130L${x + 70} 130L${x + 260} ${FLOOR}L${x + 120} ${FLOOR}Z" fill="url(#jray)"/>`;
      }
      signs += zoneSign(z);
    });
    // la serre se termine par un pignon, l'ombrière par un poteau
    zones.forEach((z, i) => { if (z.style === 'serre' && (!zones[i - 1] || zones[i - 1].style !== 'serre')) back += `<rect x="${z.x0 - 8}" y="40" width="16" height="${BACK - 40}" fill="${grad('c', '#F2F4F1', .3, -.25)}" stroke="#AFB8B2" stroke-width=".8"/>`; });

    const tablesSVG = tables.map((t) => table(t.x0, t.x1)).join('');
    const plants = items.map(({ p, x, table: onTable, depth }, i) => {
      const y = onTable ? TOP : FLOOR + depth * 10, sc = (SCALE[p.kind] || 1) * (onTable ? 1 : 1 - depth * .04);
      const form = p.forms.plante ? 'plante' : 'bulbe', fm = p.forms[form];
      const price = fm.price == null ? 'Prix sur la fiche' : euro(fm.price);
      const tagY = onTable ? TOP + 22 : FLOOR + 18;
      const label = `${p.name}, ${form === 'bulbe' ? 'vendu en bulbes' : 'en plante'}, ${fm.price == null ? 'prix affiché sur la fiche produit' : euro(fm.price)}. Cliquer pour cueillir.`;
      return `<g class="shop-plant" data-id="${p.id}" data-x="${f(x)}" tabindex="0" role="button" aria-label="${esc(label)}">
        <ellipse class="glow" cx="${f(x)}" cy="${f(y - 4)}" rx="${f(WIDTH[p.kind] * .42)}" ry="16"/>
        <g transform="translate(${f(x)} ${f(y)}) scale(${f(sc)})"><g class="sway">${DRAW[p.kind](p.color, i + 2, p)}</g></g>
        ${onTable ? '' : `<path d="M${f(x - 50)} ${tagY - 2}V${tagY + 2}" stroke="#7E8781" stroke-width="2"/>`}
        <g transform="translate(${f(x)} ${tagY})">${priceTag(shortName(p.name), price, fm.price == null ? '' : shortForm(fm.label))}</g>
      </g>`;
    }).join('');
    const border = (() => { let g = `<rect x="0" y="${H - 12}" width="${W}" height="12" fill="${grad('v', '#7A5A3A', .2, -.2)}"/>`; const R = rng(3); for (let x = 6; x < W; x += 26 + R() * 30) { for (let j = 0; j < 5; j++) g += `<path d="M${f(x)} ${H - 10}q${f((j - 2) * 3)} -10 ${f((j - 2) * 6 + (R() - .5) * 4)} ${f(-14 - R() * 10)}" stroke="${sh('#5E8C3E', (R() - .5) * .3)}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; } return g; })();

    const svg = `<svg class="garden-svg" viewBox="0 0 ${W} ${H}" style="width:${f(W * k)}px;height:${f(H * k)}px" role="group" aria-label="Le jardin-boutique, une jardinerie à parcourir">
      <rect width="${W}" height="${H}" fill="url(#jsky)"/>
      <g id="far">${farLayer(W)}</g>
      ${entrance()}${back}${floor}${stock}${checkoutSVG(checkout)}${tablesSVG}${signs}${plants}
      <g id="walker" transform="translate(${walkerX} ${FEET}) scale(1.1)">${walkerSVG()}</g>
      <g id="flyfx"></g>${border}
      <g class="light" pointer-events="none">${light}</g></svg>`;
    return { W, svg };
  }
  // dégradés propres à la scène
  function def() {
    grad('v', '#FFFFFF');
    const host = document.querySelector('svg[aria-hidden="true"] > defs');
    if (!host || host.querySelector('#jsky')) return;
    host.insertAdjacentHTML('beforeend', `<linearGradient id="jsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9D3E6"/><stop offset=".6" stop-color="#DDEEF0"/><stop offset="1" stop-color="#F2F0E2"/></linearGradient>
      <linearGradient id="jray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8DC" stop-opacity=".34"/><stop offset="1" stop-color="#FFF8DC" stop-opacity="0"/></linearGradient>
      <pattern id="jgravel" width="22" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.3" fill="#A8977A" opacity=".55"/><circle cx="14" cy="9" r="1.6" fill="#FFFFFF" opacity=".45"/><circle cx="9" cy="12" r="1" fill="#8E7E62" opacity=".5"/><circle cx="19" cy="4" r="1.1" fill="#C9BA98"/></pattern>`);
  }

  /* ---------- le jardinier et son chariot ---------- */
  function walkerSVG() {
    return `<g class="hopper"><g class="walker-body" transform="scale(${facing} 1)">
      <ellipse cx="40" cy="2" rx="96" ry="9" fill="url(#jshadow)"/>
      <g class="cart">
        <path d="M40 -40V-112" stroke="#1E4A2B" stroke-width="5" stroke-linecap="round"/><path d="M40 -40V-112" stroke="#3C8A50" stroke-width="2.6" stroke-linecap="round"/>
        <rect x="32" y="-118" width="16" height="7" rx="3.5" fill="#2A2F2C"/>
        <rect x="40" y="-46" width="118" height="10" rx="2" fill="${grad('v', '#C99D69', .25, -.2)}" stroke="#6E4E2E" stroke-width="1"/>
        <path d="M40 -36H158M48 -36V-12M150 -36V-12" stroke="#1E4A2B" stroke-width="3.5"/><path d="M40 -36H158" stroke="#3C8A50" stroke-width="1.6"/>
        <g transform="translate(52 -9)"><g class="wheel"><circle r="9" fill="#2A2F2C"/><circle r="3.4" fill="#9AA39D"/><path d="M0 -9V9M-9 0H9" stroke="#5A615C" stroke-width="1"/></g></g>
        <g transform="translate(146 -9)"><g class="wheel"><circle r="9" fill="#2A2F2C"/><circle r="3.4" fill="#9AA39D"/><path d="M0 -9V9M-9 0H9" stroke="#5A615C" stroke-width="1"/></g></g>
        <g id="basket-load" transform="translate(99 -46)"></g>
      </g>
      <rect class="leg l1" x="-12" y="-36" width="10" height="36" rx="5" fill="${grad('c', '#4F5F94', .25, -.3)}" stroke="${INK}" stroke-width="1.6"/>
      <rect class="leg l2" x="2" y="-36" width="10" height="36" rx="5" fill="${grad('c', '#4F5F94', .25, -.3)}" stroke="${INK}" stroke-width="1.6"/>
      <rect x="-14" y="-5" width="13" height="7" rx="3.5" fill="#5E4630" stroke="${INK}" stroke-width="1.2"/><rect x="2" y="-5" width="13" height="7" rx="3.5" fill="#5E4630" stroke="${INK}" stroke-width="1.2"/>
      <path d="M-22 -32Q-24 -86 0 -88Q24 -86 22 -32Z" fill="${grad('c', '#3F7D46', .25, -.35)}" stroke="${INK}" stroke-width="1.8"/>
      <path d="M-14 -32L-12 -68Q0 -72 12 -68L14 -32Z" fill="${grad('v', '#E9D3A8', .2, -.1)}" stroke="${INK}" stroke-width="1.4"/><path d="M-12 -68L-18 -84M12 -68L18 -84" stroke="${INK}" stroke-width="1.4"/>
      <rect x="-7" y="-54" width="14" height="10" rx="2" fill="none" stroke="${INK}" stroke-width="1"/><path d="M-4 -54v-6M3 -54v-8" stroke="#7E5432" stroke-width="1.6"/>
      <path d="M12 -76Q30 -84 38 -112" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M12 -76Q30 -84 38 -112" stroke="#3F7D46" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="39" cy="-114" r="5" fill="#F3CDB0" stroke="${INK}" stroke-width="1.2"/>
      <circle cx="0" cy="-106" r="22" fill="${grad('b', '#F6D2B5', .2, -.15)}" stroke="${INK}" stroke-width="1.8"/>
      <path d="M4 -110q4 -3 8 0" stroke="${INK}" stroke-width="1.4" fill="none"/><circle cx="8" cy="-107" r="2" fill="${INK}"/><path d="M18 -106q5 3 2 7q-3 1 -4 -1" fill="#F0BFA0" stroke="${INK}" stroke-width="1.1"/>
      <path d="M2 -98q8 4 14 -2q-2 6 -8 6q-4 0 -6 -4" fill="#7E5432" stroke="${INK}" stroke-width="1"/><path d="M6 -96q4 3 8 0" stroke="${INK}" stroke-width="1.2" fill="none"/>
      <circle cx="14" cy="-100" r="4" fill="#F5A3BC" opacity=".6"/>
      <ellipse cx="0" cy="-122" rx="36" ry="8" fill="${grad('v', '#F4D98A', .2, -.2)}" stroke="${INK}" stroke-width="1.8"/>
      <path d="M-18 -124Q-16 -148 0 -148Q16 -148 18 -124Z" fill="${grad('b', '#F2D27A', .3, -.2)}" stroke="${INK}" stroke-width="1.8"/>
      <path d="M-17 -128H17" stroke="#2E6B3F" stroke-width="5"/>${Deco.daisy(14, -129, 5, '#FFFFFF', '#F0A830', 8)}
    </g></g>`;
  }

  /* ---------- marche ---------- */
  function zoneAt(x) { const z = geo.zones.find((zz) => x >= zz.x0 && x < zz.x1 + 40); return z ? z.id : geo.zones[0].id; }
  function step() {
    const d = target - walkerX;
    const g = $('#walker', el); if (!g) return;
    if (Math.abs(d) < 2) { walkerX = target; g.classList.remove('walking'); raf = null; place(); return; }
    walkerX += Math.sign(d) * Math.min(Math.abs(d), Math.max(8, Math.abs(d) * .07));
    const fc = Math.sign(d);
    if (fc !== facing) { facing = fc; $('.walker-body', g).setAttribute('transform', `scale(${facing} 1)`); }
    g.classList.add('walking');
    place();
    raf = requestAnimationFrame(step);
  }
  function place() {
    const g = $('#walker', el); if (!g) return;
    g.setAttribute('transform', `translate(${walkerX} ${FEET}) scale(1.1)`);
    const sc = $('.garden-scroll', el);
    const want = walkerX * k - sc.clientWidth / 2;
    if (Math.abs(sc.scrollLeft - want) > sc.clientWidth * 0.22) sc.scrollLeft += (want - sc.scrollLeft) * 0.12;
    const sel = $('#zone-jump', el); const z = zoneAt(walkerX); if (sel && sel.value !== z && document.activeElement !== sel) sel.value = z;
  }
  function parallax() { const sc = $('.garden-scroll', el), far = $('#far', el); if (sc && far) far.setAttribute('transform', `translate(${f(sc.scrollLeft / k * .4)} 0)`); }
  function walkTo(x, then) {
    target = clamp(x, 80, geo.W - 120); if (!raf) raf = requestAnimationFrame(step);
    if (then) { const t0 = Date.now(); const wait = () => { if (Math.abs(walkerX - target) < 3 || Date.now() - t0 > 6000) then(); else setTimeout(wait, 60); }; wait(); }
  }

  /* ---------- cueillette ---------- */
  function pick(id) {
    const item = SHOP.find((p) => p.id === id);
    const x = +$(`.shop-plant[data-id="${id}"]`, el).dataset.x;
    walkTo(walkerX < x ? x - 150 : x + 150, () => chooseForm(item));
  }
  function chooseForm(item) {
    const opt = (key, title, emoji) => {
      const fm = item.forms[key];
      return fm ? `<div class="form-opt"><span class="fo-em" aria-hidden="true">${emoji}</span><div><b>${title}</b><span>${esc(fm.label)}</span><span class="fo-price">${euro(fm.price)}</span></div>
          <button class="btn small" data-form="${key}" type="button">Mettre dans le chariot</button></div>`
        : `<div class="form-opt off"><span class="fo-em" aria-hidden="true">${emoji}</span><div><b>${title}</b><span>Pas vendu sous cette forme en ligne</span></div></div>`;
    };
    const art = `<svg class="pick-art" viewBox="-130 -330 260 350" aria-hidden="true">${DRAW[item.kind](item.color, 3, item)}</svg>`;
    const box = modal(`<div class="pick-head">${art}<div><h2>${esc(item.name)}</h2>
      <p class="hand" style="font-size:19px;margin:0 0 4px">Tu la veux en plante ou en bulbe ?</p></div></div>
      ${opt('plante', 'Plante en pot', '🪴')}${opt('bulbe', 'Bulbe à planter', '🧅')}
      <p class="small"><a href="${(item.forms.plante || item.forms.bulbe).url}" target="_blank" rel="noopener">Voir la fiche produit sur truffaut.com</a></p>`);
    $$('[data-form]', box).forEach((b) => b.addEventListener('click', () => { add(item, b.dataset.form); closeModal(); }));
  }
  function add(item, form) {
    const b = basket();
    const ex = b.find((x) => x.id === item.id && x.form === form);
    if (ex) ex.qty++; else b.push({ id: item.id, form, qty: 1 });
    setBasket(b);
    const g = $(`.shop-plant[data-id="${item.id}"]`, el);
    const fx = $('#flyfx', el);
    const x0 = +g.dataset.x, y0 = FLOOR - 140;
    const x1 = walkerX + 110 * facing, y1 = FEET - 60;
    fx.innerHTML = `<g class="fly" style="--dx:${x1 - x0}px;--dy:${y1 - y0}px"><g transform="translate(${x0} ${y0})">${miniPot(item.color, 1.6)}</g></g>`;
    setTimeout(() => { fx.innerHTML = ''; fillBasket(); }, 900);
    const btn = $('#basket-btn'); btn.classList.remove('jiggle'); void btn.offsetWidth; btn.classList.add('jiggle');
    toast('🛒', `${item.name} dans ton chariot`, form === 'bulbe' ? 'En bulbes, à planter.' : 'En plante, prête à planter.', 2600);
  }
  const miniPot = (c, s = 1) => `<g transform="scale(${s})"><path d="M-7 -12H7L5.5 0H-5.5Z" fill="${grad('c', '#C66B40', .3, -.35)}" stroke="#6E3618" stroke-width=".5"/><circle cx="-3" cy="-17" r="6" fill="${grad('b', '#4C8A3E', .3, -.3)}"/><circle cx="4" cy="-18" r="5.5" fill="${grad('b', '#5A9A48', .3, -.3)}"/><circle cx="1" cy="-21" r="4" fill="${grad('b', tint(c), .4, -.3)}" stroke="${sh(tint(c), -.4)}" stroke-width=".4"/></g>`;
  function fillBasket() {
    const load = $('#basket-load', el); if (!load) return;
    const items = basket().flatMap((x) => Array(Math.min(x.qty, 3)).fill(x)).slice(-8);
    load.innerHTML = items.map((x, i) => { const p = SHOP.find((s) => s.id === x.id); return at(-46 + (i % 6) * 18 + (i >= 6 ? 9 : 0), i >= 6 ? -12 : 0, miniPot(p ? p.color : '#5DB565', 1.3)); }).join('');
  }

  function openBasket() {
    const b = basket();
    const rows = b.map((x, i) => { const p = SHOP.find((s) => s.id === x.id); const fm = p.forms[x.form];
      return `<li><div><b>${esc(p.name)}</b><span>${x.form === 'bulbe' ? 'Bulbe' : 'Plante'} · ${esc(fm.label)} · ${euro(fm.price)}</span></div>
        <div class="qty"><button type="button" data-i="${i}" data-d="-1" aria-label="Retirer un">−</button><b>${x.qty}</b><button type="button" data-i="${i}" data-d="1" aria-label="Ajouter un">+</button></div></li>`; }).join('');
    const total = b.reduce((s, x) => { const fm = SHOP.find((p) => p.id === x.id).forms[x.form]; return s + (fm.price || 0) * x.qty; }, 0);
    const unknown = b.some((x) => SHOP.find((p) => p.id === x.id).forms[x.form].price == null);
    const box = modal(`<h2>Mon panier</h2>
      ${b.length ? `<ul class="basket-list">${rows}</ul>
        <p class="basket-total">Total : <b>${euro(total)}</b>${unknown ? '<br><span class="small">+ articles dont le prix s’affiche sur la fiche produit</span>' : ''}</p>
        <div class="actions"><button class="btn sun" id="order" type="button">Commander</button><button class="btn white" id="empty" type="button">Vider le panier</button></div>`
      : `<p class="hand" style="font-size:20px">Ton chariot est vide. Va te balader dans le jardin-boutique et clique sur les plantes pour les cueillir.</p>
         <div class="actions"><a class="btn" href="#jardin" id="to-garden">Aller au jardin</a></div>`}`);
    $$('.qty button', box).forEach((btn) => btn.addEventListener('click', () => {
      const bb = basket(); const it = bb[+btn.dataset.i]; it.qty += +btn.dataset.d; if (it.qty <= 0) bb.splice(+btn.dataset.i, 1); setBasket(bb); fillBasket(); openBasket();
    }));
    const tg = $('#to-garden', box); if (tg) tg.addEventListener('click', closeModal);
    const em = $('#empty', box); if (em) em.addEventListener('click', () => { setBasket([]); fillBasket(); openBasket(); });
    const or = $('#order', box); if (or) or.addEventListener('click', () => {
      modal(`<h2>Finaliser sur truffaut.com</h2>
        <p>Dans la version en ligne, ton panier serait transmis directement au panier Truffaut. Dans cette maquette, ouvre chaque fiche pour commander :</p>
        <ul class="link-list">${basket().map((x) => { const p = SHOP.find((s) => s.id === x.id); const fm = p.forms[x.form]; return `<li><a href="${fm.url}" target="_blank" rel="noopener">${esc(p.name)} (${x.qty})</a></li>`; }).join('')}</ul>`);
    });
  }

  function mount(view) {
    el = view;
    k = window.innerWidth < 700 ? 0.6 : window.innerHeight < 800 ? 0.78 : 0.9;
    const { svg } = sceneSVG();
    el.innerHTML = `<div class="page jardin">
      ${Deco.head('Le jardin-boutique', 'Pousse la porte et promène-toi dans les allées : la pépinière, l’ombrière, puis la grande serre. Clique sur une plante pour la mettre dans ton chariot, en pot ou en bulbe, et passe en caisse au bout de l’allée.',
        ['Je te suis, mais à mon rythme.', 'Le rosier ‘Edith Piaf’ ? Je ne regrette rien.', 'Les bulbes, c’est comme moi : ça prend son temps, mais ça finit par sortir.', 'Dans la serre, il fait bon. J’y passerais l’hiver.'], 1)}
      <div class="walk-bar"><div class="walk-ctrl"><button class="btn white" id="go-l" type="button" aria-label="Marcher vers la gauche">◀</button>
        <select id="zone-jump" aria-label="Aller directement à">${ZONES.map((z) => `<option value="${z.id}">${z.name}</option>`).join('')}</select>
        <button class="btn white" id="go-r" type="button" aria-label="Marcher vers la droite">▶</button></div></div>
      <div class="garden-scroll panel" tabindex="0" aria-label="Le jardin. Flèches gauche et droite pour marcher.">${svg}</div>
      <p class="hand hint">Astuce : flèches du clavier pour te promener, ou clique sur l’allée pour y aller.</p>
    </div>`;
    fillBasket();
    const sc = $('.garden-scroll', el);
    sc.scrollLeft = walkerX * k - sc.clientWidth / 2;
    sc.addEventListener('scroll', parallax, { passive: true }); parallax();
    $$('.shop-plant', el).forEach((g) => {
      g.addEventListener('click', (e) => { e.stopPropagation(); pick(g.dataset.id); });
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(g.dataset.id); } });
    });
    const co = $('.checkout', el);
    const goPay = (e) => { e.stopPropagation(); walkTo(geo.checkout.x0 + 30, openBasket); };
    co.addEventListener('click', goPay); co.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goPay(e); } });
    $('.garden-svg', el).addEventListener('click', (e) => { const r = e.currentTarget.getBoundingClientRect(); walkTo((e.clientX - r.left) / k); });
    const move = (dir) => walkTo(target + dir * 280);
    $('#go-l', el).addEventListener('click', () => move(-1));
    $('#go-r', el).addEventListener('click', () => move(1));
    $('#zone-jump', el).addEventListener('change', (e) => { const z = geo.zones.find((zz) => zz.id === e.target.value); walkTo(z.signX + 80); });
    keyHandler = (e) => { if (document.querySelector('#modal-back')) return; if (e.target.closest && e.target.closest('select')) return; if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } };
    window.addEventListener('keydown', keyHandler);
  }

  return {
    title: 'Le jardin-boutique', mount,
    unmount() { if (raf) cancelAnimationFrame(raf); raf = null; window.removeEventListener('keydown', keyHandler); },
    openBasket, updateCount, DRAW,
  };
})();
route('jardin', Jardin);
