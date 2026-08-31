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
function initContactCard() {
  const saveContactBtn = document.getElementById('saveContactBtn');
  const copyStatus = document.getElementById('copyStatus');

  if (!saveContactBtn) return;

  const contact = {
    name: 'Kas T. Kallie',
    company: 'DeXM Management',
    title: 'Operating Partner',
    phone: '+1 917 523 0461',
    email: 'kas@dexm-m.com',
    website: 'https://www.dexm-m.com',
    linkedin: 'https://www.linkedin.com/in/kaskallie'
  };

  // Copy everything
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
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  async function showCopyFeedback(element, duration = 1200) {
    const original = element.textContent;
    const originalColor = window.getComputedStyle(element).color;
    
    element.textContent = 'Copied ✓';
    element.style.color = 'var(--gold)';
    
    if (copyStatus) {
      copyStatus.classList.add('show');
    }
    
    setTimeout(() => {
      element.textContent = original;
      element.style.color = '';
      if (copyStatus) {
        copyStatus.classList.remove('show');
      }
    }, duration);
  }

  // Save Contact button - copy everything
  saveContactBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await copyText(allContactText);
      const valueSpan = saveContactBtn.querySelector('.action-value');
      if (valueSpan) {
        await showCopyFeedback(valueSpan, 1800);
      }
    } catch (err) {
      console.error('Could not copy contact information:', err);
    }
  });

  // Individual rows - copy specific values
  const actionBtns = document.querySelectorAll('.action-btn:not(.primary)');
  actionBtns.forEach((btn) => {
    const valueSpan = btn.querySelector('.action-value');
    if (valueSpan) {
      valueSpan.style.cursor = 'pointer';
      valueSpan.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        let textToCopy = valueSpan.textContent.trim();
        const href = btn.getAttribute('href') || '';

        // Extract clean values from links
        if (href.startsWith('tel:')) {
          textToCopy = href.replace(/^tel:/, '');
        } else if (href.startsWith('mailto:')) {
          textToCopy = href.replace(/^mailto:/, '');
        } else if (href.startsWith('http')) {
          textToCopy = href;
        }

        try {
          await copyText(textToCopy);
          await showCopyFeedback(valueSpan, 1200);
        } catch (err) {
          console.error('Could not copy value:', err);
        }
      });
    }
  });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactCard);
} else {
  initContactCard();
}
