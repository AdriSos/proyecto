interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

interface Usuario {
  nombre: string;
}

interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

let productos: Producto[] = [];
let carrito: CarritoItem[] = [];
let usuario: Usuario | null = null;

const mainContent = document.getElementById("main-content")!;
const verCatalogoBtn = document.getElementById("ver-catalogo")!;
const verCarritoBtn = document.getElementById("ver-carrito")!;
const usuarioInfo = document.getElementById("usuario-info")!;
const modalLogin = document.getElementById("modal-login")!;
const btnLogin = document.getElementById("btn-login")!;
const btnCerrar = document.getElementById("btn-cerrar")!;
const usuarioNombreInput = document.getElementById("usuario-nombre") as HTMLInputElement;

async function cargarProductos() {
  const res = await fetch("products.json");
  productos = await res.json();
  mostrarCatalogo();
}

// Mostrar catálogo
function mostrarCatalogo() {
  mainContent.innerHTML = "";
  productos.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button class="agregar">Agregar al carrito</button>
    `;
    div.querySelector("button")!.addEventListener("click", () => agregarAlCarrito(p));
    mainContent.appendChild(div);
  });
}

// Agregar al carrito
function agregarAlCarrito(producto: Producto) {
  const item = carrito.find(i => i.producto.id === producto.id);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ producto, cantidad: 1 });
  }
  alert(`${producto.nombre} agregado al carrito`);
}

// Mostrar carrito
function mostrarCarrito() {
  mainContent.innerHTML = "";
  if (carrito.length === 0) {
    mainContent.innerHTML = "<p>El carrito está vacío</p>";
    return;
  }

  carrito.forEach(i => {
    const div = document.createElement("div");
    div.className = "carrito-item";
    div.innerHTML = `
      <img src="${i.producto.imagen}" alt="${i.producto.nombre}">
      <h3>${i.producto.nombre}</h3>
      <p>Precio: $${i.producto.precio}</p>
      <p>Cantidad: ${i.cantidad}</p>
      <button class="incrementar">+</button>
      <button class="decrementar">-</button>
      <button class="eliminar">Eliminar</button>
    `;
    div.querySelector(".incrementar")!.addEventListener("click", () => {
      i.cantidad++;
      mostrarCarrito();
    });
    div.querySelector(".decrementar")!.addEventListener("click", () => {
      i.cantidad--;
      if (i.cantidad <= 0) eliminarDelCarrito(i.producto.id);
      mostrarCarrito();
    });
    div.querySelector(".eliminar")!.addEventListener("click", () => {
      eliminarDelCarrito(i.producto.id);
      mostrarCarrito();
    });
    mainContent.appendChild(div);
  });

  const total = carrito.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `
    <h3>Total: $${total}</h3>
    ${usuario ? '<button class="generar-ticket">Generar Ticket</button>' : '<button class="comprar">Iniciar sesión para comprar</button>'}
  `;

  const btn = totalDiv.querySelector(usuario ? ".generar-ticket" : ".comprar")!;
  btn.addEventListener("click", usuario ? generarTicket : mostrarModalLogin);
  mainContent.appendChild(totalDiv);
}

// Eliminar producto
function eliminarDelCarrito(id: number) {
  carrito = carrito.filter(i => i.producto.id !== id);
}

// Generar Ticket
function generarTicket() {
  if (!usuario || carrito.length === 0) return;

  const fecha = new Date().toLocaleString();
  const total = carrito.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);

  mainContent.innerHTML = `
    <div class="ticket">
      <h2>🧾 Ticket de Compra</h2>
      <p><strong>Tienda:</strong> Tienda Deportiva</p>
      <p><strong>Cliente:</strong> ${usuario.nombre}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <hr>
      ${carrito.map(i => `
        <p>${i.producto.nombre} x${i.cantidad} — $${i.producto.precio} c/u</p>
      `).join("")}
      <hr>
      <h3>Total a pagar: $${total}</h3>
      <button id="btn-volver">Volver al catálogo</button>
    </div>
  `;

  document.getElementById("btn-volver")!.addEventListener("click", () => {
    carrito = [];
    mostrarCatalogo();
  });
}

// Modal Login
function mostrarModalLogin() {
  modalLogin.classList.remove("hidden");
}

btnLogin.addEventListener("click", () => {
  const nombre = usuarioNombreInput.value.trim();
  if (nombre) {
    usuario = { nombre };
    usuarioInfo.textContent = `Hola, ${usuario.nombre}`;
    modalLogin.classList.add("hidden");
    mostrarCarrito();
  }
});

btnCerrar.addEventListener("click", () => modalLogin.classList.add("hidden"));

verCatalogoBtn.addEventListener("click", mostrarCatalogo);
verCarritoBtn.addEventListener("click", mostrarCarrito);

cargarProductos();
