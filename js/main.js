/* ═══════════════════════════════════════════════
   HV REPUESTOS — main.js
   Vanilla JS · Sin dependencias
═══════════════════════════════════════════════ */

'use strict';

/* ── Año dinámico en el footer ─────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── Cards de productos → WhatsApp con mensaje por categoría ─ */
const WA_BASE = 'https://wa.me/541179715000?text=';

const productMessages = [
  'Hola%2C%20quiero%20consultar%20sobre%20*Tren%20Delantero*%20(r%C3%B3tulas%2C%20bujes%2C%20amortiguadores).',
  'Hola%2C%20quiero%20consultar%20sobre%20*Frenos*%20(pastillas%2C%20discos%2C%20tambores).',
  'Hola%2C%20quiero%20consultar%20sobre%20*Encendido*%20(buj%C3%ADas%2C%20cables%2C%20bobinas).',
  'Hola%2C%20quiero%20consultar%20sobre%20*Kit%20de%20Distribuci%C3%B3n*.',
  'Hola%2C%20quiero%20consultar%20sobre%20*Radiadores*.',
  'Hola%2C%20quiero%20consultar%20sobre%20*Aceites*%20para%20mi%20veh%C3%ADculo.',
  'Hola%2C%20quiero%20consultar%20sobre%20*Filtros*%20(aceite%2C%20aire%2C%20combustible).',
  'Hola%2C%20quiero%20consultar%20sobre%20*Bater%C3%ADas*.',
  'Hola%2C%20quiero%20consultar%20sobre%20*Faros%20y%20%C3%93pticas*.',
  'Hola%2C%20quiero%20consultar%20sobre%20*Paragolpes*.',
  'Hola%2C%20quiero%20consultar%20sobre%20*Autopartes*%20en%20general.',
];

document.querySelectorAll('.product-card').forEach((card, i) => {
  const msg = productMessages[i] || productMessages[productMessages.length - 1];

  // Hacer toda la card clickeable
  card.style.cursor = 'pointer';
  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Consultar por WhatsApp: ${card.querySelector('.product-card__title')?.textContent}`);

  // Agregar chip "Consultar →"
  if (!card.querySelector('.product-card__action')) {
    const chip = document.createElement('a');
    chip.href        = WA_BASE + msg;
    chip.target      = '_blank';
    chip.rel         = 'noopener';
    chip.className   = 'product-card__action';
    chip.textContent = 'Consultar →';
    chip.addEventListener('click', e => e.stopPropagation());
    card.appendChild(chip);
  }

  // Click en la card entera
  card.addEventListener('click', (e) => {
    if (!e.target.closest('a')) {
      window.open(WA_BASE + msg, '_blank', 'noopener');
    }
  });

  // Teclado
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.open(WA_BASE + msg, '_blank', 'noopener');
    }
  });
});


/* ── Navbar: clase .scrolled al hacer scroll ─ */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // ejecutar al cargar


/* ── Menú mobile (hamburguesa) ─────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

if (navToggle && navMenu) {

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    // Previene scroll del body cuando el menú está abierto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar menú al hacer click en un link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
    });
  });

  // Cerrar menú al hacer click fuera
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });
}


/* ── Animación de entrada para las cards ───── */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // se anima solo una vez
    }
  });
}, observerOptions);

// Observar cards de productos e info-blocks
const animEls = document.querySelectorAll('.product-card, .info-block');
animEls.forEach((el, i) => {
  el.style.setProperty('--delay', `${i * 60}ms`);
  el.classList.add('fade-up');
  observer.observe(el);
});

// Fallback: si el observer no disparó en 1.5s, mostrar todo igual
setTimeout(() => {
  animEls.forEach(el => el.classList.add('visible'));
}, 1500);


/* ── Botón flotante WhatsApp: ocultar/mostrar ─ */
const waFloat = document.querySelector('.wa-float');

if (waFloat) {
  // Aparece después de bajar un poco
  let floatVisible = false;

  function toggleFloat() {
    const shouldShow = window.scrollY > 300;
    if (shouldShow !== floatVisible) {
      floatVisible = shouldShow;
      waFloat.style.opacity    = shouldShow ? '1' : '0';
      waFloat.style.transform  = shouldShow ? 'scale(1)' : 'scale(0.8)';
      waFloat.style.pointerEvents = shouldShow ? 'all' : 'none';
    }
  }

  // Estado inicial: oculto
  waFloat.style.transition   = 'opacity 0.3s ease, transform 0.3s ease';
  waFloat.style.opacity      = '0';
  waFloat.style.transform    = 'scale(0.8)';
  waFloat.style.pointerEvents = 'none';

  window.addEventListener('scroll', toggleFloat, { passive: true });
  toggleFloat();
}
