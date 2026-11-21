/* Squelette HTML du thème « Ivory & Gold » (moteur historique dans template/css + template/js).
   Copie figée de clients/_example/index.html — embarquée en texte (plutôt que chargée par fetch)
   pour que ce thème continue de fonctionner même si le générateur est ouvert en double-clic (file://).
   Si le squelette change dans clients/_example/index.html, reporter le changement ici aussi. */
const CLIENT_INDEX_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Invitation</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&family=Jost:wght@300;400;500&family=Parisienne&display=swap">
<link rel="stylesheet" href="../../template/css/base.css">
<link rel="stylesheet" href="../../template/css/layout.css">
<link rel="stylesheet" href="../../template/css/components.css">
<link rel="stylesheet" href="../../template/css/theme-ivory-gold.css">
</head>
<body>

<div class="demo-tag">Aperçu démo — Bave Digital Invitations</div>

<div class="page">

  <!-- ÉCRAN 1 — ENVELOPPE -->
  <section class="envelope-screen" id="envelope-screen">
    <div class="petals" id="petals"></div>
    <div class="envelope-card">
      <div class="branch branch--tl">
        <svg viewBox="0 0 60 110" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
          <path d="M6 108 C 10 84, 4 64, 14 46 C 22 32, 16 18, 26 4"/>
          <circle cx="14" cy="46" r="3.2" fill="currentColor" stroke="none"/>
          <circle cx="20" cy="34" r="2.4" fill="currentColor" stroke="none"/>
          <circle cx="10" cy="60" r="2.6" fill="currentColor" stroke="none"/>
          <circle cx="24" cy="20" r="2.2" fill="currentColor" stroke="none"/>
          <circle cx="26" cy="4" r="2.8" fill="currentColor" stroke="none"/>
          <path d="M14 46 C 8 44, 4 48, 2 52" stroke-width="1"/>
          <path d="M10 60 C 4 58, 0 62, -2 66" stroke-width="1"/>
        </svg>
      </div>
      <div class="branch branch--br">
        <svg viewBox="0 0 60 110" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
          <path d="M54 106 C 48 82, 54 62, 44 44 C 36 30, 42 16, 32 2"/>
          <circle cx="44" cy="44" r="3" fill="currentColor" stroke="none"/>
          <circle cx="38" cy="32" r="2.3" fill="currentColor" stroke="none"/>
          <circle cx="48" cy="58" r="2.5" fill="currentColor" stroke="none"/>
          <circle cx="34" cy="18" r="2.1" fill="currentColor" stroke="none"/>
          <circle cx="32" cy="2" r="2.6" fill="currentColor" stroke="none"/>
          <path d="M44 44 C 50 42, 54 46, 56 50" stroke-width="1"/>
          <path d="M48 58 C 54 56, 58 60, 60 64" stroke-width="1"/>
        </svg>
      </div>
      <div class="heart-badge">♥</div>
      <p class="names" id="env-names"></p>
      <div class="rule"><span class="script" style="font-size:22px;line-height:1">&amp;</span></div>
      <p class="date-line" id="env-date"></p>
      <p class="invite-line">invitent cordialement</p>
      <button class="btn-open" id="btn-open">Ouvrir</button>
    </div>
  </section>

  <!-- CONTENU PRINCIPAL -->
  <div id="invitation">

    <!-- 2. Présentation du couple -->
    <section>
      <p class="eyebrow">Mariage de</p>
      <h1 class="title-names" id="couple-title"></h1>
      <div class="polaroid-wrap">
        <div class="polaroid">
          <div class="branch branch--side" style="color:var(--gold-deep)">
            <svg viewBox="0 0 40 120" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">
              <path d="M8 118 C 12 94, 6 72, 16 52 C 24 36, 18 20, 26 2"/>
              <circle cx="16" cy="52" r="2.8" fill="currentColor" stroke="none"/>
              <circle cx="21" cy="38" r="2.1" fill="currentColor" stroke="none"/>
              <circle cx="11" cy="68" r="2.3" fill="currentColor" stroke="none"/>
              <circle cx="24" cy="22" r="1.9" fill="currentColor" stroke="none"/>
              <circle cx="26" cy="2" r="2.4" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <div class="photo-placeholder"><img id="main-photo" alt="" src=""></div>
          <div class="wax-seal"><img src="../../template/img/wax-seal.png" alt=""></div>
          <div class="branch branch--corner" aria-hidden="true">
            <svg viewBox="0 0 118 192" fill="none" stroke-linecap="round">
              <path d="M18 190 C 14 150, 30 128, 24 98 C 20 76, 36 60, 30 36 C 26 18, 40 8, 46 2" stroke="#8c6a3f" stroke-width="2"/>
              <path d="M24 98 C 10 90, 2 96, -6 88" stroke="#8c6a3f" stroke-width="1.3"/>
              <path d="M30 36 C 42 30, 48 34, 58 26" stroke="#8c6a3f" stroke-width="1.3"/>
              <path d="M20 76 C 8 72, 4 78, -4 76" stroke="#8c6a3f" stroke-width="1.1"/>
              <g fill="#cdbfa5" stroke="#8c6a3f" stroke-width=".6">
                <ellipse cx="46" cy="2" rx="6" ry="9" transform="rotate(-10 46 2)"/>
                <ellipse cx="58" cy="10" rx="5" ry="8" transform="rotate(25 58 10)"/>
                <ellipse cx="38" cy="14" rx="5" ry="7" transform="rotate(-40 38 14)"/>
              </g>
              <g fill="#b08d57" stroke="#8c6a3f" stroke-width=".6">
                <ellipse cx="58" cy="26" rx="5" ry="7" transform="rotate(18 58 26)"/>
                <ellipse cx="68" cy="22" rx="4" ry="6" transform="rotate(50 68 22)"/>
                <ellipse cx="30" cy="36" rx="4.5" ry="6.5" transform="rotate(-20 30 36)"/>
              </g>
              <g fill="#e3d7bd" stroke="#8c6a3f" stroke-width=".6">
                <ellipse cx="-6" cy="88" rx="5" ry="7" transform="rotate(-25 -6 88)"/>
                <ellipse cx="-14" cy="94" rx="4" ry="6" transform="rotate(10 -14 94)"/>
                <ellipse cx="-4" cy="76" rx="4" ry="6" transform="rotate(-20 -4 76)"/>
                <ellipse cx="10" cy="72" rx="4" ry="6" transform="rotate(30 10 72)"/>
              </g>
              <circle cx="46" cy="2" r="2" fill="#8c6a3f"/>
              <circle cx="58" cy="26" r="1.6" fill="#8c6a3f"/>
              <circle cx="-6" cy="88" r="1.6" fill="#8c6a3f"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Annonce officielle des familles -->
    <section class="paper-card">
      <div class="branch branch--side" aria-hidden="true">
        <svg viewBox="0 0 40 120" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">
          <path d="M8 118 C 14 96, 8 74, 18 54 C 26 38, 20 22, 28 2"/>
          <ellipse cx="17" cy="52" rx="5" ry="2.3" transform="rotate(-30 17 52)" fill="currentColor" stroke="none"/>
          <ellipse cx="22" cy="36" rx="4.4" ry="2" transform="rotate(25 22 36)" fill="currentColor" stroke="none"/>
          <ellipse cx="11" cy="66" rx="4.6" ry="2.1" transform="rotate(-40 11 66)" fill="currentColor" stroke="none"/>
          <ellipse cx="25" cy="18" rx="4" ry="1.8" transform="rotate(20 25 18)" fill="currentColor" stroke="none"/>
        </svg>
      </div>
      <div class="families" id="families"></div>
      <p class="announce-text">Nous avons la joie de vous annoncer<br>le mariage de nos enfants</p>
      <p class="couple-names-block">
        <span id="full-name-1"></span>
        <span class="and script">&amp;</span>
        <span id="full-name-2"></span>
      </p>
    </section>

    <!-- 4. Cérémonie -->
    <section class="when-card">
      <p class="label">La cérémonie aura lieu à</p>
      <p class="time" id="ceremony-time"></p>
      <p class="date-row" id="ceremony-date"></p>
    </section>

    <!-- 5. Galerie -->
    <section>
      <h2 class="eyebrow gallery-title" id="gallery-title">Galerie photo</h2>
      <div class="coverflow" id="coverflow">
        <div class="coverflow-track" id="coverflow-track"></div>
        <button class="cf-arrow cf-prev" id="cf-prev" aria-label="Photo précédente">‹</button>
        <button class="cf-arrow cf-next" id="cf-next" aria-label="Photo suivante">›</button>
      </div>
      <p class="gallery-counter" id="gallery-counter"></p>
    </section>

    <!-- 6. Réception -->
    <section class="when-card">
      <p class="label">La réception aura lieu à</p>
      <p class="time" id="reception-time"></p>
      <p class="date-row" id="reception-date"></p>
    </section>

    <!-- 7. Calendrier -->
    <section class="calendar-card">
      <p class="month" id="cal-month"></p>
      <div class="cal-grid" id="cal-grid"></div>
      <a class="add-cal" id="add-cal-link" target="_blank" rel="noopener">Ajouter au calendrier</a>
    </section>

    <!-- 8. Lieu + carte -->
    <section class="paper-card" style="text-align:left">
      <p class="eyebrow" style="text-align:left">Lieu de la réception</p>
      <p class="venue-name" id="venue-name"></p>
      <p class="venue-addr" id="venue-addr"></p>
      <a class="map-btn" id="map-link" target="_blank" rel="noopener">📍 Ouvrir dans Maps</a>
    </section>

    <!-- 9. Dress code -->
    <section>
      <h2 class="eyebrow dress-title">Dress code</h2>
      <p class="dress-sub" id="dress-sub"></p>
      <div class="swatches" id="swatches"></div>
    </section>

    <!-- 9bis. Livre d'or -->
    <section class="paper-card" style="text-align:left">
      <p class="eyebrow" style="text-align:center">Livre d'or</p>
      <h2 class="serif guestbook-title">Laissez un mot aux mariés</h2>
      <form id="guestbook-form" class="guestbook-form">
        <input type="text" id="gb-name" placeholder="Votre nom" maxlength="60" required>
        <textarea id="gb-message" placeholder="Votre message pour les mariés..." maxlength="400" rows="3" required></textarea>
        <button type="submit" class="gb-submit">Envoyer mes vœux</button>
      </form>
      <p class="gb-note" id="gb-note"></p>
      <div class="guestbook-list" id="guestbook-list"></div>
      <p class="guestbook-empty" id="guestbook-empty">Soyez le premier à laisser un mot !</p>
    </section>

    <!-- 10. Clôture -->
    <section class="closing" style="position:relative">
      <div class="branch branch--closing" style="color:var(--gold)" aria-hidden="true">
        <svg viewBox="0 0 60 80" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">
          <path d="M30 78 L30 20"/>
          <path d="M30 40 C 24 36, 16 38, 10 32" />
          <path d="M30 40 C 36 36, 44 38, 50 32" />
          <circle cx="30" cy="16" r="3" fill="currentColor" stroke="none"/>
          <circle cx="22" cy="24" r="2" fill="currentColor" stroke="none"/>
          <circle cx="38" cy="24" r="2" fill="currentColor" stroke="none"/>
        </svg>
      </div>
      <p id="closing-msg" style="margin-top:34px"></p>
      <p class="brand-tag">Créé par Bave Pictures</p>
    </section>

  </div>
</div>

<canvas id="confetti-canvas" style="position:fixed;inset:0;pointer-events:none;z-index:40;"></canvas>
<audio id="bg-music" loop></audio>
<button class="music-btn" id="music-btn" aria-pressed="false" aria-label="Jouer la musique">▶</button>

<script src="config.js"></script>
<script src="../../template/js/render.js"></script>
<script src="../../template/js/interactions.js"></script>
</body>
</html>
`;

