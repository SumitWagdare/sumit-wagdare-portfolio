import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createIcons, Mail, Code, Code2, Database, Layout, Award, Cloud, Briefcase, MessageCircle } from 'lucide';

// Register Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lucide Icons
createIcons({
  icons: { Mail, Code, Code2, Database, Layout, Award, Cloud, Briefcase, MessageCircle }
});

// Initialize Smooth Scroll (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Link GSAP to Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// -----------------------------------------------------------------
// Interaction Logic
// -----------------------------------------------------------------

// Liquid Custom Cursor
const cursor = document.querySelector('.cursor');
if (cursor && !window.matchMedia('(pointer: coarse)').matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animate cursor smooth using GSAP ticker
  gsap.to(cursor, {
    x: () => mouseX,
    y: () => mouseY,
    duration: 0.1,
    ease: 'power3.out',
    overwrite: 'auto'
  });

  // Hover effect on interactable elements
  const hoverStates = document.querySelectorAll('button, a, .glass-panel, .tag');
  hoverStates.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

// -----------------------------------------------------------------
// Animations
// -----------------------------------------------------------------

// Hero Animation
const tlHero = gsap.timeline();
tlHero.from('.hero-title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 })
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('.hero-actions', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from('.hero-image-wrapper', { scale: 0.9, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=0.8');

// Floating background blobs parallax
gsap.to('.bg-blob-1', {
  yPercent: 30,
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1
  }
});
gsap.to('.bg-blob-2', {
  yPercent: -40,
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5
  }
});

// Evolution (Skills) Bento Stagger Reveal
gsap.from('.skill-card', {
  y: 60,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.evolution',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  }
});

// Milestones Certification Cards Reveal
gsap.from('.cert-card', {
  y: 40,
  opacity: 0,
  rotationX: -15, // slight 3D reveal
  transformOrigin: 'top center',
  duration: 1,
  stagger: 0.2,
  ease: 'back.out(1.5)',
  scrollTrigger: {
    trigger: '.milestones',
    start: 'top 85%',
    toggleActions: 'play none none reverse'
  }
});

// The Lab (Horizontal Scrolling section)
const labTrack = document.querySelector('.lab-track');
if (labTrack) {
  const getScrollAmount = () => -(labTrack.scrollWidth - window.innerWidth + 100);

  const tween = gsap.to(labTrack, {
    x: getScrollAmount,
    ease: 'none'
  });

  ScrollTrigger.create({
    trigger: '.lab',
    start: 'top top',
    end: () => `+=${labTrack.scrollWidth}`, // Scroll distance depends on width
    pin: true,
    animation: tween,
    scrub: 1, // Smooth scrubbing
    invalidateOnRefresh: true, // Recalculate values on resize
  });
}

// Leadership & Community Grid Reveal
gsap.from('.lead-card', {
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.leadership',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  }
});

// Ensure Lenis updates on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
