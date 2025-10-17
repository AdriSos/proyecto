var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var productos = [];
var carrito = [];
var usuario = null;
var mainContent = document.getElementById("main-content");
var verCatalogoBtn = document.getElementById("ver-catalogo");
var verCarritoBtn = document.getElementById("ver-carrito");
var usuarioInfo = document.getElementById("usuario-info");
var modalLogin = document.getElementById("modal-login");
var btnLogin = document.getElementById("btn-login");
var btnCerrar = document.getElementById("btn-cerrar");
var usuarioNombreInput = document.getElementById("usuario-nombre");
// Fetch productos
function cargarProductos() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("products.json")];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    productos = _a.sent();
                    mostrarCatalogo();
                    return [2 /*return*/];
            }
        });
    });
}
// Mostrar catálogo
function mostrarCatalogo() {
    mainContent.innerHTML = "";
    productos.forEach(function (p) {
        var div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = "\n      <img src=\"".concat(p.imagen, "\" alt=\"").concat(p.nombre, "\">\n      <h3>").concat(p.nombre, "</h3>\n      <p>$").concat(p.precio, "</p>\n      <button class=\"agregar\">Agregar al carrito</button>\n    ");
        var btnAgregar = div.querySelector("button");
        btnAgregar.addEventListener("click", function () { return agregarAlCarrito(p); });
        mainContent.appendChild(div);
    });
}
// Agregar al carrito
function agregarAlCarrito(producto) {
    var item = carrito.find(function (i) { return i.producto.id === producto.id; });
    if (item) {
        item.cantidad++;
    }
    else {
        carrito.push({ producto: producto, cantidad: 1 });
    }
    alert("".concat(producto.nombre, " agregado al carrito"));
}
// Mostrar carrito
function mostrarCarrito() {
    mainContent.innerHTML = "";
    if (carrito.length === 0) {
        mainContent.innerHTML = "<p>El carrito está vacío</p>";
        return;
    }
    carrito.forEach(function (i) {
        var div = document.createElement("div");
        div.className = "carrito-item";
        div.innerHTML = "\n      <img src=\"".concat(i.producto.imagen, "\" alt=\"").concat(i.producto.nombre, "\">\n      <h3>").concat(i.producto.nombre, "</h3>\n      <p>$").concat(i.producto.precio, "</p>\n      <p>Cantidad: ").concat(i.cantidad, "</p>\n      <button class=\"incrementar\">+</button>\n      <button class=\"decrementar\">-</button>\n      <button class=\"eliminar\">Eliminar</button>\n    ");
        div.querySelector(".incrementar").addEventListener("click", function () {
            i.cantidad++;
            mostrarCarrito();
        });
        div.querySelector(".decrementar").addEventListener("click", function () {
            i.cantidad--;
            if (i.cantidad <= 0)
                eliminarDelCarrito(i.producto.id);
            mostrarCarrito();
        });
        div.querySelector(".eliminar").addEventListener("click", function () {
            eliminarDelCarrito(i.producto.id);
            mostrarCarrito();
        });
        mainContent.appendChild(div);
    });
    var total = carrito.reduce(function (sum, i) { return sum + i.producto.precio * i.cantidad; }, 0);
    var totalDiv = document.createElement("div");
    totalDiv.innerHTML = "<h3>Total: $".concat(total, "</h3>\n  <button class=\"comprar\">Comprar</button>");
    totalDiv.querySelector(".comprar").addEventListener("click", comprar);
    mainContent.appendChild(totalDiv);
}
// Eliminar producto
function eliminarDelCarrito(id) {
    carrito = carrito.filter(function (i) { return i.producto.id !== id; });
}
// Comprar
function comprar() {
    if (!usuario) {
        mostrarModalLogin();
        return;
    }
    alert("Compra realizada por ".concat(usuario.nombre, ". Total: $").concat(carrito.reduce(function (sum, i) { return sum + i.producto.precio * i.cantidad; }, 0)));
    carrito = [];
    mostrarCatalogo();
}
// Modal login
function mostrarModalLogin() {
    modalLogin.classList.remove("hidden");
}
btnLogin.addEventListener("click", function () {
    var nombre = usuarioNombreInput.value.trim();
    if (nombre) {
        usuario = { nombre: nombre };
        usuarioInfo.textContent = "Hola, ".concat(usuario.nombre);
        modalLogin.classList.add("hidden");
        mostrarCarrito();
    }
});
btnCerrar.addEventListener("click", function () { return modalLogin.classList.add("hidden"); });
// Botones navegación
verCatalogoBtn.addEventListener("click", mostrarCatalogo);
verCarritoBtn.addEventListener("click", mostrarCarrito);
// Inicializar
cargarProductos();
