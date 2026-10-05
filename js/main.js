/**
 * THE HOMEMADE HEARTH — MAIN INTERACTIVE SCRIPT
 * Authentic Homemade Cooking & Food Brand
 * Includes:
 * - GSAP & ScrollTrigger Animations
 * - Canvas Steam Particle Generators (Hero & Central Vessel)
 * - 3D Mouse Parallax on Food Composition
 * - Vegetarian & Non-Vegetarian Cooking Stage Switchers
 * - "From Ingredient to Plate" Interactive Morphing
 * - Signature Dishes Gallery & Dynamic Recipe Modal
 * - Scroll-linked Timeline Progress Line
 * - Horizontal Panoramic Scroll Handling
 * - Dual Dietary Category Switcher (Veg / Non-Veg)
 * - Testimonials Carousel
 * - Web Audio API Hearth Simmer Ambiance Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Ensure window starts at the hero section on clean page load
  if (!window.location.hash) {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }

  /* ==========================================================================
     1. NAVIGATION & HEADER SCROLL EFFECT
     ========================================================================== */
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  const mobileDrawerClose = document.querySelector('.mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  const handleScrollHeader = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // Mobile Menu Drawer
  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeMobileMenu = () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', closeMobileMenu);
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     2. REALISTIC STEAM PARTICLE GENERATOR (HTML5 CANVAS)
     ========================================================================== */
  class SteamEffect {
    constructor(canvasId, options = {}) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width = options.width || this.canvas.offsetWidth || 300;
      this.height = this.canvas.height = options.height || this.canvas.offsetHeight || 260;
      this.particleCount = options.particleCount || 45;
      this.particles = [];
      this.originX = this.width / 2;
      this.originY = this.height * 0.85;
      this.baseColor = options.color || 'rgba(255, 255, 255, ';
      this.isRunning = true;

      this.init();
      this.animate();

      window.addEventListener('resize', () => {
        if (!this.canvas) return;
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        this.originX = this.width / 2;
        this.originY = this.height * 0.85;
      });
    }

    init() {
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(this.createParticle(true));
      }
    }

    createParticle(randomStart = false) {
      return {
        x: this.originX + (Math.random() - 0.5) * (this.width * 0.4),
        y: randomStart ? Math.random() * this.originY : this.originY + (Math.random() * 20),
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.5 + Math.random() * 0.9),
        radius: 12 + Math.random() * 18,
        maxRadius: 38 + Math.random() * 25,
        alpha: 0,
        maxAlpha: 0.12 + Math.random() * 0.14,
        fadeSpeed: 0.003 + Math.random() * 0.004,
        growthSpeed: 0.2 + Math.random() * 0.3,
        life: 0,
        maxLife: 150 + Math.random() * 100,
        swayOffset: Math.random() * Math.PI * 2
      };
    }

    animate() {
      if (!this.isRunning) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.life++;

        // Sway motion
        p.x += Math.sin(p.life * 0.03 + p.swayOffset) * 0.4 + p.vx;
        p.y += p.vy;
        p.radius = Math.min(p.maxRadius, p.radius + p.growthSpeed);

        // Alpha envelope
        if (p.life < p.maxLife * 0.3) {
          p.alpha = Math.min(p.maxAlpha, p.alpha + p.fadeSpeed);
        } else if (p.life > p.maxLife * 0.6) {
          p.alpha = Math.max(0, p.alpha - p.fadeSpeed * 1.5);
        }

        // Draw soft steam cloud
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `${this.baseColor}${p.alpha})`);
        gradient.addColorStop(0.6, `${this.baseColor}${p.alpha * 0.45})`);
        gradient.addColorStop(1, `${this.baseColor}0)`);

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Respawn if out of bounds or dead
        if (p.life >= p.maxLife || p.y < 0 || p.alpha <= 0 && p.life > 20) {
          this.particles[i] = this.createParticle(false);
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  // Initialize Steam for Hero Dish, Section 5 Vessel & Final CTA Feast
  new SteamEffect('heroSteamCanvas', { width: 340, height: 260, particleCount: 35 });
  new SteamEffect('vesselSteamCanvas', { width: 600, height: 500, particleCount: 45 });
  new SteamEffect('ctaSteamCanvas', { width: 1200, height: 500, particleCount: 50 });

  /* ==========================================================================
     GSAP & SCROLLTRIGGER ENHANCED CINEMATIC SUITE
     ========================================================================== */
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Hero Load Entrance Animation (Sequentially animate ingredients into composition)
    const heroTl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.6 },
      onComplete: () => {
        gsap.set('.hero-content, .hero-content *, .hero-stage, .hero-stage *', {
          clearProps: 'opacity,visibility'
        });
      }
    });

    heroTl
      .from('.hero-eyebrow', { opacity: 0, y: 15, duration: 0.5 })
      .from('.hero-title', { opacity: 0, y: 25, duration: 0.6 }, '-=0.3')
      .from('.hero-description', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-actions .btn', { opacity: 0, y: 15, stagger: 0.1, duration: 0.5 }, '-=0.3')
      .from('.hero-badge-item', { opacity: 0, y: 12, stagger: 0.08, duration: 0.4 }, '-=0.2')
      .from('.hero-center-dish', { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.1)' }, '-=0.8')
      .from('.item-herbs', { scale: 0.5, opacity: 0, rotation: -15, duration: 0.6 }, '-=0.5')
      .from('.item-spices', { scale: 0.5, opacity: 0, rotation: 20, duration: 0.6 }, '-=0.5')
      .from('.item-bread', { scale: 0.5, opacity: 0, rotation: -10, duration: 0.6 }, '-=0.5')
      .from('.item-meat', { scale: 0.5, opacity: 0, rotation: 10, duration: 0.6 }, '-=0.5')
      .from('.floating-spice-leaf', { opacity: 0, scale: 0, stagger: 0.08, duration: 0.5 }, '-=0.4')
      .from('.hero-tag-card', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3');

    // Continuous subtle floating & rotation on ingredients
    gsap.to('.item-herbs', { y: -12, rotation: -4, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.item-spices', { y: 14, rotation: 14, duration: 3.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.item-bread', { y: -15, rotation: -8, duration: 4.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.item-meat', { y: 12, rotation: 4, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.spice-star-anise', { rotation: '+=360', duration: 45, repeat: -1, ease: 'none' });
    gsap.to('.spice-chili', { rotation: '+=12', yoyo: true, duration: 3.2, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.spice-coriander', { y: -10, duration: 2.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // 2. ScrollTrigger batch reveals on sections
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.from('.homemade-card', {
        scrollTrigger: {
          trigger: '.homemade-cards-grid',
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true
        },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'all'
      });

      gsap.from('.section-vegetarian .transformation-container', {
        scrollTrigger: {
          trigger: '.section-vegetarian .transformation-container',
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        },
        y: 35,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'all'
      });

      gsap.from('.section-nonveg .journey-container', {
        scrollTrigger: {
          trigger: '.section-nonveg .journey-container',
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        },
        y: 35,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'all'
      });

      gsap.from('.signature-gallery .dish-card', {
        scrollTrigger: {
          trigger: '.signature-gallery',
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        },
        y: 35,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'all'
      });

      gsap.from('.feature-block', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'all'
      });

      window.addEventListener('load', () => {
        ScrollTrigger.refresh();
      });
    }
  }

  /* ==========================================================================
     3. HERO 3D MOUSE PARALLAX & TILT
     ========================================================================== */
  const heroSection = document.querySelector('.hero-section');
  const heroStage = document.querySelector('.hero-stage');
  const floatItems = document.querySelectorAll('.hero-float-item, .floating-spice-leaf, .hero-tag-card');

  if (heroSection && heroStage) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });

    const updateHeroTilt = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      const rotateY = currentX * 16; // degrees
      const rotateX = -currentY * 16;

      heroStage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      requestAnimationFrame(updateHeroTilt);
    };

    updateHeroTilt();
  }

  /* ==========================================================================
     4. SECTION 03 — VEGETARIAN EXPERIENCE INTERACTIVE STEP SWITCHER
     ========================================================================== */
  const vegStepBtns = document.querySelectorAll('.veg-step-btn');
  const vegImgSlides = document.querySelectorAll('.veg-slide');
  const vegStepTitle = document.getElementById('vegStepTitle');
  const vegStepDesc = document.getElementById('vegStepDesc');
  const vegStepChips = document.getElementById('vegStepChips');
  const vegBadgeText = document.getElementById('vegBadgeText');

  const vegStepData = [
    {
      title: "01 — Hand-Harvested Morning Greens",
      desc: "Every dawn begins with selecting crisp seasonal okra, cauliflower florets, vine-ripened tomatoes, and baby spinach directly from local pesticide-free heirloom farms.",
      badge: "Stage 01: Farm Fresh Harvest",
      chips: ["Crisp Okra", "Local Heirloom Tomatoes", "Baby Spinach", "Tender Green Peas", "Fresh Mint & Coriander"]
    },
    {
      title: "02 — Artisanal Chopping & Spice Tempering",
      desc: "Vegetables are cut uniformly by hand to preserve natural juices and crisp textures. Cold-pressed mustard oil and pure cow ghee are gently warmed in heavy iron cookware.",
      badge: "Stage 02: Knife Work & Tempering",
      chips: ["Hand-Diced Botanicals", "Cold-Pressed Mustard Oil", "Whole Cumin Seeds", "Stone-Crushed Ginger", "Slit Green Chilies"]
    },
    {
      title: "03 — Stone-Ground Aromatic Spice Blends",
      desc: "Whole spices—sun-dried turmeric root, green cardamom, cinnamon bark, and wild coriander seeds—are slowly roasted on low heat and stone-pounded into an intoxicating masala.",
      badge: "Stage 03: Roasting & Stone Grinding",
      chips: ["Turmeric Root", "Green Cardamom", "Cinnamon Quill", "Wild Coriander", "Mace & Nutmeg"]
    },
    {
      title: "04 — Earthen Clay Handi Simmer",
      desc: "The tempered vegetables and fresh malai paneer are gently braised inside porous clay pots, letting the steam condense on the lid and baste the curry naturally for hours.",
      badge: "Stage 04: Slow Clay Pot Simmer",
      chips: ["Unglazed Terracotta Pot", "Slow Braise", "Natural Steam Bast", "Soft Fresh Paneer Cubes", "Aromatic Steam"]
    },
    {
      title: "05 — Plated Straight To Your Family Table",
      desc: "Finished with a swirl of fresh farm malai, a shower of micro-coriander, and served piping hot alongside fluffy tandoori rotis and fragrant saffron-infused basmati rice.",
      badge: "Stage 05: Finished Masterpiece",
      chips: ["Garden Vegetable Curry", "Fresh Farm Cream", "Piping Hot Naan", "Saffron Basmati", "Made With Love"]
    }
  ];

  vegStepBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const stepIndex = parseInt(this.getAttribute('data-step'), 10);

      vegStepBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      vegImgSlides.forEach((img, idx) => {
        if (idx === stepIndex) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });

      const data = vegStepData[stepIndex];
      if (data) {
        if (vegStepTitle) vegStepTitle.textContent = data.title;
        if (vegStepDesc) vegStepDesc.textContent = data.desc;
        if (vegBadgeText) vegBadgeText.textContent = data.badge;

        if (vegStepChips) {
          vegStepChips.innerHTML = data.chips
            .map(chip => `<span class="ingredient-chip"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> ${chip}</span>`)
            .join('');
        }
      }
    });
  });

  /* ==========================================================================
     5. SECTION 04 — NON-VEGETARIAN EXPERIENCE CINEMATIC COOKING JOURNEY
     ========================================================================== */
  const nonvegStepBtns = document.querySelectorAll('.nonveg-step-btn');
  const nonvegImgSlides = document.querySelectorAll('.nonveg-slide');
  const nonvegStepTitle = document.getElementById('nonvegStepTitle');
  const nonvegStepDesc = document.getElementById('nonvegStepDesc');
  const nonvegStepChips = document.getElementById('nonvegStepChips');
  const nonvegBadgeText = document.getElementById('nonvegBadgeText');

  const nonvegStepData = [
    {
      title: "01 — Ethically Sourced Tender Cuts",
      desc: "We exclusively source tender, pasture-raised country chicken and fresh river fish delivered daily. Every piece is cleaned with turmeric and lemon water to ensure purity.",
      badge: "Stage 01: Fresh Sourcing",
      chips: ["Pasture-Raised Chicken", "Tender Bone-in Cuts", "Wild River Fish", "Turmeric & Lemon Wash"]
    },
    {
      title: "02 — 12-Hour Yogurt & Hand-Ground Marination",
      desc: "Meat is massaged with thick hung curd, Kashmiri deggi mirch, fresh ginger-garlic paste, and crushed spices. It rests overnight in clay vessels so the flavors penetrate deep to the bone.",
      badge: "Stage 02: Overnight Marination",
      chips: ["Thick Hung Curd", "Kashmiri Deggi Mirch", "Cold-Ground Ginger-Garlic", "Mustard Oil Emulsion"]
    },
    {
      title: "03 — High-Heat Iron Sear & Caramelization",
      desc: "The marinated cuts hit a screaming-hot seasoned iron kadai. Searing locks in succulent natural juices while creating deeply savory, browned umami crusts.",
      badge: "Stage 03: Cast Iron Searing",
      chips: ["Cast Iron Kadai", "Smoky Maillard Sear", "Crisp Edges", "Juice Retention"]
    },
    {
      title: "04 — Aromatic Whole Spices & Golden Onions",
      desc: "Thinly sliced red onions are slowly browned until deep amber and sweet, then blended with black stone flower, mace, cinnamon quills, and toasted cloves.",
      badge: "Stage 04: Spice Infusion & Birista",
      chips: ["Crisp Caramelized Onions", "Black Cardamom", "Star Anise", "Whole Cloves", "Bay Leaves"]
    },
    {
      title: "05 — Slow 'Dum' Braise Over Gentle Embers",
      desc: "The vessel is sealed tight with whole wheat dough. Cooked over low charcoal embers for hours, the gentle steam breaks down every fiber into meltingly tender perfection.",
      badge: "Stage 05: Sealed Dum Simmer",
      chips: ["Dough-Sealed Pot", "Charcoal Low Flame", "Meltingly Soft Meat", "Aromatic Condensation"]
    },
    {
      title: "06 — Served Piping Hot With Fragrant Rice",
      desc: "Garnished with roasted cashews, saffron milk, and fresh mint leaves. The dish arrives at your table full of rich aroma, homestyle comfort, and authentic soul.",
      badge: "Stage 06: Grand Homestyle Feast",
      chips: ["Signature Homestyle Curry", "Royal Biryani Rice", "Golden Fried Cashews", "Fresh Mint Leaves"]
    }
  ];

  nonvegStepBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const stepIndex = parseInt(this.getAttribute('data-step'), 10);

      nonvegStepBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      nonvegImgSlides.forEach((img, idx) => {
        if (idx === stepIndex) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });

      const data = nonvegStepData[stepIndex];
      if (data) {
        if (nonvegStepTitle) nonvegStepTitle.textContent = data.title;
        if (nonvegStepDesc) nonvegStepDesc.textContent = data.desc;
        if (nonvegBadgeText) nonvegBadgeText.textContent = data.badge;

        if (nonvegStepChips) {
          nonvegStepChips.innerHTML = data.chips
            .map(chip => `<span class="ingredient-chip nonveg-chip"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> ${chip}</span>`)
            .join('');
        }
      }
    });
  });

  /* ==========================================================================
     6. SECTION 05 — FULL-WIDTH INTERACTIVE "FROM INGREDIENT TO PLATE"
     ========================================================================== */
  const vesselTrackerBtns = document.querySelectorAll('.vessel-stage-btn');
  const vesselSlides = document.querySelectorAll('.vessel-slide');
  const stageNumWatermark = document.getElementById('stageNumWatermark');
  const stageInfoTitle = document.getElementById('stageInfoTitle');
  const stageInfoDesc = document.getElementById('stageInfoDesc');
  const stagePoint1 = document.getElementById('stagePoint1');
  const stagePoint2 = document.getElementById('stagePoint2');

  const transformationStages = [
    {
      num: "01",
      title: "01 — Fresh Ingredients",
      desc: "Every dish originates from soil, sun, and pure craft. We source sun-ripened vegetables, farm poultry, whole spices, and raw grain straight from trusted growers.",
      p1Title: "100% Raw & Unprocessed",
      p1Desc: "No synthetic concentrates, artificial colors, or premade packaged gravies.",
      p2Title: "Farm-to-Door Within Hours",
      p2Desc: "Vegetables and poultry arrive daily at sunrise for prompt artisanal prep."
    },
    {
      num: "02",
      title: "02 — Prepared With Care",
      desc: "Meticulous knife work, hand-crushing garlic and ginger on traditional stone sil-batta, and slow marination where spices gently bond with fresh ingredients.",
      p1Title: "Hand-Crafted Spice Pastes",
      p1Desc: "Stone friction releases aromatic essential oils that modern blenders burn away.",
      p2Title: "Heirloom Family Proportions",
      p2Desc: "Recipes passed down across three generations with zero shortcuts."
    },
    {
      num: "03",
      title: "03 — Cooked Slowly",
      desc: "Heated in seasoned cast iron and unglazed clay handis over gentle flames. Slow simmering allows sauces to reduce naturally into thick, velvety, fragrant curries.",
      p1Title: "Porous Clay Thermodynamics",
      p1Desc: "Maintains optimal moisture balance so meat stays juicy and vegetables tender.",
      p2Title: "No High-Pressure Rush",
      p2Desc: "We simmer each pot for up to 3 hours to develop profound culinary depth."
    },
    {
      num: "04",
      title: "04 — Served Fresh",
      desc: "Garnished with toasted ghee and hand-picked microgreens, plated hot and delivered immediately to preserve peak steam, fragrance, and comfort.",
      p1Title: "Piping Hot & Aromatic",
      p1Desc: "The true aroma of home cooking that comforts the mind and satisfies the soul.",
      p2Title: "Pure Homemade Integrity",
      p2Desc: "Wholesome, nourishing meals that leave you energized, not bloated."
    }
  ];

  vesselTrackerBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const stageIdx = parseInt(this.getAttribute('data-stage'), 10);

      vesselTrackerBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      vesselSlides.forEach((slide, idx) => {
        if (idx === stageIdx) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      const s = transformationStages[stageIdx];
      if (s) {
        if (stageNumWatermark) stageNumWatermark.textContent = s.num;
        if (stageInfoTitle) stageInfoTitle.textContent = s.title;
        if (stageInfoDesc) stageInfoDesc.textContent = s.desc;
        if (stagePoint1) {
          stagePoint1.querySelector('strong').textContent = s.p1Title;
          stagePoint1.querySelector('span').textContent = s.p1Desc;
        }
        if (stagePoint2) {
          stagePoint2.querySelector('strong').textContent = s.p2Title;
          stagePoint2.querySelector('span').textContent = s.p2Desc;
        }
      }
    });
  });

  /* ==========================================================================
     7. SECTION 06 — SIGNATURE DISHES & INTERACTIVE RECIPE MODAL
     ========================================================================== */
  const dishesData = [
    {
      id: "dish-1",
      name: "Homestyle Country Chicken Curry",
      type: "non-veg",
      typeLabel: "Non-Veg",
      origin: "Grandmother's Hearth Recipe",
      time: "45 mins slow braise",
      spice: 3,
      price: "$18.50",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80",
      desc: "Tender bone-in chicken slow cooked in a rich onion-tomato reduction with stone-pounded black cardamom and toasted coriander.",
      story: "This signature chicken curry is cooked exactly as our grandmother made it on Sunday afternoons. We slowly brown sliced onions in pure mustard oil until caramelized, blend in freshly crushed ginger and garlic, and simmer the chicken in its own juices with hand-toasted whole spices.",
      cookVessel: "Seasoned Heavy Iron Kadai",
      servings: "2–3 People",
      dietTags: ["Gluten-Free", "High Protein", "No Preservatives"],
      ingredients: ["Pasture-Raised Chicken", "Cold-Pressed Mustard Oil", "Kashmiri Deggi Mirch", "Black Cardamom", "Roasted Coriander Seeds", "Caramelized Onions", "Fresh Coriander Leaves"]
    },
    {
      id: "dish-2",
      name: "Garden Heritage Vegetable Curry",
      type: "veg",
      typeLabel: "Vegetarian",
      origin: "Farmstead Seasonal Stew",
      time: "35 mins clay pot simmer",
      spice: 2,
      price: "$16.00",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
      desc: "Seasonal carrots, baby beans, florets and sweet peas tempered with cumin and cooked in an aromatic, velvety coconut-cashew gravy.",
      story: "A celebration of morning garden bounty. Fresh seasonal vegetables are lightly tossed in ghee with cumin seeds and whole cloves, then simmered gently in a fragrant gravy made from ground cashews, coconut milk, and turmeric. Creamy, comforting, and deeply nourishing.",
      cookVessel: "Unglazed Terracotta Handi",
      servings: "2 People",
      dietTags: ["100% Vegetarian", "Nutrient-Dense", "No Added Sugar"],
      ingredients: ["Seasonal Baby Carrots", "Crisp French Beans", "Cauliflower Florets", "Sweet Green Peas", "Cashew Paste", "Coconut Milk", "Turmeric Root", "Cumin"]
    },
    {
      id: "dish-3",
      name: "Royal Saffron Dum Biryani",
      type: "non-veg",
      typeLabel: "Non-Veg",
      origin: "Traditional Nizam Dum Style",
      time: "2.5 hours slow dum",
      spice: 2,
      price: "$21.00",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
      desc: "Fragrant aged basmati rice layered with spiced marinated meat, saffron milk, caramelized shallots and cooked under a dough seal.",
      story: "The crown jewel of our home kitchen. We select extra-long aged basmati, perfumed with whole star anise and green cardamom. Layered over yogurt-marinated tender chicken, drizzled with Kashmiri saffron infused in warm whole milk, and sealed with whole wheat dough to lock in the heavenly perfume.",
      cookVessel: "Dough-Sealed Heavy Degchi",
      servings: "2–3 People",
      dietTags: ["Heirloom Recipe", "Fragrant Saffron", "Aged Basmati"],
      ingredients: ["2-Year Aged Basmati Rice", "Tender Chicken", "Pure Kashmiri Saffron", "Crispy Birista Onions", "Fresh Mint Leaves", "Cow Ghee", "Whole Cloves & Mace"]
    },
    {
      id: "dish-4",
      name: "Artisanal Shahi Paneer",
      type: "veg",
      typeLabel: "Vegetarian",
      origin: "Royal North-Indian Comfort",
      time: "40 mins slow reduction",
      spice: 1,
      price: "$17.50",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
      desc: "Pillow-soft homemade malai paneer cubes simmered in a luscious velvet tomato gravy enriched with fresh cream and kasuri methi.",
      story: "We make our cottage cheese fresh every morning from whole organic farm milk, resulting in paneer so soft it melts on your tongue. The gravy is a silky symphony of roasted heirloom tomatoes, toasted melon seeds, and fragrant fenugreek leaves crushed between the palms.",
      cookVessel: "Polished Brass Kadai",
      servings: "2 People",
      dietTags: ["High Calcium", "Pure Vegetarian", "Gluten-Free"],
      ingredients: ["Freshly Curdled Malai Paneer", "Vine-Ripened Tomatoes", "Fresh Cow Milk Cream", "Kasuri Methi", "Green Cardamom", "Magaz Melon Seeds", "Ghee"]
    },
    {
      id: "dish-5",
      name: "Charcoal Char-Grilled Chicken",
      type: "non-veg",
      typeLabel: "Non-Veg",
      origin: "Rustic Hearth Skewers",
      time: "30 mins open flame",
      spice: 3,
      price: "$19.00",
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80",
      desc: "Boneless chicken marinated in roasted cumin, hung yogurt, crushed peppercorns and char-grilled over natural fruitwood embers.",
      story: "Prepared outdoors over fruitwood coals. The marinade incorporates mustard oil that has been heated with hot red chilies, creating a smoky, succulent crust while the meat remains tender and dripping with natural savory juices.",
      cookVessel: "Natural Hardwood Charcoal Grill",
      servings: "2 People",
      dietTags: ["Keto Friendly", "High Protein", "Smoky Finish"],
      ingredients: ["Tender Boneless Thighs", "Hung Curd", "Deggi Chili Powder", "Smoked Mustard Oil", "Kashmiri Garam Masala", "Lime Wedges", "Pickled Onions"]
    },
    {
      id: "dish-6",
      name: "Slow-Simmered Dal Makhani",
      type: "veg",
      typeLabel: "Vegetarian",
      origin: "16-Hour Hearth Clay Pot",
      time: "16 hours simmer",
      spice: 1,
      price: "$15.00",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
      desc: "Whole black urad lentils and kidney beans slow cooked overnight over dying tandoor coals, finished with homemade butter.",
      story: "The ultimate patience dish. Whole black lentils and red kidney beans are soaked overnight and then simmered for 16 continuous hours over gentle residual coals. Finished with generous dollops of hand-churned white butter and grated ginger.",
      cookVessel: "Slow Overnight Clay Pot",
      servings: "2 People",
      dietTags: ["Slow-Food Icon", "Rich in Fiber", "100% Vegetarian"],
      ingredients: ["Whole Black Urad Lentils", "Rajma Beans", "Hand-Churned White Butter", "Fresh Garlic", "Pure Tomato Puree", "Cream", "Roasted Cumin"]
    }
  ];

  // Filtering Logic
  const filterBtns = document.querySelectorAll('.signature-filters .filter-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      dishCards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        if (filter === 'all' || cardType === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Dish Details Modal Logic
  const dishModal = document.getElementById('dishDetailModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalDishImg');
  const modalDiet = document.getElementById('modalDietBadge');
  const modalOrigin = document.getElementById('modalDishOrigin');
  const modalTitle = document.getElementById('modalDishTitle');
  const modalStory = document.getElementById('modalDishStory');
  const modalCookVessel = document.getElementById('modalCookVessel');
  const modalCookTime = document.getElementById('modalCookTime');
  const modalServings = document.getElementById('modalServings');
  const modalIngredientsList = document.getElementById('modalIngredientsList');
  const modalPrice = document.getElementById('modalDishPrice');
  const modalOrderBtn = document.getElementById('modalOrderBtn');

  const openDishModal = (dish) => {
    if (!dishModal) return;

    if (modalImg) modalImg.src = dish.image;
    if (modalImg) modalImg.alt = dish.name;
    if (modalTitle) modalTitle.textContent = dish.name;
    if (modalOrigin) modalOrigin.textContent = dish.origin;
    if (modalStory) modalStory.textContent = dish.story;
    if (modalCookVessel) modalCookVessel.textContent = dish.cookVessel;
    if (modalCookTime) modalCookTime.textContent = dish.time;
    if (modalServings) modalServings.textContent = dish.servings;
    if (modalPrice) modalPrice.textContent = dish.price;

    if (modalDiet) {
      modalDiet.className = `diet-indicator ${dish.type}`;
      modalDiet.innerHTML = `<span class="diet-dot-square"><span class="dot"></span></span> ${dish.typeLabel}`;
    }

    if (modalIngredientsList) {
      modalIngredientsList.innerHTML = dish.ingredients
        .map(ing => `<span class="modal-ingredient-tag">${ing}</span>`)
        .join('');
    }

    dishModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDishModal = () => {
    if (!dishModal) return;
    dishModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  dishCards.forEach(card => {
    card.addEventListener('click', function () {
      const dishId = this.getAttribute('data-id');
      const dish = dishesData.find(d => d.id === dishId);
      if (dish) {
        openDishModal(dish);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDishModal);
  }

  if (dishModal) {
    dishModal.addEventListener('click', (e) => {
      if (e.target === dishModal) {
        closeDishModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDishModal();
      closeOrderModal();
    }
  });

  /* ==========================================================================
     8. SECTION 07 — PROCESS TIMELINE SCROLL PROGRESS LINE
     ========================================================================== */
  const timelineSection = document.querySelector('.section-process');
  const progressLine = document.querySelector('.process-line-progress');
  const timelineSteps = document.querySelectorAll('.timeline-step');

  const updateTimelineProgress = () => {
    if (!timelineSection || !progressLine) return;

    const rect = timelineSection.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Check if timeline is in view
    if (rect.top < windowH && rect.bottom > 0) {
      const totalDist = rect.height - windowH * 0.5;
      const currentScroll = windowH * 0.6 - rect.top;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalDist) * 100));

      progressLine.style.height = `${progress}%`;

      // Activate nodes as user scrolls past them
      timelineSteps.forEach(step => {
        const stepRect = step.getBoundingClientRect();
        if (stepRect.top < windowH * 0.65) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', updateTimelineProgress, { passive: true });
  updateTimelineProgress();

  /* ==========================================================================
     9. SECTION 08 — HORIZONTAL PANORAMIC JOURNEY SCROLL
     ========================================================================== */
  const panoramicContainer = document.querySelector('.panoramic-track-container');
  if (panoramicContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    panoramicContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      panoramicContainer.style.cursor = 'grabbing';
      startX = e.pageX - panoramicContainer.offsetLeft;
      scrollLeft = panoramicContainer.scrollLeft;
    });

    panoramicContainer.addEventListener('mouseleave', () => {
      isDown = false;
      panoramicContainer.style.cursor = 'grab';
    });

    panoramicContainer.addEventListener('mouseup', () => {
      isDown = false;
      panoramicContainer.style.cursor = 'grab';
    });

    panoramicContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - panoramicContainer.offsetLeft;
      const walk = (x - startX) * 1.6; // Scroll speed multiplier
      panoramicContainer.scrollLeft = scrollLeft - walk;
    });
  }

  /* ==========================================================================
     10. SECTION 09 — FOOD CATEGORIES DUAL SWITCHER (VEG / NON-VEG)
     ========================================================================== */
  const categoryTabBtns = document.querySelectorAll('.category-tab-btn');
  const categoryPanels = document.querySelectorAll('.category-panel');

  categoryTabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetCategory = this.getAttribute('data-category');

      categoryTabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      categoryPanels.forEach(panel => {
        if (panel.id === `catPanel-${targetCategory}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  /* ==========================================================================
     11. SECTION 11 — CUSTOMER TESTIMONIALS CAROUSEL
     ========================================================================== */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const prevTestimonialBtn = document.getElementById('prevTestimonial');
  const nextTestimonialBtn = document.getElementById('nextTestimonial');
  const testimonialDots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let testimonialInterval;

  const showSlide = (index) => {
    if (index >= testimonialSlides.length) currentSlide = 0;
    else if (index < 0) currentSlide = testimonialSlides.length - 1;
    else currentSlide = index;

    testimonialSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    testimonialDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  };

  if (prevTestimonialBtn && nextTestimonialBtn) {
    prevTestimonialBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      resetAutoPlay();
    });

    nextTestimonialBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      resetAutoPlay();
    });

    testimonialDots.forEach(dot => {
      dot.addEventListener('click', function () {
        const slideIdx = parseInt(this.getAttribute('data-slide'), 10);
        showSlide(slideIdx);
        resetAutoPlay();
      });
    });

    const startAutoPlay = () => {
      testimonialInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 6000);
    };

    const resetAutoPlay = () => {
      clearInterval(testimonialInterval);
      startAutoPlay();
    };

    startAutoPlay();
  }

  /* ==========================================================================
     12. KITCHEN AMBIANCE AUDIO SYNTHESIZER (WEB AUDIO API)
     Gentle simmering pot crackle & warmth generator
     ========================================================================== */
  const ambianceBtn = document.getElementById('ambianceToggleBtn');
  let audioCtx = null;
  let isAudioPlaying = false;
  let noiseNode = null;
  let filterNode = null;
  let gainNode = null;

  const initKitchenAudio = () => {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Create pink noise buffer for warm kitchen murmur / simmer
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    // Low-pass filter to sound like gentle stove simmer
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(450, audioCtx.currentTime);

    // Master gain
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

    noiseNode.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    noiseNode.start();
  };

  if (ambianceBtn) {
    ambianceBtn.addEventListener('click', () => {
      try {
        if (!audioCtx) {
          initKitchenAudio();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        if (!isAudioPlaying) {
          gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
          gainNode.gain.setTargetAtTime(0.35, audioCtx.currentTime, 0.8);
          isAudioPlaying = true;
          ambianceBtn.classList.add('active');
          ambianceBtn.querySelector('.ambiance-label').textContent = 'Hearth Simmering';
          showToast('Kitchen ambiance activated. Enjoy the hearth sounds!');
        } else {
          gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
          gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.4);
          isAudioPlaying = false;
          ambianceBtn.classList.remove('active');
          ambianceBtn.querySelector('.ambiance-label').textContent = 'Hearth Sound';
        }
      } catch (err) {
        console.warn('Audio API init notice:', err);
      }
    });
  }

  /* ==========================================================================
     13. ORDER & INQUIRY MODAL SYSTEM
     ========================================================================== */
  const orderModal = document.getElementById('orderModal');
  const orderModalClose = document.getElementById('orderModalClose');
  const triggerOrderBtns = document.querySelectorAll('.trigger-order-modal');
  const orderForm = document.getElementById('orderInquiryForm');

  const openOrderModal = (dishName = "") => {
    if (!orderModal) return;
    if (dishName) {
      const dishSelect = document.getElementById('inquiryDishSelect');
      if (dishSelect) {
        dishSelect.value = dishName;
      }
    }
    closeDishModal(); // close detail modal if open
    orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeOrderModal = () => {
    if (!orderModal) return;
    orderModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggerOrderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dishName = btn.getAttribute('data-dish-name') || "";
      openOrderModal(dishName);
    });
  });

  if (modalOrderBtn) {
    modalOrderBtn.addEventListener('click', () => {
      const title = modalTitle ? modalTitle.textContent : "";
      openOrderModal(title);
    });
  }

  if (orderModalClose) {
    orderModalClose.addEventListener('click', closeOrderModal);
  }

  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) {
        closeOrderModal();
      }
    });
  }

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeOrderModal();
      showToast('Thank you! Our home kitchen will call to confirm your meal batch.');
      orderForm.reset();
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("You're subscribed to our weekly kitchen specials!");
      newsletterForm.reset();
    });
  }

  // Toast Function
  function showToast(message) {
    const toast = document.getElementById('toastNotice');
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  console.log('The Homemade Hearth interactive systems loaded successfully.');
});
