const reader = document.querySelector('[data-pdf-reader]');

if (reader) {
  const image = reader.querySelector('.pdf-stage img');
  const stage = reader.querySelector('.pdf-stage');
  const previous = reader.querySelector('[data-previous]');
  const next = reader.querySelector('[data-next]');
  const input = reader.querySelector('[data-page]');
  const total = reader.querySelector('[data-total]');
  const zoom = reader.querySelector('[data-zoom]');
  const status = reader.querySelector('[data-status]');
  const pageCount = Number(reader.dataset.totalPages);
  let currentPage = 1;
  let resizeTimer;
  let revision = 0;

  total.textContent = `/ ${pageCount}`;
  input.max = pageCount;
  input.disabled = false;
  zoom.disabled = false;

  function renderPage() {
    const ticket = ++revision;
    previous.disabled = currentPage === 1;
    next.disabled = currentPage === pageCount;
    input.value = currentPage;
    image.alt = `Página ${currentPage} del manual de cuidados PAM`;
    const available = Math.max(100, Math.floor(stage.clientWidth - 26));
    image.style.width = `${available * Number(zoom.value)}px`;
    stage.setAttribute('aria-busy', 'true');
    status.textContent = `Abriendo página ${currentPage}…`;
    const source = new URL(`${reader.dataset.pages}page-${String(currentPage).padStart(2, '0')}.jpg`, document.baseURI);
    const preload = new Image();
    preload.onload = () => {
      if (ticket !== revision) return;
      image.src = source.href;
      stage.scrollTop = 0;
      stage.scrollLeft = 0;
      status.textContent = `Página ${currentPage} de ${pageCount}`;
      stage.setAttribute('aria-busy', 'false');
    };
    preload.onerror = () => {
      if (ticket !== revision) return;
      status.textContent = 'No se pudo mostrar esta página. Prueba con otra.';
      stage.setAttribute('aria-busy', 'false');
    };
    preload.src = source.href;
  }

  function goToPage(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) { input.value = currentPage; return; }
    currentPage = Math.max(1, Math.min(pageCount, Math.trunc(parsed) || 1));
    renderPage();
  }
  previous.addEventListener('click', () => goToPage(currentPage - 1));
  next.addEventListener('click', () => goToPage(currentPage + 1));
  input.addEventListener('change', () => goToPage(input.value));
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); goToPage(input.value); }
  });
  zoom.addEventListener('change', renderPage);
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderPage, 150);
  }).observe(stage);
  renderPage();
}
