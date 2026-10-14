# FitBodyGym: interfaces originales con datos demo

Se corrigió la adaptación anterior: se retiraron las reconstrucciones HTML. El sistema administrativo y el dashboard se compilan desde los frontend React originales entregados por el usuario. Sus archivos CSS, componentes de módulos, gráficos, navegación y logotipos se conservan.

## Cambios limitados a la demo

- Administración: `src/lib/api.ts` llama al adaptador `demoApi.ts` en memoria en lugar del servidor local. Se conserva el login y se entra con «Acceder», sin credenciales. Las exportaciones contienen únicamente registros ficticios. Biometría, correos, sincronización y dispositivos se simulan.
- Dashboard: `src/lib/demoSupabase.ts` proporciona sesión, consultas y metas locales. No se crea un cliente de Supabase. Se conservan las pantallas y los gráficos originales. Se ajustaron las rutas relativas, se retiró el registro de service worker y se alojan localmente las fuentes originales Manrope/Oswald de Google Fonts.
- App de miembros: conserva el proyecto Flutter original, sus pantallas, tema, componentes, recursos y generador de rutinas. El login permite acceder con un clic. Se inicia con el perfil ficticio Alex Demo, una rutina de tres días y 12 sesiones de ejemplo. Se omitió el paso de estimación de grasa corporal de la demo y se renombró la pestaña «Smart» a «Entrenamiento». Chat IA responde localmente con una propuesta de ejemplo; «Aplicar (demo)» permanece disponible y guarda la rutina en Entrenar. Progreso muestra indicadores, volumen, constancia, evolución e historial con esos datos. No hay credenciales ni conexión Supabase. Los videos disponibles únicamente en Supabase necesitan copias locales autorizadas.
- La app de miembros se presenta en un marco móvil de hasta 390 px, con carga bajo demanda y botón de reinicio, siguiendo el recorrido de Sistema 130. `index.html` es la presentación; `app.html` carga Flutter en el iframe. `mobile/demo-shell/` contiene la presentación editable que el instalador conserva en futuras compilaciones.

## Estado real de validación

Los dos frontend React compilan y pasan TypeScript. Se probó el login sin credenciales, la navegación original y los detalles del dashboard mediante renderizado de componentes. Se verificaron altas, acceso, bloqueo, ventas, anulaciones y eliminación con `fetch` bloqueado. No se completó una revisión visual en navegador por las limitaciones del entorno.

La app Flutter se compiló correctamente en modo release con Flutter 3.47.1 y Dart 3.13.1, activando `PREVIEW_MODE=true`. El resultado está en `public/demos/apps/fitbodygym/mobile/`. Se verificaron el cargador, los recursos locales, la ruta base relativa y la ausencia de endpoints Supabase y credenciales. La revisión visual e interacción en navegador sigue pendiente; compilar y servir archivos no sustituye esa revisión.

El inicio habitual del SDK fallaba por la resolución de rutas del entorno de trabajo. Para esta compilación se ejecutaron las herramientas oficiales de Flutter, Pub y Dart2JS desde su código fuente, usando la misma revisión de Dart instalada y entradas `package:`. Se ejecutaron todas las acciones originales del grafo de compilación, en orden y sin la caché incremental, porque su resolución de enlaces simbólicos también fallaba. Para los dos shaders de Flutter se incorporó el contenido exacto de `runtime_effect.glsl` al archivo temporal de entrada antes de invocar el compilador oficial Impeller: así se conservan sus efectos y se evita el fallo de búsqueda del encabezado. No se sustituyó el compilador ni se modificó el diseño de la app. Las herramientas temporales están fuera del paquete del portafolio. Las futuras compilaciones normales pueden hacerse con el archivo CMD incluido.

Las adaptaciones se realizan sobre el código original. Los recursos gráficos originales se conservan. Los cambios de esta revisión añaden el escenario ficticio repetible, el dashboard solicitado y el marco móvil; el generador, el catálogo de ejercicios y las pantallas de entrenamiento siguen siendo los originales.

Se comprobaron con código Dart la validez de la rutina, la repetibilidad de los datos, las 12 sesiones, tres sesiones semanales y el 100 % de constancia de la semana de ejemplo. También se comprobaron la serialización del chat y tres propuestas consecutivas con versiones válidas. La compilación release verifica el código Flutter completo.

## Edición y compilación

Los frontend sanitizados están en `fitbodygym-demo-src/`, fuera de `public/`. Para React: abre esa carpeta, ejecuta `npm install` y `npm run build`. Para Flutter: ejecuta el archivo CMD anterior, o `flutter pub get` y `flutter build web --release --base-href / --dart-define=PREVIEW_MODE=true --no-web-resources-cdn --pwa-strategy=none --no-wasm-dry-run --no-tree-shake-icons` desde `fitbodygym-demo-src/mobile/`. Después ejecuta `tools/install-fitbodygym-mobile.ps1` desde la raíz: convierte la base a `./`, instala Flutter como `app.html` y copia el marco móvil al directorio público.

Los datos React duran hasta recargar. La app Flutter usa almacenamiento local aislado para las acciones durante el recorrido. Al recargar o pulsar «Reiniciar demo», restaura el perfil, la rutina, el chat y el historial ficticios iniciales. Utiliza datos ficticios al probarla. Las tres aplicaciones son demos independientes; no sincronizan registros entre sí.

No se incluyen servidores, SQLite, SQL, scripts de sincronización, `.env`, credenciales ni registros reales. Los ZIP originales permanecen intactos en `originales-no-publicar/` de la carpeta del escritorio y se excluyen del paquete público. GitHub Pages sirve únicamente `public/`.
