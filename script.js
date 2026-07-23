/* ============================================================
   REXAN AI — Main JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   NAVBAR — Scroll & Active Link
   ============================================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link
    const scrollY = window.scrollY + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) + 100;
    sections.forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
            });
        }
    });
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ============================================================
   MOBILE MENU
   ============================================================ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);

    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
    }
});

function closeMobileMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
}

// Close on outside click
document.addEventListener('click', e => {
    if (menuOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileMenu();
    }
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset    = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
});

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const step     = target / (duration / 16);
    let current    = 0;

    const tick = () => {
        current += step;
        if (current >= target) {
            el.textContent = target;
        } else {
            el.textContent = Math.floor(current);
            requestAnimationFrame(tick);
        }
    };
    requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.trust-number').forEach(el => counterObs.observe(el));

/* ============================================================
   SCROLL ANIMATIONS (AOS-like)
   ============================================================ */
const aosObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('aos-animate');
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => aosObs.observe(el));

/* ============================================================
   RING / DONUT CHART ANIMATION
   ============================================================ */
const ringFill = document.getElementById('ringFill');
if (ringFill) {
    const ringObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // circumference = 2π × 72 ≈ 452
                // 98% filled => offset = 452 × 0.02 ≈ 9
                setTimeout(() => {
                    ringFill.style.strokeDashoffset = '9';
                }, 400);
                ringObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    ringObs.observe(document.querySelector('.bv-card') || ringFill);
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
let activeIndex = 0;

function toggleFAQ(index) {
    const items = document.querySelectorAll('.faq-item');

    if (activeIndex === index) {
        // Close all
        items.forEach(item => item.classList.remove('active'));
        activeIndex = -1;
    } else {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        activeIndex = index;
    }
}

// Initialize: first FAQ open
(function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === 0);
    });
    activeIndex = 0;
})();

/* ============================================================
   FORM SUBMISSION
   ============================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', handleSubmit);
}

function handleSubmit(e) {
    e.preventDefault();

    // Basic validation
    const name  = document.getElementById('name');
    const email = document.getElementById('email');
    const ptype = document.getElementById('practiceType');

    if (!name.value.trim())  { shakeInput(name);  return; }
    if (!email.value.trim()) { shakeInput(email); return; }
    if (!ptype.value)        { shakeInput(ptype); return; }

    const btn     = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');

    btn.disabled     = true;
    btnText.textContent = 'Sending...';
    btn.style.opacity   = '0.7';

    // Simulate API call
    setTimeout(() => {
        const formCard = document.getElementById('formCard');
        formCard.innerHTML = `
            <div class="form-success-state">
                <span class="form-success-icon">🎉</span>
                <h3>Demo Booked Successfully!</h3>
                <p>Thank you! Our team will reach out to <strong style="color:var(--text-hi)">${email.value}</strong> within 24 hours to confirm your personalized demo session and answer any questions.</p>
                <div style="margin-top:28px; padding:20px; background:rgba(0,229,160,0.06); border:1px solid rgba(0,229,160,0.15); border-radius:var(--r-md); font-size:14px; color:var(--text-mid);">
                    ✓ Check your inbox for a confirmation email<br>
                    ✓ We'll send you a calendar invite shortly<br>
                    ✓ Prepare any questions about your practice
                </div>
            </div>
        `;
    }, 1800);
}

function shakeInput(el) {
    el.style.borderColor = '#FF6B8A';
    el.style.animation   = 'shake 0.4s ease';
    el.focus();
    setTimeout(() => {
        el.style.borderColor = '';
        el.style.animation   = '';
    }, 1000);
}

// Inject shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
}`;
document.head.appendChild(shakeStyle);

/* ============================================================
   MARQUEE — DUPLICATE FOR SEAMLESS LOOP
   ============================================================ */
(function initMarquee() {
    const track = document.getElementById('marqueeTrack');
    if (!track) return;
    track.innerHTML += track.innerHTML; // Duplicate content
})();

/* ============================================================
   CURSOR GLOW EFFECT (Desktop only)
   ============================================================ */
if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursorGlow';
    document.body.appendChild(glow);

    let mx = 0, my = 0;
    let cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    });

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });

    // Smooth cursor follow
    function animateCursor() {
        cx += (mx - cx) * 0.08;
        cy += (my - cy) * 0.08;
        glow.style.left = cx + 'px';
        glow.style.top  = cy + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

/* ============================================================
   HERO ENTRANCE ANIMATION
   ============================================================ */
(function heroEntrance() {
    const heroContent = document.querySelector('[data-hero-animate]');
    if (!heroContent) return;

    const children = heroContent.children;
    Array.from(children).forEach((child, i) => {
        child.style.opacity   = '0';
        child.style.transform = 'translateY(24px)';
        child.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;

        setTimeout(() => {
            child.style.opacity   = '1';
            child.style.transform = 'translateY(0)';
        }, 200 + i * 120);
    });
})();

/* ============================================================
   PARALLAX — HERO ORBS
   ============================================================ */
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');

window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (orb1) orb1.style.transform += ` translateY(${sy * 0.12}px)`;
    if (orb2) orb2.style.transform += ` translateY(${-sy * 0.08}px)`;
}, { passive: true });

/* ============================================================
   SERVICE CARDS — TILT EFFECT
   ============================================================ */
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left - rect.width / 2;
        const y      = e.clientY - rect.top  - rect.height / 2;
        const tiltX  = -(y / rect.height) * 6;
        const tiltY  =  (x / rect.width)  * 6;

        card.style.transform = `translateY(-5px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease, border-color 0.3s, box-shadow 0.3s';
    });
});

/* ============================================================
   STEP CARDS — HOVER GLOW
   ============================================================ */
document.querySelectorAll('.step-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 8px 40px rgba(0,102,255,0.3)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

/* ============================================================
   SCROLL PROGRESS INDICATOR (Top Bar)
   ============================================================ */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #0066FF, #00D4FF);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s ease;
    pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    progressBar.style.width = progress + '%';
}, { passive: true });

/* ============================================================
   NUMBER FORMAT HELPER
   ============================================================ */
// Already handled inline — this is just a placeholder for future use

/* ============================================================
   PERFORMANCE: Lazy load any images (future-proof)
   ============================================================ */
if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        // Browser handles natively
    });
}

/* ============================================================
   INIT LOG
   ============================================================ */
console.log('%c🚀 Rexan AI Website Loaded', 'color:#00D4FF; font-size:16px; font-weight:bold;');
console.log('%cBuilt for healthcare excellence.', 'color:#8A9BC4; font-size:12px;');
