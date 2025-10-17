// favoritos.js — listar favoritos
function Favoritos() {
  const favs = JSON.parse(localStorage.getItem('favs')) || [];
  if (!favs.length) {
    document.getElementById('root').innerHTML = '<p>No tienes favoritos aún.</p>';
    return;
  }
  const html = favs.map(p => `
    <div class="fav-item">
    <img src="${obtenerImagenProducto(p)}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/100'">
      <div>
        <h4>${p.title}</h4>
        <p class="small">$${p.price}</p>
        <button onclick="Detalle(${p.id})">Ver</button>
        <button onclick="toggleFavorito(${JSON.stringify(p)})">Quitar</button>
      </div>
    </div>
  `).join('');
  document.getElementById('root').innerHTML = `<h2>Favoritos</h2>${html}`;
}
