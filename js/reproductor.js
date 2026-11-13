// Reproductor SIMULADO: no hay audio; un temporizador avanza el progreso.
// El estado se guarda en localStorage para que siga sonando al cambiar de pantalla.

const CLAVE = 'sonora-estado';
const estado = Object.assign(
  { contexto: 'mezcla-diaria-1', cola: playlistPorId('mezcla-diaria-1').pistas, i: 0, t: 0, sonando: false, aleatorio: false, volumen: 70, favoritas: [2, 8], guardadas: ['para-estudiar'] },
  leerEstado()
);
let temporizador = null;

function leerEstado() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (_) { return {}; }
}
function guardarEstado() {
  try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (_) {}
}

const pistaActual = () => pistaPorId(estado.cola[estado.i]);
const todos = (sel) => document.querySelectorAll(sel);

// Pinta en todos los elementos enlazados con data-r-* (barra inferior y pantalla Reproductor).
function pintar() {
  const p = pistaActual();
  const pl = playlistPorId(estado.contexto);
  const pct = Math.min(100, (estado.t / p.dur) * 100);
  todos('[data-r-titulo]').forEach((el) => (el.textContent = p.titulo));
  todos('[data-r-artista]').forEach((el) => (el.textContent = p.artista));
  todos('[data-r-album]').forEach((el) => (el.textContent = p.album));
  const origen = pl ? pl.titulo : ({ recientes: 'Recién escuchado', busqueda: 'Tu búsqueda' }[estado.contexto] || 'Sonora');
  todos('[data-r-contexto]').forEach((el) => (el.textContent = origen));
  todos('[data-accion="favorita-actual"]').forEach((b) => b.setAttribute('aria-pressed', estado.favoritas.includes(p.id)));
  todos('[data-r-kbps]').forEach((el) => (el.textContent = `${p.kbps} kbps`));
  todos('[data-r-tiempo]').forEach((el) => (el.textContent = fmt(estado.t)));
  todos('[data-r-duracion]').forEach((el) => (el.textContent = fmt(p.dur)));
  todos('[data-r-relleno]').forEach((el) => (el.style.width = `${pct}%`));
  todos('[data-r-progreso]').forEach((el) => {
    el.setAttribute('aria-valuenow', Math.round(estado.t));
    el.setAttribute('aria-valuemax', p.dur);
    el.setAttribute('aria-valuetext', `${fmt(estado.t)} de ${fmt(p.dur)}`);
  });
  todos('[data-r-portada]').forEach((el) => (el.innerHTML = portada(barrasDe(p), el.dataset.rPortada, el.dataset.rPaso || 'gap-1')));
  todos('[data-accion="alternar"]').forEach((b) => {
    b.setAttribute('aria-label', estado.sonando ? 'Pausar' : 'Reproducir');
    b.querySelector('[data-icono="play"]').classList.toggle('hidden', estado.sonando);
    b.querySelector('[data-icono="pause"]').classList.toggle('hidden', !estado.sonando);
  });
  todos('[data-accion="aleatorio"]').forEach((b) => b.setAttribute('aria-pressed', estado.aleatorio));
  todos('[data-volumen]').forEach((el) => (el.value = estado.volumen));
  todos('[data-fila]').forEach((fila) => {
    if (Number(fila.dataset.fila) === p.id) fila.setAttribute('aria-current', 'true');
    else fila.removeAttribute('aria-current');
  });
  todos('[data-favorita]').forEach((b) => b.setAttribute('aria-pressed', estado.favoritas.includes(Number(b.dataset.favorita))));
  guardarEstado();
}

// Cada pista tiene su propio marcador de portada a partir de su id.
function barrasDe(p) {
  return [0, 1, 2, 3, 4].map((k) => 30 + ((p.id * 37 + k * 23) % 65));
}

function reproducir() {
  clearInterval(temporizador);
  estado.sonando = true;
  temporizador = setInterval(() => {
    estado.t++;
    if (estado.t >= pistaActual().dur) cambiar(1);
    else pintar();
  }, 1000);
  pintar();
}

function pausar() {
  clearInterval(temporizador);
  estado.sonando = false;
  pintar();
}

function cambiar(paso) {
  const n = estado.cola.length;
  estado.i = estado.aleatorio && paso > 0 ? Math.floor(Math.random() * n) : (estado.i + paso + n) % n;
  estado.t = 0;
  pintar();
}

function adelantar(segundos) {
  estado.t = Math.max(0, Math.min(pistaActual().dur - 1, estado.t + segundos));
  pintar();
}

// Reproduce una pista dentro de una cola (playlist o resultados de búsqueda).
function reproducirEn(cola, idPista, contexto) {
  estado.cola = cola;
  estado.contexto = contexto;
  estado.i = Math.max(0, cola.indexOf(idPista));
  estado.t = 0;
  reproducir();
}

document.addEventListener('click', (e) => {
  const accion = e.target.closest('[data-accion]')?.dataset.accion;
  if (accion === 'alternar') estado.sonando ? pausar() : reproducir();
  if (accion === 'siguiente') cambiar(1);
  if (accion === 'anterior') estado.t > 3 ? adelantar(-estado.t) : cambiar(-1);
  if (accion === 'aleatorio') { estado.aleatorio = !estado.aleatorio; pintar(); }
  if (accion === 'favorita-actual') alternarFavorita(pistaActual().id);

  const fav = e.target.closest('[data-favorita]');
  if (fav) alternarFavorita(Number(fav.dataset.favorita));

  const barra = e.target.closest('[data-r-progreso]');
  if (barra) {
    const r = barra.getBoundingClientRect();
    estado.t = Math.floor(((e.clientX - r.left) / r.width) * pistaActual().dur);
    pintar();
  }
});

function alternarFavorita(id) {
  const k = estado.favoritas.indexOf(id);
  k === -1 ? estado.favoritas.push(id) : estado.favoritas.splice(k, 1);
  pintar();
}

// La barra de progreso es un slider accesible: flechas, Inicio y Fin.
document.addEventListener('keydown', (e) => {
  if (!e.target.matches('[data-r-progreso]')) return;
  const pasos = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 30, PageDown: -30 };
  if (e.key in pasos) adelantar(pasos[e.key]);
  else if (e.key === 'Home') adelantar(-estado.t);
  else if (e.key === 'End') adelantar(pistaActual().dur);
  else return;
  e.preventDefault();
});

document.addEventListener('input', (e) => {
  if (e.target.matches('[data-volumen]')) { estado.volumen = Number(e.target.value); guardarEstado(); }
});
