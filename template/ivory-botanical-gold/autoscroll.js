// Gentle auto-scroll down the invitation. Any manual input pauses it; it resumes on its own after a short idle moment.
(() => {
  const CFG = (window.INVITATION.settings || {}).autoscroll || {};
  if (CFG.enabled === false) return;
  const SPEED = CFG.speed || 32;   // px per second (slow) — settings.autoscroll.speed
  const IDLE = 120;          // ms: just long enough to tell that manual scrolling (incl. momentum) has actually stopped
  const START_DELAY = 1400;  // let the hero breathe first
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let active = false, raf = 0, last = 0, pos = 0, setY = 0, lastInput = 0, ramp = 0, holding = 0;
  const now = () => performance.now();
  const bump = () => { lastInput = now(); ramp = 0; };
  const maxY = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const isField = el => el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);

  // --- manual interaction: pause ---
  ["wheel", "touchstart", "touchmove", "keydown", "mousedown"].forEach(ev => addEventListener(ev, bump, { passive: true }));
  // scrollbar drags, momentum scrolling, anchor jumps… anything that moves the page but wasn't us
  addEventListener("scroll", () => { if (Math.abs(scrollY - setY) > 2) { bump(); pos = scrollY; setY = scrollY; } }, { passive: true });
  // while a finger / mouse is down on the page (e.g. dragging the carousel), or the visitor is typing, stay paused
  addEventListener("pointerdown", () => { holding++; bump(); }, { passive: true });
  ["pointerup", "pointercancel"].forEach(ev => addEventListener(ev, () => { holding = Math.max(0, holding - 1); bump(); }, { passive: true }));
  addEventListener("touchend", () => { holding = 0; bump(); }, { passive: true });
  document.addEventListener("visibilitychange", () => { last = 0; bump(); });

  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
    const paused = holding > 0 || isField(document.activeElement) || document.hidden || now() - lastInput < IDLE
      || document.body.classList.contains("env-lock");
    if (paused) { ramp = 0; pos = scrollY; setY = scrollY; return; }
    ramp = Math.min(1, ramp + dt / 0.35);                        // very short ease-in so the restart isn't a jolt
    const y = Math.min(maxY(), pos + SPEED * ramp * ramp * (3 - 2 * ramp) * dt);
    if (y >= maxY() - 0.5) { pos = y; return; }                  // reached the end: just rest there
    pos = y; setY = y;
    scrollTo({ top: y, left: 0, behavior: "instant" });
  }
  function start() {
    if (active) return; active = true;
    pos = scrollY; setY = scrollY; lastInput = now() - IDLE + START_DELAY;   // first move after START_DELAY (initial delay only)
    raf = requestAnimationFrame(frame);
  }
  addEventListener("ibg:invitation", start);
})();
