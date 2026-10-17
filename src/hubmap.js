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
    const beds = [];
    const crops = ['cabbage', 'carrot', 'tomato', 'pumpkin', 'lettuce', 'leek'];
    [[230, 210], [330, 210], [430, 210], [230, 300], [330, 300], [430, 300]].forEach(([x, y], i) => {
      let c = `<g>${shadow(x + 45, y + 64, 50, 6)}<rect x="${x}" y="${y}" width="90" height="62" rx="4" fill="url(#hWood)" ${sw(1.3)}/><rect x="${x + 6}" y="${y + 6}" width="78" height="50" rx="2" fill="#6B4022" ${sw(1)}/>
        <path d="M${x} ${y + 31} h6 M${x + 84} ${y + 31} h6 M${x + 30} ${y} v6 M${x + 60} ${y} v6" stroke="${K}" stroke-width=".8"/>`;
      for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) {
        const cx = x + 17 + k * 19, cy = y + 16 + r * 15;
        const t = crops[i];
        if (t === 'cabbage') c += `<circle cx="${cx}" cy="${cy}" r="6.5" fill="#7DC27A" ${sw(.7)}/><circle cx="${cx}" cy="${cy}" r="3.6" fill="#B7E39A" ${sw(.5)}/><path d="M${cx - 6} ${cy} q6 -3 12 0" stroke="${K}" stroke-width=".4" fill="none"/>`;
        if (t === 'carrot') c += `<path d="M${cx} ${cy + 3} l-4 -8 M${cx} ${cy + 3} l0 -9 M${cx} ${cy + 3} l4 -8" stroke="#4E9A3E" stroke-width="1.6"/><circle cx="${cx}" cy="${cy + 4}" r="2.4" fill="#F28C28" ${sw(.5)}/>`;
        if (t === 'tomato') c += `<path d="M${cx} ${cy + 5} V${cy - 9}" stroke="#B9773E" stroke-width="1.4"/><circle cx="${cx - 3}" cy="${cy - 2}" r="3.2" fill="#E8432E" ${sw(.5)}/><circle cx="${cx + 3}" cy="${cy + 2}" r="2.8" fill="#E8432E" ${sw(.5)}/><path d="M${cx - 5} ${cy - 6} q5 -3 10 0" stroke="#4E9A3E" stroke-width="1.6" fill="none"/>`;
        if (t === 'pumpkin' && k % 2 === 0) c += `<path d="M${cx} ${cy} q10 -6 18 2" stroke="#4E9A3E" stroke-width="1.2" fill="none"/><ellipse cx="${cx + 4}" cy="${cy + 1}" rx="7" ry="5" fill="#F29A2E" ${sw(.7)}/><path d="M${cx + 4} ${cy - 4} v10 M${cx} ${cy - 3} q-1 4 0 8 M${cx + 8} ${cy - 3} q1 4 0 8" stroke="${K}" stroke-width=".5" fill="none"/>`;
        if (t === 'lettuce') c += `<path d="${blob(cx, cy, 6.5, 5.5, 8, .3, cx)}" fill="${(k + r) % 2 ? '#A8D86E' : '#C2475A'}" ${sw(.6)}/>`;
        if (t === 'leek') c += `<path d="M${cx - 2} ${cy + 5} l-2 -11 M${cx} ${cy + 5} l0 -12 M${cx + 2} ${cy + 5} l3 -10" stroke="#3E8A54" stroke-width="2"/><rect x="${cx - 2}" y="${cy + 1}" width="4" height="5" fill="#F4F0DE" ${sw(.4)}/>`;
      }
      beds.push(c + '</g>');
    });
    return `<g class="bob">${beds.join('')}
      ${shadow(560, 300, 16, 5)}<g transform="translate(560 300)"><path d="M0 0 V-62 M-22 -44 H22" stroke="#7A4A26" stroke-width="3"/><path d="M-9 -44 L-11 -12 L11 -12 L9 -44Z" fill="#3E6FB3" ${sw(1)}/><path d="M-9 -44 L9 -44 L4 -30 L-4 -30Z" fill="#E8432E" ${sw(.7)}/>
        <path d="M-22 -44 q-6 4 -4 10 M22 -44 q6 4 4 10" stroke="#E2C27A" stroke-width="2"/><circle cy="-54" r="9" fill="#F0DDB0" ${sw(1)}/><path d="M-13 -58 h26 l-5 -9 h-16z" fill="#C99A3E" ${sw(1)}/><path d="M-4 -55 l2 2 M2 -55 l2 2 M-3 -49 q3 2 6 0" stroke="${K}" stroke-width=".8"/>
        <g transform="translate(18 -50)"><path d="M0 0 c8 -8 18 -3 15 5 l-6 1 l-3 5z" fill="#1F2A30" ${sw(.6)}/><circle cx="9" cy="0" r="1.2" fill="#fff"/></g></g>
      <g transform="translate(205 395) rotate(-8)"><path d="M0 0 h26 l-4 14 h-18z" fill="#3E9FCF" ${sw(1)}/><path d="M26 4 l14 -10 l2 3 l-14 12" fill="#3E9FCF" ${sw(1)}/><path d="M4 0 q9 -14 18 0" fill="none" ${sw(1)}/></g>
      <g transform="translate(540 380)">${shadow(10, 8, 24, 5)}<path d="M-14 -6 h36 l-6 14 h-24z" fill="#9AA6AE" ${sw(1)}/><circle cx="-10" cy="10" r="5" fill="#2A2A2A"/><path d="M22 -6 l18 -8" stroke="#7A4A26" stroke-width="2.4"/>${[[-4, -10, '#F29A2E'], [6, -12, '#7DC27A'], [14, -9, '#E8432E']].map(([a, b, cc]) => `<circle cx="${a}" cy="${b}" r="5" fill="${cc}" ${sw(.6)}/>`).join('')}</g>
      ${fence(210, 196, 530, 196, 26)}
      <g transform="translate(150 280)">${shadow(28, 4, 40, 7)}<rect x="0" y="-56" width="56" height="56" fill="#6E8B6A" ${sw(1.2)}/>${Array.from({ length: 7 }, (_, k) => `<path d="M${k * 8} -56 v56" stroke="${K}" stroke-width=".6" opacity=".5"/>`).join('')}
        <path d="M-6 -54 L28 -78 L62 -54Z" fill="#8A5428" ${sw(1.2)}/><path d="M-6 -54 L28 -78 L62 -54" fill="none" stroke="#B9773E" stroke-width="2"/><rect x="18" y="-36" width="20" height="36" fill="#4E6A4A" ${sw(.8)}/><circle cx="34" cy="-18" r="1.4" fill="#E8B23A"/>
        <rect x="4" y="-46" width="12" height="10" fill="#BFE6EE" ${sw(.6)}/><path d="M58 -40 l14 30 M62 -40 l4 30" stroke="#7A4A26" stroke-width="1.6"/><path d="M68 -14 h8 l-2 6 h-6z M62 -12 l-3 6 h6z" fill="#9AA6AE" ${sw(.5)}/></g>
      <g transform="translate(520 430)"><rect x="-22" y="-26" width="44" height="26" fill="#8A5428" ${sw(1)}/>${[0, 1, 2].map((k) => `<path d="M-22 ${-26 + k * 9} h44" stroke="#6B3A1E" stroke-width="1"/>`).join('')}<path d="${blob(0, -28, 18, 6, 8, .4, 4)}" fill="#6B4022" ${sw(.6)}/><circle cx="-6" cy="-30" r="2" fill="#F28C28"/><circle cx="6" cy="-29" r="2" fill="#7DC27A"/></g>
      <g transform="translate(250 395)"><path d="M0 0 h70 v-10 l-70 -10z" fill="url(#hGlass)" ${sw(1)}/><path d="M23 -3 v-13 M46 -6 v-10" stroke="#fff" stroke-width="1.6"/>${[10, 30, 50].map((dx) => `<circle cx="${dx}" cy="-5" r="3" fill="#7DC27A" opacity=".8"/>`).join('')}</g>
      ${[[236, 216], [336, 216], [436, 216], [236, 306], [336, 306], [436, 306]].map(([x, y], i) => `<g transform="translate(${x + 78} ${y - 4})"><path d="M0 0 v10" stroke="#7A4A26" stroke-width="1.4"/><rect x="-7" y="-8" width="14" height="9" rx="1" fill="#FBF5E8" ${sw(.5)}/><circle cx="0" cy="-3.5" r="2.4" fill="${['#7DC27A', '#F28C28', '#E8432E', '#F29A2E', '#C2475A', '#3E8A54'][i]}"/></g>`).join('')}</g>`;
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
    const ox = 1090, oy = 860;
    const house = (x, y, w, h, wall, roof) => `<g>${shadow(x + w / 2, y + 3, w * .7, 5)}<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${wall}" ${sw(1.3)}/>
      <path d="M${x} ${y - h * .5} h${w} M${x + w / 3} ${y - h} v${h * .5} M${x + w * 2 / 3} ${y - h} v${h * .5} M${x} ${y - h * .5} l${w / 3} ${-h * .5} M${x + w} ${y - h * .5} l${-w / 3} ${-h * .5}" stroke="#4A2E1A" stroke-width="1.6"/>
      <path d="M${x - 6} ${y - h + 2} L${x + w / 2} ${y - h - w * .55} L${x + w + 6} ${y - h + 2}Z" fill="${roof}" ${sw(1.3)}/><path d="M${x - 8} ${y - h + 3} L${x + w / 2} ${y - h - w * .55 - 5} L${x + w + 8} ${y - h + 3} q-${w * .3} -6 -${w / 2 + 8} -${w * .4} q-${w * .2} ${w * .3} -${w / 2 + 8} ${w * .4}z" fill="url(#hSnow)" ${sw(1)}/>
      <rect x="${x + w * .18}" y="${y - h * .42}" width="${w * .22}" height="${h * .22}" fill="#FFCF5C" ${sw(.7)}/><rect x="${x + w * .6}" y="${y - h * .42}" width="${w * .22}" height="${h * .22}" fill="#FFCF5C" ${sw(.7)}/><rect x="${x + w * .4}" y="${y - h * .3}" width="${w * .2}" height="${h * .3}" fill="#6B3A22" ${sw(.7)}/>
      ${Array.from({ length: 5 }, (_, k) => `<circle cx="${x + 3 + k * (w - 6) / 4}" cy="${y - h + 4}" r="1.8" fill="${['#E8432E', '#F6D04A', '#3FB6C4'][k % 3]}"/>`).join('')}</g>`;
    const fir = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(2, 2, 14, 4)}<path d="M0 -60 L16 -30 L9 -30 L22 0 L-22 0 L-9 -30 L-16 -30Z" fill="#2B6A3C" ${sw(1.1)}/><path d="M0 -60 L8 -44 Q0 -40 -8 -44Z M-12 -30 Q0 -26 12 -30 L9 -36 Q0 -32 -9 -36Z M-20 -2 Q0 4 20 -2 L17 -8 Q0 -2 -17 -8Z" fill="#fff" ${sw(.6)}/>${[[-6, -20, '#E8432E'], [6, -14, '#F6D04A'], [0, -38, '#3FB6C4'], [-10, -8, '#F6D04A']].map(([a, b, c]) => `<circle cx="${a}" cy="${b}" r="2.2" fill="${c}"/>`).join('')}<path d="M0 -66 l2 4 h4 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 h4z" fill="#F6D04A" ${sw(.5)}/></g>`;
    return `<g class="bob"><path d="${blob(ox + 170, oy - 70, 200, 100, 12, .12, 9)}" fill="url(#hSnow)" ${sw(1.5)}/>
      ${Array.from({ length: 24 }, (_, i) => `<circle cx="${ox + 10 + (i * 53) % 330}" cy="${oy - 140 + (i * 31) % 130}" r="1.4" fill="#BFD6EA"/>`).join('')}
      ${fir(ox + 30, oy - 70, .8)}${house(ox + 60, oy - 60, 56, 50, '#F3E3C8', '#B83A2A')}${house(ox + 130, oy - 90, 48, 44, '#E8C7C7', '#2F5A4A')}
      <g>${shadow(ox + 215, oy - 84, 24, 5)}<rect x="${ox + 200}" y="${oy - 190}" width="30" height="106" fill="#F3E3C8" ${sw(1.3)}/><path d="M${ox + 200} ${oy - 150} h30 M${ox + 215} ${oy - 190} v40" stroke="#4A2E1A" stroke-width="1.6"/><circle cx="${ox + 215}" cy="${oy - 168}" r="9" fill="#fff" ${sw(1)}/><path d="M${ox + 215} ${oy - 168} v-6 M${ox + 215} ${oy - 168} l4 2" stroke="${K}" stroke-width="1"/>
        <path d="M${ox + 194} ${oy - 190} L${ox + 215} ${oy - 236} L${ox + 236} ${oy - 190}Z" fill="#3E3E46" ${sw(1.3)}/><path d="M${ox + 192} ${oy - 189} q23 -10 46 0 l-4 -8 q-19 -6 -38 0z" fill="#fff" ${sw(.8)}/><rect x="${ox + 206}" y="${oy - 112}" width="18" height="28" rx="9" fill="#C8243C" ${sw(.8)}/></g>
      ${house(ox + 250, oy - 70, 60, 52, '#F6E7C1', '#7A3A3A')}${fir(ox + 335, oy - 60, .9)}${fir(ox + 175, oy - 40, .6)}
      <ellipse cx="${ox + 70}" cy="${oy - 130}" rx="40" ry="14" fill="#BFE3F2" ${sw(1)}/><path d="M${ox + 44} ${oy - 132} q20 -4 40 0" stroke="#fff" stroke-width="1.6" fill="none"/>
      <g><g transform="translate(0 0)"><path d="M-2 0 v-6 M2 0 v-6" stroke="#2A2A2A" stroke-width="1.4"/><path d="M-4 -6 q0 -8 4 -9 q4 1 4 9z" fill="#C8243C"/><circle cy="-17" r="2.6" fill="#F0C9A8"/></g><animateMotion dur="9s" repeatCount="indefinite" path="M${ox + 40} ${oy - 128} a30 8 0 1 0 60 0 a30 8 0 1 0 -60 0"/></g>
      <g><g><path d="M-2 0 v-6 M2 0 v-6" stroke="#2A2A2A" stroke-width="1.4"/><path d="M-4 -6 q0 -8 4 -9 q4 1 4 9z" fill="#2E4A8A"/><circle cy="-17" r="2.6" fill="#F0C9A8"/></g><animateMotion dur="9s" begin="-4.5s" repeatCount="indefinite" path="M${ox + 40} ${oy - 128} a30 8 0 1 0 60 0 a30 8 0 1 0 -60 0"/></g>
      <g transform="translate(${ox + 300} ${oy - 120})"><circle cy="-8" r="9" fill="#fff" ${sw(.8)}/><circle cy="-22" r="6" fill="#fff" ${sw(.8)}/><path d="M0 -22 l5 1 l-5 1z" fill="#F28C28"/><rect x="-4" y="-34" width="8" height="6" fill="#2A2A2A"/><path d="M-5 -16 q5 3 10 0" stroke="#C8243C" stroke-width="2.4"/></g>
      ${[[ox + 48, oy - 40], [ox + 186, oy - 40], [ox + 330, oy - 100]].map(([a, b]) => lamppost(a, b)).join('')}
      <path d="M${ox + 40} ${oy - 30} q120 30 260 0" stroke="#8C5A31" stroke-width="5" fill="none"/><path d="M${ox + 40} ${oy - 30} q120 30 260 0" stroke="#CFC6B8" stroke-width="2" fill="none" stroke-dasharray="2 5"/>
      <g transform="translate(${ox + 120} ${oy - 18})"><rect x="-16" y="-12" width="22" height="12" rx="3" fill="#C8243C" ${sw(.8)}/><rect x="2" y="-18" width="10" height="18" fill="#2F6B3A" ${sw(.8)}/><circle cx="-10" cy="1" r="3" fill="${K}"/><circle cx="6" cy="1" r="3" fill="${K}"/><rect x="18" y="-10" width="18" height="10" fill="#3FB6C4" ${sw(.8)}/><rect x="40" y="-10" width="18" height="10" fill="#F6D04A" ${sw(.8)}/></g></g>`;
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
      ${place('potager', 'Silence ça truffe, le potager', potager(), bannerSign(380, 140, 'Le potager', '#E8432E'))}
      ${place('jardin', 'La grande serre, le jardin-boutique', serre(), bannerSign(1216, 380, 'La grande serre', '#2F8A6A'))}
      ${place('bouquet', 'L’atelier bouquet', atelier(), bannerSign(340, 890, 'L’atelier bouquet', '#D9487A'))}
      ${place('noel', 'Le village de Noël', noel(), bannerSign(1260, 890, 'Le village de Noël', '#2E4A8A'))}
      ${place('galerie', 'La galerie', galerie(), bannerSign(640, 640, 'La galerie', '#E8A62E'))}
      ${place('clinique', 'La clinique des plantes', clinique(), bannerSign(950, 650, 'La clinique', '#1F8FA8'))}
      ${birds}
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
      <header class="hub2-head"><h1>Le Grand Jardin</h1><p>Six lieux. Un seul jardin.<br>Clique pour entrer.</p></header>
      <div class="map2">${svg()}</div>
      <nav class="tiles" aria-label="Tous les espaces">${TILES.map(([p, n, t, c]) => `<a class="tile" href="#${p}" style="--c:${c}"><b>${n}</b><span>${t}</span></a>`).join('')}
        <a class="tile tile-ghost" href="#coulisses" style="--c:#22303A"><b>Les coulisses</b><span>Ce qui fait tourner l’île.</span></a></nav>
    </div>`;
  }
  return { mount };
})();
route('', { title: '', mount: (el) => HubMap.mount(el) });
