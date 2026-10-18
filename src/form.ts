import { populateFormHiddenFields } from './tracking';
import { translations, getLanguage } from './i18n';
import { compressImage, formatFileSize } from './imageCompression';
import type { CompressionResult } from './imageCompression';

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

  // Photo upload DOM elements
  const photoInput = form.querySelector<HTMLInputElement>('#form-photo');
  const photoUploadLabel = form.querySelector<HTMLLabelElement>(
    '#photo-upload-label'
  );
  const previewCard = form.querySelector<HTMLDivElement>('#photo-preview-card');
  const previewImg = form.querySelector<HTMLImageElement>('#photo-preview-img');
  const previewName = form.querySelector<HTMLParagraphElement>(
    '#photo-preview-name'
  );
  const previewSize = form.querySelector<HTMLParagraphElement>(
    '#photo-preview-size'
  );
  const removeBtn = form.querySelector<HTMLButtonElement>('#photo-remove-btn');

  // Active compressed image state
  let activeCompressedPhoto: { blob: Blob; fileName: string } | null = null;
  let activePreviewUrl: string | null = null;

  function resetPhotoState(): void {
    activeCompressedPhoto = null;
    if (activePreviewUrl) {
      URL.revokeObjectURL(activePreviewUrl);
      activePreviewUrl = null;
    }
    if (photoInput) {
      photoInput.value = '';
    }
    if (previewCard) {
      previewCard.classList.add('hidden');
    }
    if (photoUploadLabel) {
      photoUploadLabel.classList.remove('hidden');
      const lang = getLanguage();
      const dict = translations[lang];
      photoUploadLabel.innerHTML = `
        <svg class="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span data-i18n="form_photo_btn">${dict.form_photo_btn}</span>
      `;
    }
  }

  // Bind photo file selection & instant client-side compression
  if (photoInput) {
    photoInput.addEventListener('change', async () => {
      const file = photoInput.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        return;
      }

      const lang = getLanguage();
      const dict = translations[lang];

      // Show compressing spinner on label
      if (photoUploadLabel) {
        photoUploadLabel.innerHTML = `
          <svg class="animate-spin h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span class="text-orange-300 font-semibold">${dict.form_photo_compressing}</span>
        `;
      }

      try {
        const result: CompressionResult = await compressImage(file, 1600, 0.82);
        const safeBaseName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_');
        activeCompressedPhoto = {
          blob: result.blob,
          fileName: `${safeBaseName || 'photo'}.jpg`,
        };

        if (activePreviewUrl) {
          URL.revokeObjectURL(activePreviewUrl);
        }
        activePreviewUrl = URL.createObjectURL(result.blob);

        if (previewImg) previewImg.src = activePreviewUrl;
        if (previewName) previewName.textContent = file.name;
        if (previewSize) {
          previewSize.textContent = `${formatFileSize(result.originalSize)} ➔ ${formatFileSize(result.compressedSize)}`;
        }

        if (photoUploadLabel) photoUploadLabel.classList.add('hidden');
        if (previewCard) previewCard.classList.remove('hidden');
      } catch (err) {
        console.error('Image compression error:', err);
        resetPhotoState();
      }
    });
  }

  // Bind remove button
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetPhotoState();
    });
  }

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
      resetPhotoState();
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

      // Attach client-compressed photo blob if available, otherwise delete empty file field
      if (activeCompressedPhoto) {
        formData.set(
          'photo',
          activeCompressedPhoto.blob,
          activeCompressedPhoto.fileName
        );
      } else {
        formData.delete('photo');
      }

      // Submit directly as multipart FormData (do not manually set Content-Type header so browser computes boundary)
      const response = await fetch('/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok || response.status === 200 || response.status === 302) {
        showStatus('success', dict.form_success_title, dict.form_success_desc);
        form.reset();
        resetPhotoState();
        populateFormHiddenFields();
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch {
      // In local dev without Netlify runtime, display success simulation or error
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
        resetPhotoState();
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
