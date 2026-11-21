// Countdown — target = wedding date + ceremony time (data.js)
const TARGET = new Date(INVITATION.wedding.date + "T" + INVITATION.events.ceremony.time + ":00").getTime();
const pad = n => String(n).padStart(2, "0");
function tick() {
  let diff = Math.max(0, TARGET - Date.now());
  const d = Math.floor(diff / 864e5); diff -= d * 864e5;
  const h = Math.floor(diff / 36e5); diff -= h * 36e5;
  const m = Math.floor(diff / 6e4); diff -= m * 6e4;
  const s = Math.floor(diff / 1e3);
  cdd.textContent = pad(d); cdh.textContent = pad(h); cdm.textContent = pad(m); cds.textContent = pad(s);
}
const cdd = document.getElementById("cd-d"), cdh = document.getElementById("cd-h"),
      cdm = document.getElementById("cd-m"), cds = document.getElementById("cd-s");
tick(); setInterval(tick, 1000);

// Gallery — polaroids on a sagging string (vanilla port of the 21st.dev "polaroid line carousel").
// Drag / swipe, click a print, arrows, ←/→ keys, autoplay. Prints swing on their pegs.
(() => {
  // slides come from data.js -> gallery.photos ; captions follow the current language
  const SLIDES = INVITATION.gallery.photos.map((p, i) => ({ src: p.src, path: "gallery.photos." + i + ".caption" }));
  const OPT = { cardWidth: 310, sag: 38, swing: 1, autoplay: 4500 };
  const root = document.getElementById("gallery");
  if (!root) return;
  const n = SLIDES.length;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad2 = k => (k < 10 ? "0" + k : String(k));
  const stringY = (x, w, y0, sag) => { const t = clamp(x / w, 0, 1); return y0 + 4 * sag * t * (1 - t); };
  const springStep = (x, v, target, dt, k = 70) => { const c = 2 * Math.sqrt(k); const nv = v + (k * (target - x) - c * v) * dt; return [x + nv * dt, nv]; };
  const swingStep = (a, w, lineVel, dt, gain) => { const nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt; return [clamp(a + nw * dt, -0.6, 0.6), nw]; };
  const wrapN = (i) => ((i % n) + n) % n;
  // Circular track: `off` is unbounded; each print sits at its wrapped distance from the centre,
  // so the string keeps sliding in the same direction forever (last -> first is just another step).
  const nearestAt = (off, sp) => Math.round(off / sp);          // unbounded step index
  const relX = (i, off, sp) => { const span = n * sp; return ((((i * sp - off) % span) + span + span / 2) % span) - span / 2; };

  // build prints
  const cards = SLIDES.map((s, i) => {
    const el = document.createElement("div");
    el.className = "g-card"; el.dataset.i = i; el.dataset.on = "0";
    el.innerHTML = '<div class="g-print"><div class="g-shot"><img alt="" draggable="false" loading="lazy"></div><div class="g-note"></div></div><div class="g-peg"></div>';
    el.querySelector("img").src = s.src;
    el.querySelector("img").alt = el.querySelector(".g-note").textContent = IBG.t(s.path);
    root.insertBefore(el, root.querySelector(".g-bar"));
    return el;
  });
  const path = root.querySelector(".g-string path");
  const countB = root.querySelector(".g-count b");
  const countAll = root.querySelector(".g-count");
  countAll.innerHTML = "<b>01</b> / " + pad2(n);
  const sr = root.querySelector(".g-sr");

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = { off: 0, vel: 0, target: 0, a: [], w: [] };
  let size = { w: 700, h: 460, cw: 220 }, spacing = 238;
  let drag = null, active = 0, lastTouch = 0, visible = true, raf = 0, prev = 0, curStep = 0;

  const goStep = k => { S.target = k * spacing; };                          // absolute (unbounded) step
  const goBy = d => goStep(Math.round(S.target / spacing) + d);              // relative step from where we're heading
  const goToIndex = i => { const cur = Math.round(S.off / spacing); const d = Math.round(relX(i, cur * spacing, spacing) / spacing); goStep(cur + d); };
  const setActive = k => {
    active = k;
    cards.forEach((c, i) => (c.dataset.on = i === k ? "1" : "0"));
    countAll.querySelector("b").textContent = pad2(k + 1);
    sr.textContent = IBG.t("gallery.screenReader", { n: k + 1, total: n, title: IBG.t(SLIDES[k].path) });
  };
  setActive(0);
  addEventListener("ibg:lang", () => { cards.forEach((c, i) => { const t = IBG.t(SLIDES[i].path); c.querySelector(".g-note").textContent = t; c.querySelector("img").alt = t; }); setActive(active); });

  new ResizeObserver(() => {
    const r = root.getBoundingClientRect();
    const cw = Math.round(Math.max(150, Math.min(OPT.cardWidth, r.width * 0.56, r.height * 0.6)));
    size = { w: r.width, h: r.height, cw };
    root.style.setProperty("--g-cw", cw + "px");
    spacing = cw * 1.08;
    S.off = S.target = curStep * spacing;
  }).observe(root);

  function frame(now) {
    raf = 0;
    if (!visible) return;
    const dt = prev ? clamp((now - prev) / 1000, 0, 0.033) : 0; prev = now; // 0 on the first frame after (re)start
    const { w, h, cw } = size;
    const y0 = Math.max(34, h * 0.13);
    let lineVel;
    if (drag && drag.moved) lineVel = drag.v * 1000;
    else { const before = S.off; [S.off, S.vel] = springStep(S.off, S.vel, S.target, dt); lineVel = -(S.off - before) / Math.max(dt, 1e-3); }
    const g = reduce ? 0 : OPT.swing;
    const stepNow = nearestAt(S.off, spacing), near = wrapN(stepNow); curStep = stepNow;
    for (let i = 0; i < n; i++) {
      const el = cards[i];
      const x = w / 2 + relX(i, S.off, spacing);
      if (x < -cw * 0.8 || x > w + cw * 0.8) { el.style.visibility = "hidden"; continue; }
      el.style.visibility = "visible";
      let a = S.a[i] || 0, av = S.w[i] || 0;
      [a, av] = swingStep(a, av, lineVel, dt, g);
      if (g) a += Math.sin(now / 1300 + i * 1.7) * 0.0009 * g;
      S.a[i] = a; S.w[i] = av;
      const y = stringY(x, w, y0, OPT.sag) - 6;
      el.style.transform = "translate(" + (x - cw / 2).toFixed(1) + "px," + y.toFixed(1) + "px) rotate(" + a.toFixed(4) + "rad)";
      el.style.zIndex = String(i === near ? n + 1 : n - Math.min(wrapN(i - near), wrapN(near - i)));
    }
    path.setAttribute("d", "M0 " + y0 + " Q" + w / 2 + " " + (y0 + 2 * OPT.sag) + " " + w + " " + y0);
    if (near !== active) setActive(near);
    raf = requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) { prev = 0; raf = requestAnimationFrame(frame); }
  }).observe(root);
  raf = requestAnimationFrame(frame);

  // autoplay (waits while someone is interacting; loops back to the first print)
  setInterval(() => {
    if (!OPT.autoplay || document.hidden || !visible || drag || performance.now() - lastTouch < OPT.autoplay) return;
    goBy(1);
  }, OPT.autoplay);

  root.addEventListener("pointerdown", e => {
    if (e.target.closest(".g-bar")) return;
    lastTouch = performance.now();
    drag = { x: e.clientX, off: S.off, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false };
  });
  root.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; root.dataset.drag = "1"; root.setPointerCapture(e.pointerId); }
    if (!drag.moved) return;
    const dt = Math.max(1, e.timeStamp - drag.lt);
    drag.v = 0.7 * ((e.clientX - drag.lx) / dt) + 0.3 * drag.v;
    drag.lx = e.clientX; drag.lt = e.timeStamp;
    S.off = drag.off - dx;
  });
  const up = e => {
    const d = drag; drag = null; lastTouch = performance.now();
    if (!d) return;
    if (d.moved) { root.dataset.drag = "0"; S.vel = -d.v * 1000; goStep(nearestAt(S.off - d.v * 180, spacing)); return; }
    const card = e.target.closest && e.target.closest("[data-i]");
    if (card) goToIndex(Number(card.dataset.i));
  };
  root.addEventListener("pointerup", up);
  root.addEventListener("pointercancel", up);
  root.querySelectorAll(".g-btn").forEach(b => b.addEventListener("click", () => { lastTouch = performance.now(); goBy(Number(b.dataset.dir)); }));
  root.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") goBy(1);
    else if (e.key === "ArrowLeft") goBy(-1);
    else return;
    lastTouch = performance.now(); e.preventDefault();
  });
})();

// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Guestbook (demo only: no backend)
const gbForm = document.getElementById("gb-form");
if (gbForm) gbForm.addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("gb-thanks").hidden = false;
});
