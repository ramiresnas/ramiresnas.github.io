// Ano no rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Endpoint para envio de eventos
const EVENTS_ENDPOINT = 'https://semear-landing-page-back-end.onrender.com/events';

const sendEvent = async (eventName, eventParams = {}) => {
  try {
    await fetch(EVENTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        event_params: eventParams
      })
    });
  } catch (_) {}
};

// Contagem de carregamentos por usuário
const loadCount = Number(localStorage.getItem('page_load_count') || '0') + 1;
localStorage.setItem('page_load_count', String(loadCount));

// Evento de page load
sendEvent('page_load', {
  page_location: location.href,
  load_count: loadCount
});

// Métricas de performance ao finalizar o carregamento
window.addEventListener('load', () => {
  const [nav] = performance.getEntriesByType('navigation');
  const paints = performance.getEntriesByType('paint');
  const fcp = paints.find(p => p.name === 'first-contentful-paint');

  const metrics = nav ? {
    load_time_ms: Math.round(nav.loadEventEnd - nav.startTime),
    dcl_time_ms: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
    dom_interactive_ms: Math.round(nav.domInteractive - nav.startTime),
    transfer_size: nav.transferSize || 0,
    encoded_body_size: nav.encodedBodySize || 0,
    decoded_body_size: nav.decodedBodySize || 0
  } : {};
  if (fcp) metrics.fcp_ms = Math.round(fcp.startTime);

  sendEvent('page_performance', {
    page_location: location.href,
    ...metrics
  });
}, { once: true });

// Eventos de clique nos botões
const bindClick = (id, params) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', () => sendEvent(params.cta_id, {
    page_location: location.href,
    ...params
  }), { passive: true });
};

bindClick('btn-members', { cta_id: 'area_membros', destination: 'semearinvestimento.com.br/login' });
bindClick('btn-hero-inscrever', { cta_id: 'hero_inscrever', destination: '#oferta' });
bindClick('btn-hero-conteudo', { cta_id: 'hero_conteudo', destination: '#conteudo' });
bindClick('btn-oferta-comprar', { cta_id: 'oferta_comprar', destination: 'https://pay.kiwify.com.br/p9DVROK' });
bindClick('btn-final-comprar', { cta_id: 'final_comprar', destination: 'https://pay.kiwify.com.br/p9DVROK' });