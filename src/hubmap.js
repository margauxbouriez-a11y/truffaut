/* ============================================================
   PAGE D'ACCUEIL — carte illustrée détaillée et colorée
   ============================================================ */
const HubMap = (() => {
  const K = '#22303A'; // encre de la carte
  const sw = (w = 1.2) => `stroke="${K}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const shadow = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#1E3B2A" opacity=".22"/>`;

  /* ---- motifs ---- */
  const defs = `<defs>
    <linearGradient id="hSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FB6C4"/><stop offset="1" stop-color="#1F8FA8"/></linearGradient>
    <radialGradient id="hIsle" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#9ED36A"/><stop offset=".7" stop-color="#72B84E"/><stop offset="1" stop-color="#4E9A3E"/></radialGradient>
    <linearGradient id="hPond" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6FD0D8"/><stop offset="1" stop-color="#2E9DB5"/></linearGradient>
    <linearGradient id="hGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#DDF4F6" stop-opacity=".95"/><stop offset=".5" stop-color="#A7DCE3" stop-opacity=".8"/><stop offset="1" stop-color="#7CC3CF" stop-opacity=".85"/></linearGradient>
    <linearGradient id="hWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9773E"/><stop offset="1" stop-color="#8A5428"/></linearGradient>
    <linearGradient id="hRoofR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E5583E"/><stop offset="1" stop-color="#B83A2A"/></linearGradient>
    <linearGradient id="hSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE9F2"/></linearGradient>
    <linearGradient id="hPath" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1DDB0"/><stop offset="1" stop-color="#DDBF86"/></linearGradient>
    <pattern id="hCobble" width="14" height="10" patternUnits="userSpaceOnUse"><rect width="14" height="10" fill="url(#hPath)"/><path d="M0 5 h14 M7 0 v5 M0 5 v5 M14 5 v5" stroke="#B9965C" stroke-width=".8"/></pattern>
    <pattern id="hWaves" width="60" height="22" patternUnits="userSpaceOnUse"><path d="M4 14 q8 -7 16 0 t16 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".45"/></pattern>
    <pattern id="hGrass" width="18" height="16" patternUnits="userSpaceOnUse"><path d="M3 12 l2 -5 l2 5 M11 6 l1.5 -4 l1.5 4" stroke="#4E9A3E" stroke-width="1" fill="none" opacity=".55"/></pattern>
    <filter id="hSoft"><feGaussianBlur stdDeviation="1.2"/></filter>
  </defs>`;

  /* ---- éléments ---- */
  const tree = (x, y, s = 1, c = '#3E8F48', fruit = null) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(4, 4, 30, 9)}
    <path d="M-4 0 Q-5 -18 -2 -30 L3 -30 Q5 -18 4 0Z" fill="#7A4A26" ${sw(1.2)}/>
    <path d="${blob(0, -48, 30, 26, 10, .14, Math.round(x))}" fill="${c}" ${sw(1.4)}/><path d="${blob(8, -42, 20, 16, 8, .16, Math.round(y))}" fill="${Deco.shade(c, -0.2)}" opacity=".55"/>
    <path d="${blob(-9, -56, 12, 9, 7, .2, 3)}" fill="${Deco.shade(c, 0.25)}" opacity=".8"/>
    ${[[-14, -52], [-4, -64], [12, -54], [2, -40], [-18, -40]].map(([a, b]) => `<path d="M${a - 4} ${b} q4 -4 8 0" fill="none" stroke="${K}" stroke-width=".7" opacity=".5"/>`).join('')}
    ${fruit ? [[-12, -46], [10, -58], [14, -40], [-4, -36], [-2, -60]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3.2" fill="${fruit}" ${sw(.7)}/><circle cx="${a - 1}" cy="${b - 1}" r=".9" fill="#fff" opacity=".7"/>`).join('') : ''}</g>`;
  const cypress = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(3, 3, 12, 4)}<path d="M0 -70 C14 -50 14 -14 0 0 C-14 -14 -14 -50 0 -70Z" fill="#2E6B3A" ${sw(1.2)}/><path d="M0 -70 C8 -50 8 -14 0 0Z" fill="#22552E" opacity=".6"/></g>`;
  const bush = (x, y, s = 1, c = '#4FA04A', fl = null) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="${blob(0, -10, 18, 12, 8, .2, Math.round(x + y))}" fill="${c}" ${sw(1.1)}/><path d="${blob(5, -7, 11, 7, 7, .2, 2)}" fill="${Deco.shade(c, -0.22)}" opacity=".5"/>${fl ? [[-8, -14], [4, -18], [10, -9], [-2, -8]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.4" fill="${fl}" ${sw(.5)}/>`).join('') : ''}</g>`;
  const fence = (x1, y1, x2, y2, n) => { let g = `<path d="M${x1} ${y1 - 8} L${x2} ${y2 - 8} M${x1} ${y1 - 3} L${x2} ${y2 - 3}" stroke="#F4EBD9" stroke-width="2.6"/><path d="M${x1} ${y1 - 8} L${x2} ${y2 - 8} M${x1} ${y1 - 3} L${x2} ${y2 - 3}" stroke="${K}" stroke-width=".5" opacity=".6"/>`;
    for (let i = 0; i <= n; i++) { const t = i / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; g += `<path d="M${x - 1.6} ${y} v-12 l1.6 -2.4 l1.6 2.4 v12z" fill="#FBF5E8" ${sw(.6)}/>`; } return g; };
  const tulipRow = (x, y, len, c, ang = 0) => `<g transform="translate(${x} ${y}) rotate(${ang})"><rect x="0" y="-5" width="${len}" height="10" rx="5" fill="#5DA548"/>${Array.from({ length: Math.floor(len / 9) }, (_, i) => `<path d="M${5 + i * 9} -1 q-3 -5 0 -7 q3 2 0 7 q3 -5 6 -1 q-3 4 -6 1z" fill="${c}" stroke="${Deco.shade(c, -0.35)}" stroke-width=".5"/>`).join('')}</g>`;
  const bannerSign = (x, y, label, c) => { const w = label.length * 11 + 34; return `<g class="hsign" transform="translate(${x} ${y})">
    <path d="M${-w / 2 - 14} 2 l14 -12 v24z M${w / 2 + 14} 2 l-14 -12 v24z" fill="${Deco.shade(c, -0.3)}" ${sw(1.1)}/>
    <rect x="${-w / 2}" y="-14" width="${w}" height="30" rx="3" fill="${c}" ${sw(1.3)}/><path d="M${-w / 2 + 4} -10 h${w - 8}" stroke="#fff" stroke-width="1" opacity=".5"/>
    <text x="0" y="7" text-anchor="middle">${label}</text></g>`; };

  /* ---- les six lieux ---- */
  const potager = () => {
    // planche de culture allongée, vue de trois-quarts
    const bed = (x, y, w, crop, seed) => {
      let g = `${shadow(x + w / 2, y + 26, w / 2 + 8, 6)}<path d="M${x + 8} ${y} H${x + w + 8} L${x + w} ${y + 24} H${x} Z" fill="#6B4022" ${sw(1.1)}/>
        <path d="M${x} ${y + 24} H${x + w} V${y + 30} H${x} Z" fill="#8A5428" ${sw(1)}/><path d="M${x + w} ${y + 24} L${x + w + 8} ${y} V${y + 6} L${x + w} ${y + 30} Z" fill="#6B3A1E" ${sw(1)}/>
        ${[0.33, 0.66].map((t) => `<path d="M${x + 8 - 8 * t} ${y + 24 * t} H${x + w + 8 - 8 * t}" stroke="#4E2E16" stroke-width=".8" opacity=".6"/>`).join('')}`;
      const n = Math.floor(w / 22);
      for (let i = 0; i < n; i++) {
        const cx = x + 16 + i * (w - 20) / n, cy = y + 14;
        if (crop === 'tomato' && i % 2 === 0) g += `<path d="M${cx - 8} ${cy + 6} L${cx} ${cy - 34} L${cx + 8} ${cy + 6} M${cx} ${cy - 34} l-2 -4 M${cx} ${cy - 34} l2 -4" stroke="#C9A06A" stroke-width="1.4" fill="none"/>
          ${[[-6, -8], [5, -14], [-3, -22], [4, -26], [0, -2]].map(([dx, dy], k) => `<path d="M${cx + dx} ${cy + dy} q${dx > 0 ? 7 : -7} -3 ${dx > 0 ? 10 : -10} 2 q-4 4 -10 -2z" fill="${k % 2 ? '#3E8F48' : '#4FA04A'}" ${sw(.4)}/>`).join('')}
          ${[[-4, -12], [5, -5], [-1, -20], [6, -18]].map(([dx, dy]) => `<circle cx="${cx + dx}" cy="${cy + dy}" r="3" fill="#E33B26" ${sw(.4)}/><circle cx="${cx + dx - 1}" cy="${cy + dy - 1}" r=".8" fill="#fff" opacity=".8"/>`).join('')}`;
        if (crop === 'tomato' && i % 2 === 1) g += `<path d="${blob(cx, cy, 7, 5, 7, .3, i)}" fill="#7DC27A" ${sw(.5)}/>${[[-3, -1], [3, 1]].map(([dx, dy]) => `<circle cx="${cx + dx}" cy="${cy + dy}" r="1.6" fill="#E8432E"/>`).join('')}`;
        if (crop === 'salad') { const red = (i + seed) % 3 === 0; g += Array.from({ length: 7 }, (_, k) => `<path d="M${cx} ${cy + 3} q${Math.cos(k * .9) * 10} ${-6 + Math.sin(k * .9) * 4} ${Math.cos(k * .9) * 8} ${-10 + Math.sin(k * .9) * 3} q-4 2 ${(-Math.cos(k * .9) * 8).toFixed(2)} ${(10 - Math.sin(k * .9) * 3).toFixed(2)}z" fill="${red ? (k % 2 ? '#B8344A' : '#D45468') : (k % 2 ? '#8CCB5E' : '#B2DD7A')}" ${sw(.35)}/>`).join('') + `<circle cx="${cx}" cy="${cy - 3}" r="3.4" fill="${red ? '#E07A8A' : '#D4EE9E'}" ${sw(.35)}/>`; }
        if (crop === 'carrot') g += `<path d="M${cx} ${cy + 4} q-6 -10 -9 -18 M${cx} ${cy + 4} q0 -12 -1 -20 M${cx} ${cy + 4} q6 -10 9 -17" stroke="#4E9A3E" stroke-width="1" fill="none"/>${[-8, -1, 8].map((dx) => Array.from({ length: 4 }, (_, k) => `<circle cx="${cx + dx * (0.4 + k * .18)}" cy="${cy - 2 - k * 4}" r="1.7" fill="#5DA548"/>`).join('')).join('')}<path d="M${cx - 2.4} ${cy + 3} q2.4 -2 4.8 0 l-2.4 6z" fill="#F28C28" ${sw(.4)}/>`;
        if (crop === 'pumpkin') g += `<path d="M${cx - 10} ${cy + 4} q8 -10 20 -4 q6 4 14 -2" stroke="#4E9A3E" stroke-width="1.2" fill="none"/>${i % 2 ? `<path d="M${cx} ${cy} c-8 -10 6 -14 8 -6 c6 -8 14 0 6 6z" fill="#4FA04A" ${sw(.5)}/>` : `<ellipse cx="${cx}" cy="${cy + 1}" rx="9" ry="6.5" fill="#F29A2E" ${sw(.6)}/>${[-5, 0, 5].map((dx) => `<path d="M${cx + dx} ${cy - 5} q${dx * .3} 6 0 12" stroke="#C26A1A" stroke-width=".7" fill="none"/>`).join('')}<path d="M${cx} ${cy - 5} l1 -4" stroke="#5E3B1E" stroke-width="1.6"/>`}`;
      }
      return `<g>${g}</g>`;
    };
    const sunflower = (x, y, h) => `<g transform="translate(${x} ${y})"><path d="M0 0 Q2 ${-h / 2} 0 ${-h}" stroke="#4E8A3E" stroke-width="2"/>${[-.35, -.65].map((t, k) => `<path d="M0 ${h * t} q${k ? 10 : -10} -4 ${k ? 12 : -12} 2 q-6 4 -12 -2z" fill="#4FA04A" ${sw(.4)}/>`).join('')}
      ${Array.from({ length: 12 }, (_, k) => `<ellipse cx="0" cy="${-h - 7}" rx="2.2" ry="5" fill="#F6C43A" ${sw(.35)} transform="rotate(${k * 30} 0 ${-h})"/>`).join('')}<circle cy="${-h}" r="4.6" fill="#6B3A1E" ${sw(.5)}/><circle cy="${-h}" r="4.6" fill="url(#dots)"/></g>`;
    const beans = (x, y) => `<g transform="translate(${x} ${y})">${shadow(0, 2, 18, 4)}<path d="M-14 0 L0 -54 L14 0 M-4 0 L0 -54 L4 0" stroke="#C9A06A" stroke-width="1.6" fill="none"/>${Array.from({ length: 14 }, (_, k) => { const t = k / 14, side = k % 2 ? 1 : -1; return `<path d="M${side * 14 * (1 - t)} ${-54 * t} q${side * 6} -3 ${side * 7} 3 q-4 3 ${-side * 7} -3z" fill="${k % 3 ? '#4FA04A' : '#6DB35A'}" ${sw(.35)}/>`; }).join('')}
      ${[[-6, -16], [5, -26], [-3, -36]].map(([a, b2]) => `<path d="M${a} ${b2} q1 6 0 9" stroke="#2F7A3A" stroke-width="1.6"/>`).join('')}</g>`;
    return `<g class="bob">
      
      ${fence(178, 192, 562, 192, 30)}
      ${[200, 232, 268, 300, 332, 370, 404].map((x, i) => sunflower(x, 196, 34 + (i % 3) * 8)).join('')}
      ${[0, 1, 2, 3].map((k) => `<path d="M${196 - k * 4} ${248 + k * 50} H${548 + k * 4}" stroke="#E9D59A" stroke-width="10" opacity=".9"/><path d="M${196 - k * 4} ${248 + k * 50} H${548 + k * 4}" stroke="#D9BE84" stroke-width="10" stroke-dasharray="3 6" opacity=".6"/>`).join('')}
      ${bed(206, 214, 300, 'tomato', 1)}${bed(200, 264, 312, 'salad', 2)}${bed(194, 314, 324, 'carrot', 3)}${bed(188, 364, 336, 'pumpkin', 4)}
      ${beans(540, 250)}${beans(548, 300)}
      ${shadow(560, 420, 16, 5)}<g transform="translate(590 330)"><path d="M0 0 V-58 M-20 -42 H20" stroke="#7A4A26" stroke-width="2.6"/><path d="M-8 -42 L-10 -12 L10 -12 L8 -42Z" fill="#3E6FB3" ${sw(.8)}/><path d="M-8 -42 L8 -42 L4 -30 L-4 -30Z" fill="#E8432E" ${sw(.6)}/>
        <path d="M-20 -42 q-6 4 -4 10 M20 -42 q6 4 4 10" stroke="#E2C27A" stroke-width="2"/><circle cy="-52" r="8" fill="#F0DDB0" ${sw(.8)}/><path d="M-12 -56 h24 l-5 -8 h-14z" fill="#C99A3E" ${sw(.8)}/><path d="M-4 -53 l2 2 M2 -53 l2 2 M-3 -48 q3 2 6 0" stroke="${K}" stroke-width=".7"/>
        <g transform="translate(16 -46)"><path d="M0 0 c7 -7 16 -3 13 4 l-5 1 l-3 4z" fill="#1F2A30" ${sw(.5)}/><circle cx="8" cy="0" r="1" fill="#fff"/></g></g>
      <g transform="translate(150 290)">${shadow(28, 4, 40, 7)}<rect x="0" y="-56" width="56" height="56" fill="#6E8B6A" ${sw(1.1)}/>${Array.from({ length: 7 }, (_, k) => `<path d="M${k * 8} -56 v56" stroke="${K}" stroke-width=".5" opacity=".5"/>`).join('')}
        <path d="M-6 -54 L28 -78 L62 -54Z" fill="#8A5428" ${sw(1.1)}/><rect x="18" y="-36" width="20" height="36" fill="#4E6A4A" ${sw(.7)}/><circle cx="34" cy="-18" r="1.4" fill="#E8B23A"/><rect x="4" y="-46" width="12" height="10" fill="#BFE6EE" ${sw(.5)}/>
        <path d="M58 -40 l14 30 M62 -40 l4 30" stroke="#7A4A26" stroke-width="1.6"/><path d="M68 -14 h8 l-2 6 h-6z" fill="#9AA6AE" ${sw(.5)}/></g>
      <g transform="translate(560 452)">${shadow(10, 8, 24, 5)}<path d="M-14 -6 h36 l-6 14 h-24z" fill="#9AA6AE" ${sw(.9)}/><circle cx="-10" cy="10" r="5" fill="#2A2A2A"/><path d="M22 -6 l18 -8" stroke="#7A4A26" stroke-width="2.4"/>${[[-4, -10, '#F29A2E'], [6, -12, '#7DC27A'], [14, -9, '#E8432E']].map(([a2, b2, cc]) => `<circle cx="${a2}" cy="${b2}" r="5" fill="${cc}" ${sw(.5)}/>`).join('')}</g>
      <g transform="translate(176 420) rotate(-8)"><path d="M0 0 h26 l-4 14 h-18z" fill="#3E9FCF" ${sw(.9)}/><path d="M26 4 l14 -10 l2 3 l-14 12" fill="#3E9FCF" ${sw(.9)}/><path d="M4 0 q9 -14 18 0" fill="none" ${sw(.9)}/></g>
      <g transform="translate(520 470)"><rect x="-22" y="-26" width="44" height="26" fill="#8A5428" ${sw(.9)}/>${[0, 1, 2].map((k) => `<path d="M-22 ${-26 + k * 9} h44" stroke="#6B3A1E" stroke-width="1"/>`).join('')}<path d="${blob(0, -28, 18, 6, 8, .4, 4)}" fill="#6B4022" ${sw(.5)}/></g></g>`;
  };

  const serre = () => {
    const x = 1060, y = 330;
    let ribs = '';
    for (let i = 0; i <= 12; i++) ribs += `<path d="M${x + i * 26} ${y} V${y - 88}" stroke="#F4F7F7" stroke-width="2.2"/><path d="M${x + i * 26} ${y} V${y - 88}" stroke="${K}" stroke-width=".5"/>`;
    for (let j = 1; j < 4; j++) ribs += `<path d="M${x} ${y - j * 22} H${x + 312}" stroke="#F4F7F7" stroke-width="1.6"/>`;
    let dome = '';
    for (let i = -5; i <= 5; i++) dome += `<path d="M${x + 156} ${y - 190} Q${x + 156 + i * 16} ${y - 150} ${x + 156 + i * 14} ${y - 88}" stroke="#F4F7F7" stroke-width="1.8" fill="none"/>`;
    const plants = [[x + 30, '#2F8A4A'], [x + 70, '#3FA05A'], [x + 120, '#2E7A44'], [x + 200, '#3FA05A'], [x + 250, '#2F8A4A'], [x + 290, '#45A85C']].map(([px, c], i) => `<path d="M${px} ${y - 4} q-14 -30 -4 -${50 + (i % 3) * 14} M${px} ${y - 4} q12 -26 18 -${40 + (i % 2) * 18} M${px} ${y - 4} q-2 -30 2 -${60 + (i % 2) * 10}" stroke="${c}" stroke-width="5" fill="none" opacity=".75" stroke-linecap="round"/>`).join('')
      + `<path d="M${x + 156} ${y - 4} C${x + 150} ${y - 80} ${x + 160} ${y - 130} ${x + 156} ${y - 160}" stroke="#7A4A26" stroke-width="4"/>${[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => `<path d="M${x + 156} ${y - 160} q${Math.cos(a / 57) * 30} ${-10 + Math.sin(a / 57) * 16} ${Math.cos(a / 57) * 46} ${Math.sin(a / 57) * 24}" stroke="#2F8A4A" stroke-width="5" fill="none" opacity=".8" stroke-linecap="round"/>`).join('')}`;
    return `<g class="bob">${shadow(x + 156, y + 6, 180, 14)}
      ${plants}
      <path d="M${x} ${y} V${y - 88} H${x + 312} V${y}Z" fill="url(#hGlass)" ${sw(1.6)}/>
      <path d="M${x + 96} ${y - 88} Q${x + 96} ${y - 170} ${x + 156} ${y - 196} Q${x + 216} ${y - 170} ${x + 216} ${y - 88}Z" fill="url(#hGlass)" ${sw(1.6)}/>
      ${ribs}${dome}
      <path d="M${x + 20} ${y - 80} l30 30 M${x + 40} ${y - 80} l18 18 M${x + 230} ${y - 80} l30 30 M${x + 118} ${y - 150} l30 30" stroke="#fff" stroke-width="3" opacity=".7"/>
      ${[0, 1].map((r) => `<path d="M${x + 14} ${y - 16 - r * 26} H${x + 128} M${x + 186} ${y - 16 - r * 26} H${x + 298}" stroke="#8A5428" stroke-width="3"/>` + Array.from({ length: 9 }, (_, k) => `<path d="M${x + 18 + k * 12 + (k > 8 ? 60 : 0)} ${y - 18 - r * 26} l2 -7 h6 l2 7z" fill="#C8693E" opacity=".85"/><circle cx="${x + 23 + k * 12}" cy="${y - 28 - r * 26}" r="3.4" fill="${['#E8432E', '#F6D04A', '#F2A0C0', '#7DC27A'][(k + r) % 4]}" opacity=".85"/>` + `<path d="M${x + 190 + k * 12} ${y - 18 - r * 26} l2 -7 h6 l2 7z" fill="#C8693E" opacity=".85"/><circle cx="${x + 195 + k * 12}" cy="${y - 28 - r * 26}" r="3.4" fill="${['#B279D6', '#FFFFFF', '#F28C28', '#7DC27A'][(k + r) % 4]}" opacity=".85"/>`).join('')).join('')}
      <path d="M${x - 6} ${y - 88} H${x + 318}" stroke="#2F6B5A" stroke-width="4"/>${Array.from({ length: 24 }, (_, k) => `<circle cx="${x + k * 13}" cy="${y - 93}" r="3" fill="none" stroke="#2F6B5A" stroke-width="1.4"/>`).join('')}
      ${[x - 6, x + 318].map((px) => `<path d="M${px} ${y - 90} v-10" stroke="#2F6B5A" stroke-width="2"/><circle cx="${px}" cy="${y - 102}" r="3.2" fill="#E8B23A" ${sw(.6)}/>`).join('')}
      ${[x + 60, x + 252].map((px) => `<path d="M${px} ${y - 86} v14" stroke="${K}" stroke-width=".8"/><path d="M${px - 9} ${y - 72} q9 10 18 0z" fill="#8A5428" ${sw(.6)}/>${[-6, 0, 6].map((dx, k) => `<path d="M${px + dx} ${y - 70} q${dx * .6} 10 ${dx} 16" stroke="#3E8F48" stroke-width="1.4" fill="none"/><circle cx="${px + dx * 1.3}" cy="${y - 54}" r="2.6" fill="${['#F2A0C0', '#E8432E', '#B279D6'][k]}"/>`).join('')}`).join('')}<path d="M${x + 150} ${y - 196} v-14" ${sw(2)}/><circle cx="${x + 156}" cy="${y - 212}" r="5" fill="#E8B23A" ${sw(1)}/>
      <path d="M${x + 136} ${y} v-46 a20 20 0 0 1 40 0 v46" fill="#2F6B5A" ${sw(1.4)}/><path d="M${x + 156} ${y} v-66" stroke="#F4F7F7" stroke-width="1.6"/>
      ${[x - 18, x + 330].map((px, i) => `<g transform="translate(${px} ${y + 4})"><path d="M-10 0 h20 l-3 -16 h-14z" fill="#C8693E" ${sw(1)}/>${bush(0, -14, .9, '#3E8F48', i ? '#F2A0C0' : '#F6D04A')}</g>`).join('')}
      ${[0, 1, 2, 3, 4].map((k) => `<g transform="translate(${x + 30 + k * 64} ${y + 14})"><path d="M-8 0 h16 l-2 -10 h-12z" fill="#C8693E" ${sw(.8)}/><circle cx="-3" cy="-13" r="4" fill="${['#E8432E', '#F6D04A', '#B279D6', '#F2A0C0', '#FFFFFF'][k]}" ${sw(.6)}/><circle cx="4" cy="-14" r="3.6" fill="${['#F2A0C0', '#E8432E', '#FFFFFF', '#F6D04A', '#B279D6'][k]}" ${sw(.6)}/></g>`).join('')}</g>`;
  };

  const atelier = () => {
    const x = 230, y = 820;
    return `<g class="bob">${shadow(x + 110, y + 4, 150, 12)}
      <rect x="${x}" y="${y - 120}" width="220" height="120" fill="#F7E4D0" ${sw(1.5)}/>
      ${Array.from({ length: 8 }, (_, r) => `<path d="M${x} ${y - 120 + r * 15} h220" stroke="#E2C6A8" stroke-width="1"/>`).join('')}
      <path d="M${x - 16} ${y - 118} L${x + 110} ${y - 196} L${x + 236} ${y - 118}Z" fill="url(#hRoofR)" ${sw(1.5)}/>
      ${Array.from({ length: 5 }, (_, k) => { const yy = y - 128 - k * 14, half = 120 - k * 22; return `<path d="M${x + 110 - half} ${yy} h${half * 2}" stroke="#8E2A1E" stroke-width="1" opacity=".6"/>`; }).join('')}
      <rect x="${x + 150}" y="${y - 200}" width="22" height="40" fill="#C99A7A" ${sw(1.2)}/><path d="M${x + 160} ${y - 206} q-10 -12 0 -22 q10 -10 0 -20" stroke="#fff" stroke-width="4" fill="none" opacity=".75"/>
      <path d="M${x + 20} ${y - 70} h180 l14 22 h-208z" fill="#fff" ${sw(1.2)}/>${Array.from({ length: 9 }, (_, k) => `<path d="M${x + 20 + k * 20} ${y - 70} h10 l2 22 h-10z" fill="#E86A8A"/>`).join('')}
      ${Array.from({ length: 11 }, (_, k) => `<path d="M${x + 6 + k * 19} ${y - 48} a9.5 9.5 0 0 0 19 0" fill="${k % 2 ? '#fff' : '#E86A8A'}" ${sw(.8)}/>`).join('')}
      <rect x="${x + 86}" y="${y - 44}" width="48" height="44" fill="#3E6F5A" ${sw(1.3)}/><rect x="${x + 92}" y="${y - 38}" width="36" height="22" fill="#FFE3A0" ${sw(.8)}/><path d="M${x + 110} ${y - 38} v22" stroke="${K}" stroke-width=".8"/>
      ${[x + 22, x + 160].map((wx) => `<rect x="${wx}" y="${y - 108}" width="38" height="30" fill="#BFE6EE" ${sw(1.1)}/><path d="M${wx + 19} ${y - 108} v30 M${wx} ${y - 93} h38" stroke="${K}" stroke-width=".8"/><path d="M${wx + 4} ${y - 104} l10 10" stroke="#fff" stroke-width="2" opacity=".7"/>
        <rect x="${wx - 4}" y="${y - 78}" width="46" height="9" fill="#8A5428" ${sw(.8)}/>${[0, 1, 2, 3, 4].map((k) => `<circle cx="${wx + 2 + k * 9}" cy="${y - 80}" r="4" fill="${['#E8432E', '#F6D04A', '#F2A0C0', '#B279D6', '#FFFFFF'][k]}" ${sw(.5)}/>`).join('')}`).join('')}
      ${[[x + 4, y - 120], [x + 4, y - 100], [x + 10, y - 80], [x + 4, y - 60], [x + 214, y - 110], [x + 216, y - 86], [x + 212, y - 64]].map(([a, b], k) => Deco.leaf(a, b, 12, k * 70, '#3E8F48') + `<circle cx="${a}" cy="${b}" r="4" fill="${k % 2 ? '#E8432E' : '#F2A0C0'}" ${sw(.6)}/>`).join('')}
      <g transform="translate(${x + 252} ${y - 2})">${shadow(0, 2, 26, 4)}<circle cx="-16" cy="-10" r="10" fill="none" ${sw(1.4)}/><circle cx="16" cy="-10" r="10" fill="none" ${sw(1.4)}/><path d="M-16 -10 L-4 -26 L10 -26 L16 -10 M-4 -26 L0 -10 L10 -26 M-8 -30 h8 M10 -26 l-2 -6 h6" fill="none" stroke="#3E6FB3" stroke-width="2"/>
        <path d="M6 -40 h18 l-3 10 h-12z" fill="#C99A5A" ${sw(.8)}/>${[0, 1, 2, 3].map((k) => `<circle cx="${9 + k * 4}" cy="${-42 - (k % 2) * 3}" r="3.2" fill="${['#E8432E', '#F6D04A', '#F2A0C0', '#FFFFFF'][k]}" ${sw(.4)}/>`).join('')}</g>
      <g transform="translate(${x - 34} ${y - 2})"><path d="M-12 0 l6 -40 h12 l6 40 M-6 -20 h12" stroke="#8A5428" stroke-width="2" fill="none"/><rect x="-14" y="-40" width="28" height="22" fill="#22303A" ${sw(1)}/><text x="0" y="-31" text-anchor="middle" class="hchalk">Bouquet</text><text x="0" y="-23" text-anchor="middle" class="hchalk">du jour</text></g>
      ${[x + 30, x + 190].map((lx) => `<path d="M${lx} ${y - 70} v8" stroke="${K}" stroke-width=".8"/><rect x="${lx - 4}" y="${y - 62}" width="8" height="10" rx="2" fill="#FFE59A" ${sw(.6)}/>`).join('')}
      <rect x="${x + 70}" y="${y - 160}" width="80" height="18" rx="2" fill="#2F6B5A" ${sw(1)}/><text x="${x + 110}" y="${y - 147}" text-anchor="middle" class="hsmall">FLEURS</text>
      ${[0, 1, 2, 3, 4, 5].map((k) => { const bx = x - 70 + k * 24 + (k > 2 ? 290 : 0), by = y + 8; const cols = [['#E8432E', '#F6D04A'], ['#F2A0C0', '#FFFFFF'], ['#B279D6', '#F2A0C0'], ['#F6D04A', '#E8432E'], ['#FFFFFF', '#B279D6'], ['#F28C28', '#F6D04A']][k];
        return `<g>${shadow(bx, by, 11, 3)}<path d="M${bx - 9} ${by} l2 -18 h14 l2 18z" fill="#A7B4BA" ${sw(.9)}/>${[-5, 0, 5].map((dx, j) => `<path d="M${bx + dx} ${by - 18} v-12" stroke="#3E8F48" stroke-width="1.2"/><circle cx="${bx + dx}" cy="${by - 32 + (j % 2) * 3}" r="4.6" fill="${cols[j % 2]}" ${sw(.6)}/>`).join('')}</g>`; }).join('')}</g>`;
  };

  const noel = () => {
    const snowRoof = (x1, y1, px, py, x2) => `<path d="M${x1 - 4} ${y1 + 1} L${px} ${py - 5} L${x2 + 4} ${y1 + 1} q-4 6 -8 2 q-4 6 -8 1 q-${(x2 - x1) * .2} -${(y1 - py) * .3} -${(x2 - px) - 6} -${(y1 - py) * .55} q-${(px - x1) * .4} ${(y1 - py) * .25} -${px - x1 - 4} ${(y1 - py) * .55} q-4 5 -8 0z" fill="url(#hSnow)" ${sw(.8)}/>
      ${Array.from({ length: Math.floor((x2 - x1) / 7) }, (_, k) => `<path d="M${x1 + 3 + k * 7} ${y1 + 2} l1 ${3 + (k % 3)} l1 ${-(3 + (k % 3))}" fill="#E8F4FA" ${sw(.3)}/>`).join('')}`;
    const win = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFC94A" ${sw(.6)}/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFE9A8" opacity=".6"/><path d="M${x + w / 2} ${y} v${h} M${x} ${y + h / 2} h${w}" stroke="#6B3A22" stroke-width=".6"/><path d="M${x - 1} ${y + h + 1} h${w + 2}" stroke="#fff" stroke-width="1.6"/>`;
    const garland = (x1, y1, x2, y2, n) => { const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + 8; let g = `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" stroke="#2F5A3A" stroke-width=".8" fill="none"/>`; for (let i = 1; i < n; i++) { const t = i / n, x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2; g += `<circle cx="${x.toFixed(1)}" cy="${(y + 1.6).toFixed(1)}" r="1.5" fill="${['#E8432E', '#F6D04A', '#3FB6C4', '#7DC27A'][i % 4]}" class="hbulb" style="animation-delay:${(i % 4) * .3}s"/>`; } return g; };
    const tudor = (x, y, w, h, wall, roof, sign) => { const py = y - h - w * .55;
      return `<g>${shadow(x + w / 2, y + 2, w * .66, 4)}<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${wall}" ${sw(1)}/>
      <rect x="${x}" y="${y - h * .38}" width="${w}" height="${h * .38}" fill="#B9A58A" ${sw(.8)}/>${Array.from({ length: 3 }, (_, r) => `<path d="M${x} ${y - h * .38 + r * h * .13} h${w}" stroke="${K}" stroke-width=".35" opacity=".5"/>`).join('')}
      <path d="M${x} ${y - h * .38} h${w} M${x + w * .25} ${y - h} v${h * .62} M${x + w * .5} ${y - h} v${h * .62} M${x + w * .75} ${y - h} v${h * .62} M${x} ${y - h * .38} l${w * .25} ${-h * .3} l${w * .25} ${h * .3} l${w * .25} ${-h * .3} l${w * .25} ${h * .3}" stroke="#4A2E1A" stroke-width="1.3" fill="none"/>
      <rect x="${x + w * .66}" y="${y - h}" width="${w * .34}" height="${h}" fill="url(#hatch)" opacity=".45"/>
      <rect x="${x + w * .68}" y="${py + 4}" width="${w * .12}" height="${h * .55}" fill="#9A6A4A" ${sw(.7)}/><path class="smoke" d="M${x + w * .74} ${py} q-5 -7 0 -13 q5 -6 0 -12" stroke="#fff" stroke-width="2.6" fill="none" opacity=".8" stroke-linecap="round"/>
      <path d="M${x - 3} ${y - h + 1} L${x + w / 2} ${py} L${x + w + 3} ${y - h + 1}Z" fill="${roof}" ${sw(1)}/>${Array.from({ length: 3 }, (_, k) => { const yy = y - h - (y - h - py) * ((k + 1) / 4), half = (w / 2 + 3) * (1 - (k + 1) / 4); return `<path d="M${x + w / 2 - half} ${yy} h${half * 2}" stroke="${K}" stroke-width=".4" opacity=".45"/>`; }).join('')}
      ${snowRoof(x, y - h, x + w / 2, py, x + w)}
      ${win(x + w * .12, y - h * .88, w * .2, h * .28)}${win(x + w * .58, y - h * .88, w * .2, h * .28)}
      <path d="M${x + w * .4} ${y} v${-h * .3} a${w * .1} ${w * .1} 0 0 1 ${w * .2} 0 v${h * .3}z" fill="#5E3B22" ${sw(.7)}/><circle cx="${x + w * .5}" cy="${y - h * .26}" r="${w * .045}" fill="none" stroke="#2F7A44" stroke-width="1.4"/>
      ${Array.from({ length: 6 }, (_, k) => `<circle cx="${x + 2 + k * (w - 4) / 5}" cy="${y - h + 3}" r="1.3" fill="${['#E8432E', '#F6D04A', '#3FB6C4'][k % 3]}" class="hbulb" style="animation-delay:${k * .2}s"/>`).join('')}
      ${sign ? `<rect x="${x + w * .12}" y="${y - h * .5}" width="${w * .76}" height="7" fill="#2F5A3A" ${sw(.5)}/><text x="${x + w / 2}" y="${y - h * .5 + 5.6}" text-anchor="middle" class="hsign2">${sign}</text>` : ''}</g>`; };
    const fir = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(2, 2, 14, 4)}<rect x="-2.4" y="-4" width="4.8" height="6" fill="#6B4528"/>
      ${[[0, 22, 26], [-16, 17, 22], [-30, 12, 20]].map(([yy, w, h]) => `<path d="M${-w} ${yy} L0 ${yy - h} L${w} ${yy}Z" fill="#245F38" ${sw(.8)}/><path d="M0 ${yy - h} L${w} ${yy} L${w * .2} ${yy}Z" fill="#1B4A2C" opacity=".7"/><path d="M${-w * .9} ${yy - 1} q${w * .45} -5 ${w * .9} -1 q${w * .45} -5 ${w * .9} 1 l0 2 q-${w * .9} 3 -${w * 1.8} 0z" fill="#fff" ${sw(.4)}/>`).join('')}</g>`;
    const tree = (x, y) => `<g transform="translate(${x} ${y})">${shadow(0, 2, 24, 6)}<rect x="-3" y="-6" width="6" height="8" fill="#6B4528"/>
      ${[[0, 30, 34], [-22, 24, 28], [-42, 18, 24], [-60, 12, 20]].map(([yy, w, h]) => `<path d="M${-w} ${yy} L0 ${yy - h} L${w} ${yy}Z" fill="#2B6A3C" ${sw(.8)}/><path d="M${-w * .9} ${yy - 1} q${w * .45} -5 ${w * .9} -1 q${w * .45} -5 ${w * .9} 1 l0 2 q-${w * .9} 3 -${w * 1.8} 0z" fill="#fff" ${sw(.4)}/>`).join('')}
      ${garland(-24, -6, 22, -14, 8)}${garland(-16, -30, 15, -36, 6)}${garland(-10, -50, 9, -54, 5)}
      ${[[-12, -18, '#E8432E'], [10, -24, '#F6D04A'], [-4, -40, '#3FB6C4'], [6, -58, '#E8432E'], [-18, -4, '#F6D04A'], [16, -6, '#3FB6C4']].map(([a2, b2, c]) => `<circle cx="${a2}" cy="${b2}" r="2.6" fill="${c}" ${sw(.4)}/><circle cx="${a2 - .8}" cy="${b2 - .8}" r=".7" fill="#fff"/>`).join('')}
      <path d="M0 -82 l2.6 5 h5.4 l-4.4 3.4 l1.8 5.4 l-5.4 -3.4 l-5.4 3.4 l1.8 -5.4 l-4.4 -3.4 h5.4z" fill="#F6D04A" ${sw(.5)}/><circle cy="-76" r="10" fill="#FFE59A" opacity=".35"/>
      ${[[-20, 4, '#C8243C'], [-6, 6, '#3E6FB3'], [12, 5, '#7DC27A']].map(([a2, b2, c]) => `<rect x="${a2}" y="${b2 - 8}" width="10" height="8" fill="${c}" ${sw(.5)}/><path d="M${a2 + 5} ${b2 - 8} v8 M${a2} ${b2 - 4} h10" stroke="#F6D04A" stroke-width="1"/>`).join('')}</g>`;
    const stall = (x, y, c) => `<g transform="translate(${x} ${y})">${shadow(0, 2, 18, 4)}<rect x="-15" y="-16" width="30" height="16" fill="#B9773E" ${sw(.7)}/><rect x="-13" y="-14" width="26" height="6" fill="#FFE3A0"/><path d="M-18 -16 l4 -9 h28 l4 9z" fill="${c}" ${sw(.7)}/>${[-12, -4, 4, 12].map((dx) => `<path d="M${dx - 4} -16 a4 4 0 0 0 8 0" fill="#fff" ${sw(.4)}/>`).join('')}<path d="M-18 -26 q18 -6 36 0 l-2 2 q-16 -4 -32 0z" fill="#fff" ${sw(.4)}/></g>`;
    const kid = (x, y, c, h) => `<g transform="translate(${x} ${y})"><path d="M-1.6 0 v-4 M1.6 0 v-4" stroke="#2A2A2A" stroke-width="1.3"/><path d="M-3.4 -4 q0 -8 3.4 -9 q3.4 1 3.4 9z" fill="${c}" ${sw(.4)}/><circle cy="-15.5" r="2.6" fill="#F0C9A8" ${sw(.4)}/><path d="M-3 -16 q3 -4 6 0z" fill="${h}"/><circle cy="-19" r="1.2" fill="#fff"/></g>`;
    return `<g class="bob"><path d="${blob(1232, 770, 228, 132, 13, .1, 9)}" fill="url(#hSnow)" ${sw(1.4)}/><path d="${blob(1232, 770, 228, 132, 13, .1, 9)}" fill="url(#dots)" opacity=".25"/>
      ${Array.from({ length: 40 }, (_, i) => `<circle cx="${1010 + (i * 53) % 480}" cy="${650 + (i * 31) % 240}" r="1.1" fill="#BFD6EA"/>`).join('')}
      <path d="M1100 690 q60 -40 130 -20 q60 -40 140 -10 q40 10 70 40" fill="#EEF5FA" ${sw(.8)}/>
      ${fir(1060, 720, .7)}${fir(1090, 700, .55)}${fir(1420, 724, .7)}${fir(1398, 700, .55)}
      <g>${shadow(1150, 716, 30, 5)}<rect x="1126" y="664" width="48" height="52" fill="#EDE3D2" ${sw(1)}/><path d="M1120 666 L1150 636 L1180 666Z" fill="#5A6470" ${sw(1)}/>${snowRoof(1126, 664, 1150, 636, 1174)}
        <rect x="1140" y="610" width="20" height="56" fill="#EDE3D2" ${sw(1)}/><path d="M1136 612 L1150 570 L1164 612Z" fill="#5A6470" ${sw(1)}/><path d="M1150 570 v-10 M1146 564 h8" stroke="${K}" stroke-width="1.2"/>${snowRoof(1140, 610, 1150, 572, 1160)}
        <path d="M1144 630 a6 6 0 0 1 12 0 v10 h-12z" fill="#FFC94A" ${sw(.6)}/><path d="M1150 624 v16" stroke="#6B3A22" stroke-width=".6"/>${[1132, 1162].map((wx) => `<path d="M${wx} 690 a4 4 0 0 1 8 0 v12 h-8z" fill="#FFC94A" ${sw(.5)}/>`).join('')}<path d="M1144 716 v-14 a6 6 0 0 1 12 0 v14z" fill="#7A3A2A" ${sw(.6)}/></g>
      ${tudor(1190, 712, 44, 40, '#F3E3C8', '#B83A2A', 'BOULANGERIE')}
      <g>${shadow(1340, 712, 20, 4)}<rect x="1326" y="610" width="28" height="102" fill="#F3E3C8" ${sw(1)}/><path d="M1326 650 h28 M1340 610 v40 M1326 650 l14 -16 l14 16" stroke="#4A2E1A" stroke-width="1.3" fill="none"/>
        <rect x="1326" y="672" width="28" height="40" fill="#B9A58A" ${sw(.8)}/><path d="M1333 712 v-16 a7 7 0 0 1 14 0 v16z" fill="#C8243C" ${sw(.7)}/><circle cx="1340" cy="626" r="9" fill="#FBF6E6" ${sw(.8)}/><path d="M1340 626 v-6 M1340 626 l4 2" stroke="${K}" stroke-width=".9"/>
        ${Array.from({ length: 12 }, (_, k) => `<path d="M1340 618 v1.4" stroke="${K}" stroke-width=".6" transform="rotate(${k * 30} 1340 626)"/>`).join('')}
        <path d="M1320 612 L1340 566 L1360 612Z" fill="#3E3E46" ${sw(1)}/>${snowRoof(1326, 610, 1340, 568, 1354)}<path d="M1340 566 v-10" stroke="${K}" stroke-width="1"/><path d="M1340 556 l7 2 l-7 2" fill="#C8243C"/>
        <path d="M1310 660 a30 7 0 0 0 60 0" fill="none" stroke="#C99A6A" stroke-width="1.4"/>${[0, 1, 2].map((k) => `<g><g transform="scale(.5)"><path d="M-10 0 c0 -7 4 -10 11 -8 l4 -7 l3 2 l-3 6 c3 1 3 6 0 7 l-1 4 h-2 v-4 h-8 l-1 4 h-2z" fill="#C9874F" stroke="${K}" stroke-width=".8"/></g><animateMotion dur="8s" begin="${-k * 2.6}s" repeatCount="indefinite" path="M1312 660 a28 6 0 1 0 56 0 a28 6 0 1 0 -56 0"/></g>`).join('')}</g>
      ${tudor(1372, 718, 46, 42, '#E8C7C7', '#2F5A4A', 'JOUETS')}${tudor(1250, 704, 40, 36, '#F6E7C1', '#7A3A3A')}
      ${garland(1174, 672, 1250, 668, 10)}${garland(1290, 668, 1326, 664, 6)}
      ${tree(1255, 800)}
      ${stall(1190, 790, '#C8243C')}${stall(1320, 792, '#2F7A44')}${stall(1200, 838, '#3E6FB3')}
      ${tudor(1060, 860, 50, 46, '#F3E3C8', '#5E3B22')}${tudor(1370, 854, 50, 42, '#F6E7C1', '#B83A2A')}
      <ellipse cx="1110" cy="790" rx="44" ry="15" fill="#BFE3F2" ${sw(.9)}/><path d="M1084 788 q24 -5 48 0 M1092 796 q18 -3 34 0" stroke="#fff" stroke-width="1.2" fill="none"/>
      ${['#C8243C', '#2E4A8A', '#F6D04A'].map((c, k) => `<g>${kid(0, 0, c, '#fff')}<animateMotion dur="10s" begin="${-k * 3.3}s" repeatCount="indefinite" path="M1074 790 a36 9 0 1 0 72 0 a36 9 0 1 0 -72 0"/></g>`).join('')}
      <g transform="translate(1310 846)"><circle cy="-8" r="9" fill="#fff" ${sw(.7)}/><circle cy="-21" r="6.4" fill="#fff" ${sw(.7)}/><path d="M0 -21 l6 1 l-6 1z" fill="#F28C28"/><circle cx="-2" cy="-23" r=".8" fill="${K}"/><circle cx="2" cy="-23" r=".8" fill="${K}"/><rect x="-4.4" y="-34" width="8.8" height="7" fill="#2A2A2A"/><path d="M-7 -27 h14" stroke="#2A2A2A" stroke-width="1.6"/><path d="M-6 -15 q6 3 12 0 l1 6 h-3 l-1 -4" fill="#C8243C"/><path d="M-9 -10 l-9 -6 M9 -10 l8 -7" stroke="#6B4528" stroke-width="1.2"/></g>
      ${[[1160, 800], [1350, 800], [1240, 850], [1420, 790]].map(([a2, b2]) => lamppost(a2, b2)).join('')}
      ${kid(1222, 812, '#2E4A8A', '#C8243C')}${kid(1230, 814, '#F2A0C0', '#fff')}${kid(1290, 818, '#2F7A44', '#F6D04A')}${kid(1176, 850, '#7A3A3A', '#2E4A8A')}
      <path d="M1040 880 Q1230 920 1430 872" stroke="#8C5A31" stroke-width="5" fill="none"/><path d="M1040 880 Q1230 920 1430 872" stroke="#CFC6B8" stroke-width="2" fill="none" stroke-dasharray="2 5"/><path id="hTrain" d="M1040 880 Q1230 920 1430 872" fill="none"/>
      ${[[0, 'loco'], [-.5, '#3FB6C4'], [-1, '#F6D04A'], [-1.5, '#7DC27A']].map(([d, c]) => `<g>${c === 'loco' ? `<g transform="translate(0 -6)"><rect x="-12" y="-8" width="16" height="10" rx="4" fill="#C8243C" ${sw(.6)}/><rect x="2" y="-14" width="10" height="16" fill="#2F6B3A" ${sw(.6)}/><rect x="-10" y="-14" width="4" height="6" fill="#2A2A2A"/><circle cx="-8" cy="3" r="2.6" fill="${K}"/><circle cx="7" cy="3" r="2.6" fill="${K}"/><circle cx="-13" cy="-3" r="1.6" fill="#FFE59A"/></g>` : `<g transform="translate(0 -6)"><rect x="-9" y="-8" width="18" height="10" fill="${c}" ${sw(.6)}/><rect x="-6" y="-14" width="7" height="6" fill="#C8243C" ${sw(.4)}/><circle cx="-5" cy="3" r="2.4" fill="${K}"/><circle cx="5" cy="3" r="2.4" fill="${K}"/></g>`}<animateMotion dur="16s" begin="${d}s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#hTrain"/></animateMotion></g>`).join('')}
      <g><g transform="translate(0 0)"><path d="M-30 0 l6 -9 l4 2 l2 -6 l4 4 l-4 9z M-16 2 l6 -9 l4 2 l2 -6 l4 4 l-4 9z" fill="#A9774C" ${sw(.5)}/><path d="M0 4 h22 q5 0 5 -5 v-6 h-7 v4 h-18z" fill="#C8243C" ${sw(.6)}/><circle cx="12" cy="-6" r="3" fill="#F0C9A8"/><path d="M9 -8 l3 -6 l3 6z" fill="#C8243C"/></g><animateMotion dur="20s" repeatCount="indefinite" path="M980 600 C1100 540 1260 560 1500 520"/></g>
    </g>`;
  };

  const galerie = () => {
    const x = 640, y = 600;
    return `<g class="bob">${shadow(x, y + 4, 90, 10)}
      <path d="M${x - 80} ${y} v-80 M${x + 80} ${y} v-80 M${x - 26} ${y} v-80 M${x + 26} ${y} v-80" stroke="#F4EBD9" stroke-width="7"/><path d="M${x - 80} ${y} v-80 M${x + 80} ${y} v-80 M${x - 26} ${y} v-80 M${x + 26} ${y} v-80" stroke="${K}" stroke-width=".8"/>
      <path d="M${x - 96} ${y - 80} H${x + 96} L${x + 70} ${y - 120} H${x - 70}Z" fill="#F4EBD9" ${sw(1.4)}/>${Array.from({ length: 9 }, (_, k) => `<path d="M${x - 80 + k * 20} ${y - 80} L${x - 62 + k * 15.5} ${y - 120}" stroke="${K}" stroke-width=".7"/>`).join('')}
      ${[[-80, -100], [-50, -116], [-10, -122], [30, -118], [70, -104], [86, -82], [-90, -84]].map(([a, b], k) => Deco.leaf(x + a, y + b, 14, k * 50, '#3E8F48') + `<circle cx="${x + a}" cy="${y + b}" r="4.4" fill="${['#B279D6', '#9C7FE6', '#C9A6F0'][k % 3]}" ${sw(.5)}/>`).join('')}
      ${[[-54, '#F6D04A', 'tilt-l'], [0, '#7DC27A', ''], [54, '#F2A0C0', 'tilt-r']].map(([dx, c, cl]) => `<g transform="translate(${x + dx} ${y - 30}) rotate(${dx / 10})"><path d="M-12 30 l12 -36 l12 36 M0 -6 v36" stroke="#8A5428" stroke-width="2.2"/>
        <rect x="-20" y="-40" width="40" height="32" fill="#8A5428" ${sw(1)}/><rect x="-16" y="-36" width="32" height="24" fill="${c}" ${sw(.6)}/><path d="M-16 -16 l10 -10 l6 6 l8 -8 l8 8 v8 h-32z" fill="${Deco.shade(c, -0.3)}" opacity=".7"/><circle cx="8" cy="-30" r="3" fill="#fff" opacity=".85"/></g>`).join('')}</g>`;
  };

  const clinique = () => {
    const x = 950, y = 610;
    return `<g class="bob">${shadow(x, y + 4, 86, 10)}
      <rect x="${x - 70}" y="${y - 86}" width="140" height="86" fill="#FFFFFF" ${sw(1.5)}/><rect x="${x + 30}" y="${y - 86}" width="40" height="86" fill="url(#hatch)" opacity=".35"/>
      <path d="M${x - 84} ${y - 84} L${x} ${y - 138} L${x + 84} ${y - 84}Z" fill="#2F8A6A" ${sw(1.5)}/>${Array.from({ length: 4 }, (_, k) => `<path d="M${x - 70 + k * 18} ${y - 92 - k * 11} h${140 - k * 36}" stroke="#1F6A4E" stroke-width="1"/>`).join('')}
      <circle cx="${x}" cy="${y - 104}" r="13" fill="#fff" ${sw(1.2)}/><path d="M${x} ${y - 112} v16 M${x - 8} ${y - 104} h16" stroke="#2F8A6A" stroke-width="4"/>
      <rect x="${x - 58}" y="${y - 70}" width="42" height="40" fill="url(#hGlass)" ${sw(1.1)}/><path d="M${x - 37} ${y - 70} v40 M${x - 58} ${y - 50} h42" stroke="${K}" stroke-width=".8"/>
      ${[[-50, '#3E8F48'], [-34, '#7DC27A'], [-24, '#4FA04A']].map(([dx, c]) => `<path d="M${x + dx} ${y - 32} q-3 -10 2 -16 q4 6 -2 16" fill="${c}"/>`).join('')}
      <rect x="${x + 10}" y="${y - 56}" width="30" height="56" fill="#2F8A6A" ${sw(1.2)}/><circle cx="${x + 34}" cy="${y - 28}" r="2" fill="#F6D04A"/>
      <rect x="${x - 70}" y="${y - 22}" width="40" height="22" fill="#8A5428" ${sw(1)}/>${[0, 1, 2].map((k) => `<g transform="translate(${x - 62 + k * 13} ${y - 22})"><rect x="-4" y="-14" width="8" height="14" rx="2" fill="${['#C8E7F0', '#F6D9A0', '#D8C8F0'][k]}" ${sw(.6)}/><rect x="-2" y="-18" width="4" height="4" fill="#8A5428"/></g>`).join('')}
      <g transform="translate(${x + 92} ${y - 60}) rotate(-20)"><circle r="20" fill="url(#hGlass)" stroke="#C99A3E" stroke-width="5"/><circle r="20" fill="none" ${sw(1)}/><path d="M-8 -8 a10 10 0 0 1 10 -4" stroke="#fff" stroke-width="3" fill="none"/><path d="M14 14 l18 18" stroke="#6B3A22" stroke-width="7" stroke-linecap="round"/>
        <g transform="translate(-2 2)"><ellipse rx="5" ry="6" fill="#9ED36A" ${sw(.6)}/><path d="M-5 -2 l-4 -2 M5 -2 l4 -2 M-5 2 l-4 1 M5 2 l4 1" stroke="${K}" stroke-width=".6"/></g></g></g>`;
  };

  const pond = () => `<g><path d="${blob(800, 470, 128, 68, 11, .14, 5)}" fill="#9AA3A8" ${sw(1.2)}/>${Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2; return `<ellipse cx="${(800 + Math.cos(a) * 124).toFixed(0)}" cy="${(470 + Math.sin(a) * 64).toFixed(0)}" rx="8" ry="5" fill="${i % 2 ? '#B9B2A6' : '#A39C90'}" ${sw(.5)}/>`; }).join('')}<path d="${blob(800, 470, 120, 62, 11, .14, 5)}" fill="url(#hPond)" ${sw(1.5)}/><path d="${blob(800, 470, 120, 62, 11, .14, 5)}" fill="url(#hWaves)"/>
    ${[[740, 450], [770, 492], [850, 452], [870, 488], [812, 500]].map(([a, b], i) => `<path d="M${a} ${b} m-11 0 a11 7 0 1 0 22 0 a11 7 0 1 0 -22 0 M${a} ${b} l11 -2" fill="#5DA548" ${sw(.8)}/>${i % 2 ? `<circle cx="${a + 3}" cy="${b - 3}" r="4" fill="#F7A8C4" ${sw(.6)}/><circle cx="${a + 3}" cy="${b - 3}" r="1.6" fill="#F6D04A"/>` : ''}`).join('')}
    <g transform="translate(830 430)"><path d="M0 0 c6 -6 14 -4 12 2 l-4 6 c-4 2 -10 0 -8 -8z" fill="#fff" ${sw(.8)}/><path d="M10 -2 l5 -6 l2 4" fill="#F28C28"/></g>
    <path d="M680 470 q24 -26 48 0" fill="none" stroke="#8A5428" stroke-width="12"/><path d="M680 470 q24 -26 48 0" fill="none" stroke="#C99A6A" stroke-width="8"/>${[0, 1, 2, 3, 4].map((k) => `<path d="M${684 + k * 10} ${466 - (k === 2 ? 12 : k % 4 ? 9 : 2)} v-8" stroke="#8A5428" stroke-width="2"/>`).join('')}</g>`;

  const paths = `<path d="M390 440 C470 470 560 470 640 520 M960 520 C1040 470 1120 420 1200 360 M640 600 C560 660 470 700 400 720 M960 610 C1040 660 1150 700 1220 720 M860 480 C900 490 930 500 950 520" fill="none" stroke="#B9965C" stroke-width="30" stroke-linecap="round"/>
    <path d="M390 440 C470 470 560 470 640 520 M960 520 C1040 470 1120 420 1200 360 M640 600 C560 660 470 700 400 720 M960 610 C1040 660 1150 700 1220 720 M860 480 C900 490 930 500 950 520" fill="none" stroke="url(#hCobble)" stroke-width="26" stroke-linecap="round"/>`;

  const fields = [[560, 700, '#E8432E'], [575, 714, '#F6D04A'], [590, 728, '#F2A0C0'], [605, 742, '#B279D6'], [620, 756, '#E8432E'], [635, 770, '#F28C28']].map(([x, y, c]) => tulipRow(x, y, 190, c, -12)).join('')
    + [[700, 300, '#B279D6'], [700, 316, '#9C7FE6'], [700, 332, '#B279D6'], [700, 348, '#C9A6F0']].map(([x, y, c]) => tulipRow(x, y, 170, c, 0)).join('')
    + [[1250, 520, '#F6D04A'], [1250, 536, '#F28C28'], [1250, 552, '#F6D04A']].map(([x, y, c]) => tulipRow(x, y, 150, c, 8)).join('');

  const greenery = [[150, 330, 1.1, '#3E8F48', '#E8432E'], [130, 470, 1, '#4FA04A', null], [600, 160, .9, '#3E8F48', '#F6D04A'], [900, 190, 1, '#2F7A44', null], [1450, 380, 1, '#4FA04A', '#E8432E'], [1470, 520, .9, '#3E8F48', null], [520, 560, .8, '#5DA548', null], [1080, 520, .8, '#3E8F48', '#F28C28'], [800, 880, 1, '#3E8F48', null], [700, 860, .8, '#4FA04A', '#F2A0C0']]
    .map(([x, y, s, c, f]) => tree(x, y, s, c, f)).join('')
    + [[980, 190], [1010, 200], [600, 420], [1000, 430]].map(([x, y]) => cypress(x, y, .9)).join('')
    + [[520, 420, '#F2A0C0'], [760, 560, '#F6D04A'], [880, 560, '#E8432E'], [1180, 450, '#B279D6'], [450, 600, '#FFFFFF'], [1040, 760, '#F2A0C0'], [560, 860, '#F6D04A'], [330, 470, null]].map(([x, y, f]) => bush(x, y, 1.1, '#4FA04A', f)).join('');

  const boats = `<g class="wave"><g transform="translate(1480 860)"><path d="M-24 0 h48 l-8 10 h-32z" fill="#E8432E" ${sw(1)}/><path d="M0 0 v-34 l18 28z" fill="#fff" ${sw(1)}/></g></g>
    <g class="wave" style="animation-delay:-2s"><g transform="translate(120 140)"><path d="M-18 0 h36 l-6 8 h-24z" fill="#F6D04A" ${sw(1)}/><path d="M0 0 v-26 l14 22z" fill="#fff" ${sw(1)}/></g></g>`;
  const birds = `<g class="cloud" style="animation-duration:70s"><path d="M200 90 q8 -8 16 0 q8 -8 16 0 M240 110 q6 -6 12 0 q6 -6 12 0" fill="none" stroke="${K}" stroke-width="1.6"/></g>`;


  /* ---- détails supplémentaires ---- */
  const person = (x, y, c = '#3E6FB3', hat = '#E8B23A', act = '') => `<g transform="translate(${x} ${y})">${shadow(1, 1, 6, 2)}
    <path d="M-2.4 0 v-6 M2.4 0 v-6" stroke="#3A3A3A" stroke-width="2" stroke-linecap="round"/><path d="M-5 -6 Q-5.5 -17 0 -18 Q5.5 -17 5 -6Z" fill="${c}" ${sw(.7)}/>
    <circle cy="-21.5" r="3.6" fill="#F0C9A8" ${sw(.6)}/><path d="M-5.5 -22.5 h11 M-3.4 -22.5 q3.4 -5 6.8 0" fill="${hat}" stroke="${hat}" stroke-width="1.6"/>${act}</g>`;
  const windmill = (x, y) => `<g transform="translate(${x} ${y})">${shadow(0, 2, 30, 7)}
    <path d="M-20 0 L-13 -70 L13 -70 L20 0Z" fill="#F3E9D2" ${sw(1.2)}/><path d="M5 -70 L13 -70 L20 0 L8 0Z" fill="url(#hatch)" opacity=".5"/>
    ${[-56, -40, -24].map((yy) => `<rect x="-5" y="${yy}" width="10" height="9" rx="4" fill="#8FC7D6" ${sw(.6)}/>`).join('')}<path d="M-6 0 v-14 a6 6 0 0 1 12 0 v14z" fill="#8A5428" ${sw(.7)}/>
    <path d="M-17 -70 L0 -92 L17 -70Z" fill="#B83A2A" ${sw(1.2)}/>
    <g><animateTransform attributeName="transform" type="rotate" from="0 0 -78" to="360 0 -78" dur="14s" repeatCount="indefinite"/>
      ${[0, 90, 180, 270].map((a) => `<g transform="rotate(${a} 0 -78)"><path d="M0 -78 V-136" stroke="#7A4A26" stroke-width="2.4"/><path d="M1 -84 h12 v-50 h-12" fill="#FBF5E8" ${sw(.7)}/>${[0, 1, 2, 3, 4].map((k) => `<path d="M1 ${-92 - k * 9} h12" stroke="${K}" stroke-width=".4"/>`).join('')}</g>`).join('')}
      <circle cx="0" cy="-78" r="3.5" fill="#3A3A3A"/></g></g>`;
  const beehive = (x, y) => `<g transform="translate(${x} ${y})">${shadow(0, 1, 10, 3)}<path d="M-8 0 v-6 M8 0 v-6" stroke="#7A4A26" stroke-width="1.6"/>${[0, 1, 2].map((k) => `<rect x="${-9 + k}" y="${-12 - k * 7}" width="${18 - k * 2}" height="7" fill="${k % 2 ? '#F6D04A' : '#E8B23A'}" ${sw(.6)}/>`).join('')}<path d="M-8 -26 L0 -32 L8 -26Z" fill="#B83A2A" ${sw(.6)}/>
    ${[[12, -20], [16, -12], [-14, -16]].map(([a, b]) => `<g transform="translate(${a} ${b})"><ellipse rx="2.2" ry="1.6" fill="#F6D04A" ${sw(.4)}/><path d="M-1 -1.5 q-1 -2 0.5 -2.5 M1 -1.5 q1 -2 -0.5 -2.5" stroke="#fff" stroke-width=".8"/></g>`).join('')}</g>`;
  const butterfly = (x, y, c, d) => `<g><g><path d="M0 0 c-6 -8 -12 -2 -6 3 c-6 3 -2 8 6 -1 c8 9 12 4 6 1 c6 -5 0 -11 -6 -3z" fill="${c}" ${sw(.5)}><animateTransform attributeName="transform" type="scale" values="1 1;.3 1;1 1" dur=".4s" repeatCount="indefinite"/></path></g>
    <animateMotion dur="${d}s" repeatCount="indefinite" path="M${x} ${y} c40 -30 80 30 120 0 s60 -40 20 -60 s-100 10 -140 60z"/></g>`;
  const reeds = (x, y) => Array.from({ length: 7 }, (_, i) => { const dx = (i - 3) * 5, h = 26 + (i % 3) * 8; return `<path d="M${x + dx} ${y} q${dx * .3} ${-h * .5} ${dx * .6} ${-h}" stroke="#4E8A3E" stroke-width="1.6" fill="none"/>${i % 2 ? `<rect x="${x + dx * 1.6 - 2}" y="${y - h - 2}" width="4" height="10" rx="2" fill="#7A4A26"/>` : ''}`; }).join('');
  const koi = (x, y, c, d) => `<g><path d="M0 0 c6 -4 14 -3 18 0 c-4 3 -12 4 -18 0z M0 0 l-6 -4 v8z" fill="${c}" ${sw(.4)} opacity=".9"/><animateMotion dur="${d}s" repeatCount="indefinite" rotate="auto" path="M${x} ${y} a50 22 0 1 0 100 0 a50 22 0 1 0 -100 0"/></g>`;
  const lamppost = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 0 v-30" stroke="#2A2A2A" stroke-width="2"/><path d="M-4 -30 h8 l-1.6 -7 h-4.8z" fill="#FFE59A" ${sw(.6)}/><circle cy="-34" r="9" fill="#FFE59A" opacity=".35"/></g>`;
  const shore = () => {
    const isle = blob(800, 520, 730, 450, 16, .08, 21);
    let rocks = '';
    [[140, 360], [110, 560], [300, 860], [1010, 965], [1440, 760], [1500, 420], [1200, 110], [520, 120]].forEach(([x, y], i) => {
      rocks += `<g transform="translate(${x} ${y})">${[[-10, 0, 12], [6, 4, 9], [14, -4, 7]].map(([a, b, r]) => `<path d="${blob(a, b, r, r * .7, 7, .3, i + a)}" fill="#9AA3A8" ${sw(1)}/><path d="${blob(a + 2, b + 2, r * .6, r * .35, 6, .3, i)}" fill="#7C858A" opacity=".7"/>`).join('')}<path d="M-24 6 q10 -4 20 0 t20 0 t20 0" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/></g>`;
    });
    return `<path d="${blob(800, 520, 752, 470, 16, .08, 21)}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="14 8" opacity=".55"/>
      <path d="${blob(800, 520, 741, 460, 16, .08, 21)}" fill="none" stroke="#BFEAF0" stroke-width="8" opacity=".55"/>${rocks}
      ${Array.from({ length: 40 }, (_, i) => { const a = i / 40 * Math.PI * 2; const x = 800 + Math.cos(a) * 705, y = 515 + Math.sin(a) * 430; return `<path d="M${(x - 8).toFixed(0)} ${y.toFixed(0)} q8 -3 16 0" stroke="#D9BE84" stroke-width="1.2" fill="none"/>`; }).join('')}`;
  };
  const patches = Array.from({ length: 26 }, (_, i) => { const a = i * 2.4, r = 120 + (i * 37) % 500; const x = 800 + Math.cos(a) * r, y = 510 + Math.sin(a) * r * .55; return `<path d="${blob(x, y, 40 + (i % 4) * 14, 18 + (i % 3) * 6, 9, .3, i)}" fill="${i % 2 ? '#8FCB5E' : '#5EA845'}" opacity=".45"/>`; }).join('');
  const extras = () => `
    ${windmill(560, 770)}
    ${[[840, 770], [868, 778], [896, 770]].map(([x, y]) => beehive(x, y)).join('')}
    ${reeds(690, 500)}${reeds(905, 470)}${reeds(760, 525)}
    ${koi(770, 470, '#F28C28', 11)}${koi(790, 462, '#FFFFFF', 15)}
    ${[[718, 520], [705, 545], [694, 572]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="#B9B2A6" ${sw(.7)}/>`).join('')}
    <g transform="translate(860 520)"><path d="M0 0 l10 -1 M3 -1 l3 -6 M5 -1 l5 -5 M3 1 l3 6 M5 1 l5 5" stroke="#3FB6C4" stroke-width="1.4"/><animateMotion dur="7s" repeatCount="indefinite" path="M0 0 c20 -20 40 10 60 -10 s-20 -30 -60 10z"/></g>
    ${butterfly(420, 520, '#F6D04A', 18)}${butterfly(1150, 520, '#F2A0C0', 22)}${butterfly(620, 260, '#B279D6', 20)}${butterfly(980, 760, '#FFFFFF', 24)}
    ${person(470, 470, '#3E6FB3', '#E8B23A', `<path d="M5 -10 l10 4 l-2 6 h-10z" fill="#9AA6AE" stroke="${K}" stroke-width=".5"/><circle cx="3" cy="-1" r="2.4" fill="#2A2A2A"/>`)}
    ${person(1090, 455, '#D9487A', '#F6E7C1', `<path d="M5 -12 l8 -2 v6 l-6 2z" fill="#3E9FCF" stroke="${K}" stroke-width=".5"/>`)}
    ${person(500, 690, '#2F8A6A', '#B83A2A', `<circle cx="-7" cy="-12" r="3" fill="#F2A0C0" stroke="${K}" stroke-width=".5"/><circle cx="-9" cy="-15" r="2.6" fill="#F6D04A" stroke="${K}" stroke-width=".5"/>`)}
    ${person(1160, 690, '#2E4A8A', '#C8243C')}${person(1172, 694, '#F6D04A', '#fff')}
    ${person(760, 600, '#E8A62E', '#3E6FB3')}${person(980, 690, '#1F8FA8', '#F6E7C1')}
    <g transform="translate(560 440)"><rect x="-16" y="-8" width="32" height="4" fill="#8A5428" ${sw(.6)}/><rect x="-16" y="-15" width="32" height="3" fill="#8A5428" ${sw(.6)}/><path d="M-14 -4 v6 M14 -4 v6 M-14 -15 v-2 M14 -15 v-2" stroke="#2A2A2A" stroke-width="1.4"/></g>
    ${[[600, 600], [690, 610], [930, 610], [1010, 470]].map(([x, y]) => lamppost(x, y)).join('')}`;

  const place = (path, label, inner, sign) => `<a class="place" href="#${path}" aria-label="${label}">${inner}${sign}</a>`;
  function svg() {
    return `<svg viewBox="0 0 1600 1000" role="img" aria-label="Carte de l’île du Grand Jardin">${defs}
      <rect width="1600" height="1000" fill="url(#hSea)"/><rect width="1600" height="1000" fill="url(#hWaves)"/>
      <path d="${blob(800, 520, 730, 450, 16, .08, 21)}" fill="#F1DDB0" ${sw(2)}/><path d="${blob(800, 520, 730, 450, 16, .08, 21)}" fill="url(#dots)" opacity=".5"/>
      ${shore()}<path d="${blob(800, 510, 690, 412, 16, .08, 21)}" fill="url(#hIsle)" ${sw(1.6)}/>${patches}<path d="${blob(800, 510, 690, 412, 16, .08, 21)}" fill="url(#hGrass)"/>
      ${Array.from({ length: 220 }, (_, i) => { const a = i * 2.39996, r = 60 + Math.sqrt(i / 220) * 600; const x = 800 + Math.cos(a) * r * 1.02, y = 510 + Math.sin(a) * r * .58; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${i % 4 ? 2 : 2.8}" fill="${['#FFFFFF', '#F6D04A', '#F2A0C0', '#E8432E', '#B279D6'][i % 5]}" opacity=".9"/>`; }).join('')}
      ${paths}${fields}${pond()}${greenery}${boats}${extras()}
      ${place('potager', 'Silence ça truffe, le potager', potager(), bannerSign(370, 136, 'Le potager', '#E8432E'))}
      ${place('jardin', 'La grande serre, le jardin-boutique', serre(), bannerSign(1216, 380, 'La grande serre', '#2F8A6A'))}
      ${place('bouquet', 'L’atelier bouquet', atelier(), bannerSign(340, 890, 'L’atelier bouquet', '#D9487A'))}
      ${place('noel', 'Le village de Noël', noel(), bannerSign(1236, 916, 'Le village de Noël', '#2E4A8A'))}
      ${place('galerie', 'La galerie', galerie(), bannerSign(640, 640, 'La galerie', '#E8A62E'))}
      ${place('clinique', 'La clinique des plantes', clinique(), bannerSign(950, 650, 'La clinique', '#1F8FA8'))}
      ${birds}
    </svg>`;
  }

  /* ---- le haut de l'accueil : un ciel de jardin peint à l'aquarelle ---- */
  function paintedSky() {
    const W = 1320, H = 250;
    const flower = (x, y, r, c, k) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${k * 37})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="${-r * .62}" rx="${r * .42}" ry="${r * .62}" fill="${c}" ${sw(.9)} transform="rotate(${a})"/>`).join('')}<circle r="${r * .3}" fill="#F6C343" ${sw(.7)}/></g>`;
    const leafy = (x, y, a, c) => `<path d="M0 0 C4 -5 11 -5 14 0 C11 5 4 5 0 0Z" fill="${c}" ${sw(.8)} transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a})"/>`;
    // guirlandes de fleurs suspendues en festons sur le haut
    const cols = ['#F2A0C0', '#FFFFFF', '#F28C28', '#B79BE0', '#E8432E', '#FFE07A'];
    let garl = '', k = 0;
    const span = [[-20, 300, 62], [300, 640, 74], [640, 980, 66], [980, 1340, 70]];
    span.forEach(([x1, x2, sag]) => {
      const mx = (x1 + x2) / 2, my = sag * 2 - 4;
      garl += `<path d="M${x1} -4 Q${mx} ${my} ${x2} -4" fill="none" stroke="#3F6B3A" stroke-width="2.2"/>`;
      for (let i = 1; i < 12; i++) {
        const t = i / 12, x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y = (1 - t) * (1 - t) * -4 + 2 * (1 - t) * t * my + t * t * -4;
        garl += leafy(x - 2, y + 2, (i % 2 ? 140 : 30) + i * 3, i % 3 ? '#6FA552' : '#4E8A3E');
        garl += flower(x, y, i % 3 === 1 ? 9 : 7, cols[k++ % cols.length], k);
      }
      garl += `<path d="M${x1 + 2} -2 l0 10" stroke="#3F6B3A" stroke-width="2"/>${flower(x1 + 2, 10, 10, '#F2A0C0', k++)}`;
    });
    const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#skyWc)"><ellipse cx="0" cy="0" rx="70" ry="22" fill="#fff" opacity=".9"/><ellipse cx="-28" cy="-14" rx="34" ry="22" fill="#fff" opacity=".9"/><ellipse cx="18" cy="-20" rx="38" ry="26" fill="#fff" opacity=".92"/><ellipse cx="10" cy="6" rx="60" ry="12" fill="#E3EEF6" opacity=".7"/></g>`;
    const bird = (x, y, s) => `<path d="M${x - 9 * s} ${y} q${4.5 * s} ${-6 * s} ${9 * s} 0 q${4.5 * s} ${-6 * s} ${9 * s} 0" fill="none" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>`;
    const tufts = Array.from({ length: 34 }, (_, i) => { const x = 10 + i * 40 + (i % 3) * 7, y = 244 - (i % 4) * 3; return `<path d="M${x} ${y} q-3 -12 -8 -16 M${x} ${y} q0 -14 2 -20 M${x} ${y} q4 -10 9 -13" fill="none" stroke="#5E9446" stroke-width="2" stroke-linecap="round" opacity=".8"/>`; }).join('');
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD3EC"/><stop offset=".55" stop-color="#CDE9F1"/><stop offset="1" stop-color="#FCEFD6"/></linearGradient>
        <radialGradient id="skyGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A6" stop-opacity=".95"/><stop offset=".5" stop-color="#FFE9A6" stop-opacity=".35"/><stop offset="1" stop-color="#FFE9A6" stop-opacity="0"/></radialGradient>
        <filter id="skyWc" x="-20%" y="-30%" width="140%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="14"/><feGaussianBlur stdDeviation="1.4"/></filter>
        <filter id="skyPaper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .25  0 0 0 .09 0"/></filter>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#skyGrad)"/>
      <g filter="url(#skyWc)" opacity=".5"><path d="M0 70 C200 40 420 110 640 74 C860 40 1080 100 ${W} 66 V120 C1080 150 860 96 640 128 C420 160 200 92 0 124Z" fill="#B9DDF0"/></g>
      <circle cx="1130" cy="104" r="120" fill="url(#skyGlow)"/>
      <circle cx="1130" cy="104" r="44" fill="#FFD66B" filter="url(#skyWc)"/><circle cx="1118" cy="92" r="20" fill="#FFF1B8" opacity=".7" filter="url(#skyWc)"/>
      ${cloud(250, 120, 1)}${cloud(620, 96, .8)}${cloud(900, 140, .65)}${cloud(1290, 150, .7)}
      ${bird(470, 104, 1.2)}${bird(500, 96, .9)}${bird(790, 112, 1)}${bird(1010, 92, .8)}
      <g filter="url(#skyWc)"><path d="M0 206 C140 166 300 188 440 174 C600 158 760 194 900 180 C1060 164 1200 186 ${W} 172 V${H} H0Z" fill="#BFDDA8" opacity=".85"/>
        <path d="M0 232 C180 206 360 222 560 212 C760 202 980 228 1160 214 C1240 208 1290 214 ${W} 210 V${H} H0Z" fill="#9CCB86"/></g>
      ${tufts}
      ${garl}
      <rect width="${W}" height="${H}" filter="url(#skyPaper)"/>
    </svg>`;
  }

  const TILES = [
    ['potager', 'Le potager', 'Il pousse avec ta météo.', '#E8432E'],
    ['jardin', 'La grande serre', 'Cueille. En pot ou en bulbe.', '#2F8A6A'],
    ['bouquet', 'L’atelier bouquet', 'Compose. Rassemble. Offre.', '#D9487A'],
    ['noel', 'Le village de Noël', '27 pièces Lemax, toutes cliquables.', '#2E4A8A'],
    ['galerie', 'La galerie', 'Ton jardin en photo. Un bon offert.', '#E8A62E'],
    ['clinique', 'La clinique', 'Une tache ? Trouve l’intrus.', '#1F8FA8'],
  ];
  function mount(el) {
    el.innerHTML = `<div class="hub2">
      <header class="hub2-head"><div class="hub2-sky" aria-hidden="true">${paintedSky()}</div><h1>Le Grand Jardin</h1><p>Six lieux. Un seul jardin.<br>Clique pour entrer.</p></header>
      <div class="map2">${svg()}</div>
      <nav class="tiles" aria-label="Tous les espaces">${TILES.map(([p, n, t, c]) => `<a class="tile" href="#${p}" style="--c:${c}"><b>${n}</b><span>${t}</span></a>`).join('')}
        <a class="tile tile-ghost" href="#coulisses" style="--c:#22303A"><b>Les coulisses</b><span>Ce qui fait tourner l’île.</span></a></nav>
    </div>`;
  }
  return { mount };
})();
route('', { title: '', mount: (el) => HubMap.mount(el) });
