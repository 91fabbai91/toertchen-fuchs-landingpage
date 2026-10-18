import './style.css';
import { initLanguage } from './i18n';
import { initNavigation } from './navigation';
import { initContactForm } from './form';
import { populateFormHiddenFields, sendPageTracking } from './tracking';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize language dictionary & bind DOM
  initLanguage();

  // 2. Set up left-side navigation, scroll-spy, mobile drawer, and modals
  initNavigation();

  // 3. Populate form hidden fields (loc-id, device) from URL & session
  populateFormHiddenFields();

  // 4. Initialize AJAX contact form with anti-spam honeypot
  initContactForm();

  // 5. Dispatch non-blocking page-view tracking event
  sendPageTracking();
});
