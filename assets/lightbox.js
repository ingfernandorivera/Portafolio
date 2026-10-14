/**
 * Lightbox Modal Interactivo · Fernando Rivera Portafolio
 * Permite ampliar cualquier imagen al hacer clic con fondo cósmico,
 * soporte de tecla Escape, clic fuera para cerrar y botón de cierre.
 */
(function () {
  'use strict';

  function initLightbox() {
    let modal = document.getElementById('portfolio-lightbox');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'portfolio-lightbox';
      modal.className = 'lightbox-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-wrap">
          <button type="button" class="lightbox-close" aria-label="Cerrar imagen">&times;</button>
          <figure class="lightbox-stage">
            <img class="lightbox-img" src="" alt="">
            <figcaption class="lightbox-caption"></figcaption>
          </figure>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const backdrop = modal.querySelector('.lightbox-backdrop');
    const closeBtn = modal.querySelector('.lightbox-close');
    const modalImg = modal.querySelector('.lightbox-img');
    const modalCaption = modal.querySelector('.lightbox-caption');
    const wrap = modal.querySelector('.lightbox-wrap');

    function open(src, alt, caption) {
      if (!src) return;
      modalImg.src = src;
      modalImg.alt = alt || '';
      if (caption && caption.trim()) {
        modalCaption.textContent = caption.trim();
        modalCaption.style.display = 'block';
      } else if (alt && alt.trim()) {
        modalCaption.textContent = alt.trim();
        modalCaption.style.display = 'block';
      } else {
        modalCaption.textContent = '';
        modalCaption.style.display = 'none';
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!modal.classList.contains('is-open')) {
          modalImg.src = '';
        }
      }, 250);
    }

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        close();
      }
    });

    // Delegación de clic sobre cualquier imagen de casos de estudio
    document.addEventListener('click', (e) => {
      const img = e.target.closest(
        '.collage-card img, .case-cover img, .moodle-frame-card img, ' +
        '.cuidados-preview-tablet img, .liderazgo-hero-wrap img, .banner-img, ' +
        '.center-mockup img, .img-box img'
      );
      if (!img) return;

      e.preventDefault();
      e.stopPropagation();

      // Buscar texto descriptivo
      let caption = '';
      const card = img.closest('figure, .collage-card, .case-cover, .moodle-frame-card, .liderazgo-hero-wrap');
      if (card) {
        const figcap = card.querySelector('figcaption');
        if (figcap) caption = figcap.textContent;
      }
      if (!caption && img.alt) {
        caption = img.alt;
      }

      open(img.currentSrc || img.src, img.alt, caption);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
