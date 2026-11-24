/**
 * ==========================================================================
 * PORTAFOLIO WEB PERSONAL - JAVASCRIPT GLOBAL (main.js)
 * Funcionalidad compartida en todas las páginas:
 * 1. Control del menú móvil (menú hamburguesa)
 * 2. Detección automática del enlace activo de navegación
 * 3. Actualización dinámica del año en el pie de página
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. MENÚ MÓVIL (HAMBURGUESA)
  // ------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    // Alternar menú al hacer clic en el botón
    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Cerrar menú al hacer clic en cualquier enlace
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar menú al hacer clic fuera del encabezado
    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 2. ENLACE ACTIVO DE NAVEGACIÓN
  // ------------------------------------------------------------------------
  // Obtener el nombre del archivo actual desde la URL (por ejemplo: "about.html")
  const path = window.location.pathname;
  let currentPage = path.substring(path.lastIndexOf('/') + 1);

  // Si la ruta está vacía o es raíz "/", por defecto corresponde a "index.html"
  if (currentPage === '' || currentPage === '/') {
    currentPage = 'index.html';
  }

  // Buscar todos los enlaces con la clase .nav-link y activar el correspondiente
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ------------------------------------------------------------------------
  // 3. AÑO DINÁMICO EN EL PIE DE PÁGINA
  // ------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
