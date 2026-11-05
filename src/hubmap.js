/* ============================================================
   PAGE D'ACCUEIL — plan du magasin en vue isométrique
   Survoler un espace l'entoure et ouvre sa fiche ; cliquer y entre.
   ============================================================ */
const HubMap = (() => {
  const VW = 1048, VH = 836;
  const OX = 445, OY = 262, U = 13.2;
  const COS = Math.cos(Math.PI / 6), SIN = .5;
  const P = (x, y, z = 0) => [OX + (x - y) * COS * U, OY + (x + y) * SIN * U - z * U];
  const pts = (a) => a.map((p) => P(...p).map((v) => v.toFixed(1)).join(',')).join(' ');
  const sh = (c, k) => Deco.shade(c, k);
  const poly = (a, fill, extra = '') => `<polygon points="${pts(a)}" fill="${fill}" ${extra}/>`;
  const G = .62; // hauteur du sol (socle)

  /* Les 7 espaces : route, numéro, couleur, nom, sous-titre, texte de la fiche, mots-clés, emprise au sol, point d'ancrage */
  const ZONES7 = [
    { r: 'jardin', n: 1, c: '#0F4D36', name: 'La grande serre', sub: 'Plantes en pot et bulbes', cta: 'Entrer dans la serre',
      txt: () => `Pépinière, ombrière et serre chaude : ${SHOP.length} plantes à cueillir en pot ou en bulbe, avec leurs vrais prix.`, tags: ['Roseraie', 'Méditerranée', 'Plantes d’intérieur', 'Bulbes'],
      foot: [[17, -.6], [42.2, -.6], [42.2, 11.6], [17, 11.6]], at: [25.5, 5.5, 6.6] },
    { r: 'potager', n: 2, c: '#C4513B', name: 'Le potager', sub: 'Il pousse avec ta météo', cta: 'Voir mon potager',
      txt: () => 'Recrée ton potager : il pousse avec la vraie météo de ta ville, et Gaston te prévient quand il a soif.', tags: ['Météo', 'Arrosage', 'Récolte'],
      foot: [[-.4, -.4], [13.4, -.4], [13.4, 12.6], [-.4, 12.6]], at: [6.5, 4.5, .9] },
    { r: 'bouquet', n: 3, c: '#D2527F', name: 'L’atelier bouquet', sub: 'Compose ton bouquet', cta: 'Composer un bouquet',
      txt: () => `${typeof STEMS !== 'undefined' ? STEMS.length : 82} fleurs et feuillages à poser sur la table du fleuriste, et 12 plantes en pot à offrir avec.`, tags: ['Roses', 'Feuillages', 'Exotiques'],
      foot: [[.4, 13.4], [8.6, 13.4], [8.6, 21.2], [.4, 21.2]], at: [4.5, 16.5, 3] },
    { r: 'noel', n: 4, c: '#2F4A8A', name: 'Le village de Noël', sub: '27 pièces Lemax', cta: 'Visiter le village',
      txt: () => 'Une balade en cinq scènes enneigées : chaque point lumineux ouvre une pièce du village vendue chez Truffaut.', tags: ['5 scènes', 'Lemax'],
      foot: [[29.6, 24.6], [42.4, 24.6], [42.4, 32.4], [29.6, 32.4]], at: [36, 28.5, 2.6] },
    { r: 'galerie', n: 5, c: '#C9962E', name: 'La galerie', sub: 'Ton jardin en photo', cta: 'Voir la galerie',
      txt: () => 'Publie une photo de ton jardin ou de ton potager sur le mur des jardiniers, et reçois un bon de réduction.', tags: ['Photos', 'Bon offert'],
      foot: [[18.6, 13.6], [27.4, 13.6], [27.4, 19.4], [18.6, 19.4]], at: [23, 16.5, 3] },
    { r: 'clinique', n: 6, c: '#1F7F8C', name: 'La clinique des plantes', sub: 'Une tache ? Trouve l’intrus', cta: 'Soigner ma plante',
      txt: () => '14 ravageurs et maladies en images : trouve le coupable, puis le remède doux, le remède fort et les plantes résistantes.', tags: ['Ravageurs', 'Remèdes'],
      foot: [[28.6, 13.6], [34.4, 13.6], [34.4, 18.4], [28.6, 18.4]], at: [31.5, 16, 3.4] },
    { r: 'coulisses', n: 7, c: '#6B7670', name: 'Les coulisses', sub: 'Ce qui fait tourner le magasin', cta: 'Voir les coulisses',
      txt: () => 'Les automatisations derrière le site : météo, alertes, catalogue synchronisé, bons envoyés automatiquement.', tags: ['n8n', 'Automatisations'],
      foot: [[35.6, 13.6], [41.4, 13.6], [41.4, 19.4], [35.6, 19.4]], at: [38.5, 16.5, 3] },
  ];

  /* ---------- briques de dessin ---------- */
  function box(x, y, w, d, h, c, { z = 0, top = null } = {}) {
    return poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], sh(c, -.18))
      + poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], sh(c, -.32))
      + poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], top || c);
  }
  const shadow = (x, y, w, d, k = 1.2) => poly([[x + k, y + k, G], [x + w + k * 1.6, y + k, G], [x + w + k * 1.6, y + d + k * 1.6, G], [x + k, y + d + k * 1.6, G]], '#3B4A3F', 'opacity=".12"');
  function tree(x, y, r = 1, c = '#5E9A5A') {
    const [a, b] = P(x, y, G);
    return `<ellipse cx="${a}" cy="${b}" rx="${r * U * 1.1}" ry="${r * U * .55}" fill="#000" opacity=".1"/><rect x="${a - 1.5}" y="${b - r * U * 1.3}" width="3" height="${r * U * 1.3}" fill="#7A5B3E"/><circle cx="${a}" cy="${b - r * U * 1.7}" r="${r * U * .95}" fill="${c}"/><circle cx="${a - r * U * .3}" cy="${b - r * U * 2}" r="${r * U * .5}" fill="${sh(c, .22)}"/>`;
  }
  const dot = (x, y, z, r, c) => { const [a, b] = P(x, y, z); return `<circle cx="${a.toFixed(1)}" cy="${b.toFixed(1)}" r="${r}" fill="${c}"/>`; };

  /* ---------- décor (non cliquable) ---------- */
  function ground() {
    let o = box(-4, -4, 48, 38, G, '#D9C9A6', { top: '#BFD69C' });
    for (let i = 0; i < 260; i++) o += dot(-2 + ((i * 37) % 440) / 10, -2 + ((i * 53) % 340) / 10, G, 1, '#93B86C');
    for (let i = 0; i < 44; i += 1.2) o += box(-3.4 + i, -3.4, 1.1, .8, .9, '#5E9A4E', { z: G, top: '#78B45F' });
    for (let i = 0; i < 34; i += 1.2) o += box(42.6, -3.4 + i, .8, 1.1, .9, '#5E9A4E', { z: G, top: '#78B45F' });
    // parking et allées
    o += poly([[-2, 22, G], [14, 22, G], [14, 32, G], [-2, 32, G]], '#C4C2BA');
    for (let i = 0; i < 7; i++) o += poly([[-1 + i * 2.1, 23, G], [-.85 + i * 2.1, 23, G], [-.85 + i * 2.1, 26.5, G], [-1 + i * 2.1, 26.5, G]], '#F2F2EE');
    [[0, 23.6, '#C04A3A'], [4.2, 23.6, '#3D5A8C'], [8.4, 23.6, '#E2E2DE'], [2.1, 28.6, '#2F3A36'], [10.5, 28.6, '#7FA7C9']].forEach(([x, y, c]) => { o += box(x, y, 1.5, 2.6, .7, c, { z: G }) + box(x + .2, y + .7, 1.1, 1.3, .45, sh(c, .2), { z: G + .7 }); });
    o += poly([[14, 22, G], [42, 22, G], [42, 24.5, G], [14, 24.5, G]], '#EFE3C8') + poly([[14, -2, G], [16.5, -2, G], [16.5, 32, G], [14, 32, G]], '#EFE3C8');
    // bassin
    let d = ''; for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; const [x, y] = P(26 + Math.cos(a) * 2.6, 20.2 + Math.sin(a) * 1.4, G); d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
    o += `<path d="${d}Z" fill="#8EC6D6" stroke="#6FAFC2" stroke-width="2"/>`;
    // massifs fleuris le long de l'allée
    [[17, 21.2, 9], [30, 21.2, 10]].forEach(([x, y, w]) => { o += box(x, y, w, .7, .25, '#8A5A36', { z: G, top: '#6B4A30' }); for (let k = 0; k < w * 3; k++) o += dot(x + .2 + k * .33, y + .35, G + .32, 2.6, ['#E85B7A', '#F2C44E', '#9C7FD6', '#F6F1F4', '#E86B4F'][k % 5]); });
    return o;
  }
  function people() {
    return [[15.2, 9], [15.4, 17], [20, 22.8], [26, 23.3], [32, 23], [10, 22.4]].map(([x, y], i) => { const [a, b] = P(x, y, G); return `<circle cx="${a}" cy="${b - 12}" r="2.4" fill="#2F3A36"/><rect x="${a - 2}" y="${b - 10}" width="4" height="10" rx="2" fill="${['#2EBB99', '#C4513B', '#2F4A8A', '#E7B84A', '#D2527F', '#1F7F8C'][i]}"/>`; }).join('');
  }
  const trees = () => [[-1, 12], [-1, 15], [14.8, 1], [14.8, 6], [14.8, 11], [14.8, 15], [14.8, 19], [17, 20.3], [28, 20.3], [12, 12], [10, 21], [24, 12], [28.5, 12.2]]
    .map(([x, y], i) => tree(x, y, .8 + (i % 3) * .15, ['#5E9A5A', '#4E8A4C', '#6FA764'][i % 3])).join('');

  /* ---------- les espaces ---------- */
  const DRAWZ = {
    jardin() {
      let o = shadow(17.5, 0, 16, 11) + box(17.5, 0, 16, 11, .5, '#F1F3F0', { z: G });
      const gx = 17.5, gy = 0, gw = 16, gd = 11, gh = 4.8, z0 = G + .5;
      o += poly([[gx, gy + gd, z0], [gx + gw, gy + gd, z0], [gx + gw, gy + gd, gh], [gx, gy + gd, gh]], '#CFE6EC', 'opacity=".9"');
      o += poly([[gx + gw, gy, z0], [gx + gw, gy + gd, z0], [gx + gw, gy + gd, gh], [gx + gw, gy, gh]], '#B7D3DC', 'opacity=".9"');
      for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) { const x = gx + 1 + k * 2.5, y = gy + 1.2 + r * 2.5; o += box(x, y, 2, 1.4, .5, '#C9A06A', { z: z0, top: '#D8B27A' }); for (let q = 0; q < 4; q++) o += dot(x + .4 + (q % 2) * 1.1, y + .35 + Math.floor(q / 2) * .65, z0 + .6, U * .35, ['#4F9A4C', '#E06A8E', '#63A94F', '#F2C44E'][(r + k + q) % 4]); }
      for (let i = 0; i <= 8; i++) { const x = gx + i * 2; o += poly([[x, gy + gd, z0], [x + .08, gy + gd, z0], [x + .08, gy + gd, gh], [x, gy + gd, gh]], '#FFFFFF'); }
      for (let i = 0; i <= 5; i++) { const y = gy + i * 2.2; o += poly([[gx + gw, y, z0], [gx + gw, y + .08, z0], [gx + gw, y + .08, gh], [gx + gw, y, gh]], '#FFFFFF'); }
      for (let i = 0; i < 4; i++) { const x = gx + i * 4; o += poly([[x, gy, gh], [x + 2, gy, gh + 1.6], [x + 2, gy + gd, gh + 1.6], [x, gy + gd, gh]], '#DDEEF2', 'opacity=".75" stroke="#FFFFFF" stroke-width="1.2"') + poly([[x + 2, gy, gh + 1.6], [x + 4, gy, gh], [x + 4, gy + gd, gh], [x + 2, gy + gd, gh + 1.6]], '#C2DDE6', 'opacity=".85" stroke="#FFFFFF" stroke-width="1.2"'); }
      const [a, b] = P(gx + 4, gy + gd, gh - .1), [c2, d2] = P(gx + 12, gy + gd, gh - .1), ang = Math.atan2(d2 - b, c2 - a) * 180 / Math.PI;
      o += `<polygon points="${a},${b} ${c2},${d2} ${c2},${d2 + 17} ${a},${b + 17}" fill="#0F4D36"/><text transform="translate(${(a + c2) / 2} ${(b + d2) / 2 + 12.5}) skewY(${ang.toFixed(1)})" text-anchor="middle" font-family="Brygada 1918, serif" font-weight="600" font-size="11.5" fill="#fff">La grande serre</text>`;
      // ombrière (pépinière extérieure)
      o += shadow(34.5, 0, 7, 11, .6);
      for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) { const x = 35 + k * 3.2, y = .8 + r * 2.6; for (let q = 0; q < 6; q++) o += dot(x + (q % 3) * .9, y + Math.floor(q / 3) * .9, G + .4, U * .4, ['#3F7D3A', '#F3A6B8', '#5E9A5A', '#C8243C', '#8FA47E', '#9C7FD6'][(q + r + k) % 6]); }
      [[34.6, .2], [41.4, .2], [34.6, 10.8], [41.4, 10.8]].forEach(([x, y]) => { o += poly([[x, y, G], [x + .15, y, G], [x + .15, y, G + 3], [x, y, G + 3]], '#5E6662'); });
      return o + poly([[34.5, 0, G + 3], [41.5, 0, G + 3], [41.5, 11, G + 3], [34.5, 11, G + 3]], '#1E3B2C', 'opacity=".55"');
    },
    potager() {
      let o = poly([[0, 0, G], [13, 0, G], [13, 9, G], [0, 9, G]], '#D9C59C');
      for (let r = 0; r < 4; r++) { o += box(.8, .8 + r * 2.1, 11.4, 1.3, .4, '#8A5A36', { z: G, top: '#6B4A30' }); for (let k = 0; k < 10; k++) o += dot(1.3 + k * 1.1, 1.45 + r * 2.1, G + .5, U * .28, ['#5DA14E', '#E2483A', '#7FBF5A', '#F09A3A'][r]); }
      return o + box(.5, 10, 3, 2.2, 2, '#B78E5E', { z: G, top: '#8F3D2E' });
    },
    bouquet() {
      let o = shadow(1, 14, 7, 5) + box(1, 14, 7, 5, 2.6, '#F4EDE3', { z: G });
      for (let i = 0; i < 6; i++) o += poly([[1 + i * 7 / 6, 19, G + 2.6], [1 + (i + 1) * 7 / 6, 19, G + 2.6], [1 + (i + 1) * 7 / 6, 20, G + 2], [1 + i * 7 / 6, 20, G + 2]], i % 2 ? '#FFFFFF' : '#D2527F');
      for (let k = 0; k < 6; k++) { const [a, b] = P(1.6 + k * 1.1, 20.4, G + .3); o += `<rect x="${a - 5}" y="${b - 9}" width="10" height="9" fill="#AEB8BC"/><circle cx="${a - 2}" cy="${b - 12}" r="4" fill="${['#E85B7A', '#F2C44E', '#F6F1F4', '#C8243C', '#F3A6B8', '#9C7FD6'][k]}"/><circle cx="${a + 3}" cy="${b - 13}" r="3.5" fill="${['#F3A6B8', '#E85B7A', '#F2C44E', '#9C7FD6', '#F6F1F4', '#C8243C'][k]}"/>`; }
      return o;
    },
    noel() {
      let o = poly([[30, 25, G], [42, 25, G], [42, 32, G], [30, 32, G]], '#F6F8F9');
      [[31, 26, '#B4483C'], [34.2, 26, '#2F4A8A'], [37.4, 26, '#3E7D5A'], [31, 29.2, '#C9962E'], [37.4, 29.2, '#B4483C']].forEach(([x, y, c]) => {
        o += box(x, y, 2.4, 2, 1.4, '#E9D6B8', { z: G }) + poly([[x, y, G + 1.4], [x + 2.4, y, G + 1.4], [x + 2.4, y + 1, G + 2.3], [x, y + 1, G + 2.3]], '#FFFFFF') + poly([[x, y + 1, G + 2.3], [x + 2.4, y + 1, G + 2.3], [x + 2.4, y + 2, G + 1.4], [x, y + 2, G + 1.4]], '#F1F4F6');
        const [a, b] = P(x + 1.2, y + 2, G + .5); o += `<rect x="${a - 3}" y="${b - 9}" width="6" height="8" fill="${c}"/>`;
      });
      const [a, b] = P(35.4, 30.2, G);
      return o + `<polygon points="${a},${b - 46} ${a - 14},${b} ${a + 14},${b}" fill="#2F6B45"/><polygon points="${a},${b - 46} ${a - 9},${b - 22} ${a + 9},${b - 22}" fill="#3E7D5A"/><circle cx="${a}" cy="${b - 48}" r="3.5" fill="#E7B84A"/>`;
    },
    galerie() {
      let o = poly([[19, 14, G], [27, 14, G], [27, 19, G], [19, 19, G]], '#EADBBB');
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) o += box(19.2 + i * 2.5, 14.2 + j * 4.4, .3, .3, 2.6, '#9A7650', { z: G });
      for (let i = 0; i < 9; i++) o += box(19 + i, 14, .2, 5, .2, '#B48C60', { z: G + 2.6 });
      for (let i = 0; i < 3; i++) { const [a, b] = P(20.4 + i * 2.5, 19, G + 1.8); o += `<rect x="${a - 9}" y="${b - 10}" width="18" height="14" fill="#fff" stroke="#9A7650"/><rect x="${a - 7}" y="${b - 8}" width="14" height="10" fill="${['#8FC5A0', '#F0B9C8', '#A8C9E6'][i]}"/>`; }
      return o;
    },
    clinique() {
      let o = shadow(29, 14, 5, 4) + box(29, 14, 5, 4, 2.2, '#FFFFFF', { z: G });
      o += poly([[29, 14, G + 2.2], [34, 14, G + 2.2], [34, 16, G + 3.2], [29, 16, G + 3.2]], '#1F7F8C') + poly([[29, 16, G + 3.2], [34, 16, G + 3.2], [34, 18, G + 2.2], [29, 18, G + 2.2]], '#2A97A6');
      const [a, b] = P(31.5, 18, G + 1.4);
      return o + `<rect x="${a - 8}" y="${b - 8}" width="16" height="16" rx="3" fill="#1F7F8C"/><path d="M${a} ${b - 5}v10M${a - 5} ${b}h10" stroke="#fff" stroke-width="2.6"/>`;
    },
    coulisses() { return box(36, 14, 5, 5, 2.6, '#C9CCC4', { z: G }) + box(37.2, 15, 1.4, 1.2, .8, '#9AA39E', { z: G + 2.6 }); },
  };
  function pin(z) {
    const [a, b] = P(...z.at);
    return `<g class="pin"><line x1="${a}" y1="${b}" x2="${a}" y2="${b - 26}" stroke="${z.c}" stroke-width="2"/><circle cx="${a}" cy="${b - 38}" r="14" fill="${z.c}" stroke="#fff" stroke-width="3"/><text x="${a}" y="${b - 33}" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="14" fill="#fff">${z.n}</text></g>`;
  }

  function svg() {
    const zones = ZONES7.map((z) => `<g class="pz" data-r="${z.r}" tabindex="0" role="link" aria-label="${esc(z.name)} : ${esc(z.sub)}">
        ${DRAWZ[z.r]()}
        <polygon class="pz-hit" points="${pts(z.foot.map(([x, y]) => [x, y, G]))}"/>
        <polygon class="pz-ring" points="${pts(z.foot.map(([x, y]) => [x, y, G]))}" style="--c:${z.c}"/>
      </g>`).join('');
    const [ex, ey] = P(16.5, 22.6, G);
    return `<svg class="plan-svg" viewBox="0 0 ${VW} ${VH}" role="group" aria-label="Plan du magasin : 7 espaces">
      ${ground()}${trees()}${zones}${people()}${ZONES7.map(pin).join('')}
      <g transform="translate(${ex} ${ey})"><rect x="-38" y="-14" width="76" height="24" rx="12" fill="#0F4D36"/><text y="3" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="11" fill="#fff" letter-spacing=".08em">ENTRÉE</text></g>
    </svg>`;
  }

  let el, cur = null;
  function show(r) {
    const z = ZONES7.find((x) => x.r === r); if (!z || !el) return;
    cur = r;
    $$('.pz', el).forEach((g) => g.classList.toggle('on', g.dataset.r === r));
    $$('.plan-list a', el).forEach((a) => a.classList.toggle('on', a.dataset.r === r));
    const tip = $('.plan-tip', el), [a, b] = P(...z.at);
    tip.innerHTML = `<div class="k" style="color:${z.c}">Espace ${z.n}</div><h3>${esc(z.name)}</h3><p>${esc(z.txt())}</p>
      <div class="row">${z.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div><a class="go" href="#${z.r}">${esc(z.cta)} →</a>`;
    // fiche à droite du repère, ou à gauche s'il est trop près du bord
    const left = a / VW * 100, top = (b - 46) / VH * 100;
    tip.style.top = `max(12px, calc(${top}% - 150px))`;
    if (left > 62) { tip.style.left = ''; tip.style.right = `calc(${100 - left}% + 26px)`; } else { tip.style.right = ''; tip.style.left = `calc(${left}% + 26px)`; }
    tip.hidden = false;
  }

  function mount(view) {
    el = view;
    el.innerHTML = `<div class="plan">
      <section class="plan-map">
        <div class="plan-title"><h1>Bienvenue au Grand Jardin</h1><p>Survolez un espace du plan, cliquez pour y entrer.</p></div>
        ${svg()}
        <div class="plan-tip" hidden></div>
        <div class="plan-legend"><span><i style="background:#2EBB99"></i>Espaces de vente</span><span><i style="background:#E7B84A"></i>Ateliers & services</span><span><i style="background:#9AA39E"></i>Allées & parking</span></div>
      </section>
      <aside class="plan-side">
        <h2>Plan du magasin</h2><p>7 espaces à explorer, comme en vrai.</p>
        <nav class="plan-list" aria-label="Les espaces">${ZONES7.map((z) => `<a href="#${z.r}" data-r="${z.r}"><span class="n" style="background:${z.c}">${z.n}</span><span><b>${esc(z.name)}</b><small>${esc(z.sub)}</small></span><em>${z.r === 'jardin' ? 'Entrer' : 'Voir'}</em></a>`).join('')}</nav>
        <div class="plan-note"><b>Nouveau</b> La serre chaude et ses plantes d’intérieur : orchidées, monstera, bonsaïs…</div>
      </aside>
    </div>`;
    $$('.pz', el).forEach((g) => {
      g.addEventListener('mouseenter', () => show(g.dataset.r));
      g.addEventListener('focus', () => show(g.dataset.r));
      g.addEventListener('click', () => go(g.dataset.r));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(g.dataset.r); } });
    });
    $$('.plan-list a', el).forEach((a) => { a.addEventListener('mouseenter', () => show(a.dataset.r)); a.addEventListener('focus', () => show(a.dataset.r)); });
    show('jardin');
  }
  return { mount, ZONES7 };
})();
route('', { title: '', mount: (el) => HubMap.mount(el) });
