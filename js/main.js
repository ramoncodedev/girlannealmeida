/* =========================================================
   Psicóloga Girlanne Almeida — Link bio
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Faixas animadas (marquee infinito) ----------
     Duplica o grupo de itens até cobrir a largura da tela
     e depois duplica tudo de novo, para o loop de -50% não ter emenda. */
  function buildMarquee(marquee) {
    var original = marquee.querySelector('.marquee__group');
    if (!original) return;

    // limpa clones de uma execução anterior (resize)
    marquee.querySelectorAll('.marquee__group[data-clone]').forEach(function (el) { el.remove(); });
    marquee.classList.remove('is-ready');

    var band = marquee.parentElement;
    var target = band.offsetWidth;
    var groupWidth = original.offsetWidth || 1;

    // primeira metade: grupos suficientes para cobrir a faixa
    var copies = Math.ceil(target / groupWidth);
    for (var i = 1; i < copies; i++) appendClone(marquee, original);

    // segunda metade: espelho da primeira
    var half = Array.prototype.slice.call(marquee.children);
    half.forEach(function (group) { appendClone(marquee, group); });

    // velocidade constante (~45px/s), independente do tamanho da tela
    var halfWidth = marquee.scrollWidth / 2;
    var speed = marquee.dataset.direction === 'right' ? 34 : 45;
    marquee.style.setProperty('--duration', (halfWidth / speed).toFixed(1) + 's');

    if (!reduceMotion) marquee.classList.add('is-ready');
  }

  function appendClone(marquee, group) {
    var clone = group.cloneNode(true);
    clone.setAttribute('data-clone', '');
    clone.setAttribute('aria-hidden', 'true');
    marquee.appendChild(clone);
  }

  function initMarquees() {
    document.querySelectorAll('.marquee').forEach(buildMarquee);
  }

  /* ---------- Aparição suave ao rolar ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Ano no rodapé ---------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Start ---------- */
  function start() {
    initYear();
    initReveal();
    // espera as fontes para medir a largura real das faixas
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(initMarquees);

    var lastWidth = window.innerWidth;
    var timer;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastWidth) return; // ignora barra de endereço do celular
      lastWidth = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(initMarquees, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
