// Builds everything that is not a simple text swap, straight from window.INVITATION (data.js). Runs before i18n.js.
(() => {
  const D = window.INVITATION, $ = s => document.querySelector(s);
  const el = (tag, cls, attrs) => { const e = document.createElement(tag); if (cls) e.className = cls; for (const k in (attrs || {})) e.setAttribute(k, attrs[k]); return e; };
  const ICONS = { church: "assets/icon-church.png", toast: "assets/icon-toast.png" };

  // hero title + main photo + envelope monogram
  const first = D.couple.first;
  $("#hero-names").textContent = (first[0] + " & " + first[1]).toUpperCase();
  $("#main-photo").src = D.hero.photo;
  const mono = (D.couple.monogram && D.couple.monogram.length === 2) ? D.couple.monogram : [first[0][0], first[1][0]];
  $("#env-mono").innerHTML = ""; const m = $("#env-mono");
  m.append(mono[0].toUpperCase(), Object.assign(el("i"), { textContent: "&" }), mono[1].toUpperCase());

  // families: one line per side — "<title> <parents' names>" — with an "&" between them.
  //   new shape:  families.title + families.items[i].names            (one text field per side)
  //   old shape:  families.items[i].title + families.items[i].names   (still supported: title on its own line)
  const list = $("#family-list"), fam = D.families;
  fam.items.forEach((it, i) => {
    if (i > 0) list.append(Object.assign(el("p", "fam-amp"), { textContent: "&" }));
    const p = el("p", "fam-line"), names = el("span", "fam-names");
    names.dataset.i18n = `families.items.${i}.names`;
    if (it.title) {                                                   // old shape
      const t = el("span", "fam-title"); t.dataset.i18n = `families.items.${i}.title`;
      p.append(t, el("br"), names); p.classList.add("fam-stacked");
    } else if (fam.title) {                                           // new shape
      const t = el("span", "fam-title"); t.dataset.i18n = "families.title";
      p.append(t, " ", names);
    } else p.append(names);
    list.append(p);
  });

  // reception: maps button
  $("#maps-link").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(D.events.reception.maps.query);

  // timeline: ceremony (left) then reception (right)
  const tl = $("#timeline");
  [["ceremony", "left", true], ["reception", "right", false]].forEach(([key, side, withAddress]) => {
    const ev = D.events[key], item = el("div", "tl-item " + side);
    const time = el("time"); time.textContent = ev.time;
    const ico = el("span", "ico"), img = el("img", "", { alt: "", src: ICONS[ev.icon] || ICONS.church }); ico.append(img);
    const name = el("strong"); name.dataset.i18n = `events.${key}.name`;
    item.append(time, ico, name);
    if (withAddress && ev.address) { const sm = el("small"); sm.dataset.i18n = `events.${key}.address`; item.append(sm); }
    tl.append(item);
  });

  // dress code swatches
  const sw = $("#swatches");
  D.dressCode.colors.forEach(c => { const i = el("i"); i.style.background = c; sw.append(i); });

  // optional sections
  if (D.guestbook && D.guestbook.enabled === false) $("#guestbook").remove();
  if (D.credit && D.credit.enabled === false) $("#credit").remove();

  // music
  const S = D.settings || {}, mus = S.music || {};
  const audio = $("#bg-music");
  if (mus.enabled === false || !mus.file) { audio.remove(); const b = $("#music-btn"); if (b) b.remove(); }
  else audio.src = mus.file;
})();
