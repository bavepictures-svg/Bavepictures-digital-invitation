// Background music: stays silent during the envelope, then fades in when the invitation appears.
(() => {
  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("music-btn");
  if (!audio || !btn) return;   // music disabled in data.js -> render.js removed both
  const VOL = (window.INVITATION.settings.music || {}).volume ?? 0.55;
  let userPaused = false, wasPlayingBeforeHide = false, primed = false;

  const audible = () => !audio.paused && !audio.muted;
  function sync() {
    const on = audible();
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", window.IBG.t(on ? "ui.musicPause" : "ui.musicPlay"));
  }
  ["play", "pause", "volumechange", "ended"].forEach(ev => audio.addEventListener(ev, sync));
  addEventListener("ibg:lang", sync);

  function fadeIn() {
    audio.muted = false; audio.volume = 0;           // iOS ignores .volume (plays at device volume) — harmless
    const t0 = performance.now();
    (function step(now) {
      const k = Math.min(1, (now - t0) / 1800); audio.volume = VOL * k;
      if (k < 1 && audible()) requestAnimationFrame(step);
    })(t0);
  }
  function waitForGesture() {                          // autoplay blocked: start at the visitor's first interaction
    const go = () => { removeEventListener("pointerdown", go); removeEventListener("keydown", go); removeEventListener("touchend", go);
      if (!userPaused) { audio.muted = false; audio.volume = VOL; audio.play().catch(() => {}); } };
    addEventListener("pointerdown", go, { once: true }); addEventListener("keydown", go, { once: true }); addEventListener("touchend", go, { once: true });
  }

  // The envelope click is a user gesture: start the element *muted* right then (unlocks playback everywhere, nothing audible).
  addEventListener("ibg:envelope-open", () => {
    audio.muted = true; audio.volume = 0;
    audio.play().then(() => { primed = true; }).catch(() => {});
  });
  // Invitation is on screen: show the button and bring the sound in.
  addEventListener("ibg:invitation", () => {
    btn.hidden = false; requestAnimationFrame(() => btn.classList.add("show"));
    if (userPaused) return;
    if (primed && !audio.paused) { fadeIn(); return; }
    audio.muted = false; audio.volume = VOL;
    audio.play().then(() => { primed = true; }).catch(() => { audio.muted = true; sync(); waitForGesture(); });
  });

  btn.addEventListener("click", () => {
    if (audible()) { userPaused = true; audio.pause(); }
    else { userPaused = false; audio.muted = false; audio.volume = VOL; audio.play().catch(() => {}); }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { wasPlayingBeforeHide = audible(); if (wasPlayingBeforeHide) audio.pause(); }
    else if (wasPlayingBeforeHide && !userPaused) { audio.play().catch(() => {}); wasPlayingBeforeHide = false; }
  });
  sync();
})();
