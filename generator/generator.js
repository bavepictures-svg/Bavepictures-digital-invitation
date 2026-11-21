/* ============================================================
   GÉNÉRATEUR D'INVITATION — un seul formulaire pour tous les thèmes.
   Les champs viennent de schema.js (miroir de
   template/ivory-botanical-gold/data.js, le schéma maître).
   • Ivory Botanical Gold : produit data.js + copie les fichiers du
     thème, EMBARQUÉS dans bundled-templates.js (généré par
     build-bundle.py à partir de template/ivory-botanical-gold/manifest.json)
     → aucun fetch : fonctionne en double-clic (file://), sans serveur.
   • Ivory & Gold (historique) : traduit les données vers l'ancien
     config.js (valeurs de la langue par défaut seulement).
   Tout se passe dans le navigateur ; rien n'est envoyé nulle part.
   ============================================================ */

/* ---------- utilitaires ---------- */
const DAYS = {
  fr: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};
const MONTHS = {
  fr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
function dateParts(iso, lang) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return { weekday: DAYS[lang][date.getDay()], day: String(d).padStart(2, "0"), month: MONTHS[lang][m - 1], year: String(y) };
}
// "DIMANCHE <b>06</b> DÉCEMBRE 2026" — composed from the date picker, never typed by hand
function dateLabelHtml(iso, lang) {
  const p = dateParts(iso, lang);
  return `${p.weekday.toUpperCase()} <b>${p.day}</b> ${p.month.toUpperCase()} ${p.year}`;
}
const extOf = (name, fb) => { const m = /\.([a-zA-Z0-9]+)$/.exec(name || ""); return m ? m[1].toLowerCase() : fb; };
const slugify = t => (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "invitation";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const nlToBr = s => esc(s).replace(/\r?\n/g, "<br>");
const stripHtml = s => String(s).replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
function setPath(obj, path, val) {
  const keys = path.split("."); let o = obj;
  keys.slice(0, -1).forEach((k, i) => { if (o[k] == null) o[k] = /^\d+$/.test(keys[i + 1]) ? [] : {}; o = o[k]; });
  o[keys[keys.length - 1]] = val;
}
const $ = (s, r = document) => r.querySelector(s);
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const k in (attrs || {})) { if (k === "class") e.className = attrs[k]; else if (k === "html") e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); }
  kids.flat().forEach(k => k != null && e.append(k));
  return e;
}

/* ---------- état : thème & langues ---------- */
const form = $("#generator-form");
const REG = [];                                  // { f, el, read() }
let theme = THEMES[0].id;
const isLegacy = () => THEMES.find(t => t.id === theme).legacy;
function enabledLangs() { const r = REG.find(x => x.f.type === "languages"); return r ? r.read() : ["fr"]; }
function defaultLang() { const r = REG.find(x => x.f.path === "settings.defaultLang"); return r ? r.read() : "fr"; }
const reqLangs = () => (isLegacy() ? [defaultLang()] : enabledLangs());

/* ---------- constructeurs de champs ---------- */
function labelEl(f) { return h("span", { class: "lbl", html: esc(f.label) + (f.req ? ' <span class="req">*</span>' : "") }); }
function wrap(f, ...inner) {
  const w = h("div", { class: "field f-" + f.type + (f.old === false ? " f-noold" : ""), "data-field": f.path }, ...inner);
  if (f.hint) w.append(h("span", { class: "hint", html: esc(f.hint) }));
  return w;
}
function input(f, type, extra) {
  const i = h("input", Object.assign({ type, "data-path": f.path }, f.placeholder && typeof f.placeholder === "string" ? { placeholder: f.placeholder } : {}, extra || {}));
  if (f.default != null && type !== "checkbox") i.value = f.default;
  return i;
}

const BUILDERS = {
  text(f) { const i = input(f, "text"); return { el: wrap(f, h("label", {}, labelEl(f), i)), read: () => i.value.trim() }; },
  date(f) { const i = input(f, "date"); return { el: wrap(f, h("label", {}, labelEl(f), i)), read: () => i.value, input: i }; },
  time(f) { const i = input(f, "time"); return { el: wrap(f, h("label", {}, labelEl(f), i)), read: () => i.value }; },
  number(f) { const i = input(f, "number", { min: f.min, max: f.max }); return { el: wrap(f, h("label", {}, labelEl(f), i)), read: () => Number(i.value) || f.default }; },
  select(f) {
    const s = h("select", { "data-path": f.path }, f.options.map(([v, t]) => h("option", { value: v }, t))); s.value = f.default;
    return { el: wrap(f, h("label", {}, labelEl(f), s)), read: () => s.value, input: s };
  },
  check(f) {
    const i = input(f, "checkbox"); i.checked = !!f.default;
    return { el: wrap(f, h("label", { class: "check" }, i, h("span", { html: esc(f.label) }))), read: () => i.checked, input: i };
  },
  languages(f) {
    const fr = h("input", { type: "checkbox", "data-path": "settings.languages", "data-lang": "fr" }); fr.checked = true;
    const en = h("input", { type: "checkbox", "data-path": "settings.languages", "data-lang": "en" }); en.checked = true;
    return { el: wrap(f, h("div", { class: "lbl" }, f.label), h("div", { class: "langs" }, h("label", { class: "check" }, fr, h("span", {}, "Français")), h("label", { class: "check" }, en, h("span", {}, "English")))),
      read: () => [fr.checked && "fr", en.checked && "en"].filter(Boolean), inputs: [fr, en] };
  },
  monogram(f) {
    const a = h("input", { type: "text", maxlength: 2, class: "mono", "data-path": "couple.monogram.0" }), b = h("input", { type: "text", maxlength: 2, class: "mono", "data-path": "couple.monogram.1" });
    return { el: wrap(f, h("div", { class: "lbl" }, f.label), h("div", { class: "mono-row" }, a, h("span", {}, "&"), b)), read: () => (a.value.trim() && b.value.trim() ? [a.value.trim(), b.value.trim()] : null) };
  },
  datelabel(f) {
    const p = h("div", { class: "date-preview" }, "—");
    return { el: wrap(f, h("div", { class: "lbl" }, f.label + " (généré automatiquement)"), p), read: () => null, preview: p };
  },
  bi(f, area) {
    const mk = lang => {
      const ph = f.placeholder && typeof f.placeholder === "object" ? f.placeholder[lang] : "";
      const i = area ? h("textarea", { rows: 2, "data-path": f.path, "data-lang": lang, placeholder: ph || "" }) : h("input", { type: "text", "data-path": f.path, "data-lang": lang, placeholder: ph || "" });
      if (f.default) i.value = f.default[lang] || "";
      return i;
    };
    const fr = mk("fr"), en = mk("en");
    const row = h("div", { class: "bi-row" },
      h("label", { class: "col-fr" }, h("span", { class: "lang-tag" }, "FR"), fr),
      h("label", { class: "col-en" + (f.enOld === false ? " en-noold" : "") }, h("span", { class: "lang-tag" }, "EN"), en));
    return { el: wrap(f, h("div", { class: "lbl-row" }, labelEl(f)), row), read: () => ({ fr: fr.value.trim(), en: en.value.trim() }), inputs: [fr, en] };
  },
  bia(f) { return BUILDERS.bi(f, true); },
  file(f) {
    const i = h("input", { type: "file", accept: f.accept, "data-path": f.path });
    const img = h("img", { class: "thumb", hidden: "" });
    i.addEventListener("change", () => { const file = i.files[0]; if (file && file.type.startsWith("image/")) { img.src = URL.createObjectURL(file); img.hidden = false; } else img.hidden = true; });
    return { el: wrap(f, h("label", {}, labelEl(f), i, img)), read: () => i.files[0] || null, input: i };
  },
  colors(f) {
    const box = h("div", { class: "swatch-row" });
    const add = hex => {
      const item = h("div", { class: "swatch-item" }, h("input", { type: "color", class: "dress-color", value: hex || "#b08d57", "data-path": "dressCode.colors" }), h("button", { type: "button", class: "btn-remove-color", "aria-label": "Retirer cette couleur" }, "×"));
      item.querySelector("button").addEventListener("click", () => { item.remove(); refresh(); });
      box.append(item); refresh();
    };
    const addBtn = h("button", { type: "button", class: "btn-secondary" }, "+ Ajouter une couleur");
    function refresh() { const n = box.children.length; box.querySelectorAll(".btn-remove-color").forEach(b => (b.disabled = n <= MIN_COLORS)); addBtn.disabled = n >= MAX_COLORS; }
    addBtn.addEventListener("click", () => add());
    ["#1d2417", "#b6c58f", "#fffbe3", "#ffffff"].forEach(add);
    return { el: wrap(f, h("div", { class: "lbl" }, labelEl(f)), box, addBtn, h("span", { class: "hint" }, `${MIN_COLORS} à ${MAX_COLORS} couleurs.`)), read: () => [...box.querySelectorAll(".dress-color")].map(c => c.value) };
  },
  families(f) {
    const box = h("div", { class: "families-list" });
    const add = (t) => {
      const fr = h("input", { type: "text", value: (t && t.fr) || "Mr / Mme", "data-lang": "fr", "data-path": "families.items.title" });
      const en = h("input", { type: "text", value: (t && t.en) || "Mr. & Mrs.", "data-lang": "en", "data-path": "families.items.title" });
      const names = h("input", { type: "text", "data-path": "families.items.names", placeholder: "Prénom NOM & Prénom NOM" });
      const rm = h("button", { type: "button", class: "btn-remove" }, "Retirer");
      const item = h("div", { class: "famille-block" },
        h("div", { class: "bi-row" }, h("label", { class: "col-fr" }, h("span", { class: "lang-tag" }, "FR"), fr), h("label", { class: "col-en" }, h("span", { class: "lang-tag" }, "EN"), en)),
        h("label", {}, h("span", { class: "lbl", html: 'Parents <span class="req">*</span>' }), names), rm);
      item._r = { fr, en, names };
      rm.addEventListener("click", () => { item.remove(); refresh(); });
      box.append(item); refresh();
    };
    const addBtn = h("button", { type: "button", class: "btn-secondary" }, "+ Ajouter une famille");
    function refresh() { const n = box.children.length; box.querySelectorAll(".btn-remove").forEach(b => (b.disabled = n <= 1)); addBtn.disabled = n >= MAX_FAMILIES; }
    addBtn.addEventListener("click", () => add());
    add(); add();
    return { el: wrap(f, h("div", { class: "lbl" }, labelEl(f)), box, addBtn), read: () => [...box.children].map(c => ({ title: { fr: c._r.fr.value.trim(), en: c._r.en.value.trim() }, names: c._r.names.value.trim() })) };
  },
  photos(f) {
    const box = h("div", { class: "photo-rows" });
    const addBtn = h("button", { type: "button", class: "btn-secondary" }, "+ Ajouter une photo");
    function refresh() { const n = box.children.length; box.querySelectorAll(".btn-remove").forEach(b => (b.disabled = n <= MIN_GALLERY)); addBtn.disabled = n >= MAX_GALLERY; [...box.children].forEach((c, i) => (c.querySelector(".num").textContent = i + 1)); }
    const add = () => {
      const file = h("input", { type: "file", accept: "image/*", "data-path": "gallery.photos.file" });
      const img = h("img", { class: "thumb", hidden: "" });
      file.addEventListener("change", () => { const x = file.files[0]; if (x) { img.src = URL.createObjectURL(x); img.hidden = false; } else img.hidden = true; });
      const fr = h("input", { type: "text", "data-lang": "fr", "data-path": "gallery.photos.caption", placeholder: "Légende (facultatif)" });
      const en = h("input", { type: "text", "data-lang": "en", "data-path": "gallery.photos.caption", placeholder: "Caption (optional)" });
      const rm = h("button", { type: "button", class: "btn-remove" }, "Retirer");
      const row = h("div", { class: "photo-row" }, h("span", { class: "num" }, "1"), h("div", { class: "pr-main" }, file, img),
        h("div", { class: "pr-caps" }, h("label", { class: "col-fr" }, h("span", { class: "lang-tag" }, "FR"), fr), h("label", { class: "col-en" }, h("span", { class: "lang-tag" }, "EN"), en)), rm);
      row._r = { file, fr, en };
      rm.addEventListener("click", () => { row.remove(); refresh(); });
      box.append(row); refresh();
    };
    addBtn.addEventListener("click", () => add());
    for (let i = 0; i < MIN_GALLERY; i++) add();
    return { el: wrap(f, h("div", { class: "lbl" }, labelEl(f)), box, addBtn, h("span", { class: "hint", html: `<b>Minimum ${MIN_GALLERY} photos</b> (maximum ${MAX_GALLERY}) : la galerie tourne en boucle, il en faut assez pour qu'elle reste belle. Carrées ou paysage, ≈1100 px.` })),
      read: () => [...box.children].map(r => ({ file: r._r.file.files[0] || null, caption: { fr: r._r.fr.value.trim(), en: r._r.en.value.trim() } })) };
  },
};

/* ---------- construction du formulaire ---------- */
const themeBox = $("#theme-cards");
THEMES.forEach(t => {
  const id = "theme-" + t.id;
  const r = h("input", { type: "radio", name: "theme", id, value: t.id }); if (t.id === theme) r.checked = true;
  r.addEventListener("change", () => { theme = t.id; applyThemeUI(); });
  themeBox.append(h("label", { class: "theme-card", for: id }, r, h("span", { class: "tc-name" }, t.name), h("span", { class: "tc-desc" }, t.desc), t.legacy ? h("span", { class: "tc-tag" }, "ancien moteur") : h("span", { class: "tc-tag ok" }, "schéma complet")));
});

const mount = $("#form-sections");
SECTIONS.forEach(sec => {
  const fs = h("fieldset", { id: "sec-" + sec.id }, h("legend", {}, sec.title));
  sec.fields.forEach(f => {
    const b = f.type === "bia" ? BUILDERS.bia(f) : BUILDERS[f.type](f);
    b.f = f; REG.push(b); fs.append(b.el);
  });
  if (sec.adv) { const d = h("details", { class: "adv" }, h("summary", {}, sec.title)); [...fs.children].slice(1).forEach(c => d.append(c)); mount.append(d); }
  else mount.append(fs);
});
const byPath = p => REG.find(x => x.f.path === p);

/* date → aperçu du libellé (FR / EN) */
const dateReg = byPath("wedding.date"), dateLblReg = byPath("wedding.dateLabel");
function updateDatePreview() {
  const v = dateReg.read();
  dateLblReg.preview.innerHTML = v ? `<span class="lang-tag">FR</span> ${dateLabelHtml(v, "fr")}<br><span class="lang-tag">EN</span> ${dateLabelHtml(v, "en")}` : "—";
}
dateReg.input.addEventListener("change", updateDatePreview); dateReg.input.addEventListener("input", updateDatePreview);

/* langues → colonnes visibles + langue par défaut */
const langReg = byPath("settings.languages"), defLangReg = byPath("settings.defaultLang");
function applyLangUI() {
  const langs = enabledLangs();
  form.classList.toggle("no-fr", !langs.includes("fr"));
  form.classList.toggle("no-en", !langs.includes("en"));
  [...defLangReg.input.options].forEach(o => { o.disabled = !langs.includes(o.value); });
  if (!langs.includes(defLangReg.input.value) && langs.length) defLangReg.input.value = langs[0];
}
langReg.inputs.forEach(i => i.addEventListener("change", applyLangUI));

/* thème → grisés / avertissement */
function applyThemeUI() {
  form.dataset.theme = theme;
  $("#legacy-note").hidden = !isLegacy();
  form.classList.toggle("legacy", isLegacy());
  applyLangUI();
}
applyThemeUI();

/* ---------- validation ---------- */
function clearMarks() { form.querySelectorAll(".invalid").forEach(e => e.classList.remove("invalid")); }
function validate() {
  const errors = []; let first = null;
  const bad = (el, msg) => { (el.classList || { add() {} }).add("invalid"); if (!first && el.focus) first = el; errors.push(msg); };
  const legacy = isLegacy(), langs = enabledLangs(), req = reqLangs();
  const gbOn = byPath("guestbook.enabled").read(), creditOn = byPath("credit.enabled").read();
  if (!langs.length) bad(langReg.el, "Choisissez au moins une langue.");
  if (!isLegacy() && !langs.includes(defaultLang())) bad(defLangReg.el, "La langue par défaut doit faire partie des langues proposées.");

  REG.forEach(r => {
    const f = r.f; if (!f.req && f.type !== "photos") return;
    if (legacy && !f.old) return;                                         // champ ignoré par l'ancien thème
    if (f.path.startsWith("guestbook.") && f.path !== "guestbook.enabled" && !gbOn) return;
    if (f.path === "credit.html" && !creditOn) return;
    const label = f.label.replace(/\(.*\)/, "").trim();
    if (["text", "date", "time"].includes(f.type)) { if (!r.read()) bad(r.el, `Champ manquant : ${label}`); }
    else if (f.type === "bi" || f.type === "bia") req.forEach((l, i) => { if (!r.read()[l]) bad(r.inputs[l === "fr" ? 0 : 1], `Champ manquant : ${label} (${l.toUpperCase()})`); });
    else if (f.path === "hero.photo") { if (!r.read()) bad(r.el, "Photo principale manquante."); }
    else if (f.type === "families") {
      const items = r.read(); if (!items.length) bad(r.el, "Ajoutez au moins une famille.");
      items.forEach((it, i) => { if (!it.names) bad(r.el, `Famille ${i + 1} : parents manquants.`); req.forEach(l => { if (!it.title[l]) bad(r.el, `Famille ${i + 1} : titre ${l.toUpperCase()} manquant.`); }); });
    }
    else if (f.type === "colors") { if (r.read().length < MIN_COLORS) bad(r.el, `Dress code : au moins ${MIN_COLORS} couleurs.`); }
    else if (f.type === "photos") {
      const rows = r.read(); const missing = rows.filter(x => !x.file).length;
      if (rows.length < MIN_GALLERY) bad(r.el, `Galerie : au moins ${MIN_GALLERY} photos (il y en a ${rows.length}).`);
      else if (missing) bad(r.el, `Galerie : ${missing} photo(s) sans fichier — il en faut ${MIN_GALLERY} minimum.`);
    }
  });
  const musicOn = byPath("settings.music.enabled").read(), music = REG.find(x => x.f.musicFile);
  if (legacy) {
    if (!music.read()) bad(music.el, "Musique : fichier audio obligatoire avec Ivory & Gold.");
    if (!byPath("settings.music.title").read()) bad(byPath("settings.music.title").el, "Musique : titre du morceau obligatoire avec Ivory & Gold.");
  }
  return { errors, first };
}
function showErrors(errors, first) {
  const box = $("#error-summary");
  if (!errors.length) { box.hidden = true; box.innerHTML = ""; return; }
  box.hidden = false;
  box.innerHTML = `<strong>${errors.length} point(s) à corriger :</strong><ul>${[...new Set(errors)].map(e => `<li>${esc(e)}</li>`).join("")}</ul>`;
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- données → objet INVITATION (le schéma de data.js) ---------- */
function buildInvitation() {
  const inv = { schema: "ibg-1" };
  const langs = enabledLangs(), gbOn = byPath("guestbook.enabled").read();
  const files = { hero: null, gallery: [], music: null };
  REG.forEach(r => {
    const f = r.f; let v;
    switch (f.type) {
      case "datelabel": { const iso = dateReg.read(); v = {}; langs.forEach(l => (v[l] = dateLabelHtml(iso, l))); break; }
      case "languages": v = r.read(); break;
      case "monogram": v = r.read(); if (!v) return; break;
      case "bi": case "bia": {
        const raw = r.read(); v = {};
        langs.forEach(l => { if (raw[l]) v[l] = f.type === "bia" ? nlToBr(raw[l]) : raw[l]; });
        if (!Object.keys(v).length) return; break;
      }
      case "families": v = r.read().map(it => { const t = {}; langs.forEach(l => { if (it.title[l]) t[l] = it.title[l]; }); return { title: t, names: it.names }; }); break;
      case "colors": v = r.read(); break;
      case "photos": {
        v = r.read().map((p, i) => { files.gallery.push(p.file); const c = {}; langs.forEach(l => { if (p.caption[l]) c[l] = p.caption[l]; }); const o = { src: `img/photo-${i + 2}.${extOf(p.file && p.file.name, "jpg")}` }; if (Object.keys(c).length) o.caption = c; return o; });
        break;
      }
      case "file": {
        const file = r.read();
        if (f.musicFile) { files.music = file; v = file ? `assets/audio/music.${extOf(file.name, "mp3")}` : "assets/audio/music.mp3"; }
        else { files.hero = file; v = `img/photo-1.${extOf(file && file.name, "jpg")}`; }
        break;
      }
      default: v = r.read();
    }
    if ((f.path.startsWith("guestbook.") && f.path !== "guestbook.enabled" && !gbOn)) return;
    setPath(inv, f.path, v);
  });
  inv.settings.music.volume = 0.55; inv.settings.rememberLanguage = true;
  if (!inv.settings.music.title) delete inv.settings.music.title;
  return { inv, files };
}

/* ---------- Ivory Botanical Gold : data.js + fichiers du thème ---------- */
function buildDataJs(inv) {
  return `/* ============================================================
   DATA — généré le ${new Date().toISOString().slice(0, 10)} par generator/index.html.
   Structure documentée champ par champ dans template/ivory-botanical-gold/data.js
   (le schéma maître). Modifier ici = modifier l'invitation de ce couple.
   ============================================================ */
window.INVITATION = ${JSON.stringify(inv, null, 2)};
`;
}
async function zipIvoryBotanicalGold(inv, files, slug) {
  // Tout est en mémoire : les fichiers du thème viennent de bundled-templates.js (base64), rien n'est lu sur le disque ni le réseau.
  const bundle = window.THEME_BUNDLES && window.THEME_BUNDLES["ivory-botanical-gold"];
  if (!bundle) throw new Error("bundled-templates.js est absent ou vide. Lancez « python3 generator/build-bundle.py » puis rechargez cette page.");
  const zip = new JSZip(), root = zip.folder(slug);
  bundle.files.forEach(p => root.file(p, bundle.data[p], { base64: true }));
  root.file("data.js", buildDataJs(inv));
  const img = root.folder("img");
  img.file(inv.hero.photo.replace("img/", ""), files.hero);
  inv.gallery.photos.forEach((p, i) => img.file(p.src.replace("img/", ""), files.gallery[i]));
  if (inv.settings.music.enabled) {
    if (files.music) root.file(inv.settings.music.file, files.music);
    else root.file(bundle.defaultMusic, bundle.data[bundle.defaultMusic], { base64: true });
  }
  return zip;
}

/* ---------- Ivory & Gold (historique) : traduction vers config.js ---------- */
function toLegacyConfig(inv, files) {
  const dl = inv.settings.defaultLang;
  const P = v => (v && typeof v === "object" ? (v[dl] ?? v.fr ?? v.en ?? "") : v ?? "");
  const iso = inv.wedding.date, dp = dateParts(iso, dl);
  const musicName = files.music.name;
  return {
    couple: { prenom1: inv.couple.first[0], prenom2: inv.couple.first[1], nomComplet1: inv.couple.full[0], nomComplet2: inv.couple.full[1] },
    dateMariage: iso,
    dateAffichee: { jourSemaine: dp.weekday, jour: dp.day, mois: dp.month, annee: dp.year },
    familles: inv.families.items.map(it => ({ titre: P(it.title), parents: it.names })),
    ceremonie: { heure: inv.events.ceremony.time, lieu: P(inv.events.ceremony.name) },
    reception: { heure: inv.events.reception.time },
    lieuReception: { nom: P(inv.events.reception.name), adresse: P(inv.events.reception.address), rechercheMaps: inv.events.reception.maps.query },
    galerie: { photoPrincipale: inv.hero.photo, photos: inv.gallery.photos.map(p => p.src) },
    dressCode: { consigne: stripHtml(P(inv.dressCode.message)), couleurs: inv.dressCode.colors },
    musique: { titre: inv.settings.music.title || "", fichier: `audio/${musicName}` },
    messageCloture: stripHtml(P(inv.closing)),
  };
}
function buildConfigJs(c) {
  const j = v => JSON.stringify(v);
  return `/* ============================================================
   CONFIG — généré le ${new Date().toISOString().slice(0, 10)} par
   generator/index.html (thème Ivory & Gold). Voir docs/new-client-checklist.md.
   ============================================================ */
const CONFIG = {
  couple: {
    prenom1: ${j(c.couple.prenom1)},
    prenom2: ${j(c.couple.prenom2)},
    nomComplet1: ${j(c.couple.nomComplet1)},
    nomComplet2: ${j(c.couple.nomComplet2)},
  },
  dateMariage: ${j(c.dateMariage)}, // format AAAA-MM-JJ, utilisé pour le calendrier
  dateAffichee: { jourSemaine: ${j(c.dateAffichee.jourSemaine)}, jour: ${j(c.dateAffichee.jour)}, mois: ${j(c.dateAffichee.mois)}, annee: ${j(c.dateAffichee.annee)} },

  familles: [
${c.familles.map(f => `    { titre: ${j(f.titre)}, parents: ${j(f.parents)} },`).join("\n")}
  ],

  ceremonie: { heure: ${j(c.ceremonie.heure)}, lieu: ${j(c.ceremonie.lieu)} },
  reception: { heure: ${j(c.reception.heure)} },

  lieuReception: {
    nom: ${j(c.lieuReception.nom)},
    adresse: ${j(c.lieuReception.adresse)},
    rechercheMaps: ${j(c.lieuReception.rechercheMaps)},
  },

  galerie: {
    // Chemins relatifs vers img/ dans ce dossier client.
    photoPrincipale: ${j(c.galerie.photoPrincipale)},
    photos: [
${c.galerie.photos.map(p => `      ${j(p)},`).join("\n")}
    ],
  },

  dressCode: {
    consigne: ${j(c.dressCode.consigne)},
    couleurs: [${c.dressCode.couleurs.map(j).join(", ")}],
  },

  musique: {
    titre: ${j(c.musique.titre)},
    fichier: ${j(c.musique.fichier)}, // chemin relatif vers audio/ dans ce dossier client
  },

  messageCloture: ${j(c.messageCloture)},
};
`;
}
function zipLegacy(inv, files, slug) {
  const zip = new JSZip(), root = zip.folder(slug);
  root.file("index.html", CLIENT_INDEX_HTML);
  root.file("config.js", buildConfigJs(toLegacyConfig(inv, files)));
  const img = root.folder("img");
  img.file(inv.hero.photo.replace("img/", ""), files.hero);
  inv.gallery.photos.forEach((p, i) => img.file(p.src.replace("img/", ""), files.gallery[i]));
  root.folder("audio").file(files.music.name, files.music);
  return zip;
}

/* ---------- soumission ---------- */
form.addEventListener("submit", async e => {
  e.preventDefault(); clearMarks();
  const { errors, first } = validate(); showErrors(errors, first); if (errors.length) return;
  const status = $("#status"); status.hidden = false; status.className = "status"; status.textContent = "Génération en cours…";
  try {
    const { inv, files } = buildInvitation();
    const slug = slugify(inv.couple.first[0] + "-" + inv.couple.first[1]);
    const zip = isLegacy() ? zipLegacy(inv, files, slug) : await zipIvoryBotanicalGold(inv, files, slug);
    const blob = await zip.generateAsync({ type: "blob" });
    window.GENERATOR_LAST = { slug, theme, blob, inv };            // (aussi utile pour les tests)
    const a = h("a", { href: URL.createObjectURL(blob), download: `${slug}.zip` }); document.body.append(a); a.click(); a.remove();
    status.className = "status ok";
    status.innerHTML = `✔ <b>${slug}.zip</b> généré (${(blob.size / 1048576).toFixed(1)} Mo). Extraire le .zip puis glisser le dossier <code>${slug}</code> dans <code>clients/</code> — rien à renommer.`;
  } catch (err) {
    console.error(err); status.className = "status err"; status.textContent = "Échec : " + err.message;
  }
});
