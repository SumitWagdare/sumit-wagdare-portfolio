// Mobile nav toggle
const menuBtn = document.getElementById('menuBtn');
const navlinks = document.getElementById('navlinks');
menuBtn.addEventListener('click', () => {
  const open = navlinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navlinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

// Scroll reveal
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('[data-reveal]');
if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('in-view'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

// Oscilloscope signature element — live signal trace behind the hero
const canvas = document.getElementById('scope');
const ctx = canvas.getContext('2d');
let w, h, dpr;

function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.parentElement.offsetWidth;
  h = canvas.parentElement.offsetHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize', resize);
resize();

let t = 0;
function drawTrace(offsetY, amp, speed, color, glow){
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4){
    const y = offsetY
      + Math.sin((x * 0.01) + t * speed) * amp
      + Math.sin((x * 0.035) + t * speed * 1.6) * (amp * 0.28);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.shadowBlur = glow;
  ctx.shadowColor = color;
  ctx.stroke();
}

function frame(){
  ctx.clearRect(0,0,w,h);
  drawTrace(h*0.32, 26, 0.018, 'rgba(94,234,212,0.55)', 6);
  drawTrace(h*0.78, 16, 0.024, 'rgba(255,159,28,0.4)', 5);
  t += 1;
  if (!reduceMotion) requestAnimationFrame(frame);
}
frame();
