/* ==========================================================================================
   IVORY BOTANICAL GOLD — DATA FILE  (the MASTER SCHEMA for the generator form)
   ------------------------------------------------------------------------------------------
   Everything client-specific lives HERE. index.html / style.css / script.js / render.js /
   i18n.js / envelope.* / music.js / autoscroll.js are generic and never need editing for a new
   couple. The generator fills in this file; the form is built from the fields below.

   CONVENTIONS
   • "BILINGUAL"  = an object { fr: "...", en: "..." }.  French is the default language; if `en`
                    is missing the page falls back to `fr`.
   • "TEXT"       = a plain string, the same in every language (names, addresses, times…).
                    A TEXT field MAY also be given as a BILINGUAL object if it ever needs to differ.
   • "HTML"       = BILINGUAL text where <br> and <b>…</b> are allowed (line breaks / emphasis).
   • "{names}"    = placeholder replaced by the couple's first names ("Mike & Olivia") in any string.
   • "PATH"       = file path relative to index.html (e.g. "img/photo-1.jpg").
   • REQUIRED / OPTIONAL is noted per field. Optional fields can be omitted or left "".
   ========================================================================================== */
window.INVITATION = {

  schema: "ibg-1",                       // schema id/version — lets tools detect which form shape this file follows

  /* ───────────── 1. SETTINGS ───────────── */
  settings: {
    defaultLang: "fr",                   // REQUIRED  "fr" | "en" — language shown first
    rememberLanguage: true,              // OPTIONAL  remember the visitor's FR/EN choice on their device
    languages: ["fr", "en"],             // REQUIRED  languages offered by the FR/EN toggle (one entry hides the toggle)
    music: {
      enabled: true,                     // OPTIONAL  false = no audio element and no music button
      file: "assets/audio/music.mp3",    // PATH      audio file (mp3). Starts only after the envelope opens
      title: "",                         // OPTIONAL  TEXT  song title (informational; used by the older Ivory & Gold theme)
      volume: 0.55,                      // OPTIONAL  0–1
    },
    autoscroll: {
      enabled: true,                     // OPTIONAL  slow automatic scroll after the envelope opens
      speed: 32,                         // OPTIONAL  pixels per second
    },
  },

  /* ───────────── 2. COUPLE ───────────── */
  couple: {
    first: ["Mike", "Olivia"],           // REQUIRED  TEXT ×2  first names  → hero title "MIKE & OLIVIA", {names}, photo alt text
    full: ["Niyonkuru Mike", "Ngenda Olivia"], // REQUIRED  TEXT ×2  full names in the script font on the announcement card
    monogram: ["M", "O"],                // OPTIONAL  TEXT ×2  letters on the envelope flap (default: initials of `first`)
  },

  /* ───────────── 3. DATE ───────────── */
  wedding: {
    date: "2026-12-06",                  // REQUIRED  ISO date (YYYY-MM-DD). With the ceremony time it drives the countdown
    dateLabel: {                         // REQUIRED  HTML (use <b> around the day number to enlarge it)
      fr: "DIMANCHE <b>06</b> DECEMBRE 2026",
      en: "SUNDAY <b>06</b> DECEMBER 2026",
    },
  },

  /* ───────────── 4. HERO (first screen) ───────────── */
  hero: {
    kicker: { fr: "MARIAGE DE", en: "WEDDING OF" },        // REQUIRED  BILINGUAL  small line above the names
    photo: "img/photo-1.jpg",                              // REQUIRED  PATH  main couple photo (portrait works best)
    photoAlt: { fr: "Mike et Olivia", en: "Mike and Olivia" }, // OPTIONAL  BILINGUAL  alt text
  },

  /* ───────────── 5. FAMILIES + ANNOUNCEMENT ───────────── */
  families: {
    title: { fr: "Mr / Mme", en: "Mr. & Mrs." },   // OPTIONAL  BILINGUAL  small title written in front of each line of parents' names
    items: [                             // REQUIRED  1–2 lines: the parents of person 1, then the parents of person 2 (an "&" is shown between them)
      { names: "Juvenal NIYONKURU / BUKURU Aline" },     // names: TEXT  (typed once — same in every language)
      { names: "Olivier NGENDAHAYO / Anne Marie SUGIRA" },
    ],                                   // (older files may use { title: BILINGUAL, names: TEXT } per item — still supported)
    announcement: {                      // REQUIRED  HTML  sentence above the couple's names
      fr: "NOUS AVONS LA JOIE DE VOUS ANNONCER<br>LE MARIAGE DE NOS ENFANTS",
      en: "WE ARE DELIGHTED TO ANNOUNCE<br>THE WEDDING OF OUR CHILDREN",
    },
  },

  /* ───────────── 6. CEREMONY CARD ───────────── */
  ceremony: {
    intro: { fr: "LA CEREMONIE AURA LIEU À", en: "THE CEREMONY WILL TAKE PLACE IN" }, // REQUIRED  BILINGUAL
    city: "BUJUMBURA",                   // REQUIRED  TEXT/BILINGUAL  big word on the card (usually the city)
  },

  /* ───────────── 7. EVENTS (feed the reception card AND the timeline) ───────────── */
  events: {
    ceremony: {
      time: "11:00",                     // REQUIRED  HH:MM (24h). Also the countdown target time on the wedding date
      name: { fr: "EGLISE JESUS-CHRIST À L'OEUVRE", en: "JESUS-CHRIST À L'OEUVRE CHURCH" }, // REQUIRED  place name
      address: "Rohero, Av du boulevrard no 41", // OPTIONAL  TEXT  small line under the name in the timeline
      icon: "church",                    // REQUIRED  "church" | "toast"  (icon in the timeline circle)
    },
    reception: {
      time: "16:00",                     // REQUIRED  HH:MM
      intro: { fr: "LIEU DE LA RECEPTION", en: "RECEPTION VENUE" }, // REQUIRED  BILINGUAL  label on the green card
      name: "UBUNTU RESIDENCE",          // REQUIRED  TEXT/BILINGUAL  venue name (card + timeline)
      address: "Asiatique, Bujumbura",   // REQUIRED  TEXT  address line on the green card
      icon: "toast",                     // REQUIRED  "church" | "toast"
      maps: {
        query: "Ubuntu Residence Bujumbura", // REQUIRED  text searched in Google Maps by the "open in maps" button
        label: { fr: "📍Ouvrir dans maps", en: "📍Open in Maps" }, // REQUIRED  BILINGUAL  button text
      },
    },
  },

  /* ───────────── 8. GALLERY (polaroids on a string) ───────────── */
  gallery: {
    photos: [                            // REQUIRED  6–10 photos recommended (the string loops endlessly)
      { src: "img/photo-2.jpg", caption: { fr: "Le premier regard", en: "The first glance" } }, // src: PATH · caption: BILINGUAL (handwritten note under the print)
      { src: "img/photo-3.jpg", caption: { fr: "Nos sourires", en: "Our smiles" } },
      { src: "img/photo-4.jpg", caption: { fr: "Ensemble", en: "Together" } },
      { src: "img/photo-5.jpg", caption: { fr: "Notre complicité", en: "Our bond" } },
      { src: "img/photo-6.jpg", caption: { fr: "Pour la vie", en: "For life" } },
      { src: "img/photo-7.jpg", caption: { fr: "Bientôt mariés", en: "Soon to be wed" } },
    ],
    aria: { fr: "Galerie photos", en: "Photo gallery" },                 // OPTIONAL  accessibility labels
    prev: { fr: "Photo précédente", en: "Previous photo" },
    next: { fr: "Photo suivante", en: "Next photo" },
    screenReader: { fr: "Photo {n} sur {total} : {title}", en: "Photo {n} of {total}: {title}" }, // {n} {total} {title}
  },

  /* ───────────── 9. COUNTDOWN (target = wedding.date + events.ceremony.time) ───────────── */
  countdown: {
    kicker: { fr: "COMPTE À REBOURS", en: "COUNT DOWN" },               // REQUIRED  BILINGUAL
    title: { fr: "JUSQU'AU GRAND JOUR", en: "TO THE BIG DAY" },          // REQUIRED  BILINGUAL
    labels: {                                                             // REQUIRED  BILINGUAL ×4
      days: { fr: "JOURS", en: "DAYS" },
      hours: { fr: "HEURES", en: "HOURS" },
      minutes: { fr: "MINUTES", en: "MINUTES" },
      seconds: { fr: "SECONDES", en: "SECONDS" },
    },
  },

  /* ───────────── 10. DRESS CODE ───────────── */
  dressCode: {
    title: { fr: "DRESS CODE", en: "DRESS CODE" },                        // REQUIRED  BILINGUAL
    colors: ["#1d2417", "#b6c58f", "#fffbe3", "#ffffff"],                 // REQUIRED  3–6 hex colours (round swatches)
    message: {                                                            // REQUIRED  HTML
      fr: "Habillez-vous avec élégance et célébrez avec nous avec style !<br>Vert émeraude, beige chaud et ivoire doux sont les bienvenus, c'est notre moment privilégié !😉 Votre présence nous fait très plaisir !",
      en: "Dress elegantly and celebrate with us in style!<br>Emerald green, warm beige and soft ivory are most welcome — this is our special moment!😉 Your presence brings us great joy!",
    },
  },

  /* ───────────── 11. GUESTBOOK ───────────── */
  guestbook: {
    enabled: true,                                                        // OPTIONAL  false hides the whole section
    kicker: { fr: "LIVRE D'OR", en: "GUEST BOOK" },
    title: { fr: "LAISSEZ UN MOT AUX MARIÉS", en: "LEAVE A MESSAGE FOR THE NEWLYWEDS" },
    namePlaceholder: { fr: "Votre nom", en: "Your name" },
    question: { fr: "SEREZ-VOUS PRÉSENT ?", en: "WILL YOU ATTEND?" },
    yes: { fr: "Oui, je serais là", en: "Yes, I will be there" },
    no: { fr: "Non, je ne serais pas là", en: "No, I won't be able to make it" },
    messagePlaceholder: { fr: "Votre message pour {names}", en: "Your message for {names}" },
    send: { fr: "Envoyer mes voeux", en: "Send my wishes" },
    thanks: { fr: "Merci pour vos voeux 💚", en: "Thank you for your wishes 💚" },
    // (all REQUIRED when enabled — the generator pre-fills sensible defaults for every one of these)
  },

  /* ───────────── 12. CLOSING + CREDIT ───────────── */
  closing: { fr: "Votre Presence serais le plus beaux des cadeaux", en: "Your presence would be the greatest gift of all" }, // REQUIRED  BILINGUAL
  credit: {
    enabled: true,                                                        // OPTIONAL  false hides the footer credit
    html: { fr: "CREER PAR <b>BAVE PICTURES</b>", en: "CREATED BY <b>BAVE PICTURES</b>" },
  },

  /* ───────────── 13. ENVELOPE INTRO + UI LABELS ───────────── */
  envelope: {
    cta: { fr: "CLIQUEZ ICI POUR OUVRIR", en: "CLICK HERE TO OPEN" },    // REQUIRED  BILINGUAL  text curved under the seal
    ariaOpen: { fr: "Ouvrir l'invitation", en: "Open the invitation" },   // OPTIONAL  accessibility labels
    ariaSeal: { fr: "Cliquez ici pour ouvrir l'invitation", en: "Click here to open the invitation" },
  },
  ui: {                                                                    // OPTIONAL  small interface labels
    languageAria: { fr: "Changer de langue", en: "Change language" },
    musicPlay: { fr: "Lancer la musique", en: "Play music" },
    musicPause: { fr: "Mettre la musique en pause", en: "Pause music" },
  },
  seo: {
    title: { fr: "Mike & Olivia — Invitation de mariage", en: "Mike & Olivia — Wedding invitation" }, // REQUIRED  BILINGUAL  browser tab title
  },
};
