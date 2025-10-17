// favoritos.js — listar favoritos
function Favoritos() {
  const favs = JSON.parse(localStorage.getItem('favs')) || [];
  if (!favs.length) {
    document.getElementById('root').innerHTML = '<p>No tienes favoritos aún.</p>';
    return;
  }
  const html = favs.map(p => `
    <div class="fav-item">
      <img src="${p.images?.[0] || p.thumbnail || 'https://via.placeholder.com/100'}" alt="${p.title}">
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
