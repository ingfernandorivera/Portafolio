// Add only approved public content. All paths are relative to the site root.
// Lifecycle is independent of the demo: 'in-use', 'in-development', 'prototype'.
// Leave null until the owner confirms the project's current state.
window.PORTFOLIO_LIFECYCLES = Object.freeze({
  'in-use': { label: 'En uso' },
  'in-development': { label: 'En desarrollo' },
  prototype: { label: 'Prototipo' }
});
window.PORTFOLIO_PROJECTS = [
  {
    id: 'fitbodygym-admin',
    title: 'Sistema administrativo · FitBodyGym',
    category: 'systems',
    categoryIndex: '01',
    label: '01 / Sistemas y apps',
    subtitle: 'Clientes, membresías y operación del gimnasio',
    visual: 'fitness',
    number: '01',
    lifecycle: 'in-use',
    showcaseLabel: 'SISTEMA WEB / DEMO',
    cover: 'assets/media/fitbodygym/admin-screen.webp',
    coverAlt: 'Panel del sistema administrativo de FitBodyGym con clientes, membresías, pagos y accesos',
    description: 'Sistema para la operación diaria de un gimnasio: registro de clientes, membresías, pagos, caja, inventario y control de acceso. Reúne los procesos de recepción en una sola interfaz, con datos de ejemplo en la demo.',
    tags: ['React', 'TypeScript', 'APIs REST', 'Gestión', 'Biometría'],
    details: [
      'Registro y consulta de clientes, asignación de planes y seguimiento de membresías.',
      'Gestión de pagos, caja e inventario desde la interfaz administrativa original.',
      'Demo con datos ficticios: el control de acceso, la biometría y la sincronización se simulan.'
    ],
    caseStudy: 'projects/fitbodygym/index.html',
    demo: 'demos/apps/fitbodygym/admin/index.html',
    demoPrimary: true,
    demoLabel: 'Explorar sistema administrativo',
    media: []
  },
  {
    id: 'fitbodygym-dashboard',
    title: 'Dashboard de propietarios',
    category: 'systems',
    categoryIndex: '01',
    label: '01 / Sistemas y apps',
    subtitle: 'Indicadores y decisiones del negocio · FitBodyGym',
    visual: 'fitness',
    number: '02',
    lifecycle: 'in-use',
    showcaseLabel: 'DASHBOARD / DEMO',
    cover: 'assets/media/fitbodygym/dashboard-phone.webp',
    coverAlt: 'Dashboard de propietarios de FitBodyGym con indicadores de ingresos y membresías en vista móvil',
    description: 'Panel para consultar ingresos, membresías, visitas y ventas de productos. Presenta gráficos y comparaciones por período para dar seguimiento al negocio desde el celular, con indicadores de ejemplo en la demo.',
    tags: ['React', 'TypeScript', 'Supabase', 'Gráficos', 'Analítica'],
    details: [
      'Resumen de ingresos, membresías, visitas y ventas de productos para los propietarios.',
      'Selección de períodos, consulta de detalles e indicadores visuales del negocio.',
      'Interfaz adaptada al celular. La demo utiliza datos ficticios locales y permite abrir la vista de escritorio.'
    ],
    caseStudy: 'projects/fitbodygym/index.html',
    demo: 'demos/apps/fitbodygym/dashboard-movil/index.html',
    demoPrimary: true,
    demoLabel: 'Explorar dashboard',
    media: []
  },
  {
    id: 'fitbodygym-fitness',
    title: 'App Fitness · FitBodyGym',
    category: 'systems',
    categoryIndex: '01',
    label: '01 / Sistemas y apps',
    subtitle: 'Entrenamiento, rutinas y seguimiento personal',
    visual: 'fitness',
    number: '03',
    lifecycle: 'in-use',
    showcaseLabel: 'APP FITNESS / DEMO',
    cover: 'assets/media/fitbodygym/mobile-screen.webp',
    coverAlt: 'App Fitness de FitBodyGym con rutinas de entrenamiento y navegación móvil',
    description: 'Aplicación móvil para organizar rutinas, consultar ejercicios y registrar el progreso del entrenamiento. Integra perfil y asistencia con IA; la demo permite recorrer sus funciones con un perfil y respuestas de ejemplo.',
    tags: ['Flutter', 'Dart', 'Supabase', 'UX/UI móvil', 'Chat IA'],
    details: [
      'Rutinas de entrenamiento, catálogo de ejercicios, historial y seguimiento de progreso.',
      'Perfil personal y asistencia con IA para proponer rutinas; las respuestas se simulan en la demo.',
      'Proyecto Flutter original con un perfil ficticio y una rutina de ejemplo que se restauran al reiniciar.'
    ],
    caseStudy: 'projects/fitbodygym/index.html',
    demo: 'demos/apps/fitbodygym/mobile/index.html',
    demoPrimary: true,
    demoLabel: 'Explorar App Fitness',
    media: []
  },
  {
    id: 'sistema-130',
    title: 'Sistema 130 Honduras',
    category: 'systems',
    categoryIndex: '01',
    label: '01 / Sistemas y apps',
    subtitle: 'Aplicación móvil institucional, chatbot e integraciones',
    visual: 'honduras',
    number: '04',
    lifecycle: 'in-use',
    showcaseLabel: 'APP / DEMO EXPLORABLE',
    cover: 'assets/media/sistema-130/screen-home.webp',
    coverAlt: 'App móvil del Sistema 130 de Honduras',
    description: 'Desarrollo de aplicación móvil y chatbot que reúnen los servicios de atención ciudadana del Sistema 130 de Honduras: denuncias, quejas, sugerencias y orientación.',
    tags: ['Flutter', 'Chatbot IA', 'REST APIs', 'UI/UX Móvil', 'Servicios Públicos'],
    details: [
      'Participación directa: desarrollo de la aplicación móvil, lógica de chatbot e integración de servicios digitales.',
      'Demo interactiva disponible con flujos de ejemplo, navegación original y formularios simulados.',
      'La ficha del proyecto y caso de estudio incluyen capturas en alta resolución y recursos gráficos.'
    ],
    caseStudy: 'projects/sistema-130/index.html',
    demo: 'demos/apps/sistema-130/index.html',
    media: []
  },
  {
    id: 'isdemu',
    title: 'ISDEMU Formación Digital',
    category: 'learning',
    categoryIndex: '02',
    label: '02 / OVAs y aprendizaje interactivo',
    subtitle: '3 programas formativos, OVAs interactivas y manual diseñado',
    visual: 'isdemu',
    number: '05',
    lifecycle: 'in-use',
    showcaseLabel: '3 CURSOS / OVAS & MANUAL',
    cover: 'assets/media/isdemu/cuidados/banner-cuidados.webp',
    coverAlt: 'Ecosistema de Formación Digital ISDEMU',
    description: 'Virtualización pedagógica y desarrollo de OVAs para 3 programas nacionales de ISDEMU: Alfabetización en Derechos de las Mujeres, Liderazgo y Corresponsabilidad de los Hombres, y Cuidados PAM (con OVA interactiva en Articulate Rise y manual editorial diseñado).',
    tags: ['Articulate Rise', 'Storyline 360', 'OVAs', 'Manual Editorial', 'Moodle LMS', 'Género'],
    details: [
      '1. Alfabetización en Derechos de las Mujeres: Proceso formativo híbrido, OVAs interactivas y materiales educativos digitales para la igualdad y vida libre de violencia.',
      '2. Liderazgo y Corresponsabilidad de los Hombres: Formación virtual y presencial sobre liderazgo, masculinidades positivas y corresponsabilidad equitativa.',
      '3. Cuidados de Personas Adultas Mayores (PAM): Formación híbrida, desarrollo de OVA interactiva en Articulate Rise y diseño editorial del Manual de Cuidados completo.'
    ],
    caseStudy: 'projects/isdemu/index.html',
    demos: [
      { label: '🌟 Probar OVA Cuidados PAM', url: 'demos/ovas/isdemu-cuidados/index.html' },
      { label: '📖 Ver Manual Cuidados', url: 'projects/isdemu/index.html#manual-preview' }
    ],
    media: []
  },
  {
    id: 'davivienda',
    title: 'Davivienda PYMES',
    category: 'learning',
    categoryIndex: '02',
    label: '02 / OVAs y aprendizaje interactivo',
    subtitle: 'OVAs para capacitación a ejecutivos bancarios sobre PYMES',
    visual: 'learning',
    number: '06',
    lifecycle: 'in-use',
    showcaseLabel: 'OVAS FINANCIERAS',
    cover: 'assets/media/davivienda/cover.webp',
    coverAlt: 'Capacitación Virtual para Ejecutivos Davivienda sobre PYMES',
    description: 'Desarrollo de Objetos Virtuales de Aprendizaje —OVAs— para una capacitación virtual dirigida a ejecutivos de Davivienda, enfocada en el fortalecimiento de conocimientos relacionados con las PYMES, su atención, análisis y acompañamiento desde el ámbito financiero.',
    tags: ['Storyline 360', 'OVAs', 'Sector Bancario', 'PYMES', 'E-learning'],
    details: [
      'Capacitación especializada para el personal ejecutivo y analistas de banca comercial.',
      'Estructuración interactiva de módulos orientados a la evaluación y diagnóstico de necesidades PYME.',
      'Recursos multimedia dinámicos, simulaciones de casos prácticos y evaluaciones modulares integradas.'
    ],
    caseStudy: 'projects/davivienda/index.html',
    demo: null,
    media: []
  },
  {
    id: 'pddh',
    title: 'PDDH Memoria Histórica',
    category: 'learning',
    categoryIndex: '02',
    label: '02 / OVAs y aprendizaje interactivo',
    subtitle: 'Aula virtual en Moodle y curso sobre DDHH y cultura de paz',
    visual: 'learning',
    number: '07',
    lifecycle: 'in-use',
    showcaseLabel: 'AULA VIRTUAL MOODLE',
    cover: 'assets/media/pddh/cover.webp',
    coverAlt: 'Curso virtual PDDH - Memoria Histórica y Derechos Humanos',
    description: 'Desarrollo de curso virtual y estructuración del aula virtual Moodle para la PDDH: «Memoria Histórica y Derechos Humanos en El Salvador: Una Mirada desde las Mujeres Guardianas de la Paz», organizando módulos, temas, foros, recursos y evaluaciones.',
    tags: ['Moodle LMS', 'Diseño Instruccional', 'E-learning', 'Derechos Humanos', 'Paz'],
    details: [
      'Fortalecimiento de conocimientos sobre memoria histórica, derechos humanos, género y cultura de paz.',
      'Montaje y organización arquitectónica del curso dentro de la plataforma Moodle por módulos y temas.',
      'Diseño de recursos visuales, actividades pedagógicas participativas y evaluaciones formativas automatizadas.'
    ],
    caseStudy: 'projects/pddh/index.html',
    demo: null,
    media: []
  },
  {
    id: 'unicef',
    title: 'UNICEF Vacunas & Cadena de Frío',
    category: 'learning',
    categoryIndex: '02',
    label: '02 / OVAs y aprendizaje interactivo',
    subtitle: 'Gestión y manejo adecuado de vacunas en aula virtual Moodle',
    visual: 'learning',
    number: '08',
    lifecycle: 'in-use',
    showcaseLabel: 'AULA VIRTUAL MOODLE',
    cover: 'assets/media/unicef/cover-banner.webp',
    coverAlt: 'UNICEF - Gestión de la Cadena de Frío y Manejo de Vacunas',
    description: 'Desarrollo de curso virtual y estructuración de aula virtual en Moodle para UNICEF sobre «Gestión de la Cadena de Frío y Manejo Adecuado de Vacunas», integrando contenidos e-learning, recursos de aprendizaje, evaluaciones y herramientas de apoyo.',
    tags: ['Moodle LMS', 'UNICEF', 'Salud Pública', 'Cadena de Frío', 'E-learning'],
    details: [
      'Capacitación técnica orientada a garantizar los estándares de conservación y control térmico de vacunas.',
      'Diseño y estructuración completa del curso en Moodle, organizando materiales técnicos, guías y protocolos.',
      'Integración de recursos didácticos interactivos, evaluaciones normativas y bancos de preguntas para el personal de salud.'
    ],
    caseStudy: 'projects/unicef/index.html',
    demo: null,
    media: []
  },
  {
    id: 'academia-policia-ia',
    title: 'Academia de la Policía · IA generativa',
    category: 'learning',
    categoryIndex: '02',
    label: '02 / OVAs y aprendizaje interactivo',
    subtitle: 'Serie de formación policial en Articulate Rise',
    visual: 'academy',
    number: '09',
    lifecycle: 'in-use',
    showcaseLabel: 'OVA INTERACTIVA DISPONIBLE',
    cover: 'assets/media/academia-policia/modulo-4-cover.jpg',
    coverAlt: 'Imagen ilustrativa del módulo 4: dos agentes revisan información con apoyo de pantallas digitales',
    description: 'Desarrollo de OVAs sobre fundamentos de IA generativa, seguridad de la información y responsabilidad profesional. El módulo 4 conserva sus lecciones y actividades interactivas para explorarlas en el portafolio.',
    tags: ['Articulate Rise', 'Diseño instruccional', 'IA generativa', 'Formación policial'],
    details: [
      'Módulo 2: fundamentos, límites, errores y verificación de información generada por IA.',
      'Módulo 3: marco normativo, datos sensibles y plataformas institucionales.',
      'Módulo 4: usos permitidos, sesgos, supervisión humana y responsabilidad profesional; OVA interactiva disponible.'
    ],
    caseStudy: 'projects/academia-policia/index.html',
    demo: 'demos/ovas/academia-policia-modulo-4/index.html',
    media: []
  }
];
