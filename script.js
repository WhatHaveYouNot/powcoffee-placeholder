/* POW coffee — placeholder
   Zet het aanmeldformulier achter een knop. Het HubSpot-script wordt pas
   opgehaald bij de eerste klik, zodat een gewoon paginabezoek niets van
   HubSpot of reCAPTCHA laadt. */

(function () {
  'use strict';

  var HUBSPOT_SCRIPT = 'https://js-eu1.hsforms.net/forms/embed/149139429.js';

  var dialog = document.getElementById('form-modal');
  var openBtn = document.getElementById('open-form');
  var closeBtn = document.getElementById('close-form');
  var loaded = false;

  function loadHubSpot() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.src = HUBSPOT_SCRIPT;
    s.defer = true;
    document.body.appendChild(s);
  }

  openBtn.addEventListener('click', function () {
    loadHubSpot();
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

  // Na sluiten de focus terug naar de knop, zodat toetsenbordgebruikers
  // niet bovenaan de pagina belanden.
  dialog.addEventListener('close', function () {
    openBtn.focus();
  });
})();
