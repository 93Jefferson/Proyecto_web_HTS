/**
 * ==========================================================================
 * PORTAFOLIO WEB PERSONAL - JAVASCRIPT GLOBAL (main.js)
 * Funcionalidad compartida en todas las páginas:
 * 1. Control del menú móvil (menú hamburguesa)
 * 2. Detección automática del enlace activo de navegación
 * 3. Actualización dinámica del año en el pie de página
 * 4. Sistema de acordeones móviles (contenido desplegable <= 768px)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. MENÚ MÓVIL (HAMBURGUESA)
  // ------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu    = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 2. ENLACE ACTIVO DE NAVEGACIÓN
  // ------------------------------------------------------------------------
  const path = window.location.pathname;
  let currentPage = path.substring(path.lastIndexOf('/') + 1);
  if (currentPage === '' || currentPage === '/') currentPage = 'index.html';

  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPage);
  });

  // ------------------------------------------------------------------------
  // 3. AÑO DINÁMICO EN EL PIE DE PÁGINA
  // ------------------------------------------------------------------------
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ------------------------------------------------------------------------
  // 4. SISTEMA DE ACORDEONES MÓVILES
  //    Se activa solo en pantallas <= 768px.
  //    Convierte tarjetas y secciones en paneles desplegables tocables.
  // ------------------------------------------------------------------------

  /**
   * SVG de flecha para el botón toggle del acordeón.
   */
  const CHEVRON_SVG = `<svg class="accordion-chevron" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

  /**
   * Configuraciones de acordeón: define qué tarjetas se convierten
   * y cuáles son sus cabeceras y cuerpos de contenido.
   *
   * headerSelector : elemento que actúa como disparador del toggle
   * bodySelector   : elemento cuyo contenido se colapsa / expande
   *                  Si es null, se recogen todos los hijos siguientes al header
   * label          : texto accesible para el botón toggle
   * openByDefault  : si la primera tarjeta del grupo empieza abierta
   */
  const ACCORDION_CONFIGS = [
    {
      selector     : '.highlight-card',
      headerSelector: '.highlight-header',
      bodySelector  : null,
      label         : 'Ver detalle de especialidad',
      openByDefault : false
    },
    {
      selector     : '.skill-category',
      headerSelector: '.skill-category-title',
      bodySelector  : '.skills-list',
      label         : 'Ver habilidades',
      openByDefault : false
    },
    {
      selector     : '.project-card',
      headerSelector: '.project-header-bar',
      bodySelector  : '.project-body',
      label         : 'Ver detalle del proyecto',
      openByDefault : false
    },
    {
      selector     : '.channel-card',
      headerSelector: '.channel-header',
      bodySelector  : null,
      label         : 'Ver canal de contacto',
      openByDefault : false
    },
    {
      selector     : '.timeline-item',
      headerSelector: '.timeline-title',
      bodySelector  : null,
      label         : 'Ver descripción',
      openByDefault : false
    }
  ];

  // ── Instancias activas para limpiar al pasar a escritorio ──
  const activeAccordions = [];

  /**
   * Inicializa el sistema de acordeones en modo móvil.
   */
  function initMobileAccordions() {
    if (window.innerWidth > 768) return;

    ACCORDION_CONFIGS.forEach(config => {
      const cards = document.querySelectorAll(config.selector);

      cards.forEach((card, idx) => {
        // Evitar doble inicialización
        if (card.dataset.accordionInit === '1') return;

        const header = card.querySelector(config.headerSelector);
        if (!header) return;

        // ── Localizar o crear el contenedor del cuerpo ──
        let body;
        if (config.bodySelector) {
          body = card.querySelector(config.bodySelector);
        } else {
          // Recoger todos los nodos hermanos que siguen al header
          body = document.createElement('div');
          body.className = 'accordion-auto-body';
          const siblings = Array.from(card.children);
          const headerIdx = siblings.indexOf(header);
          siblings.slice(headerIdx + 1).forEach(child => body.appendChild(child));
          if (body.children.length === 0) return; // nada que colapsar
          card.appendChild(body);
        }

        if (!body) return;

        // ── Marcar el body como panel colapsable ──
        body.classList.add('accordion-panel');

        // ── Botón toggle ──
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'accordion-toggle';
        btn.setAttribute('aria-label', config.label);
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = CHEVRON_SVG;
        header.appendChild(btn);

        // ── Estilo interactivo del header ──
        header.classList.add('accordion-trigger');
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');

        // ── Estado inicial: primera tarjeta abierta si openByDefault ──
        if (config.openByDefault && idx === 0) {
          _openPanel(card, body, btn);
        }

        // ── Eventos ──
        function handleToggle(e) {
          e.stopPropagation();
          const isOpen = card.classList.contains('accordion-open');
          if (isOpen) {
            _closePanel(card, body, btn);
          } else {
            _openPanel(card, body, btn);
          }
        }

        header.addEventListener('click', handleToggle);
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e);
          }
        });

        card.dataset.accordionInit = '1';
        activeAccordions.push({ card, body, btn, header });
      });
    });
  }

  /**
   * Desmonta todos los acordeones (usado al pasar a pantalla escritorio).
   */
  function destroyMobileAccordions() {
    activeAccordions.forEach(({ card, body, btn, header }) => {
      // Restaurar visibilidad plena
      body.classList.remove('accordion-panel', 'accordion-open');
      body.style.maxHeight = '';

      // Reintegrar hijos auto-creados al padre
      if (body.classList.contains('accordion-auto-body') || body.dataset.autoCreated) {
        Array.from(body.children).forEach(child => card.appendChild(child));
        body.remove();
      }

      // Eliminar botón y clases del trigger
      btn.remove();
      header.classList.remove('accordion-trigger');
      header.removeAttribute('role');
      header.removeAttribute('tabindex');

      card.classList.remove('accordion-open');
      delete card.dataset.accordionInit;
    });
    activeAccordions.length = 0;
  }

  /** Abre un panel con animación de max-height */
  function _openPanel(card, body, btn) {
    card.classList.add('accordion-open');
    body.classList.add('accordion-open');
    body.style.maxHeight = body.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
  }

  /** Cierra un panel con animación de max-height */
  function _closePanel(card, body, btn) {
    card.classList.remove('accordion-open');
    body.classList.remove('accordion-open');
    body.style.maxHeight = '0';
    btn.setAttribute('aria-expanded', 'false');
  }

  // ── Lanzar acordeones al cargar ──
  initMobileAccordions();

  // ── Reaccionar al cambio de tamaño de ventana ──
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        destroyMobileAccordions();
      } else if (activeAccordions.length === 0) {
        initMobileAccordions();
      }
    }, 150);
  });

});
