import { setLanguage, translations, getLanguage } from './i18n';

export function initNavigation(): void {
  setupLanguageButtons();
  setupScrollSpy();
  setupMobileDrawer();
  setupLegalModals();
  setupEmailObfuscation();
  setupEasterEggUnlock();
  setupHashScrollHandler();
}

export function setupHashScrollHandler(): void {
  if (typeof window === 'undefined' || !window.location.hash) return;

  // Prevent browser history restoration from jumping to stale scroll positions
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const scrollToHashTarget = () => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.querySelector<HTMLElement>(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Execute after layout settles (DOM, fonts, images)
  if (document.readyState === 'complete') {
    setTimeout(scrollToHashTarget, 60);
  } else {
    window.addEventListener('load', () => setTimeout(scrollToHashTarget, 60));
  }
}

export function setupEasterEggUnlock(): void {
  document
    .querySelectorAll<HTMLAnchorElement>('a[href*="recipe"]')
    .forEach((link) => {
      link.addEventListener('click', () => {
        try {
          sessionStorage.setItem('tf_easter_egg_unlocked', '1');
        } catch {
          // Ignore storage exceptions
        }
      });
    });
}

export function setupLanguageButtons(): void {
  document.querySelectorAll<HTMLElement>('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang-btn');
      if (lang === 'de' || lang === 'en') {
        setLanguage(lang);
      }
    });
  });
}

function setupScrollSpy(): void {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const navLinks =
    document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]');

  if (!sections.length || !navLinks.length) return;

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active-nav-link');
            link.setAttribute('aria-current', 'true');
          } else {
            link.classList.remove('active-nav-link');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

function setupMobileDrawer(): void {
  const toggleBtn = document.querySelector<HTMLButtonElement>(
    '#mobile-menu-toggle'
  );
  const drawer = document.querySelector<HTMLDivElement>('#mobile-drawer');
  const closeBtn = document.querySelector<HTMLButtonElement>(
    '#mobile-drawer-close'
  );
  const backdrop = document.querySelector<HTMLDivElement>(
    '#mobile-drawer-backdrop'
  );
  const mobileLinks = drawer?.querySelectorAll('a');

  if (!toggleBtn || !drawer) return;

  function openDrawer(): void {
    drawer?.classList.remove('-translate-x-full');
    backdrop?.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');
  }

  function closeDrawer(): void {
    drawer?.classList.add('-translate-x-full');
    backdrop?.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
  }

  toggleBtn.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  mobileLinks?.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

export function setupLegalModals(): void {
  // Impressum modal
  const impressumBtn = document.querySelectorAll<HTMLElement>(
    '[data-modal-target="impressum-modal"]'
  );
  const impressumModal =
    document.querySelector<HTMLDivElement>('#impressum-modal');

  // Privacy modal
  const privacyBtn = document.querySelectorAll<HTMLElement>(
    '[data-modal-target="privacy-modal"]'
  );
  const privacyModal = document.querySelector<HTMLDivElement>('#privacy-modal');

  function openModal(modal: HTMLDivElement | null): void {
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.querySelector('.modal-panel')?.classList.remove('scale-95');
    document.body.classList.add('overflow-hidden');
  }

  function closeModal(modal: HTMLDivElement | null): void {
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('.modal-panel')?.classList.add('scale-95');
    document.body.classList.remove('overflow-hidden');
  }

  impressumBtn.forEach((b) =>
    b.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(impressumModal);
    })
  );

  privacyBtn.forEach((b) =>
    b.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    })
  );

  document
    .querySelectorAll<HTMLElement>('[data-modal-close]')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        closeModal(impressumModal);
        closeModal(privacyModal);
      });
    });

  // Close with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(impressumModal);
      closeModal(privacyModal);
    }
  });
}

export function setupEmailObfuscation(): void {
  // Fabian Baier, fabian.baier@gmx.de
  // We obfuscate the mailto link and display so web scrapers don't harvest it.
  const user = 'fabian.baier';
  const domain = 'gmx.de';
  const fullEmail = `${user}@${domain}`;

  const emailContainers = document.querySelectorAll<HTMLElement>(
    '[data-protected-email]'
  );
  emailContainers.forEach((container) => {
    // Render masked format initially
    container.textContent = `${user} [at] ${domain}`;

    container.addEventListener('click', () => {
      window.location.href = `mailto:${fullEmail}`;
    });
  });

  const copyButtons =
    document.querySelectorAll<HTMLButtonElement>('[data-copy-email]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(fullEmail);
        const dict = translations[getLanguage()];
        const originalText = btn.textContent;
        btn.textContent = dict.email_copied;
        btn.classList.add('bg-emerald-500/20', 'text-emerald-300');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('bg-emerald-500/20', 'text-emerald-300');
        }, 2500);
      } catch {
        // Fallback for older browsers
        window.prompt('E-Mail:', fullEmail);
      }
    });
  });
}
