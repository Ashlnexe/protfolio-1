import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initReveal() {
    const revealEls = document.querySelectorAll('.reveal:not(.about-reveal)');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = [...entry.target.parentElement.children];
                const delay = siblings.indexOf(entry.target) * 80;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '-80px 0px', threshold: 0.05 });
    revealEls.forEach(el => observer.observe(el));
}

export function initAboutScroll() {
    const aboutSection = document.getElementById('about');
    const parallaxBg = document.querySelector('.about-parallax-bg');
    const items = gsap.utils.toArray('.about-reveal');

    if (!aboutSection) return;

    if (parallaxBg) {
        gsap.fromTo(parallaxBg,
            { yPercent: -10 },
            {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: aboutSection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    }

    if (items.length) {
        gsap.fromTo(items,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: aboutSection,
                    start: 'top 75%'
                }
            }
        );
    }

    // Word-by-word reveal for paragraphs
    const splitTextAnims = document.querySelectorAll('.split-text-anim');
    splitTextAnims.forEach(paragraph => {
        // Split text by words, ignoring extra whitespace
        const words = paragraph.innerText.trim().split(/\s+/);
        paragraph.innerHTML = '';
        
        words.forEach(word => {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-wrapper';
            
            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.textContent = word + '\u00A0'; // Add non-breaking space
            
            wrapper.appendChild(inner);
            paragraph.appendChild(wrapper);
        });

        // Animate the words changing to black on scroll
        const wordInners = paragraph.querySelectorAll('.word-inner');
        gsap.to(wordInners, {
            color: '#000000',
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
                trigger: paragraph,
                start: "top 80%",
                end: "bottom 60%",
                scrub: 1
            }
        });
    });
}

export function initTimelinePop() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('pop-active', entry.isIntersecting);
        });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    timelineItems.forEach(item => obs.observe(item));
}

export function initHeroGlow() {
    const heroSection = document.querySelector('.hero');
    const heroTitle = document.getElementById('hero-title');
    const heroLighting = document.querySelector('.hero-lighting');
    if (!heroSection || !heroTitle) return;

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroTitle.getBoundingClientRect();
        const heroRect = heroSection.getBoundingClientRect();

        // Title Glow
        heroTitle.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
        heroTitle.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');

        // Hero Lighting
        if (heroLighting) {
            const x = ((e.clientX - heroRect.left) / heroRect.width) * 100;
            const y = ((e.clientY - heroRect.top) / heroRect.height) * 100;
            heroLighting.style.setProperty('--mouse-x', `${x}%`);
            heroLighting.style.setProperty('--mouse-y', `${y}%`);
        }
    }, { passive: true });

    window.addEventListener('scroll', () => {
        if (heroLighting) {
            const scrollPercent = (window.scrollY / window.innerHeight) * 50;
            heroLighting.style.setProperty('--mouse-y', `${50 + scrollPercent}%`);
        }
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
        heroTitle.style.setProperty('--glow-x', '50%');
        heroTitle.style.setProperty('--glow-y', '50%');
    });
}

export function initVisionGsap() {
    const visionQuote = document.querySelector('.vision-quote');
    if (!visionQuote) return;
    gsap.fromTo(visionQuote,
        { opacity: 0, y: 60 },
        {
            opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: {
                trigger: visionQuote,
                start: 'top 80%',
                toggleActions: 'play none none none',
            }
        }
    );
}

export function initEducationMobileScroll() {
    // Only run this logic for mobile viewports
    if (window.innerWidth > 768) return;

    const educationItems = gsap.utils.toArray('.education-item');
    if (!educationItems.length) return;

    educationItems.forEach(item => {
        // Highlight when scrolling into the center
        ScrollTrigger.create({
            trigger: item,
            start: "top 65%", 
            end: "bottom 35%", 
            toggleClass: "mobile-active",
        });

        // Fade out when it's almost leaving the top of the viewport
        ScrollTrigger.create({
            trigger: item,
            start: "top 10%", 
            onEnter: () => gsap.to(item, { opacity: 0, y: -40, duration: 0.5, ease: 'power2.in' }),
            onLeaveBack: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        });
    });
}
