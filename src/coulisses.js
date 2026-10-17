/* ============================================================
   DANS LES COULISSES — les automatisations derrière l'île
   ============================================================ */
route('coulisses', {
  title: 'Dans les coulisses',
  mount(el) {
    const rows = [
      ['🌦️', 'Le potager pousse tout seul', 'Les plantes grandissent avec la météo réelle de la ville du client.',
        'Chaque nuit, la météo du jour est récupérée automatiquement (service Open-Meteo, déjà branché dans la maquette). Un modèle de croissance par degrés-jours calcule l’avancement et l’humidité du sol de chaque plante.'],
      ['🔔', 'Des alertes au bon moment', '« Ta tomate a soif », « gel annoncé cette nuit », « tes radis sont prêts ».',
        'Les alertes partent en notification sur le téléphone ou par e-mail, avec le produit utile en magasin (voile d’hivernage, paillage…). Un levier d’achat déclenché par un vrai besoin.'],
      ['🛒', 'Un catalogue toujours à jour', 'Le jardin-boutique, l’atelier bouquet et le village de Noël affichent les vrais produits, prix et disponibilités.',
        'Synchronisation automatique avec le catalogue truffaut.com : un produit retiré disparaît du jardin, un nouveau santon apparaît dans le village. Le panier est transmis directement au panier du site.'],
      ['💐', 'Le bouquet arrive à l’atelier', 'Le client compose son bouquet tige par tige.',
        'La composition (fleurs, quantités, emballage, message) part automatiquement à l’atelier floral du magasin choisi, avec le dessin du bouquet, pour un retrait en 2 h ou une livraison.'],
      ['🔍', 'Un diagnostic par photo', 'Le client photographie sa plante malade.',
        'Un modèle d’intelligence artificielle de reconnaissance d’images propose les intrus les plus probables, puis la fiche remède et les produits. En cas de doute, la demande est transmise à un conseiller.'],
      ['🎁', 'Des bons de réduction automatiques', 'Une photo publiée = un bon de réduction.',
        'Les photos sont vérifiées automatiquement (contenu, doublons) avant publication. Le code est généré et relié à la carte de fidélité, puis utilisable en caisse comme en ligne.'],
      ['📬', 'Des conseils personnalisés', 'En octobre, ceux qui ont un potager reçoivent : « C’est le moment de planter l’ail ».',
        'Les données du potager virtuel nourrissent des e-mails saisonniers sur mesure, au lieu d’une newsletter identique pour tout le monde.'],
    ];
    el.innerHTML = `<div class="page coulisses">
      ${Deco.head('Dans les coulisses', 'Ce que le client voit d’un côté, les automatisations qui le rendent possible de l’autre.', ['Ici, c’est le moteur. Moi, je suis plutôt diesel.'], 1)}
      <div class="cs-head" aria-hidden="true"><span></span><span>Côté client</span><span>En coulisses</span></div>
      <ol class="cs-list">${rows.map(([em, t, a, b]) => `<li class="panel"><span class="cs-em" aria-hidden="true">${em}</span>
        <div><h2>${t}</h2><p>${a}</p></div><p class="cs-back">${b}</p></li>`).join('')}</ol>
    </div>`;
  },
});
