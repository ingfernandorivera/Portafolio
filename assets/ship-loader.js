// Immediate 3D spaceship loader: keeps hero title hidden until the ship wake reveals each character.
(() => {
  const root = document.documentElement;
  const button = document.querySelector('.ship-replay');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let flight;
  let loading;

  const revealFallback = () => {
    root.classList.remove('ship-intro-capable', 'ship-intro-running');
    root.classList.add('ship-intro-complete');
  };

  if (reduced.matches) {
    revealFallback();
  } else {
    root.classList.add('ship-intro-capable', 'ship-intro-ready');
  }

  // Safety net if network or WebGL fails before module initialization completes
  const safetyTimer = setTimeout(() => {
    if (!flight && !root.classList.contains('ship-intro-running')) {
      revealFallback();
    }
  }, 12000);

  async function loadFlight(manual = false) {
    if (reduced.matches) {
      revealFallback();
      return;
    }
    if (button) button.disabled = true;
    try {
      if (!loading) {
        loading = import('./ship-intro.js?v=5').then(async module => {
          const initialized = await module.init({ autoplay: !manual });
          clearTimeout(safetyTimer);
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
      clearTimeout(safetyTimer);
      loading = null;
      revealFallback();
      console.warn('No se pudo cargar la animación 3D.', error);
    } finally {
      if (button) button.disabled = root.classList.contains('ship-intro-running');
    }
  }

  button?.addEventListener('click', () => loadFlight(true));

  if (!reduced.matches) {
    loadFlight(false);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !flight && !reduced.matches) {
      loadFlight(false);
    }
  });

  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      revealFallback();
    } else {
      root.classList.add('ship-intro-ready');
      loadFlight(false);
    }
  });
})();
