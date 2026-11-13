// Datos de ejemplo inventados: artistas, canciones y playlists no existen.
// dur = duración en segundos; kbps = tasa de bits que se muestra en mono.
const PISTAS = [
  { id: 1,  titulo: 'Andén mojado',        artista: 'Bruma Clara',   album: 'Planta baja',     dur: 241, kbps: 320 },
  { id: 2,  titulo: 'Azul de madrugada',   artista: 'Orilla Norte',  album: 'Faro apagado',    dur: 232, kbps: 320 },
  { id: 3,  titulo: 'Cuerdas de papel',    artista: 'Taller Siete',  album: 'Sesiones',        dur: 307, kbps: 256 },
  { id: 4,  titulo: 'Camino de grava',     artista: 'Valle Hondo',   album: 'Tierra adentro',  dur: 209, kbps: 320 },
  { id: 5,  titulo: 'Sin prisa',           artista: 'Orilla Norte',  album: 'Faro apagado',    dur: 284, kbps: 320 },
  { id: 6,  titulo: 'Ciudad dormida',      artista: 'Bruma Clara',   album: 'Planta baja',     dur: 258, kbps: 320 },
  { id: 7,  titulo: 'Polvo de faro',       artista: 'Cielo Raso',    album: 'Estaciones',      dur: 198, kbps: 256 },
  { id: 8,  titulo: 'Calor de marzo',      artista: 'Cielo Raso',    album: 'Estaciones',      dur: 225, kbps: 320 },
  { id: 9,  titulo: 'Ventana abierta',     artista: 'Valle Hondo',   album: 'Tierra adentro',  dur: 276, kbps: 320 },
  { id: 10, titulo: 'Luz de tarde',        artista: 'Taller Siete',  album: 'Sesiones',        dur: 219, kbps: 256 },
  { id: 11, titulo: 'Última parada',       artista: 'Bruma Clara',   album: 'Planta baja',     dur: 331, kbps: 320 },
  { id: 12, titulo: 'Marea lenta',         artista: 'Orilla Norte',  album: 'Faro apagado',    dur: 263, kbps: 320 },
];

// barras = alturas (%) de las cinco barras del marcador de portada.
const PLAYLISTS = [
  { id: 'mezcla-diaria-1', tipo: 'Mezcla',   titulo: 'Mezcla diaria 1', descripcion: 'Bruma Clara, Orilla Norte, Cielo Raso y más.', barras: [40, 70, 55, 90, 35], pistas: [1, 2, 8, 6, 5, 12, 7, 11] },
  { id: 'mezcla-diaria-2', tipo: 'Mezcla',   titulo: 'Mezcla diaria 2', descripcion: 'Valle Hondo, Taller Siete y más.',              barras: [80, 45, 65, 30, 75], pistas: [4, 3, 9, 10, 7, 1, 8, 2] },
  { id: 'para-estudiar',   tipo: 'Playlist', titulo: 'Para estudiar',   descripcion: 'Música tranquila para concentrarte.',          barras: [50, 85, 40, 70, 60], pistas: [3, 10, 5, 12, 9, 2, 6, 4] },
  { id: 'camino-a-casa',   tipo: 'Playlist', titulo: 'Camino a casa',   descripcion: 'Para el regreso, sin prisa.',                   barras: [30, 60, 90, 50, 80], pistas: [6, 11, 1, 7, 8, 4, 9, 3] },
  { id: 'domingo-lento',   tipo: 'Playlist', titulo: 'Domingo lento',   descripcion: 'Canciones suaves para el fin de semana.',      barras: [65, 35, 75, 45, 95], pistas: [12, 5, 9, 2, 10, 3, 1, 6] },
];

const pistaPorId = (id) => PISTAS.find((p) => p.id === id);
const playlistPorId = (id) => PLAYLISTS.find((p) => p.id === id);
const pistasDe = (playlist) => playlist.pistas.map(pistaPorId);
const duracionTotal = (playlist) => pistasDe(playlist).reduce((s, p) => s + p.dur, 0);
