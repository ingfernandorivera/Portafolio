// Add only approved public content. All paths are relative to the site root.
window.PORTFOLIO_PROJECTS = [
  {
    id: 'fitbodygym',
    title: 'FitBodyGym',
    category: 'systems',
    categoryIndex: '01',
    label: '01 / Sistemas y apps',
    subtitle: 'Gestión, app móvil y analítica de gimnasio',
    visual: 'fitness',
    number: '01',
    status: '3 DEMOS DISPONIBLES',
    cover: 'assets/media/fitbodygym/admin-screen.webp',
    coverAlt: 'Ecosistema FitBodyGym — Panel administrativo y app móvil',
    description: 'Ecosistema digital completo que integra sistema administrativo web, app móvil para miembros (Flutter) y dashboard para propietarios. Las tres interfaces funcionan interactivamente con datos locales simulados.',
    tags: ['Flutter', 'Dart', 'Web Admin', 'Dashboard', 'REST APIs', 'Biometría'],
    details: [
      'Sistema administrativo: clientes, membresías, caja, inventario y control de acceso biométrico simulado.',
      'App de miembros: rutinas de entrenamiento, guía de ejercicios, seguimiento de progreso y perfil.',
      'Dashboard: indicadores financieros, asistencia y métricas en tiempo real con datos de muestra.'
    ],
    caseStudy: 'projects/fitbodygym/index.html',
    demos: [
      { label: '📱 App Móvil', url: 'demos/apps/fitbodygym/mobile/index.html' },
      { label: '💻 Sistema Admin', url: 'demos/apps/fitbodygym/admin/index.html' },
      { label: '📊 Dashboard', url: 'demos/apps/fitbodygym/dashboard/index.html' }
    ],
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
    number: '02',
    status: 'APP / DEMO EXPLORABLE',
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
    number: '03',
    status: '3 CURSOS / OVAS & MANUAL',
    cover: 'assets/media/isdemu/cuidados/banner-cuidados.png',
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
    number: '04',
    status: 'OVAS FINANCIERAS',
    cover: 'assets/media/davivienda/cover.png',
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
    number: '05',
    status: 'AULA VIRTUAL MOODLE',
    cover: 'assets/media/pddh/cover.png',
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
    number: '06',
    status: 'AULA VIRTUAL MOODLE',
    cover: 'assets/media/unicef/cover-banner.png',
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
    number: '07',
    status: 'OVA INTERACTIVA DISPONIBLE',
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
  },
  {
    id: 'ova-ejemplo',
    title: 'Aprender Explorando',
    category: 'learning',
    categoryIndex: '02',
    label: '02 / OVAs y aprendizaje interactivo',
    subtitle: 'Objeto Virtual de Aprendizaje (OVA) interactivo',
    visual: 'learning',
    number: '08',
    status: 'OVA DE EJEMPLO',
    cover: null,
    coverAlt: 'OVA Interactiva de ejemplo',
    description: 'Experiencia interactiva de microlearning diseñada para demostrar la integración de recursos educativos SCORM/HTML5 independientes con retroalimentación en tiempo real.',
    tags: ['HTML5 / SCORM', 'Microlearning', 'Interactividad', 'Evaluación Lúdica'],
    details: [
      'Actividad interactiva breve con retroalimentación formativa inmediata.',
      'Estructura modular y navegación accesible adaptable a cualquier LMS.',
      'Diseño visual responsivo adaptado al ecosistema digital.'
    ],
    caseStudy: null,
    demo: 'demos/ova-ejemplo/index.html',
    media: []
  },
  {
    id: 'diseno-digital',
    title: 'Diseño en Conexión',
    category: 'design',
    categoryIndex: '03',
    label: '03 / Diseño digital',
    subtitle: 'Sistemas de diseño, identidad visual y prototipado UI/UX',
    visual: 'design',
    number: '09',
    status: 'ESPACIO RESERVADO',
    cover: null,
    coverAlt: 'Diseño en Conexión UI/UX',
    description: 'Espacio dedicado a documentar procesos integrales de diseño: investigación de usuarios, wireframes, diseño de sistemas en Figma, prototipado interactivo y validación visual.',
    tags: ['Figma', 'UI/UX', 'Design Systems', 'Prototipado', 'Branding'],
    details: [
      'Documentación de metodologías de diseño centrado en el usuario.',
      'Creación de librerías de componentes y tokens de diseño reutilizables.',
      'Próximamente se integrarán casos de estudio visuales.'
    ],
    caseStudy: null,
    demo: null,
    media: []
  }
];
