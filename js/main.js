/* ============================================
   TimeWitness — Main Controller
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSmoothScroll();
  initMobileMenu();
  initAccordion();
});

/* ── Header Scroll Behavior ── */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 60) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ── Smooth Scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const headerH = document.querySelector('.site-header')?.offsetHeight || 80;
        const y = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });

        // Close mobile menu if open
        document.querySelector('.header-nav')?.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ── Active Nav ── */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header-nav a');
  const headerH = 100;

  let current = '';

  sections.forEach(section => {
    const top = section.offsetTop - headerH - 50;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('is-active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('is-active');
    }
  });
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.header-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    btn.setAttribute('aria-expanded', isOpen);
  });
}

/* ── Accordion ── */
function initAccordion() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('is-open');

      // Close all in same group
      item.closest('.accordion-group')?.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('is-open');
      });

      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });
}

/* ── Modal System ── */
document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('modal-overlay');
  if (!modalOverlay) return;

  const openModal = (modalId) => {
    const modal = document.getElementById(`modal-${modalId}`);
    if (modal) {
      modalOverlay.classList.add('is-active');
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeAllModals = () => {
    modalOverlay.classList.remove('is-active');
    document.querySelectorAll('.modal.is-active').forEach(modal => {
      modal.classList.remove('is-active');
    });
    document.body.style.overflow = '';
    
    // Reset waitlist form if closed
    setTimeout(() => {
      const waitlistFormContainer = document.getElementById('waitlist-form-container');
      const waitlistSuccessContainer = document.getElementById('waitlist-success-container');
      if (waitlistFormContainer && waitlistSuccessContainer) {
        waitlistFormContainer.style.display = 'block';
        waitlistSuccessContainer.style.display = 'none';
        document.getElementById('waitlist-form')?.reset();
      }
    }, 300); // Wait for transition
  };

  // Attach to data-modal buttons
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  // Attach to close buttons
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Close on overlay click
  modalOverlay.addEventListener('click', closeAllModals);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  /* Waitlist Form Submission */
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate API call
      const btn = waitlistForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '...';
      btn.disabled = true;

      setTimeout(() => {
        document.getElementById('waitlist-form-container').style.display = 'none';
        document.getElementById('waitlist-success-container').style.display = 'block';
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 800);
    });
  }

  /* ── Category Filter System ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');

  if (filterBtns.length > 0 && filterItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('is-active'));
        // Add active class to clicked button
        btn.classList.add('is-active');

        const filterValue = btn.getAttribute('data-filter');

        filterItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.classList.remove('is-hidden');
            setTimeout(() => {
              item.style.position = 'relative';
            }, 300); // Wait for fade out of other elements before taking up space
          } else {
            item.classList.add('is-hidden');
            // Remove from flow immediately so grid re-arranges
            item.style.position = 'absolute';
          }
        });
      });
    });
  }
});
