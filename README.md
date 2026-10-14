# Fernando Rivera · Portafolio

Portafolio en español listo para editar en VS Code y publicar en GitHub Pages. Incluye una demo web de Sistema 130 y las tres aplicaciones originales de FitBodyGym adaptadas a demo con datos ficticios.

## Abrir y editar en tu escritorio

1. Haz doble clic en **`ABRIR PORTAFOLIO.cmd`**. Se abrirá la vista previa en tu navegador.
2. En VS Code, usa **Archivo → Abrir carpeta** y elige `C:\Users\Krivera\Desktop\Portafolio 2026`.
3. Edita `public/index.html` para cambiar el contenido principal. Los estilos están en `public/assets/` y los proyectos en `public/assets/projects.js`.
4. Guarda y actualiza la pestaña del navegador para ver tus cambios.

Si prefieres usar la terminal integrada de VS Code, pulsa **Ctrl+Shift+B** y después abre `http://127.0.0.1:4173/`. El lanzador requiere Node.js, que está instalado en este equipo. Puedes abrir `public/index.html` directamente para consultar el contenido básico; la demo Flutter necesita el servidor local.

## Estructura

El contenido público vive en `public/`. Es el único directorio que se despliega.

```text
public/
  index.html
  .nojekyll
  assets/
    styles.css
    theme.css        # Composición editorial y adaptación a pantallas
    career.css       # Trayectoria, capacidades y contacto
    nebula.css       # Fondo continuo y animación ambiental
    nebula.js        # Profundidad al desplazarse
    app.js
    projects.js       # Catálogo de proyectos
    favicon.svg
    fonts/           # Fuentes locales y licencias OFL
    docs/
      kevin-rivera-cv-octubre-2026.pdf  # PDF original, sin modificaciones
    media/           # Capturas y videos autorizados
      nebula-editorial.webp  # Fondo original optimizado (~114 KB)
  demos/
    ova-ejemplo/      # index.html + activity.js
    ovas/academia-policia-modulo-4/ # Exportación web Rise, versión pública del módulo 4
    apps/
      sistema-130/   # Demo Flutter con integraciones simuladas, carga bajo demanda
      fitbodygym/    # Frontend originales React y Flutter compilados en modo demo
  projects/
    fitbodygym/      # Ficha y acceso a las tres demos
    sistema-130/     # Ficha: contexto, demo, recursos gráficos y capturas
    academia-policia/ # Ficha de serie formativa y OVA interactiva del módulo 4
tools/publish-pages.ps1 # Actualiza la rama de publicación gh-pages
README.md
ASSETS.md            # Procedencia y prompt de la nebulosa
SISTEMA-130.md       # Procedencia y adaptación de la demo de Sistema 130
FITBODYGYM.md        # Procedencia y alcance de las tres demos
originales-no-publicar/ # ZIP privados guardados solo en tu copia del escritorio; excluidos por Git
```

## OVA de la Academia de la Policía

La ficha `public/projects/academia-policia/index.html` presenta la serie de formación sobre IA generativa. Los módulos 2 y 3 se describen a partir de las capturas compartidas; solo el módulo 4 tiene un archivo navegable. El módulo 1 no está disponible. La OVA del módulo 4 se puede explorar dentro de la ficha o abrir a pantalla completa en `public/demos/ovas/academia-policia-modulo-4/index.html`.

La versión pública se extrajo del ZIP entregado por el usuario y conserva las lecciones, audios, actividades y evaluación de Articulate Rise. Se retiraron un nombre de autor de la cuenta y un identificador de enlace del archivo de datos exportado. El ZIP original permanece en `originales-no-publicar/` y no se copia a `public/`. Como en cualquier sitio estático, los archivos de la OVA servidos en `public/` pueden descargarse desde el navegador, aunque la interfaz del portafolio no ofrece un botón de descarga.

## Vista local

Desde esta carpeta, ejecuta `node tools/serve.cjs` y abre `http://localhost:4173`. El portafolio utiliza enlaces relativos y contenido local. La demo Flutter requiere servir los archivos por HTTP; funciona en el servidor local o en GitHub Pages.

## Publicación en GitHub Pages

Repositorio: [ingfernandorivera/Portafolio](https://github.com/ingfernandorivera/Portafolio). Dirección de GitHub Pages: [ingfernandorivera.github.io/Portafolio/](https://ingfernandorivera.github.io/Portafolio/).

GitHub Pages publica la raíz de la rama `gh-pages`, que contiene únicamente los archivos de `public/`. La rama `main` conserva el proyecto editable. En Settings → Pages, el origen es **Deploy from a branch**, rama **gh-pages**, carpeta **/(root)**.

Para actualizar el sitio, edita los archivos en `public/`, confirma tus cambios en Git y ejecuta `powershell -ExecutionPolicy Bypass -File tools/publish-pages.ps1`. El script sube `main` y publica su carpeta `public/` en `gh-pages`; GitHub Pages desplegará esa versión. Los ZIP originales, fuentes privadas y carpetas de trabajo están excluidos del repositorio mediante `.gitignore`.

## Añadir proyectos, capturas y videos

Edita `public/assets/projects.js`. Cada proyecto tiene `id`, `title`, `category` (`systems`, `learning`, `design`), `label`, `subtitle`, `visual` (`fitness`, `learning`, `design`, `honduras`, `isdemu`), `number`, `status`, `description`, `details`, `demo` y `media`. Opcionalmente, `cover` y `coverAlt` definen una portada con imagen y `caseStudy` enlaza una ficha propia.

Ejemplo de campos opcionales:

```js
demo: 'demos/apps/mi-app/index.html',
media: [
  { type: 'image', src: 'assets/media/mi-app/captura.webp', alt: 'Descripción concreta de la pantalla' },
  { type: 'video', src: 'assets/media/mi-app/recorrido.mp4', poster: 'assets/media/mi-app/portada.webp' }
]
```

Las rutas de medios se interpretan desde `public/index.html`. Comprime capturas a WebP y videos a MP4; añade subtítulos si tienen voz o información sonora. El cargador de medios es opcional y no reproduce videos automáticamente. Duplica `demos/ova-ejemplo/` para cada OVA y conserva rutas relativas. Las apps con servidor, bases de datos o secretos necesitan una adaptación a demo estática: GitHub Pages solo sirve archivos.

## Completar antes de presentar

- Perfil, trayectoria, formación, capacidades y contacto se basan en el CV compartido por el usuario, versión octubre de 2026. La experiencia no tiene fechas en el CV, por lo que no se inventó una cronología.
- El PDF descargable es una copia exacta del original autorizado. Incluye el teléfono, correo y fotografía proporcionados por el usuario. No se publicaron documentos institucionales ni datos de terceros.
- Sistema 130 Honduras incluye una ficha propia, recursos originales, capturas y una demo navegable con integraciones simuladas. FitBodyGym incluye los frontend originales del sistema administrativo y del dashboard compilados con datos locales ficticios. La app Flutter original también está compilada para web: conserva el login y la navegación, permite acceder sin credenciales y usa datos locales ficticios. Se presenta dentro de un marco móvil, con rutina activa, chat de ejemplo aplicable y dashboard de progreso; reiniciar restaura el escenario inicial. Las reconstrucciones anteriores se retiraron. Lee FITBODYGYM.md para compilar o editar. ISDEMU mantiene una vista tipográfica pendiente de materiales autorizados. La OVA es una muestra independiente y el caso de diseño sigue reservado.
- Los tres ZIP originales de FitBodyGym son fuentes privadas de trabajo. En tu copia del escritorio están en `originales-no-publicar/`, fuera de `public/` y excluidos por Git. No forman parte del paquete para GitHub Pages. No subas esa carpeta manualmente. Revisa [FITBODYGYM.md](FITBODYGYM.md) antes de cambiar una demo.
- Confirmar permisos sobre cada captura o recurso. No añadir datos personales de terceros, nombres de usuarios, documentos internos, claves ni archivos originales confidenciales. **Todo lo incluido en `public/` será accesible**, aunque no esté enlazado.

## Accesibilidad y rendimiento

HTML semántico, enlace para saltar al contenido, foco visible, controles con estado, diálogo nativo con Escape y recuperación de foco, filtros anunciados y adaptación a movimiento reducido. Nebulosa continua en todo el sitio, con nubes de movimiento lento y profundidad suave al desplazarse. El fondo usa capas CSS acotadas al tamaño de la pantalla, sin canvas ni videos; el movimiento se reduce en móvil, se pausa cuando la pestaña está oculta y se desactiva con `prefers-reduced-motion`. Cormorant Garamond e Inter se incluyen localmente en WOFF2, con sus licencias OFL y caracteres latinos extendidos para español. El sitio no depende de servicios externos. Con JavaScript desactivado sigue disponible el contenido principal y un enlace a la OVA.

El fondo combina una imagen WebP original (~114 KB) con capas CSS y no usa video ni librerías de animación. El índice lateral indica la sección visible; las categorías del recorrido activan los filtros del portafolio. Se revisaron anchos de 320, 390, 768, 1024 y 1440 píxeles, fichas, menú móvil y movimiento reducido.

El contraste y el comportamiento se deben volver a revisar al sustituir textos y medios. El proyecto no incorpora analítica ni almacenamiento de respuestas.

## Actualizar el CV

Sustituye `public/assets/docs/kevin-rivera-cv-octubre-2026.pdf` por la nueva versión pública y actualiza las etiquetas de versión, peso y formación en `public/index.html`. Los cuatro enlaces de descarga funcionan con rutas relativas en GitHub Pages. Revisa el contenido y los datos de contacto antes de una publicación futura.
