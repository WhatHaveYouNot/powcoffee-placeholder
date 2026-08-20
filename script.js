/* POW coffee — placeholder
   Regelt drie dingen:
   - het aanmeldformulier achter een knop, met HubSpot Forms pas op klik
   - de cookiebanner
   - de HubSpot tracking code, die pas laadt na toestemming */

(function () {
  'use strict';

  var FORMS_SCRIPT = 'https://js-eu1.hsforms.net/forms/embed/149139429.js';
  var TRACKING_SCRIPT = 'https://js-eu1.hs-scripts.com/149139429.js';
  var CONSENT_KEY = 'pow-cookie-consent';

  function addScript(src, id) {
    if (id && document.getElementById(id)) return;
    var s = document.createElement('script');
    s.src = src;
    s.defer = true;
    if (id) s.id = id;
    document.body.appendChild(s);
  }

  /* ---------- Cookietoestemming ----------
     De tracking code laadt uitsluitend na een expliciet akkoord. Zolang er
     geen keuze is gemaakt, laadt er niets en staat de banner in beeld. */

  var banner = document.getElementById('cookie-banner');
  var stored = null;

  try {
    stored = window.localStorage.getItem(CONSENT_KEY);
  } catch (e) {
    // Privémodus kan localStorage blokkeren. Dan tonen we de banner gewoon,
    // en laden we niets: geen keuze betekent geen tracking.
    stored = null;
  }

  function remember(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      // Niet kunnen onthouden is geen reden om de keuze te negeren.
    }
  }

  function loadTracking() {
    addScript(TRACKING_SCRIPT, 'hs-script-loader');
  }

  function hideBanner() {
    banner.hidden = true;
  }

  function showBanner() {
    banner.hidden = false;
  }

  if (stored === 'accepted') {
    loadTracking();
  } else if (stored !== 'declined') {
    showBanner();
  }

  document.getElementById('cookie-accept').addEventListener('click', function () {
    remember('accepted');
    hideBanner();
    loadTracking();
  });

  document.getElementById('cookie-decline').addEventListener('click', function () {
    remember('declined');
    hideBanner();
  });

  // De knop onderaan opent de banner opnieuw, zodat een keuze altijd te
  // herzien is. Dat is ook wat de AVG vraagt: toestemming moet net zo
  // makkelijk in te trekken zijn als te geven.
  var cookieBtn = document.getElementById('hs_show_banner_button');
  if (cookieBtn) {
    cookieBtn.addEventListener('click', showBanner);
  }

  /* ---------- Aanmeldformulier ----------
     HubSpot Forms laadt pas bij de eerste klik. Dit staat los van de
     cookiekeuze: het formulier is wat de bezoeker zelf opvraagt, en vraagt
     in het formulier zelf om toestemming voor de gegevens. */

  var dialog = document.getElementById('form-modal');
  var openBtn = document.getElementById('open-form');
  var closeBtn = document.getElementById('close-form');

  openBtn.addEventListener('click', function () {
    addScript(FORMS_SCRIPT, 'hs-forms-loader');
    dialog.showModal();
  });

  closeBtn.addEventListener('click', function () {
    dialog.close();
  });

  // Klikken naast het venster sluit het. De klik vergelijken met de afmetingen
  // van het dialoogvenster zelf, want een klik op de eigen padding heeft het
  // dialoogelement ook als target en zou anders onbedoeld sluiten.
  dialog.addEventListener('click', function (event) {
    var r = dialog.getBoundingClientRect();
    var inside = event.clientX >= r.left && event.clientX <= r.right &&
                 event.clientY >= r.top && event.clientY <= r.bottom;
    if (!inside) dialog.close();
  });

  dialog.addEventListener('close', function () {
    openBtn.focus();
  });
})();
