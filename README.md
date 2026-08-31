# powcoffee.nl — placeholder

Eén statische pagina voor tot de Shopify-webshop live is. Geen build, geen
dependencies, geen JavaScript.

```
index.html                 NL homepage
over/index.html            NL Over POW (noindex, zie hieronder)
privacy/index.html         NL privacyverklaring
en/index.html              EN homepage
en/about/index.html        EN About POW (noindex)
en/privacy/index.html      EN privacy statement
robots.txt, sitemap.xml    voor zoekmachines
styles.css                 alle styling
pow-coffee-black.svg       het logo (zwarte lockup)
pow-mark-black.svg         de losse ring, gebruikt als favicon
fonts/                     Alpino, zelf gehost, met licentie
og.png                     deelplaatje voor WhatsApp/LinkedIn (1200x630)
```

De homepage heeft vijf elementen: het logo op de zak, "binnenkort", een knop
die het aanmeldformulier opent, het e-mailadres en twee links naar de
inhoudspagina's.

## Positionering van navigatie en taalwisselaar

Gebaseerd op onderzoek, niet op smaak:

- **Taalwisselaar in de bovenhoek**, rechts. Nielsen Norman Group ("6 Tips for
  Improving Language Switchers on Ecommerce Sites"): op desktop in een
  bovenhoek, want daar zoeken mensen utility-functies; op mobiel boven de vouw.
  Stond eerst onderaan de homepage, op 65% van de pagina.
- **Utility-navigatie bóven de hoofdnavigatie**, niet ernaast. NN/g
  "Menu-Design Checklist". Op inhoudspagina's staat de taalbalk daarom op een
  eigen regel boven logo en menu.
- **Taalnamen in de eigen taal, geen vlaggen.** Een vlag staat voor een land,
  niet voor een taal.
- **Klikdoelen minimaal 24x24 px** (WCAG 2.5.8). Ze waren 23px; nu 29px.
- **Huidige pagina gemarkeerd** met `aria-current`. Baymard vindt dat 91% van de
  sites dit niet doet en noemt het een fout: zonder markering raken bezoekers
  de weg kwijt.

Automatisch doorsturen op browsertaal doen we bewust **niet**. NN/g raadt
detectie aan, maar Google waarschuwt tegen automatische omleidingen: crawlers
zien dan maar een van beide talen, en wie bewust de andere taal koos wordt
teruggegooid.

## Ruimte onder de cookiebanner

`.page` reserveert onderaan net zoveel ruimte als de banner hoog is, via
`--banner-hoogte`. `script.js` meet die hoogte en houdt hem bij met een
`ResizeObserver`.

Leg die hoogte niet vast in CSS. Dat was de eerste opzet: vaste waardes achter
een `max-width`-breekpunt. Die klopten alleen op de schermen waarop ze getest
waren; op een breed maar laag scherm (1000x760) dekte de banner 168px aan
inhoud af, inclusief de navigatielinks. Het probleem is de schermhoogte, niet
de breedte.

## Twee talen

Nederlands op `/`, Engels op `/en/`. De Engelse paden zijn Engels
(`/en/about/`, niet `/en/over/`).

| Nederlands | Engels |
| --- | --- |
| `/` | `/en/` |
| `/over/` | `/en/about/` |
| `/privacy/` | `/en/privacy/` |

**De taalwisselaar springt naar de equivalente pagina**, niet naar de homepage.
Wie op `/en/about/` staat en op Nederlands klikt, komt op `/over/` uit. Voeg je
een pagina toe, werk dan beide kanten bij.

Beide taalnamen staan er altijd in, elk in de eigen taal geschreven, met een
`lang`-attribuut per link. Zonder dat spreekt een screenreader "English" uit met
een Nederlandse tongval.

### hreflang

Elke pagina heeft `hreflang` naar zichzelf, naar de andere taal en een
`x-default` die naar de Nederlandse versie wijst. **Die verwijzingen moeten
wederkerig zijn**: als A naar B wijst maar B niet terug naar A, negeert Google
het hele stel. De sitemap herhaalt dezelfde verwijzingen.

De canonical van elke pagina wijst naar zichzelf, niet naar de andere taal.

### Wat nog Nederlands is op de Engelse site

Het **HubSpot-formulier**. Dat is in HubSpot ingericht en niet vanuit deze code
te vertalen. Een Engelse bezoeker krijgt nu Nederlandse velden en
toestemmingsteksten. Maak een tweede formulier in HubSpot en zet het `form-id`
om in `en/index.html`.

De **smaakfamilienamen** (Krachtig, Fruitig, Rond) blijven bewust Nederlands:
dat zijn merknamen. Ze staan met `lang="nl"` gemarkeerd zodat ze goed worden
uitgesproken.

De **Engelse privacyverklaring** is een vertaling met een clausule dat de
Nederlandse versie leidend is. Laat die door iemand met juridische kennis
nakijken voor je hem als bindend beschouwt.

## Navigatie

De homepage houdt zijn gecentreerde opzet en krijgt de paginalinks onderaan; een
volle navigatiebalk bovenaan zou daar de "coming soon"-werking breken. De
taalwisselaar staat er wél rechtsboven, zwevend, omdat dat de plek is waar
mensen hem zoeken (zie de sectie hierboven).

De inhoudspagina's (`/over/`, `/privacy/`) hebben een kop met logo,
hoofdnavigatie en kruimelpad, met de taalbalk daarboven.

Links naar interne pagina's altijd **met afsluitende slash** (`/privacy/`, niet
`/privacy`). GitHub Pages stuurt anders een 301 en dat kost een extra
verbinding per klik.

## Over-pagina

`over/index.html` en `en/about/index.html` bevatten de definitieve tekst van
Sebastiaan, in beide talen door hem aangeleverd. Beide staan op `index, follow`,
staan in de sitemap en zijn vanuit de navigatie bereikbaar.

De ondertekening onderaan gebruikt de smaakfamiliebalk in het klein in plaats
van een grijze scheidingslijn. Die lijn botste met de identieke lijn boven de
kop "Contact" eronder: twee dezelfde strepen op 44px van elkaar lazen als een
fout. De balk komt uit een gradient, dus de HTML is in beide talen gelijk.

De openingsvraag staat bewust als `h2` en niet als gewone alinea: "waarom lukt
het jou nou niet om thuis écht lekkere koffie te zetten" is precies wat mensen
intypen als hun koffie tegenvalt. Dat is de sterkste zoekterm die de site heeft.

De smaakfamilienamen blijven ook in de Engelse tekst Nederlands, met een
`lang="nl"`-markering zodat een screenreader ze goed uitspreekt.

## SEO-tags per pagina

Alle drie de pagina's hebben titel, meta description, canonical, Open Graph,
Twitter card en JSON-LD. De structured data is verdeeld als:

- **Homepage:** `Organization` met KvK-adres, btw-ID en e-mail uit de
  privacyverklaring.
- **Over:** `Organization` + `AboutPage` + `BreadcrumbList`.
- **Privacy:** `BreadcrumbList`.

Houd `og:url` en de canonical gelijk, inclusief de slash. Die liepen eerder
uiteen op de privacypagina.

## Het aanmeldformulier

Embed van HubSpot-formulier `3313809b-ae9d-48c7-9a12-b1d08e2b3a7b` in portal
`149139429`, regio `eu1`.

Het formulier zit achter een knop, in een native `<dialog>`. Het HubSpot-script
wordt pas opgehaald bij de eerste klik (zie `script.js`). Een gewoon
paginabezoek laadt dus niets van HubSpot.
Verplaats die embed niet terug naar de pagina zelf zonder dat te heroverwegen:
dan laden die trackers weer bij iedere bezoeker.

HubSpot rendert het formulier in een **iframe op hun eigen domein**. Dat betekent
dat je het niet vanuit `styles.css` kunt opmaken: die CSS komt de iframe niet in.
Alle opmaak (lettertype, kleuren, hoeken, knop) stel je in bij HubSpot zelf, onder
Marketing -> Forms -> het formulier -> Style.

Twee dingen om daar recht te zetten, want ze botsen met de merkbrief:

- De invoervelden en de knop hebben **ronde hoeken**. De merkregel is dat de ronde
  vorm aan het logo voorbehouden is; zet de radius op 0.
- De knop is HubSpot-oranje. Zet die op Fruitig `#9F5456` met crème tekst, de
  tekstkleur op zwart en het lettertype op Alpino.

## Lettertype: Alpino

Zelf gehost vanuit `fonts/`, een variabel bestand dat gewicht 100-900 dekt
(44 kB). **De licentie verbiedt subsetten en formaatconversie** (ITF Free Font
License, artikel 02), dus gebruik het meegeleverde woff2 ongewijzigd. De
licentietekst staat in `fonts/Alpino-LICENSE.txt`.

Laad het niet via een externe dienst: dat stuurt het IP-adres van elke bezoeker
naar een derde partij, bij elk bezoek en voor enige toestemming. Dat botst met
de privacyverklaring.

Let op: deze repo is openbaar, dus het fontbestand is voor iedereen te
downloaden van GitHub. Voor de website zelf is zelf-hosten expliciet toegestaan
(artikel 01), maar de licentie verbiedt wel verspreiding via repositories.
Wil je dat zeker afdekken, dan is de repo privé maken de veiligste route
(vereist GitHub Pro voor Pages met een eigen domein).

## Kleuren en materiaal

- Tekst en logo: **zwart** `#000000` op crème `#F7F3EC` (achtergrondkleur uit de
  merkbrief).
- Het logo staat op een **nagebouwde zilveren koffiezak** (`.pouch`). Dat volgt
  de RVS-materiaalrichting uit de merkbrief: een neutrale zilveren basiszak met
  een horizontale kleurbalk als enige kleuraccent. Drie details doen het werk
  qua herkenning — de gekrimpte sealrand bovenaan, de donkere zijvouwen en het
  ontgassingsventiel rechtsboven. Dat ventiel is wat de vorm echt als koffiezak
  laat lezen; haal je dat weg, dan wordt het weer een generiek paneel.
  Alles komt uit gestapelde CSS-gradients, niet uit een afbeelding, dus het
  blijft scherp op elk scherm. Verhouding 1:1.45, die van een staande 250g-zak.
- Houd dat effect subtiel: "geen poespas, wel smaak" verdraagt geen chroomglans.
- De drie smaakfamilies komen alleen terug als accent in de balk onder het logo:
  Krachtig `#6D5149`, Fruitig `#9F5456`, Rond `#B39963`. Fruitig is ook de
  hoverkleur van de primaire knop.
- Rond haalt 2,51:1 op crème en is dus **niet** geschikt voor tekst of
  bedieningselementen. Daarom staat de betekenis van de balk ook als verborgen
  tekst in de HTML.

## og.png opnieuw maken

Als het logo wijzigt, bouw je het deelplaatje zo opnieuw (macOS, alleen Pillow
nodig). Quick Look rendert de SVG op een witte achtergrond, dus de alpha wordt
per pixel teruggerekend — anders krijg je een witte rand om de letters op crème.

```bash
qlmanage -t -s 2000 -o /tmp pow-coffee-black.svg && python3 -c "
from PIL import Image
src = Image.open('/tmp/pow-coffee-black.svg.png').convert('RGB')
INK, CREME = (0,0,0), (0xFA,0xF4,0xEA)
a = src.getchannel('G').point(lambda v: max(0,min(255,round((255-v)*255/255))))
logo = Image.new('RGBA', src.size, INK+(0,)); logo.putalpha(a); logo = logo.crop(a.getbbox())
logo = logo.resize((620, round(logo.size[1]*620/logo.size[0])), Image.LANCZOS)
c = Image.new('RGB', (1200,630), CREME)
c.paste(logo, ((1200-logo.size[0])//2, (630-logo.size[1])//2 - 12), logo)
for i,col in enumerate([(0x6d,0x51,0x49),(0x9f,0x54,0x56),(0xb3,0x99,0x63)]):
    c.paste(Image.new('RGB',(60,6),col), (600-90+i*60, (630+logo.size[1])//2 + 22))
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

Het aanmeldformulier staat hier los van. HubSpot Forms laadt pas als iemand op
"Houd me op de hoogte" klikt; dat is een handeling die de bezoeker zelf start, en
het formulier vraagt zelf om toestemming voor de gegevens. reCAPTCHA is in
HubSpot uitgezet: dat stuurde gegevens naar Google in de VS, wat botste met de
privacyverklaring. Zet het niet terug aan zonder die verklaring aan te passen.

## Privacyverklaring

Staat op `/privacy` (`privacy/index.html`) en is bereikbaar via twee plekken:
de cookiebanner en de kop van het formuliervenster. Die link staat bewust
**buiten** de HubSpot-iframe, want de inhoud daarvan komt van HubSpot en is
niet vanuit deze code aan te passen. Hij opent in een nieuw tabblad, zodat een
half ingevuld formulier niet verloren gaat.

Het formuliervenster is `46rem` breed. Dat is geen smaakkeuze: het
HubSpot-formulier breekt zijn tekst minder op naarmate het breder is, en boven
ongeveer 54rem levert extra breedte niets meer op. Bij 46rem staat de
verzendknop zonder scrollen in beeld tot en met een viewport van 800px hoog.
Maak je dit smaller, dan verdwijnt die knop weer onder de vouw.

## Smalle schermen

De staande zak maakt de pagina hoog. Op een telefoon liep de inhoud daardoor
achter de cookiebanner, die onderaan vaststaat. Twee dingen lossen dat op, en
ze horen bij elkaar:

- Een compactere zak onder 30rem breedte.
- Ruimte onder de inhoud (`padding-bottom` op `.page`), zodat het verticaal
  centreren bóven de banner gebeurt. Alleen de zak verkleinen helpt niet
  genoeg: door het centreren schuift de onderkant maar de helft van de
  besparing omhoog.

`script.js` zet `.banner-weg` op de body zodra de banner verdwijnt; dan vervalt
die extra ruimte weer, anders zou de inhoud daarna te hoog hangen.

Let op bij het aanpassen van knoppen in die media query: gebruik
`.btn:not(.btn--sm)`. Zonder die uitzondering overschrijf je de padding van de
knoppen in de cookiebanner, waardoor de banner juist hoger wordt.

## Cache bij GitHub Pages

GitHub Pages stuurt `cache-control: max-age=600`. Na een deploy kan een
bezoeker dus tot tien minuten de oude CSS of JS houden. Daarom hangt er een
versienummer aan de links: `styles.css?v=13` en `script.js?v=13`. **Hoog dat
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
python3 -m http.server 4325
```

Daarna http://localhost:4325 openen.

## Merkregels die in de code zitten

Deze volgen uit de merkbrief in Notion. Handig om te weten als je gaat aanpassen:

- **Ronde hoeken mogen in alle toepassingen** (`--radius: 4px`). De merkbrief
  heeft de eerdere regel "scherpe hoeken overal behalve het logo" na de
  Milaan-trip losgelaten omdat die te hard aanvoelde.
- **Kleuren:** zie de sectie Kleuren hierboven.
- **Font:** Alpino, zelf gehost. Zie de sectie Lettertype hierboven.
- **Toon:** altijd "je", nooit "u". Geen grote woorden van kleine dingen.
- **De primaire knop is zwart met crème tekst** (19,2:1). Bij hover keert hij om
  naar Fruitig `#9F5456` met crème tekst (4,95:1). Zet daar geen donkere tekst
  op: dat haalt 1,33:1. Reken opnieuw voor je die combinatie wijzigt.
