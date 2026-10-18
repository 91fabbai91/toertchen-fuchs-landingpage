import folding1De from './assets/folding_1.jpeg';
import folding2De from './assets/folding_2.jpeg';
import folding1En from './assets/folding_1_en.jpeg';
import folding2En from './assets/folding_2_en.jpeg';

export type Language = 'de' | 'en';

export const translations = {
  de: {
    nav_who: 'Wer sind wir?',
    nav_why: 'Warum tun wir das?',
    nav_recipe: 'Das Rezept',
    nav_contact: 'Schreib uns!',

    brand_title: 'TörtchenFuchs',
    brand_tagline: 'Schlaue Pfade, süße Momente',

    hero_badge: 'Schlaue Pfade & Süße Momente',
    hero_title: 'TörtchenFuchs',
    hero_subtitle:
      'Schön, dass Du uns gefunden hast!\nErfahre hier mehr über unsere Mission, entdecke unsere Pfade.',
    hero_cta_primary: 'Pfade & Momente entdecken',
    hero_cta_contact: 'Schreib uns!',

    section1_tag: 'Unsere Geschichte',
    section1_title: 'Wer sind wir?',
    section1_lead: 'Handwerkskunst, Neugier und die Liebe zum süßen Detail.',
    section1_p1:
      'Zwei Köpfe, unzählige Ideen: Zwischen Code und Pinselstrich, Berggipfeln und Backofen schlägt unser Herz fürs Kreative und das Entdecken der Welt. Unsere ganz eigene Version von Geocaching: Wir reisen nicht nur durch Orte – wir hinterlassen ihnen etwas Schönes zurück.',

    section2_tag: 'Unsere Philosophie',
    section2_title: 'Warum tun wir das?',
    section2_lead:
      'Weil das Leben draußen schöner ist – und mit einer süßen Belohnung noch viel besser.',
    section2_p1:
      'Wir hinterlassen an besonderen Orten kleine kreative Grüße, um der Welt etwas Schönes zurückzugeben. Doch die Reise endet für uns nicht beim Verstecken: Wir wollen wissen, wer diesen Moment mit uns teilt! Es ist jedes Mal ein Highlight, von euch zu lesen – schreibt uns kurz, schickt ein Foto oder hinterlasst einen Gedanken.',

    // Recipe Section
    recipe_tag: 'Handgemacht & Frisch gebacken',
    recipe_title: 'Das Rezept: TörtchenFuchs Zimtschnecken',
    recipe_lead:
      'Der Duft von warmem Zimt, fluffigem Hefeteig und einer Prise Kardamom – so holst du dir den süßen Moment nach Hause.',
    recipe_back_btn: 'Zurück zur Startseite',
    recipe_ingredients_title: 'Zutaten',
    recipe_dough_title: 'Hefeteig',
    recipe_dough_desc:
      '250 ml Milch (lauwarm)\n25 g frische Hefe\n75 g weiche Butter\n450 g Mehl\n50 g Zucker\n1 Prise Salz',
    recipe_filling_title: 'Füllung',
    recipe_filling_desc:
      '110 g weiche Butter\n50 g Zimtzucker (20 g Zimt / 30 g Zucker)\n1–2 TL Backkakao\n1 Prise Kardamom',
    recipe_topping_title: 'Deko',
    recipe_topping_desc: '1 verquirltes Ei mit etwas Milch\nHagelzucker',

    recipe_prep_title: 'Zubereitung',
    recipe_step1_title: '1. Vorbereiten',
    recipe_step1_desc:
      '5–6 EL der lauwarmen Milch mit der zerbröselten Hefe verrühren, bis sie sich auflöst. Die restliche lauwarme Milch mit den Butterwürfeln verschmelzen lassen (nicht zu heiß werden lassen!).',
    recipe_step2_title: '2. Kneten',
    recipe_step2_desc:
      'Mehl, Zucker und Salz in einer Schüssel mischen. Die Hefemilch und die Butter-Milch-Mischung dazugeben. Mit den Knethaken einige Minuten zu einem elastischen, glatten Teig verkneten.',
    recipe_step3_title: '3. Gehen lassen',
    recipe_step3_desc:
      'Teig abdecken und an einem warmen Ort ca. 1 Stunde gehen lassen, bis sich das Volumen sichtlich vergrößert hat.',
    recipe_step4_title: '4. Ausrollen',
    recipe_step4_desc:
      'Den Teig einmal kurz einboxen und auf etwas Mehl zu einem Rechteck (ca. 40 x 60 cm) ausrollen.',
    recipe_step5_title: '5. Füllen & Falten',
    recipe_step5_desc:
      'Die Zutaten für die Füllung verrühren und auf dem Teig verstreichen. Den Teig wie einen Brief in Dritteln zusammenschlagen (von der kurzen Seite zur Mitte, die andere Seite darüber klappen).',
    recipe_step6_title: '6. Schneiden & Formen',
    recipe_step6_desc:
      'Den gefalteten Teig parallel zur kurzen Seite in 12 Streifen (je ca. 2 cm breit) schneiden. Jeden Streifen in sich verdrehen (zwirbeln) und wie eine Schnecke aufrollen. Die Enden unter dem Gebäck verstecken und die Knoten auf zwei Backbleche mit Backpapier legen.',
    recipe_step7_title: '7. Zweites Gehen',
    recipe_step7_desc:
      'Abgedeckt nochmals 30 Minuten gehen lassen. Währenddessen den Ofen auf 200°C Ober-/Unterhitze vorheizen.',
    recipe_step8_title: '8. Backen',
    recipe_step8_desc:
      'Mit dem verquirlten Ei bestreichen, mit Hagelzucker bestreuen und nacheinander 13–15 Minuten goldbraun backen.',

    recipe_folding_title: 'Die Falttechnik (Illustriert)',
    recipe_folding_lead:
      'Mit unserer Schritt-für-Schritt Falt- und Zwirbeltechnik gelingen dir herrlich saftige und kunstvoll geformte Zimtschnecken.',
    recipe_footer_cta: 'Zimtschnecken nachgebacken? Schreib uns dein Feedback!',
    recipe_footer_feedback_btn: 'Nachricht schreiben',
    img_folding_1: folding1De,
    img_folding_2: folding2De,

    // Easter Egg Section (on index.html)
    easter_egg_tag: '🦊 Psst... Geheimtipp!',
    easter_egg_title:
      'Lust auf etwas Süßes? Entdecke unser Zimtschnecken-Rezept!',
    easter_egg_desc:
      'Der Duft von warmem Zimt und Kardamom: Wir teilen unser liebstes Rezept mit dir – perfekt für die Pause unterwegs oder zu Hause.',
    easter_egg_btn: 'Zum geheimen Rezept',

    section3_tag: 'Austausch & Kontakt',
    section3_title: 'Schreib uns!',
    section3_subtitle:
      'Hast du einen unserer Pfade entdeckt, möchtest Feedback teilen oder hast eine Frage? Schreib uns einfach – wir freuen uns auf deine Nachricht!',
    form_name_label: 'Dein Name *',
    form_name_placeholder: 'z.B. Anna Fuchs',
    form_email_label: 'E-Mail-Adresse',
    form_email_optional: '(optional)',
    form_email_placeholder: 'name@beispiel.de',
    form_place_label: 'Wo hast du den QR-Code gefunden?',
    form_place_optional: '(optional)',
    form_place_placeholder: 'z.B. Aussichtsturm, Parkbank am See...',
    form_photo_label: 'Foto von deinem Fund',
    form_photo_optional: '(optional)',
    form_photo_btn: 'Foto auswählen oder aufnehmen',
    form_photo_remove: 'Entfernen',
    form_photo_compressing: 'Wird optimiert...',
    form_photo_privacy_hint:
      '🔒 Freiwillig • Wird nicht veröffentlicht, nur für unsere private Ansicht • Automatisch fürs Web optimiert',
    form_message_label: 'Deine Nachricht *',
    form_message_placeholder: 'Erzähl uns von deinem Fund oder deiner Frage...',
    form_consent:
      'Mit dem Absenden erklärst du dich mit der Verarbeitung deiner Angaben einverstanden. Hochgeladene Fotos sind freiwillig, werden niemals veröffentlicht und dienen ausschließlich unserer privaten Ansicht.',
    form_submit: 'Nachricht absenden',
    form_submitting: 'Wird gesendet...',
    form_success_title: 'Vielen Dank für deine Nachricht!',
    form_success_desc:
      'Deine Nachricht ist wohlbehalten bei uns angekommen. Wir freuen uns über deine Rückmeldung und melden uns so schnell wie möglich!',
    form_error_title: 'Ups, da ist etwas schiefgelaufen.',
    form_error_desc:
      'Bitte überprüfe deine Eingaben und versuche es erneut. Du kannst uns auch direkt eine E-Mail schreiben.',

    footer_rights: 'Alle Rechte vorbehalten.',
    link_impressum: 'Impressum',
    link_privacy: 'Datenschutz',
    modal_close: 'Schließen',
    impressum_title: 'Impressum',
    privacy_title: 'Datenschutzerklärung',
    copy_email: 'E-Mail-Adresse kopieren',
    email_copied: 'In die Zwischenablage kopiert!',
  },
  en: {
    nav_who: 'Who we are?',
    nav_why: 'Why do we do that?',
    nav_recipe: 'The Recipe',
    nav_contact: 'Get in touch with us',

    brand_title: 'TörtchenFuchs',
    brand_tagline: 'clever paths, sweet moments',

    hero_badge: 'Clever Paths & Sweet Moments',
    hero_title: 'TörtchenFuchs',
    hero_subtitle:
      'We are glad you found us!\nLearn more about our mission here, and explore our trails.',
    hero_cta_primary: 'Discover Trails & Moments',
    hero_cta_contact: 'Get in touch with us',

    section1_tag: 'Our Story',
    section1_title: 'Who we are?',
    section1_lead: 'Craftsmanship, curiosity, and a love for sweet details.',
    section1_p1:
      'Behind TörtchenFuchs lies a passion for true craftsmanship, hidden pathways, and life’s simple joys. Like a watchful fox, we wander the region in search of the finest ingredients, the most scenic viewpoints, and recipes that bring a smile to your face.',

    section2_tag: 'Our Philosophy',
    section2_title: 'Why do we do that?',
    section2_lead:
      'Because life is richer outdoors — and even sweeter with a delicious treat.',
    section2_p1:
      'We believe the best memories are made when exploration, fresh air, and artisanal indulgence meet. Our QR trails invite you to keep your eyes open, discover new favorite spots, and savor the moment with all your senses.',

    // Recipe Section
    recipe_tag: 'Handcrafted & Freshly Baked',
    recipe_title: 'The Recipe: TörtchenFuchs Cinnamon Buns',
    recipe_lead:
      'The heavenly aroma of warm cinnamon, fluffy yeast dough, and a touch of cardamom — bring our signature sweet moment right to your home.',
    recipe_back_btn: 'Back to Homepage',
    recipe_ingredients_title: 'Ingredients',
    recipe_dough_title: 'Yeast Dough',
    recipe_dough_desc:
      '250 ml lukewarm milk\n25 g fresh yeast\n75 g softened butter\n450 g flour\n50 g sugar\n1 pinch of salt',
    recipe_filling_title: 'Filling',
    recipe_filling_desc:
      '110 g softened butter\n50 g cinnamon sugar (20 g cinnamon / 30 g sugar)\n1–2 tsp baking cocoa\n1 pinch of cardamom',
    recipe_topping_title: 'Topping',
    recipe_topping_desc: '1 whisked egg with a splash of milk\nPearl sugar',

    recipe_prep_title: 'Instructions',
    recipe_step1_title: '1. Prepare',
    recipe_step1_desc:
      'Whisk 5–6 tbsp of lukewarm milk with the crumbled yeast until dissolved. Gently melt the butter cubes into the remaining lukewarm milk (do not overheat!).',
    recipe_step2_title: '2. Knead',
    recipe_step2_desc:
      'Mix flour, sugar, and salt in a bowl. Add the yeast milk and the warm butter-milk mixture. Knead with dough hooks for several minutes until smooth, elastic, and supple.',
    recipe_step3_title: '3. First Rise',
    recipe_step3_desc:
      'Cover the bowl and let the dough rise in a warm spot for about 1 hour until visibly doubled in size.',
    recipe_step4_title: '4. Roll Out',
    recipe_step4_desc:
      'Gently punch down the dough and roll it out on a lightly floured surface into a rectangle (approx. 40 x 60 cm).',
    recipe_step5_title: '5. Fill & Fold',
    recipe_step5_desc:
      'Stir the filling ingredients together and spread evenly across the dough. Fold the dough in thirds like a letter (fold from the short side to the center, then fold the opposite side over).',
    recipe_step6_title: '6. Cut & Shape',
    recipe_step6_desc:
      'Cut the folded dough parallel to the short side into 12 strips (approx. 2 cm wide each). Twist each strip around itself and curl into a round spiral knot. Tuck the ends underneath and place onto two parchment-lined baking sheets.',
    recipe_step7_title: '7. Second Rise',
    recipe_step7_desc:
      'Cover and let rise for another 30 minutes. Meanwhile, preheat the oven to 200°C (390°F) top/bottom heat.',
    recipe_step8_title: '8. Bake',
    recipe_step8_desc:
      'Brush with the whisked egg wash, sprinkle generously with pearl sugar, and bake in batches for 13–15 minutes until golden brown.',

    recipe_folding_title: 'The Folding Technique (Illustrated)',
    recipe_folding_lead:
      'Follow our illustrated folding and twisting guide for wonderfully juicy, bakery-style cinnamon knots.',
    recipe_footer_cta: 'Baked our cinnamon buns? Send us your feedback!',
    recipe_footer_feedback_btn: 'Write to us',
    img_folding_1: folding1En,
    img_folding_2: folding2En,

    // Easter Egg Section (on index.html)
    easter_egg_tag: '🦊 Psst... Secret Tip!',
    easter_egg_title:
      'Fancy something sweet? Discover our Cinnamon Bun Recipe!',
    easter_egg_desc:
      'The heavenly aroma of warm cinnamon and cardamom: We are sharing our favorite recipe with you – perfect for the trail or at home.',
    easter_egg_btn: 'To the Secret Recipe',

    section3_tag: 'Connection & Contact',
    section3_title: 'Get in touch with us',
    section3_subtitle:
      'Did you discover one of our trails, want to share feedback, or have a question? Drop us a line — we’d love to hear from you!',
    form_name_label: 'Your Name *',
    form_name_placeholder: 'e.g. Anna Fox',
    form_email_label: 'Email Address',
    form_email_optional: '(optional)',
    form_email_placeholder: 'name@example.com',
    form_place_label: 'Where did you find the QR code?',
    form_place_optional: '(optional)',
    form_place_placeholder: 'e.g. Observation tower, lakeside bench...',
    form_photo_label: 'Photo of your find',
    form_photo_optional: '(optional)',
    form_photo_btn: 'Choose or take a photo',
    form_photo_remove: 'Remove',
    form_photo_compressing: 'Optimizing...',
    form_photo_privacy_hint:
      '🔒 Optional • Will not be published, strictly for private viewing • Automatically optimized for web',
    form_message_label: 'Your Message *',
    form_message_placeholder: 'Tell us about your find or your question...',
    form_consent:
      'By submitting, you agree to the processing of your data. Uploaded photos are voluntary, will never be published, and serve strictly for private viewing.',
    form_submit: 'Send Message',
    form_submitting: 'Sending...',
    form_success_title: 'Thank you for your message!',
    form_success_desc:
      'Your message has safely arrived. We appreciate your feedback and will get back to you as soon as possible!',
    form_error_title: 'Oops, something went wrong.',
    form_error_desc:
      'Please check your inputs and try again. You can also contact us directly by email.',

    footer_rights: 'All rights reserved.',
    link_impressum: 'Legal Notice',
    link_privacy: 'Privacy Policy',
    modal_close: 'Close',
    impressum_title: 'Legal Notice (Impressum)',
    privacy_title: 'Privacy Policy',
    copy_email: 'Copy email address',
    email_copied: 'Copied to clipboard!',
  },
};

let currentLang: Language = 'de';

export function getLanguage(): Language {
  return currentLang;
}

export function setLanguage(lang: Language): void {
  currentLang = lang;
  try {
    localStorage.setItem('tf_lang', lang);
  } catch {
    // Ignore storage errors in private modes
  }
  document.documentElement.lang = lang;
  updateDOM();
}

export function initLanguage(): void {
  let saved: Language = 'de';
  try {
    const stored = localStorage.getItem('tf_lang');
    if (stored === 'de' || stored === 'en') {
      saved = stored;
    } else {
      const browserLang = navigator.language.slice(0, 2).toLowerCase();
      if (browserLang === 'en') {
        saved = 'en';
      }
    }
  } catch {
    saved = 'de';
  }
  setLanguage(saved);
}

export function updateDOM(): void {
  const dict = translations[currentLang];

  // Update text content
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n') as keyof typeof dict;
    if (key && dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Update placeholders
  document
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      '[data-i18n-placeholder]'
    )
    .forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder') as keyof typeof dict;
      if (key && dict[key]) {
        el.placeholder = dict[key];
      }
    });

  // Update localized image sources
  document
    .querySelectorAll<HTMLImageElement>('[data-i18n-src]')
    .forEach((img) => {
      const key = img.getAttribute('data-i18n-src') as keyof typeof dict;
      if (key && dict[key]) {
        img.src = dict[key];
      }
    });

  // Update active flag state
  document.querySelectorAll<HTMLElement>('[data-lang-btn]').forEach((btn) => {
    const btnLang = btn.getAttribute('data-lang-btn');
    if (btnLang === currentLang) {
      btn.classList.add(
        'ring-2',
        'ring-orange-400',
        'scale-110',
        'bg-orange-500/20'
      );
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove(
        'ring-2',
        'ring-orange-400',
        'scale-110',
        'bg-orange-500/20'
      );
      btn.setAttribute('aria-pressed', 'false');
    }
  });
}
