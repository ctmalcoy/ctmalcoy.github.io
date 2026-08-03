/* js/gallery.js */

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initLightbox();
});

/**
 * Filter and paginate gallery elements
 */
function initGallery() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const paginationContainer = document.getElementById('gallery-pagination');
  const ITEMS_PER_PAGE = 12;
  let currentPage = 1;
  let activeFilter = 'all';

  if (galleryItems.length === 0) return;

  function renderGallery() {
    // 1. Filter items based on active category
    const filteredItems = galleryItems.filter(item => {
      const itemCategory = item.getAttribute('data-category');
      return activeFilter === 'all' || itemCategory === activeFilter;
    });

    // 2. Calculate pagination boundaries
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (currentPage > totalPages) {
      currentPage = Math.max(1, totalPages);
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // 3. Hide all, then show only the current page items with animations
    galleryItems.forEach(item => {
      item.style.display = 'none';
      item.style.opacity = '0';
      item.style.transform = 'scale(0.8)';
    });

    filteredItems.forEach((item, index) => {
      if (index >= startIndex && index < endIndex) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      }
    });

    // 4. Render pagination controls
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
      if (totalPages > 1) {
        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.className = `btn btn-outline-light ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.style.padding = '0.5rem 1rem';
        prevBtn.style.fontSize = '0.9rem';
        prevBtn.textContent = '« Ant';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
          currentPage--;
          renderGallery();
          scrollToGallery();
        });
        paginationContainer.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
          const pageBtn = document.createElement('button');
          pageBtn.className = `btn ${currentPage === i ? 'btn-accent' : 'btn-outline-light'}`;
          pageBtn.style.padding = '0.5rem 1rem';
          pageBtn.style.fontSize = '0.9rem';
          pageBtn.style.minWidth = '2.5rem';
          pageBtn.textContent = i;
          pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderGallery();
            scrollToGallery();
          });
          paginationContainer.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = `btn btn-outline-light ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.style.padding = '0.5rem 1rem';
        nextBtn.style.fontSize = '0.9rem';
        nextBtn.textContent = 'Sig »';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
          currentPage++;
          renderGallery();
          scrollToGallery();
        });
        paginationContainer.appendChild(nextBtn);
      }
    }
  }

  function scrollToGallery() {
    const gallerySection = document.querySelector('.filter-nav');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Set up event listeners for filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeFilter = button.getAttribute('data-filter');
      currentPage = 1; // Reset to page 1 on filter change
      renderGallery();
    });
  });

  // Perform initial render
  renderGallery();
}

/**
 * Lightbox Modal functionality for image visualization
 */
function initLightbox() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

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

  // Open Lightbox (using event delegation to support dynamic filter/pagination visibility changes)
  galleryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    
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
