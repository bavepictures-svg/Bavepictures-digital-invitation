/* ==========================================================================================
   SCHEMA DU FORMULAIRE — miroir de template/ivory-botanical-gold/data.js (le schéma maître).
   Le formulaire est construit à partir de cette liste : un champ = un chemin (`path`) dans
   l'objet INVITATION. Pour ajouter un champ au formulaire, ajouter ici une entrée ET le champ
   correspondant dans data.js du thème.

   type :  text · bi (texte bilingue FR/EN) · bia (zone de texte bilingue, Entrée = saut de ligne)
           date · time · select · check · number · file · + widgets spéciaux (families, photos, colors, monogram)
   old  :  true  = utilisé par le thème historique « Ivory & Gold » (valeur de la langue par défaut)
           false = ignoré par « Ivory & Gold » (champ grisé quand ce thème est choisi)
   adv  :  true  = rangé dans « Textes de l'interface » (repliable, valeurs par défaut fournies)
   ========================================================================================== */
const THEMES = [
  { id: "ivory-botanical-gold", name: "Ivory Botanical Gold", desc: "Enveloppe animée, galerie polaroïds, FR/EN, musique — le schéma complet.", legacy: false },
  { id: "ivory-gold", name: "Ivory & Gold", desc: "Thème historique (moteur template/css + template/js).", legacy: true },
];

const MIN_GALLERY = 6, MAX_GALLERY = 12, MIN_COLORS = 3, MAX_COLORS = 6, MAX_FAMILIES = 4;

const SECTIONS = [
  { id: "settings", title: "Paramètres", fields: [
    { type: "languages", path: "settings.languages", label: "Langues proposées", old: false },
    { type: "select", path: "settings.defaultLang", label: "Langue par défaut", options: [["fr", "Français"], ["en", "English"]], default: "fr", old: true },
    { type: "check", path: "settings.music.enabled", label: "Musique de fond (démarre à l'ouverture de l'enveloppe)", default: true, old: true },
    { type: "check", path: "settings.autoscroll.enabled", label: "Défilement automatique lent après l'ouverture", default: true, old: false },
    { type: "number", path: "settings.autoscroll.speed", label: "Vitesse du défilement (px/s)", default: 32, min: 10, max: 120, old: false },
  ]},

  { id: "couple", title: "Couple", fields: [
    { type: "text", path: "couple.first.0", label: "Prénom 1", req: true, old: true },
    { type: "text", path: "couple.first.1", label: "Prénom 2", req: true, old: true },
    { type: "text", path: "couple.full.0", label: "Nom complet 1", req: true, old: true, hint: "Affiché en écriture manuscrite sur la carte d'annonce." },
    { type: "text", path: "couple.full.1", label: "Nom complet 2", req: true, old: true },
    { type: "monogram", path: "couple.monogram", label: "Monogramme de l'enveloppe", old: false, hint: "Facultatif — par défaut : les initiales des prénoms." },
  ]},

  { id: "date", title: "Date du mariage", fields: [
    { type: "date", path: "wedding.date", label: "Date", req: true, old: true },
    { type: "datelabel", path: "wedding.dateLabel", label: "Libellé affiché", old: true },
  ]},

  { id: "hero", title: "Page d'accueil", fields: [
    { type: "bi", path: "hero.kicker", label: "Texte au-dessus des noms", req: true, old: false, default: { fr: "MARIAGE DE", en: "WEDDING OF" } },
    { type: "file", path: "hero.photo", label: "Photo principale du couple", req: true, accept: "image/*", old: true, hint: "Format portrait de préférence. Recadrer/compresser avant (≈1100 px de long côté, JPEG ~78 %)." },
  ]},

  { id: "families", title: "Familles & annonce", fields: [
    { type: "families", path: "families.items", label: "Familles", req: true, old: true },
    { type: "bia", path: "families.announcement", label: "Phrase d'annonce", req: true, old: false,
      default: { fr: "NOUS AVONS LA JOIE DE VOUS ANNONCER\nLE MARIAGE DE NOS ENFANTS", en: "WE ARE DELIGHTED TO ANNOUNCE\nTHE WEDDING OF OUR CHILDREN" } },
  ]},

  { id: "ceremony", title: "Cérémonie", fields: [
    { type: "bi", path: "ceremony.intro", label: "Phrase d'introduction (carte)", req: true, old: false, default: { fr: "LA CEREMONIE AURA LIEU À", en: "THE CEREMONY WILL TAKE PLACE IN" } },
    { type: "text", path: "ceremony.city", label: "Ville (grand mot de la carte)", req: true, old: false, placeholder: "BUJUMBURA" },
    { type: "time", path: "events.ceremony.time", label: "Heure", req: true, old: true, hint: "Sert aussi d'heure cible au compte à rebours." },
    { type: "bi", path: "events.ceremony.name", label: "Lieu de la cérémonie (nom)", req: true, old: true, enOld: false, placeholder: { fr: "EGLISE …", en: "… CHURCH" } },
    { type: "text", path: "events.ceremony.address", label: "Adresse (ligne sous le nom dans la frise)", old: false },
    { type: "select", path: "events.ceremony.icon", label: "Icône dans la frise", options: [["church", "Église"], ["toast", "Verres levés"]], default: "church", old: false },
  ]},

  { id: "reception", title: "Réception", fields: [
    { type: "bi", path: "events.reception.intro", label: "Libellé de la carte verte", req: true, old: false, default: { fr: "LIEU DE LA RECEPTION", en: "RECEPTION VENUE" } },
    { type: "text", path: "events.reception.name", label: "Nom du lieu", req: true, old: true, placeholder: "UBUNTU RESIDENCE" },
    { type: "text", path: "events.reception.address", label: "Adresse", req: true, old: true },
    { type: "time", path: "events.reception.time", label: "Heure", req: true, old: true },
    { type: "select", path: "events.reception.icon", label: "Icône dans la frise", options: [["toast", "Verres levés"], ["church", "Église"]], default: "toast", old: false },
    { type: "text", path: "events.reception.maps.query", label: "Recherche Maps", req: true, old: true, hint: "Texte utilisé par le bouton « Ouvrir dans Maps » (nom + ville)." },
    { type: "bi", path: "events.reception.maps.label", label: "Texte du bouton Maps", req: true, old: false, default: { fr: "📍Ouvrir dans maps", en: "📍Open in Maps" } },
  ]},

  { id: "gallery", title: "Galerie photo", fields: [
    { type: "photos", path: "gallery.photos", label: "Photos de la galerie", req: true, old: true },
  ]},

  { id: "countdown", title: "Compte à rebours", fields: [
    { type: "bi", path: "countdown.kicker", label: "Surtitre", req: true, old: false, default: { fr: "COMPTE À REBOURS", en: "COUNT DOWN" } },
    { type: "bi", path: "countdown.title", label: "Titre", req: true, old: false, default: { fr: "JUSQU'AU GRAND JOUR", en: "TO THE BIG DAY" } },
    { type: "bi", path: "countdown.labels.days", label: "Libellé « jours »", req: true, old: false, default: { fr: "JOURS", en: "DAYS" } },
    { type: "bi", path: "countdown.labels.hours", label: "Libellé « heures »", req: true, old: false, default: { fr: "HEURES", en: "HOURS" } },
    { type: "bi", path: "countdown.labels.minutes", label: "Libellé « minutes »", req: true, old: false, default: { fr: "MINUTES", en: "MINUTES" } },
    { type: "bi", path: "countdown.labels.seconds", label: "Libellé « secondes »", req: true, old: false, default: { fr: "SECONDES", en: "SECONDS" } },
  ]},

  { id: "dress", title: "Dress code", fields: [
    { type: "bi", path: "dressCode.title", label: "Titre", req: true, old: false, default: { fr: "DRESS CODE", en: "DRESS CODE" } },
    { type: "colors", path: "dressCode.colors", label: "Couleurs", req: true, old: true },
    { type: "bia", path: "dressCode.message", label: "Consigne", req: true, old: true,
      default: { fr: "Habillez-vous avec élégance et célébrez avec nous avec style !\nVert émeraude, beige chaud et ivoire doux sont les bienvenus, c'est notre moment privilégié !😉 Votre présence nous fait très plaisir !",
                 en: "Dress elegantly and celebrate with us in style!\nEmerald green, warm beige and soft ivory are most welcome — this is our special moment!😉 Your presence brings us great joy!" } },
  ]},

  { id: "guestbook", title: "Livre d'or", fields: [
    { type: "check", path: "guestbook.enabled", label: "Afficher le livre d'or", default: true, old: false },
    { type: "bi", path: "guestbook.kicker", label: "Surtitre", req: true, old: false, default: { fr: "LIVRE D'OR", en: "GUEST BOOK" } },
    { type: "bi", path: "guestbook.title", label: "Titre", req: true, old: false, default: { fr: "LAISSEZ UN MOT AUX MARIÉS", en: "LEAVE A MESSAGE FOR THE NEWLYWEDS" } },
    { type: "bi", path: "guestbook.namePlaceholder", label: "Champ « nom »", req: true, old: false, default: { fr: "Votre nom", en: "Your name" } },
    { type: "bi", path: "guestbook.question", label: "Question de présence", req: true, old: false, default: { fr: "SEREZ-VOUS PRÉSENT ?", en: "WILL YOU ATTEND?" } },
    { type: "bi", path: "guestbook.yes", label: "Réponse « oui »", req: true, old: false, default: { fr: "Oui, je serais là", en: "Yes, I will be there" } },
    { type: "bi", path: "guestbook.no", label: "Réponse « non »", req: true, old: false, default: { fr: "Non, je ne serais pas là", en: "No, I won't be able to make it" } },
    { type: "bi", path: "guestbook.messagePlaceholder", label: "Champ « message » ({names} = prénoms du couple)", req: true, old: false, default: { fr: "Votre message pour {names}", en: "Your message for {names}" } },
    { type: "bi", path: "guestbook.send", label: "Bouton d'envoi", req: true, old: false, default: { fr: "Envoyer mes voeux", en: "Send my wishes" } },
    { type: "bi", path: "guestbook.thanks", label: "Message de remerciement", req: true, old: false, default: { fr: "Merci pour vos voeux 💚", en: "Thank you for your wishes 💚" } },
  ]},

  { id: "closing", title: "Clôture & crédit", fields: [
    { type: "bi", path: "closing", label: "Message de clôture", req: true, old: true, default: { fr: "Votre présence serait le plus beau des cadeaux !", en: "Your presence would be the greatest gift of all" } },
    { type: "check", path: "credit.enabled", label: "Afficher le crédit en bas de page", default: true, old: false },
    { type: "bi", path: "credit.html", label: "Texte du crédit (HTML autorisé : <b>…</b>)", html: true, old: false, default: { fr: "CREER PAR <b>BAVE PICTURES</b>", en: "CREATED BY <b>BAVE PICTURES</b>" } },
  ]},

  { id: "music", title: "Musique", fields: [
    { type: "file", path: "settings.music.file", label: "Fichier audio (mp3)", accept: "audio/*", old: true, musicFile: true,
      hint: "Facultatif avec Ivory Botanical Gold (sinon : morceau temporaire du thème). Obligatoire avec Ivory & Gold." },
    { type: "text", path: "settings.music.title", label: "Titre du morceau", old: true },
  ]},

  { id: "ui", title: "Textes de l'interface (valeurs par défaut fournies)", adv: true, fields: [
    { type: "bi", path: "envelope.cta", label: "Enveloppe — texte sous le sceau", req: true, old: false, default: { fr: "CLIQUEZ ICI POUR OUVRIR", en: "CLICK HERE TO OPEN" } },
    { type: "bi", path: "envelope.ariaOpen", label: "Enveloppe — libellé d'accessibilité", old: false, default: { fr: "Ouvrir l'invitation", en: "Open the invitation" } },
    { type: "bi", path: "envelope.ariaSeal", label: "Sceau — libellé d'accessibilité", old: false, default: { fr: "Cliquez ici pour ouvrir l'invitation", en: "Click here to open the invitation" } },
    { type: "bi", path: "gallery.aria", label: "Galerie — libellé d'accessibilité", old: false, default: { fr: "Galerie photos", en: "Photo gallery" } },
    { type: "bi", path: "gallery.prev", label: "Galerie — bouton précédent", old: false, default: { fr: "Photo précédente", en: "Previous photo" } },
    { type: "bi", path: "gallery.next", label: "Galerie — bouton suivant", old: false, default: { fr: "Photo suivante", en: "Next photo" } },
    { type: "bi", path: "gallery.screenReader", label: "Galerie — annonce lecteur d'écran ({n} {total} {title})", old: false, default: { fr: "Photo {n} sur {total} : {title}", en: "Photo {n} of {total}: {title}" } },
    { type: "bi", path: "ui.languageAria", label: "Bouton de langue — libellé", old: false, default: { fr: "Changer de langue", en: "Change language" } },
    { type: "bi", path: "ui.musicPlay", label: "Bouton musique — lancer", old: false, default: { fr: "Lancer la musique", en: "Play music" } },
    { type: "bi", path: "ui.musicPause", label: "Bouton musique — pause", old: false, default: { fr: "Mettre la musique en pause", en: "Pause music" } },
    { type: "bi", path: "seo.title", label: "Titre de l'onglet du navigateur ({names} = prénoms)", req: true, old: false, default: { fr: "{names} — Invitation de mariage", en: "{names} — Wedding invitation" } },
    { type: "bi", path: "hero.photoAlt", label: "Texte alternatif de la photo principale", old: false, default: { fr: "{names}", en: "{names}" } },
  ]},
];
