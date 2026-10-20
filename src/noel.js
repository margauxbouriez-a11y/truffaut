/* ============================================================
   LE VILLAGE DE NOËL — chaque élément est un produit Truffaut
   ============================================================ */
const Noel = (() => {
  let keys = null;
  let el, mode = 'walk', fails = 0, zoom = window.innerWidth < 700 ? 1.8 : 1.4;
  const W = 1400, H = 820;
  const it = (id) => VILLAGE.find((v) => v.id === id);
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



  /* ---------- La promenade : 5 scènes illustrées, on avance de l'une à l'autre ---------- */
  // Chaque scène : image, et les produits Truffaut posés dedans [id, x %, y %]
  // nav : panneaux cliquables qui mènent à une autre scène [index, x %, y %, libellé]
  const SCENES = [
    { id: 'entree', name: 'L’entrée du village', img: 'img/noel/1-entree',
      intro: 'Les panneaux t’indiquent le chemin. Passe sous l’arche pour entrer dans le village.',
      items: [['sapin', 14, 40], ['arbre-led', 88, 36], ['acheteurs', 50, 63]],
      nav: [[2, 22.5, 51, 'Marché de Noël'], [4, 21.5, 60.5, 'Atelier du Père Noël'], [1, 34.5, 47, 'Grande rue'], [3, 34.5, 56, 'Patinoire'], [1, 50, 42, 'Entrer dans le village']] },
    { id: 'rue', name: 'La grande rue', img: 'img/noel/2-grande-rue',
      intro: 'Chocolatiers, pâtisserie et brasserie : chaque vitrine existe en miniature.',
      items: [['lucy', 16.5, 33], ['patisserie', 28.6, 46.5], ['brasserie', 73.4, 52], ['hollyjolly', 95, 39], ['photo', 25, 62], ['bonbons', 77.5, 64], ['acheteurs', 53, 63]],
      signs: [{ pts: '1129,407 1228,384 1228,422 1129,442', text: 'Brasserie', x: 1178, y: 421, size: 21, len: 84, sk: -13.5 }] },
    { id: 'marche', name: 'Le marché de Noël', img: 'img/noel/3-marche',
      intro: 'Une allée de chalets en bois. Chaque stand existe en miniature.',
      items: [['churros', 8, 20], ['bretzels', 32, 36], ['crepes', 82, 38], ['marrons', 30, 62], ['choco', 70, 66]],
      signs: [{ pts: '-4,-8 148,42 205,134 205,187 -4,86', text: 'Churros', x: 98, y: 118, size: 64, len: 190, rot: 26 },
        { pts: '1226,230 1412,193 1412,238 1228,307', text: 'Crêpes', x: 1318, y: 283, size: 52, len: 160, sk: -11.5 }] },
    { id: 'patinoire', name: 'La patinoire', img: 'img/noel/4-patinoire',
      intro: 'On patine autour du sapin, sur la place bordée de maisons illuminées.',
      items: [['place', 30, 28], ['christkindl', 78, 33], ['arbre-led', 49, 38], ['patinage', 60, 56], ['glace', 41, 55], ['patins', 20, 69], ['acheteurs', 86, 70]] },
    { id: 'atelier', name: 'L’atelier du Père Noël', img: 'img/noel/5-atelier',
      intro: 'Sous l’aurore boréale, l’atelier où naissent les jouets.',
      items: [['atelier', 50, 47], ['tour', 50, 13], ['jouets', 93, 67], ['rennes', 4, 47], ['visite', 59, 74], ['promenade', 8, 82], ['traineau', 24, 15]],
      signs: [{ pts: '1426,520 1600,520 1600,547 1426,547', text: 'Fabrique de jouets', x: 1510, y: 540, size: 17, len: 150 }] },
  ];
  let sc = 0, busy = false;
  const pin = (id, x, y, i) => { const v = it(id); if (!v) return '';
    return `<button class="spot" type="button" data-id="${id}" style="left:${x}%;top:${y}%;animation-delay:${(i * .37) % 2}s" aria-label="${esc(v.name)}${v.price ? ', ' + euro(v.price) : ''}">
      <span class="spot-dot" aria-hidden="true"></span><span class="spot-tag"><b>${esc(v.name.replace(/\s*\+\s*adaptateur.*$/i, ''))}</b><span>${v.price ? euro(v.price) : 'Prix en magasin'}</span></span></button>`; };
  const navPin = ([to, x, y, label]) => `<button class="spot-nav" type="button" data-go="${to}" style="left:${x}%;top:${y}%" aria-label="Aller à : ${esc(label)}"><span>${esc(label)} ›</span></button>`;
  // enseignes repeintes sur le décor, pour que chaque bâtiment porte le nom de son équivalent Truffaut
  const tfOf = (g, x, y) => `translate(${x} ${y})${g.sk ? ` skewY(${g.sk})` : ''}${g.rot ? ` rotate(${g.rot})` : ''} translate(${-x} ${-y})`;
  const signsSVG = (S) => !S.signs ? '' : `<svg class="sc-signs" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">${S.signs.map((g) => `
    <polygon points="${g.pts}" fill="#2A1A10" stroke="#2A1A10" stroke-width="6" stroke-linejoin="round"/><polygon points="${g.pts}" fill="#E2B04A"/>
    <g transform="${tfOf(g, g.x, g.y)}"><text x="${g.x}" y="${g.y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="${g.size}" fill="#FFF4D6" textLength="${g.len}" lengthAdjust="spacingAndGlyphs">${esc(g.text)}</text></g>
    ${g.mug ? `<g transform="${tfOf(g, g.mug[0], g.mug[1])} translate(${g.mug[0]} ${g.mug[1]})"><rect x="-6" y="-9" width="10" height="13" rx="1.5" fill="#F6C343" stroke="#2A1A10" stroke-width="1.4"/><path d="M-6 -9 q5 -5 10 0" fill="#FFF8E8" stroke="#2A1A10" stroke-width="1.2"/><path d="M4 -6 h3 a2 2 0 0 1 0 6 h-3" fill="none" stroke="#2A1A10" stroke-width="1.4"/></g>` : ''}`).join('')}</svg>`;
  function sceneHTML(i) {
    const S = SCENES[i];
    return `<picture><img class="sc-img" src="${S.img}.webp" alt="${esc(S.name)}" width="1600" height="900" decoding="async"></picture>${signsSVG(S)}
      ${S.items.map(([id, x, y], k) => pin(id, x, y, k)).join('')}${(S.nav || []).map(navPin).join('')}`;
  }
  function stage() {
    return `<div class="scene-stage" id="stage" tabindex="0" aria-label="${esc(SCENES[sc].name)}. Flèches gauche et droite pour changer de scène.">
        <div class="scene-layer on" id="layer">${sceneHTML(sc)}</div>
        <svg class="walk-snow" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">${Array.from({ length: 90 }, (_, i) => `<circle cx="${(i * 197) % 1600}" cy="-10" r="${1.4 + (i % 3)}" fill="#fff" opacity=".85" style="animation-duration:${6 + (i % 5) * 1.6}s;animation-delay:${-(i % 13)}s"/>`).join('')}</svg>
        <button class="sc-arrow prev" id="sc-prev" type="button" aria-label="Scène précédente">‹</button>
        <button class="sc-arrow next" id="sc-next" type="button" aria-label="Scène suivante">›</button>
        <p class="sc-caption" id="sc-cap"><b>${esc(SCENES[sc].name)}</b> <span>${esc(SCENES[sc].intro)}</span></p>
      </div>
      <ol class="sc-strip" aria-label="Les scènes du village">${SCENES.map((S, i) => `<li><button type="button" data-sc="${i}" aria-current="${i === sc ? 'step' : 'false'}"><img src="${S.img}-mini.webp" alt="" width="160" height="90" loading="lazy"><span>${i + 1}. ${esc(S.name)}</span></button></li>`).join('')}</ol>
      <div class="sc-here panel" id="sc-here">${hereHTML()}</div>`;
  }
  function hereHTML() {
    const ids = [...new Set(SCENES[sc].items.map(([id]) => id))];
    return `<span class="np-lbl">Dans cette scène</span>${ids.map((id) => { const v = it(id); return `<button class="np-item" type="button" data-id="${id}"><b>${esc(v.name.replace(/\s*\+\s*adaptateur.*$/i, ''))}</b><span>${v.price ? euro(v.price) : 'Prix en magasin'}</span></button>`; }).join('')}`;
  }
  function bindScene() {
    $$('#layer .spot, #sc-here .np-item', el).forEach((b) => b.addEventListener('click', () => info(b.dataset.id)));
    $$('#layer .spot-nav', el).forEach((b) => b.addEventListener('click', () => goScene(+b.dataset.go)));
    $$('#sc-here .np-item', el).forEach((b) => {
      b.addEventListener('mouseenter', () => $$('#layer .spot', el).forEach((s) => s.classList.toggle('hl', s.dataset.id === b.dataset.id)));
      b.addEventListener('mouseleave', () => $$('#layer .spot', el).forEach((s) => s.classList.remove('hl')));
    });
  }
  // On « avance » : la scène actuelle zoome vers le centre et s'efface, la suivante apparaît
  function goScene(i) {
    i = (i + SCENES.length) % SCENES.length;
    if (busy || i === sc) return;
    busy = true;
    const fwd = i > sc, old = $('#layer', el), st = $('#stage', el);
    const nl = document.createElement('div');
    nl.className = 'scene-layer ' + (fwd ? 'from-far' : 'from-near');
    nl.innerHTML = sceneHTML(i);
    old.removeAttribute('id'); nl.id = 'layer';
    old.classList.add(fwd ? 'to-near' : 'to-far');
    st.insertBefore(nl, old.nextSibling);
    sc = i;
    requestAnimationFrame(() => requestAnimationFrame(() => nl.classList.add('on')));
    setTimeout(() => { old.remove(); busy = false; }, 900);
    $('#sc-cap', el).innerHTML = `<b>${esc(SCENES[sc].name)}</b> <span>${esc(SCENES[sc].intro)}</span>`;
    st.setAttribute('aria-label', `${SCENES[sc].name}. Flèches gauche et droite pour changer de scène.`);
    $$('.sc-strip button', el).forEach((b) => b.setAttribute('aria-current', +b.dataset.sc === sc ? 'step' : 'false'));
    $('#sc-here', el).innerHTML = hereHTML();
    bindScene();
  }

  function info(id) {
    const v = it(id);
    modal(`${v.img ? `<img class="v-photo" src="${v.img}?width=500&height=500&store=fr&image-type=image" alt="" onerror="this.remove()">` : ''}<h2>${esc(v.name)}</h2>
      ${v.note ? `<p>${esc(v.note)}</p>` : ''}
      <p class="v-price">${euro(v.price)}</p>
      <div class="actions"><a class="btn sun" href="${v.url}" target="_blank" rel="noopener">Voir le produit sur truffaut.com</a></div>`);
  }

  function draw() {
    el.innerHTML = `<div class="page noel">
      ${Deco.head('Le village de Noël', 'Une balade en cinq scènes, de l’arche d’entrée jusqu’à l’atelier du Père Noël. Les points lumineux sont des produits vendus chez Truffaut : clique pour voir la fiche.',
        ['Même en miniature, je reste le plus lent du village.', 'Le traîneau me double tous les soirs. Vexant.', 'Les churros, c’est pour qui ? Pour moi ? Non ? D’accord.'], 1)}
      <div class="walk-bar"><div class="v-ctrl">
        <span class="seg-mode" role="group" aria-label="Affichage"><button class="btn small ${mode === 'walk' ? '' : 'white'}" data-mode="walk" type="button" aria-pressed="${mode === 'walk'}">Se promener</button><button class="btn small ${mode === 'photo' ? '' : 'white'}" data-mode="photo" type="button" aria-pressed="${mode === 'photo'}">Vue d’ensemble</button></span>
        ${mode === 'photo' ? `<span class="zoom" role="group" aria-label="Zoom"><button class="btn white small" id="z-out" type="button" aria-label="Dézoomer">−</button><span id="z-val">${Math.round(zoom * 100)} %</span><button class="btn white small" id="z-in" type="button" aria-label="Zoomer">+</button></span>` : ''}</div></div>
      ${mode === 'walk' ? `${stage()}
        <p class="hand hint">Flèches du clavier, boutons ‹ › ou vignettes pour avancer. Sur l’entrée, les panneaux mènent directement aux autres scènes.</p>`
      : `<div class="village-wrap panel" id="vwrap"><div class="vzoom" style="width:${zoom * 100}%">${photoScene()}</div></div>
        <p class="hand hint">Chaque pièce est la vraie photo du produit vendu chez Truffaut. Zoome, fais glisser, clique pour ouvrir la fiche.</p>`}
      <section class="v-list panel"><h2>Dans le village</h2>
        <ul>${VILLAGE.map((v) => `<li><button type="button" data-id="${v.id}"><span>${esc(v.name)}</span><b>${euro(v.price)}</b></button></li>`).join('')}</ul>
        <p class="small">Décors : illustrations du village (5 scènes). Les produits sont ceux de la gamme village de Noël vendue par Truffaut ; leur position dans les scènes est une mise en situation.</p>
      </section></div>`;
    $$('.v-list button', el).forEach((b) => b.addEventListener('click', () => {
      const k = SCENES.findIndex((S) => S.items.some(([id]) => id === b.dataset.id));
      if (mode === 'walk' && k >= 0 && k !== sc) { goScene(k); setTimeout(() => $$('#layer .spot', el).forEach((s) => s.classList.toggle('hl', s.dataset.id === b.dataset.id)), 950); $('#stage', el).scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      info(b.dataset.id);
    }));
    $$('.seg-mode button', el).forEach((b) => b.addEventListener('click', () => { mode = b.dataset.mode; draw(); }));
    $$('.ph', el).forEach((b) => b.addEventListener('click', () => info(b.dataset.id)));
    $$('.ph img', el).forEach((im) => im.addEventListener('error', () => {
      im.closest('.ph').classList.add('noimg'); fails++;
      if (fails === 4 && mode === 'photo') { mode = 'walk'; draw(); toast('🖼️', 'Les photos des produits ne s’affichent pas ici', 'Voici la promenade illustrée. Ouvre le site en ligne (GitHub Pages) pour voir les vraies photos.', 7000); }
    }));
    if (keys) window.removeEventListener('keydown', keys);
    keys = null;
    if (mode === 'walk') {
      bindScene();
      $('#sc-prev', el).addEventListener('click', () => goScene(sc - 1));
      $('#sc-next', el).addEventListener('click', () => goScene(sc + 1));
      $$('.sc-strip button', el).forEach((b) => b.addEventListener('click', () => goScene(+b.dataset.sc)));
      // glisser du doigt pour changer de scène
      let tx = null; const st = $('#stage', el);
      st.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
      st.addEventListener('touchend', (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) goScene(sc + (dx < 0 ? 1 : -1)); tx = null; });
      keys = (e) => { if (document.querySelector('#modal-back') || location.hash !== '#noel' || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return; if (e.key === 'ArrowRight') { e.preventDefault(); goScene(sc + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); goScene(sc - 1); } };
      window.addEventListener('keydown', keys);
      // précharge les autres scènes
      SCENES.forEach((S) => { const im = new Image(); im.src = S.img + '.webp'; });
      return;
    }
    const wrap = $('#vwrap', el), zbox = $('.vzoom', el);
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
    mount(view) { el = view; busy = false; draw(); },
    unmount() { if (keys) window.removeEventListener('keydown', keys); keys = null; } };
})();
route('noel', Noel);
