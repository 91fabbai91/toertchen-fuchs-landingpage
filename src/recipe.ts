import './style.css';
import { initLanguage } from './i18n';
import {
  setupLanguageButtons,
  setupLegalModals,
  setupEmailObfuscation,
} from './navigation';
import { sendPageTracking } from './tracking';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize language dictionary & bind DOM
  initLanguage();

  // 2. Set up language switcher buttons
  setupLanguageButtons();

  // 3. Set up legal modals (Impressum & Privacy)
  setupLegalModals();

  // 4. Obfuscate email in modals
  setupEmailObfuscation();

  // 5. Send page tracking
  sendPageTracking();
});
