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
