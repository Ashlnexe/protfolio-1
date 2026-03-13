import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { initReveal, initAboutScroll, initTimelinePop, initHeroGlow, initVisionGsap, initEducationMobileScroll, initEducationScroll } from './js/animations.js';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Synchronize Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Hook Lenis into GSAP requestAnimationFrame ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // GSAP time is in seconds, Lenis needs ms
});

// Disable GSAP lag smoothing to properly sync with Lenis
gsap.ticker.lagSmoothing(0);

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
    loadingScreen.classList.add('active');
    setTimeout(() => {
      loadingScreen.classList.remove('active');
      lenis.scrollTo(contactSection);
    }, 2000);
  });
}

// Contact form Submission Success Message
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.innerHTML = `
      <div class="p-8 bg-black/[0.03] rounded-2xl border border-black/10 text-center flex flex-col items-center justify-center min-h-[300px]">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-black mb-6">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h3 class="text-2xl font-bold tracking-tight text-black mb-2">Message Sent</h3>
        <p class="text-black/70">Thank you for reaching out. I'll get back to you shortly.</p>
      </div>
    `;
  });
}

// Ensure all anchor links use Lenis smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.getAttribute('href').length > 1) {
      e.preventDefault();
      const targetElement = document.querySelector(this.getAttribute('href'));
      if (targetElement) {
        lenis.scrollTo(targetElement);
        // Also close mobile menu if it's open
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
          if (menuIcon) menuIcon.style.display = 'block';
          if (closeIcon) closeIcon.style.display = 'none';
        }
      }
    }
  });
});

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
      initEducationScroll();

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
  initEducationScroll();
}
