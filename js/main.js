/* js/main.js */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollEffects();
  initLazyLoading();
  initWhatsApp();
});

/**
 * Hamburguer mobile menu toggle and scrolled header background
 */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Toggle aria-expanded for accessibility
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle) navToggle.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Change header styling on scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check in case page starts scrolled
}

/**
 * Intersection Observer for scroll animations (fade in / slide up)
 */
function initScrollEffects() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // Animates only once
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: make elements visible if browser doesn't support observer
    animatedElements.forEach(el => el.classList.add('animated'));
  }
}

/**
 * Native lazy loading helper (if needed for older browsers, otherwise HTML handles it)
 */
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Dynamically load lazyload script if not supported
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
}

/**
 * Injects a floating WhatsApp button on all pages
 */
function initWhatsApp() {
  if (document.querySelector('.whatsapp-float')) return;

  const waButton = document.createElement('a');
  waButton.href = 'https://wa.me/34653796029?text=¡Hola!%20Me%20gustaría%20recibir%20más%20información%20sobre%20el%20Club%20Tenis%20Mesa%20Alcoy.';
  waButton.className = 'whatsapp-float';
  waButton.target = '_blank';
  waButton.rel = 'noopener noreferrer';
  waButton.setAttribute('aria-label', 'Contactar por WhatsApp');

  // WhatsApp SVG Icon
  waButton.innerHTML = `
    <svg class="whatsapp-icon" viewBox="0 0 24 24">
      <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.457 3.473 1.328 4.984l-1.41 5.15 5.27-1.383c1.467.8 3.11 1.22 4.8 1.22h.005c5.505 0 9.988-4.48 9.988-9.988C22 6.482 17.518 2 12.012 2zm6.347 14.152c-.26.732-1.503 1.34-2.073 1.42-.516.07-1.19.103-1.92-.128-.432-.137-1.077-.384-1.843-.715-3.266-1.41-5.362-4.733-5.525-4.95-.163-.217-1.31-1.745-1.31-3.328 0-1.583.83-2.36 1.127-2.67.297-.31.65-.387.868-.387.217 0 .434.003.623.01.2.008.472-.077.737.56.264.64.9 2.195.98 2.36.08.163.13.355.02.576-.112.22-.167.355-.333.553-.165.197-.348.44-.497.59-.163.167-.333.348-.143.673.19.324.843 1.39 1.81 2.253.967.863 1.78 1.13 2.03 1.253.25.123.396.105.545-.065.148-.17.643-.748.815-.998.17-.25.343-.21.576-.123.233.086 1.48.7 1.734.827.255.128.425.19.488.3.064.11.064.637-.197 1.37z"/>
    </svg>
  `;

  document.body.appendChild(waButton);
}

