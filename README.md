# Sonora

Aplicación web de música hecha con el sistema de diseño **Sonora** (fase 1: HTML + Tailwind CSS).
La reproducción es simulada: no hay audio, un temporizador avanza el progreso.

Autor: Oscar Arturo Preciado Urbina (230111118) · Programación web ISC 7A · ITS José Mario Molina Pasquel y Henríquez, Lagos de Moreno.

**Sitio publicado:** https://sleszy.github.io/sonora/

## Cómo ejecutarlo

No necesita instalar nada. Tailwind CSS v4 se carga desde su CDN oficial y las fuentes desde Google Fonts.

1. Abre una terminal en esta carpeta.
2. Ejecuta un servidor local:
   ```bash
   python3 -m http.server 8000
   ```
3. Abre http://localhost:8000 en el navegador.

También funciona con doble clic en `index.html`, pero con servidor local el estado del reproductor se conserva mejor entre pantallas.

Para ver una pantalla en tema claro sin usar el botón, agrega `?tema=light` a la dirección (por ejemplo `index.html?tema=light`).

## Pantallas

| Pantalla | Archivo | Qué tiene |
| --- | --- | --- |
| Inicio | `index.html` | Cubierta con la mezcla del día, chips para filtrar, tarjetas de playlists y lista "Recién escuchado". |
| Playlist | `playlist.html?id=…` | Portada, datos de la playlist, reproducir, guardar en tu biblioteca, orden aleatorio y lista de canciones. |
| Reproductor | `reproductor.html` | Portada grande, título, barra de progreso controlable con el teclado, controles, volumen y la cola "A continuación". |
| Buscar (extra) | `buscar.html` | Buscador que filtra canciones y playlists mientras escribes, con chips por tipo de resultado. |

También están los otros extras: **tema claro** (botón "Cambiar a tema claro", que se recuerda en el navegador) y **versión móvil de 390 px** con navegación inferior.

## Estructura

```
Sonora/
├── index.html, playlist.html, reproductor.html, buscar.html
├── css/tokens.css          variables de color de ambos temas (copiadas del sistema)
├── js/datos.js             12 canciones y 5 playlists inventadas
├── js/componentes.js       botón, botón de icono, chip, tarjeta de medio, fila de canción, icono, portada, marca
├── js/reproductor.js       reproducción simulada, estado guardado en localStorage
├── js/shell.js             navegación lateral, cabecera y navegación móvil, barra del reproductor, tema
├── js/paginas.js           contenido de cada pantalla
└── assets/                 iconos y marca del sistema de diseño
```

Los tokens se conectan a Tailwind en el bloque `@theme inline` de cada página. Así existen clases como `bg-surface-raised`, `text-ink-muted`, `rounded-pill`, `shadow-raise` y la escala tipográfica `text-display`, `text-title`, `text-heading`, `text-body`, `text-body-sm`, `text-caption`, `text-mono` y `text-mono-sm`. No hay ningún color hexadecimal suelto en las clases.

## Decisiones

**Componentes que reutilicé**

- Las recetas de clases del sistema: botón primario, secundario y fantasma, chip con `aria-pressed`, tarjeta de medio, fila de canción, buscador y barra de progreso. Cada una vive una sola vez como función en `js/componentes.js`, igual que los componentes Blade del ejemplo (`<x-button>`, `<x-chip>`, `<x-media-card>`, `<x-song-row>`).
- El marcador de portada de la tarjeta (`snr-card__art`): `surface-high` con las cinco barras ámbar, porque no hay portadas reales.
- La navegación lateral y la barra del reproductor se escriben una vez en `js/shell.js` y se usan en las cuatro pantallas.
- El reproductor simulado del documento `Tailwind-y-Laravel.md`, ampliado con cola, aleatorio, me gusta y estado que se conserva al cambiar de pantalla.

**Reglas del sistema que cuidé**

- Un solo botón primario ámbar por vista, con texto `on-accent`.
- Manrope para todo el texto y JetBrains Mono para tiempos, conteos y kbps.
- Anillo de enfoque de 3 px en `focus` con 2 px de separación en todos los controles. Hay enlace "Saltar al contenido" y etiquetas accesibles en los botones de solo icono. La barra de progreso es un `slider` que responde a las flechas, Inicio y Fin.
- Los estados no dependen solo del color: "Guardada en tu biblioteca" lleva palabra e icono, y el corazón de me gusta se rellena.
- Textos en español, en minúsculas de oración, sin emojis ni signos de exclamación.

**Qué cambiaría**

- Pasar a Laravel (fase 2): las funciones de `componentes.js` se convierten casi directo en componentes Blade, y `datos.js` en un modelo `Track` con migración y seeder.
- Compilar Tailwind con Vite en lugar de usar el CDN, para no repetir el bloque `@theme` en cada página y generar un CSS más pequeño.
- Agregar una pantalla "Tu biblioteca" con las playlists guardadas y las canciones con me gusta.
