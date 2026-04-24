/* ============================================
   TimeWitness — Form Handling
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initWaitlistForm();
  initOrgForm();
});

function initWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate
    const email = form.querySelector('#wl-email');
    const name = form.querySelector('#wl-name');
    let valid = true;

    clearErrors(form);

    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      valid = false;
    }

    if (!email.value.trim() || !isEmail(email.value)) {
      showError(email, 'Please enter a valid email');
      valid = false;
    }

    const consent = form.querySelector('#wl-consent');
    if (consent && !consent.checked) {
      showError(consent, 'Please agree to receive updates');
      valid = false;
    }

    if (!valid) return;

    // Simulate submission
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    setTimeout(() => {
      form.style.display = 'none';
      const success = document.getElementById('waitlist-success');
      if (success) {
        success.classList.add('is-visible');
      }
    }, 1200);
  });
}

function initOrgForm() {
  const form = document.getElementById('org-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = form.querySelector('#org-email');
    const name = form.querySelector('#org-name');
    let valid = true;

    clearErrors(form);

    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      valid = false;
    }

    if (!email.value.trim() || !isEmail(email.value)) {
      showError(email, 'Please enter a valid work email');
      valid = false;
    }

    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    setTimeout(() => {
      form.style.display = 'none';
      const success = document.getElementById('org-success');
      if (success) {
        success.classList.add('is-visible');
      }
    }, 1200);
  });
}

/* ── Helpers ── */
function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function showError(input, msg) {
  const group = input.closest('.form-group') || input.parentElement;
  let err = group.querySelector('.form-error');
  if (!err) {
    err = document.createElement('div');
    err.className = 'form-error';
    group.appendChild(err);
  }
  err.textContent = msg;
  input.style.borderColor = 'var(--error)';
}

function clearErrors(form) {
  form.querySelectorAll('.form-error').forEach(e => e.remove());
  form.querySelectorAll('input, select, textarea').forEach(i => {
    i.style.borderColor = '';
  });
}
