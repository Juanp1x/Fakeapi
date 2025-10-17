// carrito.js — ver y gestionar carrito
function VerCarrito() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart.length) {
    document.getElementById('root').innerHTML = '<p>Tu carrito está vacío.</p>';
    return;
  }
  const items = cart.map(i => `
    <div class="cart-item">
      <img src="${i.images?.[0] || i.thumbnail || 'https://via.placeholder.com/100'}" alt="${i.title}">
      <div>
        <h4>${i.title}</h4>
        <p>Precio: $${i.price}</p>
        <p>Cantidad: 
          <button onclick="cambiarCantidad(${i.id}, -1)">−</button>
          ${i.cantidad}
          <button onclick="cambiarCantidad(${i.id}, 1)">+</button>
        </p>
        <button onclick="eliminarDelCarrito(${i.id})">Eliminar</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((s, it) => s + ((it.price || 0) * (it.cantidad || 1)), 0);

  document.getElementById('root').innerHTML = `
    <h2>Carrito</h2>
    <div>${items}</div>
    <div style="margin-top:12px"><strong>Total: $${total.toFixed(2)}</strong></div>
    <div style="margin-top:12px">
      <button class="btn" onclick="finalizarCompra()">Finalizar compra</button>
    </div>
  `;
}

function cambiarCantidad(id, delta) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const idx = cart.findIndex(i => i.id === id);
  if (idx < 0) return;
  cart[idx].cantidad = Math.max(1, (cart[idx].cantidad || 1) + delta);
  localStorage.setItem('cart', JSON.stringify(cart));
  VerCarrito();
}

function eliminarDelCarrito(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  VerCarrito();
}

function finalizarCompra() {
  // Simulación
  alert('Compra simulada realizada. Gracias 😊');
  localStorage.removeItem('cart');
  General();
}
