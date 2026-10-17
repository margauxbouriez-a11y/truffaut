/* ============================================================
   SILENCE ÇA TRUFFE — le potager virtuel qui pousse avec la météo
   ============================================================ */
const PLANT_MONTHS = { tomate: [5, 6], courgette: [5, 6], salade: [3, 4, 5, 6, 7, 8, 9], fraise: [3, 4, 8, 9, 10], carotte: [3, 4, 5, 6, 7],
  radis: [3, 4, 5, 6, 7, 8, 9], basilic: [5, 6, 7], ail: [10, 11, 12, 1, 2], echalote: [2, 3, 4, 10, 11], tulipe: [10, 11, 12] };
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const COLS = 4, ROWS = 3;
const PG = { x0: 60, y0: 70, w: 175, h: 135, gx: 22, gy: 42 };

const Potager = (() => {
  let state, el, tool = null, selectedSeed = null, onMove = null;
  const defaultState = () => ({ loc: { name: 'Paris', lat: 48.8566, lon: 2.3522 }, plots: Array(COLS * ROWS).fill(null), offset: 0, harvests: 0, weather: null });
  const load = () => { state = Object.assign(defaultState(), store.get('potager', {})); if (state.plots.length !== COLS * ROWS) state.plots = Array(COLS * ROWS).fill(null); };
  const save = () => store.set('potager', state);
  const viewDate = () => todayISO(state.offset);

  /* ---------- météo (Open-Meteo, gratuit, sans clé) ---------- */
  async function fetchWeather(force) {
    const w = state.weather;
    const fresh = w && w.lat === state.loc.lat && w.lon === state.loc.lon && Date.now() - w.at < 3 * 3600e3;
    if (fresh && !force) return;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${state.loc.lat}&longitude=${state.loc.lon}` +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&past_days=92&forecast_days=16&timezone=auto';
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      const days = {};
      j.daily.time.forEach((d, i) => { days[d] = { tmax: j.daily.temperature_2m_max[i], tmin: j.daily.temperature_2m_min[i], rain: j.daily.precipitation_sum[i] || 0, code: j.daily.weather_code[i] }; });
      state.weather = { lat: state.loc.lat, lon: state.loc.lon, at: Date.now(), days, live: true };
    } catch (e) {
      state.weather = { lat: state.loc.lat, lon: state.loc.lon, at: Date.now(), days: {}, live: false };
    }
    save();
  }
  // Météo d'un jour : réelle si connue, sinon une saison moyenne pour la France
  function dayWeather(iso) {
    const real = state.weather && state.weather.days[iso];
    if (real && real.tmax != null) return real;
    const d = new Date(iso + 'T12:00:00');
    const doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
    const mean = 12 + 8 * Math.sin((2 * Math.PI * (doy - 110)) / 365);
    let h = 0; for (const c of iso) h = (h * 31 + c.charCodeAt(0)) % 9973;
    const wet = h % 10 < 3;
    return { tmax: mean + 5, tmin: mean - 5, rain: wet ? (h % 9) + 1 : 0, code: wet ? 61 : (h % 3 ? 2 : 0), synthetic: true };
  }
  const wIcon = (c) => (c === 0 ? '☀️' : c <= 2 ? '🌤️' : c === 3 ? '☁️' : c <= 48 ? '🌫️' : c <= 67 ? '🌧️' : c <= 77 ? '❄️' : c <= 82 ? '🌦️' : '⛈️');

  /* ---------- simulation : rejouée jour après jour depuis la plantation ---------- */
  function simulate(p, until = viewDate()) {
    const v = VEGGIES[p.veg];
    let progress = p.start || 0, moisture = 60, health = 100, frost = false, thirstyDays = 0;
    const waterings = new Set(p.water || []);
    const d = new Date(p.planted + 'T12:00:00');
    const end = new Date(until + 'T12:00:00');
    let last = null;
    while (d <= end) {
      const iso = d.toISOString().slice(0, 10);
      const w = dayWeather(iso);
      if (waterings.has(iso)) moisture = Math.min(100, moisture + 45);
      const mean = (w.tmax + w.tmin) / 2;
      const gdd = Math.max(0, mean - v.base);
      const factor = moisture < 12 ? 0.15 : moisture < 30 ? 0.65 : 1;
      if (health > 0) progress += (gdd / v.gdd) * factor * (health / 100 * 0.5 + 0.5);
      const small = progress < STAGE_AT[2] ? 0.6 : 1;
      const loss = clamp(2.5 + 0.45 * Math.max(0, w.tmax - 10), 2, 14) * v.water * small;
      moisture = clamp(moisture - loss + w.rain * 6, 0, 100);
      if (moisture < 12) { health -= 7; thirstyDays++; } else if (moisture >= 30 && moisture <= 92) { health += 3; thirstyDays = 0; }
      if (w.rain > 20 && moisture > 96) health -= 3;
      if (w.tmin < 0 && v.tender && progress > STAGE_AT[1]) { health -= 30; frost = true; }
      health = clamp(health, 0, 100);
      last = w;
      d.setDate(d.getDate() + 1);
    }
    progress = Math.min(progress, 1);
    let stage = 0; STAGE_AT.forEach((t, i) => { if (progress >= t) stage = i; });
    const lastWater = (p.water || []).filter((x) => x <= until).sort().pop() || null;
    return { progress, moisture, health, stage, frost, lastWater, dead: health <= 0, thirstyDays, last };
  }

  /* ---------- alertes ---------- */
  function alerts() {
    const out = [];
    const tomorrow = dayWeather(todayISO(state.offset + 1));
    state.plots.forEach((p, i) => {
      if (!p) return;
      const s = simulate(p), v = VEGGIES[p.veg];
      const where = `${v.name} (carré ${i + 1})`;
      if (s.dead) out.push({ i, icon: '🥀', title: `${where} a rendu l’âme`, text: 'Trop longtemps sans eau. Une minute de silence, puis on replante.' });
      else if (s.moisture < 12) out.push({ i, icon: '🆘', title: `${where} : SOS arrosoir`, text: 'La terre est sèche comme un biscuit et les feuilles tombent. Vite !' });
      else if (s.moisture < 30 && tomorrow.rain < 3) out.push({ i, icon: '💧', title: `${where} fait la tête`, text: 'Elle a soif et aucune pluie n’est annoncée demain.' });
      if (!s.dead && v.tender && tomorrow.tmin < 1) out.push({ i, icon: '🥶', title: `Bonnet conseillé pour ${v.name.toLowerCase()}`, text: `${Math.round(tomorrow.tmin)} °C cette nuit. Un voile d’hivernage fera l’affaire.` });
      if (!s.dead && s.stage === 5) out.push({ i, icon: '🧺', title: `${where} est prêt`, text: 'Il n’attendra pas éternellement. Clique dessus pour récolter.' });
    });
    if (tomorrow.rain >= 5 && state.plots.some(Boolean)) out.push({ icon: '🌧️', title: `${Math.round(tomorrow.rain)} mm de pluie demain`, text: 'Pose l’arrosoir, le ciel s’en charge.' });
    return out;
  }
  function updateBell() {
    if (!state) load();
    const n = alerts().filter((a) => a.i != null && a.icon !== '🧺').length;
    const b = $('#bell-count'); if (b) b.textContent = n ? n : '';
  }

  /* ---------- dessins ---------- */
  function vegSVG(id, stage, opts = {}) {
    const v = VEGGIES[id];
    const thirsty = opts.thirsty, dead = opts.dead;
    const leaf = dead ? '#B08B5A' : thirsty ? '#B5C27A' : '#5E9446';
    const leaf2 = dead ? '#9A7448' : thirsty ? '#9DAA62' : '#3F6B3A';
    const droop = thirsty || dead ? 18 : 0;
    const L = (x, y, len, ang, c = leaf) => Deco.leaf(x, y, len, ang + (ang > -90 ? droop : -droop), c, .46);
    const stem = (h) => `<path d="M0 0 Q${droop / 3} ${-h / 2} ${droop / 2} ${-h}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0 0 Q${droop / 3} ${-h / 2} ${droop / 2} ${-h}" stroke="${leaf2}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    let g = '';
    const mound = `<ellipse cx="0" cy="2" rx="30" ry="9" fill="#7A4E2D" stroke="${INK}" stroke-width="2.5"/><ellipse cx="0" cy="2" rx="30" ry="9" fill="url(#dots)"/>`;
    if (stage === 0) {
      g = mound + (v.bulb
        ? `<path d="M-8 0 C-10 -12 -4 -18 0 -22 C4 -18 10 -12 8 0 Z" fill="#EAD9B5" stroke="${INK}" stroke-width="2.5"/>`
        : `<ellipse cx="-8" cy="-2" rx="4" ry="3" fill="#E8D7A6" stroke="${INK}" stroke-width="2"/><ellipse cx="7" cy="-1" rx="4" ry="3" fill="#E8D7A6" stroke="${INK}" stroke-width="2"/>`);
      return g;
    }
    const tall = ['ail', 'echalote', 'tulipe'].includes(id);
    if (tall) {
      const n = Math.min(stage + 1, 5), h = [0, 22, 38, 56, 70, 76][stage];
      for (let i = 0; i < n; i++) {
        const a = (i - (n - 1) / 2) * 14;
        g += `<path d="M0 0 Q${a * .4} ${-h * .6} ${a + droop} ${-h + Math.abs(a) * .6}" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M0 0 Q${a * .4} ${-h * .6} ${a + droop} ${-h + Math.abs(a) * .6}" stroke="${id === 'tulipe' ? leaf : '#7FBF5A'}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      }
      if (id === 'tulipe' && stage >= 4) g += `<path d="M${droop / 2} ${-h - 6} l-11 -6 l3 -16 l8 8 l8 -8 l3 16 Z" fill="${dead ? '#B08B5A' : v.color}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
      if (id !== 'tulipe' && stage >= 5) g += `<ellipse cx="0" cy="-3" rx="13" ry="10" fill="${v.color}" stroke="${INK}" stroke-width="2.5"/>`;
      return mound + g;
    }
    const sizes = [0, 12, 22, 34, 42, 46];
    const s = sizes[stage];
    if (id === 'salade') {
      const n = 4 + stage * 2;
      for (let i = 0; i < n; i++) g += L(0, -4, s * .9, -90 + (i - (n - 1) / 2) * (150 / n), i % 2 ? leaf : '#9BD66B');
      if (stage >= 4) g += `<ellipse cx="0" cy="-10" rx="${s * .45}" ry="${s * .32}" fill="#B9E37E" stroke="${INK}" stroke-width="2.5"/>`;
      return mound + g;
    }
    if (id === 'carotte' || id === 'radis') {
      const n = 3 + stage;
      for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * 11; g += `<path d="M0 -2 Q${a * .5} ${-s * .6} ${a + droop} ${-s}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M0 -2 Q${a * .5} ${-s * .6} ${a + droop} ${-s}" stroke="${leaf}" stroke-width="2" fill="none"/>`; for (let k = 1; k < 4; k++) g += `<circle cx="${a * (k / 4) + droop * k / 4}" cy="${-s * k / 4 - 2}" r="${3 + stage * .4}" fill="${leaf}" stroke="${INK}" stroke-width="1.5"/>`; }
      if (stage >= 4) g += `<path d="M-9 0 Q0 ${id === 'radis' ? -14 : -10} 9 0 Q0 ${id === 'radis' ? 12 : 8} -9 0Z" fill="${v.color}" stroke="${INK}" stroke-width="2.5"/>`;
      return mound + g;
    }
    // plantes buissonnantes : tomate, courgette, fraise, basilic
    const h = s * (id === 'tomate' ? 1.5 : id === 'fraise' ? .7 : 1);
    g += stem(h);
    const pairs = Math.min(stage + 1, 5);
    for (let i = 0; i < pairs; i++) {
      const y = -h * (0.2 + i / (pairs + .5)) ;
      const len = (id === 'courgette' ? 26 : id === 'basilic' ? 15 : 19) * (0.6 + stage * .1);
      g += L(droop * (-y / h) / 2, y, len, -20 - i * 4) + L(droop * (-y / h) / 2, y, len, -160 + i * 4, leaf2);
    }
    if (id === 'courgette' && stage >= 3) g += `<path d="${blob(0, -h * .45, s * .8, s * .45, 8, .2, 3)}" fill="${leaf}" stroke="${INK}" stroke-width="2.5" opacity=".95"/>`;
    const top = `${droop / 2} ${-h}`;
    if (stage === 4) {
      const fc = id === 'fraise' ? '#FFFFFF' : id === 'basilic' ? '#FFFFFF' : '#FFD35A';
      g += `<g transform="translate(${top})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-6" rx="3.5" ry="6" fill="${fc}" stroke="${INK}" stroke-width="1.8" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#F5A623" stroke="${INK}" stroke-width="1.5"/></g>`;
    }
    if (stage === 5 && !dead) {
      if (id === 'tomate') g += [[-14, -h * .45], [12, -h * .6], [-6, -h * .8], [16, -h * .3]].map(([x, y]) => C(x, y, 7, '#E04E2E') + `<path d="M${x - 3} ${y - 6} l3 3 l3 -3" stroke="#3F6B3A" stroke-width="2" fill="none"/><circle cx="${x - 2.5}" cy="${y - 2}" r="1.8" fill="#fff" opacity=".75"/>`).join('');
      if (id === 'courgette') g += `<rect x="-26" y="-14" width="34" height="12" rx="6" fill="#4E9E3E" stroke="${INK}" stroke-width="2.5" transform="rotate(-12)"/><rect x="2" y="-10" width="30" height="11" rx="5" fill="#5BA84A" stroke="${INK}" stroke-width="2.5" transform="rotate(10)"/>`;
      if (id === 'fraise') g += [[-16, -4], [14, -6], [2, -2]].map(([x, y]) => `<path d="M${x - 6} ${y - 6} Q${x} ${y - 9} ${x + 6} ${y - 6} Q${x + 5} ${y + 5} ${x} ${y + 8} Q${x - 5} ${y + 5} ${x - 6} ${y - 6}Z" fill="#E8455B" stroke="${INK}" stroke-width="2"/>`).join('');
      if (id === 'basilic') g += `<path d="${blob(0, -h * .55, s * .55, s * .5, 9, .25, 9)}" fill="#3FA05A" stroke="${INK}" stroke-width="2.5"/>`;
    }
    return g;
  }
  const iconSVG = (id) => `<svg viewBox="-40 -80 80 92" aria-hidden="true"><g>${vegSVG(id, 5)}</g></svg>`;

  /* ---------- rendu ---------- */
  function plotXY(i) { const c = i % COLS, r = Math.floor(i / COLS); return [PG.x0 + c * (PG.w + PG.gx), PG.y0 + r * (PG.h + PG.gy)]; }
  function boardSVG() {
    let plots = '';
    state.plots.forEach((p, i) => {
      const [x, y] = plotXY(i);
      let inner = '', label = 'Vide', lab = `Carré ${i + 1}, vide. Clique pour planter.`;
      let soil = '#8B5E3C';
      if (p) {
        const s = simulate(p), v = VEGGIES[p.veg];
        soil = s.moisture > 60 ? '#5E3B22' : s.moisture > 30 ? '#7A4E2D' : '#A87A4F';
        inner = `<g transform="translate(${x + PG.w / 2} ${y + PG.h - 30}) scale(1.5)">${vegSVG(p.veg, s.stage, { thirsty: s.moisture < 30, dead: s.dead })}</g>`;
        const drop = s.dead ? '🥀' : s.moisture < 12 ? '🆘' : s.moisture < 30 ? '💧' : '';
        if (drop) inner += `<text x="${x + PG.w - 26}" y="${y + 30}" font-size="24" class="bounce">${drop}</text>`;
        if (s.stage === 5 && !s.dead) inner += `<text x="${x + 10}" y="${y + 30}" font-size="24" class="bounce">✨</text>`;
        label = v.name;
        lab = `Carré ${i + 1} : ${v.name}, ${STAGES[s.stage].toLowerCase()}, humidité ${Math.round(s.moisture)} %.`;
      }
      plots += `<g class="plot" data-i="${i}" tabindex="0" role="button" aria-label="${lab}">
        <rect x="${x}" y="${y}" width="${PG.w}" height="${PG.h}" rx="16" fill="#B98556" stroke="${INK}" stroke-width="3"/><path d="M${x + 6} ${y + 4} h${PG.w - 20} M${x + 10} ${y + PG.h - 4} h${PG.w - 24}" stroke="${INK}" stroke-width=".8" opacity=".45"/>
        <rect x="${x + 9}" y="${y + 9}" width="${PG.w - 18}" height="${PG.h - 18}" rx="11" fill="${soil}" stroke="${INK}" stroke-width="2.5"/>
        ${[0, 1, 2].map((k) => `<path d="M${x + 22} ${y + 38 + k * 30} q${(PG.w - 44) / 2} -6 ${PG.w - 44} 0" stroke="rgba(0,0,0,.18)" stroke-width="3" fill="none"/>`).join('')}
        ${inner}
        <g transform="translate(${x + PG.w / 2} ${y + PG.h + 4})"><rect x="-58" y="0" width="116" height="26" rx="4" fill="#F3E9D2" stroke="${INK}" stroke-width="2.5"/>
        <text x="0" y="19" text-anchor="middle" class="plot-label">${label}</text></g>
      </g>`;
    });
    const fence = Array.from({ length: 20 }, (_, k) => `<path d="M${20 + k * 45} 640 v-34 l8 -9 l8 9 v34" fill="#F3E9D2" stroke="${INK}" stroke-width="2.5"/><path d="M${30 + k * 45} 640 v-30" stroke="${INK}" stroke-width=".8" opacity=".4"/>`).join('') + Array.from({ length: 10 }, (_, k) => Deco.rose(40 + k * 92, 612, 8, ['#D9475C', '#EE9AAE'][k % 2]) + Deco.leaf(50 + k * 92, 616, 14, -20, '#4E7D3A')).join('');
    return `<svg viewBox="0 0 900 650" class="board-svg" role="group" aria-label="Ton potager">
      <rect x="6" y="6" width="888" height="638" rx="34" fill="#A9CB86" stroke="${INK}" stroke-width="3"/>
      <rect x="6" y="6" width="888" height="638" rx="34" fill="url(#dots)" opacity=".5"/>
      ${Array.from({ length: 18 }, (_, k) => { const x = 30 + k * 49; return (k % 3 === 0 ? Deco.daisy(x, 36, 9, '#FFFFFF', '#F0A830', 11) : k % 3 === 1 ? Deco.tulip(x, 48, .55, ['#E04E2E', '#EE9AAE', '#F0A830'][k % 3]) : Deco.leaf(x - 8, 40, 20, -30, '#4E7D3A') + Deco.bud(x + 4, 40, 15, '#8E7CC3')); }).join('')}
      ${Array.from({ length: 6 }, (_, k) => Deco.daisy(24, 120 + k * 80, 7, k % 2 ? '#EE9AAE' : '#FFFFFF', '#F0A830', 9) + Deco.daisy(876, 120 + k * 80, 7, k % 2 ? '#FFFFFF' : '#8E7CC3', '#F0A830', 9)).join('')}
      ${plots}
      <path d="M14 622 H886" stroke="${INK}" stroke-width="3"/>${fence}
      <g id="fx"></g>
    </svg>`;
  }

  function weatherCard() {
    const w = state.weather;
    const t = dayWeather(viewDate());
    const next = [1, 2, 3, 4, 5].map((k) => ({ iso: todayISO(state.offset + k), ...dayWeather(todayISO(state.offset + k)) }));
    const live = w && w.live && !t.synthetic;
    return `<div class="weather panel">
      <div class="w-now">
        <span class="w-ico" aria-hidden="true">${wIcon(t.code)}</span>
        <div><b>${Math.round(t.tmax)}° <small>/ ${Math.round(t.tmin)}°</small></b>
        <span>${esc(state.loc.name)} · ${t.rain >= 0.5 ? `${Math.round(t.rain)} mm de pluie` : 'pas de pluie'}</span></div>
        <button class="btn white small" id="loc-btn" type="button">Changer de ville</button>
      </div>
      <div class="w-days">${next.map((d) => `<div><span>${new Date(d.iso + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'short' })}</span><i aria-hidden="true">${wIcon(d.code)}</i><b>${Math.round(d.tmax)}°</b></div>`).join('')}</div>
      <p class="w-src">${live ? 'Météo réelle, mise à jour automatiquement (Open-Meteo).' : 'Météo simulée : connexion indisponible ou date hors prévisions.'}</p>
    </div>`;
  }

  function adviceCard(id) {
    const v = VEGGIES[id];
    const m = new Date(viewDate() + 'T12:00').getMonth() + 1;
    const ok = PLANT_MONTHS[id].includes(m);
    return `<div class="advice-card">
      <div class="adv-head"><span class="adv-ico">${iconSVG(id)}</span><div><b>${v.name}</b>
      <span class="tag ${ok ? 'ok' : 'wait'}">${ok ? `C’est le bon moment en ${MONTHS[m - 1]} !` : `Attends ${MONTHS[PLANT_MONTHS[id][0] - 1]}`}</span></div></div>
      <dl>
        <dt>Quand</dt><dd>${v.when}</dd><dt>Où</dt><dd>${v.sun}</dd><dt>Espacement</dt><dd>${v.space}</dd>
        <dt>Arrosage</dt><dd>${v.drink}</dd><dt>Bons voisins</dt><dd>${v.friends}</dd>
      </dl>
      <p class="hand tip">💡 ${v.tip}</p>
      ${v.product ? `<a class="btn small sun" href="${v.product.url}" target="_blank" rel="noopener">Acheter : ${esc(v.product.label)}</a>` : ''}
    </div>`;
  }

  function draw() {
    const al = alerts();
    const dateLabel = state.offset === 0 ? 'Aujourd’hui' : `Dans ${state.offset} jour${state.offset > 1 ? 's' : ''} (simulation)`;
    const nowM = new Date(viewDate() + 'T12:00').getMonth() + 1;
    el.innerHTML = `<div class="page potager">
      ${Deco.head('<span class="logo-title"><span>Silence</span> <span>ça truffe</span></span>',
        'Ton potager, en double. Il pousse avec la vraie météo de chez toi et il a soif quand le vrai a soif. Non, il ne s’arrose pas tout seul : c’est toi qui notes chaque arrosage.',
        ['Je ne dis rien, mais tes salades ont l’air délicieuses.', 'Un conseil : arrose le matin. Le soir, c’est l’heure de mes amis les limaces.', 'J’ai fait le tour du potager. Il m’a fallu la journée.', 'Les tomates, c’est surfait. Vive la laitue.'], 0,
        `<div class="time"><span class="hand">${new Date(viewDate() + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} · <b>${dateLabel}</b></span>
          <div class="time-btns"><button class="btn white small" id="t-back" type="button" ${state.offset ? '' : 'disabled'}>Revenir à aujourd’hui</button>
          <button class="btn white small" id="t-next" type="button">Avancer d’un jour</button></div></div>`)}
      <div class="pg-grid">
        <aside class="seeds panel">
          <h2>Mes graines et bulbes</h2>
          <p class="hand">Choisis une plante, puis clique sur un carré vide.</p>
          <div class="seed-list">${Object.keys(VEGGIES).map((id) => `<button class="seed ${selectedSeed === id ? 'on' : ''} ${PLANT_MONTHS[id].includes(nowM) ? 'season' : ''}" data-seed="${id}" type="button" aria-pressed="${selectedSeed === id}">
            ${iconSVG(id)}<span>${VEGGIES[id].name}</span>${VEGGIES[id].bulb ? '<em>bulbe</em>' : ''}</button>`).join('')}</div>
          <p class="legend"><span class="dot-season"></span> à planter en ce moment</p>
        </aside>
        <section class="board-col">
          <div class="toolbar">
            <button class="tool-btn ${tool === 'water' ? 'on' : ''}" id="can-btn" type="button" aria-pressed="${tool === 'water'}">
              <svg viewBox="0 0 80 60" aria-hidden="true"><path d="M14 22 h34 v26 a6 6 0 0 1 -6 6 h-22 a6 6 0 0 1 -6 -6 Z" fill="#5BB7E6" stroke="${INK}" stroke-width="3"/><path d="M48 30 L72 14 L75 19 L50 40" fill="#5BB7E6" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M20 22 Q31 4 42 22" fill="none" stroke="${INK}" stroke-width="3"/></svg>
              <span>${tool === 'water' ? 'Arrosoir en main : clique sur un carré' : 'Prendre l’arrosoir'}</span></button>
            <span class="harvest">🧺 ${state.harvests} récolte${state.harvests > 1 ? 's' : ''}</span>
            ${state.plots.some(Boolean) ? '' : '<button class="btn sun small" id="demo-btn" type="button">Remplir avec un potager d’exemple</button>'}
          </div>
          <div class="board ${tool ? 'tool-' + tool : ''} ${selectedSeed ? 'seeding' : ''}">${boardSVG()}<div class="can-cursor" aria-hidden="true"><svg viewBox="0 0 80 60" width="64" height="48"><path d="M14 22 h34 v26 a6 6 0 0 1 -6 6 h-22 a6 6 0 0 1 -6 -6 Z" fill="#5BB7E6" stroke="#2E3A2A" stroke-width="3"/><path d="M48 30 L72 14 L75 19 L50 40" fill="#5BB7E6" stroke="#2E3A2A" stroke-width="3" stroke-linejoin="round"/><path d="M20 22 Q31 4 42 22" fill="none" stroke="#2E3A2A" stroke-width="3"/></svg></div></div>
        </section>
        <aside class="side">
          ${weatherCard()}
          <div class="alerts panel">
            <h2>Alertes <span class="tag">${al.length}</span></h2>
            ${al.length ? `<ul>${al.map((a) => `<li ${a.i != null ? `data-goto="${a.i}"` : ''}><span aria-hidden="true">${a.icon}</span><div><b>${esc(a.title)}</b><span>${esc(a.text)}</span></div></li>`).join('')}</ul>` : '<p class="hand">Rien à signaler. Les vers de terre font leur travail.</p>'}
            <button class="btn white small" id="notif-btn" type="button">Recevoir les alertes sur mon téléphone</button>
          </div>
        </aside>
      </div>
      <section class="advice panel">
        <div class="advice-intro"><h2>Que veux-tu planter ?</h2>
          <label class="field"><span class="sr">Plante</span><select id="adv-select">${Object.keys(VEGGIES).map((id) => `<option value="${id}">${VEGGIES[id].name}</option>`).join('')}</select></label>
          <p class="hand">Les conseils s’adaptent au mois en cours et à ta météo.</p></div>
        <div id="adv-body"></div>
      </section>
    </div>`;
    const firstSeason = Object.keys(VEGGIES).find((id) => PLANT_MONTHS[id].includes(nowM)) || 'tomate';
    const sel = $('#adv-select', el); sel.value = selectedSeed || firstSeason;
    $('#adv-body', el).innerHTML = adviceCard(sel.value);
    sel.addEventListener('change', () => { $('#adv-body', el).innerHTML = adviceCard(sel.value); });
    bind();
    updateBell();
  }

  function bind() {
    $$('.seed', el).forEach((b) => b.addEventListener('click', () => {
      selectedSeed = selectedSeed === b.dataset.seed ? null : b.dataset.seed; tool = null; draw();
      if (selectedSeed) toast('🌱', `${VEGGIES[selectedSeed].name} en main`, 'Clique sur un carré vide pour la planter.', 2500);
    }));
    $('#can-btn', el).addEventListener('click', () => { tool = tool === 'water' ? null : 'water'; selectedSeed = null; draw(); });
    $('#t-next', el).addEventListener('click', () => { state.offset++; save(); draw(); });
    $('#t-back', el).addEventListener('click', () => { state.offset = 0; save(); draw(); });
    $('#loc-btn', el).addEventListener('click', askLocation);
    $('#notif-btn', el).addEventListener('click', askNotif);
    const demo = $('#demo-btn', el); if (demo) demo.addEventListener('click', seedDemo);
    $$('.alerts li[data-goto]', el).forEach((li) => li.addEventListener('click', () => openPlot(+li.dataset.goto)));
    $$('.plot', el).forEach((g) => {
      const act = () => clickPlot(+g.dataset.i);
      g.addEventListener('click', act);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    });
    const board = $('.board', el), cur = $('.can-cursor', el);
    board.addEventListener('mousemove', (e) => { const r = board.getBoundingClientRect(); cur.style.transform = `translate(${e.clientX - r.left + 6}px, ${e.clientY - r.top - 34}px)`; });
  }

  function clickPlot(i) {
    const p = state.plots[i];
    if (tool === 'water') { if (p) water(i); else toast('🤔', 'Tu arroses de la terre', 'Ce carré est vide. Plante d’abord, arrose ensuite.'); return; }
    if (!p) { if (selectedSeed) plantDialog(i, selectedSeed); else toast('👈', 'Choisis d’abord une graine', 'Dans la liste « Mes graines et bulbes ».'); return; }
    openPlot(i);
  }

  function water(i) {
    const p = state.plots[i];
    const before = simulate(p);
    p.water = p.water || [];
    const d = viewDate();
    if (!p.water.includes(d)) p.water.push(d);
    save();
    // animation : l'arrosoir penche et les gouttes tombent
    const [x, y] = plotXY(i);
    const fx = $('#fx', el);
    fx.innerHTML = `<g class="pour" transform="translate(${x + PG.w - 20} ${y - 6})">
      <g class="pour-can"><path d="M-30 0 h40 v30 a6 6 0 0 1 -6 6 h-28 a6 6 0 0 1 -6 -6 Z" fill="#5BB7E6" stroke="${INK}" stroke-width="3"/><path d="M-30 10 L-62 -6 L-65 -1 L-30 20" fill="#5BB7E6" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>
      ${Array.from({ length: 9 }, (_, k) => `<path class="drop" style="animation-delay:${(k % 3) * .15 + .3}s" d="M${-80 + (k % 3) * 12 - Math.floor(k / 3) * 8} 10 q4 7 0 10 q-4 -3 0 -10Z" fill="#5BB7E6" stroke="${INK}" stroke-width="1.5"/>`).join('')}
    </g>`;
    setTimeout(() => draw(), 1300);
    if (before.moisture > 85) toast('🌊', 'Elle nage déjà', 'La terre était bien humide : n’en fais pas une piscine.');
    else if (before.dead) toast('🥀', 'Trop tard pour celle-ci…', 'Arrache-la et replante.');
    else toast('💧', `${VEGGIES[p.veg].name} arrosée`, 'Glou glou. C’est noté dans ton carnet.');
  }

  function plantDialog(i, id) {
    const v = VEGGIES[id];
    const box = modal(`<h2>Planter : ${v.name}</h2>
      <p>Comment est ta plante dans ton vrai potager ?</p>
      <div class="choice-row">
        <button class="choice on" data-mode="new" type="button">${v.bulb ? '🧅 Je viens de planter le bulbe' : '🌰 Je viens de semer ou de planter'}</button>
        <button class="choice" data-mode="grown" type="button">📷 Elle a déjà poussé</button>
      </div>
      <div class="mode-new">
        <label class="field">Planté le<input type="date" id="pl-date" value="${viewDate()}" min="${todayISO(-90)}" max="${viewDate()}"></label>
        <p class="hand small">Si tu as planté il y a quelque temps, indique la date : on rejoue la vraie météo depuis ce jour-là.</p>
      </div>
      <div class="mode-grown" hidden>
        <label class="field">Prends ton potager en photo (facultatif)<input type="file" accept="image/*" capture="environment" id="pl-photo"></label>
        <img id="pl-prev" alt="" hidden>
        <p><b>À quoi ressemble-t-elle le plus ?</b></p>
        <div class="stage-pick">${[1, 2, 3, 4, 5].map((s) => `<button class="stage-opt ${s === 2 ? 'on' : ''}" data-stage="${s}" type="button"><svg viewBox="-40 -80 80 92" aria-hidden="true">${vegSVG(id, s)}</svg><span>${STAGES[s]}</span></button>`).join('')}</div>
      </div>
      <div class="actions"><button class="btn" id="pl-ok" type="button">Planter dans le carré ${i + 1}</button></div>`, {});
    let mode = 'new', stage = 2, photo = null;
    $$('.choice', box).forEach((b) => b.addEventListener('click', () => {
      mode = b.dataset.mode; $$('.choice', box).forEach((x) => x.classList.toggle('on', x === b));
      $('.mode-new', box).hidden = mode !== 'new'; $('.mode-grown', box).hidden = mode !== 'grown';
    }));
    $$('.stage-opt', box).forEach((b) => b.addEventListener('click', () => { stage = +b.dataset.stage; $$('.stage-opt', box).forEach((x) => x.classList.toggle('on', x === b)); }));
    $('#pl-photo', box).addEventListener('change', (e) => {
      const f = e.target.files[0]; if (!f) return;
      shrinkImage(f, 360).then((url) => { photo = url; const im = $('#pl-prev', box); im.src = url; im.hidden = false; im.alt = 'Ta photo'; });
    });
    $('#pl-ok', box).addEventListener('click', () => {
      const planted = mode === 'new' ? ($('#pl-date', box).value || viewDate()) : viewDate();
      state.plots[i] = { veg: id, planted, start: mode === 'grown' ? STAGE_AT[stage] + 0.01 : 0, water: [], photo };
      save(); closeModal(); selectedSeed = null; draw();
      toast('🌱', `${v.name} plantée`, 'Elle grandira au rythme de la météo. Maintenant, patience.');
    });
  }

  function openPlot(i) {
    const p = state.plots[i]; if (!p) return;
    const v = VEGGIES[p.veg], s = simulate(p);
    const bar = (val, cls, label) => `<div class="meter"><span>${label}</span><div class="m-track"><div class="m-fill ${cls}" style="width:${Math.round(val)}%"></div></div><b>${Math.round(val)} %</b></div>`;
    const box = modal(`<div class="plot-sheet">
        <div class="ps-art"><svg viewBox="-60 -110 120 125" aria-hidden="true"><g transform="scale(1.3)">${vegSVG(p.veg, s.stage, { thirsty: s.moisture < 30, dead: s.dead })}</g></svg>
        ${p.photo ? `<img src="${p.photo}" alt="Ta photo de ${v.name.toLowerCase()}">` : ''}</div>
        <div><h2>${v.name}</h2><p class="tag">${s.dead ? 'Fanée' : STAGES[s.stage]}</p>
        ${bar(s.progress * 100, 'grow', 'Croissance')}${bar(s.moisture, s.moisture < 30 ? 'dry' : 'wet', 'Humidité du sol')}${bar(s.health, s.health < 40 ? 'dry' : 'health', 'Santé')}
        <p class="small">Planté le ${new Date(p.planted + 'T12:00').toLocaleDateString('fr-FR')} · ${s.lastWater ? 'dernier arrosage le ' + new Date(s.lastWater + 'T12:00').toLocaleDateString('fr-FR') : 'jamais arrosé'}</p></div>
      </div>
      <p class="hand tip">💡 ${v.tip}</p>
      <div class="actions">
        ${s.stage === 5 && !s.dead ? '<button class="btn sun" id="ps-harvest" type="button">Récolter</button>' : ''}
        ${s.dead ? '' : '<button class="btn" id="ps-water" type="button">J’ai arrosé aujourd’hui</button>'}
        <button class="btn white" id="ps-remove" type="button">${s.dead ? 'Arracher' : 'Retirer du potager'}</button>
      </div>`);
    const w = $('#ps-water', box); if (w) w.addEventListener('click', () => { closeModal(); water(i); });
    const h = $('#ps-harvest', box); if (h) h.addEventListener('click', () => { state.plots[i] = null; state.harvests++; save(); closeModal(); draw(); confetti(); toast('🧺', `Belle récolte de ${v.name.toLowerCase()} !`, 'Le carré est libre pour une nouvelle plantation.'); });
    $('#ps-remove', box).addEventListener('click', () => { state.plots[i] = null; save(); closeModal(); draw(); });
  }

  function askLocation() {
    const box = modal(`<h2>Où est ton potager ?</h2><p>La météo de ta ville fait pousser tes plantes.</p>
      <label class="field">Ville<input id="city" placeholder="Ex. Lyon, Nantes, Lille…" autocomplete="off"></label>
      <ul class="city-res" id="city-res"></ul>
      <div class="actions"><button class="btn white" id="geo" type="button">📍 Utiliser ma position</button></div>`);
    const input = $('#city', box), res = $('#city-res', box);
    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const q = input.value.trim(); if (q.length < 2) { res.innerHTML = ''; return; }
        try {
          const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=fr&format=json`);
          const j = await r.json();
          res.innerHTML = (j.results || []).map((c) => `<li><button type="button" data-lat="${c.latitude}" data-lon="${c.longitude}" data-name="${esc(c.name)}">${esc(c.name)} <small>${esc([c.admin1, c.country].filter(Boolean).join(', '))}</small></button></li>`).join('') || '<li class="hand">Aucune ville trouvée.</li>';
          $$('button', res).forEach((b) => b.addEventListener('click', () => setLoc(b.dataset.name, +b.dataset.lat, +b.dataset.lon)));
        } catch (e) { res.innerHTML = '<li class="hand">Recherche indisponible sans connexion.</li>'; }
      }, 300);
    });
    $('#geo', box).addEventListener('click', () => {
      if (!navigator.geolocation) return toast('📍', 'Position indisponible', 'Tape le nom de ta ville.');
      navigator.geolocation.getCurrentPosition((pos) => setLoc('Ma position', +pos.coords.latitude.toFixed(3), +pos.coords.longitude.toFixed(3)),
        () => toast('📍', 'Position refusée', 'Tape le nom de ta ville à la place.'));
    });
  }
  async function setLoc(name, lat, lon) {
    state.loc = { name, lat, lon }; save(); closeModal();
    toast('🌦️', `Météo de ${name}`, 'Mise à jour en cours…', 2500);
    await fetchWeather(true); draw();
  }

  async function askNotif() {
    if (!('Notification' in window)) return toast('🔔', 'Pas de notifications ici', 'Ton navigateur ne les gère pas : les alertes restent visibles dans la cloche.');
    try {
      const p = await Notification.requestPermission();
      if (p === 'granted') {
        const al = alerts();
        new Notification('Silence ça truffe', { body: al.length ? al[0].title + ' — ' + al[0].text : 'Tu seras prévenu·e quand tes plantes auront besoin de toi.' });
        toast('🔔', 'Alertes activées', 'Tu seras prévenu·e quand une plante a soif ou qu’il va geler.');
      } else toast('🔕', 'Alertes refusées', 'Tu peux les réactiver dans les réglages du navigateur.');
    } catch (e) { toast('🔔', 'Notifications indisponibles', 'Elles fonctionneront une fois le site en ligne (https).'); }
  }

  function seedDemo() {
    const d = (k) => todayISO(state.offset - k);
    const plan = [['ail', 30, [20, 8]], ['fraise', 55, [40, 25, 12, 3]], ['salade', 38, [30, 20, 10]], ['tulipe', 14, [10]], ['radis', 32, [25, 15, 6, 1]], ['echalote', 20, []],
      ['tomate', 85, [70, 50, 30, 15, 5]], null, ['carotte', 60, [45, 30, 15]], ['basilic', 40, [35]], null, null];
    state.plots = plan.map((x) => (x ? { veg: x[0], planted: d(x[1]), start: 0, water: x[2].map((k) => d(k)) } : null));
    save(); draw();
    toast('🌻', 'Potager d’exemple planté', 'Les plantes ont poussé avec la vraie météo des dernières semaines.');
  }

  function confetti() {
    const box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    box.innerHTML = Array.from({ length: 28 }, (_, k) => `<i style="left:${rand(5, 95)}%;background:${['#FFD35A', '#EE5D45', '#7CC46A', '#5BB7E6', '#F28DB2'][k % 5]};animation-delay:${rand(0, .4)}s;transform:rotate(${rand(0, 360)}deg)"></i>`).join('');
    document.body.appendChild(box); setTimeout(() => box.remove(), 2200);
  }

  return {
    title: 'Silence ça truffe',
    async mount(view) {
      el = view; load(); draw();
      await fetchWeather(); draw();
    },
    unmount() { tool = null; selectedSeed = null; },
    updateBell,
    vegSVG,
  };
})();
route('potager', Potager);

/* Réduit une photo pour la garder dans le navigateur */
function shrinkImage(file, max) {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = img.width * k; c.height = img.height * k;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.75));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}
