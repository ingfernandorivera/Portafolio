# Sistema 130 · Integración en el portafolio

Se utiliza una copia del proyecto Flutter / FlutterFlow entregado por el usuario. El proyecto original del escritorio permanece intacto. No se ha publicado esta versión.

## Presentación

- Tarjeta en el catálogo con la identidad original del proyecto.
- Ficha propia en `public/projects/sistema-130/index.html`: contexto, participación, demo, recursos gráficos y capturas.
- Demo en `public/demos/apps/sistema-130/index.html`, que carga la aplicación compilada únicamente al pulsar **Iniciar demo**.
- Tres materiales gráficos seleccionados: logotipo, composición del inicio y fondo del apartado de ubicación. No se atribuye la autoría individual de toda la identidad institucional.
- Capturas de la interfaz obtenidas de esta versión de demostración.

## Adaptación de la demo

Los menús, pantallas, ilustraciones y navegación proceden de la app original. Se conservaron las rutas con navegación mediante fragmentos (`#`) y las rutas de archivos relativas para admitir GitHub Pages bajo el nombre de un repositorio.

Se desactivaron Firebase y los eventos de analítica. Los formularios, documentos de Google Drive y chatbot externos se sustituyeron por pantallas de ejemplo locales. Las respuestas del chatbot de esta demo son predefinidas y se identifican como tales. Los formularios no aceptan datos personales ni realizan envíos. Las llamadas, enlaces institucionales, redes sociales y mapa externo muestran un aviso de demostración.

La app utiliza sus recursos locales y CanvasKit local. Su política de contenido permite conexiones solamente al mismo origen y bloquea marcos externos. No se registra ningún service worker. La navegación accesible de Flutter se activa desde el inicio.

El portal original, el chatbot original y los archivos institucionales no se cargan. No se copiaron configuraciones de Firebase, archivos Android/iOS, respaldos, bases de datos, credenciales ni fuentes del proyecto original al directorio público.

## Compilación

La copia de trabajo se compiló con Flutter 3.47.1. Se adaptaron dos copias locales de dependencias anteriores (`font_awesome_flutter` y `page_transition`) para esta versión de Flutter. La aplicación usa las tipografías locales ya incluidas en el proyecto; el portafolio mantiene sus fuentes OFL. Los recursos compilados están en `runtime/` y no necesitan Flutter en el servidor.

El portal del portafolio permanece ligero: la app de unos 15 MB se descarga al iniciar la demo. Para renovar la app, debe prepararse otra compilación de demostración sin conexiones reales, conservar los archivos relativos y reemplazar el contenido de `runtime/`. Las capturas y los materiales de la ficha se mantienen separados en `public/assets/media/sistema-130/`.

## Añadir otros proyectos

El catálogo ahora admite `cover`, `coverAlt` y `caseStudy`, además de `demo` y `media`. Se puede repetir la estructura para cada app. Conviene reunir app, pantallas y diseños asociados dentro de una sola ficha; crear otro caso de diseño cuando explique un trabajo con un objetivo y un proceso propios.
