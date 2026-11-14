const APP_VERSION = 'v1.1.0';
const CLAVE = 'inventario';
const STOCK_BAJO = 5;

function cargar() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || []; }
  catch (e) { return []; }
}
let productos = cargar();

function guardar() {
  localStorage.setItem(CLAVE, JSON.stringify(productos));
}

function mostrar() {
  const filtro = document.getElementById('buscar').value.trim().toLowerCase();
  const lista = document.getElementById('lista');
  lista.innerHTML = '';
  productos.forEach((p, i) => {
    if (filtro && !String(p.nombre).toLowerCase().includes(filtro)) return;
    const li = document.createElement('li');
    if (p.cantidad <= STOCK_BAJO) li.classList.add('bajo');
    const txt = document.createElement('span');
    txt.textContent = p.nombre + ' - ' + p.cantidad + ' pzas - $' + p.precio;
    if (p.cantidad <= STOCK_BAJO) {
      const et = document.createElement('span');
      et.className = 'etiqueta';
      et.textContent = 'Stock bajo';
      txt.appendChild(et);
    }
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.addEventListener('click', () => {
      productos.splice(i, 1);
      guardar();
      mostrar();
    });
    li.appendChild(txt);
    li.appendChild(btn);
    lista.appendChild(li);
  });
}

document.getElementById('form-producto').addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const cantidad = Number(document.getElementById('cantidad').value);
  const precio = Number(document.getElementById('precio').value);
  const msg = document.getElementById('mensaje');
  // Corrección: se validan los datos antes de guardar
  if (!nombre) { msg.textContent = 'Escribe el nombre del producto.'; return; }
  if (!Number.isFinite(cantidad) || cantidad < 0) { msg.textContent = 'La cantidad no puede ser negativa.'; return; }
  if (!Number.isFinite(precio) || precio < 0) { msg.textContent = 'El precio no puede ser negativo.'; return; }
  msg.textContent = '';
  productos.push({ nombre: nombre, cantidad: cantidad, precio: precio });
  guardar();
  mostrar();
  e.target.reset();
});

// Nuevo: buscador
document.getElementById('buscar').addEventListener('input', mostrar);

document.getElementById('version').textContent = APP_VERSION;
mostrar();

// Nuevo: aviso de nueva versión
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then((reg) => {
    const aviso = document.getElementById('aviso-version');
    function ofrecer(sw) {
      aviso.hidden = false;
      document.getElementById('btn-actualizar').onclick = () => sw.postMessage({ type: 'SKIP_WAITING' });
    }
    if (reg.waiting && navigator.serviceWorker.controller) ofrecer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const nuevo = reg.installing;
      nuevo.addEventListener('statechange', () => {
        if (nuevo.state === 'installed' && navigator.serviceWorker.controller) ofrecer(nuevo);
      });
    });
  });
  let recargado = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (recargado) return;
    recargado = true;
    location.reload();
  });
}
