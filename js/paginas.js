// Contenido de cada pantalla. Todo se arma con los componentes de componentes.js.

const $ = (sel) => document.querySelector(sel);
const listaCanciones = (pistas, contexto, album = true) =>
  `<ol data-cola="${pistas.map((p) => p.id).join(',')}" data-contexto="${contexto}" class="flex flex-col">${pistas
    .map((p, i) => filaCancion(p, i, { contexto, album, favorita: estado.favoritas.includes(p.id) }))
    .join('')}</ol>`;

function saludo() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

// Un clic en una fila reproduce esa canción dentro de la lista donde está.
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-reproducir]');
  if (!b) return;
  const lista = b.closest('[data-cola]');
  reproducirEn(lista.dataset.cola.split(',').map(Number), Number(b.dataset.reproducir), lista.dataset.contexto);
});

const PANTALLAS = {
  inicio() {
    const pl = PLAYLISTS[0];
    $('#saludo').textContent = saludo();
    $('#destacada-portada').innerHTML = portada(pl.barras, 'aspect-square w-full rounded-md p-6', 'gap-2');
    $('#destacada-meta').textContent = `${pl.titulo} · ${pl.pistas.length} canciones · ${fmtLargo(duracionTotal(pl))}`;
    $('#destacada-acciones').innerHTML =
      boton(`${icono('play', 'size-5')} Reproducir`, 'primario', 'data-reproducir-playlist="mezcla-diaria-1"') +
      `<a href="playlist.html?id=${pl.id}" class="inline-flex items-center justify-center rounded-pill border-2 border-line-strong px-6 py-3 text-body-sm font-bold text-ink transition duration-[120ms] ease-out hover:bg-surface-high ${ANILLO}">Ver playlist</a>`;

    const filtros = ['Todo', 'Mezclas', 'Playlists'];
    $('#filtros').innerHTML = filtros.map((f, i) => chip(f, i === 0, `data-filtro="${f}"`)).join('');
    $('#tarjetas').innerHTML = PLAYLISTS.map((p) => `<li>${tarjetaMedio(p)}</li>`).join('');
    $('#filtros').addEventListener('click', (e) => {
      const c = e.target.closest('[data-filtro]');
      if (!c) return;
      $('#filtros').querySelectorAll('[data-filtro]').forEach((x) => x.setAttribute('aria-pressed', x === c));
      const tipo = { Mezclas: 'Mezcla', Playlists: 'Playlist' }[c.dataset.filtro];
      $('#tarjetas').querySelectorAll('li').forEach((li) => (li.hidden = !!tipo && li.firstElementChild.dataset.tipo !== tipo));
    });

    $('#recientes').innerHTML = listaCanciones([6, 2, 9, 3, 7, 12].map(pistaPorId), 'recientes');
  },

  playlist() {
    const pl = playlistPorId(new URLSearchParams(location.search).get('id')) || PLAYLISTS[0];
    document.title = `${pl.titulo} · Sonora`;
    $('#pl-portada').innerHTML = portada(pl.barras, 'aspect-square w-full rounded-md p-6', 'gap-2');
    $('#pl-tipo').textContent = pl.tipo;
    $('#pl-titulo').textContent = pl.titulo;
    $('#pl-descripcion').textContent = pl.descripcion;
    $('#pl-meta').textContent = `${pl.pistas.length} canciones · ${fmtLargo(duracionTotal(pl))}`;
    $('#pl-acciones').innerHTML =
      boton(`${icono('play', 'size-5')} Reproducir`, 'primario', `data-reproducir-playlist="${pl.id}"`) +
      boton('', 'secundario', `data-guardar="${pl.id}"`) +
      botonIcono('shuffle', 'Reproducir en orden aleatorio', `data-aleatorio-playlist="${pl.id}"`, 'size-12 text-ink-muted hover:text-ink hover:bg-surface-high');
    $('#pl-canciones').innerHTML = listaCanciones(pistasDe(pl), pl.id);
    pintarGuardar();
  },

  reproductor() {
    const extra = 'size-12 text-ink-muted hover:text-ink hover:bg-surface-high aria-pressed:bg-surface-high aria-pressed:text-ink';
    $('#r-progreso').innerHTML = `<span data-r-tiempo>00:00</span>${barraProgreso('h-1.5')}<span data-r-duracion>00:00</span>`;
    $('#r-controles').innerHTML =
      botonIcono('shuffle', 'Orden aleatorio', 'data-accion="aleatorio" aria-pressed="false"', extra) +
      botonIcono('prev', 'Anterior', 'data-accion="anterior"', extra) +
      botonAlternar('size-16', 'size-8') +
      botonIcono('next', 'Siguiente', 'data-accion="siguiente"', extra) +
      botonIcono('heart', 'Me gusta la canción actual', 'data-accion="favorita-actual" aria-pressed="false"', extra);
    $('#r-icono-volumen').innerHTML = icono('volume', 'size-5');
    $('#cola').innerHTML = listaCanciones(estado.cola.map(pistaPorId), estado.contexto, false);
  },

  buscar() {
    const campo = $('#campo-busqueda');
    const tipos = ['Todo', 'Canciones', 'Playlists'];
    let tipo = 'Todo';
    $('#tipos').innerHTML = tipos.map((t, i) => chip(t, i === 0, `data-tipo-busqueda="${t}"`)).join('');

    const pintarResultados = () => {
      const q = campo.value.trim().toLowerCase();
      const coincide = (...textos) => textos.some((t) => t.toLowerCase().includes(q));
      const canciones = PISTAS.filter((p) => coincide(p.titulo, p.artista, p.album));
      const listas = PLAYLISTS.filter((p) => coincide(p.titulo, p.descripcion));
      const verCanciones = tipo !== 'Playlists' && canciones.length;
      const verListas = tipo !== 'Canciones' && listas.length;
      const total = (tipo !== 'Playlists' ? canciones.length : 0) + (tipo !== 'Canciones' ? listas.length : 0);

      $('#resumen').textContent = q ? `${total} resultados para "${campo.value.trim()}"` : 'Explora todo el catálogo';
      $('#res-canciones').hidden = !verCanciones;
      $('#res-playlists').hidden = !verListas;
      $('#sin-resultados').hidden = total > 0;
      $('#lista-canciones').innerHTML = verCanciones ? listaCanciones(canciones, 'busqueda') : '';
      $('#lista-playlists').innerHTML = verListas ? listas.map((p) => `<li>${tarjetaMedio(p)}</li>`).join('') : '';
      pintar();
    };

    campo.addEventListener('input', pintarResultados);
    $('#tipos').addEventListener('click', (e) => {
      const c = e.target.closest('[data-tipo-busqueda]');
      if (!c) return;
      tipo = c.dataset.tipoBusqueda;
      $('#tipos').querySelectorAll('[data-tipo-busqueda]').forEach((x) => x.setAttribute('aria-pressed', x === c));
      pintarResultados();
    });
    pintarResultados();
  },
};

function pintarGuardar() {
  document.querySelectorAll('[data-guardar]').forEach((b) => {
    const guardada = estado.guardadas.includes(b.dataset.guardar);
    b.setAttribute('aria-pressed', guardada);
    // El estado guardado lleva palabra e icono, no solo color.
    b.innerHTML = guardada
      ? `<span class="inline-flex items-center gap-1 text-success">${icono('heart', 'size-5 [&_path]:fill-current')} Guardada en tu biblioteca</span>`
      : 'Guardar en tu biblioteca';
  });
}

document.addEventListener('click', (e) => {
  const rp = e.target.closest('[data-reproducir-playlist]');
  if (rp) {
    const pl = playlistPorId(rp.dataset.reproducirPlaylist);
    estado.aleatorio = false;
    reproducirEn(pl.pistas, pl.pistas[0], pl.id);
  }
  const ra = e.target.closest('[data-aleatorio-playlist]');
  if (ra) {
    const pl = playlistPorId(ra.dataset.aleatorioPlaylist);
    estado.aleatorio = true;
    reproducirEn(pl.pistas, pl.pistas[Math.floor(Math.random() * pl.pistas.length)], pl.id);
  }
  const g = e.target.closest('[data-guardar]');
  if (g) {
    const k = estado.guardadas.indexOf(g.dataset.guardar);
    k === -1 ? estado.guardadas.push(g.dataset.guardar) : estado.guardadas.splice(k, 1);
    guardarEstado();
    pintarGuardar();
  }
});

PANTALLAS[PAGINA]();
pintar();
if (estado.sonando) reproducir();
