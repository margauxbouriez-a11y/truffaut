# Le Grand Jardin — maquette imaginée pour Truffaut

## 👉 [Ouvrir le site](https://margauxbouriez-a11y.github.io/truffaut/)

> Maquette de démonstration, **non affiliée à Truffaut**. Les produits, prix et liens
> viennent de truffaut.com (relevés le 17/10/2026) et peuvent avoir changé.

Un site ludique, au style botanique dessiné à la main, accessible depuis le site Truffaut.
On arrive sur une carte d'île : chaque lieu ouvre un espace. Gaston l'escargot commente le tout.

| Espace | Ce qu'on y fait |
|---|---|
| **Silence ça truffe** | Recréer son potager (graine, bulbe ou plante déjà poussée + photo). Les plantes grandissent avec la vraie météo de sa ville, on note ses arrosages avec l'arrosoir, alertes (soif, gel, récolte, pluie) et conseils du mois. |
| **Le jardin-boutique** | Se promener dans un jardin dessiné avec un panier, cliquer sur une plante pour la cueillir en pot ou en bulbe. 34 vrais produits, dont une serre tropicale de plantes d’intérieur (monstera, ficus lyrata, orchidée, anthurium, bonsaï…). |
| **Mon bouquet** | 82 fleurs et feuillages dessinés, plus 12 plantes en pot illustrées en 3D à offrir avec le bouquet : toutes les variétés des bouquets de fleurs fraîches Truffaut, rangées en 5 familles (roses, fleurs vedettes, fleurs légères, feuillages, exotiques). Prendre les fleurs dans les seaux, les poser sur la table du fleuriste, les arranger, rassembler le bouquet dans la main et le commander. |
| **Le village de Noël** | Une balade en 5 scènes illustrées (entrée du village, grande rue, marché de Noël, patinoire, atelier du Père Noël) : on avance de scène en scène, les panneaux de l'entrée mènent aux autres lieux, et des points lumineux posés dans chaque scène ouvrent la fiche des produits du village de Noël vendus par Truffaut. La « Vue d'ensemble » garde la maquette enneigée composée des **vraies photos** de 27 produits Lemax. |
| **Montre ton jardin** | Publier une photo de son jardin ou potager et recevoir un bon de réduction (exemple). |
| **Ma plante est envahie** | Choisir l'image qui ressemble à sa plante (14 ravageurs et maladies), obtenir le remède doux, le remède fort et des plantes résistantes ; sinon photo + Google Lens. |
| **Dans les coulisses** | Les automatisations qui rendent tout ça possible (météo, alertes, catalogue synchronisé, IA photo, bons automatiques…). |

## Ce qui est simulé dans la maquette

- Aucune commande n'est passée : le panier et le bouquet renvoient vers truffaut.com.
- Les photos de la galerie et le potager sont enregistrés dans le navigateur du visiteur.
- La reconnaissance automatique des photos de plantes n'est pas branchée (voir « Dans les coulisses »).
- Le prix à la tige du bouquet est indicatif (bouquet XL 22 tiges à 38,99 € ÷ 22). La liste des fleurs vient des compositions affichées sur truffaut.com le 18/10/2026.
- Le bon de réduction « -10 % » est un exemple.

## Fichiers

- `index.html` : le site complet (s'ouvre aussi en double-cliquant dessus).
- `img/noel/` : les 5 scènes illustrées du village de Noël (et leurs vignettes).
- `img/plantes/` : les 12 plantes en pot illustrées (SVG) de l’espace bouquet.
- `src/` : les sources, une partie par espace (`potager.js`, `jardin.js`, `bouquet.js`, `noel.js`, `galerie.js`, `clinique.js`…), les données produits dans `data.js`, le décor fleuri et Gaston dans `deco.js`, les fleurs illustrées de l’atelier bouquet dans `fleurs.js`.
- `build.py` : rassemble `src/` en `index.html`. Après une modification : `python3 build.py`.

## Mettre le site en ligne (GitHub Pages)

Settings → Pages → Source : *Deploy from a branch* → `main` / `(root)` → Save.
Le site est ensuite disponible au lien en haut de cette page après 1 à 2 minutes.
Gardez le bandeau « maquette non affiliée à Truffaut » tant que le projet n'est pas validé par l'enseigne.
