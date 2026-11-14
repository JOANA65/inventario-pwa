const APP_VERSION = 'v1.0.0';
const CLAVE = 'inventario';

function cargar() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || []; }
  catch (e) { return []; }
}
let productos = cargar();

function guardar() {
  localStorage.setItem(CLAVE, JSON.stringify(productos));
}

function mostrar() {
  const lista = document.getElementById('lista');
  lista.innerHTML = '';
  productos.forEach((p, i) => {
    const li = document.createElement('li');
    const txt = document.createElement('span');
    txt.textContent = p.nombre + ' - ' + p.cantidad + ' pzas - $' + p.precio;
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
  productos.push({
    nombre: document.getElementById('nombre').value,
    cantidad: Number(document.getElementById('cantidad').value),
    precio: Number(document.getElementById('precio').value)
  });
  guardar();
  mostrar();
  e.target.reset();
});

document.getElementById('version').textContent = APP_VERSION;
mostrar();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
