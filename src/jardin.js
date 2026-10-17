/* ============================================================
   LE JARDIN-BOUTIQUE — balade et cueillette dans un jardin dessiné
   ============================================================ */
const Jardin = (() => {
  let el, walkerX = 140, target = 140, raf = null, facing = 1, keyHandler = null, k = 1;
  const H = 600, GROUND = 500;
  const basket = () => store.get('basket', []);
  const setBasket = (b) => { store.set('basket', b); updateCount(); };
  function updateCount() { const n = basket().reduce((s, x) => s + x.qty, 0); const c = $('#basket-count'); if (c) c.textContent = n || ''; }

  /* ---------- dessins de plantes (origine = pied de la plante) ---------- */
  const leafP = (x, y, l, a, c = '#5E9446') => Deco.leaf(x, y, l, a, c, .44);
  const bush = (cx, cy, rx, ry, n, j, seed, fill) => `<path d="${blob(cx, cy, rx, ry, n, j, seed)}" fill="${fill}" stroke="${INK}" stroke-width="3"/>`
    + `<path d="${blob(cx + rx * .2, cy + ry * .25, rx * .75, ry * .66, n, j, seed + 3)}" fill="url(#hatch)"/>`
    + Array.from({ length: 9 }, (_, i) => { const a = i * 0.83 + seed, x = cx + Math.cos(a) * rx * .6, y = cy + Math.sin(a) * ry * .55; return `<path d="M${(x - 7).toFixed(1)} ${y.toFixed(1)} q7 -8 14 0" fill="none" stroke="${INK}" stroke-width="1" opacity=".55"/>`; }).join('')
    + `<path d="${blob(cx - rx * .3, cy - ry * .4, rx * .32, ry * .2, 7, .2, seed + 5)}" fill="#fff" opacity=".16"/>`;
  const pot = (w = 60, c = '#D9774B') => `<path d="M${-w / 2} -${w * .7} L${w / 2} -${w * .7} L${w * .38} 0 L${-w * .38} 0 Z" fill="${c}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><rect x="${-w / 2 - 4}" y="-${w * .7 + 10}" width="${w + 8}" height="12" rx="4" fill="${c}" stroke="${INK}" stroke-width="3"/>`;
  const trunk = (h, w = 12) => `<path d="M${-w / 2} 0 Q${-w / 3} ${-h / 2} -2 ${-h} L2 ${-h} Q${w / 3} ${-h / 2} ${w / 2} 0 Z" fill="#8C5A31" stroke="${INK}" stroke-width="3"/>`;
  const flower5 = (x, y, r, c, heart = '#F0A830') => Deco.daisy(x, y, r * 1.5, c, heart, 7);
  const rose = (x, y, r, c) => Deco.rose(x, y, r * 1.05, c);

  const DRAW = {
    rose: (c, s) => { let g = ''; for (let i = 0; i < 5; i++) g += `<path d="M0 0 Q${(i - 2) * 10} -60 ${(i - 2) * 26} -${100 + (i % 2) * 20}" stroke="${INK}" stroke-width="4" fill="none"/>`;
      g += bush(0, -95, 62, 52, 10, .18, s, '#4FA65A');
      [[-30, -110], [18, -128], [34, -88], [-8, -80], [-38, -78], [4, -140]].forEach(([x, y]) => { g += rose(x, y, 12, c); });
      return g; },
    climber: (c) => { let g = `<path d="M-70 0 V-170 Q0 -250 70 -170 V0" fill="none" stroke="${INK}" stroke-width="13"/><path d="M-70 0 V-170 Q0 -250 70 -170 V0" fill="none" stroke="#C48A55" stroke-width="7"/>`;
      for (let i = 0; i < 16; i++) { const t = i / 15, a = Math.PI * t; const x = -Math.cos(a) * 70, y = -170 - Math.sin(a) * 50; g += leafP(x, y, 22, i * 40, i % 2 ? '#5DB565' : '#3D8B4C'); }
      [[-70, -120], [-62, -190], [-30, -222], [10, -226], [48, -205], [70, -140], [70, -80], [-70, -60]].forEach(([x, y]) => { g += rose(x, y, 11, c); });
      return g; },
    olive: (c, s) => trunk(120, 18) + bush(0, -150, 75, 48, 10, .22, s, '#8FA86A') + Array.from({ length: 10 }, (_, i) => `<ellipse cx="${-50 + (i * 37) % 100}" cy="${-170 + (i * 23) % 50}" rx="5" ry="3.5" fill="#4E5B33" stroke="${INK}" stroke-width="1.5"/>`).join('') + pot(70, '#D9774B'),
    lemon: (c, s) => trunk(110, 14) + bush(0, -160, 68, 62, 10, .18, s, '#3F8F4E') + [[-30, -170], [22, -190], [30, -140], [-10, -130], [-40, -140]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="8" fill="#FFD94A" stroke="${INK}" stroke-width="2.5"/>`).join('') + pot(76, '#E8D9B8'),
    lavender: () => { let g = ''; for (let i = 0; i < 9; i++) { const a = (i - 4) * 9; g += `<path d="M0 0 Q${a * .4} -40 ${a * 1.4} -90" stroke="#7E9C6A" stroke-width="3" fill="none"/>`; for (let k2 = 0; k2 < 5; k2++) g += `<ellipse cx="${a * 1.4 - (a * .1) * k2}" cy="${-90 + k2 * 7}" rx="4" ry="5" fill="#9C7FD6" stroke="${INK}" stroke-width="1.5"/>`; }
      return bush(0, -18, 46, 22, 8, .2, 4, '#9DB88A') + g; },
    mimosa: (c, s) => trunk(110, 14) + bush(0, -150, 80, 55, 11, .2, s, '#8BB36A') + Array.from({ length: 26 }, (_, i) => `<circle cx="${(Math.sin(i * 12.9898) * 62).toFixed(1)}" cy="${(-150 + Math.cos(i * 78.233) * 40).toFixed(1)}" r="6" fill="#FFE04D" stroke="${INK}" stroke-width="1.5"/>`).join(''),
    hydrangea: (c, s) => bush(0, -70, 78, 58, 10, .15, s, '#4FA65A') + [[-40, -100, 0], [10, -118, 1], [44, -84, 2], [-12, -70, 3], [-52, -60, 4]].map(([x, y, i]) => `<path d="M${x} ${y - 26} Q${x + 18} ${y} ${x} ${y + 14} Q${x - 18} ${y} ${x} ${y - 26}Z" fill="${c}" stroke="${INK}" stroke-width="2.5"/>` + `<circle cx="${x}" cy="${y - 4}" r="3" fill="#E6DCC0"/>`).join(''),
    camellia: (c, s) => bush(0, -90, 62, 80, 10, .15, s, '#2F7A44') + [[-26, -130], [20, -110], [-8, -70], [30, -60], [-36, -84], [10, -150]].map(([x, y]) => Deco.peony(x, y, 13, c === '#FFFFFF' ? '#FBF6EE' : c)).join(''),
    bamboo: () => { let g = ''; for (let i = 0; i < 6; i++) { const x = -40 + i * 16; g += `<rect x="${x - 4}" y="-210" width="8" height="210" fill="#8CC56A" stroke="${INK}" stroke-width="2.5"/>`; for (let j = 1; j < 5; j++) g += `<path d="M${x - 5} ${-j * 45} h10" stroke="${INK}" stroke-width="2.5"/>` + leafP(x, -j * 45 - 10, 30, i % 2 ? -30 : -150, '#6DAF4C'); } return g; },
    cyclamen: (c) => `<rect x="-60" y="-34" width="120" height="34" rx="6" fill="#D9774B" stroke="${INK}" stroke-width="3"/>` + [-40, -14, 12, 38].map((x, i) => `<ellipse cx="${x}" cy="-40" rx="16" ry="11" fill="#3D7D4C" stroke="${INK}" stroke-width="2.5"/><path d="M${x} -46 Q${x + 4} -70 ${x} -84" stroke="${INK}" stroke-width="2.5" fill="none"/><path d="M${x - 2} -84 l-10 -18 l8 2 l4 -12 l4 12 l8 -2 l-10 18Z" fill="${c}" stroke="${INK}" stroke-width="2" transform="rotate(${180} ${x} -84)"/>`).join(''),
    pansy: (c) => [-44, -14, 16, 46].map((x, i) => `<path d="${blob(x, -14, 18, 12, 7, .2, i + 2)}" fill="#5DB565" stroke="${INK}" stroke-width="2.5"/><g transform="translate(${x} -30)"><circle cx="-7" cy="-6" r="9" fill="${['#7A5BD0', '#FFD35A', '#F28DB2', '#FFFFFF'][i]}" stroke="${INK}" stroke-width="2"/><circle cx="7" cy="-6" r="9" fill="${['#7A5BD0', '#FFD35A', '#F28DB2', '#FFFFFF'][i]}" stroke="${INK}" stroke-width="2"/><circle cx="0" cy="5" r="10" fill="${['#9C7FE6', '#FFC23D', '#E86FA0', '#C9B8F0'][i]}" stroke="${INK}" stroke-width="2"/><circle r="3" fill="${INK}"/></g>`).join(''),
    dahlia: (c) => { let g = ''; [[-28, -120], [24, -140], [0, -95]].forEach(([x, y], i) => { g += `<path d="M0 0 Q${x * .3} ${y * .5} ${x} ${y}" stroke="#4E8E3E" stroke-width="4" fill="none"/>` + leafP(x * .5, y * .5, 22, i % 2 ? -20 : -160); g += `<g transform="translate(${x} ${y})">${Array.from({ length: 12 }, (_, k2) => `<ellipse cx="0" cy="-12" rx="5" ry="12" fill="${c}" stroke="${INK}" stroke-width="1.8" transform="rotate(${k2 * 30})"/>`).join('')}<circle r="7" fill="${c}" stroke="${INK}" stroke-width="2"/></g>`; }); return g; },
    lily: (c) => `<path d="M0 0 V-110" stroke="#4E8E3E" stroke-width="5"/>` + [-20, -45, -70].map((y, i) => leafP(0, y, 26, i % 2 ? -30 : -150)).join('') + [[-20, -116], [18, -122], [0, -136]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M0 0 Q6 -10 0 -20 Q-6 -10 0 0Z" fill="${c}" stroke="${INK}" stroke-width="2" transform="rotate(${a})"/>`).join('')}</g>`).join(''),
    gladiolus: (c) => [-18, 0, 18].map((x, i) => `<path d="M${x} 0 Q${x * .5} -80 ${x * 1.2} -160" stroke="#4E8E3E" stroke-width="4" fill="none"/>` + [0, 1, 2, 3, 4].map((j) => `<path d="M${x * 1.2 - j * x * .05} ${-80 - j * 18} q-12 -2 -10 -12 q10 -4 12 8 q2 -12 12 -8 q2 10 -10 12z" fill="${['#F2694A', '#F7B0C8', '#FFD35A'][i]}" stroke="${INK}" stroke-width="1.8"/>`).join('')).join(''),
    freesia: (c) => [-24, 0, 24].map((x, i) => `<path d="M${x} 0 Q${x} -60 ${x + 14} -90" stroke="#4E8E3E" stroke-width="3.5" fill="none"/>` + [0, 1, 2].map((j) => `<path d="M${x + 14 + j * 10} ${-90 + j * 3} q-8 -12 2 -18 q10 8 -2 18z" fill="${['#FFE36B', '#F6A0C0', '#FFFFFF'][i]}" stroke="${INK}" stroke-width="1.8"/>`).join('') + leafP(x, -20, 30, -100 + i * 10, '#6DAF4C')).join(''),
    strawberry: () => [-36, 0, 36].map((x, i) => `<path d="${blob(x, -18, 24, 18, 7, .2, i + 5)}" fill="#4FA65A" stroke="${INK}" stroke-width="2.5"/><path d="M${x - 10} -6 q4 -8 8 0 q-2 12 -4 14 q-2 -2 -4 -14z" fill="#E8455B" stroke="${INK}" stroke-width="2"/>${flower5(x + 10, -32, 5, '#FFFFFF')}`).join(''),
    lettuce: (c) => [-40, 0, 40].map((x, i) => `<g transform="translate(${x} 0)">${Array.from({ length: 7 }, (_, k2) => leafP(0, -6, 24, -170 + k2 * 27, i === 1 ? '#B7484A' : (k2 % 2 ? '#9BD66B' : '#7CC46A'))).join('')}<ellipse cx="0" cy="-12" rx="10" ry="8" fill="${i === 1 ? '#D86A6C' : '#B9E37E'}" stroke="${INK}" stroke-width="2"/></g>`).join(''),
    tomato: () => `<path d="M0 0 V-150 M-20 0 V-150 M20 0 V-150" stroke="#C48A55" stroke-width="5"/><path d="M0 0 Q-10 -70 4 -140" stroke="#4E8E3E" stroke-width="5" fill="none"/>` + [-30, -60, -90, -120].map((y, i) => leafP(2, y, 28, i % 2 ? -25 : -155, i % 2 ? '#5DB565' : '#3D8B4C')).join('') + [[-14, -70], [-4, -84], [16, -100], [8, -116], [-16, -126]].map(([x, y]) => C(x, y, 7, '#EE5D45')).join(''),
    herb: (c) => `<path d="${blob(0, -30, 40, 30, 9, .25, 6)}" fill="${c}" stroke="${INK}" stroke-width="3"/>` + Array.from({ length: 8 }, (_, i) => leafP(-28 + (i * 9), -40 - (i % 3) * 10, 14, -60 - i * 8, c)).join('') + pot(54),
    chive: () => Array.from({ length: 12 }, (_, i) => `<path d="M${-14 + i * 2.5} -38 Q${-20 + i * 4} -80 ${-34 + i * 6} -110" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${-14 + i * 2.5} -38 Q${-20 + i * 4} -80 ${-34 + i * 6} -110" stroke="#5DB565" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join('') + [[-30, -112], [6, -116], [30, -106]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#C9A0E6" stroke="${INK}" stroke-width="2"/>`).join('') + pot(54),
    garlic: (c) => `<path d="M-36 0 Q-40 -30 -10 -38 L10 -38 Q40 -30 36 0 Z" fill="#E9D9A8" stroke="${INK}" stroke-width="3"/><path d="M-12 -38 l-6 -12 h36 l-6 12" fill="#E9D9A8" stroke="${INK}" stroke-width="3"/>` + [[-18, -16], [6, -20], [22, -10], [-4, -6]].map(([x, y]) => `<path d="M${x - 9} ${y + 6} C${x - 12} ${y - 6} ${x - 4} ${y - 12} ${x} ${y - 16} C${x + 4} ${y - 12} ${x + 12} ${y - 6} ${x + 9} ${y + 6} Z" fill="${c}" stroke="${INK}" stroke-width="2"/>`).join(''),
  };

  /* ---------- placement ---------- */
  function layout() {
    let x = 120; const items = [], signs = [];
    ZONES.forEach((z) => {
      const list = SHOP.filter((p) => p.zone === z.id);
      signs.push({ x: x + 10, name: z.name });
      x += 150;
      list.forEach((p, i) => { const wide = ['climber', 'olive', 'lemon', 'mimosa', 'hydrangea'].includes(p.kind) ? 300 : 225; items.push({ p, x: x + wide / 2, depth: i % 2 }); x += wide; });
      x += 90;
    });
    return { items, signs, W: x + 120 };
  }

  function sceneSVG() {
    const { items, signs, W } = layout();
    const hills = `<path d="M0 330 Q${W * .1} 250 ${W * .2} 320 T${W * .4} 310 T${W * .6} 300 T${W * .8} 320 T${W} 300 V${GROUND} H0Z" fill="#C9DDB0" stroke="${INK}" stroke-width="3"/>` + `<path d="M0 360 Q${W * .1} 300 ${W * .2} 350 T${W * .4} 340 T${W * .6} 330 T${W * .8} 350 T${W} 330 V${GROUND} H0Z" fill="url(#hatch)" opacity=".5"/>`;
    const sun = `<g transform="translate(260 110)"><circle r="44" fill="#FFD35A" stroke="${INK}" stroke-width="3"/>${Array.from({ length: 10 }, (_, i) => `<path d="M0 -58 v-14" stroke="${INK}" stroke-width="3" stroke-linecap="round" transform="rotate(${i * 36})"/>`).join('')}</g>`;
    const clouds = [600, 1500, 2600, 3500, 4400].filter((x) => x < W).map((x, i) => `<path d="${blob(x, 90 + (i % 2) * 40, 70, 24, 9, .22, i + 31)}" fill="#fff" stroke="${INK}" stroke-width="3"/>`).join('');
    const fence = Array.from({ length: Math.ceil(W / 42) }, (_, i) => `<path d="M${i * 42 + 6} ${GROUND - 40} v-56 l10 -12 l10 12 v56" fill="#F6E7C1" stroke="${INK}" stroke-width="2.5"/>`).join('') + `<rect x="0" y="${GROUND - 88}" width="${W}" height="10" fill="#F6E7C1" stroke="${INK}" stroke-width="2.5"/>`;
    const ground = `<rect x="0" y="${GROUND - 40}" width="${W}" height="${H - GROUND + 40}" fill="#A9CB86" stroke="${INK}" stroke-width="3"/><rect x="0" y="${GROUND - 40}" width="${W}" height="${H - GROUND + 40}" fill="url(#dots)" opacity=".5"/>
      <path d="M0 ${GROUND + 30} C${W * .25} ${GROUND + 10} ${W * .5} ${GROUND + 50} ${W} ${GROUND + 28} V${GROUND + 80} C${W * .5} ${GROUND + 100} ${W * .25} ${GROUND + 60} 0 ${GROUND + 82}Z" fill="#EBD9A2" stroke="${INK}" stroke-width="3"/>
      ${Array.from({ length: Math.ceil(W / 60) }, (_, i) => `<ellipse cx="${i * 60 + 20}" cy="${GROUND + 52 + (i % 3) * 8}" rx="9" ry="5" fill="#D9C68C"/>`).join('')}`;
    const border = Array.from({ length: Math.ceil(W / 88) }, (_, i) => { const x = 30 + i * 88, y = GROUND + 96;
      const k = i % 5; return Deco.leaf(x - 16, y + 2, 22, -150, '#4E7D3A') + Deco.leaf(x + 14, y + 2, 22, -30, '#5E9446') + (k === 0 ? Deco.daisy(x, y - 10, 11) : k === 1 ? Deco.tulip(x, y, .8, '#E04E2E') : k === 2 ? Deco.rose(x, y - 8, 10, '#EE9AAE') : k === 3 ? Deco.lavender(x, y, 34, -8) + Deco.lavender(x + 8, y, 30, 10) : Deco.tulip(x, y, .8, '#F0A830')); }).join('');
    const signSVG = signs.map((s) => `<g transform="translate(${s.x + 60} ${GROUND - 20})"><rect x="-4" y="-40" width="8" height="60" fill="#8C5A31" stroke="${INK}" stroke-width="3"/>
      <rect x="-112" y="-104" width="224" height="66" rx="12" fill="#F6E7C1" stroke="${INK}" stroke-width="3"/><text x="0" y="-62" text-anchor="middle" class="zone-sign">${s.name}</text></g>`).join('');
    const plants = items.map(({ p, x, depth }) => {
      const y = GROUND - 30 + depth * 16;
      const form = p.forms.bulbe && !p.forms.plante ? 'bulbe' : 'plante';
      const label = `${p.name}${form === 'bulbe' ? ', vendu en bulbes' : ''}. Cliquer pour cueillir.`;
      return `<g class="shop-plant" data-id="${p.id}" data-x="${x}" tabindex="0" role="button" aria-label="${esc(label)}" transform="translate(${x} ${y}) scale(1.45)">
        <g class="sway">${DRAW[p.kind](p.color, x % 17 + 2)}</g>
        <g transform="translate(0 30)"><rect x="-66" y="-12" width="132" height="26" rx="7" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
        <text x="0" y="6" text-anchor="middle" class="plant-tag">${esc(shortName(p.name))}</text></g>
        ${form === 'bulbe' ? `<g transform="translate(46 -8)"><circle r="15" fill="#EAD9B5" stroke="${INK}" stroke-width="2.5"/><text y="5" text-anchor="middle" font-size="13" font-weight="700">bulbe</text></g>` : ''}
      </g>`;
    }).join('');
    return { W, svg: `<svg class="garden-svg" viewBox="0 0 ${W} ${H}" style="width:${W * k}px;height:${H * k}px" role="group" aria-label="Le jardin-boutique">
      <rect width="${W}" height="${H}" fill="#D8EBEE"/>${sun}${clouds}${hills}${fence}${ground}${border}${signSVG}${plants}
      <g id="walker" transform="translate(${walkerX} ${GROUND + 40}) scale(1.3)">${walkerSVG()}</g>
      <g id="flyfx"></g></svg>` };
  }
  const shortName = (n) => n.replace(/^Rosier( grimpant)? /, 'Rosier ').replace(/ ?—.*$/, '').replace(/'([^']+)'.*$/, '‘$1’').slice(0, 20);

  function walkerSVG() {
    return `<g class="hopper"><g class="walker-body" transform="scale(${facing} 1)">
      <ellipse cx="0" cy="4" rx="26" ry="6" fill="rgba(0,0,0,.15)"/>
      <rect class="leg l1" x="-12" y="-34" width="10" height="34" rx="5" fill="#5B6FA8" stroke="${INK}" stroke-width="3"/>
      <rect class="leg l2" x="2" y="-34" width="10" height="34" rx="5" fill="#5B6FA8" stroke="${INK}" stroke-width="3"/>
      <path d="M-22 -30 Q-24 -84 0 -86 Q24 -84 22 -30 Z" fill="#5E9446" stroke="${INK}" stroke-width="3"/>
      <path d="M-14 -30 L-12 -66 Q0 -70 12 -66 L14 -30 Z" fill="#E9CFA0" stroke="${INK}" stroke-width="2"/><path d="M-12 -66 L-18 -82 M12 -66 L18 -82" stroke="${INK}" stroke-width="2"/>
      <rect x="-7" y="-52" width="14" height="10" rx="2" fill="none" stroke="${INK}" stroke-width="1.4"/><path d="M-4 -52 v-6 M3 -52 v-8" stroke="#7E5432" stroke-width="2"/>
      <path d="M8 -86 Q22 -80 22 -30 L16 -30 Q16 -70 6 -84Z" fill="url(#hatch)"/>
      <rect x="-14" y="-4" width="12" height="6" rx="3" fill="#7E5432" stroke="${INK}" stroke-width="2"/><rect x="2" y="-4" width="12" height="6" rx="3" fill="#7E5432" stroke="${INK}" stroke-width="2"/>
      <circle cx="0" cy="-104" r="22" fill="#F6D2B5" stroke="${INK}" stroke-width="3"/>
      <path d="M4 -108 q4 -3 8 0" stroke="${INK}" stroke-width="1.6" fill="none"/><circle cx="8" cy="-105" r="2" fill="${INK}"/><path d="M18 -104 q5 3 2 7 q-3 1 -4 -1" fill="#F0BFA0" stroke="${INK}" stroke-width="1.4"/>
      <path d="M2 -96 q8 4 14 -2 q-2 6 -8 6 q-4 0 -6 -4" fill="#7E5432" stroke="${INK}" stroke-width="1.2"/><path d="M6 -94 q4 3 8 0" stroke="${INK}" stroke-width="1.4" fill="none"/>
      <circle cx="14" cy="-98" r="4" fill="#F5A3BC" opacity=".7"/>
      <ellipse cx="0" cy="-120" rx="36" ry="8" fill="#F2D27A" stroke="${INK}" stroke-width="3"/>
      <path d="M-18 -122 Q-16 -146 0 -146 Q16 -146 18 -122 Z" fill="#F2D27A" stroke="${INK}" stroke-width="3"/>
      <path d="M-17 -126 H17" stroke="#E04E2E" stroke-width="5"/>${Deco.daisy(14, -127, 5, '#FFFFFF', '#F0A830', 8)}<path d="M-30 -118 q30 6 60 0" stroke="${INK}" stroke-width=".8" fill="none" opacity=".5"/>
      <path d="M14 -70 Q34 -60 36 -46" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M14 -70 Q34 -60 36 -46" stroke="#7CC46A" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g transform="translate(40 -40)"><path d="M-22 -6 Q0 -40 22 -6" fill="none" stroke="${INK}" stroke-width="4"/><path d="M-24 -6 H24 L18 18 H-18 Z" fill="#D8A15F" stroke="${INK}" stroke-width="3"/><path d="M-20 2 H20 M-19 10 H19 M-8 -6 L-6 18 M8 -6 L6 18" stroke="${INK}" stroke-width="1.5"/>
      <g id="basket-load"></g></g>
    </g></g>`;
  }

  /* ---------- marche ---------- */
  function step() {
    const d = target - walkerX;
    const g = $('#walker', el); if (!g) return;
    if (Math.abs(d) < 2) { walkerX = target; g.classList.remove('walking'); raf = null; place(); return; }
    walkerX += Math.sign(d) * Math.min(Math.abs(d), 7);
    const f = Math.sign(d);
    if (f !== facing) { facing = f; $('.walker-body', g).setAttribute('transform', `scale(${facing} 1)`); }
    g.classList.add('walking');
    place();
    raf = requestAnimationFrame(step);
  }
  function place() {
    const g = $('#walker', el); if (!g) return;
    g.setAttribute('transform', `translate(${walkerX} ${GROUND + 40}) scale(1.3)`);
    const sc = $('.garden-scroll', el);
    const want = walkerX * k - sc.clientWidth / 2;
    if (Math.abs(sc.scrollLeft - want) > sc.clientWidth * 0.25) sc.scrollLeft += (want - sc.scrollLeft) * 0.12;
  }
  function walkTo(x, then) {
    target = x; if (!raf) raf = requestAnimationFrame(step);
    if (then) { const t0 = Date.now(); const wait = () => { if (Math.abs(walkerX - target) < 3 || Date.now() - t0 > 2500) then(); else setTimeout(wait, 60); }; wait(); }
  }

  /* ---------- cueillette ---------- */
  function pick(id, evt) {
    const item = SHOP.find((p) => p.id === id);
    const g = $(`.shop-plant[data-id="${id}"]`, el);
    walkTo(+g.dataset.x - 70 * facing, () => chooseForm(item, evt));
  }
  function chooseForm(item, evt) {
    const opt = (key, title, emoji) => {
      const f = item.forms[key];
      return f ? `<div class="form-opt"><span class="fo-em" aria-hidden="true">${emoji}</span><div><b>${title}</b><span>${esc(f.label)}</span><span class="fo-price">${euro(f.price)}</span></div>
          <button class="btn small" data-form="${key}" type="button">Mettre dans le panier</button></div>`
        : `<div class="form-opt off"><span class="fo-em" aria-hidden="true">${emoji}</span><div><b>${title}</b><span>Pas vendu sous cette forme en ligne</span></div></div>`;
    };
    const box = modal(`<h2>${esc(item.name)}</h2>
      <p class="hand" style="font-size:19px;margin:0 0 12px">Tu la veux en plante ou en bulbe ?</p>
      ${opt('plante', 'Plante en pot', '🪴')}${opt('bulbe', 'Bulbe à planter', '🧅')}
      <p class="small"><a href="${(item.forms.plante || item.forms.bulbe).url}" target="_blank" rel="noopener">Voir la fiche produit sur truffaut.com</a></p>`);
    $$('[data-form]', box).forEach((b) => b.addEventListener('click', () => { add(item, b.dataset.form); closeModal(); }));
  }
  function add(item, form) {
    const b = basket();
    const ex = b.find((x) => x.id === item.id && x.form === form);
    if (ex) ex.qty++; else b.push({ id: item.id, form, qty: 1 });
    setBasket(b);
    // une feuille s'envole de la plante vers le panier du jardinier
    const g = $(`.shop-plant[data-id="${item.id}"]`, el);
    const fx = $('#flyfx', el);
    const x0 = +g.dataset.x, y0 = GROUND - 120;
    const x1 = walkerX + 40 * facing, y1 = GROUND;
    fx.innerHTML = `<g class="fly" style="--dx:${x1 - x0}px;--dy:${y1 - y0}px"><g transform="translate(${x0} ${y0})">${leafP(0, 0, 30, -30, item.color === '#FFFFFF' ? '#5DB565' : item.color)}</g></g>`;
    setTimeout(() => { fx.innerHTML = ''; fillBasket(); }, 900);
    const btn = $('#basket-btn'); btn.classList.remove('jiggle'); void btn.offsetWidth; btn.classList.add('jiggle');
    toast('🧺', `${item.name} dans ton panier`, form === 'bulbe' ? 'En bulbe, à planter.' : 'En plante, prête à planter.', 2600);
  }
  function fillBasket() {
    const load = $('#basket-load'); if (!load) return;
    const items = basket().slice(-5);
    load.innerHTML = items.map((x, i) => { const p = SHOP.find((s) => s.id === x.id); return `<circle cx="${-14 + i * 7}" cy="${-8 - (i % 2) * 4}" r="7" fill="${p ? p.color : '#5DB565'}" stroke="${INK}" stroke-width="2"/>`; }).join('');
  }

  function openBasket() {
    const b = basket();
    const rows = b.map((x, i) => { const p = SHOP.find((s) => s.id === x.id); const f = p.forms[x.form];
      return `<li><div><b>${esc(p.name)}</b><span>${x.form === 'bulbe' ? 'Bulbe' : 'Plante'} · ${esc(f.label)} · ${euro(f.price)}</span></div>
        <div class="qty"><button type="button" data-i="${i}" data-d="-1" aria-label="Retirer un">−</button><b>${x.qty}</b><button type="button" data-i="${i}" data-d="1" aria-label="Ajouter un">+</button></div></li>`; }).join('');
    const total = b.reduce((s, x) => { const f = SHOP.find((p) => p.id === x.id).forms[x.form]; return s + (f.price || 0) * x.qty; }, 0);
    const unknown = b.some((x) => SHOP.find((p) => p.id === x.id).forms[x.form].price == null);
    const box = modal(`<h2>Mon panier</h2>
      ${b.length ? `<ul class="basket-list">${rows}</ul>
        <p class="basket-total">Total : <b>${euro(total)}</b>${unknown ? '<br><span class="small">+ articles dont le prix s’affiche sur la fiche produit</span>' : ''}</p>
        <div class="actions"><button class="btn sun" id="order" type="button">Commander</button><button class="btn white" id="empty" type="button">Vider le panier</button></div>`
      : `<p class="hand" style="font-size:20px">Ton panier est vide. Va te balader dans le jardin-boutique et clique sur les plantes pour les cueillir.</p>
         <div class="actions"><a class="btn" href="#jardin" id="to-garden">Aller au jardin</a></div>`}`);
    $$('.qty button', box).forEach((btn) => btn.addEventListener('click', () => {
      const bb = basket(); const it = bb[+btn.dataset.i]; it.qty += +btn.dataset.d; if (it.qty <= 0) bb.splice(+btn.dataset.i, 1); setBasket(bb); openBasket();
    }));
    const tg = $('#to-garden', box); if (tg) tg.addEventListener('click', closeModal);
    const em = $('#empty', box); if (em) em.addEventListener('click', () => { setBasket([]); openBasket(); });
    const or = $('#order', box); if (or) or.addEventListener('click', () => {
      modal(`<h2>Finaliser sur truffaut.com</h2>
        <p>Dans la version en ligne, ton panier serait transmis directement au panier Truffaut. Dans cette maquette, ouvre chaque fiche pour commander :</p>
        <ul class="link-list">${basket().map((x) => { const p = SHOP.find((s) => s.id === x.id); const f = p.forms[x.form]; return `<li><a href="${f.url}" target="_blank" rel="noopener">${esc(p.name)} (${x.qty})</a></li>`; }).join('')}</ul>`);
    });
  }

  function mount(view) {
    el = view;
    k = window.innerWidth < 700 ? 0.62 : window.innerHeight < 800 ? 0.8 : 0.92;
    const { svg } = sceneSVG();
    el.innerHTML = `<div class="page jardin">
      ${Deco.head('Le jardin-boutique', 'Promène-toi dans les allées et cueille ce qui te plaît. Ici, personne ne te dira « on ne touche pas aux fleurs ». Tu choisis en pot ou en bulbe, et hop, dans le panier.',
        ['Je te suis, mais à mon rythme.', 'Le rosier ‘Edith Piaf’ ? Je ne regrette rien.', 'Les bulbes, c’est comme moi : ça prend son temps, mais ça finit par sortir.'], 1)}
      <div class="walk-bar"><div class="walk-ctrl"><button class="btn white" id="go-l" type="button" aria-label="Marcher vers la gauche">◀</button>
        <select id="zone-jump" aria-label="Aller directement à">${ZONES.map((z) => `<option value="${z.id}">${z.name}</option>`).join('')}</select>
        <button class="btn white" id="go-r" type="button" aria-label="Marcher vers la droite">▶</button></div></div>
      <div class="garden-scroll panel" tabindex="0" aria-label="Le jardin. Flèches gauche et droite pour marcher.">${svg}</div>
      <p class="hand hint">Astuce : utilise les flèches du clavier pour te promener.</p>
    </div>`;
    fillBasket();
    const { W, items, signs } = layout();
    const sc = $('.garden-scroll', el);
    sc.scrollLeft = walkerX * k - sc.clientWidth / 2;
    $$('.shop-plant', el).forEach((g) => {
      g.addEventListener('click', (e) => pick(g.dataset.id, e));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(g.dataset.id, e); } });
    });
    const move = (dir) => walkTo(clamp(target + dir * 260, 80, W - 80));
    $('#go-l', el).addEventListener('click', () => move(-1));
    $('#go-r', el).addEventListener('click', () => move(1));
    $('#zone-jump', el).addEventListener('change', (e) => { const i = ZONES.findIndex((z) => z.id === e.target.value); walkTo(signs[i].x + 150); });
    keyHandler = (e) => { if (document.querySelector('#modal-back')) return; if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } };
    window.addEventListener('keydown', keyHandler);
  }

  return {
    title: 'Le jardin-boutique', mount,
    unmount() { if (raf) cancelAnimationFrame(raf); raf = null; window.removeEventListener('keydown', keyHandler); },
    openBasket, updateCount, DRAW,
  };
})();
route('jardin', Jardin);
