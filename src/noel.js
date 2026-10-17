/* ============================================================
   LE VILLAGE DE NOËL — chaque élément est un produit Truffaut
   ============================================================ */
const Noel = (() => {
  let el, night = true;
  const W = 1400, H = 820;
  const it = (id) => VILLAGE.find((v) => v.id === id);

  /* ---------- petits dessins ---------- */
  const person = (x, y, coat = '#EE5D45', s = 1, hat = '#fff', extra = '') => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-9 0 Q-11 -26 0 -28 Q11 -26 9 0 Z" fill="${coat}" stroke="${INK}" stroke-width="2.5"/>
    <circle cx="0" cy="-36" r="9" fill="#F6D2B5" stroke="${INK}" stroke-width="2.5"/>
    <path d="M-9 -38 Q0 -54 9 -38 Z" fill="${hat}" stroke="${INK}" stroke-width="2.5"/>${extra}</g>`;
  const snowRoof = (x, y, w) => `<path d="M${x - 6} ${y} Q${x + w / 4} ${y - 8} ${x + w / 2} ${y - 4} T${x + w + 6} ${y} L${x + w + 2} ${y + 8} Q${x + w * .7} ${y + 4} ${x + w / 2} ${y + 10} T${x - 2} ${y + 8} Z" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`;
  const win = (x, y, w = 14, h = 14) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" class="lit" fill="#FFD35A" stroke="${INK}" stroke-width="2.5"/>`;
  const fir = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="-6" width="10" height="12" fill="#8C5A31" stroke="${INK}" stroke-width="2.5"/>
    <path d="M0 -90 L26 -40 L14 -40 L34 -6 L-34 -6 L-14 -40 L-26 -40 Z" fill="#2F7A44" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M0 -90 L12 -66 Q0 -60 -12 -66 Z M-20 -40 Q0 -32 20 -40 L14 -48 Q0 -42 -14 -48 Z M-30 -8 Q0 2 30 -8 L26 -16 Q0 -8 -26 -16 Z" fill="#fff" stroke="${INK}" stroke-width="2"/></g>`;
  const stand = (x, y, roof, sign, goods) => `<g transform="translate(${x} ${y})">
    <rect x="-44" y="-50" width="88" height="50" fill="#C48A55" stroke="${INK}" stroke-width="2.5"/>
    <rect x="-40" y="-30" width="80" height="12" fill="#E9D2A8" stroke="${INK}" stroke-width="2"/>${goods}
    <path d="M-52 -50 L-40 -76 H40 L52 -50 Z" fill="${roof}" stroke="${INK}" stroke-width="2.5"/>
    ${[-40, -20, 0, 20].map((k) => `<path d="M${k} -50 v8 a10 10 0 0 0 20 0 v-8" fill="#fff" stroke="${INK}" stroke-width="2"/>`).join('')}
    ${snowRoof(-46, -80, 92)}
    <rect x="-30" y="-100" width="60" height="18" rx="4" fill="#F6E7C1" stroke="${INK}" stroke-width="2"/><text x="0" y="-87" text-anchor="middle" class="vsign">${sign}</text>
    ${[-36, -18, 0, 18, 36].map((k, i) => `<circle cx="${k}" cy="-48" r="3.5" class="bulb b${i % 3}" stroke="${INK}" stroke-width="1.5"/>`).join('')}</g>`;
  const item = (id, inner, label) => `<g class="vitem" data-id="${id}" tabindex="0" role="button" aria-label="${esc(label || it(id).name)}">${inner}</g>`;

  function scene() {
    const sky = `<defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky1"/><stop offset="1" class="sky2"/></linearGradient>
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

    const rennes = item('rennes', `<g transform="translate(470 420)">
        <path d="M-60 0 Q-70 -40 -40 -50 L-40 -90 L40 -90 L40 -50 Q70 -40 60 0 Z" fill="#fff" stroke="${INK}" stroke-width="3"/>
        <rect x="-40" y="-90" width="80" height="62" fill="#E86F5A" stroke="${INK}" stroke-width="2.5"/>
        <path d="M-50 -88 L0 -130 L50 -88 Z" fill="#7A4E2D" stroke="${INK}" stroke-width="2.5"/>${snowRoof(-52, -96, 104)}
        <rect x="20" y="-140" width="12" height="22" fill="#8C5A31" stroke="${INK}" stroke-width="2"/><rect x="18" y="-150" width="16" height="10" fill="#5BB7E6" stroke="${INK}" stroke-width="2"/>
        ${win(-30, -76)}${win(14, -76)}<rect x="-8" y="-58" width="16" height="30" fill="#8C5A31" stroke="${INK}" stroke-width="2.5"/>
        ${fir(-74, -2, .55)}<path d="M-96 -40 q12 10 24 -2 q10 12 22 0" fill="none" stroke="${INK}" stroke-width="1.5"/>
        ${[-92, -84, -76, -66, -58].map((x, i) => `<circle cx="${x}" cy="${-36 + (i % 2) * 6}" r="3" class="bulb b${i % 3}" stroke="${INK}" stroke-width="1"/>`).join('')}
        <g transform="translate(-60 -8)"><path d="M-10 0 v-14 q0 -8 10 -8 h10 l4 -8 l6 4 l-4 8 v18" fill="#A9774C" stroke="${INK}" stroke-width="2.5"/><path d="M14 -30 l-4 -10 M18 -28 l6 -8" stroke="${INK}" stroke-width="2"/><circle cx="20" cy="-22" r="2.5" fill="#EE5D45"/></g></g>`);

    const scout = item('scout', `<g transform="translate(630 418)"><rect x="-26" y="-36" width="52" height="36" fill="#8C5A31" stroke="${INK}" stroke-width="2.5"/>
        <path d="M-34 -34 L0 -62 L34 -34 Z" fill="#2F7A44" stroke="${INK}" stroke-width="2.5"/>${snowRoof(-36, -40, 72)}${win(-18, -26, 12, 12)}<rect x="4" y="-24" width="12" height="24" fill="#5E3B22" stroke="${INK}" stroke-width="2"/>
        <path d="M30 0 v-30 l18 6 l-18 6" fill="#EE5D45" stroke="${INK}" stroke-width="2"/></g>`);

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
    const wagon = (c, gifts) => `<g><rect x="-22" y="-26" width="44" height="22" rx="3" fill="${c}" stroke="${INK}" stroke-width="2.5"/>${gifts}<circle cx="-12" cy="-2" r="6" fill="${INK}"/><circle cx="12" cy="-2" r="6" fill="${INK}"/></g>`;
    const loco = `<g><rect x="-26" y="-30" width="34" height="26" fill="#EE5D45" stroke="${INK}" stroke-width="2.5"/><rect x="8" y="-42" width="20" height="38" fill="#2F7A44" stroke="${INK}" stroke-width="2.5"/><rect x="-22" y="-44" width="10" height="14" fill="${INK}"/>
        <circle cx="-14" cy="-2" r="7" fill="${INK}"/><circle cx="16" cy="-2" r="7" fill="${INK}"/><circle cx="-30" cy="-16" r="4" class="lit" fill="#FFD35A" stroke="${INK}" stroke-width="2"/>${win(12, -38, 12, 10)}
        <path class="smoke" d="M-17 -48 q-8 -10 0 -18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
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
    const sapins = [[210, 470, .8], [600, 500, .7], [1120, 470, .85], [370, 470, .6], [1330, 470, .7], [60, 470, .75]].map(([x, y, s]) => item('sapin', fir(x, y, s), 'Sapin de Noël enneigé')).join('');

    const snow = `<g class="snow" aria-hidden="true">${Array.from({ length: 70 }, (_, i) => `<circle cx="${(i * 211) % W}" cy="-10" r="${2 + (i % 3)}" fill="#fff" style="animation-duration:${6 + (i % 5) * 1.6}s;animation-delay:${-(i % 13)}s"/>`).join('')}</g>`;
    const glow = `<defs><radialGradient id="glowG"><stop offset="0" stop-color="#FFB347" stop-opacity=".55"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient></defs>`;

    return `<svg class="village-svg ${night ? 'night' : 'day'}" viewBox="0 0 ${W} ${H}" role="group" aria-label="Le village de Noël">${glow}${sky}${hills}
      ${sleigh}${sapins}${ski}${rennes}${scout}${cloches}${ledTree}${ecureuils}${stands}${tasses}${shoppers}${pond}${horloge}${train}${chef}${feu}${puits}${niche}${caravane}${snow}</svg>`;
  }

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
      <div class="walk-bar"><div class="v-ctrl"><button class="btn ${night ? 'white' : 'sun'}" id="daynight" type="button" aria-pressed="${!night}">${night ? '☀️ Passer en journée' : '🌙 Passer à la nuit'}</button></div></div>
      <div class="village-wrap panel">${scene()}</div>
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
    $('#daynight', el).addEventListener('click', () => { night = !night; draw(); });
  }

  return { title: 'Le village de Noël', mount(view) { el = view; draw(); } };
})();
route('noel', Noel);
