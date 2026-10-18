// Prepare entrances offscreen, then reveal them before they reach the visible area.
(() => {
  if (!('IntersectionObserver' in window)) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet();
  const pending = new Set();
  const selector = [
    '.ghost-word',
    '.about-portrait', '.about-copy', '.section-heading', '.orbital-tabs-container',
    '.capability-grid > article', '.project-card',
    '.feature-frame', '.career-entry', '.education-entry', '.cv-download',
    '.career-projects-heading', '.career-project', '.contact > .eyebrow',
    '.contact h2', '.contact-status', '.contact-links',
    '.case-hero > *', '.case-panel > .eyebrow', '.case-panel > h2',
    '.case-panel > p', '.case-panel .columns > article', '.academy-modules > article',
    '.case-section > .eyebrow', '.case-section > h2', '.case-section > p',
    '.case-section figure', '.course-block > header', '.course-block > .course-header',
    '.demo-card', '.ova-embed-wrap'
  ].join(',');

  const reveal = element => {
    observer.unobserve(element);
    titleObserver.unobserve(element);
    pending.delete(element);
    seen.add(element);
    element.classList.remove('motion-pending');
  };

  const onEnter = entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      // The pending style has already been painted, so nothing flashes back to hidden.
      requestAnimationFrame(() => reveal(element));
    });
  };
  const observer = new IntersectionObserver(onEnter, { threshold: 0, rootMargin: '0px 0px 90px 0px' });
  const titleObserver = new IntersectionObserver(onEnter, { threshold: .15 });

  const register = (root = document, initial = false) => {
    if (reducedMotion.matches) return;
    const targets = [...root.querySelectorAll(selector)];
    if (root instanceof Element && root.matches(selector)) targets.unshift(root);
    targets.forEach(element => {
      // Nested groups share their parent's entrance instead of fading twice.
      if (seen.has(element) || pending.has(element) || element.parentElement.closest(selector)) return;
      const rect = element.getBoundingClientRect();
      // Keep the first visible screen steady, including links opened at a section anchor.
      if (initial && rect.top < window.innerHeight) {
        seen.add(element);
        return;
      }
      element.classList.add('motion-item', 'motion-pending');
      pending.add(element);
      (element.matches('.ghost-word') ? titleObserver : observer).observe(element);
    });
  };

  register(document, true);
  const grid = document.querySelector('#project-grid');
  if (grid) {
    new MutationObserver(records => {
      records.forEach(record => {
        record.removedNodes.forEach(node => {
          if (node instanceof Element) {
            observer.unobserve(node);
            pending.delete(node);
          }
        });
        record.addedNodes.forEach(node => {
          if (node instanceof Element) register(node);
        });
      });
    }).observe(grid, { childList: true });
  }

  document.addEventListener('focusin', event => {
    const element = event.target.closest('.motion-pending');
    if (element) reveal(element);
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      [...pending].forEach(reveal);
    } else {
      register(document, true);
    }
  });
})();
