/* js/gallery.js */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilters();
  initLightbox();
});

/**
 * Filter gallery elements based on categories
 */
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length === 0 || galleryItems.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active state in buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Filter items
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // Force reflow for transitions
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300); // match transition time
        }
      });
    });
  });
}

/**
 * Lightbox Modal functionality for image visualization
 */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (galleryItems.length === 0) return;

  // Create lightbox markup programmatically if it doesn't exist
  let lightbox = document.querySelector('.lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Visor de imágenes');
    lightbox.innerHTML = `
      <div class="lightbox-content-wrapper">
        <button class="lightbox-close" aria-label="Cerrar">&times;</button>
        <img class="lightbox-img" src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  // Open Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const img = item.querySelector('.gallery-item-img');
      const title = item.querySelector('.gallery-item-title');

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Imagen de galería';
        lightboxCaption.textContent = title ? title.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
      }
    });
  });

  // Close Lightbox function
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore page scrolling
    // Clear sources
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    }, 300);
  };

  // Close on click close button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Close on click outside content (backdrop)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
