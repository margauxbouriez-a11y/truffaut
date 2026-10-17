/* ============================================================
   DÉCOR : motifs, fleurs détaillées, bouquets d'angle, guirlandes, Gaston
   ============================================================ */
const Deco = (() => {
  // Motifs partagés (hachures, papier) injectés une seule fois dans la page
  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><path d="M0 0 V6" stroke="${INK}" stroke-width="1.1" opacity=".38"/></pattern>
    <pattern id="hatchL" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><path d="M0 0 V5" stroke="#fff" stroke-width="1.2" opacity=".55"/></pattern>
    <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="${INK}" opacity=".3"/></pattern>
    <radialGradient id="petalShade" cx=".5" cy=".85" r=".9"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".6" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs></svg>`;

  const shade = (c, k = -0.18) => { // assombrit ou éclaircit une couleur hex
    const n = parseInt(c.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = (v) => Math.round(clamp(k < 0 ? v * (1 + k) : v + (255 - v) * k, 0, 255));
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  };

  /* Feuille nervurée, ombrée d'un côté */
  function leaf(x, y, len, ang, fill = '#5E9446', w = .42) {
    const L = len, W = len * w;
    const d = `M0 0 C${L * .25} ${-W} ${L * .7} ${-W * .9} ${L} 0 C${L * .7} ${W * .8} ${L * .25} ${W * .9} 0 0Z`;
    const half = `M0 0 C${L * .7} ${W * .1} ${L * .9} 0 ${L} 0 C${L * .7} ${W * .8} ${L * .25} ${W * .9} 0 0Z`;
    let veins = `<path d="M0 0 Q${L * .5} ${-W * .08} ${L * .96} 0" fill="none" stroke="${INK}" stroke-width="1.1"/>`;
    for (let i = 1; i <= 3; i++) { const t = i / 4.2; veins += `<path d="M${L * t} ${-W * .04} q${L * .12} ${-W * .35} ${L * .2} ${-W * .55} M${L * t} ${W * .02} q${L * .12} ${W * .32} ${L * .2} ${W * .5}" fill="none" stroke="${INK}" stroke-width=".8" opacity=".7"/>`; }
    return `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="${half}" fill="url(#hatch)"/>${veins}</g>`;
  }

  /* Pivoine : pétales en couches avec ombre */
  function peony(x, y, r, c = '#EE9AAE') {
    const dark = shade(c, -0.22), light = shade(c, 0.35);
    let g = '';
    for (let i = 0; i < 9; i++) { const a = i * 40; g += `<path d="M0 0 C${-r * .7} ${-r * .5} ${-r * .55} ${-r * 1.1} 0 ${-r} C${r * .55} ${-r * 1.1} ${r * .7} ${-r * .5} 0 0Z" fill="${dark}" stroke="${INK}" stroke-width="1.4" transform="rotate(${a})"/>`; }
    for (let i = 0; i < 7; i++) { const a = i * 51 + 20; g += `<path d="M0 0 C${-r * .55} ${-r * .35} ${-r * .45} ${-r * .82} 0 ${-r * .76} C${r * .45} ${-r * .82} ${r * .55} ${-r * .35} 0 0Z" fill="${c}" stroke="${INK}" stroke-width="1.3" transform="rotate(${a})"/>`; }
    for (let i = 0; i < 6; i++) { const a = i * 60 + 10; g += `<path d="M0 0 C${-r * .35} ${-r * .2} ${-r * .3} ${-r * .5} 0 ${-r * .48} C${r * .3} ${-r * .5} ${r * .35} ${-r * .2} 0 0Z" fill="${light}" stroke="${INK}" stroke-width="1.1" transform="rotate(${a})"/>`; }
    g += `<circle r="${r * .16}" fill="#F6D36A" stroke="${INK}" stroke-width="1"/><circle r="${r * 1.02}" fill="url(#petalShade)"/>`;
    return `<g transform="translate(${x} ${y})">${g}</g>`;
  }

  /* Rose ancienne vue de face, spirale de pétales */
  function rose(x, y, r, c = '#D9475C') {
    const dark = shade(c, -0.25), light = shade(c, 0.25);
    let g = `<circle r="${r}" fill="${dark}" stroke="${INK}" stroke-width="1.5"/>`;
    for (let i = 0; i < 5; i++) g += `<path d="M${-r * .9} 0 A${r * .9} ${r * .9} 0 0 1 ${r * .5} ${-r * .72}" fill="none" stroke="${INK}" stroke-width="1.2" transform="rotate(${i * 72})"/>`;
    g += `<circle r="${r * .66}" fill="${c}" stroke="${INK}" stroke-width="1.3"/>`;
    g += `<path d="M${-r * .45} ${r * .1} A${r * .45} ${r * .45} 0 1 1 ${r * .2} ${r * .42} M${-r * .2} ${-r * .05} A${r * .22} ${r * .22} 0 1 1 ${r * .12} ${r * .18}" fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/>`;
    g += `<path d="M${-r * .5} ${-r * .3} q${r * .2} ${-r * .2} ${r * .45} ${-r * .15}" fill="none" stroke="${light}" stroke-width="2" stroke-linecap="round"/><circle r="${r}" fill="url(#petalShade)"/>`;
    return `<g transform="translate(${x} ${y})">${g}</g>`;
  }

  /* Marguerite / cosmos */
  function daisy(x, y, r, c = '#FFFFFF', heart = '#F0A830', n = 13) {
    let g = '';
    for (let i = 0; i < n; i++) g += `<path d="M0 ${-r * .2} C${-r * .22} ${-r * .55} ${-r * .14} ${-r} 0 ${-r} C${r * .14} ${-r} ${r * .22} ${-r * .55} 0 ${-r * .2}Z" fill="${c}" stroke="${INK}" stroke-width="1.2" transform="rotate(${(360 / n) * i})"/><path d="M0 ${-r * .3} V${-r * .8}" stroke="${INK}" stroke-width=".6" opacity=".4" transform="rotate(${(360 / n) * i})"/>`;
    g += `<circle r="${r * .3}" fill="${heart}" stroke="${INK}" stroke-width="1.3"/><circle r="${r * .3}" fill="url(#dots)"/>`;
    return `<g transform="translate(${x} ${y})">${g}</g>`;
  }

  /* Tulipe en coupe */
  function tulip(x, y, s, c = '#E04E2E') {
    const dark = shade(c, -0.25);
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 -4 C-18 -22 -12 -34 -6 -36 L0 -26 L6 -36 C12 -34 18 -22 14 -4 C8 4 -8 4 -14 -4Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
      <path d="M-6 -36 C-2 -22 2 -22 6 -36 L0 -26Z" fill="${dark}" stroke="${INK}" stroke-width="1.2"/><path d="M4 -2 C10 -10 12 -20 10 -28" fill="none" stroke="${INK}" stroke-width=".9" opacity=".6"/><path d="M-14 -4 C-8 4 8 4 14 -4 C6 0 -6 0 -14 -4Z" fill="url(#hatch)"/></g>`;
  }

  /* Petit bouton floral, brin de lavande, baies */
  const bud = (x, y, a, c) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 C-6 -6 -5 -14 0 -18 C5 -14 6 -6 0 0Z" fill="${c}" stroke="${INK}" stroke-width="1.2"/><path d="M-4 -2 L0 4 L4 -2" fill="#5E9446" stroke="${INK}" stroke-width="1"/></g>`;
  function lavender(x, y, h, a) {
    let g = `<path d="M0 0 Q2 ${-h * .5} 0 ${-h}" fill="none" stroke="#6E8B55" stroke-width="1.6"/>`;
    for (let i = 0; i < 7; i++) g += `<ellipse cx="${i % 2 ? 3 : -3}" cy="${-h + i * 5}" rx="3.2" ry="4.4" fill="${i % 3 ? '#8E7CC3' : '#A897D8'}" stroke="${INK}" stroke-width=".9"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${a})">${g}</g>`;
  }
  const berries = (x, y, c = '#C8243C') => [[0, 0], [7, -3], [3, 6], [-6, 4]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="4" fill="${c}" stroke="${INK}" stroke-width="1"/><circle cx="${x + dx - 1.3}" cy="${y + dy - 1.3}" r="1.1" fill="#fff" opacity=".7"/>`).join('');

  /* Bouquet d'angle : pivoines, roses, marguerites, lavande, feuillage */
  function corner(variant = 0) {
    const pal = [['#EE9AAE', '#D9475C', '#F0A830'], ['#F3B6A0', '#B9475E', '#FFFFFF'], ['#C9B6E8', '#E04E2E', '#F6D36A']][variant % 3];
    return `<svg viewBox="0 0 300 240" aria-hidden="true" class="corner-svg">
      ${leaf(40, 60, 90, -20, '#4E7D3A')}${leaf(30, 110, 100, 10, '#6B9A4E')}${leaf(120, 30, 80, -70, '#5E9446')}${leaf(150, 120, 70, 30, '#4E7D3A')}
      ${leaf(200, 40, 70, -10, '#6B9A4E')}${leaf(60, 160, 80, 50, '#5E9446')}
      ${lavender(210, 120, 70, 40)}${lavender(225, 110, 60, 55)}${lavender(30, 200, 60, -30)}
      ${berries(250, 70)}${berries(110, 190, '#8E7CC3')}
      ${peony(90, 80, 46, pal[0])}${rose(170, 70, 28, pal[1])}${daisy(60, 150, 22, pal[2] === '#FFFFFF' ? '#FFFFFF' : '#FFFFFF', pal[2] === '#FFFFFF' ? '#F0A830' : pal[2])}
      ${rose(140, 140, 20, pal[1])}${daisy(200, 160, 14)}${bud(240, 30, 30, pal[0])}${bud(18, 30, -40, pal[1])}${tulip(250, 180, .9, '#F0A830')}
    </svg>`;
  }

  /* Guirlande horizontale : tige ondulante, feuilles et petites fleurs */
  function garland(w = 600, seed = 1) {
    let d = `M0 20`; const step = 60;
    for (let x = 0; x < w; x += step) d += ` Q${x + step / 4} ${x / step % 2 ? 6 : 34} ${x + step / 2} 20 T${x + step} 20`;
    let g = `<path d="${d}" fill="none" stroke="#4E7D3A" stroke-width="2"/>`;
    const pal = ['#EE9AAE', '#F0A830', '#FFFFFF', '#8E7CC3', '#E04E2E'];
    for (let x = 20, i = seed; x < w - 10; x += 34, i++) {
      g += leaf(x, 20, 18, i % 2 ? -40 : 140, i % 3 ? '#5E9446' : '#7FA85A');
      if (i % 3 === 0) g += daisy(x + 12, 20 + (i % 2 ? -8 : 8), 7, pal[i % 5], '#F0A830', 9);
      else if (i % 5 === 1) g += bud(x + 6, 18, i % 2 ? 20 : -20, pal[(i + 2) % 5]);
    }
    return `<svg class="garland" viewBox="0 0 ${w} 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${g}</svg>`;
  }

  /* Gaston, l'escargot pince-sans-rire */
  function snail(s = 1) {
    return `<svg viewBox="0 0 150 100" class="gaston-svg" aria-hidden="true"><g transform="scale(${s})">
      <path d="M8 88 C20 70 50 74 70 76 L118 80 C132 80 138 70 134 58 C132 50 136 40 128 36" fill="#E8C9A0" stroke="${INK}" stroke-width="2"/>
      <path d="M8 88 H128 C136 88 140 82 136 76" fill="#E8C9A0" stroke="${INK}" stroke-width="2"/>
      <path d="M12 86 C30 80 60 82 120 84" fill="url(#hatch)" stroke="none"/>
      <path d="M128 36 L122 14 M134 38 L140 16" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="122" cy="12" r="5" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cx="140" cy="14" r="5" fill="#fff" stroke="${INK}" stroke-width="1.6"/>
      <path d="M118 11 h8" stroke="${INK}" stroke-width="2.4"/><path d="M136 13 h8" stroke="${INK}" stroke-width="2.4"/>
      <path d="M126 58 q6 4 10 -1" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="68" cy="50" r="34" fill="#C77A45" stroke="${INK}" stroke-width="2.2"/>
      <path d="M68 50 m-24 0 a24 24 0 1 1 24 24 a18 18 0 1 1 -14 -22 a11 11 0 1 1 10 14 a5 5 0 1 1 -4 -6" fill="none" stroke="${INK}" stroke-width="1.8"/>
      <path d="M42 66 A34 34 0 0 0 100 64 A30 30 0 0 1 42 66Z" fill="url(#hatch)"/>
      <path d="M50 28 q10 -8 22 -6" fill="none" stroke="#F3D3A8" stroke-width="3" stroke-linecap="round"/>
      <path d="M40 22 C46 10 60 8 66 16 C60 14 50 16 40 22Z" fill="#5E9446" stroke="${INK}" stroke-width="1.4"/>${daisy(66, 17, 7, '#FFFFFF', '#F0A830', 9)}
    </g></svg>`;
  }
  function gaston(lines, id = 'g') {
    return `<button class="gaston" type="button" data-lines="${esc(JSON.stringify(lines))}" data-i="0" aria-label="Gaston l’escargot. Cliquer pour qu’il parle encore.">
      <span class="bubble" aria-live="polite">${esc(lines[0])}</span>${snail()}</button>`;
  }
  // Un clic sur Gaston : il passe à sa réplique suivante
  document.addEventListener('click', (e) => {
    const g = e.target.closest('.gaston'); if (!g) return;
    const lines = JSON.parse(g.dataset.lines); const i = (+g.dataset.i + 1) % lines.length;
    g.dataset.i = i; const b = $('.bubble', g); b.textContent = lines[i]; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  });

  /* En-tête de page fleuri */
  function head(title, intro, lines, variant = 0, extra = '') {
    return `<div class="page-head deco-head">
      <div class="corner c-left">${corner(variant)}</div><div class="corner c-right">${corner(variant + 1)}</div>
      <div class="head-text"><h1>${title}</h1><p>${intro}</p>${extra}</div>
      ${lines ? gaston(lines) : ''}
    </div>${garland(1200, variant + 2)}`;
  }

  return { DEFS, leaf, peony, rose, daisy, tulip, bud, lavender, berries, corner, garland, snail, gaston, head, shade };
})();
