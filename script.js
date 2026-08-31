// ---------- header on scroll ----------
const header = document.getElementById('siteHeader');

if (header) {
  const onScroll = () =>
    header.classList.toggle('scrolled', window.scrollY > 20);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---------- scroll reveal ----------
const rvEls = document.querySelectorAll('.rv');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

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

primaryNav?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', closeNav);
});

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

  setTimeout(() => {
    document.getElementById('cf-name')?.focus();
  }, 200);
}

function closeModal() {
  modalScrim?.classList.remove('open');
  document.body.style.overflow = '';
}

openTriggers.forEach((btn) =>
  btn.addEventListener('click', openModal)
);

modalCloseBtns.forEach((btn) =>
  btn.addEventListener('click', closeModal)
);

modalScrim?.addEventListener('click', (e) => {
  if (e.target === modalScrim) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ---------- contact form ----------
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    formStatus.className = 'form-status';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      formStatus.textContent =
        'Message sent. We will be in touch shortly.';

      formStatus.className = 'form-status show ok';

      contactForm.reset();

      setTimeout(closeModal, 2200);

    } catch (err) {
      formStatus.textContent =
        'Something went wrong. Please email info@dexm-m.com directly.';

      formStatus.className = 'form-status show err';

    } finally {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
    }
  });
}

// ---------- KAS contact card ----------
const saveContactBtn = document.getElementById('saveContactBtn');

if (saveContactBtn) {
  const card = saveContactBtn.closest('.card');

  const contact = {
    name: 'Kas T. Kallie',
    company: 'DeXM Management',
    title: 'Operating Partner',
    phone: '+1 917 523 0461',
    email: 'kas@dexm-m.com',
    website: 'https://dexm-m.com',
    linkedin: 'https://linkedin.com'
  };

  // Текст для копирования всей визитки целиком
  const allContactText = [
    contact.name,
    contact.company,
    contact.title,
    '',
    `Phone: ${contact.phone}`,
    `Email: ${contact.email}`,
    `Website: ${contact.website}`,
    `LinkedIn: ${contact.linkedin}`
  ].join('\n');

  // Rich HTML-версия для буфера обмена (при вставке в почту)
  const allContactHtml = `
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;color:#222">
      <tr><td style="padding:4px 16px 4px 0;font-weight:600">Name</td><td style="padding:4px 0">Kas T. Kallie</td></tr>
      <tr><td style="padding:4px 16px 4px 0;font-weight:600">Company</td><td style="padding:4px 0">DeXM Management</td></tr>
      <tr><td style="padding:4px 16px 4px 0;font-weight:600">Title</td><td style="padding:4px 0">Operating Partner</td></tr>
      <tr><td style="padding:4px 16px 4px 0;font-weight:600">Phone</td><td style="padding:4px 0">+1 917 523 0461</td></tr>
      <tr><td style="padding:4px 16px 4px 0;font-weight:600">Email</td><td style="padding:4px 0">kas@dexm-m.com</td></tr>
      <tr><td style="padding:4px 16px 4px 0;font-weight:600">Website</td><td style="padding:4px 0">https://dexm-m.com</td></tr>
      <tr><td style="padding:4px 16px 4px 0;font-weight:600">LinkedIn</td><td style="padding:4px 0">https://linkedin.com</td></tr>
    </table>
  `;

  // Универсальная функция копирования текста
  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    document.execCommand('copy');
    textarea.remove();
  }

  // Функция полного копирования по кнопке Save Contact
  async function copyEverything() {
    try {
      if (navigator.clipboard?.write && window.ClipboardItem) {
        const item = new ClipboardItem({
          'text/html': new Blob([allContactHtml], { type: 'text/html' }),
          'text/plain': new Blob([allContactText], { type: 'text/plain' })
        });
        await navigator.clipboard.write([item]);
      } else {
        await copyText(allContactText);
      }

      const label = saveContactBtn.querySelector('.action-label');
      const original = label.textContent;
      label.textContent = 'Copied ✓';
      setTimeout(() => { label.textContent = original; }, 1800);

    } catch (err) {
      console.error('Could not copy contact information:', err);
    }
  }

  saveContactBtn.addEventListener('click', copyEverything);

  // Копирование отдельных строк (клик по конкретному значению)
  card.querySelectorAll('.action-value').forEach((value) => {
    value.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const row = value.closest('.action-btn');
      let text = value.textContent.trim();
      const href = row?.getAttribute('href') || '';

      if (href.startsWith('tel:')) text = href.replace(/^tel:/, '');
      if (href.startsWith('mailto:')) text = href.replace(/^mailto:/, '');
      if (href.startsWith('http')) text = href;

      try {
        await copyText(text);
        const original = value.textContent;
        value.textContent = 'Copied ✓';
        setTimeout(() => { value.textContent = original; }, 1200);
      } catch (err) {
        console.error('Could not copy value:', err);
      }
    });
  });
}
