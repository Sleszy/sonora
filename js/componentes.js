// Componentes de Sonora como funciones que regresan HTML.
// Cada receta de clases sale de docs/Tailwind-y-Laravel.md; ningún color es hexadecimal.

const ANILLO = 'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus';

// Iconos de assets/iconos, incrustados para que tomen el color del texto (currentColor).
const TRAZO = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const ICONOS = {
  play:    '<path fill="currentColor" d="M8 5v14l11-7z"/>',
  pause:   '<rect fill="currentColor" x="6" y="5" width="4" height="14" rx="1"/><rect fill="currentColor" x="14" y="5" width="4" height="14" rx="1"/>',
  next:    '<path fill="currentColor" d="M6 5l9 7-9 7z"/><rect fill="currentColor" x="17" y="5" width="2" height="14" rx="1"/>',
  prev:    '<path fill="currentColor" d="M18 5l-9 7 9 7z"/><rect fill="currentColor" x="5" y="5" width="2" height="14" rx="1"/>',
  heart:   `<path ${TRAZO} d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>`,
  search:  `<g ${TRAZO}><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></g>`,
  home:    `<path ${TRAZO} d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>`,
  library: `<path ${TRAZO} d="M5 5v14M10 5v14M15 6l4 13"/>`,
  shuffle: `<path ${TRAZO} d="M4 7h4l8 10h4M4 17h4l3-4M13 11l3-4h4M18 5l2 2-2 2M18 15l2 2-2 2"/>`,
  volume:  `<path ${TRAZO} d="M4 10v4h4l5 4V6L8 10z"/><path ${TRAZO} d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>`,
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const fmtLargo = (s) => (s >= 3600 ? `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min` : `${Math.floor(s / 60)} min`);

function icono(nombre, clases = 'size-6') {
  return `<svg class="${clases} shrink-0" viewBox="0 0 24 24" aria-hidden="true">${ICONOS[nombre]}</svg>`;
}

function marca(clases = 'size-7') {
  return `<svg class="${clases} text-accent" viewBox="0 0 64 64" aria-hidden="true"><g fill="currentColor"><rect x="4" y="32" width="8" height="28" rx="4"/><rect x="16" y="12" width="8" height="48" rx="4"/><rect x="28" y="24" width="8" height="36" rx="4"/><rect x="40" y="4" width="8" height="56" rx="4"/><rect x="52" y="36" width="8" height="24" rx="4"/></g></svg>`;
}

// Marcador de portada: surface-high con las barras ecualizadoras, nunca un degradado.
function portada(barras, clases = 'aspect-square rounded-md p-4', paso = 'gap-1') {
  const b = barras.map((h) => `<i class="flex-1 rounded-pill bg-accent" style="height:${h}%"></i>`).join('');
  return `<div class="flex items-end ${paso} bg-surface-high ${clases}" aria-hidden="true">${b}</div>`;
}

const VARIANTES = {
  primario:   'bg-accent text-on-accent hover:bg-accent-hover',
  secundario: 'border-2 border-line-strong text-ink hover:bg-surface-high',
  fantasma:   'text-ink-muted hover:bg-surface-high hover:text-ink',
};
function boton(texto, variante = 'primario', atributos = '', extra = '') {
  return `<button type="button" ${atributos} class="inline-flex items-center justify-center gap-1 rounded-pill px-6 py-3 text-body-sm font-bold transition duration-[120ms] ease-out disabled:opacity-50 ${VARIANTES[variante]} ${ANILLO} ${extra}">${texto}</button>`;
}

function botonIcono(nombre, etiqueta, atributos = '', extra = 'size-10 text-ink-muted hover:text-ink hover:bg-surface-high') {
  return `<button type="button" aria-label="${esc(etiqueta)}" ${atributos} class="inline-flex items-center justify-center rounded-pill transition duration-[120ms] ease-out ${ANILLO} ${extra}">${icono(nombre)}</button>`;
}

function chip(texto, activo = false, atributos = '') {
  return `<button type="button" aria-pressed="${activo}" ${atributos} class="rounded-pill border-2 border-transparent bg-surface-high px-4 py-2 text-caption uppercase text-ink transition duration-[120ms] ease-out hover:border-line-strong aria-pressed:bg-accent aria-pressed:text-on-accent ${ANILLO}">${esc(texto)}</button>`;
}

// Tarjeta de medio (MediaCard): portada, título, descripción y duración.
function tarjetaMedio(pl) {
  const n = pl.pistas.length;
  return `<a href="playlist.html?id=${pl.id}" data-tipo="${pl.tipo}" class="group block rounded-md bg-surface-raised p-4 transition duration-[120ms] ease-out hover:bg-surface-high hover:shadow-raise ${ANILLO}">
    ${portada(pl.barras, 'mb-4 aspect-square rounded-md p-4 group-hover:bg-surface-base')}
    <p class="truncate text-heading">${esc(pl.titulo)}</p>
    <p class="mt-1 truncate text-body-sm text-ink-muted">${esc(pl.tipo)} · ${esc(pl.descripcion)}</p>
    <p class="mt-2 font-mono text-mono-sm text-ink-muted">${n} canciones · ${fmtLargo(duracionTotal(pl))}</p>
  </a>`;
}

// Fila de canción (SongRow). El botón principal reproduce; el corazón es un control aparte.
function filaCancion(pista, indice, { contexto = '', album = true, favorita = false } = {}) {
  return `<li data-fila="${pista.id}" class="grid grid-cols-[28px_1fr_auto_auto] items-center gap-3 rounded-md px-2 py-3 transition duration-[120ms] ease-out hover:bg-surface-high aria-[current=true]:bg-surface-high ${album ? 'md:grid-cols-[28px_2fr_1fr_auto_auto]' : ''}">
    <span class="text-center font-mono text-mono-sm text-ink-muted" data-indice>${String(indice + 1).padStart(2, '0')}</span>
    <button type="button" data-reproducir="${pista.id}" data-contexto="${contexto}" aria-label="Reproducir ${esc(pista.titulo)} de ${esc(pista.artista)}" class="min-w-0 rounded-md text-left ${ANILLO}">
      <span class="block truncate text-body-sm font-bold text-ink">${esc(pista.titulo)}</span>
      <span class="block truncate text-body-sm text-ink-muted">${esc(pista.artista)}</span>
    </button>
    ${album ? `<span class="hidden truncate text-body-sm text-ink-muted md:block">${esc(pista.album)}</span>` : ''}
    <button type="button" data-favorita="${pista.id}" aria-pressed="${favorita}" aria-label="Me gusta: ${esc(pista.titulo)}" class="inline-flex size-8 items-center justify-center rounded-pill text-ink-muted hover:text-ink aria-pressed:text-ink ${ANILLO}">${icono('heart', 'size-5')}</button>
    <span class="w-12 text-right font-mono text-mono-sm text-ink-muted">${fmt(pista.dur)}</span>
  </li>`;
}
