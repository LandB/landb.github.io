// The Couples Cycle mark's orbit, as the app draws it (AppMark / OrbitMotion): the two circles
// turn once around a vertical axis, seen from a little above, so each passes in front of the
// other (the face squints, "^ ^"), then settle into the logo and smile wider with a tilt of the
// head. Depth and tilt are gone at rest, so the rest is the logo; it keeps blinking (mark.css).
// Skipped when the visitor prefers reduced motion; without script the mark just stands still.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const turnMs = 2880;            // 6 s loop × 0.48, as in the app
  const squintMs = 2200;          // the eyes reopen near the end of the turn
  const smileMs = 2700;           // after the turn
  const restAngle = 24 * Math.PI / 180;
  const peakTilt = 16 * Math.PI / 180;

  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const x = t => ((ax * t + bx) * t + cx) * t;
    const y = t => ((ay * t + by) * t + cy) * t;
    const dx = t => (3 * ax * t + 2 * bx) * t + cx;
    return p => {
      let t = p;
      for (let i = 0; i < 8; i++) {
        const error = x(t) - p, slope = dx(t);
        if (Math.abs(error) < 1e-6 || !slope) break;
        t = Math.min(1, Math.max(0, t - error / slope));
      }
      return y(t);
    };
  }
  const ease = bezier(0.6, 0, 0.25, 1);

  // After every stylesheet has applied: mark.css sets the size the orbit is measured from.
  const run = () => { for (const mark of document.querySelectorAll(".mark")) orbit(mark); };
  if (document.readyState === "complete") run(); else addEventListener("load", run, { once: true });

  function orbit(mark) {
    const [tracker, partner] = mark.querySelectorAll("i");
    const size = mark.getBoundingClientRect().width;
    const offset = size * 7 / 56;
    const radius = offset / Math.sin(restAngle);
    const perspective = 4.3 * size;

    const place = (el, angle, tilt, envelope) => {
      const x = radius * Math.sin(angle), z = radius * Math.cos(angle);
      const scale = perspective / (perspective - z * envelope);
      el.style.transform = `translate(${x * scale}px, ${z * Math.sin(tilt) * scale}px) scale(${scale})`;
      return z;
    };

    let start;
    const frame = now => {
      start ??= now;
      const progress = Math.min((now - start) / turnMs, 1);
      const eased = ease(progress);
      const envelope = Math.sin(Math.PI * eased);
      const angle = restAngle + 2 * Math.PI * eased;
      const tilt = peakTilt * envelope;
      const partnerDepth = place(partner, angle, tilt, envelope);
      const trackerDepth = place(tracker, angle + Math.PI, tilt, envelope);
      partner.style.zIndex = partnerDepth >= trackerDepth ? 2 : 1;
      tracker.style.zIndex = partnerDepth >= trackerDepth ? 1 : 2;
      if (progress < 1) requestAnimationFrame(frame);
    };
    setTimeout(() => {
      mark.classList.add("spinning");
      setTimeout(() => mark.classList.remove("spinning"), squintMs);
      setTimeout(() => mark.classList.add("smiling"), turnMs);
      setTimeout(() => mark.classList.remove("smiling"), turnMs + smileMs);
      requestAnimationFrame(frame);
    }, 250);
  }
})();
