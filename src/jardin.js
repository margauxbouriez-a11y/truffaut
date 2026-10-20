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

  // plantes de la serre : dessinées dans un repère 300×340 (pied du pot en 150,320), ramené à l'échelle du jardin
  const SV = (inner) => `<g transform="translate(-105 -224) scale(.7)">${inner}</g>`;
  const IK = () => `stroke="${INK}" stroke-width="4.3"`;
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
    /* ---------- la serre tropicale : plantes d'intérieur (dessinées sur une grille 300×340, ramenées à l'échelle .7) ---------- */
    monstera: (c) => { const L = 'M0 -6 C-34 0 -66 -22 -66 -58 C-66 -94 -32 -114 0 -108 C32 -114 66 -94 66 -58 C66 -22 34 0 0 -6Z';
      const lf = (x, y, r, s) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><g mask="url(#jd-mono)"><path d="${L}" fill="${c}" stroke="${INK}" stroke-width="${(3 / .7 / s).toFixed(1)}"/><path d="M0 -6 C34 0 66 -22 66 -58 C66 -94 32 -114 0 -108Z" fill="url(#hatch)"/><path d="M0 -6 Q2 -58 0 -104" stroke="${INK}" stroke-width="${(1.4 / .7 / s).toFixed(1)}" fill="none"/></g></g>`;
      const stems = ['M152 242 Q150 170 152 112', 'M142 242 Q122 200 104 152', 'M158 242 Q184 200 200 146', 'M140 244 Q112 230 88 210', 'M160 244 Q190 230 214 208'].map((d) => `<path d="${d}" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#4E8E3E" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('');
      return SV(`<mask id="jd-mono" maskUnits="userSpaceOnUse" x="-80" y="-125" width="160" height="135"><path d="${L}" fill="#fff"/><path d="M-72 -60 L-24 -56 M-68 -88 L-22 -72 M-64 -26 L-24 -38 M-42 -114 L-14 -84 M-38 -2 L-14 -22 M72 -60 L24 -56 M68 -88 L22 -72 M64 -26 L24 -38 M42 -114 L14 -84 M38 -2 L14 -22" stroke="#000" stroke-width="6" stroke-linecap="round"/><ellipse cx="-40" cy="-45" rx="3.5" ry="5.5"/><ellipse cx="40" cy="-45" rx="3.5" ry="5.5"/></mask>
        <rect x="143" y="58" width="14" height="190" rx="7" fill="#8C6B4C" ${IK()}/><path d="M146 80 h8 M146 120 h8 M146 160 h8 M146 200 h8" stroke="#6E8A3C" stroke-width="3" stroke-linecap="round"/>${stems}`)
        + pot(76, '#F3F0E8') + SV(lf(152, 112, 0, .8) + lf(104, 152, -38, .88) + lf(200, 146, 36, .84) + lf(88, 210, -72, .66) + lf(214, 208, 70, .66)); },
    lyrata: (c) => { const L = 'M0 0 C-22 -6 -30 -30 -24 -46 C-20 -54 -27 -62 -23 -72 C-16 -86 16 -86 23 -72 C27 -62 20 -54 24 -46 C30 -30 22 -6 0 0Z';
      const lf = (x, y, r, s) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="${L}" fill="${c}" stroke="${INK}" stroke-width="${(3 / .7 / s).toFixed(1)}" stroke-linejoin="round"/><path d="M0 0 C22 -6 30 -30 24 -46 C20 -54 27 -62 23 -72 C16 -86 0 -84 0 -84Z" fill="url(#hatch)"/><path d="M0 -2 Q1 -40 0 -80 M0 -18 Q-10 -22 -19 -32 M0 -18 Q10 -22 19 -32 M0 -40 Q-9 -44 -18 -54 M0 -40 Q9 -44 18 -54 M0 -60 Q-8 -64 -16 -74 M0 -60 Q8 -64 16 -74" stroke="${INK}" stroke-width="${(1.1 / .7 / s).toFixed(1)}" fill="none" opacity=".75"/></g>`;
      return SV(`<path d="M146 246 Q142 170 148 112 Q151 86 149 72 L153 72 Q156 88 154 114 Q150 172 156 246Z" fill="#8C5A31" ${IK()}/>`
        + [[153, 180, 112, .8], [148, 172, -108, .85], [153, 146, 82, .92], [147, 140, -78, .92], [153, 112, 52, .85], [147, 108, -48, .85], [151, 86, 28, .7], [149, 82, -8, .72]].map((a) => lf(...a)).join('')) + pot(80); },
    sansevieria: (c) => { const L = 'M-11 0 C-15 -50 -10 -120 0 -165 C10 -120 15 -50 11 0Z';
      const lf = (x, y, r, sx, sy) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${sx} ${sy})"><path d="${L}" fill="${c}" stroke="#E3D35A" stroke-width="7"/>
        ${[[-22, 12], [-46, 13], [-70, 12], [-94, 10], [-118, 7]].map(([yy, w]) => `<path d="M${-w} ${yy} q${w / 2} -6 ${w} 0 t${w} 0" stroke="#A9C98A" stroke-width="3" fill="none" opacity=".75"/>`).join('')}
        <path d="${L}" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/><path d="M2 -6 C6 -60 4 -120 0 -158 L4 -120 C9 -60 10 -30 9 -4Z" fill="url(#hatch)"/></g>`;
      return SV(lf(150, 246, 0, 1.05, 1.12) + lf(136, 246, -13, 1, 1) + lf(164, 246, 12, 1, 1.02) + lf(124, 248, -25, .95, .84) + lf(176, 248, 24, .95, .88) + lf(143, 248, -5, .92, .72) + lf(158, 248, 7, .92, .66)) + pot(72, '#4A504E'); },
    pothos: (c) => { const L = 'M0 0 C-7 -3 -17 0 -17 10 C-17 20 -7 25 0 32 C7 25 17 20 17 10 C17 0 7 -3 0 0Z';
      const lf = (x, y, r, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="${L}" fill="${c}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/><path d="M-2 4 C-8 10 -6 20 0 28 C2 18 4 10 -2 4Z" fill="#EDE27A" opacity=".8"/><path d="M0 0 C7 -3 17 0 17 10 C17 20 7 25 0 32Z" fill="url(#hatch)"/></g>`;
      const vines = ['M106 104 C90 140 96 200 82 260 C78 280 80 292 78 300', 'M194 104 C214 150 204 210 220 270 C224 284 222 294 222 300', 'M132 106 C122 160 136 220 126 288', 'M172 106 C182 150 170 200 184 252'];
      return `<path d="M-70 0 V-232 H-6" stroke="${INK}" stroke-width="7" fill="none" stroke-linejoin="round"/><path d="M-70 0 V-232 H-6" stroke="#4E5A55" stroke-width="3.5" fill="none" stroke-linejoin="round"/><path d="M-6 -232 q6 0 6 6 v4" stroke="${INK}" stroke-width="3" fill="none"/>`
        + SV(`<circle cx="150" cy="10" r="6" fill="none" ${IK()}/><path d="M150 16 L101 100 M150 16 L199 100" stroke="${INK}" stroke-width="2.6"/>`
        + [[118, 102, 140, .9], [132, 98, 160], [168, 98, 200], [182, 102, 220, .9], [150, 97, 180]].map((a) => lf(...a)).join('')
        + `<path d="M100 100 A50 7 0 0 0 200 100 L188 156 Q150 166 112 156Z" fill="#8FB09A" ${IK()}/><path d="M104 104 A46 6 0 0 0 196 104 L186 154 Q170 158 160 158Z" fill="url(#hatch)"/><path d="M150 16 L150 107" stroke="${INK}" stroke-width="2.6"/>`
        + vines.map((d) => `<path d="${d}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#5C8F3E" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('')
        + [[100, 130, 30], [91, 165, -35], [94, 196, 30, 1.05], [86, 230, -30], [81, 262, 25, .95], [222, 272, -25, .95], [205, 136, -30], [209, 170, 35, 1.05], [207, 205, -30], [215, 240, 30], [127, 168, 25, .95], [131, 205, -30], [131, 240, 25, .95], [127, 270, -20, .85], [178, 160, -25, .95], [175, 192, 30], [179, 225, -25, .9]].map((a) => lf(...a)).join('')); },
    orchid: (c) => { const F = (x, y, r, s) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" stroke="${INK}" stroke-width="${(2.2 / .7 / s).toFixed(1)}">
        <ellipse cx="0" cy="-17" rx="9" ry="15" fill="#FBEAF2"/><ellipse cx="0" cy="16" rx="7.5" ry="14" transform="rotate(38)" fill="#FBEAF2"/><ellipse cx="0" cy="16" rx="7.5" ry="14" transform="rotate(-38)" fill="#FBEAF2"/>
        <ellipse cx="-17" cy="-1" rx="16" ry="14" fill="${c}"/><ellipse cx="17" cy="-1" rx="16" ry="14" fill="${c}"/><ellipse cx="17" cy="-1" rx="16" ry="14" fill="url(#hatch)" stroke="none"/>
        <path d="M-7 4 C-11 14 -5 22 0 22 C5 22 11 14 7 4 C4 1 -4 1 -7 4Z" fill="#B8205F"/><circle cx="0" cy="3" r="3" fill="#F2BE2E" stroke-width="1"/></g>`;
      const lf = (x, y, r, sx = 1, sy = 1) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy}) rotate(${r})"><path d="M0 0 C18 -18 58 -22 80 -8 C86 -4 84 6 74 8 C50 13 18 10 0 0Z" fill="#4E8E3E" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M0 0 C30 10 60 10 74 8 C84 6 86 -4 80 -8 C60 4 30 4 0 0Z" fill="url(#hatch)"/><path d="M4 0 Q40 -8 76 -2" stroke="${INK}" stroke-width="1.6" fill="none"/></g>`;
      return SV(`<path d="M156 246 L162 70" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M156 246 L162 70" stroke="#C9A66B" stroke-width="3" stroke-linecap="round"/><path d="M156 244 C158 170 160 104 166 80 C172 58 198 52 220 66 C236 78 246 100 250 122" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M156 244 C158 170 160 104 166 80 C172 58 198 52 220 66 C236 78 246 100 250 122" stroke="#6E8E3A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <ellipse cx="251" cy="128" rx="6" ry="8" fill="#E6EFC8" stroke="${INK}" stroke-width="3"/><ellipse cx="252" cy="142" rx="4.4" ry="6" fill="#E6EFC8" stroke="${INK}" stroke-width="3"/>`
        + F(178, 62, -8, .78) + F(205, 62, 6, .88) + F(228, 82, 14, .9) + F(242, 106, 22, .8))
        + pot(64, '#F3F0E8') + SV(lf(152, 238, -38, .72, .72) + lf(146, 240, -14, -1, 1) + lf(154, 240, -10)
        + `<path d="M128 246 C116 254 112 266 120 274 M176 246 C190 252 194 264 186 272" stroke="${INK}" stroke-width="6.5" fill="none" stroke-linecap="round"/><path d="M128 246 C116 254 112 266 120 274 M176 246 C190 252 194 264 186 272" stroke="#B5C6A8" stroke-width="3.5" fill="none" stroke-linecap="round"/>`); },
    anthurium: (c) => { const L = 'M0 0 C-10 8 -30 6 -34 -10 C-38 -32 -20 -58 0 -80 C20 -58 38 -32 34 -10 C30 6 10 8 0 0Z', S = 'M0 0 C-8 6 -24 4 -28 -8 C-32 -26 -16 -44 0 -56 C16 -44 32 -26 28 -8 C24 4 8 6 0 0Z';
      const lf = (x, y, r, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="${L}" fill="#2F6B3A" stroke="${INK}" stroke-width="${(3 / .7 / s).toFixed(1)}" stroke-linejoin="round"/><path d="M0 0 C10 8 30 6 34 -10 C38 -32 20 -58 0 -80Z" fill="url(#hatch)"/><path d="M0 -2 Q1 -40 0 -76 M0 -4 Q-20 -10 -26 -28 Q-24 -46 -12 -62 M0 -4 Q20 -10 26 -28 Q24 -46 12 -62" stroke="${INK}" stroke-width="${(1.1 / .7 / s).toFixed(1)}" fill="none" opacity=".7"/></g>`;
      const sp = (x, y, r, s) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="${S}" fill="${c}" stroke="${INK}" stroke-width="${(3 / .7 / s).toFixed(1)}" stroke-linejoin="round"/><path d="M0 0 C8 6 24 4 28 -8 C32 -26 16 -44 0 -56Z" fill="url(#hatch)"/><ellipse cx="-11" cy="-26" rx="5" ry="11" transform="rotate(-22 -11 -26)" fill="#fff" opacity=".5"/><path d="M0 -6 Q7 -24 5 -40" stroke="${INK}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M0 -6 Q7 -24 5 -40" stroke="#F3DE93" stroke-width="5" stroke-linecap="round" fill="none"/></g>`;
      const stems = ['M150 246 Q150 190 150 128', 'M146 246 Q124 200 108 154', 'M154 246 Q180 200 194 148', 'M144 246 Q114 230 90 204', 'M156 246 Q186 228 212 200', 'M148 246 Q136 180 126 124', 'M152 246 Q170 170 180 110', 'M152 246 Q158 210 160 168'].map((d) => `<path d="${d}" stroke="${INK}" stroke-width="6.5" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#4E8E3E" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
      return SV(stems) + pot(76, '#E8D9B8') + SV(lf(150, 128, -4, .88) + lf(108, 154, -42) + lf(194, 148, 40) + lf(90, 204, -76, .78) + lf(212, 200, 74, .78) + sp(126, 124, -20, .88) + sp(180, 110, 14, .92) + sp(160, 168, 6, .72)); },
    cactus: (c) => { const body = ['M134 246 L134 92 Q134 64 150 64 Q166 64 166 92 L166 246Z', 'M134 176 L120 176 Q106 176 106 162 L106 120 Q106 104 117 104 Q128 104 128 120 L128 160 L134 160Z', 'M166 156 L182 156 Q196 156 196 142 L196 98 Q196 84 185 84 Q174 84 174 98 L174 140 L166 140Z'];
      const ribs = [[144, 78, 246], [150, 70, 246], [156, 78, 246], [114, 110, 172], [120, 110, 172], [180, 92, 152], [188, 92, 152]];
      const fl = (x, y) => `<g transform="translate(${x} ${y})">${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="0" cy="-5" rx="2.8" ry="5.4" transform="rotate(${a})" fill="#F26C9E" stroke="${INK}" stroke-width="1.4"/>`).join('')}<circle r="2.4" fill="#FFD54A" stroke="${INK}" stroke-width="1"/></g>`;
      return SV(body.map((d) => `<path d="${d}" fill="${c}" ${IK()} stroke-linejoin="round"/>`).join('')
        + `<path d="M158 70 Q166 74 166 92 L166 246 L158 246Z M188 86 Q196 88 196 98 L196 142 Q196 156 182 156 L188 150Z" fill="url(#hatch)"/>`
        + ribs.map(([x, y0, y1]) => `<path d="M${x} ${y0} V${y1}" stroke="${INK}" stroke-width="1.6" opacity=".45"/>` + Array.from({ length: Math.floor((y1 - y0) / 12) }, (_, k) => `<path d="M${x + 3} ${y0 + 6 + k * 12} l-2.5 -2.5 M${x + 3} ${y0 + 6 + k * 12} l2.5 -2.5" stroke="#FFF6D8" stroke-width="1.6" stroke-linecap="round"/>`).join('')).join('')
        + `<ellipse cx="112" cy="214" rx="22" ry="17" fill="#5DAA6A" ${IK()}/><path d="M104 199 Q98 214 104 229 M112 197 V231 M120 199 Q126 214 120 229" stroke="${INK}" stroke-width="1.6" fill="none" opacity=".45"/>${fl(104, 199)}${fl(119, 197)}`) + pot(80); },
    bonsai: (c) => { const g = `<g transform="translate(-105 -212.8) scale(.7)">${[[70, 124, 19], [232, 120, 19], [98, 108, 30], [204, 104, 30], [150, 74, 34], [118, 84, 24], [184, 82, 24], [150, 108, 20]].map(([x, y, r], i) => bush(x, y, r * 1.1, r * .9, 9, .16, i + 3, c)).join('')}</g>`;
      return `<g transform="translate(-105 -212.8) scale(.7)"><rect x="76" y="292" width="20" height="12" rx="2" fill="#4A2F22" ${IK()}/><rect x="204" y="292" width="20" height="12" rx="2" fill="#4A2F22" ${IK()}/>
        <ellipse cx="150" cy="262" rx="96" ry="10" fill="#3B261B" ${IK()}/><ellipse cx="150" cy="263" rx="88" ry="7" fill="#7FAF4A"/>
        ${['M150 156 C140 132 122 120 100 112', 'M150 156 C162 130 180 118 202 108', 'M150 158 C150 132 149 110 150 82', 'M142 170 C120 156 96 140 72 126', 'M160 168 C184 150 206 134 230 122'].map((d) => `<path d="${d}" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#8C5A31" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
        <path d="M112 262 C108 244 120 232 128 222 C134 212 130 196 136 180 C140 168 146 160 150 150 C156 162 158 172 164 182 C170 196 166 212 172 222 C180 232 192 244 188 262Z" fill="#C49A6C" ${IK()}/><path d="M150 150 C156 162 158 172 164 182 C170 196 166 212 172 222 C180 232 192 244 188 262 L160 262 C162 230 156 190 150 150Z" fill="url(#hatch)"/>
        <path d="M118 262 C122 250 130 244 134 236 M182 262 C178 250 170 244 166 236" stroke="${INK}" stroke-width="2" fill="none" opacity=".6"/></g>${g}
        <g transform="translate(-105 -212.8) scale(.7)"><path d="M54 262 A96 10 0 0 0 246 262 L236 294 Q150 304 64 294Z" fill="#7A4E36" ${IK()}/><path d="M150 272 Q200 270 244 264 L236 294 Q190 300 150 302Z" fill="url(#hatch)"/></g>`; },
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
        <text x="0" y="6" text-anchor="middle" class="plant-tag">${esc(p.tag || shortName(p.name))}</text></g>
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
