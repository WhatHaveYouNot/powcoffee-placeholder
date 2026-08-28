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

  // Of de tracking code in deze paginalading daadwerkelijk is ingeladen.
  // Hier op sturen, niet op de opgeslagen keuze: die wordt bij het laden
  // ingelezen en zou verouderd zijn als iemand in dezelfde sessie eerst
  // accepteert en daarna intrekt.
  var trackingLoaded = false;

  function loadTracking() {
    addScript(TRACKING_SCRIPT, 'hs-script-loader');
    trackingLoaded = true;
  }

  // Op smalle schermen houdt de pagina ruimte vrij onder de inhoud zolang de
  // banner in beeld staat. Zonder die markering zou de inhoud daar achter
  // verdwijnen; met de markering valt de ruimte weg zodra de banner weg is.
  function markeerBanner() {
    document.body.classList.toggle('banner-weg', banner.hidden);
  }

  function hideBanner() {
    banner.hidden = true;
    markeerBanner();
  }

  function showBanner() {
    banner.hidden = false;
    markeerBanner();
  }

  if (stored === 'accepted') {
    loadTracking();
  } else if (stored !== 'declined') {
    showBanner();
  }
  markeerBanner();

  document.getElementById('cookie-accept').addEventListener('click', function () {
    remember('accepted');
    hideBanner();
    loadTracking();
  });

  // Cookies die HubSpot plaatst zodra de tracking code draait.
  var HUBSPOT_COOKIES = ['__hstc', 'hubspotutk', '__hssrc', '__hssc'];

  function clearTrackingCookies() {
    var host = window.location.hostname;
    var domains = ['', host, '.' + host];
    // Het hoofddomein meenemen: HubSpot zet cookies vaak op .powcoffee.nl,
    // ook als je op www zit.
    var parts = host.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));

    HUBSPOT_COOKIES.forEach(function (name) {
      domains.forEach(function (d) {
        var c = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = d ? c + '; domain=' + d : c;
      });
    });
  }

  document.getElementById('cookie-decline').addEventListener('click', function () {
    remember('declined');
    hideBanner();
    clearTrackingCookies();
    // Draait de tracking code al in deze pagina, dan krijg je hem er niet meer
    // uit: alleen een herlading stopt hem. Zonder dit zou intrekken pas bij de
    // volgende paginalading effect hebben.
    if (trackingLoaded) window.location.reload();
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
