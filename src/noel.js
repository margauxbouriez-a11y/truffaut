/* ============================================================
   LE VILLAGE DE NOËL — chaque élément est un produit Truffaut
   ============================================================ */
const Noel = (() => {
  let PARTS = null, walk = null, photoState = 'photo-wait';
  let el, night = true, mode = 'walk', fails = 0, zoom = window.innerWidth < 700 ? 1.8 : 1.4;
  const W = 1400, H = 820;
  const it = (id) => VILLAGE.find((v) => v.id === id);

  /* ---------- petits dessins ---------- */
  // Petit personnage victorien : manteau long, écharpe, bottes, chapeau haut-de-forme ou bonnet à pompon
  const person = (x, y, coat = '#EE5D45', s = 1, hat = '#fff', extra = '') => {
    const dark = Deco.shade(coat, -0.3), scarf = coat === '#EE5D45' || coat === '#E04E2E' ? '#2F7A44' : '#E04E2E';
    const top = s >= .85 && hat !== '#fff';
    return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-5 0 v-7 M5 0 v-7" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M-8 0 h6 M2 0 h6" stroke="#2B2B2B" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M-10 -5 Q-12 -27 -6 -29 L6 -29 Q12 -27 10 -5 Q0 -2 -10 -5Z" fill="${coat}" stroke="${INK}" stroke-width="1.8"/>
    <path d="M3 -29 Q11 -27 10 -5 Q6 -4 3 -4Z" fill="url(#hatch)"/><path d="M0 -28 V-5" stroke="${dark}" stroke-width="1.2"/>
    <circle cx="-1.6" cy="-22" r=".9" fill="${INK}"/><circle cx="-1.6" cy="-16" r=".9" fill="${INK}"/><circle cx="-1.6" cy="-10" r=".9" fill="${INK}"/>
    <path d="M-10 -24 q-5 6 -3 12 M10 -24 q5 6 3 12" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M-10 -24 q-5 6 -3 12 M10 -24 q5 6 3 12" fill="none" stroke="${coat}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M-7 -29 Q0 -25 7 -29 L6 -32 Q0 -29 -6 -32Z M3 -29 l3 9 l-4 0z" fill="${scarf}" stroke="${INK}" stroke-width="1.1"/>
    <circle cx="0" cy="-38" r="7.5" fill="#F3D2B8" stroke="${INK}" stroke-width="1.6"/><circle cx="-2.6" cy="-38.5" r=".9" fill="${INK}"/><circle cx="2.6" cy="-38.5" r=".9" fill="${INK}"/>
    <circle cx="-4" cy="-35.5" r="1.6" fill="#EE9AAE" opacity=".8"/><circle cx="4" cy="-35.5" r="1.6" fill="#EE9AAE" opacity=".8"/><path d="M-1.5 -34.5 q1.5 1.2 3 0" stroke="${INK}" stroke-width=".8" fill="none"/>
    ${top ? `<rect x="-6" y="-56" width="12" height="12" fill="#2B2B2B" stroke="${INK}" stroke-width="1.4"/><path d="M-10 -44 h20" stroke="#2B2B2B" stroke-width="3" stroke-linecap="round"/><path d="M-6 -47 h12" stroke="${hat}" stroke-width="2"/>`
          : `<path d="M-8 -40 Q-8 -50 0 -50 Q8 -50 8 -40Z" fill="${hat}" stroke="${INK}" stroke-width="1.4"/><path d="M-8.5 -41 h17" stroke="${Deco.shade(hat === '#fff' ? '#DDDDDD' : hat, -0.15)}" stroke-width="2.6" stroke-linecap="round"/><circle cy="-51" r="2.6" fill="#fff" stroke="${INK}" stroke-width="1"/>`}
    ${extra}</g>`;
  };
  // Toit couvert d'une épaisse couche de neige, avec coulures et stalactites
  const snowRoof = (x, y, w) => {
    let drips = '', ice = '';
    for (let i = w; i >= 0; i -= 9) { const h = 4 + ((Math.round(i) * 7) % 9); drips += ` Q${(x + i - 2).toFixed(1)} ${y + 8 + h} ${(x + i - 4.5).toFixed(1)} ${y + 8 + (Math.round(i) % 2 ? 2 : 5)}`; }
    for (let i = 4; i < w; i += 11) ice += `<path d="M${x + i} ${y + 9} l1.6 ${5 + (i % 4) * 2} l1.6 ${-(5 + (i % 4) * 2)}" fill="#E8F4FA" stroke="${INK}" stroke-width=".7"/>`;
    return `<path d="M${x - 6} ${y + 2} Q${x - 4} ${y - 9} ${x + w * .2} ${y - 7} Q${x + w * .45} ${y - 13} ${x + w * .65} ${y - 8} Q${x + w * .9} ${y - 12} ${x + w + 6} ${y + 1} L${x + w + 4} ${y + 8}${drips} L${x - 4} ${y + 8} Z" fill="#fff" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M${x + w * .25} ${y - 5} q${w * .15} -4 ${w * .3} 0" stroke="#D6E6F0" stroke-width="2" fill="none"/>${ice}`;
  };
  // Fenêtre à petits carreaux, lumière chaude, rideaux et appui enneigé
  const win = (x, y, w = 14, h = 14) => `<g><rect x="${x - 1.5}" y="${y - 1.5}" width="${w + 3}" height="${h + 3}" rx="1.5" fill="#5E3B22" stroke="${INK}" stroke-width="1.2"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" class="lit" fill="#FFD35A"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#winGlow)"/>
    <path d="M${x} ${y} q${w * .2} ${h * .5} 0 ${h} M${x + w} ${y} q${-w * .2} ${h * .5} 0 ${h}" fill="#C8243C" opacity=".75"/>
    <path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="#5E3B22" stroke-width="1.3"/>
    <path d="M${x - 3} ${y + h + 2} h${w + 6} q-2 -4 -${(w + 6) / 2} -3 q-${(w + 6) / 2 - 2} -1 -${(w + 6) / 2} 3z" fill="#fff" stroke="${INK}" stroke-width=".8"/></g>`;
  // Sapin floqué : trois étages découpés, paquets de neige, tronc
  const fir = (x, y, s = 1) => {
    const tier = (yy, w, h) => { let d = `M0 ${yy - h}`; const n = 5; for (let i = 0; i <= n; i++) d += ` L${w * (i / n)} ${yy - h * (1 - i / n) + (i % 2 ? 4 : 0)}`; d += ` L${-w} ${yy}`; for (let i = n; i >= 0; i--) d += ` L${-w * (i / n)} ${yy - h * (1 - i / n) + (i % 2 ? 4 : 0)}`; return d + 'Z'; };
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="-8" width="10" height="12" fill="#6B4528" stroke="${INK}" stroke-width="1.6"/>
    ${[[-4, 36, 40], [-30, 28, 36], [-54, 19, 34]].map(([yy, w, h], i) => `<path d="${tier(yy, w, h)}" fill="${i % 2 ? '#2B6A3C' : '#24603A'}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="${tier(yy, w, h)}" fill="url(#hatch)" opacity=".7"/>
      <path d="M${-w * .9} ${yy - 2} q${w * .3} -7 ${w * .55} -2 q${w * .35} -8 ${w * .7} -1 q${w * .3} -6 ${w * .62} 1 l0 3 q${-w * .9} 4 ${-w * 1.85} 0z" fill="#fff" stroke="${INK}" stroke-width="1"/>
      <circle cx="${-w * .35}" cy="${yy - h * .45}" r="${3 + i}" fill="#fff"/><circle cx="${w * .3}" cy="${yy - h * .6}" r="${2.5 + i * .6}" fill="#fff"/>`).join('')}
    <path d="M-7 -82 q7 -10 14 0 q-7 4 -14 0z" fill="#fff" stroke="${INK}" stroke-width="1"/></g>`;
  };
  // Maison à colombages
  const tudor = (x, y, w, h, wall = '#F3E9D2', roof = '#7A4E2D', opts = {}) => {
    let beams = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${wall}" stroke="${INK}" stroke-width="1.8"/>`;
    beams += `<rect x="${x}" y="${y - h * .42}" width="${w}" height="${h * .42}" fill="#B9A58A" stroke="${INK}" stroke-width="1.4"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < Math.ceil(w / 12); c++) beams += `<rect x="${x + c * 12 + (r % 2) * 6}" y="${y - h * .42 + r * (h * .105)}" width="12" height="${h * .105}" fill="none" stroke="${INK}" stroke-width=".5" opacity=".45"/>`;
    beams += `<path d="M${x} ${y - h * .42} H${x + w} M${x} ${y - h + 3} H${x + w}" stroke="#4A2E1A" stroke-width="3.2"/>`;
    for (let i = 0; i <= w; i += w / 4) beams += `<path d="M${x + i} ${y - h} V${y - h * .42}" stroke="#4A2E1A" stroke-width="2.6"/>`;
    for (let i = 0; i < w - 1; i += w / 4) beams += `<path d="M${x + i} ${y - h * .42} L${x + i + w / 8} ${y - h * .71} L${x + i + w / 4} ${y - h * .42}" stroke="#4A2E1A" stroke-width="1.6" fill="none"/>`;
    beams += `<rect x="${x + w * .62}" y="${y - h}" width="${w * .38}" height="${h}" fill="url(#hatch)" opacity=".6"/>`;
    const rx = x - 8, rw = w + 16, peak = y - h - h * .62;
    let shingles = '';
    for (let k = 1; k < 5; k++) { const yy = y - h - (h * .62) * (k / 5); const half = (rw / 2) * (1 - k / 5); shingles += `<path d="M${x + w / 2 - half} ${yy} ${Array.from({ length: Math.max(1, Math.round(half / 6)) }, (_, j) => `q3 4 6 0`).join(' ')} ${Array.from({ length: Math.max(1, Math.round(half / 6)) }, () => `q3 4 6 0`).join(' ')}" fill="none" stroke="${INK}" stroke-width=".6" opacity=".55"/>`; }
    const roofD = `M${rx} ${y - h + 2} L${x + w / 2} ${peak} L${rx + rw} ${y - h + 2} Z`;
    let out = beams + `<rect x="${x + w * .7}" y="${peak + 6}" width="${w * .13}" height="${h * .55}" fill="#8A5A3A" stroke="${INK}" stroke-width="1.4"/>`
      + (opts.smoke !== false ? `<path class="smoke" d="M${x + w * .765} ${peak + 2} q-8 -10 0 -18 q8 -8 0 -16" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>` : '')
      + `<path d="${roofD}" fill="${roof}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>${shingles}<path d="M${x + w / 2} ${peak} L${rx + rw} ${y - h + 2} L${x + w / 2 + 6} ${y - h + 2}Z" fill="url(#hatch)"/>`
      + `<path d="M${rx - 4} ${y - h + 4} L${x + w / 2} ${peak - 7} L${rx + rw + 4} ${y - h + 4} L${rx + rw - 2} ${y - h + 11} Q${x + w * .75} ${y - h + 5} ${x + w / 2} ${peak + 7} Q${x + w * .25} ${y - h + 5} ${rx + 2} ${y - h + 11}Z" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`
      + win(x + w * .12, y - h * .9, w * .22, h * .3) + win(x + w * .62, y - h * .9, w * .22, h * .3)
      + `<path d="M${x + w * .4} ${y} v${-h * .32} a${w * .1} ${w * .1} 0 0 1 ${w * .2} 0 v${h * .32}z" fill="#5E3B22" stroke="${INK}" stroke-width="1.4"/><circle cx="${x + w * .5}" cy="${y - h * .26}" r="${w * .05}" fill="none" stroke="#2F7A44" stroke-width="2.4"/><circle cx="${x + w * .5}" cy="${y - h * .26 + w * .05}" r="1.4" fill="#C8243C"/>`
      + Array.from({ length: 6 }, (_, i) => `<circle cx="${x + 4 + i * (w - 8) / 5}" cy="${y - h + 6 + (i % 2) * 3}" r="2.2" class="bulb b${i % 3}" stroke="${INK}" stroke-width=".6"/>`).join('');
    if (opts.sign) out += `<rect x="${x + w * .1}" y="${y - h * .52}" width="${w * .8}" height="${h * .1 + 6}" rx="2" fill="#2F5A3A" stroke="${INK}" stroke-width="1.2"/><text x="${x + w / 2}" y="${y - h * .52 + h * .07 + 3}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="${Math.max(7, w * .1)}" fill="#F6D36A">${opts.sign}</text>`;
    return `<g>${out}</g>`;
  };
  const lamp = (x, y) => `<g transform="translate(${x} ${y})"><circle cy="-58" r="26" class="glow" fill="url(#lampG)"/><path d="M0 0 V-50" stroke="#2B2B2B" stroke-width="3.4"/><path d="M-6 0 h12" stroke="#2B2B2B" stroke-width="4"/>
    <path d="M-7 -50 h14 l-3 -12 h-8z" class="lit" fill="#FFE59A" stroke="#2B2B2B" stroke-width="1.6"/><path d="M-9 -62 h18 l-9 -7z" fill="#2B2B2B"/><path d="M-9 -63 q9 -6 18 0" stroke="#fff" stroke-width="2.4" fill="none"/>
    <path d="M0 -30 q-10 2 -12 10" stroke="#2F7A44" stroke-width="2.4" fill="none"/><circle cx="-12" cy="-19" r="2.2" fill="#C8243C"/></g>`;
  const bench = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-20 0 v-10 M20 0 v-10 M-18 -10 v-12 M18 -10 v-12" stroke="#2B2B2B" stroke-width="2.4"/><rect x="-22" y="-13" width="44" height="4" fill="#8A5A3A" stroke="${INK}" stroke-width="1"/>
    <rect x="-20" y="-24" width="40" height="3.4" fill="#8A5A3A" stroke="${INK}" stroke-width="1"/><rect x="-20" y="-19" width="40" height="3.4" fill="#8A5A3A" stroke="${INK}" stroke-width="1"/><path d="M-22 -14 q22 -6 44 0 l0 -2 q-22 -6 -44 0z M-20 -25 q20 -5 40 0" fill="#fff" stroke="#fff" stroke-width="1.6"/></g>`;
  const stand = (x, y, roof, sign, goods) => `<g transform="translate(${x} ${y})">
    <rect x="-44" y="-50" width="88" height="50" fill="#B98556" stroke="${INK}" stroke-width="1.8"/>
    ${[-30, -15, 0, 15, 30].map((k) => `<path d="M${k} -50 V0" stroke="${INK}" stroke-width=".6" opacity=".4"/>`).join('')}<rect x="14" y="-50" width="30" height="50" fill="url(#hatch)" opacity=".6"/>
    <rect x="-40" y="-44" width="80" height="16" fill="#3A2A1E" stroke="${INK}" stroke-width="1.2"/><rect x="-40" y="-44" width="80" height="16" fill="url(#winGlow)" class="lit" opacity=".75"/>
    ${[-32, -20, -8, 4, 16, 28].map((k, i) => `<rect x="${k}" y="-40" width="8" height="${8 + (i % 2) * 3}" rx="1" fill="${['#C8243C', '#F0A830', '#5B8FD6', '#7CC46A', '#EE9AAE', '#FFFFFF'][i]}" stroke="${INK}" stroke-width=".6"/>`).join('')}
    <rect x="-46" y="-30" width="92" height="10" fill="#E9D2A8" stroke="${INK}" stroke-width="1.4"/><path d="M-46 -30 q46 -5 92 0 v-3 q-46 -5 -92 0z" fill="#fff" stroke="${INK}" stroke-width=".8"/>${goods}
    <rect x="-40" y="-14" width="22" height="14" fill="#C9A06A" stroke="${INK}" stroke-width="1.2"/><path d="M-40 -7 h22 M-29 -14 v14" stroke="${INK}" stroke-width=".7"/><rect x="22" y="-12" width="18" height="12" fill="#C9A06A" stroke="${INK}" stroke-width="1.2"/><path d="M22 -12 l18 12 M40 -12 l-18 12" stroke="${INK}" stroke-width=".6"/>
    <path d="M-52 -50 L-40 -76 H40 L52 -50 Z" fill="${roof}" stroke="${INK}" stroke-width="1.8"/>${[-30, -10, 10, 30].map((k) => `<path d="M${k} -76 L${k * 1.3} -50" stroke="#fff" stroke-width="5" opacity=".75"/>`).join('')}
    ${[-52, -32, -12, 8, 28].map((k) => `<path d="M${k} -50 v6 a10 10 0 0 0 20 0 v-6" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`).join('')}
    ${snowRoof(-46, -80, 92)}
    <path d="M-50 -48 v10 M50 -48 v10" stroke="${INK}" stroke-width="1"/><g class="lantern"><rect x="-54" y="-38" width="8" height="10" rx="2" class="lit" fill="#FFD35A" stroke="${INK}" stroke-width="1"/></g><g class="lantern"><rect x="46" y="-38" width="8" height="10" rx="2" class="lit" fill="#FFD35A" stroke="${INK}" stroke-width="1"/></g>
    <rect x="-32" y="-102" width="64" height="20" rx="3" fill="#F3E9D2" stroke="${INK}" stroke-width="1.4"/><text x="0" y="-88" text-anchor="middle" class="vsign">${sign}</text><circle cx="-32" cy="-92" r="6" fill="none" stroke="#2F7A44" stroke-width="3"/><circle cx="-32" cy="-86" r="1.6" fill="#C8243C"/>
    ${[-36, -18, 0, 18, 36].map((k, i) => `<circle cx="${k}" cy="-47" r="2.6" class="bulb b${i % 3}" stroke="${INK}" stroke-width=".8"/>`).join('')}</g>`;
  const item = (id, inner, label) => `<g class="vitem" data-id="${id}" tabindex="0" role="button" aria-label="${esc(label || it(id).name)}">${inner}</g>`;

  function scene() {
    const sky = `<defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky1"/><stop offset="1" class="sky2"/></linearGradient>
      <radialGradient id="winGlow" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="#FFF6D0" stop-opacity=".9"/><stop offset="1" stop-color="#F0A830" stop-opacity=".2"/></radialGradient>
      <radialGradient id="lampG"><stop offset="0" stop-color="#FFE59A" stop-opacity=".6"/><stop offset="1" stop-color="#FFE59A" stop-opacity="0"/></radialGradient>
      <path id="cablePath" d="M352 318 L688 168"/>
      <clipPath id="ringBack"><rect x="-200" y="-400" width="400" height="400"/></clipPath><clipPath id="ringFront"><rect x="-200" y="0" width="400" height="300"/></clipPath>
      <path id="ringPath" d="M-74 0 a74 15 0 1 0 148 0 a74 15 0 1 0 -148 0"/>
      <path id="sleighPath" d="M-260 170 C200 90 500 230 800 140 S1300 110 1700 160"/>
      <path id="trackPath" d="M470 690 C470 640 560 630 740 630 C920 630 1060 640 1060 690 C1060 745 920 760 740 760 C560 760 470 745 470 690 Z"/>
      <path id="pondPath" d="M105 668 a80 22 0 1 0 160 0 a80 22 0 1 0 -160 0"/>
      <path id="slopePath" d="M110 380 Q190 410 260 448 Q300 466 330 470"/>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <g class="stars">${Array.from({ length: 50 }, (_, i) => `<circle cx="${(i * 283) % W}" cy="${(i * 97) % 330 + 10}" r="${i % 4 ? 1.6 : 2.6}" fill="#fff" style="animation-delay:${(i % 7) * .4}s"/>`).join('')}</g>
    <g class="moon"><circle cx="1240" cy="90" r="38" fill="#FFF3C4" stroke="${INK}" stroke-width="3"/><circle cx="1258" cy="80" r="34" class="moon-cut"/></g>`;
    const hills = `<path d="M0 340 Q160 260 360 340 T760 330 T1150 320 T${W} 330 V${H} H0 Z" fill="#EEF4FA" stroke="${INK}" stroke-width="3"/>
      <path d="M0 470 Q300 430 700 470 T${W} 460 V${H} H0Z" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/>
      <path d="M90 372 Q190 408 330 474" stroke="#D5E3F0" stroke-width="22" fill="none" stroke-linecap="round"/>`;


    /* Montagne rocheuse enneigée, chalets perchés et téléphérique */
    const rock = `<path d="M240 345 L330 250 L380 270 L450 170 L510 210 L590 110 L660 180 L720 140 L800 230 L860 200 L960 300 L1010 345Z" fill="#9AA3A8" stroke="${INK}" stroke-width="2"/>
      <path d="M590 110 L620 345 M450 170 L470 345 M720 140 L700 345 M330 250 L360 345 M860 200 L840 345 M510 210 L540 300 M660 180 L640 290" stroke="${INK}" stroke-width=".9" opacity=".45" fill="none"/>
      <path d="M590 110 L660 180 L640 345 L620 345Z M450 170 L510 210 L480 345 L470 345Z M720 140 L800 230 L760 345 L700 345Z M860 200 L960 300 L900 345 L840 345Z" fill="url(#hatch)"/>
      <path d="M560 146 L590 110 L620 140 L606 150 L592 138 L578 154Z M430 196 L450 170 L474 186 L462 196 L450 188 L440 202Z M700 160 L720 140 L748 172 L732 176 L720 162 L708 174Z M842 214 L860 200 L888 228 L872 230 L860 218 L850 230Z M318 262 L330 250 L352 258 L340 266Z" fill="#fff" stroke="${INK}" stroke-width="1.2"/>
      <path d="M330 300 q60 -14 120 0 q50 10 100 -4 M520 250 q60 -10 110 6 M690 260 q70 -12 140 4 M380 330 q90 -10 180 2 q120 10 240 -4 q90 -8 160 4" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    const perched = [[400, 300, 46, 34, '#E86F5A'], [560, 252, 40, 30, '#5B8FD6'], [700, 262, 44, 32, '#F3E9D2'], [860, 296, 42, 30, '#F6D36A']]
      .map(([x, y, w, h, c], i) => tudor(x, y, w, h, c, ['#7A4E2D', '#3E5A4A', '#7A3A3A', '#5E3B22'][i])).join('')
      + [[470, 300, .4], [630, 254, .38], [800, 268, .42], [930, 312, .4], [520, 246, .3], [760, 230, .3], [360, 318, .36]].map(([x, y, sc]) => fir(x, y, sc)).join('');
    const cable = `<path d="M352 318 L688 168" stroke="${INK}" stroke-width="1.6"/><path d="M352 324 L688 174" stroke="${INK}" stroke-width=".9" opacity=".6"/>
      <g transform="translate(340 336)"><rect x="-16" y="-24" width="32" height="24" fill="#B9A58A" stroke="${INK}" stroke-width="1.6"/><path d="M-20 -24 L0 -36 L20 -24Z" fill="#7A3A3A" stroke="${INK}" stroke-width="1.6"/>${snowRoof(-20, -32, 40)}<circle cx="8" cy="-16" r="5" fill="#888" stroke="${INK}" stroke-width="1.2"/></g>
      <g transform="translate(700 186)"><rect x="-16" y="-24" width="32" height="24" fill="#B9A58A" stroke="${INK}" stroke-width="1.6"/><path d="M-20 -24 L0 -36 L20 -24Z" fill="#7A3A3A" stroke="${INK}" stroke-width="1.6"/>${snowRoof(-20, -32, 40)}<circle cx="-8" cy="-16" r="5" fill="#888" stroke="${INK}" stroke-width="1.2"/></g>
      <g><g transform="translate(0 0)"><path d="M0 -2 V10" stroke="${INK}" stroke-width="1.6"/><rect x="-11" y="10" width="22" height="18" rx="4" fill="#C8243C" stroke="${INK}" stroke-width="1.6"/><rect x="-8" y="13" width="7" height="7" class="lit" fill="#FFD35A" stroke="${INK}" stroke-width=".8"/><rect x="1" y="13" width="7" height="7" class="lit" fill="#FFD35A" stroke="${INK}" stroke-width=".8"/><path d="M-12 10 q12 -5 24 0" stroke="#fff" stroke-width="2" fill="none"/></g>
        <animateMotion dur="22s" repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;.45;.5;.95;1" calcMode="linear"><mpath href="#cablePath"/></animateMotion></g>`;
    const mountain = `<g class="decor" aria-hidden="true">${rock}${perched}${cable}</g>`;

    /* Grande tour-horloge à colombages, manège de rennes et heure réelle */
    const now = new Date(); const mAng = now.getMinutes() * 6 + now.getSeconds() * .1, hAng = (now.getHours() % 12) * 30 + now.getMinutes() * .5;
    const reindeerRing = (clip) => `<g clip-path="url(#${clip})">${[0, 1, 2, 3, 4].map((i) => `<g><g transform="scale(.85)"><path d="M-14 0 c0 -10 6 -14 16 -12 l6 -10 l5 3 l-4 9 c4 2 4 8 0 10 l-2 6 h-3 l0 -6 h-12 l-2 6 h-3z" fill="#C9874F" stroke="${INK}" stroke-width="1.2"/>
        <path d="M10 -22 l-3 -8 M10 -22 l4 -7 M7 -28 l-4 -2 M14 -27 l4 -2" stroke="#6B4528" stroke-width="1.4" fill="none"/><circle cx="15" cy="-14" r="1.6" fill="#C8243C"/><path d="M-4 -12 q4 -4 10 0" fill="#C8243C" stroke="${INK}" stroke-width=".6"/><path d="M0 -12 V-34" stroke="#D9B98A" stroke-width="1.6"/></g>
        <animateMotion dur="9s" begin="${-i * 1.8}s" repeatCount="indefinite"><mpath href="#ringPath"/></animateMotion></g>`).join('')}</g>`;
    const tower = `<g class="decor" aria-hidden="true" transform="translate(1170 560)">
      <rect x="-46" y="-90" width="92" height="90" fill="#D9C6A8" stroke="${INK}" stroke-width="1.8"/>
      ${Array.from({ length: 7 }, (_, r) => Array.from({ length: 8 }, (_, c) => `<rect x="${-46 + c * 12 + (r % 2) * 6}" y="${-90 + r * 13}" width="12" height="13" fill="none" stroke="${INK}" stroke-width=".5" opacity=".4"/>`).join('')).join('')}
      <path d="M-30 0 v-34 a14 14 0 0 1 28 0 v34z M4 0 v-34 a14 14 0 0 1 28 0 v34z" fill="#C8243C" stroke="${INK}" stroke-width="1.4"/><path d="M-22 -4 v-26 a6 6 0 0 1 12 0 v26z M12 -4 v-26 a6 6 0 0 1 12 0 v26z" fill="#2F7A44" stroke="${INK}" stroke-width="1"/>
      <rect x="10" y="-90" width="36" height="90" fill="url(#hatch)" opacity=".6"/>
      <path d="M-56 -90 h112 l-8 -12 h-96z" fill="#3E3E3E" stroke="${INK}" stroke-width="1.6"/>${snowRoof(-56, -104, 112)}
      ${reindeerRing('ringBack').replace('<g clip-path', '<g transform="translate(0 -122)"><g clip-path') + '</g>'}
      <rect x="-34" y="-230" width="68" height="128" fill="#F3E9D2" stroke="${INK}" stroke-width="1.8"/>
      <path d="M-34 -230 V-102 M34 -230 V-102 M-17 -230 V-102 M17 -230 V-102 M-34 -166 H34 M-34 -226 H34" stroke="#4A2E1A" stroke-width="2.6"/>
      <path d="M-34 -166 L-17 -140 L0 -166 L17 -140 L34 -166 M-34 -102 L-17 -128 L0 -102 L17 -128 L34 -102" stroke="#4A2E1A" stroke-width="1.6" fill="none"/>
      <rect x="-12" y="-150" width="24" height="34" rx="12" fill="#5E3B22" stroke="${INK}" stroke-width="1.2"/><rect x="-9" y="-146" width="18" height="28" rx="9" class="lit" fill="#9FD3A0" stroke="${INK}" stroke-width="1"/><path d="M0 -146 V-118 M-9 -132 H9" stroke="#5E3B22" stroke-width="1.2"/>
      <rect x="6" y="-230" width="28" height="128" fill="url(#hatch)" opacity=".55"/>
      <circle cx="0" cy="-196" r="22" fill="#5E3B22" stroke="${INK}" stroke-width="1.6"/><circle cx="0" cy="-196" r="18" fill="#FBF6E6" stroke="${INK}" stroke-width="1.2"/>
      ${Array.from({ length: 12 }, (_, i) => `<path d="M0 -213 v${i % 3 ? 2 : 4}" stroke="${INK}" stroke-width="${i % 3 ? .8 : 1.6}" transform="rotate(${i * 30} 0 -196)"/>`).join('')}
      <path d="M0 -196 V-207" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="${hAng} 0 -196" to="${hAng + 360} 0 -196" dur="43200s" repeatCount="indefinite"/></path>
      <path d="M0 -196 V-211" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="${mAng} 0 -196" to="${mAng + 360} 0 -196" dur="3600s" repeatCount="indefinite"/></path><circle cx="0" cy="-196" r="1.8" fill="${INK}"/>
      <path d="M-46 -230 h92 l-10 -12 h-72z" fill="#3E3E3E" stroke="${INK}" stroke-width="1.6"/>${snowRoof(-46, -244, 92)}
      <path d="M-40 -246 L0 -330 L40 -246Z" fill="#3E3E3E" stroke="${INK}" stroke-width="1.8"/>
      ${Array.from({ length: 6 }, (_, k) => `<path d="M${-40 + k * 7} ${-246 - k * 14} h${80 - k * 14}" stroke="#777" stroke-width=".8"/>`).join('')}
      <path d="M-40 -246 L0 -330 L-6 -246Z" fill="url(#hatchL)"/><path d="M-44 -246 q-2 -10 6 -12 q16 6 22 -6 q10 10 20 2 q12 10 24 -2 q8 6 18 16z" fill="#fff" stroke="${INK}" stroke-width="1.2"/>
      <circle cx="0" cy="-268" r="9" fill="none" stroke="#2F7A44" stroke-width="5"/><path d="M-4 -260 l4 6 l4 -6" fill="#C8243C"/><path d="M0 -330 V-352" stroke="${INK}" stroke-width="2"/><path d="M0 -352 l12 4 l-12 4" fill="#C8243C" stroke="${INK}" stroke-width="1"/>
      ${Array.from({ length: 9 }, (_, i) => `<circle cx="${-40 + i * 10}" cy="${-232 + (i % 2) * 3}" r="2.2" class="bulb b${i % 3}" stroke="${INK}" stroke-width=".6"/>`).join('')}
      <g transform="translate(0 -122)">${reindeerRing('ringFront')}</g>
      <path d="M-78 -122 a78 17 0 0 0 156 0" fill="none" stroke="#C48A55" stroke-width="2"/>
    </g>`;

    /* Boutiques à colombages en arrière-plan, lampadaires, bancs, grand sapin floqué, traces de pas */
    const shops = `<g class="decor" aria-hidden="true">${tudor(150, 476, 62, 54, '#F3E9D2', '#7A3A3A', { sign: 'Boutique de Noël' })}${tudor(700, 470, 56, 50, '#F6E7C1', '#3E5A4A', { sign: 'Pâtisserie' })}${tudor(1018, 478, 54, 48, '#E9D2D2', '#5E3B22', { sign: 'Jouets' })}</g>`;
    const lamps = `<g class="decor" aria-hidden="true">${lamp(205, 640)}${lamp(560, 625)}${lamp(870, 610)}${lamp(1120, 690)}${lamp(1390, 760)}${bench(240, 760)}${bench(1160, 640)}</g>`;
    const bigTree = `<g class="decor" aria-hidden="true">${fir(1355, 620, 1.35)}${Array.from({ length: 10 }, (_, i) => `<circle cx="${1355 + Math.sin(i * 2.1) * (8 + i * 3)}" cy="${620 - 20 - i * 9}" r="2.4" class="bulb b${i % 3}" stroke="${INK}" stroke-width=".6"/>`).join('')}</g>`;
    const prints = `<g class="decor" aria-hidden="true" opacity=".35">${Array.from({ length: 26 }, (_, i) => `<ellipse cx="${300 + i * 24}" cy="${612 + Math.sin(i * .7) * 6 + (i % 2) * 6}" rx="3" ry="1.8" fill="#8FA6C0"/>`).join('')}${Array.from({ length: 16 }, (_, i) => `<ellipse cx="${1080 + i * 18}" cy="${720 - i * 4 + (i % 2) * 6}" rx="3" ry="1.8" fill="#8FA6C0"/>`).join('')}</g>`;
    const sparkle = `<g class="decor sparkle" aria-hidden="true">${Array.from({ length: 70 }, (_, i) => `<circle cx="${(i * 197) % W}" cy="${480 + (i * 61) % 330}" r="${i % 5 ? .9 : 1.6}" fill="#BFD6EA"/>`).join('')}</g>`;
    const bank = `<g class="decor" aria-hidden="true"><path d="M0 ${H} V${H - 26} Q80 ${H - 52} 170 ${H - 30} T360 ${H - 24} T560 ${H - 36} T780 ${H - 22} T1000 ${H - 34} T1220 ${H - 20} T${W} ${H - 30} V${H}Z" fill="#fff" stroke="${INK}" stroke-width="1.6"/>
      ${[[40, H - 34], [520, H - 38], [960, H - 36]].map(([x, y]) => fir(x, y, .45)).join('')}${[[300, H - 26], [700, H - 26], [1300, H - 28]].map(([x, y]) => `<path d="${blob(x, y, 22, 10, 8, .3, x)}" fill="#E8F1F8" stroke="${INK}" stroke-width="1"/>`).join('')}</g>`;


    const garlandLights = `<g class="decor" aria-hidden="true">${[[205, 582, 560, 567], [560, 567, 870, 552]].map(([x1, y1, x2, y2]) => { const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + 28; return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="#2F5A3A" stroke-width="1.4"/>` + Array.from({ length: 14 }, (_, i) => { const t = (i + 1) / 15, x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} v3" stroke="#2F5A3A"/><circle cx="${x.toFixed(1)}" cy="${(y + 5).toFixed(1)}" r="2.6" class="bulb b${i % 3}" stroke="${INK}" stroke-width=".6"/>`; }).join(''); }).join('')}</g>`;
    const book = '<rect x="-7" y="-24" width="9" height="6" fill="#C8243C" stroke="#1F3A2E" stroke-width=".8"/>';
    const carolers = `<g class="decor" aria-hidden="true">${person(1240, 590, '#2E4A8A', .9, '#C8243C', book)}${person(1262, 594, '#7A3A3A', .85, '#fff', book)}${person(1284, 590, '#2F7A44', .9, '#2B2B2B', book)}${person(1252, 606, '#F0A830', .6, '#fff')}
      <text x="1236" y="530" class="note" font-size="16">♪</text><text x="1290" y="522" class="note n2" font-size="16">♫</text></g>`;
    const snowman = `<g class="decor" aria-hidden="true" transform="translate(110 770)"><circle cy="-14" r="16" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cy="-40" r="11" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cy="-58" r="8" fill="#fff" stroke="${INK}" stroke-width="1.6"/>
      <path d="M-1 -58 l9 2 l-9 2z" fill="#F0A830"/><circle cx="-3" cy="-61" r="1.1" fill="${INK}"/><circle cx="2" cy="-61" r="1.1" fill="${INK}"/><rect x="-6" y="-76" width="12" height="11" fill="#2B2B2B"/><path d="M-10 -65 h20" stroke="#2B2B2B" stroke-width="2.4"/>
      <path d="M-9 -48 q9 5 18 0 l2 10 h-5 l-2 -6" fill="#C8243C" stroke="${INK}" stroke-width=".8"/><path d="M-10 -40 l-16 -10 M10 -40 l14 -12" stroke="#6B4528" stroke-width="2"/><circle cy="-40" r="1.2" fill="${INK}"/><circle cy="-34" r="1.2" fill="${INK}"/>
      ${person(-30, 4, '#5B8FD6', .6, '#F0A830')}${person(34, 4, '#EE9AAE', .6, '#fff')}<g transform="translate(50 8)"><path d="M-14 0 h26 q6 0 6 -6" fill="none" stroke="#C8243C" stroke-width="2.4"/><rect x="-12" y="-6" width="22" height="4" fill="#B98556" stroke="${INK}" stroke-width=".8"/></g></g>`;
    const birds = `<g class="decor" aria-hidden="true">${[[488, 268], [512, 266], [1062, 413], [732, 420]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse rx="5" ry="4" fill="#C8243C" stroke="${INK}" stroke-width=".9"/><circle cx="4" cy="-3" r="2.6" fill="#C8243C" stroke="${INK}" stroke-width=".8"/><path d="M6 -3 l3 1 l-3 1" fill="#F0A830"/><path d="M-4 0 l-5 2" stroke="${INK}" stroke-width="1"/></g>`).join('')}</g>`;

    // Père Noël dans les airs : le traîneau traverse le ciel, une famille le regarde
    const sleigh = item('traineau', `<g><g class="sleigh">
        <g transform="translate(-70 0)"><path d="M-14 0 l10 -16 l8 4 l4 -10 l6 6 l-6 14 h-18z" fill="#A9774C" stroke="${INK}" stroke-width="2.5"/><path d="M-4 -16 l-4 -10 M2 -14 l4 -10" stroke="${INK}" stroke-width="2.5"/><circle cx="-12" cy="-4" r="2.5" fill="#EE5D45"/></g>
        <g transform="translate(-36 4)"><path d="M-14 0 l10 -16 l8 4 l4 -10 l6 6 l-6 14 h-18z" fill="#A9774C" stroke="${INK}" stroke-width="2.5"/><path d="M-4 -16 l-4 -10 M2 -14 l4 -10" stroke="${INK}" stroke-width="2.5"/></g>
        <path d="M-58 -6 L-16 0" stroke="${INK}" stroke-width="2"/>
        <path d="M-16 4 h46 q10 0 10 -10 v-12 h-14 v8 h-34 z" fill="#EE5D45" stroke="${INK}" stroke-width="2.5"/><path d="M-20 10 h56 q8 0 10 -6" fill="none" stroke="${INK}" stroke-width="3"/>
        <rect x="12" y="-30" width="14" height="14" fill="#5BB7E6" stroke="${INK}" stroke-width="2"/><rect x="-6" y="-26" width="14" height="12" fill="#FFD35A" stroke="${INK}" stroke-width="2"/>
        ${person(2, -6, '#EE5D45', .7, '#EE5D45')}
        <animateMotion dur="16s" repeatCount="indefinite" rotate="auto"><mpath href="#sleighPath"/></animateMotion></g>
      <g transform="translate(1290 486)">${person(0, 0, '#5B6FA8', 1.1, '#2F7A44')}${person(-26, 4, '#F28DB2', .8, '#fff')}${person(24, 4, '#FFD35A', .8, '#EE5D45')}
        <path d="M-20 -26 l-6 -12 M8 -34 l4 -14" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g></g>`);

    const ski = item('ski', `<g><g class="skier">${person(0, 0, '#5BB7E6', .9, '#EE5D45')}${person(16, 2, '#FFD35A', .65, '#fff')}
        <path d="M-14 2 h26 M8 4 h22" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
        <animateMotion dur="7s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"><mpath href="#slopePath"/></animateMotion></g></g>`);

    const rennes = item('rennes', `<g><path d="${blob(470, 418, 90, 26, 9, .2, 4)}" fill="#fff" stroke="${INK}" stroke-width="1.6"/>${tudor(426, 420, 88, 74, '#E86F5A', '#5E3B22')}
        ${fir(392, 424, .62)}${Array.from({ length: 7 }, (_, i) => `<circle cx="${392 + Math.sin(i * 1.9) * (6 + i * 3)}" cy="${424 - 14 - i * 8}" r="2.4" class="bulb b${i % 3}" stroke="${INK}" stroke-width=".6"/>`).join('')}
        <path d="M372 396 q20 14 40 -6" fill="none" stroke="#2F5A3A" stroke-width="1.2"/>
        <g transform="translate(404 420)"><path d="M-14 0 c0 -10 6 -14 16 -12 l6 -10 l5 3 l-4 9 c4 2 4 8 0 10 l-2 6 h-3 l0 -6 h-12 l-2 6 h-3z" fill="#C9874F" stroke="${INK}" stroke-width="1.2"/><path d="M10 -22 l-3 -8 M10 -22 l4 -7" stroke="#6B4528" stroke-width="1.4"/><circle cx="15" cy="-14" r="1.8" fill="#C8243C"/><path d="M4 -24 q6 8 -14 6" fill="none" stroke="#2F5A3A" stroke-width="1"/><circle cx="0" cy="-19" r="2" class="bulb b0"/><circle cx="-6" cy="-18" r="2" class="bulb b1"/></g>
        <rect x="490" y="302" width="12" height="12" fill="#C8243C" stroke="${INK}" stroke-width="1"/><path d="M490 308 h12 M496 302 v12" stroke="#F0A830" stroke-width="1.6"/></g>`);
    const scout = item('scout', `<g>${tudor(604, 420, 52, 44, '#8C6A48', '#2F5A3A', { smoke: false })}<path d="M664 420 v-30 l18 6 l-18 6" fill="#C8243C" stroke="${INK}" stroke-width="1.4"/>${person(674, 422, '#7A8A4A', .6, '#C9A06A')}</g>`);

    // Les cloches de Noël sonnent : trois jeunes sonneurs tirent les cordes
    const cloches = item('cloches', `<g transform="translate(800 440)">
        <rect x="-60" y="-110" width="10" height="110" fill="#8C5A31" stroke="${INK}" stroke-width="2.5"/><rect x="50" y="-110" width="10" height="110" fill="#8C5A31" stroke="${INK}" stroke-width="2.5"/>
        <rect x="-68" y="-122" width="136" height="16" rx="4" fill="#C48A55" stroke="${INK}" stroke-width="2.5"/>${snowRoof(-70, -128, 140)}
        ${[-30, 0, 30].map((x, i) => `<g class="bell" style="animation-delay:${i * .25}s" transform="translate(${x} -104)"><path d="M-10 0 h20 q-2 4 -2 10 q0 10 8 14 h-32 q8 -4 8 -14 q0 -6 -2 -10z" fill="#FFD35A" stroke="${INK}" stroke-width="2.5"/><circle cx="0" cy="26" r="3" fill="${INK}"/></g>
          <g class="ringer" style="animation-delay:${i * .25}s"><path d="M${x} -78 V-38" stroke="#EE5D45" stroke-width="2.5"/>${person(x, 0, ['#5BB7E6', '#7CC46A', '#F28DB2'][i], .85, ['#EE5D45', '#fff', '#FFD35A'][i], `<path d="M0 -26 V-46" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`)}</g>`).join('')}</g>`);

    const ledTree = item('arbre-led', `<g transform="translate(940 476)">${fir(0, 0, 1.15)}${Array.from({ length: 24 }, (_, i) => `<circle cx="${Math.sin(i * 1.7) * (6 + (i % 8) * 3.2)}" cy="${-12 - (i % 8) * 11 - (i % 3) * 2}" r="3.6" class="bulb b${i % 3}" stroke="${INK}" stroke-width="1.2"/>`).join('')}<path d="M0 -112 l4 8 h9 l-7 6 l3 9 l-9 -5 l-9 5 l3 -9 l-7 -6 h9 z" class="lit" fill="#FFD35A" stroke="${INK}" stroke-width="2"/></g>`);

    const stands = item('churros', stand(270, 590, '#EE5D45', 'Churros', `<path d="M-30 -30 q6 -12 12 0 M-14 -30 q6 -12 12 0" stroke="#C9803A" stroke-width="5" fill="none" stroke-linecap="round"/>${person(22, -2, '#fff', .7, '#EE5D45')}`))
      + item('crepes', stand(385, 590, '#5BB7E6', 'Crêpes', `<ellipse cx="-14" cy="-28" rx="16" ry="4" fill="#F2C46A" stroke="${INK}" stroke-width="2"/>${person(22, -2, '#F28DB2', .7, '#fff')}`))
      + item('choco', stand(500, 590, '#7A4E2D', 'Chocolat', `<rect x="-30" y="-36" width="14" height="8" fill="#5E3B22" stroke="${INK}" stroke-width="1.5"/><rect x="-12" y="-36" width="14" height="8" fill="#8C5A31" stroke="${INK}" stroke-width="1.5"/>${person(24, -2, '#7CC46A', .7, '#fff')}`))
      + item('bretzels', stand(615, 590, '#2F7A44', 'Bretzels', `<path d="M-26 -30 q-10 -14 4 -14 q8 0 0 10 q-8 -10 4 -10 q12 0 0 14" fill="none" stroke="#B5722F" stroke-width="4"/>${person(22, -2, '#FFD35A', .7, '#2F7A44')}`))
      + item('marrons', `<g transform="translate(720 606)"><rect x="-24" y="-30" width="48" height="30" rx="4" fill="#5E3B22" stroke="${INK}" stroke-width="2.5"/><circle cx="-14" cy="4" r="7" fill="#444" stroke="${INK}" stroke-width="2"/><circle cx="14" cy="4" r="7" fill="#444" stroke="${INK}" stroke-width="2"/>
          <rect x="-18" y="-42" width="36" height="12" fill="#888" stroke="${INK}" stroke-width="2"/><path class="smoke" d="M0 -46 q-8 -10 0 -18 q8 -8 0 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>${person(34, 0, '#EE5D45', .75, '#fff')}</g>`);

    const shoppers = item('acheteurs', `<g transform="translate(450 650)">${person(0, 0, '#5B6FA8', .85, '#EE5D45', '<rect x="8" y="-16" width="10" height="12" fill="#FFD35A" stroke="#2E3A2A" stroke-width="2"/>')}${person(28, 2, '#F28DB2', .8, '#fff')}${person(56, 0, '#7CC46A', .85, '#FFD35A')}${person(80, 4, '#EE5D45', .6, '#5BB7E6')}</g>`);

    // Tasses du Père Noël : le manège tourne et les tasses tourbillonnent
    const tasses = item('tasses', `<g transform="translate(1060 600)">
        <ellipse cx="0" cy="0" rx="92" ry="26" fill="#E9D2A8" stroke="${INK}" stroke-width="3"/>
        <path id="cupPath" d="M-62 0 a62 18 0 1 0 124 0 a62 18 0 1 0 -124 0" fill="none"/>
        ${[0, 1, 2, 3].map((i) => `<g><g class="cup" style="animation-delay:${i * .3}s"><path d="M-18 -18 h36 q0 22 -18 22 q-18 0 -18 -22z" fill="${['#EE5D45', '#5BB7E6', '#7CC46A', '#F28DB2'][i]}" stroke="${INK}" stroke-width="2.5"/><path d="M18 -12 q10 0 8 8 q-2 6 -10 4" fill="none" stroke="${INK}" stroke-width="2.5"/>${person(0, -12, '#FFD35A', .55, '#fff')}</g><animateMotion dur="6s" begin="${-i * 1.5}s" repeatCount="indefinite"><mpath href="#cupPath"/></animateMotion></g>`).join('')}
        <rect x="-6" y="-80" width="12" height="70" fill="#C48A55" stroke="${INK}" stroke-width="2.5"/><path d="M-50 -76 Q0 -110 50 -76 Z" fill="#EE5D45" stroke="${INK}" stroke-width="2.5"/>${snowRoof(-50, -80, 100)}
        ${person(0, -14, '#EE5D45', .9, '#EE5D45')}</g>`);

    // Festival de musique autour du feu
    const feu = item('feu', `<g transform="translate(1240 640)">
        <path d="M-16 0 l32 -8 M-16 -8 l32 8" stroke="#7A4E2D" stroke-width="6" stroke-linecap="round"/>
        <g class="flame"><path d="M-12 -4 q-4 -20 6 -34 q2 12 8 8 q10 12 2 26z" fill="#EE5D45" stroke="${INK}" stroke-width="2.5"/><path d="M-4 -6 q-2 -12 4 -18 q6 10 2 18z" fill="#FFD35A"/></g>
        <circle r="70" class="glow" fill="url(#glowG)"/>
        ${[[-56, 4, '#5BB7E6', '<path d="M8 -20 l18 -12" stroke="#8C5A31" stroke-width="4"/>'], [54, 4, '#7CC46A', '<ellipse cx="-12" cy="-14" rx="9" ry="12" fill="#C48A55" stroke="#2E3A2A" stroke-width="2"/>'], [0, 34, '#F28DB2', '<rect x="-14" y="-18" width="28" height="10" fill="#fff" stroke="#2E3A2A" stroke-width="2"/>']].map(([x, y, c, inst], i) => `<g class="musician" style="animation-delay:${i * .2}s">${person(x, y, c, .9, '#EE5D45', inst)}</g>`).join('')}
        <text x="-70" y="-50" class="note" font-size="22">♪</text><text x="60" y="-60" class="note n2" font-size="22">♫</text></g>`);

    const pond = item('glace', `<g><ellipse cx="185" cy="668" rx="110" ry="36" fill="#BFE3F5" stroke="${INK}" stroke-width="3"/><path d="M110 664 q30 -8 60 0 M200 676 q30 -6 60 0" stroke="#fff" stroke-width="3" fill="none"/>
        <g>${person(-8, 0, '#EE5D45', .7, '#fff')}${person(10, 0, '#5B6FA8', .75, '#EE5D45')}<animateMotion dur="9s" repeatCount="indefinite"><mpath href="#pondPath"/></animateMotion></g></g>`);

    // Train express du Père Noël sur son ovale de rails
    const wheel = (x, r) => `<g transform="translate(${x} -3)"><circle r="${r}" fill="#2B2B2B" stroke="${INK}" stroke-width="1"/><circle r="${r * .7}" fill="#C8243C"/>${[0, 45, 90, 135].map((a) => `<path d="M${-r * .7} 0 H${r * .7}" stroke="#2B2B2B" stroke-width="1" transform="rotate(${a})"/>`).join('')}<circle r="${r * .2}" fill="#F0A830"/></g>`;
    const wagon = (c, gifts) => `<g><rect x="-22" y="-24" width="44" height="18" rx="2" fill="${c}" stroke="${INK}" stroke-width="1.6"/><path d="M-22 -18 h44 M-22 -11 h44" stroke="${INK}" stroke-width=".6" opacity=".5"/><rect x="-24" y="-8" width="48" height="4" fill="#2B2B2B"/>${gifts}${wheel(-12, 5.5)}${wheel(12, 5.5)}</g>`;
    const loco = `<g><rect x="-30" y="-26" width="40" height="20" rx="9" fill="#C8243C" stroke="${INK}" stroke-width="1.6"/>${[-20, -8, 4].map((k) => `<path d="M${k} -26 v20" stroke="#F0A830" stroke-width="2"/>`).join('')}
        <rect x="8" y="-44" width="22" height="38" rx="2" fill="#2F7A44" stroke="${INK}" stroke-width="1.6"/><path d="M5 -46 h28 l-3 -5 h-22z" fill="#2B2B2B" stroke="${INK}" stroke-width="1"/>${snowRoof(6, -52, 26)}
        <path d="M-26 -26 v-14 h-6 l2 -6 h12 l2 6 h-6 v14" fill="#2B2B2B" stroke="${INK}" stroke-width="1.2"/><path d="M-6 -26 a5 5 0 0 1 10 0" fill="#F0A830" stroke="${INK}" stroke-width="1"/>
        <rect x="-34" y="-8" width="66" height="4" fill="#2B2B2B"/><path d="M-36 -4 l-6 4 h8z" fill="#C8243C" stroke="${INK}" stroke-width="1"/>
        ${wheel(-22, 5.5)}${wheel(-8, 5.5)}${wheel(18, 8)}<path d="M-22 -3 H18" stroke="#AAB" stroke-width="2"/>
        <circle cx="-34" cy="-18" r="4" class="lit" fill="#FFE59A" stroke="${INK}" stroke-width="1.2"/>${win(12, -40, 14, 11)}<circle cx="-30" cy="-30" r="5" fill="none" stroke="#2F7A44" stroke-width="2.4"/>
        <path class="smoke" d="M-26 -48 q-8 -10 0 -18 q8 -8 0 -16" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
    const car = (inner, delay) => `<g>${inner}<animateMotion dur="14s" begin="${delay}s" repeatCount="indefinite" calcMode="linear"><mpath href="#trackPath"/></animateMotion></g>`;
    const train = item('train', `<g><use href="#trackPath" fill="none" stroke="#8C5A31" stroke-width="16"/><use href="#trackPath" fill="none" stroke="#CFC6B8" stroke-width="8" stroke-dasharray="3 9"/><use href="#trackPath" fill="none" stroke="${INK}" stroke-width="2"/>
        ${car(loco, '0')}
        ${car(wagon('#5BB7E6', `<rect x="-16" y="-40" width="14" height="14" fill="#FFD35A" stroke="${INK}" stroke-width="2"/><rect x="2" y="-38" width="14" height="12" fill="#F28DB2" stroke="${INK}" stroke-width="2"/>`), '-0.9')}
        ${car(wagon('#7CC46A', `<rect x="-14" y="-42" width="16" height="16" fill="#EE5D45" stroke="${INK}" stroke-width="2"/><rect x="4" y="-36" width="12" height="10" fill="#fff" stroke="${INK}" stroke-width="2"/>`), '-1.8')}</g>`);
    const chef = item('chef', `<g transform="translate(760 700)"><rect x="-30" y="-40" width="60" height="40" fill="#F6E7C1" stroke="${INK}" stroke-width="2.5"/><path d="M-38 -40 L0 -62 L38 -40 Z" fill="#5BB7E6" stroke="${INK}" stroke-width="2.5"/>${snowRoof(-40, -44, 80)}${win(-20, -30)}<text x="0" y="-48" text-anchor="middle" class="vsign" font-size="10">GARE</text>
        ${person(46, 0, '#2E4A8A', .85, '#2E4A8A', '<path d="M8 -20 l10 -6" stroke="#2E3A2A" stroke-width="3"/><circle cx="20" cy="-27" r="3" fill="#EE5D45"/>')}</g>`);

    const caravane = item('caravane', `<g transform="translate(1210 770)">
        <rect x="-70" y="-62" width="120" height="56" rx="22" fill="#F6E7C1" stroke="${INK}" stroke-width="3"/><path d="M-70 -30 H50" stroke="#EE5D45" stroke-width="6"/>${snowRoof(-66, -66, 112)}
        ${win(-52, -50, 22, 14)}<rect x="10" y="-52" width="20" height="40" rx="4" fill="#C48A55" stroke="${INK}" stroke-width="2.5"/><circle cx="20" cy="-40" r="7" fill="none" stroke="#2F7A44" stroke-width="4"/>
        <circle cx="-30" cy="-4" r="11" fill="${INK}"/><path d="M50 -14 h26" stroke="${INK}" stroke-width="4"/>
        <g transform="translate(-110 0)"><rect x="-14" y="-16" width="28" height="16" fill="#EE5D45" stroke="${INK}" stroke-width="2"/>${person(0, -8, '#5B6FA8', .7, '#fff')}</g>
        <g transform="translate(-150 0)"><rect x="-14" y="-16" width="28" height="16" fill="#5BB7E6" stroke="${INK}" stroke-width="2"/>${person(0, -8, '#F28DB2', .7, '#EE5D45')}</g>
        <g transform="translate(-130 2)"><ellipse cx="0" cy="-6" rx="12" ry="7" fill="#C48A55" stroke="${INK}" stroke-width="2"/><circle cx="12" cy="-12" r="6" fill="#C48A55" stroke="${INK}" stroke-width="2"/><path class="tail" d="M-12 -8 q-8 -6 -4 -12" stroke="${INK}" stroke-width="2.5" fill="none"/></g>
        <g transform="translate(90 0)"><circle cy="-12" r="14" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cy="-34" r="10" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M2 -34 l8 2 l-8 2z" fill="#F59A3A"/><rect x="-8" y="-50" width="16" height="8" fill="${INK}"/></g></g>`);

    const ecureuils = item('ecureuils', `<g transform="translate(80 540)"><rect x="-40" y="-14" width="80" height="18" rx="9" fill="#8C5A31" stroke="${INK}" stroke-width="2.5"/><circle cx="40" cy="-5" r="9" fill="#C48A55" stroke="${INK}" stroke-width="2.5"/>
        ${[-14, 12].map((x) => `<g transform="translate(${x} -16)"><path d="M-8 0 q-14 -4 -10 -20 q8 -2 10 10" fill="#C9803A" stroke="${INK}" stroke-width="2"/><ellipse cx="0" cy="-6" rx="6" ry="8" fill="#C9803A" stroke="${INK}" stroke-width="2"/><circle cx="2" cy="-16" r="5" fill="#C9803A" stroke="${INK}" stroke-width="2"/></g>`).join('')}</g>`);
    const horloge = item('horloge', `<g transform="translate(880 650)"><rect x="-3" y="-60" width="6" height="60" fill="#2E3A2A"/><circle cy="-66" r="13" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M0 -66 v-8 M0 -66 l6 3" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></g>`);
    const puits = item('puits', `<g transform="translate(330 760)"><rect x="-22" y="-20" width="44" height="22" fill="#B9C6CC" stroke="${INK}" stroke-width="2.5"/><path d="M-18 -20 v-30 M18 -20 v-30 M-24 -50 L0 -64 L24 -50 Z" stroke="${INK}" stroke-width="2.5" fill="#7A4E2D"/>${snowRoof(-26, -54, 52)}<rect x="-6" y="-36" width="12" height="10" fill="#C48A55" stroke="${INK}" stroke-width="2"/></g>`);
    const niche = item('niche', `<g transform="translate(1340 690)"><rect x="-22" y="-26" width="44" height="26" fill="#EE5D45" stroke="${INK}" stroke-width="2.5"/><path d="M-28 -24 L0 -44 L28 -24 Z" fill="#7A4E2D" stroke="${INK}" stroke-width="2.5"/>${snowRoof(-28, -28, 56)}<path d="M-8 0 v-12 a8 8 0 0 1 16 0 v12" fill="#2E3A2A"/><circle cx="-2" cy="-6" r="4" fill="#C48A55"/></g>`);
    const sapins = [[210, 470, .8], [600, 500, .7], [370, 470, .6], [1330, 470, .7], [60, 470, .75]].map(([x, y, s]) => item('sapin', fir(x, y, s), 'Sapin de Noël enneigé')).join('');

    const snow = `<g class="snow" aria-hidden="true">${Array.from({ length: 70 }, (_, i) => `<circle cx="${(i * 211) % W}" cy="-10" r="${2 + (i % 3)}" fill="#fff" style="animation-duration:${6 + (i % 5) * 1.6}s;animation-delay:${-(i % 13)}s"/>`).join('')}</g>`;
    const glow = `<defs><radialGradient id="glowG"><stop offset="0" stop-color="#FFB347" stop-opacity=".55"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient></defs>`;

    PARTS = { sky, mountain, sleigh, ski, rennes, scout, cloches, ledTree, tower, ecureuils, stands, tasses, shoppers, carolers, snowman, pond, horloge, train, chef, feu, puits, bigTree, niche, caravane, bank, glow, garlandLights };
    return `<svg class="village-svg ${night ? 'night' : 'day'}" viewBox="0 0 ${W} ${H}" role="group" aria-label="Le village de Noël">${glow}${sky}${mountain}${hills}${sparkle}${shops}
      ${sleigh}${sapins}${ski}${rennes}${scout}${cloches}${ledTree}${tower}${ecureuils}${prints}${garlandLights}${stands}${tasses}${shoppers}${lamps}${carolers}${snowman}${birds}${pond}${horloge}${train}${chef}${feu}${puits}${bigTree}${niche}${caravane}${bank}${snow}</svg>`;
  }


  /* ---------- Village en photos : les vrais produits Truffaut posés sur un décor de neige ---------- */
  // [id, x centre, bas, largeur] dans un repère 1400 × 820
  const SPOTS = [
    ['traineau', 760, 300, 210, 'fly'],
    ['sapin', 70, 470, 120], ['bonbons', 270, 478, 250, 'glow'], ['place', 560, 480, 320, 'glow'], ['tour', 1000, 486, 330, 'glow'], ['rennes', 1250, 476, 220, 'glow'], ['sapin', 1370, 470, 110],
    ['ecureuils', 70, 640, 110], ['churros', 190, 626, 150], ['crepes', 320, 630, 150], ['choco', 450, 626, 150], ['bretzels', 580, 630, 150], ['marrons', 700, 636, 120],
    ['cloches', 830, 630, 180, 'glow'], ['horloge', 925, 640, 80], ['tasses', 1035, 634, 200, 'glow'], ['feu', 1200, 636, 180, 'glow'], ['arbre-led', 1335, 630, 120, 'glow'],
    ['glace', 120, 800, 140], ['ski', 245, 790, 120], ['train', 500, 805, 310], ['chef', 690, 790, 90], ['acheteurs', 800, 798, 140], ['photo', 925, 796, 130],
    ['caravane', 1090, 806, 200], ['scout', 1230, 790, 120], ['niche', 1310, 796, 100], ['puits', 1375, 792, 90],
  ];
  function backdrop() {
    const bokeh = Array.from({ length: 46 }, (_, i) => { const x = (i * 157) % 1400, y = 18 + (i * 83) % 140, r = 6 + (i % 5) * 4; return `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 4 ? '#FFB347' : '#FFD98A'}" opacity="${.35 + (i % 3) * .15}" class="bok" style="animation-delay:${(i % 9) * .5}s"/>`; }).join('');
    const tier = (y, h, seed, tone) => `<path d="M0 ${y} ${Array.from({ length: 15 }, (_, i) => `Q${i * 100 + 50} ${y - 10 - ((i * seed) % 4) * 6} ${(i + 1) * 100} ${y + ((i * 3 + seed) % 3) * 3}`).join(' ')} V${y + h} H0Z" fill="${tone}"/>`;
    const rocks = (y, seed) => Array.from({ length: 16 }, (_, i) => { const x = i * 92 + (seed * 13) % 40; return `<path d="M${x} ${y} l${20 + (i % 3) * 8} ${-18 - (i % 4) * 6} l${30 + (i % 2) * 10} ${10 + (i % 3) * 4} l${18 + (i % 4) * 6} ${14} Z" fill="#8E969B"/><path d="M${x + 20 + (i % 3) * 8} ${y - 18 - (i % 4) * 6} l${30 + (i % 2) * 10} ${10 + (i % 3) * 4} l${18 + (i % 4) * 6} 14 l-${40} 0z" fill="#6F777C"/>`; }).join('');
    const flockTree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" opacity=".85">${[[0, 70], [-26, 56], [-50, 42], [-72, 28]].map(([yy, w]) => `<path d="M${-w} ${yy} Q0 ${yy - 50} ${w} ${yy} Q${w * .5} ${yy - 8} 0 ${yy - 4} Q${-w * .5} ${yy - 8} ${-w} ${yy}Z" fill="#7F9A86"/><path d="M${-w * .9} ${yy - 2} Q0 ${yy - 40} ${w * .9} ${yy - 2}" fill="none" stroke="#F4F8FA" stroke-width="6" stroke-linecap="round"/>`).join('')}</g>`;
    return `<svg class="dio-bg" viewBox="0 0 1400 820" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="dioSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9C6D6"/><stop offset=".6" stop-color="#EADFD6"/><stop offset="1" stop-color="#F7EFE6"/></linearGradient>
        <filter id="blur8"><feGaussianBlur stdDeviation="7"/></filter><filter id="blur2"><feGaussianBlur stdDeviation="1.6"/></filter>
        <linearGradient id="snowT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4ECF2"/></linearGradient></defs>
      <rect width="1400" height="820" fill="url(#dioSky)"/>
      <g filter="url(#blur8)">${bokeh}</g>
      <g filter="url(#blur2)">${[120, 330, 900, 1180, 1300].map((x, i) => flockTree(x, 360 + (i % 2) * 20, .9 + (i % 3) * .2)).join('')}
        <path d="M0 330 L180 230 L300 290 L460 190 L620 280 L780 210 L950 300 L1120 220 L1280 290 L1400 240 V420 H0Z" fill="#C9D2DA"/><path d="M180 230 L210 250 L240 244 L300 290 M460 190 L500 220 L540 214 M780 210 L820 236 L860 228 M1120 220 L1160 246 L1200 240" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g>
      ${tier(470, 360, 2, 'url(#snowT)')}<path d="M0 474 Q700 492 1400 474" stroke="#D7E2EA" stroke-width="10" fill="none" opacity=".8"/>
      ${tier(632, 200, 5, 'url(#snowT)')}<path d="M0 636 Q700 652 1400 636" stroke="#D7E2EA" stroke-width="10" fill="none" opacity=".8"/>
      ${tier(796, 40, 7, '#FFFFFF')}<g transform="translate(0 50)">${rocks(770, 4)}</g><path d="M0 812 Q350 800 700 812 T1400 810 V820 H0Z" fill="#fff"/>
      <g fill="#fff" opacity=".9">${Array.from({ length: 90 }, (_, i) => `<circle cx="${(i * 211) % 1400}" cy="${470 + (i * 37) % 350}" r="${i % 6 ? .9 : 1.8}"/>`).join('')}</g>
    </svg>`;
  }
  function photoScene() {
    const cards = SPOTS.map(([id, x, yb, w, fx], i) => {
      const v = it(id); if (!v || !v.img) return '';
      const left = ((x - w / 2) / 1400) * 100, top = ((yb - w * .92) / 820) * 100, width = (w / 1400) * 100;
      return `<button class="ph ${fx || ''}" type="button" data-id="${id}" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%;width:${width.toFixed(2)}%;z-index:${Math.round(yb)}" aria-label="${esc(v.name)}">
        <img src="${v.img}?width=700&height=700&store=fr&image-type=image" alt="" loading="lazy" decoding="async"><span class="ph-tag">${esc(v.name.replace(/\s*[-–:].*$/, '').slice(0, 34))}</span></button>`;
    }).join('');
    const snow = `<svg class="dio-snow" viewBox="0 0 1400 820" preserveAspectRatio="none" aria-hidden="true">${Array.from({ length: 80 }, (_, i) => `<circle cx="${(i * 173) % 1400}" cy="-10" r="${1.5 + (i % 3)}" fill="#fff" opacity=".85" style="animation-duration:${7 + (i % 5) * 1.7}s;animation-delay:${-(i % 13)}s"/>`).join('')}</svg>`;
    return `<div class="diorama">${backdrop()}${cards}${snow}</div>`;
  }


  /* ---------- La promenade : une seule rue de marché de Noël où l'on se balade ---------- */
  const WW = 5400;
  const ZONES_N = [
    { id: 'entree', name: 'L’entrée du marché', x: 0 },
    { id: 'chalets', name: 'La rue des chalets', x: 860 },
    { id: 'place', name: 'La grande place', x: 1880 },
    { id: 'gare', name: 'La gare et le lac', x: 2900 },
    { id: 'camp', name: 'Le camp du feu', x: 4080 },
  ];
  // position (centre x) de chaque produit dans la rue, pour la bulle « vous êtes devant… »
  // Les produits Truffaut posés le long de la rue : [id, x centre, bas, taille]
  const STREET = [
    ['sapin', 80, 600, 160], ['bonbons', 300, 612, 300], ['ecureuils', 520, 722, 120], ['puits', 650, 728, 110], ['sapin', 780, 600, 140],
    ['place', 1200, 566, 380], ['churros', 960, 704, 190], ['crepes', 1120, 706, 190], ['choco', 1280, 704, 190], ['bretzels', 1440, 706, 190], ['marrons', 1600, 712, 150], ['acheteurs', 1740, 736, 140],
    ['cloches', 2010, 702, 220], ['arbre-led', 2190, 690, 160], ['tour', 2420, 650, 430], ['tasses', 2640, 716, 230], ['horloge', 2800, 722, 100], ['photo', 2880, 738, 130],
    ['train', 3160, 732, 380], ['chef', 3390, 734, 110], ['glace', 3570, 732, 170], ['ski', 3760, 724, 150], ['scout', 3950, 700, 150],
    ['rennes', 4250, 646, 300], ['traineau', 4600, 330, 240, 'fly'], ['feu', 4520, 716, 220], ['caravane', 4770, 728, 240], ['niche', 4970, 732, 120], ['sapin', 5110, 610, 170], ['sapin', 5300, 600, 150],
  ];
  const ANCHORS = {}; STREET.forEach(([id, x]) => { if (!(id in ANCHORS)) ANCHORS[id] = x; });
  const shift = (dx, str, dy = 0) => `<g transform="translate(${dx} ${dy})">${str}</g>`;

  function walkScene() {
    scene(); // prépare les dessins des produits (utilisés si les photos ne s'affichent pas)
    const P = PARTS;
    // décor neutre de maquette : ciel, montagne, neige, rue pavée
    const bgMount = [0, 1300, 2600, 3900].map((dx) => shift(dx, P.mountain)).join('');
    const sky = `<rect x="-200" y="0" width="${WW + 400}" height="820" fill="url(#sky)"/><defs><linearGradient id="skyPale" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCEAF5"/><stop offset="1" stop-color="#F7FAFD"/></linearGradient></defs><rect class="sky-pale" x="-200" y="0" width="${WW + 400}" height="820" fill="url(#skyPale)"/><g class="stars">${Array.from({ length: 160 }, (_, k) => `<circle cx="${(k * 283) % WW}" cy="${(k * 97) % 300 + 10}" r="${k % 4 ? 1.5 : 2.4}" fill="#fff" style="animation-delay:${(k % 7) * .4}s"/>`).join('')}</g>
      <g class="moon"><circle cx="900" cy="150" r="38" fill="#FFF3C4" stroke="${INK}" stroke-width="2"/><circle cx="918" cy="140" r="34" class="moon-cut"/></g>`;
    const hills = `<path d="M-200 400 ${Array.from({ length: 30 }, (_, k) => `Q${k * 200 - 100} ${360 + (k % 3) * 20} ${k * 200} 400`).join(' ')} V820 H-200Z" fill="#EEF4FA" stroke="${INK}" stroke-width="2"/>`;
    const ground = `<path d="M-50 520 ${Array.from({ length: 30 }, (_, k) => `Q${k * 200 + 100} ${506 + (k % 2) * 16} ${(k + 1) * 200} 520`).join(' ')} V820 H-50Z" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>
      <g fill="#C9DCEB" opacity=".8">${Array.from({ length: 220 }, (_, k) => `<circle cx="${(k * 197) % WW}" cy="${530 + (k * 61) % 200}" r="${k % 5 ? 1 : 1.8}"/>`).join('')}</g>`;
    const street = `<defs><pattern id="cob" width="26" height="14" patternUnits="userSpaceOnUse"><rect width="26" height="14" fill="#D9D2C4"/><path d="M0 7 h26 M13 0 v7 M0 7 v7 M26 7 v7" stroke="#B5AC9C" stroke-width="1.2"/><circle cx="6" cy="3" r="1" fill="#fff" opacity=".7"/></pattern>
        <radialGradient id="phHalo"><stop offset=".55" stop-color="#fff"/><stop offset=".8" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><radialGradient id="phFade"><stop offset=".62" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="phMask" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#phFade)"/></mask></defs>
      <path d="M-50 742 ${Array.from({ length: 60 }, () => `q50 -6 100 0`).join(' ')} V808 ${Array.from({ length: 60 }, () => `q-50 6 -100 0`).join(' ')}Z" fill="url(#cob)" stroke="${INK}" stroke-width="1.6"/>
      <path d="M-50 744 ${Array.from({ length: 60 }, () => `q50 -8 100 0`).join(' ')}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`;
    const posts = ZONES_N.map((z) => `<g transform="translate(${Math.max(20, z.x - 60)} 742)"><path d="M0 0 v-80" stroke="#7E5432" stroke-width="5"/><path d="M-6 -86 h120 l14 14 l-14 14 h-120z" fill="#F3E9D2" stroke="${INK}" stroke-width="1.6"/><text x="56" y="-68" text-anchor="middle" class="zone-post">${z.name}</text>${snowRoof(-8, -92, 128)}</g>`).join('');
    // les vraies photos des produits
    const photos = STREET.map(([id, x, yb, sz, fx]) => { const v = it(id); if (!v || !v.img) return '';
      return `<g class="vitem ph-s ${fx || ''}" data-id="${id}" tabindex="0" role="button" aria-label="${esc(v.name)}"><ellipse cx="${x}" cy="${yb - sz * .44}" rx="${sz * .62}" ry="${sz * .58}" fill="url(#phHalo)"/><image href="${v.img}?width=700&height=700&store=fr&image-type=image" x="${x - sz / 2}" y="${yb - sz * .92}" width="${sz}" height="${sz}" mask="url(#phMask)" preserveAspectRatio="xMidYMid meet"/></g>`; }).join('');
    // les mêmes produits dessinés (secours)
    const firItem = (x, y, sc) => item('sapin', fir(x, y, sc), 'Sapin de Noël enneigé pour village miniature');
    const drawn = [firItem(80, 600, 1.1), firItem(780, 600, 1), firItem(5110, 610, 1.2), firItem(5300, 600, 1),
      shift(440, P.ecureuils), shift(310, P.puits), shift(690, P.stands), shift(870, P.marrons || ''), shift(1215, P.shoppers),
      shift(1190, P.cloches), shift(1240, P.ledTree), shift(1230, item('tour', P.tower.replace('class="decor" aria-hidden="true" ', ''), it('tour').name)), shift(1560, P.tasses), shift(1910, P.horloge),
      shift(2385, P.train), shift(2600, P.chef), shift(3375, P.pond), shift(3540, P.ski), shift(3320, P.scout, 270),
      shift(3780, P.rennes, 210), shift(3300, P.sleigh), shift(3260, P.feu), shift(3550, P.caravane), shift(3620, P.niche)].join('');
    const banks = [0, 1400, 2800, 4200].map((dx) => shift(dx, P.bank)).join('');
    const walker = `<g id="nwalker" transform="translate(${walk.x} 792)"><g class="nhop"><g class="nface" transform="scale(${walk.f} 1)">${person(0, 0, '#2F5A3A', 2.1, '#C8243C', '<path d="M8 -20 h9 l2 14 h-13z" fill="#C8243C" stroke="#1F3A2E" stroke-width=".8"/><path d="M10 -20 q2 -5 5 0" fill="none" stroke="#1F3A2E" stroke-width=".8"/><circle cx="13" cy="-16" r="1.5" fill="#F6D36A"/>')}</g></g></g>`;
    return { W: WW, svg: `<svg class="village-svg walk-svg ${night ? 'night' : 'day'} ${photoState}" viewBox="0 110 ${WW} 710" role="group" aria-label="La rue du marché de Noël">${P.glow}
      <g id="nbg">${P.sky.replace(/<rect width="1400" height="820" fill="url\(#sky\)"\/>[\s\S]*$/, '')}${sky}${bgMount}${hills}</g>
      ${ground}${street.replace(/<path d="M-50 742[\s\S]*$/, '')}
      <g class="layer-photo">${photos}</g><g class="layer-drawn">${drawn}</g>${posts}
      ${street.replace(/^[\s\S]*?<\/defs>/, '')}${walker}${banks}</svg>` };
  }
  function nearest() {
    const list = Object.entries(ANCHORS).map(([id, x]) => ({ id, d: Math.abs(x - walk.x) })).filter((o) => o.d < 150).sort((a, b) => a.d - b.d).slice(0, 2);
    const box = $('#npass', el); if (!box) return;
    if (!list.length) { box.innerHTML = `<span class="hand">Avance dans la rue : les produits apparaîtront ici.</span>`; return; }
    box.innerHTML = `<span class="np-lbl">Devant toi</span>` + list.map(({ id }) => { const v = it(id); return `<button type="button" class="np-item" data-id="${id}"><b>${esc(v.name.replace(/\s*\(.*\)$/, ''))}</b><span>${euro(v.price)}</span></button>`; }).join('');
    $$('.np-item', box).forEach((b) => b.addEventListener('click', () => info(b.dataset.id)));
  }
  function stepWalk() {
    const g = $('#nwalker', el); if (!g || !walk) return;
    const d = walk.target - walk.x;
    if (Math.abs(d) < 3) { walk.x = walk.target; g.classList.remove('walking'); walk.raf = null; follow(true); nearest(); return; }
    walk.x += Math.sign(d) * Math.min(Math.abs(d), Math.max(6.5, Math.abs(d) / 28));
    const f = Math.sign(d); if (f !== walk.f) { walk.f = f; $('.nface', g).setAttribute('transform', `scale(${f} 1)`); }
    g.classList.add('walking'); g.setAttribute('transform', `translate(${walk.x} 792)`);
    follow(); if ((walk.x | 0) % 20 < 7) nearest();
    walk.raf = requestAnimationFrame(stepWalk);
  }
  function follow(force) {
    const sc = $('#vwrap', el); if (!sc) return;
    const want = walk.x * walk.k - sc.clientWidth * .42;
    if (force || Math.abs(sc.scrollLeft - want) > 2) sc.scrollLeft += (want - sc.scrollLeft) * (force ? 1 : .14);
    const bg = $('#nbg', el); if (bg) bg.setAttribute('transform', `translate(${(sc.scrollLeft / walk.k * .45).toFixed(1)} 0)`);
  }
  function walkTo(x) { walk.target = clamp(x, 40, WW - 60); if (!walk.raf) walk.raf = requestAnimationFrame(stepWalk); }

  function info(id) {
    const v = it(id);
    modal(`<h2>${esc(v.name)}</h2>
      ${v.note ? `<p>${esc(v.note)}</p>` : ''}
      <p class="v-price">${euro(v.price)}</p>
      <div class="actions"><a class="btn sun" href="${v.url}" target="_blank" rel="noopener">Voir le produit sur truffaut.com</a></div>`);
    $$('.vitem', el).forEach((g) => g.classList.toggle('picked', g.dataset.id === id));
  }

  function draw() {
    el.innerHTML = `<div class="page noel">
      ${Deco.head('Le village de Noël', 'Un village où il neige tous les jours et où même le chef de gare est de bonne humeur. Tout ce qui bouge et brille ici existe en miniature chez Truffaut : clique pour voir le produit.',
        ['Même en miniature, je reste le plus lent du village.', 'Le traîneau me double tous les soirs. Vexant.', 'Les churros, c’est pour qui ? Pour moi ? Non ? D’accord.'], 1)}
      <div class="walk-bar"><div class="v-ctrl">
        <span class="seg-mode" role="group" aria-label="Affichage"><button class="btn small ${mode === 'walk' ? '' : 'white'}" data-mode="walk" type="button" aria-pressed="${mode === 'walk'}">Se promener</button><button class="btn small ${mode === 'photo' ? '' : 'white'}" data-mode="photo" type="button" aria-pressed="${mode === 'photo'}">Vue d’ensemble</button></span>
        ${mode === 'walk' ? `<button class="btn white small" id="daynight" type="button" aria-pressed="${!night}">${night ? '☀️ Journée' : '🌙 Nuit'}</button>` : `<span class="zoom" role="group" aria-label="Zoom"><button class="btn white small" id="z-out" type="button" aria-label="Dézoomer">−</button><span id="z-val">${Math.round(zoom * 100)} %</span><button class="btn white small" id="z-in" type="button" aria-label="Zoomer">+</button></span>`}</div></div>
      ${mode === 'walk' ? `<div class="nwalk-ctrl"><button class="btn white" id="n-l" type="button" aria-label="Marcher vers la gauche">◀</button>
          <select id="n-zone" aria-label="Aller directement à">${ZONES_N.map((z) => `<option value="${z.x}">${z.name}</option>`).join('')}</select>
          <button class="btn white" id="n-r" type="button" aria-label="Marcher vers la droite">▶</button></div>
        <div class="walkbox"><div class="village-wrap walkwrap panel" id="vwrap" tabindex="0" aria-label="La rue du marché. Flèches gauche et droite pour marcher.">${walkScene().svg}</div>
          <svg class="walk-snow" viewBox="0 0 1400 820" preserveAspectRatio="none" aria-hidden="true">${Array.from({ length: 90 }, (_, i) => `<circle cx="${(i * 173) % 1400}" cy="-10" r="${1.4 + (i % 3)}" fill="#fff" opacity=".9" style="animation-duration:${6 + (i % 5) * 1.6}s;animation-delay:${-(i % 13)}s"/>`).join('')}</svg>
          <div class="npass" id="npass" aria-live="polite"></div></div>
        <p class="hand hint">Flèches du clavier ou boutons pour marcher. Tout ce que tu croises est un produit vendu chez Truffaut : clique dessus ou sur la bulle pour voir sa fiche.</p>`
      : `<div class="village-wrap panel" id="vwrap"><div class="vzoom" style="width:${zoom * 100}%">${photoScene()}</div></div>
        <p class="hand hint">Chaque pièce est la vraie photo du produit vendu chez Truffaut. Zoome, fais glisser, clique pour ouvrir la fiche.</p>`}
      <section class="v-list panel"><h2>Dans le village</h2>
        <ul>${VILLAGE.map((v) => `<li><button type="button" data-id="${v.id}"><span>${esc(v.name)}</span><b>${euro(v.price)}</b></button></li>`).join('')}</ul>
        <p class="small">Dessins réalisés d’après les fiches produit. Mouvements décrits par Truffaut : les sonneurs tirent les cordes, les tasses tourbillonnent, le traîneau passe dans le ciel, les musiciens animent la scène autour du feu.</p>
      </section></div>`;
    $$('.vitem', el).forEach((g) => {
      g.addEventListener('click', () => info(g.dataset.id));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); info(g.dataset.id); } });
    });
    $$('.v-list button', el).forEach((b) => {
      b.addEventListener('click', () => info(b.dataset.id));
      b.addEventListener('mouseenter', () => $$('.vitem', el).forEach((g) => g.classList.toggle('hl', g.dataset.id === b.dataset.id)));
      b.addEventListener('mouseleave', () => $$('.vitem', el).forEach((g) => g.classList.remove('hl')));
    });
    const dn = $('#daynight', el); if (dn) dn.addEventListener('click', () => { night = !night; if (walk.raf) cancelAnimationFrame(walk.raf); walk.raf = null; walk.target = walk.x; draw(); });
    $$('.seg-mode button', el).forEach((b) => b.addEventListener('click', () => { mode = b.dataset.mode; if (walk.raf) cancelAnimationFrame(walk.raf); walk.raf = null; walk.target = walk.x; draw(); }));
    $$('.ph', el).forEach((b) => b.addEventListener('click', () => info(b.dataset.id)));
    $$('.ph img', el).forEach((im) => im.addEventListener('error', () => {
      im.closest('.ph').classList.add('noimg'); fails++;
      if (fails === 4 && mode === 'photo') { mode = 'walk'; draw(); toast('🖼️', 'Les photos des produits ne s’affichent pas ici', 'Voici la promenade dessinée. Ouvre le site en ligne (GitHub Pages) pour voir les vraies photos.', 7000); }
    }));
    const wrap = $('#vwrap', el);
    if (mode === 'walk') {
      const svgEl = $('.walk-svg', el);
      const sizeIt = () => { const h = Math.min(window.innerHeight * .68, 640, Math.max(380, window.innerWidth * .62)); walk.k = h / 710; svgEl.style.height = h + 'px'; svgEl.style.width = (WW * walk.k) + 'px'; follow(true); };
      sizeIt(); nearest();
      if (photoState === 'photo-wait') { const test = new Image(); const first = STREET.map(([id]) => it(id)).find((v) => v && v.img);
        test.onload = () => { photoState = 'photo-ok'; svgEl.classList.remove('photo-wait'); svgEl.classList.add('photo-ok'); };
        test.onerror = () => { photoState = 'photo-ko'; svgEl.classList.remove('photo-wait'); svgEl.classList.add('photo-ko'); };
        test.src = first.img + '?width=700&height=700&store=fr&image-type=image'; }
      const move = (dir) => walkTo(walk.target + dir * 300);
      let hold = null;
      const holdStart = (dir) => { move(dir); clearInterval(hold); hold = setInterval(() => move(dir), 260); };
      const holdEnd = () => clearInterval(hold);
      [['#n-l', -1], ['#n-r', 1]].forEach(([sel, dir]) => { const b = $(sel, el); b.addEventListener('pointerdown', () => holdStart(dir)); ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, holdEnd)); b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') move(dir); }); });
      $('#n-zone', el).addEventListener('change', (e) => walkTo(+e.target.value + 160));
      svgEl.addEventListener('click', (e) => { if (e.target.closest('.vitem')) return; const r = svgEl.getBoundingClientRect(); walkTo((e.clientX - r.left) / walk.k); });
      wrap.addEventListener('scroll', () => { const bg = $('#nbg', el); if (bg) bg.setAttribute('transform', `translate(${(wrap.scrollLeft / walk.k * .45).toFixed(1)} 0)`); });
      if (walk.keys) window.removeEventListener('keydown', walk.keys);
      walk.keys = (e) => { if (document.querySelector('#modal-back') || location.hash !== '#noel') return; if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } };
      window.addEventListener('keydown', walk.keys);
      walk.resize = sizeIt;
      return;
    }
    const zbox = $('.vzoom', el);
    const setZoom = (z, cx = .5) => { const old = zoom; zoom = clamp(Math.round(z * 10) / 10, 1, 3); const ratio = zoom / old;
      const center = wrap.scrollLeft + wrap.clientWidth * cx; zbox.style.width = zoom * 100 + '%'; wrap.scrollLeft = center * ratio - wrap.clientWidth * cx;
      wrap.scrollTop = wrap.scrollTop * ratio; $('#z-val', el).textContent = Math.round(zoom * 100) + ' %'; };
    $('#z-in', el).addEventListener('click', () => setZoom(zoom + .4));
    $('#z-out', el).addEventListener('click', () => setZoom(zoom - .4));
    let drag = null;
    wrap.addEventListener('pointerdown', (e) => { if (zoom <= 1 || e.target.closest('.ph')) return; drag = { x: e.clientX, y: e.clientY, l: wrap.scrollLeft, t: wrap.scrollTop }; wrap.setPointerCapture(e.pointerId); wrap.classList.add('grabbing'); });
    wrap.addEventListener('pointermove', (e) => { if (!drag) return; wrap.scrollLeft = drag.l - (e.clientX - drag.x); wrap.scrollTop = drag.t - (e.clientY - drag.y); });
    wrap.addEventListener('pointerup', () => { drag = null; wrap.classList.remove('grabbing'); });
    if (zoom > 1) { wrap.scrollLeft = (wrap.scrollWidth - wrap.clientWidth) * .55; wrap.scrollTop = (wrap.scrollHeight - wrap.clientHeight) * .5; }
  }

  return { title: 'Le village de Noël',
    mount(view) { el = view; walk = { x: 170, target: 170, f: 1, k: .78, raf: null, keys: walk && walk.keys }; draw(); },
    unmount() { if (walk) { if (walk.raf) cancelAnimationFrame(walk.raf); walk.raf = null; if (walk.keys) window.removeEventListener('keydown', walk.keys); } } };
})();
route('noel', Noel);
