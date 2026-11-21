// Language engine. ALL text comes from window.INVITATION (data.js) — nothing client-specific lives here.
// Markup hooks hold a PATH into the data file:  data-i18n="events.reception.name"  (text)
//   data-i18n-html (innerHTML) · data-i18n-ph (placeholder) · data-i18n-aria (aria-label) · data-i18n-alt (alt)
// A value that is { fr, en } follows the current language (falls back to fr); a plain string is used as-is.
(() => {
  const D = window.INVITATION, S = D.settings || {};
  const langs = (S.languages && S.languages.length ? S.languages : ["fr"]);
  const names = D.couple.first.join(" & ");
  let lang = langs.includes(S.defaultLang) ? S.defaultLang : langs[0];
  if (S.rememberLanguage !== false) { try { const s = localStorage.getItem("ibg-lang"); if (langs.includes(s)) lang = s; } catch (e) {} }

  const get = path => String(path).split(".").reduce((o, k) => (o == null ? undefined : o[k]), D);
  const pick = v => (v && typeof v === "object" && !Array.isArray(v)) ? (v[lang] ?? v.fr ?? Object.values(v)[0] ?? "") : v;
  const t = (path, vars) => {
    let s = pick(get(path)); if (s == null) return "";
    s = String(s).replace(/\{names\}/g, names);
    if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  };

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.querySelectorAll("[data-i18n-alt]").forEach(el => { el.alt = t(el.dataset.i18nAlt); });
    document.querySelectorAll(".ibg-lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    window.dispatchEvent(new CustomEvent("ibg:lang", { detail: { lang } }));
  }
  function setLang(l) {
    if (!langs.includes(l) || l === lang) return;
    lang = l; try { localStorage.setItem("ibg-lang", l); } catch (e) {}
    apply();
  }
  window.IBG = { t, get lang() { return lang; }, setLang, data: D, names };

  const toggle = document.querySelector(".ibg-lang");
  if (toggle) {
    if (langs.length < 2) toggle.remove();
    else document.querySelectorAll(".ibg-lang button").forEach(b => { if (!langs.includes(b.dataset.lang)) b.remove(); else b.addEventListener("click", e => { e.stopPropagation(); setLang(b.dataset.lang); }); });
  }
  apply();
})();
