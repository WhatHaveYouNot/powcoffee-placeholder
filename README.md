# powcoffee.nl — placeholder

Eén statische pagina voor tot de Shopify-webshop live is. Geen build, geen
dependencies, geen JavaScript.

```
index.html                 de pagina
styles.css                 alle styling
pow-coffee-krachtig.svg    het logo
pow-mark-krachtig.svg      de losse ring, gebruikt als favicon
og.png                     deelplaatje voor WhatsApp/LinkedIn (1200x630)
```

De pagina heeft vier elementen: het logo, "binnenkort", een knop die het
aanmeldformulier opent, en het e-mailadres.

## Het aanmeldformulier

Embed van HubSpot-formulier `3313809b-ae9d-48c7-9a12-b1d08e2b3a7b` in portal
`149139429`, regio `eu1`.

Het formulier zit achter een knop, in een native `<dialog>`. Het HubSpot-script
wordt pas opgehaald bij de eerste klik (zie `script.js`). Een gewoon
paginabezoek laadt dus niets van HubSpot en niets van Google reCAPTCHA.
Verplaats die embed niet terug naar de pagina zelf zonder dat te heroverwegen:
dan laden die trackers weer bij iedere bezoeker.

HubSpot rendert het formulier in een **iframe op hun eigen domein**. Dat betekent
dat je het niet vanuit `styles.css` kunt opmaken: die CSS komt de iframe niet in.
Alle opmaak (lettertype, kleuren, hoeken, knop) stel je in bij HubSpot zelf, onder
Marketing -> Forms -> het formulier -> Style.

Twee dingen om daar recht te zetten, want ze botsen met de merkbrief:

- De invoervelden en de knop hebben **ronde hoeken**. De merkregel is dat de ronde
  vorm aan het logo voorbehouden is; zet de radius op 0.
- De knop is HubSpot-oranje, niet Fruitig `#F37868`. Zet ook de tekstkleur op
  Krachtig `#2E0D08` en het lettertype op Inter.

`pow-mark-krachtig.png` wordt niet door de site gebruikt; die kun je laten staan
of weggooien.

## og.png opnieuw maken

Als het logo wijzigt, bouw je het deelplaatje zo opnieuw (macOS, alleen Pillow
nodig). Quick Look rendert de SVG op een witte achtergrond, dus de alpha wordt
per pixel teruggerekend — anders krijg je een witte rand om de letters op crème.

```bash
qlmanage -t -s 2000 -o /tmp pow-coffee-krachtig.svg && python3 -c "
from PIL import Image
src = Image.open('/tmp/pow-coffee-krachtig.svg.png').convert('RGB')
INK, CREME = (0x2E,0x0D,0x08), (0xFA,0xF4,0xEA)
a = src.getchannel('R').point(lambda v: max(0,min(255,round((255-v)*255/(255-INK[0])))))
logo = Image.new('RGBA', src.size, INK+(0,)); logo.putalpha(a); logo = logo.crop(a.getbbox())
logo = logo.resize((620, round(logo.size[1]*620/logo.size[0])), Image.LANCZOS)
c = Image.new('RGB', (1200,630), CREME)
c.paste(logo, ((1200-logo.size[0])//2, (630-logo.size[1])//2), logo)
c.save('og.png', optimize=True)"
```

## Cookiebanner

De banner staat in `index.html` en is meteen zichtbaar bij het eerste bezoek.
`script.js` regelt de keuze:

- **Geen keuze gemaakt:** er laadt niets van HubSpot en er staan geen cookies.
- **Accepteren:** pas dan wordt `js-eu1.hs-scripts.com/149139429.js` ingeladen.
- **Weigeren:** er laadt niets; de keuze wordt onthouden in `localStorage`
  onder `pow-cookie-consent`.

De knop "Cookie Settings" onderaan opent de banner opnieuw, zodat een keuze
altijd te herzien is.

Dit is bewust **niet** de banner van HubSpot zelf. Die bleef leeg omdat er in
HubSpot geen cookiebeleid voor powcoffee.nl gepubliceerd is, en HubSpot laadt
zijn tracking code sowieso voordat er toestemming is. Publiceer je later alsnog
een beleid in HubSpot, haal deze banner dan weg: anders krijgen bezoekers er
twee.

Het aanmeldformulier staat hier los van. HubSpot Forms en reCAPTCHA laden pas
als iemand op "Hou me op de hoogte" klikt; dat is een handeling die de bezoeker
zelf start, en het formulier vraagt zelf om toestemming voor de gegevens.

## Cache bij GitHub Pages

GitHub Pages stuurt `cache-control: max-age=600`. Na een deploy kan een
bezoeker dus tot tien minuten de oude CSS of JS houden. Daarom hangt er een
versienummer aan de links: `styles.css?v=3` en `script.js?v=3`. **Hoog dat
nummer op** zodra je een van die twee bestanden wijzigt, anders zien
terugkerende bezoekers de oude versie.

## Hosten op GitHub Pages

1. Maak een repo en push deze map.
2. Settings → Pages → Source: `Deploy from a branch`, branch `main`, map `/ (root)`.
3. Voeg bij Pages je eigen domein toe (`powcoffee.nl`) en zet bij je
   domeinprovider de DNS-records die GitHub daar laat zien.
4. Zet **Enforce HTTPS** aan zodra het certificaat er is.

Let op: Shopify neemt straks hetzelfde domein over. Deze placeholder is dus
tijdelijk en verhuist niet mee.

## Lokaal bekijken

```bash
python3 -m http.server 4321
```

Daarna http://localhost:4321 openen.

## Merkregels die in de code zitten

Deze volgen uit de merkbrief in Notion. Handig om te weten als je gaat aanpassen:

- **Scherpe hoeken overal.** De ronde vorm is voorbehouden aan het logo, zodat de
  ring herkenbaar blijft. Voeg dus geen `border-radius` toe.
- **Kleuren:** Krachtig `#2E0D08` als tekstkleur op een crèmetint (`#FAF4EA`).
  `#2E0D08` is ook de `fill` in de logo-SVG's, dus logo en tekst zijn één geheel.
  Fruitig en Rond komen op deze pagina niet voor.
- **Font:** Inter voor de tekst, via Google Fonts. Fraunces is hier niet nodig —
  het logo brengt zijn eigen letters mee als vector.
- **Toon:** altijd "je", nooit "u". Geen grote woorden van kleine dingen.

## Als je later toch e-mails wil verzamelen

Aanmeldingen wegschrijven naar Notion kan niet vanaf GitHub Pages: dat is puur
statisch, en het Notion-token mag nooit in de broncode staan. Je hebt dan één
klein endpoint elders nodig (een Cloudflare Worker is gratis en is één bestand),
of je embedt een Tally-formulier met Tally's Notion-integratie.
