const projects = window.PORTFOLIO_PROJECTS;
const grid = document.querySelector('#project-grid');
const dialog = document.querySelector('#project-dialog');

const labels = {
  fitness: '<div class="fitness-mark" aria-hidden="true"><div class="mini-app"><div class="mini-app-header">FitBodyGym <span>ECOSISTEMA</span></div><div class="mini-app-title">Todo está conectado.</div><div class="mini-stats"><span>Miembros de muestra<b>128</b></span><span>Rutinas de ejemplo<b>24</b></span></div><div class="mini-chart"><i style="--h:35%"></i><i style="--h:58%"></i><i style="--h:46%"></i><i style="--h:75%"></i><i style="--h:62%"></i><i style="--h:88%"></i></div></div></div>',
  learning: '<div class="learning-mark" aria-hidden="true"><span class="micro">EXPLORA · CONECTA · APRENDE</span><strong>Aprender<em>haciendo.</em></strong><span class="lesson-line"></span><span class="lesson-progress"><i></i><i></i><i></i></span></div>',
  design: '<div class="design-mark" aria-hidden="true"><span class="micro">FORMA & FUNCIÓN</span><strong>Ideas<em>en conexión.</em></strong><span class="design-rule"></span></div>',
  honduras: '<div class="honduras-mark" aria-hidden="true"><span class="micro">APLICACIÓN MÓVIL / CHATBOT</span><strong>130</strong><span>HONDURAS</span></div>',
  isdemu: '<div class="isdemu-mark" aria-hidden="true"><span class="micro">FORMACIÓN / EXPERIENCIA DIGITAL</span><strong>Aprendizaje<em>conectado.</em></strong><span class="lesson-line"></span></div>'
};

function updateCounters() {
  const counts = {
    all: projects.length,
    systems: projects.filter(p => p.category === 'systems').length,
    learning: projects.filter(p => p.category === 'learning').length,
    design: projects.filter(p => p.category === 'design').length
  };
  document.querySelectorAll('[data-count]').forEach(el => {
    const key = el.dataset.count;
    if (counts[key] !== undefined) el.textContent = counts[key];
  });
}

function openProjectDialog(projectId) {
  const p = projects.find(item => item.id === projectId);
  if (!p) return;
  document.querySelector('#dialog-category').textContent = p.label;
  document.querySelector('#dialog-title').textContent = p.title;
  document.querySelector('#dialog-description').textContent = p.description;
  const details = document.querySelector('#dialog-details');
  details.replaceChildren();

  // Tags en modal
  if (p.tags && p.tags.length) {
    const tagsBox = document.createElement('div');
    tagsBox.className = 'tech-stack-row';
    tagsBox.style.margin = '10px 0 18px 0';
    p.tags.forEach(t => {
      const chip = document.createElement('span');
      chip.className = 'tech-chip';
      chip.textContent = t;
      tagsBox.append(chip);
    });
    details.append(tagsBox);
  }

  const list = document.createElement('ul');
  p.details.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    list.append(li);
  });
  details.append(list);

  // Screenshots and videos
  p.media.forEach(media => {
    const el = document.createElement(media.type === 'video' ? 'video' : 'img');
    el.src = media.src;
    if (media.type === 'video') {
      el.controls = true;
      el.preload = 'none';
      if (media.poster) el.poster = media.poster;
    } else {
      el.alt = media.alt || '';
      el.loading = 'lazy';
    }
    details.append(el);
  });

  const actions = document.querySelector('#dialog-actions');
  actions.replaceChildren();

  if (p.demo) {
    const link = document.createElement('a');
    link.href = p.demo;
    link.className = 'button primary';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Abrir demo';
    actions.append(link);
  }
  if (p.demos) {
    p.demos.forEach(demo => {
      const link = document.createElement('a');
      link.href = demo.url;
      link.className = 'button primary';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = demo.label;
      actions.append(link);
    });
  }
  if (!p.demo && !p.demos) {
    const status = document.createElement('p');
    status.className = 'pending';
    status.textContent = 'Demo pública en preparación';
    actions.append(status);
  }
  if (p.caseStudy) {
    const link = document.createElement('a');
    link.href = p.caseStudy;
    link.className = 'button secondary';
    link.textContent = 'Ver proyecto y diseños';
    actions.append(link);
  }
  dialog.showModal();
}

function render(filter = 'all') {
  grid.replaceChildren();
  const selected = projects.filter(p => filter === 'all' || p.category === filter);

  selected.forEach(p => {
    const article = document.createElement('article');
    article.className = 'project-card';
    article.setAttribute('data-category', p.category);

    // La ficha de cada proyecto es la acción principal; las demos quedan disponibles debajo.
    let actionsHtml = '';
    if (p.caseStudy) {
      actionsHtml = `
        <a href="${p.caseStudy}" class="single-demo-btn">
          <span>Explorar caso y recursos</span> <i>↗</i>
        </a>
      `;
    } else if (p.demo) {
      actionsHtml = `
        <a href="${p.demo}" class="single-demo-btn" target="_blank" rel="noopener">
          <span>Explorar OVA interactiva</span> <i>↗</i>
        </a>
      `;
    }

    if (p.demos && p.demos.length > 0) {
      actionsHtml += `
        <div class="multi-demos-box">
          <span class="multi-demos-title">✦ PROBAR DEMOS INTERACTIVAS:</span>
          <div class="multi-demos-pills">
            ${p.demos.map(d => `<a href="${d.url}" class="demo-pill-btn" target="_blank" rel="noopener">${d.label} ↗</a>`).join('')}
          </div>
        </div>
      `;
    } else if (p.demo && p.caseStudy) {
      actionsHtml += `
        <div class="multi-demos-box">
          <span class="multi-demos-title">✦ PROBAR DEMO INTERACTIVA:</span>
          <div class="multi-demos-pills">
            <a href="${p.demo}" class="demo-pill-btn" target="_blank" rel="noopener">Abrir demo ↗</a>
          </div>
        </div>
      `;
    }

    // Fila secundaria: Caso de estudio + Ficha técnica
    const secondaryRow = `
      <div class="secondary-actions-row">
        ${p.caseStudy 
          ? `<a href="${p.caseStudy}" class="case-study-link">Ver caso de estudio <span>✦</span></a>` 
          : '<span style="font-size:11px;color:#8f88ab;">Caso en preparación</span>'}
        <button class="info-dialog-btn" data-project="${p.id}" aria-label="Abrir ficha técnica de ${p.title}">
          Ficha técnica <span>ℹ</span>
        </button>
      </div>
    `;

    // Chips de tecnologías
    const tagsHtml = (p.tags || []).map(t => `<span class="tech-chip">${t}</span>`).join('');

    // Portada / Showcase
    const mediaHtml = p.cover 
      ? `<img src="${p.cover}" alt="${p.coverAlt || p.title}" loading="lazy" class="showcase-img">` 
      : (labels[p.visual] || '');

    article.innerHTML = `
      <div class="card-showcase" data-project="${p.id}" role="button" tabindex="0" aria-label="Ver detalles de ${p.title}">
        <div class="showcase-media ${p.visual}${p.cover ? ' has-cover' : ''}">
          ${mediaHtml}
          <div class="showcase-gradient"></div>
        </div>
        <div class="showcase-top-badges">
          <span class="badge-order">${p.number}</span>
          <span class="badge-status"><i class="pulse-dot"></i> ${p.status || 'PROYECTO'}</span>
        </div>
      </div>
      <div class="card-body">
        <span class="card-category-tag">${p.label}</span>
        <h3 class="card-title">
          <button class="card-title-button" data-project="${p.id}" aria-label="Abrir detalles de ${p.title}">
            <span>${p.title}</span>
            <span class="title-arrow" aria-hidden="true">↗</span>
          </button>
        </h3>
        <p class="card-subtitle">${p.subtitle}</p>
        <p class="card-description">${p.description}</p>
        <div class="tech-stack-row" aria-label="Tecnologías y herramientas">
          ${tagsHtml}
        </div>
        <div class="card-actions-wrapper">
          ${actionsHtml}
          ${secondaryRow}
        </div>
      </div>
    `;

    // Soporte de teclado (Enter / Espacio) en showcase
    const showcase = article.querySelector('.card-showcase');
    showcase.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectDialog(p.id);
      }
    });

    grid.append(article);
  });

  const results = document.querySelector('#results');
  if (results) results.textContent = `${selected.length} proyectos disponibles`;
}

function setFilter(category) {
  document.querySelectorAll('[data-filter]').forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  render(category);
}

// Event Listeners para Filtros
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

document.querySelectorAll('[data-category]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    setFilter(link.dataset.category);
    const target = document.querySelector('#proyectos');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Event Delegation para triggers de proyectos
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-project]');
  if (!trigger) return;
  // Si el click fue en un enlace <a> dentro de la tarjeta, permitimos la navegación normal
  if (event.target.closest('a')) return;
  openProjectDialog(trigger.dataset.project);
});

// Cerrar dialog
const dialogCloseBtn = document.querySelector('.dialog-close');
if (dialogCloseBtn) {
  dialogCloseBtn.addEventListener('click', () => dialog.close());
}
if (dialog) {
  dialog.addEventListener('click', e => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        dialog.close();
      }
    }
  });
}

// Menú móvil
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  nav.addEventListener('click', e => {
    if (e.target.closest('a')) {
      menu.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      menu.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });
}

const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Inicialización de contadores y renderizado
updateCounters();
render();

// Intersection Observer para rail lateral
const railLinks = [...document.querySelectorAll('.section-rail a')];
if ('IntersectionObserver' in window && railLinks.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      railLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));
}
