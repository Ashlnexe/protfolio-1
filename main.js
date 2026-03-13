import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initReveal, initAboutScroll, initTimelinePop, initHeroGlow, initVisionGsap, initEducationMobileScroll } from './js/animations.js';

gsap.registerPlugin(ScrollTrigger);

const navHeader = document.querySelector('.nav-header');
window.addEventListener('scroll', () => {
  navHeader.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

mobileToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuIcon.style.display = isOpen ? 'none' : 'block';
  closeIcon.style.display = isOpen ? 'block' : 'none';
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuIcon.style.display = 'block';
    closeIcon.style.display = 'none';
    document.body.style.overflow = '';
  });
});

const form = document.getElementById('contact-form');
if (form) form.addEventListener('submit', (e) => e.preventDefault());

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

(function () {
  const marqueeRow = document.getElementById('marquee-row');
  if (!marqueeRow) return;
  function getTrackWidth() {
    const track = document.getElementById('marquee-track');
    return track ? track.offsetWidth : 0;
  }
  const BASE_SPEED = 1.2;
  let currentSpeed = BASE_SPEED;
  let targetSpeed = BASE_SPEED;
  let translateX = 0;
  let trackWidth = 0;
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    targetSpeed = BASE_SPEED + delta * 0.25;
  }, { passive: true });
  function tick() {
    if (!trackWidth) trackWidth = getTrackWidth();
    currentSpeed += (targetSpeed - currentSpeed) * 0.08;
    targetSpeed += (BASE_SPEED - targetSpeed) * 0.08;
    translateX -= currentSpeed;
    if (translateX <= -trackWidth) translateX += trackWidth;
    else if (translateX >= 0) translateX -= trackWidth;
    marqueeRow.style.transform = `translateX(${translateX}px)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(() => { trackWidth = getTrackWidth(); tick(); });
})();


// Let's talk button logic
const letsTalkBtn = document.getElementById('lets-talk-btn');
const loadingScreen = document.getElementById('loading-screen');
const contactSection = document.getElementById('contact');

if (letsTalkBtn && loadingScreen && contactSection) {
  letsTalkBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Show loading screen
    loadingScreen.classList.add('active');

    // Wait for 2 seconds
    setTimeout(() => {
      // Hide loading screen
      loadingScreen.classList.remove('active');

      // Scroll to contact section
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  });
}

// Premium Intro Loader Animation
const introLoader = document.getElementById('intro-loader');
if (introLoader) {
  const chars = document.querySelectorAll('.intro-loader .char');
  const line = document.querySelector('.intro-line');

  // Prevent scroll during loader
  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline({
    onComplete: () => {
      introLoader.style.display = 'none';
      document.body.style.overflow = '';
      
      // Initialize scroll animations after loader finishes
      initReveal();
      initAboutScroll();
      initTimelinePop();
      initHeroGlow();
      initVisionGsap();
      initEducationMobileScroll();

      // Trigger hero content manually if they are already in viewport 
      // initReveal will handle it once the observer starts, but just in case
      ScrollTrigger.refresh();
    }
  });

  tl.to(chars, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.05,
    ease: "power3.out"
  }, 0.2)
  .to(line, {
    width: "100%",
    duration: 1.5,
    ease: "power2.inOut"
  }, 0.2) // Start line right after chars start
  .to(introLoader, {
    opacity: 0,
    duration: 0.8,
    ease: "power2.inOut",
    delay: 0.5 // Hold for a moment
  });
} else {
  // Fallback if no loader
  initReveal();
  initAboutScroll();
  initTimelinePop();
  initHeroGlow();
  initVisionGsap();
  initEducationMobileScroll();
}
