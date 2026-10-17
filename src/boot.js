/* ============================================================
   DÉMARRAGE
   ============================================================ */
document.getElementById('basket-btn').addEventListener('click', () => {
  if (typeof Jardin !== 'undefined') Jardin.openBasket(); else go('jardin');
});
document.getElementById('deco-defs').innerHTML = Deco.DEFS;
render();
Potager.updateBell();
if (typeof Jardin !== 'undefined') Jardin.updateCount();
