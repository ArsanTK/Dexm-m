// ---------- header on scroll ----------
const header = document.getElementById('siteHeader');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---------- scroll reveal ----------
const rvEls = document.querySelectorAll('.rv');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  rvEls.forEach((el) => io.observe(el));
} else {
  rvEls.forEach((el) => el.classList.add('in'));
}

// ---------- mobile nav ----------
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const navScrim = document.getElementById('navScrim');

function closeNav() {
  primaryNav?.classList.remove('open');
  navScrim?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}
function toggleNav() {
  const isOpen = primaryNav?.classList.toggle('open');
  navScrim?.classList.toggle('open', !!isOpen);
  menuToggle?.setAttribute('aria-expanded', String(!!isOpen));
}
menuToggle?.addEventListener('click', toggleNav);
navScrim?.addEventListener('click', closeNav);
primaryNav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));

// ---------- contact modal ----------
const modalScrim = document.getElementById('contactModal');
const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
const openTriggers = document.querySelectorAll('[data-open-modal]');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function openModal(e) {
  e?.preventDefault();
  modalScrim?.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('cf-name')?.focus(), 200);
}
function closeModal() {
  modalScrim?.classList.remove('open');
  document.body.style.overflow = '';
}
openTriggers.forEach((btn) => btn.addEventListener('click', openModal));
modalCloseBtns.forEach((btn) => btn.addEventListener('click', closeModal));
modalScrim?.addEventListener('click', (e) => {
  if (e.target === modalScrim) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ---------- form submission (FormSubmit.co — static-site friendly, no backend required) ----------
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    formStatus.className = 'form-status';

    try {
      const formData = new FormData(contactForm);
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        formStatus.textContent = 'Message sent. We will be in touch shortly.';
        formStatus.className = 'form-status show ok';
        contactForm.reset();
        setTimeout(closeModal, 2200);
      } else {
        throw new Error('Request failed');
      }
    } catch (err) {
      formStatus.textContent = 'Something went wrong. Please email info@dexm-m.com directly.';
      formStatus.className = 'form-status show err';
    } finally {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
    }
  });
}
