// Scroll only transforms a few bounded, decorative layers; no canvas or render loop at rest.
(() => {
  const scene = document.querySelector('.cosmic-background');
  if (!scene) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let current = 0;
  let target = 0;
  let scrollRange = 1;
  const write = progress => {
    const mobile = window.innerWidth <= 700;
    const depth = mobile ? 0.55 : 1;
    scene.style.setProperty('--cloud-x', `${-progress * 12 * depth}%`);
    scene.style.setProperty('--cloud-y', `${progress * 7 * depth}%`);
    scene.style.setProperty('--cloud-turn', `${-progress * 11 * depth}deg`);
    scene.style.setProperty('--near-x', `${progress * 11 * depth}%`);
    scene.style.setProperty('--near-y', `${-progress * 9 * depth}%`);
    scene.style.setProperty('--wisp-x', `${-progress * 8 * depth}%`);
    scene.style.setProperty('--wisp-y', `${-progress * 6 * depth}%`);
    scene.style.setProperty('--stars-y', `${-progress * 45 * depth}px`);
  };
  const tick = () => {
    frame = 0;
    if (reducedMotion.matches || document.hidden) return;
    current += (target - current) * 0.1;
    if (Math.abs(target - current) < 0.0005) current = target;
    write(current);
    if (current !== target) frame = requestAnimationFrame(tick);
  };
  const onScroll = () => {
    if (reducedMotion.matches || document.hidden) return;
    target = Math.min(1, Math.max(0, window.scrollY / scrollRange));
    if (!frame) frame = requestAnimationFrame(tick);
  };
  const measure = () => {
    scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    onScroll();
  };
  const syncMotion = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    scene.classList.toggle('is-paused', document.hidden || reducedMotion.matches);
    if (reducedMotion.matches) {
      current = target = 0;
      write(0);
    } else {
      measure();
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);
  // Filters, fonts and future project media can change the document's height.
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  syncMotion();
})();
