/* ============================================================
   MONTRE TON JARDIN — galerie publique + bon de réduction
   ============================================================ */
const Galerie = (() => {
  let el, filter = 'tous';
  // Exemples dessinés pour la démonstration
  const SAMPLES = [
    { id: 's1', who: 'Exemple · Lyon', type: 'potager', text: 'Mes premières courgettes en carré !', art: 'veg', likes: 24 },
    { id: 's2', who: 'Exemple · Nantes', type: 'jardin', text: 'Les hortensias ont adoré l’été pluvieux.', art: 'hydra', likes: 41 },
    { id: 's3', who: 'Exemple · Lille', type: 'potager', text: 'Balcon de 4 m² : tomates cerises et basilic.', art: 'balcon', likes: 17 },
    { id: 's4', who: 'Exemple · Bordeaux', type: 'jardin', text: 'La roseraie de ma grand-mère, 30 ans cette année.', art: 'roses', likes: 63 },
    { id: 's5', who: 'Exemple · Rennes', type: 'jardin', text: 'Un coin d’ombre enfin fleuri.', art: 'shade', likes: 12 },
    { id: 's6', who: 'Exemple · Marseille', type: 'potager', text: 'Fraises en jardinière, récolte tous les matins.', art: 'fraise', likes: 29 },
  ];
  const art = (k) => {
    const sky = '<rect width="300" height="220" fill="#CDEFFA"/><rect y="150" width="300" height="70" fill="#8ED16F"/>';
    const D = Jardin.DRAW;
    const g = {
      veg: [0, 1, 2].map((i) => `<rect x="${20 + i * 92}" y="140" width="80" height="60" rx="8" fill="#7A4E2D" stroke="${INK}" stroke-width="3"/><g transform="translate(${60 + i * 92} 182) scale(.75)">${Potager.vegSVG(['courgette', 'salade', 'tomate'][i], 5)}</g>`).join(''),
      hydra: `<g transform="translate(90 190) scale(1.1)">${D.hydrangea('#9BB6F0', 3)}</g><g transform="translate(220 195)">${D.hydrangea('#F4A6C8', 5)}</g>`,
      balcon: `<rect x="0" y="160" width="300" height="60" fill="#E9D2A8"/><path d="M0 160 H300 M20 160 V220 M60 160 V220 M100 160 V220 M140 160 V220 M180 160 V220 M220 160 V220 M260 160 V220" stroke="${INK}" stroke-width="3"/><g transform="translate(90 160) scale(.8)">${D.tomato()}</g><g transform="translate(200 160) scale(.9)">${D.herb('#3FA05A')}</g>`,
      roses: `<g transform="translate(80 195)">${D.rose('#C8243C', 2)}</g><g transform="translate(200 195) scale(.9)">${D.climber('#F8D2D8')}</g>`,
      shade: `<rect width="300" height="220" fill="#B9DDC0"/><rect y="150" width="300" height="70" fill="#6FB35A"/><g transform="translate(80 200)">${D.camellia('#FFFFFF', 4)}</g><g transform="translate(210 200)">${D.cyclamen('#E14C8B')}</g>`,
      fraise: `<g transform="translate(150 190) scale(1.3)">${D.strawberry()}</g><rect x="60" y="190" width="180" height="24" rx="6" fill="#D9774B" stroke="${INK}" stroke-width="3"/>`,
    }[k];
    return `<svg viewBox="0 0 300 220" aria-hidden="true">${sky}${g}</svg>`;
  };
  const posts = () => store.get('posts', []);
  const likes = () => store.get('likes', {});

  function draw() {
    const all = [...posts(), ...SAMPLES].filter((p) => filter === 'tous' || p.type === filter);
    const lk = likes();
    el.innerHTML = `<div class="page galerie">
      ${Deco.head('Montre ton jardin', 'Publie une photo de ton jardin ou de ton potager sur le mur des jardiniers. On ne juge pas les pissenlits. En remerciement, un bon de réduction t’attend.',
        ['Joli jardin. Je passerai ce soir.', 'Ta laitue a un grand avenir. Dans mon estomac.', 'Moi je poste surtout des photos de feuilles. De près.'], 0)}
      <div class="gal-grid">
        <form class="share panel" id="share">
          <h2>Partager ma photo</h2>
          <label class="dropzone" id="drop"><input type="file" accept="image/*" capture="environment" id="g-file" required>
            <span id="drop-txt">📷 Prendre ou choisir une photo</span><img id="g-prev" alt="" hidden></label>
          <label class="field">Prénom<input id="g-name" maxlength="30" required placeholder="Camille"></label>
          <label class="field">Ville<input id="g-city" maxlength="40" placeholder="Tours"></label>
          <fieldset class="seg"><legend>C’est…</legend>
            <label><input type="radio" name="g-type" value="jardin" checked> un jardin</label>
            <label><input type="radio" name="g-type" value="potager"> un potager</label></fieldset>
          <label class="field">Un mot sur ta photo<textarea id="g-text" rows="2" maxlength="140" placeholder="Ce que tu as planté, ce dont tu es fier·e…"></textarea></label>
          <label class="consent"><input type="checkbox" id="g-ok" required> J’accepte que ma photo soit visible par tous les visiteurs.</label>
          <button class="btn sun" type="submit">Publier et recevoir mon bon</button>
        </form>
        <section>
          <div class="gal-filter" role="group" aria-label="Filtrer">${['tous', 'jardin', 'potager'].map((f) => `<button type="button" class="chip-btn ${filter === f ? 'on' : ''}" data-f="${f}" aria-pressed="${filter === f}">${{ tous: 'Tout', jardin: 'Jardins', potager: 'Potagers' }[f]}</button>`).join('')}</div>
          <div class="wall">${all.map((p, i) => `<figure class="polaroid" style="--r:${((i * 37) % 7) - 3}deg">
            ${p.img ? `<img src="${p.img}" alt="Photo de ${esc(p.who)}">` : art(p.art)}
            <figcaption><b>${esc(p.text || (p.type === 'potager' ? 'Mon potager' : 'Mon jardin'))}</b><span>${esc(p.who)}</span>
            <button type="button" class="like ${lk[p.id] ? 'on' : ''}" data-id="${p.id}" aria-pressed="${!!lk[p.id]}" aria-label="J’aime">♥ ${(p.likes || 0) + (lk[p.id] ? 1 : 0)}</button></figcaption></figure>`).join('')}</div>
        </section>
      </div></div>`;
    let img = null;
    $('#g-file', el).addEventListener('change', (e) => {
      const f = e.target.files[0]; if (!f) return;
      shrinkImage(f, 700).then((url) => { img = url; const p = $('#g-prev', el); p.src = url; p.hidden = false; p.alt = 'Aperçu'; $('#drop-txt', el).textContent = 'Changer de photo'; });
    });
    $('#share', el).addEventListener('submit', (e) => {
      e.preventDefault();
      if (!img) return toast('📷', 'Ajoute une photo', 'C’est elle qui débloque ton bon de réduction.');
      const name = $('#g-name', el).value.trim(), city = $('#g-city', el).value.trim();
      const post = { id: 'p' + Date.now(), img, who: city ? `${name} · ${city}` : name, type: el.querySelector('input[name="g-type"]:checked').value, text: $('#g-text', el).value.trim(), likes: 0 };
      const ps = posts(); ps.unshift(post);
      while (ps.length && !store.set('posts', ps)) ps.pop();
      const code = 'JARDIN-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      draw();
      modal(`<div class="coupon"><span class="c-em" aria-hidden="true">🎁</span><h2>Merci ${esc(name)} !</h2><p>Ta photo est sur le mur. Voici ton bon :</p>
        <div class="c-ticket"><b>-10 %</b><span>sur ton prochain achat de plantes</span><code>${code}</code></div>
        <p class="small">Exemple pour la maquette : le montant, la durée et les conditions du bon seraient fixés par Truffaut, et le code généré automatiquement par la caisse.</p>
        <div class="actions"><button class="btn" type="button" id="c-copy">Copier le code</button></div></div>`, {
        onMount: (b) => $('#c-copy', b).addEventListener('click', () => { const ok = () => toast('📋', 'Code copié', code); if (navigator.clipboard) navigator.clipboard.writeText(code).then(ok, () => toast('📋', 'Sélectionne le code pour le copier', code)); else toast('📋', 'Sélectionne le code pour le copier', code); }),
      });
    });
    $$('.gal-filter button', el).forEach((b) => b.addEventListener('click', () => { filter = b.dataset.f; draw(); }));
    $$('.like', el).forEach((b) => b.addEventListener('click', () => { const l = likes(); l[b.dataset.id] = !l[b.dataset.id]; store.set('likes', l); draw(); }));
  }
  return { title: 'Montre ton jardin', mount(view) { el = view; draw(); } };
})();
route('galerie', Galerie);
