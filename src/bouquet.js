/* ============================================================
   MON BOUQUET — la table du fleuriste
   ============================================================ */
const Bouquet = (() => {
  let el, table, inHand = null, stems = [], selected = null, finished = false, moveHandler = null, keyHandler = null;
  const SW = 80, SH = 240; // taille d'une tige dessinée (base au milieu du bas)

  const stemSVG = (f, v = 0) => Fleurs.stem(f, v, SW, SH);

  function bucketsHTML() {
    return STEMS.map((f) => `<button class="bucket ${inHand === f.id ? 'on' : ''}" data-id="${f.id}" type="button" aria-pressed="${inHand === f.id}" aria-label="Prendre : ${esc(f.name)}">
      ${Fleurs.bucket(f)}<span class="b-name">${esc(f.name)}</span></button>`).join('');
  }

  function draw() {
    el.innerHTML = `${Fleurs.DEFS}<div class="page bouquet-page">
      ${Deco.head('Mon bouquet', 'À toi le tablier de fleuriste. Prends une fleur dans un seau, pose-la sur la table, recommence. Arrange, tourne, hésite, puis rassemble le tout dans ta main.',
        ['Un chou dans un bouquet ? Audacieux. J’adore.', 'Moi, je mange les fleurs. Mais je respecte ton art.', 'L’eucalyptus, c’est le jean blanc du bouquet : ça va avec tout.'], 2,
        '<div class="bq-stats"><span class="tag" id="bq-count">0 tige</span><span class="tag" id="bq-price">0,00 €</span></div>')}
      <div class="shelf panel" role="group" aria-label="Les seaux de fleurs">${bucketsHTML()}</div>
      <div class="workbench">
        <div class="table" id="table" aria-label="La table du fleuriste">
          <p class="table-empty hand" id="table-empty">Clique sur un seau pour prendre une fleur en main, puis clique sur la table pour la poser.</p>
          <div class="hand-cursor" id="hand-cursor" aria-hidden="true"></div>
          <svg class="wrap-layer" id="wrap-layer" viewBox="0 0 400 300" aria-hidden="true"></svg>
          <svg class="table-props" viewBox="0 0 1000 560" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
            <g transform="translate(905 470)"><circle r="44" fill="#D9B98A" stroke="${INK}" stroke-width="2"/><circle r="44" fill="url(#hatch)"/><circle r="14" fill="#7E5432" stroke="${INK}" stroke-width="2"/>
              <path d="M-40 -18 C-80 -30 -120 10 -170 0" fill="none" stroke="#D9B98A" stroke-width="4"/><path d="M-40 -18 C-80 -30 -120 10 -170 0" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3 4"/></g>
            <g transform="translate(830 90) rotate(25)"><path d="M0 0 L-70 -12 M0 0 L-70 12" stroke="#9AA6AE" stroke-width="7" stroke-linecap="round"/><path d="M0 0 L-70 -12 M0 0 L-70 12" stroke="${INK}" stroke-width="1.2"/>
              <circle cx="16" cy="-12" r="12" fill="none" stroke="#E04E2E" stroke-width="6"/><circle cx="16" cy="12" r="12" fill="none" stroke="#E04E2E" stroke-width="6"/><circle r="3" fill="${INK}"/></g>
            ${Deco.leaf(80, 500, 40, -20, '#5E9446')}${Deco.leaf(120, 520, 34, 200, '#4E7D3A')}
            <path d="M200 520 c6 -8 14 -6 12 2 c-2 6 -10 6 -12 -2z" fill="#EE9AAE" stroke="${INK}" stroke-width="1"/><path d="M640 500 c6 -8 14 -6 12 2 c-2 6 -10 6 -12 -2z" fill="#F0A830" stroke="${INK}" stroke-width="1"/>
            <g transform="translate(60 70) rotate(-12)"><rect x="-40" y="-26" width="80" height="52" fill="#FBFAF4" stroke="${INK}" stroke-width="1.5"/><text x="0" y="-4" text-anchor="middle" font-family="Caveat, cursive" font-size="17" fill="${INK}">Commande n°42</text><text x="0" y="14" text-anchor="middle" font-family="Caveat, cursive" font-size="13" fill="${INK}">« faire joli »</text></g>
          </svg>
        </div>
        <aside class="bq-side panel" id="bq-side"></aside>
      </div>
      <p class="small ref">Fleurs de la composition « ${esc(BOUQUET_REF.label)} » Création Truffaut (${euro(BOUQUET_REF.price)}). Prix à la tige indicatif : ${euro(STEM_PRICE)}.</p>
    </div>`;
    table = $('#table', el);
    $$('.bucket', el).forEach((b) => b.addEventListener('click', () => take(b.dataset.id)));
    table.addEventListener('click', onTableClick);
    moveHandler = (e) => {
      const r = table.getBoundingClientRect();
      const hc = $('#hand-cursor', el); if (!hc) return;
      hc.style.transform = `translate(${e.clientX - r.left - SW / 2}px, ${e.clientY - r.top - 40}px)`;
    };
    table.addEventListener('pointermove', moveHandler);
    stems.forEach(renderStem);
    side();
  }

  function take(id) {
    if (finished) undoFinish();
    inHand = inHand === id ? null : id;
    $$('.bucket', el).forEach((b) => { b.classList.toggle('on', b.dataset.id === inHand); b.setAttribute('aria-pressed', b.dataset.id === inHand); });
    const hc = $('#hand-cursor', el);
    if (inHand) {
      const f = STEMS.find((s) => s.id === inHand);
      hc.innerHTML = `<div class="held">${stemSVG(f)}</div>${handSVG()}`;
      hc.style.display = 'block';
      table.classList.add('holding');
      const r = table.getBoundingClientRect();
      hc.style.transform = `translate(${r.width / 2 - SW / 2}px, ${r.height / 3}px)`;
    } else { hc.style.display = 'none'; table.classList.remove('holding'); }
  }
  const handSVG = Fleurs.hand;

  function onTableClick(e) {
    if (!inHand || e.target.closest('.stem')) return;
    const r = table.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const s = { uid: Date.now() + Math.random(), id: inHand, x, y: Math.min(y + SH - 50, r.height + 40), rot: rand(-12, 12), v: Math.floor(rand(0, 1000)) };
    stems.push(s); renderStem(s); side();
    if (stems.length === 1) toast('🌸', 'Première fleur posée', 'Clique encore sur la table pour en ajouter une autre, ou change de seau.', 2400);
  }

  function renderStem(s) {
    const f = STEMS.find((x) => x.id === s.id);
    const d = document.createElement('div');
    d.className = 'stem'; d.dataset.uid = s.uid; d.tabIndex = 0;
    d.setAttribute('role', 'button'); d.setAttribute('aria-label', `${f.name} sur la table. Glisser pour déplacer, flèches pour tourner, Suppr pour retirer.`);
    d.innerHTML = stemSVG(f, s.v || 0) + `<span class="stem-tools"><button type="button" data-a="l" aria-label="Tourner à gauche">↺</button><button type="button" data-a="r" aria-label="Tourner à droite">↻</button><button type="button" data-a="x" aria-label="Retirer">✕</button></span>`;
    place(d, s);
    d.style.zIndex = ['foliage', 'euca'].includes(f.type) ? 2 : 5 + stems.indexOf(s);
    table.appendChild(d);
    $('#table-empty', el).hidden = true;
    let drag = null;
    d.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.stem-tools') || finished) return;
      select(s);
      drag = { x: e.clientX, y: e.clientY, sx: s.x, sy: s.y };
      d.setPointerCapture(e.pointerId); d.classList.add('dragging');
    });
    d.addEventListener('pointermove', (e) => { if (!drag) return; s.x = drag.sx + e.clientX - drag.x; s.y = drag.sy + e.clientY - drag.y; place(d, s); });
    d.addEventListener('pointerup', () => { drag = null; d.classList.remove('dragging'); });
    d.addEventListener('wheel', (e) => { if (finished) return; e.preventDefault(); s.rot = clamp(s.rot + (e.deltaY > 0 ? 6 : -6), -80, 80); place(d, s); }, { passive: false });
    d.addEventListener('focus', () => select(s));
    d.addEventListener('keydown', (e) => {
      if (finished) return;
      if (e.key === 'ArrowLeft') { s.rot -= 6; place(d, s); e.preventDefault(); }
      if (e.key === 'ArrowRight') { s.rot += 6; place(d, s); e.preventDefault(); }
      if (e.key === 'Delete' || e.key === 'Backspace') { remove(s); e.preventDefault(); }
    });
    $$('.stem-tools button', d).forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (b.dataset.a === 'l') s.rot -= 10; if (b.dataset.a === 'r') s.rot += 10;
      if (b.dataset.a === 'x') return remove(s);
      place(d, s);
    }));
  }
  function place(d, s) { d.style.left = (s.x - SW / 2) + 'px'; d.style.top = (s.y - SH) + 'px'; d.style.transform = `rotate(${s.rot}deg)`; }
  function select(s) { selected = s; $$('.stem', table).forEach((x) => x.classList.toggle('sel', +x.dataset.uid === s.uid)); }
  function remove(s) { stems = stems.filter((x) => x !== s); const d = $(`.stem[data-uid="${s.uid}"]`, table); if (d) d.remove(); if (!stems.length) $('#table-empty', el).hidden = false; side(); }

  function counts() { const c = {}; stems.forEach((s) => { c[s.id] = (c[s.id] || 0) + 1; }); return c; }
  function side() {
    const n = stems.length, c = counts();
    $('#bq-count', el).textContent = `${n} tige${n > 1 ? 's' : ''}`;
    $('#bq-price', el).textContent = euro(n * STEM_PRICE);
    $('#bq-side', el).innerHTML = finished ? orderPanel() : `<h2>Sur la table</h2>
      ${n ? `<ul class="bq-list">${Object.keys(c).map((id) => `<li><span>${esc(STEMS.find((f) => f.id === id).name)}</span><b>× ${c[id]}</b></li>`).join('')}</ul>` : '<p class="hand">La table est vide. La recette des pros : 3 fleurs vedettes, 2 fleurs légères, et du feuillage pour faire chic.</p>'}
      <button class="btn sun" id="finish" type="button" ${n < 3 ? 'disabled' : ''}>Terminer mon bouquet</button>
      ${n && n < 3 ? '<p class="small">Encore au moins ' + (3 - n) + ' tige' + (3 - n > 1 ? 's' : '') + '.</p>' : ''}
      ${n ? '<button class="btn white small" id="clear" type="button">Tout débarrasser</button>' : ''}`;
    const fi = $('#finish', el); if (fi) fi.addEventListener('click', finish);
    const cl = $('#clear', el); if (cl) cl.addEventListener('click', () => { stems = []; $$('.stem', table).forEach((d) => d.remove()); $('#table-empty', el).hidden = false; side(); });
    if (finished) bindOrder();
  }

  /* ---------- le geste du fleuriste : rassembler les tiges dans la main ---------- */
  function finish() {
    take(null); inHand = null;
    const r = table.getBoundingClientRect();
    const bx = r.width / 2, by = r.height * 0.86;
    const sorted = [...stems].sort((a, b) => a.x - b.x);
    sorted.forEach((s, i) => {
      const t = sorted.length > 1 ? i / (sorted.length - 1) - 0.5 : 0;
      s.saved = { x: s.x, y: s.y, rot: s.rot };
      s.x = bx + t * 14; s.y = by + Math.abs(t) * 16; s.rot = t * 95 + rand(-4, 4);
      const d = $(`.stem[data-uid="${s.uid}"]`, table);
      d.classList.add('gather'); d.classList.remove('sel'); place(d, s);
    });
    finished = true;
    table.classList.add('done');
    setTimeout(() => {
      const w = $('#wrap-layer', el);
      const cx = 0, cy = 0;
      w.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
      w.innerHTML = `<g transform="translate(${bx} ${by - 30}) scale(1.5)"><g class="wrap-in">
        ${Fleurs.wrap(cx, cy)}
        <g transform="translate(${cx - 26} ${cy + 4}) scale(.65)">${handSVG().replace('<svg class="hand-svg" viewBox="0 0 80 70" overflow="visible">', '').replace('</svg>', '')}</g>
      </g></g>`;
      side();
      toast('💐', 'Bouquet terminé', 'Le fleuriste du magasin est un peu jaloux. Tu peux le commander.');
    }, 1100);
  }
  function undoFinish() {
    finished = false; table.classList.remove('done'); $('#wrap-layer', el).innerHTML = '';
    stems.forEach((s) => { if (s.saved) Object.assign(s, s.saved); const d = $(`.stem[data-uid="${s.uid}"]`, table); if (d) { place(d, s); setTimeout(() => d.classList.remove('gather'), 1000); } });
    side();
  }

  function orderPanel() {
    const n = stems.length, c = counts();
    return `<h2>Ton bouquet</h2>
      <ul class="bq-list">${Object.keys(c).map((id) => `<li><span>${esc(STEMS.find((f) => f.id === id).name)}</span><b>× ${c[id]}</b></li>`).join('')}</ul>
      <label class="field">Emballage<select id="o-wrap"><option value="0">Papier kraft (inclus)</option><option value="2.5">Papier blanc et ruban (+2,50 €)</option></select></label>
      <label class="field">Petit mot sur la carte<textarea id="o-msg" rows="2" maxlength="140" placeholder="Joyeux anniversaire !"></textarea></label>
      <fieldset class="o-mode"><legend>Réception</legend>
        <label><input type="radio" name="o-mode" value="store" checked> Retrait gratuit en magasin en 2 h</label>
        <label><input type="radio" name="o-mode" value="home"> Livraison à domicile en 2 à 3 jours</label></fieldset>
      <p class="bq-total">Total indicatif : <b id="o-total">${euro(n * STEM_PRICE)}</b></p>
      <button class="btn sun" id="o-go" type="button">Commander ce bouquet</button>
      <button class="btn white small" id="o-back" type="button">Défaire et retoucher</button>`;
  }
  function bindOrder() {
    const tot = () => euro(stems.length * STEM_PRICE + +$('#o-wrap', el).value);
    $('#o-wrap', el).addEventListener('change', () => { $('#o-total', el).textContent = tot(); });
    $('#o-back', el).addEventListener('click', undoFinish);
    $('#o-go', el).addEventListener('click', () => {
      const msg = $('#o-msg', el).value.trim();
      const mode = el.querySelector('input[name="o-mode"]:checked').value;
      modal(`<h2>Commande prête 💐</h2>
        <p>${stems.length} tiges, ${$('#o-wrap', el).selectedOptions[0].text.toLowerCase()}, ${mode === 'store' ? 'à retirer en magasin dans 2 h' : 'livré à domicile en 2 à 3 jours'}.${msg ? ` Carte : « ${esc(msg)} ».` : ''}</p>
        <p><b>Total indicatif : ${tot()}</b></p>
        <p class="small">Dans la version en ligne, cette composition serait transmise à l’atelier floral du magasin choisi, qui la prépare à l’identique. Dans cette maquette, aucune commande n’est passée.</p>
        <div class="actions"><a class="btn" href="https://www.truffaut.com/plantes/bouquets-de-fleurs.html" target="_blank" rel="noopener">Voir les bouquets sur truffaut.com</a></div>`);
    });
  }

  return {
    title: 'Mon bouquet',
    mount(view) {
      el = view; inHand = null; finished = false; draw();
      keyHandler = (e) => { if (e.key === 'Escape' && inHand) take(inHand); };
      window.addEventListener('keydown', keyHandler);
    },
    unmount() { window.removeEventListener('keydown', keyHandler); },
  };
})();
route('bouquet', Bouquet);
