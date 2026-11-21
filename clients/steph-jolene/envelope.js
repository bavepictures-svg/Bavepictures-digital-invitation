// Envelope intro: tap -> zoom into the envelope -> fade into the invitation.
(() => {
  const env = document.getElementById("envelope");
  if (!env) return;
  const body = document.body;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finish = () => { env.classList.add("is-gone"); body.classList.remove("env-lock"); };

  // dev shortcut: index.html#skip-envelope
  if (location.hash === "#skip-envelope") { finish(); dispatchEvent(new Event("ibg:invitation")); return; }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  // keep the invitation out of the tab order / screen readers while the envelope is closed
  const page = document.querySelector(".page");
  page.setAttribute("inert", ""); page.setAttribute("aria-hidden", "true");

  // Lay the two flap branches along the flap's slanted edges (depends on screen shape).
  const fl = env.querySelector(".eb-fl"), fr = env.querySelector(".eb-fr");
  const obj = env.querySelector(".env-obj");
  function layout() {
    const W = obj.clientWidth, H = obj.clientHeight;
    const tipY = 0.52 * H, th = Math.atan2(tipY, W / 2), E = Math.hypot(W / 2, tipY);
    const len = E * 0.6, hgt = len * 150 / 420, off = hgt * 0.5 + W * 0.012, sf = 0.05;
    const s = Math.sin(th), c = Math.cos(th);
    [fl, fr].forEach(el => { el.style.width = len + "px"; el.style.height = hgt + "px"; });
    const lx = off * s + sf * E * c, ly = -off * c + sf * E * s;
    fl.style.transform = `translate(${lx}px,${ly}px) rotate(${th}rad) translate(0,-50%)`;
    fr.style.transform = `translate(${W - lx}px,${ly}px) rotate(${-th}rad) scaleX(-1) translate(0,-50%)`;
  }
  layout(); addEventListener("resize", layout);

  // Centre the prompt on the arc (works for any text length) and hang the hand just after its last letter.
  const tp = env.querySelector(".env-cta textPath"), handPos = env.querySelector(".hand-pos");
  function placeHand() {
    try {
      const n = tp.getNumberOfChars(); if (!n) return;
      const p = tp.getEndPositionOfChar(n - 1);
      handPos.setAttribute("transform", `translate(${(p.x + 6).toFixed(1)} ${(p.y - 22).toFixed(1)})`);
    } catch (e) {}
  }
  placeHand(); addEventListener("ibg:lang", () => requestAnimationFrame(placeHand));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeHand);
  addEventListener("load", placeHand);

  let opened = false;
  function open() {
    if (opened) return; opened = true;
    // zoom factor: enough for the paper to fill the screen, centred on the seal
    const r = obj.getBoundingClientRect();
    env.style.setProperty("--zoom", Math.max(innerWidth / r.width, innerHeight / (r.height * 0.48)) * 1.5 + "");
    dispatchEvent(new Event("ibg:envelope-open"));   // user gesture: lets the music element be primed (silently)
    env.classList.add("is-open");
    setTimeout(() => {
      env.classList.add("is-leaving");
      dispatchEvent(new Event("ibg:invitation"));
      body.classList.remove("env-lock");
      page.removeAttribute("inert"); page.removeAttribute("aria-hidden");
      window.scrollTo(0, 0);
      setTimeout(() => { finish(); page.style.transform = "none"; }, reduce ? 50 : 550);
    }, reduce ? 150 : 800);
  }
  env.addEventListener("click", open);
  env.querySelector(".env-seal").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
})();
