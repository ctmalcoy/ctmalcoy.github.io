/* js/main.js */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollEffects();
  initLazyLoading();
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
