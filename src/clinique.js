/* ============================================================
   MA PLANTE EST ENVAHIE — trouver l'intrus, puis le remède
   ============================================================ */
const Clinique = (() => {
  let el, filter = 'tous';
  const leaf = (fill = '#7CC46A', extra = '') => `<path d="M20 120 C20 60 70 20 130 22 C132 82 90 124 20 120Z" fill="${fill}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M20 120 C60 110 100 80 130 22 C132 82 90 124 20 120Z" fill="url(#hatch)"/><path d="M20 120 L120 32" stroke="${INK}" stroke-width="2"/>${[0.25, 0.42, 0.58, 0.74].map((t) => { const x = 20 + 100 * t, y = 120 - 88 * t; return `<path d="M${x} ${y} q-16 -6 -22 -22 M${x} ${y} q8 12 24 14" fill="none" stroke="${INK}" stroke-width="1" opacity=".6"/>`; }).join('')}${extra}`;
  const bug = (x, y, c, s = 1, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">
      <path d="M-7 -2 l-8 -5 l-3 -6 M7 -2 l8 -5 l3 -6 M-7 3 l-9 1 l-3 4 M7 3 l9 1 l3 4 M-6 7 l-6 6 M6 7 l6 6" fill="none" stroke="${INK}" stroke-width="1.1" stroke-linecap="round"/>
      <path d="M0 -14 C-9 -12 -10 4 -6 10 C-3 14 3 14 6 10 C10 4 9 -12 0 -14Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
      <path d="M-7 0 q7 3 14 0 M-6 5 q6 3 12 0" fill="none" stroke="${INK}" stroke-width=".8" opacity=".6"/>
      <path d="M-4 9 l-3 5 M4 9 l3 5" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
      <circle cy="-15" r="4.5" fill="${Deco.shade(c, -0.25)}" stroke="${INK}" stroke-width="1.3"/><circle cx="-1.6" cy="-16" r="1" fill="#fff"/>
      <path d="M-2 -19 q-6 -8 -12 -9 M2 -19 q6 -8 12 -9" fill="none" stroke="${INK}" stroke-width="1"/>
      <path d="M-3 -10 q-2 6 0 12" stroke="#fff" stroke-width="1.4" fill="none" opacity=".6"/></g>`;
  const ART = {
    pucerons: () => leaf('#8BCB6A', [[58, 74, 20], [74, 62, -10], [88, 72, 40], [64, 90, 70], [94, 54, -30], [80, 86, 10]].map(([x, y, a]) => bug(x, y, '#B5DB6E', .62, a)).join('') + `<path d="M110 40 q10 -8 14 -2" stroke="${INK}" stroke-width="2" fill="none"/>`),
    cochenilles: () => `<path d="M30 130 L120 20" stroke="#8C5A31" stroke-width="12" stroke-linecap="round"/><path d="M30 130 L120 20" stroke="${INK}" stroke-width="2" fill="none"/>` + [[50, 104], [66, 86], [82, 66], [98, 48], [60, 96]].map(([x, y]) => `<path d="${blob(x, y, 9, 7, 7, .35, x)}" fill="#fff" stroke="${INK}" stroke-width="2"/>`).join(''),
    limaces: () => leaf('#8BCB6A', `<path d="${blob(70, 70, 14, 11, 9, .35, 3)}" fill="#FBFAF4" stroke="${INK}" stroke-width="1.6"/><path d="${blob(98, 50, 10, 8, 9, .35, 5)}" fill="#FBFAF4" stroke="${INK}" stroke-width="1.6"/><path d="M130 22 C131 30 128 34 124 38 q-6 -2 -4 -8 q-4 -4 2 -8z" fill="#FBFAF4" stroke="${INK}" stroke-width="1.4"/>`)
        + `<path d="M6 144 q50 -8 100 -2" stroke="#D6E9EE" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M28 142 C34 126 70 124 98 128 C112 130 118 122 116 116 L122 106 M112 118 L114 104" fill="none" stroke="${INK}" stroke-width="1.6"/>
        <path d="M24 144 C30 126 70 122 100 128 C112 130 120 126 118 116 C114 110 106 112 104 118 C96 134 50 136 24 144Z" fill="#B88A5A" stroke="${INK}" stroke-width="2"/><path d="M40 136 q20 -6 40 -4" stroke="${INK}" stroke-width=".9" fill="none" opacity=".6"/><ellipse cx="72" cy="130" rx="14" ry="5" fill="url(#hatch)"/>
        <circle cx="122" cy="105" r="2.4" fill="${INK}"/><circle cx="114" cy="103" r="2.4" fill="${INK}"/>`,
    doryphore: () => leaf('#6FB35A', `<path d="M56 64 q8 -6 14 4 q6 10 -2 14 q-8 4 -10 -6z M92 44 q8 0 6 10 q-6 4 -10 -4z" fill="#FBFAF4" stroke="${INK}" stroke-width="1.4"/>`) + `<g transform="translate(92 92) rotate(-20)"><path d="M-16 -6 l-10 -6 M16 -6 l10 -6 M-17 4 l-12 2 M17 4 l12 2 M-14 14 l-8 8 M14 14 l8 8" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M0 -18 C-20 -16 -22 18 0 24 C22 18 20 -16 0 -18Z" fill="#F6D36A" stroke="${INK}" stroke-width="2"/><path d="M0 -18 V24" stroke="${INK}" stroke-width="1.6"/>
        ${[-13, -7, 7, 13].map((x) => `<path d="M${x} -12 Q${x * 1.1} 4 ${x * .8} 18" stroke="${INK}" stroke-width="2.6" fill="none"/>`).join('')}
        <path d="M-9 -22 C-8 -30 8 -30 9 -22 Z" fill="#F0A830" stroke="${INK}" stroke-width="1.6"/><circle cx="-3" cy="-25" r="1.6" fill="${INK}"/><circle cx="3" cy="-25" r="1.6" fill="${INK}"/><circle cx="0" cy="-22" r="1.3" fill="${INK}"/>
        <path d="M-12 -10 q-2 10 0 20" stroke="#fff" stroke-width="2" opacity=".6" fill="none"/></g>`,
    pyrale: () => `<path d="${blob(75, 80, 60, 50, 9, .2, 4)}" fill="#A4B66A" stroke="${INK}" stroke-width="3"/>` + `<path d="M40 70 q20 10 40 0 q20 -10 40 4" stroke="#fff" stroke-width="2" fill="none" opacity=".9"/><g transform="translate(70 94)"><path d="M-30 0 q8 -10 16 0 q8 -10 16 0 q8 -10 16 0 q8 -10 16 0" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-30 0 q8 -10 16 0 q8 -10 16 0 q8 -10 16 0 q8 -10 16 0" fill="none" stroke="#9ED36A" stroke-width="7" stroke-linecap="round"/><circle cx="36" cy="-2" r="6" fill="${INK}"/></g>`,
    aleurodes: () => leaf('#8BCB6A', Array.from({ length: 16 }, (_, i) => `<circle cx="${50 + (i * 23) % 60}" cy="${60 + (i * 31) % 45}" r="1.4" fill="#F4F0D8" stroke="${INK}" stroke-width=".4"/>`).join('')) + [[46, 38, -20], [90, 28, 15], [112, 66, 30], [68, 18, -5], [124, 40, 10]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 C-14 -12 -18 2 -12 8 C-6 12 -2 6 0 0 C2 6 6 12 12 8 C18 2 14 -12 0 0Z" fill="#fff" stroke="${INK}" stroke-width="1.3"/><path d="M-3 1 l-8 2 M3 1 l8 2 M-4 -2 l-7 -5 M4 -2 l7 -5" stroke="${INK}" stroke-width=".6" opacity=".6"/><ellipse cx="0" cy="3" rx="1.8" ry="5" fill="#F6D36A" stroke="${INK}" stroke-width=".9"/><path d="M-1 -2 q-3 -5 -6 -6 M1 -2 q3 -5 6 -6" stroke="${INK}" stroke-width=".7" fill="none"/></g>`).join(''),
    acariens: () => leaf('#B8C77A', Array.from({ length: 30 }, (_, i) => `<circle cx="${40 + (i * 37) % 80}" cy="${40 + (i * 53) % 70}" r="2" fill="#F3E58A"/>`).join('') + `<path d="M50 90 l30 -40 M60 100 l40 -40 M50 70 l50 10" stroke="#fff" stroke-width="1" opacity=".9"/>`) + [[70, 66], [92, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#EE5D45" stroke="${INK}" stroke-width="1"/>`).join(''),
    otiorhynque: () => leaf('#3D7D4C', `<path d="M130 22 C132 40 128 50 120 62 a8 8 0 0 1 -6 -12 a8 8 0 0 1 -8 -10" fill="#FFFCF2" stroke="${INK}" stroke-width="2"/>`) + `<g transform="translate(70 128)"><ellipse rx="16" ry="11" fill="#5A4B3A" stroke="${INK}" stroke-width="2.5"/><path d="M14 -2 l12 -6" stroke="${INK}" stroke-width="3"/><path d="M-10 8 l-4 8 M0 10 v8 M10 8 l4 8" stroke="${INK}" stroke-width="2"/></g>`,
    carpocapse: () => `<circle cx="75" cy="80" r="46" fill="#9ED36A" stroke="${INK}" stroke-width="3"/><path d="M75 34 q-4 -14 4 -20" stroke="#8C5A31" stroke-width="4" fill="none"/><circle cx="92" cy="74" r="8" fill="#7A4E2D" stroke="${INK}" stroke-width="2"/><path d="M92 74 q20 -10 22 14" stroke="#B88A5A" stroke-width="5" fill="none"/><path d="M110 92 q8 0 8 8" stroke="#F3D0B5" stroke-width="7" stroke-linecap="round" fill="none"/>`,
    oidium: () => leaf('#7CC46A', Array.from({ length: 22 }, (_, i) => `<circle cx="${42 + (i * 31) % 80}" cy="${44 + (i * 47) % 70}" r="${5 + (i % 3) * 2}" fill="#F4F4EE" opacity=".9"/>`).join('')),
    mildiou: () => leaf('#6FB35A', [[60, 80, 14], [95, 50, 11], [80, 95, 8]].map(([x, y, r]) => `<path d="${blob(x, y, r, r * .8, 7, .3, x)}" fill="#7A5A3A" stroke="${INK}" stroke-width="2"/>`).join('')) + `<circle cx="120" cy="120" r="20" fill="#C9803A" stroke="${INK}" stroke-width="2.5"/><path d="M110 112 q8 -6 14 4" stroke="#6B4A2A" stroke-width="5" fill="none"/>`,
    rouille: () => leaf('#8BCB6A', Array.from({ length: 14 }, (_, i) => `<circle cx="${45 + (i * 29) % 75}" cy="${45 + (i * 41) % 65}" r="4" fill="#F59A3A" stroke="${INK}" stroke-width="1.5"/>`).join('')),
    'taches-noires': () => leaf('#B8D06A', [[60, 80, 10], [90, 56, 8], [100, 84, 7], [70, 50, 6]].map(([x, y, r]) => `<path d="${blob(x, y, r, r, 9, .4, y)}" fill="#2E2A22"/><circle cx="${x}" cy="${y}" r="${r + 5}" fill="none" stroke="#E8D46A" stroke-width="3" opacity=".7"/>`).join('')),
    processionnaire: () => `<path d="M10 40 L140 30" stroke="#8C5A31" stroke-width="8" stroke-linecap="round"/><path d="${blob(110, 50, 24, 18, 8, .2, 9)}" fill="#F4F4EE" stroke="${INK}" stroke-width="2.5"/>` + Array.from({ length: 6 }, (_, i) => `<g transform="translate(${20 + i * 20} ${120})"><ellipse rx="9" ry="5" fill="#7A6040" stroke="${INK}" stroke-width="1.8"/><path d="M-6 -4 l-2 -5 M0 -5 v-6 M6 -4 l2 -5" stroke="#E8B04A" stroke-width="1.5"/></g>`).join(''),
  };
  const catLabel = { insecte: 'Insecte', maladie: 'Maladie', mollusque: 'Mollusque' };

  function card(p) {
    return `<button class="pest panel" type="button" data-id="${p.id}"><svg viewBox="0 0 150 150" aria-hidden="true"><rect width="150" height="150" fill="#FFFCF2"/>${ART[p.id]()}</svg>
      <span class="tag">${catLabel[p.cat]}</span><b>${esc(p.name)}</b></button>`;
  }
  function sheet(id) {
    const p = PESTS.find((x) => x.id === id);
    modal(`<div class="pest-sheet"><svg viewBox="0 0 150 150" aria-hidden="true"><rect width="150" height="150" fill="#fff"/>${ART[p.id]()}</svg>
      <div><span class="tag">${catLabel[p.cat]}</span><h2>${esc(p.name)}</h2><p>${esc(p.signs)}</p></div></div>
      <div class="remedy r1"><b>🌿 La solution douce</b><p>${esc(p.soft)}</p></div>
      <div class="remedy r2"><b>🧴 Si ça ne suffit pas</b><p>${esc(p.strong)}</p></div>
      <div class="remedy r3"><b>🌱 Des plantes qui résistent</b><p>${esc(p.resist)}</p></div>
      <p class="hand tip">💡 ${esc(p.prevent)}</p>
      <p class="small">Conseils généraux. En magasin, un conseiller Truffaut confirme le diagnostic et le produit adapté.</p>`, { wide: true });
  }

  function draw() {
    const list = PESTS.filter((p) => filter === 'tous' || p.plants.includes(filter));
    el.innerHTML = `<div class="page clinique">
      ${Deco.head('Ma plante est envahie', 'Une tache, un trou, une petite bête qui ricane ? Désigne le suspect qui ressemble le plus à ce que tu vois : on te donne son nom et la sentence.',
        ['Les limaces ? Je ne connais pas ces gens-là.', 'Je plaide non coupable. Enfin, presque.', 'Le puceron, c’est le colocataire qui ne paie jamais son loyer.'], 2)}
      <div class="cl-filter" role="group" aria-label="Quelle plante est touchée ?"><span class="hand">Quelle plante ?</span>
        ${PLANT_FILTERS.map((f) => `<button type="button" class="chip-btn ${filter === f.id ? 'on' : ''}" data-f="${f.id}" aria-pressed="${filter === f.id}">${f.name}</button>`).join('')}</div>
      <div class="pest-grid">${list.map(card).join('')}</div>
      <section class="photo-help panel">
        <div><h2>Rien ne ressemble à ta plante ?</h2>
          <p>Prends-la en photo, au plus près de la zone abîmée, et lance une recherche d’image. Tu pourras ensuite comparer avec les fiches ci-dessus.</p>
          <label class="btn white"><input type="file" accept="image/*" capture="environment" id="cl-file" class="sr"> 📷 Prendre ma plante en photo</label></div>
        <div class="ph-res" id="ph-res"><p class="hand">Ta photo apparaîtra ici.</p></div>
      </section></div>`;
    $$('.pest', el).forEach((b) => b.addEventListener('click', () => sheet(b.dataset.id)));
    $$('.cl-filter button', el).forEach((b) => b.addEventListener('click', () => { filter = b.dataset.f; draw(); }));
    $('#cl-file', el).addEventListener('change', (e) => {
      const f = e.target.files[0]; if (!f) return;
      shrinkImage(f, 600).then((url) => {
        $('#ph-res', el).innerHTML = `<img src="${url}" alt="Ta photo de plante">
          <ol class="steps-mini"><li>Ouvre Google Lens avec le bouton ci-dessous.</li><li>Dépose ta photo : Google cherche des images semblables.</li><li>Reviens ici et ouvre la fiche du nom trouvé.</li></ol>
          <a class="btn sun" href="https://lens.google.com/" target="_blank" rel="noopener">Chercher avec Google Lens</a>`;
      });
    });
  }
  return { title: 'Ma plante est envahie', mount(view) { el = view; draw(); } };
})();
route('clinique', Clinique);
