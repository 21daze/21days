// Simple audio helper
function play(name){
  const el = document.getElementById('sfx-' + name);
  if (!el) return;
  el.currentTime = 0;
  el.play().catch(()=>{ /* autoplay may be blocked until a click */ });
}

// Click-to-play
document.querySelectorAll('.omen').forEach(el=>{
  el.addEventListener('click', ()=> play(el.dataset.omen));
});

// Horizontal scroll wheel convenience (Shift+wheel not always comfy)
const track = document.getElementById('track');
track.addEventListener('wheel', (e)=>{
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    track.scrollLeft += e.deltaY;
    e.preventDefault();
  }
}, { passive:false });

// IntersectionObserver to auto-trigger SFX when panel enters center view
const playedOnce = new Map(); // optional: avoid spam
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const omen = el.dataset.omen;
    if (!omen) return;

    // Trigger once per entrance, but allow replay after a pause
    const last = playedOnce.get(el) || 0;
    const now = performance.now();
    if (now - last > 2500) {
      play(omen);
      playedOnce.set(el, now);
    }
  });
},{
  root: track,
  rootMargin: "0px",
  threshold: 0.65 // panel mostly in view
});

// Observe each omen
document.querySelectorAll('.omen').forEach(el=> io.observe(el));