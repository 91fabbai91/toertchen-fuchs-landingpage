import { populateFormHiddenFields } from './tracking';
import { translations, getLanguage } from './i18n';

const pageLoadTime = Date.now();
const MIN_SUBMISSION_TIME_MS = 2500;

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('#contact-form');
  if (!form) return;

  const submitBtn = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]'
  );
  const statusContainer =
    document.querySelector<HTMLDivElement>('#form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const lang = getLanguage();
    const dict = translations[lang];

    // 1. Time-to-submit check (bot protection)
    const elapsed = Date.now() - pageLoadTime;
    if (elapsed < MIN_SUBMISSION_TIME_MS) {
      // Rapid automated submission detected; reject silently
      showStatus(
        'error',
        dict.form_error_title,
        'Bitte nimm dir einen Moment Zeit zum Ausfüllen.'
      );
      return;
    }

    // 2. Netlify Honeypot check
    const botField = form.querySelector<HTMLInputElement>(
      'input[name="bot-field"]'
    );
    if (botField && botField.value.trim() !== '') {
      // Bot trapped in honeypot; simulate fake success to dismiss bot
      showStatus('success', dict.form_success_title, dict.form_success_desc);
      form.reset();
      return;
    }

    // 3. Re-ensure hidden tracking parameters are fresh
    populateFormHiddenFields();

    // 4. Prepare UI loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>${dict.form_submitting}</span>
      `;
    }

    try {
      const formData = new FormData(form);
      // Ensure 'form-name' is included for Netlify Forms
      if (!formData.has('form-name')) {
        formData.append('form-name', 'contact');
      }

      const encodedBody = new URLSearchParams();
      formData.forEach((value, key) => {
        encodedBody.append(key, value.toString());
      });

      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: encodedBody.toString(),
      });

      if (response.ok || response.status === 200 || response.status === 302) {
        showStatus('success', dict.form_success_title, dict.form_success_desc);
        form.reset();
        populateFormHiddenFields();
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch {
      // In local dev without Netlify runtime, display success simulation or error
      // If running on localhost / vite dev server, let the user know submission succeeded in test mode
      if (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      ) {
        showStatus(
          'success',
          dict.form_success_title + ' (Local Dev Test)',
          dict.form_success_desc
        );
        form.reset();
        populateFormHiddenFields();
      } else {
        showStatus('error', dict.form_error_title, dict.form_error_desc);
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        submitBtn.innerHTML = `
          <span>${dict.form_submit}</span>
          <svg class="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        `;
      }
    }
  });

  function showStatus(
    type: 'success' | 'error',
    title: string,
    message: string
  ): void {
    if (!statusContainer) return;

    const isSuccess = type === 'success';
    statusContainer.className = `p-6 rounded-2xl border transition-all duration-300 ${
      isSuccess
        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100'
        : 'bg-rose-950/40 border-rose-500/30 text-rose-100'
    }`;

    statusContainer.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="p-2 rounded-xl ${
          isSuccess
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/20 text-rose-400'
        }">
          ${
            isSuccess
              ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
              : '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
          }
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-lg text-white mb-1">${title}</h4>
          <p class="text-sm opacity-90 leading-relaxed">${message}</p>
        </div>
      </div>
    `;
    statusContainer.classList.remove('hidden');
    statusContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
