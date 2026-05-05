// ========== GSAP & LENIS SETUP ==========
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0, 0);

// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
if (cursor && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.opacity = '1';
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
  });
  document.querySelectorAll('a, button, .menu-tab, .gal-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

// ========== HERO PARTICLES ==========
const particlesContainer = document.getElementById('heroParticles');
if (particlesContainer) {
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 6 + 's';
    p.style.animationDuration = (4 + Math.random() * 4) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    particlesContainer.appendChild(p);
  }
}

// ========== CINEMATIC INTRO ==========
document.body.style.overflow = 'hidden';
const introScreen = document.getElementById('introScreen');
const introBar = document.getElementById('introBar');
let progress = 0;
const loaderInterval = setInterval(() => {
  progress += Math.random() * 20;
  if (progress > 100) progress = 100;
  if (introBar) introBar.style.width = progress + '%';
  if (progress >= 100) {
    clearInterval(loaderInterval);
    setTimeout(() => {
      gsap.to(introScreen, {
        opacity: 0, duration: 0.8, ease: 'power2.inOut',
        onComplete: () => {
          introScreen.style.display = 'none';
          document.body.style.overflow = '';
          initAnimations();
        }
      });
    }, 500);
  }
}, 80);

// ========== CORE ANIMATIONS ==========
function initAnimations() {
  // Hero entrance
  const tl = gsap.timeline();
  tl.fromTo('.hero-badge', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
    .fromTo('.title-word', { y: 80, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15
    }, '-=0.6')
    .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .fromTo('.hero-btns', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.3');

  // Hero parallax
  gsap.to('.hero-img', {
    yPercent: 15, ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Scroll-triggered reveals
  gsap.utils.toArray('.gs-reveal').forEach((el) => {
    gsap.fromTo(el,
      { y: 45, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        delay: parseFloat(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // Counter animation
  document.querySelectorAll('.counter').forEach(counter => {
    const target = +counter.dataset.target;
    gsap.to(counter, {
      innerText: target,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: { trigger: counter, start: 'top 85%' }
    });
  });

  // About images parallax
  gsap.to('.about-img-main', {
    y: -40, ease: 'none',
    scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  gsap.to('.about-img-secondary', {
    y: 30, ease: 'none',
    scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  // Gallery items stagger
  gsap.utils.toArray('.gal-item').forEach((item, i) => {
    gsap.fromTo(item,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        delay: i * 0.08,
        scrollTrigger: { trigger: '.gallery-masonry', start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
  });

  // Private dining parallax
  gsap.to('.private-img', {
    yPercent: 20, ease: 'none',
    scrollTrigger: { trigger: '.private-section', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  // Menu items stagger
  gsap.utils.toArray('.menu-item').forEach((item, i) => {
    gsap.fromTo(item,
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none reverse' }
      }
    );
  });
}

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
});

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  navToggle.querySelector('i').className = navMenu.classList.contains('open') ? 'ri-close-line' : 'ri-menu-3-line';
});

// Smooth scroll for nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navMenu.classList.remove('open');
    navToggle.querySelector('i').className = 'ri-menu-3-line';
    lenis.scrollTo(link.getAttribute('href'), { offset: -80 });
  });
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  if (!anchor.classList.contains('nav-link')) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      lenis.scrollTo(this.getAttribute('href'), { offset: -80 });
    });
  }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (scrollY >= top) current = section.getAttribute('id');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// ========== MENU TABS ==========
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(tab.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

// ========== TESTIMONIAL SLIDER ==========
const track = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('testiPrev');
const nextBtn = document.getElementById('testiNext');
let testiIndex = 0;
const totalSlides = document.querySelectorAll('.testimonial-card').length;

function updateSlider() {
  if (track) track.style.transform = `translateX(-${testiIndex * 100}%)`;
}
if (prevBtn) prevBtn.addEventListener('click', () => { testiIndex = (testiIndex - 1 + totalSlides) % totalSlides; updateSlider(); });
if (nextBtn) nextBtn.addEventListener('click', () => { testiIndex = (testiIndex + 1) % totalSlides; updateSlider(); });

// Auto-advance
setInterval(() => { testiIndex = (testiIndex + 1) % totalSlides; updateSlider(); }, 5000);

// ========== FORM HANDLING ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i> Processing...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="ri-check-line"></i> Reservation Confirmed!';
      btn.style.background = 'linear-gradient(135deg,#2ecc71,#27ae60)';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        e.target.reset();
      }, 3000);
    }, 1800);
  });
}

// Newsletter form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button');
    btn.innerHTML = '<i class="ri-check-line"></i>';
    btn.style.background = '#2ecc71';
    setTimeout(() => {
      btn.innerHTML = '<i class="ri-send-plane-fill"></i>';
      btn.style.background = '';
      newsletterForm.reset();
    }, 2500);
  });
}

// Spin animation for loader
const style = document.createElement('style');
style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(style);

// ========== WHATSAPP FLOAT SHOW ON SCROLL ==========
const waFloat = document.getElementById('whatsappFloat');
if (waFloat) {
  waFloat.style.opacity = '0';
  waFloat.style.transform = 'scale(0)';
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      waFloat.style.opacity = '1';
      waFloat.style.transform = 'scale(1)';
    } else {
      waFloat.style.opacity = '0';
      waFloat.style.transform = 'scale(0)';
    }
  });
  // cursor hover
  if (cursor) {
    waFloat.addEventListener('mouseenter', () => cursor.classList.add('active'));
    waFloat.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  }
}
