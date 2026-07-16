/* js/calendar.js */

document.addEventListener('DOMContentLoaded', () => {
  initCalendarFilters();
});

/**
 * Filter calendar list cards based on classification (competición, entrenamiento, social)
 */
function initCalendarFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.calendar-card');

  if (filterButtons.length === 0 || eventCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active states in buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Filter cards
      eventCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateX(-10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // matches CSS transitions
        }
      });
    });
  });
}
