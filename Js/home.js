// home.js — listado, búsqueda, filtros, paginación
let productosCache = [];
let paginaActual = 1;
let totalPaginas = 1;
let ultimoFiltro = {};

// ✅ Función para crear las tarjetas de producto
function crearTarjetaProducto(p) {
  // Verificar si la API trae imagen
  let img = "";
  if (p.images && Array.isArray(p.images) && p.images.length > 0) {
    img = p.images[0];
  } else if (p.thumbnail) {
    img = p.thumbnail;
  } else {
    // Imagen de respaldo si no hay ninguna
    img = "https://placehold.co/300x200?text=Sin+imagen";
  }

  return `
    <div class="producto" onclick="Detalle(${p.id})">
      <img src="${img}" alt="${p.title || p.name}">
      <h3>${p.title || p.name}</h3>
      <div class="precio">$${p.price ?? "—"}</div>
    </div>
  `;
}

// ✅ Cargar productos (Home principal)
async function Home(params = {}) {
  document.getElementById("root").innerHTML = '<p class="cargando">Cargando productos...</p>';

  paginaActual = params.page || 1;
  const limit = params.limit || 12;

  ultimoFiltro = { ...params, page: paginaActual, limit };

  const resp = await obtenerProductos(ultimoFiltro);
  productosCache = resp.data || [];
  const pagination = resp.pagination || null;

  if (pagination) {
    paginaActual = pagination.page || paginaActual;
    if (pagination.total && pagination.limit) {
      totalPaginas = Math.ceil(pagination.total / pagination.limit);
    } else {
      totalPaginas = 1;
    }
  } else {
    totalPaginas = 1;
  }

  renderHome();
}

// ✅ Renderizar página principal
async function renderHome() {
  const root = document.getElementById("root");

  root.innerHTML = `
    <section class="buscador">
      <input id="input-buscar" placeholder="Buscar productos por nombre o descripción..." />
      <div>
        <select id="select-limit">
          <option value="8">8</option>
          <option value="12" selected>12</option>
          <option value="24">24</option>
        </select>
      </div>
    </section>
    <section class="categorias" id="lista-categorias"></section>
    <section class="grid" id="lista-productos"></section>
    <section id="paginacion" class="small"></section>
  `;

  // ✅ Cargar categorías
  const cats = await obtenerCategorias();
  const catCont = document.getElementById("lista-categorias");
  catCont.innerHTML =
    `<button onclick="filtrarCategoria('')">Todas</button>` +
    cats.map((c) => `<button onclick="filtrarCategoria('${c}')">${c}</button>`).join("");

  // ✅ Listeners para buscar y cambiar cantidad por página
  document.getElementById("input-buscar").addEventListener("input", (e) => {
    const q = e.target.value;
    debounce(() => Home({ ...ultimoFiltro, page: 1, search: q, searchFields: "title,description" }), 400);
  });

  document.getElementById("select-limit").addEventListener("change", (e) => {
    const lim = parseInt(e.target.value, 10) || 12;
    Home({ ...ultimoFiltro, page: 1, limit: lim });
  });

  renderProductosGrid(productosCache);
  renderPaginacion();
}

// ✅ Renderizar grilla de productos
function renderProductosGrid(lista) {
  const cont = document.getElementById("lista-productos");
  if (!lista || lista.length === 0) {
    cont.innerHTML = "<p>No hay productos para mostrar.</p>";
    return;
  }
  cont.innerHTML = lista.map(crearTarjetaProducto).join("");
}

// ✅ Paginación
function renderPaginacion() {
  const pag = document.getElementById("paginacion");
  const prevDisabled = paginaActual <= 1 ? "disabled" : "";
  const nextDisabled = paginaActual >= totalPaginas ? "disabled" : "";
  pag.innerHTML = `
    <div>
      <button ${prevDisabled} onclick="cambiarPagina(${paginaActual - 1})">Anterior</button>
      <span> Página ${paginaActual} de ${totalPaginas} </span>
      <button ${nextDisabled} onclick="cambiarPagina(${paginaActual + 1})">Siguiente</button>
    </div>
  `;
}

function cambiarPagina(n) {
  if (n < 1 || n > totalPaginas) return;
  Home({ ...ultimoFiltro, page: n });
}

function filtrarCategoria(cat) {
  Home({ ...ultimoFiltro, page: 1, category: cat });
}

// ✅ Función debounce (retrasa la búsqueda para no sobrecargar la API)
let _debT;
function debounce(fn, ms = 300) {
  clearTimeout(_debT);
  _debT = setTimeout(fn, ms);
}

// ✅ Ejecutar al cargar la página
function General() {
  Home({ page: 1, limit: 12 });
}
