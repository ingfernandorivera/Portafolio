// The portfolio paints first. WebGL and the model are an optional enhancement.
(() => {
  const root = document.documentElement;
  const button = document.querySelector('.ship-replay');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const constrained = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '');
  let flight;
  let loading;

  async function loadFlight(manual = false) {
    if (reduced.matches || document.hidden) return;
    if (button) button.disabled = true;
    try {
      if (!loading) {
        loading = import('./ship-intro.js?v=2').then(async module => {
          const initialized = await module.init({ autoplay: !manual });
          if (!initialized) {
            loading = null;
            return null;
          }
          flight = module;
          return module;
        });
      }
      const module = await loading;
      if (manual) module?.start(true);
    } catch (error) {
      loading = null;
      root.classList.remove('ship-intro-capable', 'ship-intro-running');
      root.classList.add('ship-intro-complete');
      console.warn('No se pudo cargar la animación opcional.', error);
    } finally {
      if (button) button.disabled = root.classList.contains('ship-intro-running');
    }
  }

  if (!reduced.matches) root.classList.add('ship-intro-ready');
  button?.addEventListener('click', () => loadFlight(true));
  const schedule = () => {
    if (reduced.matches || constrained || document.hidden || flight) return;
    const run = () => loadFlight();
    // Give the page two paint frames, then start preparing the first flight.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 800 });
      else setTimeout(run, 0);
    }));
  };
  if (document.readyState !== 'loading') schedule();
  else document.addEventListener('DOMContentLoaded', schedule, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) schedule();
  });
  reduced.addEventListener('change', () => {
    root.classList.toggle('ship-intro-ready', !reduced.matches);
    if (!reduced.matches) schedule();
  });
})();
