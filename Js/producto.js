// producto.js — detalle, favoritos, agregar al carrito

function toggleFavorito(prodObj) {
  const favs = JSON.parse(localStorage.getItem("favs")) || [];
  const existe = favs.some((f) => f.id === prodObj.id);

  if (existe) {
    const nuevo = favs.filter((f) => f.id !== prodObj.id);
    localStorage.setItem("favs", JSON.stringify(nuevo));
  } else {
    favs.push(prodObj);
    localStorage.setItem("favs", JSON.stringify(favs));
  }

  const btn = document.getElementById("btn-fav");
  if (btn)
    btn.textContent = existe
      ? "❤️ Agregar a favoritos"
      : "💔 Quitar de favoritos";
}

// ✅ Detalle del producto
async function Detalle(id) {
  document.getElementById("root").innerHTML =
    '<p class="cargando">Cargando detalle...</p>';

  const p = await obtenerProductoPorId(id);

  if (!p) {
    document.getElementById("root").innerHTML =
      "<p>Error cargando producto.</p>";
    return;
  }

  // ✅ Verificar si tiene imágenes reales en la API
  let img = "";
  if (p.images && Array.isArray(p.images) && p.images.length > 0) {
    img = p.images[0];
  } else if (p.thumbnail) {
    img = p.thumbnail;
  } else {
    img = "https://placehold.co/400x300?text=Sin+imagen";
  }

  const enFav =
    (JSON.parse(localStorage.getItem("favs")) || []).some(
      (f) => f.id === p.id
    );

  // ✅ Render del detalle del producto
  document.getElementById("root").innerHTML = `
    <section class="detalle">
      <img src="${img}" alt="${p.title}">
      <div class="info">
        <button class="btn" onclick="Home()">← Volver</button>
        <h2>${p.title}</h2>
        <div class="precio">$${p.price ?? "—"}</div>
        <p>${p.description || "Sin descripción"}</p>
        <p><strong>Categoría:</strong> ${p.category || "—"}</p>
        <p><strong>Marca:</strong> ${p.brand || "—"}</p>
        <p><strong>Stock disponible:</strong> ${p.stock ?? "—"}</p>
        <div style="margin-top:12px">
          <button id="btn-fav" class="btn" onclick='toggleFavorito(${JSON.stringify(
            p
          )})'>
            ${enFav ? "💔 Quitar de favoritos" : "❤️ Agregar a favoritos"}
          </button>
          <button class="btn" style="background:#28a745;margin-left:8px" onclick='agregarAlCarrito(${JSON.stringify(
            p
          )})'>
            🛒 Agregar al carrito
          </button>
        </div>
      </div>
    </section>
  `;
}

// ✅ Agregar producto al carrito
function agregarAlCarrito(prod) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const idx = cart.findIndex((i) => i.id === prod.id);

  if (idx >= 0) {
    cart[idx].cantidad = (cart[idx].cantidad || 1) + 1;
  } else {
    const nuevo = { ...prod, cantidad: 1 };
    cart.push(nuevo);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Producto agregado al carrito");
}
