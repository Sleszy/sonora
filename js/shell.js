// Estructura común a todas las pantallas: navegación lateral, cabecera y navegación móvil,
// y la barra del reproductor. Cada página indica cuál es con <body data-pagina="...">.

const PAGINA = document.body.dataset.pagina;
const ENLACES = [
  { id: 'inicio',      href: 'index.html',       texto: 'Inicio',      icono: 'home' },
  { id: 'buscar',      href: 'buscar.html',      texto: 'Buscar',      icono: 'search' },
  { id: 'reproductor', href: 'reproductor.html', texto: 'Reproductor', icono: 'library' },
];
const CLASE_ENLACE = `flex items-center gap-3 rounded-md p-3 text-body-sm font-bold text-ink-muted transition duration-[120ms] ease-out hover:bg-surface-high hover:text-ink aria-[current=page]:bg-surface-high aria-[current=page]:text-ink ${ANILLO}`;
const actual = (id) => (id === PAGINA ? 'aria-current="page"' : '');

function botonTema(extra = '') {
  return boton('Cambiar a tema claro', 'fantasma', 'data-tema', extra);
}

function navegacionLateral() {
  const idPlaylist = new URLSearchParams(location.search).get('id');
  const playlists = PLAYLISTS.map((pl) => `<li><a href="playlist.html?id=${pl.id}" ${PAGINA === 'playlist' && (idPlaylist || PLAYLISTS[0].id) === pl.id ? 'aria-current="page"' : ''} class="${CLASE_ENLACE} py-2 font-medium">${esc(pl.titulo)}</a></li>`).join('');
  return `<nav aria-label="Principal" class="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col bg-surface-raised px-4 pb-32 pt-6 lg:flex">
    <a href="index.html" class="mb-6 flex items-center gap-2 rounded-md px-3 text-heading font-extrabold tracking-tight ${ANILLO}">${marca()} Sonora</a>
    <ul class="flex flex-col gap-1">${ENLACES.map((e) => `<li><a href="${e.href}" ${actual(e.id)} class="${CLASE_ENLACE}">${icono(e.icono)} ${e.texto}</a></li>`).join('')}</ul>
    <h2 class="mb-2 mt-8 px-3 text-caption uppercase text-ink-muted">Tus playlists</h2>
    <ul class="flex flex-col gap-1 overflow-y-auto">${playlists}</ul>
    <div class="mt-auto pt-4">${botonTema('w-full')}</div>
  </nav>`;
}

function cabeceraMovil() {
  return `<header class="flex items-center justify-between border-b border-line px-4 py-3 lg:hidden">
    <a href="index.html" class="flex items-center gap-2 rounded-md text-heading font-extrabold tracking-tight ${ANILLO}">${marca('size-6')} Sonora</a>
    ${botonTema('px-4 py-2')}
  </header>`;
}

function navegacionMovil() {
  return `<nav aria-label="Principal móvil" class="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-3 border-t border-line bg-surface-raised lg:hidden">
    ${ENLACES.map((e) => `<a href="${e.href}" ${actual(e.id)} class="flex flex-col items-center justify-center gap-1 text-caption text-ink-muted aria-[current=page]:text-ink ${ANILLO} focus-visible:outline-offset-[-3px]">${icono(e.icono, 'size-5')}${e.texto}</a>`).join('')}
  </nav>`;
}

function botonAlternar(tam = 'size-10', icono_ = 'size-6') {
  return `<button type="button" data-accion="alternar" aria-label="Reproducir" class="inline-flex ${tam} items-center justify-center rounded-pill bg-accent text-on-accent transition duration-[120ms] ease-out hover:bg-accent-hover ${ANILLO}">
    <span data-icono="play">${icono('play', icono_)}</span><span data-icono="pause" class="hidden">${icono('pause', icono_)}</span>
  </button>`;
}

function barraProgreso(alto = 'h-1') {
  return `<div data-r-progreso role="slider" tabindex="0" aria-label="Progreso de la canción" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0"
      class="group relative flex h-4 flex-1 cursor-pointer items-center rounded-pill ${ANILLO}">
    <div class="${alto} w-full rounded-pill bg-surface-high"><div data-r-relleno class="${alto} rounded-pill bg-accent" style="width:0%"></div></div>
  </div>`;
}

function barraReproductor() {
  return `<section aria-label="Reproductor" class="fixed inset-x-0 bottom-16 z-20 border-t border-line bg-surface-raised px-4 py-2 lg:bottom-0 lg:py-3">
    <div class="grid grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[1fr_2fr_1fr]">
      <a href="reproductor.html" aria-label="Abrir el reproductor" class="flex min-w-0 items-center gap-3 rounded-md ${ANILLO}">
        <div data-r-portada="size-12 rounded-sm p-2" data-r-paso="gap-0.5" class="size-12 shrink-0"></div>
        <div class="min-w-0"><p data-r-titulo class="truncate text-body-sm font-bold"></p><p data-r-artista class="truncate text-body-sm text-ink-muted"></p></div>
      </a>
      <div class="flex flex-col items-center gap-1">
        <div class="flex items-center gap-2 lg:gap-4">
          <span class="hidden lg:inline-flex">${botonIcono('shuffle', 'Orden aleatorio', 'data-accion="aleatorio" aria-pressed="false"', 'size-10 text-ink-muted hover:text-ink hover:bg-surface-high aria-pressed:bg-surface-high aria-pressed:text-ink')}</span>
          <span class="hidden lg:inline-flex">${botonIcono('prev', 'Anterior', 'data-accion="anterior"')}</span>
          ${botonAlternar()}
          <span class="hidden lg:inline-flex">${botonIcono('next', 'Siguiente', 'data-accion="siguiente"')}</span>
        </div>
        <div class="hidden w-full items-center gap-2 font-mono text-mono-sm text-ink-muted lg:flex">
          <span data-r-tiempo>00:00</span>${barraProgreso()}<span data-r-duracion>00:00</span>
        </div>
      </div>
      <div class="hidden items-center justify-end gap-2 lg:flex">
        ${botonIcono('heart', 'Me gusta la canción actual', 'data-accion="favorita-actual" aria-pressed="false"', 'size-10 text-ink-muted hover:text-ink hover:bg-surface-high aria-pressed:text-ink')}
        <label class="flex items-center gap-2 text-ink-muted">${icono('volume', 'size-5')}<span class="sr-only">Volumen</span>
          <input data-volumen type="range" min="0" max="100" value="70" class="w-28 accent-accent ${ANILLO}"></label>
      </div>
    </div>
  </section>`;
}

function pintarTema() {
  const claro = document.documentElement.dataset.theme === 'light';
  document.querySelectorAll('[data-tema]').forEach((b) => (b.textContent = claro ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'));
}

// Después del enlace "Saltar al contenido", que debe ser lo primero al usar el tabulador.
document.querySelector('[data-saltar]').insertAdjacentHTML('afterend', navegacionLateral() + cabeceraMovil());
document.body.insertAdjacentHTML('beforeend', (PAGINA === 'reproductor' ? '' : barraReproductor()) + navegacionMovil());
pintarTema();

document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-tema]')) return;
  const raiz = document.documentElement;
  raiz.dataset.theme = raiz.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('sonora-tema', raiz.dataset.theme); } catch (_) {}
  pintarTema();
});
