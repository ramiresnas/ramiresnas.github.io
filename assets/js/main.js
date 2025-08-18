// Ano no rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Firebase Analytics (preencha com suas credenciais reais)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getAnalytics, logEvent, isSupported } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'G-XXXXXXXXXX'
};

const app = initializeApp(firebaseConfig);
let analytics = null;

const safeLog = (name, params = {}) => {
  try { if (analytics) logEvent(analytics, name, params); } catch (_) {}
};

isSupported().then(supported => {
  if (!supported) return;
  analytics = getAnalytics(app);

  // Contagem de carregamentos por usuário
  const loadCount = Number(localStorage.getItem('page_load_count') || '0') + 1;
  localStorage.setItem('page_load_count', String(loadCount));

  // Evento de page load
  safeLog('page_load', {
    page_title: document.title,
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

    safeLog('page_performance', metrics);
  }, { once: true });
});

// Eventos de clique nos botões
const bindClick = (id, params) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', () => safeLog('cta_click', params), { passive: true });
};

bindClick('btn-members', { cta_id: 'area_membros', destination: 'semearinvestimento.com.br' });
bindClick('btn-hero-inscrever', { cta_id: 'hero_inscrever', destination: '#oferta' });
bindClick('btn-hero-conteudo', { cta_id: 'hero_conteudo', destination: '#conteudo' });
bindClick('btn-oferta-comprar', { cta_id: 'oferta_comprar', destination: 'kiwify' });
bindClick('btn-final-comprar', { cta_id: 'final_comprar', destination: 'kiwify' });