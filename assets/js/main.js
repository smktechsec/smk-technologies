/**
 * SMK TECHNOLOGIES - MAIN JAVASCRIPT CONTROLLER
 * GitHub Pages Ready | Vanilla JS | Zero Dependencies
 */

(function () {
  'use strict';

  /* ==========================================================================
     PRODUCT SPECIFICATIONS DATA STORE
     ========================================================================== */
  const PRODUCTS_DATA = {
    'pir-detector': {
      title: 'PIR Detector',
      model: 'DS-PD2-P18CE',
      image: 'assets/images/products/pir-detector.jpg',
      badge: 'Curtain Detection Sensor',
      description: 'The DS-PD2-P18CE features a long, narrow detection pattern designed for shop fronts and large windows. Bluewave technology, automatic sensitivity, and digital temperature compensation help it adapt to environmental conditions such as infra-red noise, light, and temperature variations.',
      features: [
        '18 m digital curtain detection coverage',
        'Dual-element pyro-electric sensor',
        'Selectable End-of-Line (EOL) resistors',
        'Auto sensitivity feature',
        'Digital temperature compensation',
        'Tamper-proof front shell casing'
      ],
      specs: [
        { label: 'Detection Coverage', value: '18m curtain detection' },
        { label: 'Detection Speed', value: '0.3 m/s ~ 3.0 m/s' },
        { label: 'Power Supply', value: '9 – 16 VDC (12 VDC typical)' },
        { label: 'Operating Temperature', value: '-10°C to +40°C' },
        { label: 'Dimensions (H × W × D)', value: '117 mm × 69 mm × 50 mm' },
        { label: 'Weight', value: '125 g (without mounting bracket)' },
        { label: 'Installation Environment', value: 'Indoor' },
        { label: 'Optimum Installation Height', value: '2.4 m ~ 4.0 m' },
        { label: 'System Zone Compatibility', value: 'Supports up to 64 zones (8 onboard, up to 8 wired PIRCAM)' }
      ],
      notes: 'Ideal for retail shopfronts, display glazing, and perimeter internal walls requiring precise curtain coverage.'
    },

    'wireless-keyfob': {
      title: 'Wireless Keyfob',
      model: 'DS-PKF1-WB',
      image: 'assets/images/products/wireless-keyfob.jpg',
      badge: '433 MHz Remote Controller',
      description: 'The Wireless Keyfob DS-PKF1-WB is a compact, user-friendly remote control designed for quick, secure operation of Hikvision alarm systems. It allows users to easily arm, disarm, and trigger emergency functions with a single press, ensuring maximum convenience and peace of mind.',
      features: [
        'Stay / away arming and disarming functionality',
        'Keyfob button lock and unlock function to prevent accidental presses',
        'Fully remote configurable through the mobile application',
        'Multiple enrollment methods and easy installation design',
        'Easily replaceable battery with PCB protection',
        'Frequency hopping against jamming for reliable wireless transmission'
      ],
      specs: [
        { label: 'RF Frequency', value: '433 MHz' },
        { label: 'RF Modulation', value: '2GFSK' },
        { label: 'RF Distance', value: 'Up to 500 m in open area' },
        { label: 'Battery Lifespan', value: 'Up to 3 years (standby time)' },
        { label: 'Operating Temperature', value: '-10°C to +55°C (14°F to 131°F)' },
        { label: 'Operating Humidity', value: '10% to 90% (non-condensing)' },
        { label: 'Shell Material', value: 'Panel (plastic) + gasket (rubber)' },
        { label: 'Color & Weight', value: 'White / approx. 16 g (0.56 oz)' }
      ],
      notes: 'Frequency hopping algorithms proactively switch channels to defeat RF jamming attacks.'
    },

    'magnetic-contact': {
      title: 'Surface-Mounted Magnetic Contact',
      model: 'DS-PD1-MC-WS',
      image: 'assets/images/products/magnetic-contact.jpg',
      badge: 'Perimeter Door / Window Sensor',
      description: 'The DS-PD1-MC-WS surface-mounted magnetic contact is a reliable door and window sensor designed to enhance perimeter security in residential and commercial environments. Featuring a flame-retardant ABS casing, it accurately detects unauthorized opening of doors or windows and triggers immediate system alerts.',
      features: [
        'Flame-retardant ABS protective shell',
        'Normally Closed (NC) connection type',
        'Engineered for surface mounting on wooden doors and frames',
        'Resistant to false triggers from minor vibrations',
        'Low profile, sleek physical form factor'
      ],
      specs: [
        { label: 'Detection Gap', value: '≥17 mm (source specification provided; confirm exact threshold with manufacturer)' },
        { label: 'Alarm Interface', value: 'Normally Closed (NC)' },
        { label: 'Typical Voltage', value: '≤100 VDC (Capacity)' },
        { label: 'Typical Current', value: '≤500 mA (Capacity)' },
        { label: 'Operating Temperature', value: '-10°C to +55°C (14°F to 131°F)' },
        { label: 'Storage Temperature', value: '-20°C to +60°C (-4°F to 140°F)' },
        { label: 'Operating Humidity', value: '10% to 90%' },
        { label: 'Shell Material', value: 'Flame-Retardant ABS' },
        { label: 'Dimensions (W × H × D)', value: '63.5 mm × 12.5 mm × 15.7 mm (sensor) / 63.5 mm × 12.5 mm × 12.5 mm (magnet)' }
      ],
      notes: 'Specification note: Verified dual dimensions represent the active switch and companion magnet units.'
    },

    'identification-tag': {
      title: 'Identification Tag (RFID)',
      model: 'DS-PT-M1',
      image: 'assets/images/products/identification-tag.jpg',
      badge: '13.56 MHz Access Token',
      description: 'The DS-PT-M1 Tag is a compact, solid, and lightweight identification token designed for quick, secure access control within Hikvision security systems. It enables rapid touch-and-go arming/disarming when presented to compatible keypads and tag readers.',
      features: [
        'Small, solid, and durable structural design',
        'Convenient to carry on keychains or lanyards',
        'High-frequency 13.56 MHz Mifare working technology',
        'Water-resistant and impact-resistant PVC / ABS casing',
        'Zero battery required (passive RF induction)'
      ],
      specs: [
        { label: 'Operating Frequency', value: '13.56 MHz (Mifare)' },
        { label: 'Communication Type', value: 'Passive contactless RFID' },
        { label: 'Operating Temperature', value: '-10°C to +50°C' },
        { label: 'Housing Material', value: 'Durable PVC & ABS' },
        { label: 'Color', value: 'Clean Corporate White' },
        { label: 'Dimensions (W × H × D)', value: '41 mm × 32 mm × 3.5 mm' },
        { label: 'Compatibility', value: 'DS-PK1-LRT-HWB and all compatible Hikvision AX Pro tag readers' }
      ],
      notes: 'Provides rapid authentication without entering numeric passwords on keypads.'
    },

    'wired-lcd-keypad': {
      title: 'Wired LCD Keypad',
      model: 'DS-PK1-LRT-HWB',
      image: 'assets/images/products/wired-lcd-keypad.jpg',
      badge: 'Speed-X Bus Security Console',
      description: 'The Wired LCD Keypad DS-PK1-LRT-HWB is a robust, user-friendly control interface designed for seamless operation and monitoring of Hikvision wired alarm systems. Featuring a crisp LCD screen, one-touch arming keys, and dedicated emergency triggers, it delivers comprehensive status feedback in real time.',
      features: [
        'Crisp LCD screen with customizable company name, phone, and time display',
        'Supports one-touch arming without password entry',
        'Dedicated Fire, Panic, and Medical emergency alarm keys',
        'Built-in RFID Tag reader for contactless identification tags',
        'Supports 2 onboard alarm inputs and 1 onboard alarm output',
        'Supports up to 64 wireless keyfobs',
        'TTL serial port & RS-485 Speed-X high-speed communication bus',
        'Onboard buzzer and tamper-switch protection'
      ],
      specs: [
        { label: 'Display Screen', value: 'Multi-line Backlit LCD Screen' },
        { label: 'Keypad Backlight', value: 'Clean White LED backlight' },
        { label: 'Status Indicators', value: '4 status LEDs (Power: Green, Faults: Orange, Armed: Blue, Alarm: Red)' },
        { label: 'Power Supply', value: '10.2 to 14.4 VDC (12 VDC typical)' },
        { label: 'Power Consumption', value: 'Max 150 mA @ 12 VDC; Quiescent 72 mA @ 12 VDC' },
        { label: 'RF Frequency', value: '433 MHz (for wireless peripheral management)' },
        { label: 'Bus Interface', value: 'RS-485 Speed-X bus + 1 TTL Serial Port' },
        { label: 'Onboard I/O', value: '2 Alarm Inputs, 1 Alarm Output' },
        { label: 'Operating Temperature', value: '-10°C to +55°C (14°F to 131°F)' },
        { label: 'Dimensions (W × H × D)', value: '150 mm × 115 mm × 28 mm' }
      ],
      notes: 'Speed-X communication bus provides extended transmission distances with encrypted data handshakes.'
    }
  };

  /* ==========================================================================
     GALLERY DATA
     ========================================================================== */
  const GALLERY_DATA = [
    {
      src: 'assets/images/gallery/image-1.jpg',
      title: 'Hikvision AX Hybrid Pro Main Control Hub',
      category: 'panels',
      desc: 'Central hybrid control panel installation featuring high-capacity wiring bus and onboard backup power.'
    },
    {
      src: 'assets/images/gallery/image-2.jpg',
      title: 'Internal Component Architecture',
      category: 'panels',
      desc: 'Modular PCB architecture showcasing tamper switches, Speed-X terminals, and RF expansion modules.'
    },
    {
      src: 'assets/images/gallery/image-3.jpg',
      title: 'Security Control Board Layout',
      category: 'panels',
      desc: 'Precision wiring terminals with dual-line supervision and dedicated battery charging circuitry.'
    },
    {
      src: 'assets/images/gallery/image-4.jpg',
      title: 'Structured Security Cabinet Wiring',
      category: 'installations',
      desc: 'Organized cable conduits connecting perimeter sensors directly into the AX Hybrid Pro chassis.'
    },
    {
      src: 'assets/images/gallery/image-5.jpg',
      title: 'Commercial Installation Deployment',
      category: 'installations',
      desc: 'Field deployment at commercial facility with integrated CCTV and alarm verification.'
    },
    {
      src: 'assets/images/gallery/image-6.jpg',
      title: 'Integrated Surveillance & Perimeter Post',
      category: 'installations',
      desc: 'Outdoor boundary monitoring station with real-time motion sensors and IP CCTV coverage.'
    },
    {
      src: 'assets/images/gallery/image-7.jpg',
      title: 'Perimeter Sensor Mounting & Tuning',
      category: 'sensors',
      desc: 'Accurate angle calibration of intrusion detection sensors for maximum detection reliability.'
    },
    {
      src: 'assets/images/gallery/image-8.jpg',
      title: 'High-Definition Field CCTV Integration',
      category: 'installations',
      desc: 'High-definition cameras working synchronously with AX Hybrid Pro trigger events.'
    },
    {
      src: 'assets/images/gallery/image-9.jpg',
      title: 'Perimeter Enclosure Testing',
      category: 'sensors',
      desc: 'Weatherproof security enclosure inspection ensuring 24/7 reliability in industrial environments.'
    },
    {
      src: 'assets/images/gallery/image-10.jpg',
      title: 'Field Verification & Remote Linkage',
      category: 'installations',
      desc: 'Connecting field stations to iVMS-4200 and Hik-Partner Pro monitoring infrastructure.'
    },
    {
      src: 'assets/images/gallery/image-11.jpg',
      title: 'Control Module Quality Inspection',
      category: 'sensors',
      desc: 'Final commissioning, resistor configuration, and diagnostic testing before handover.'
    }
  ];

  /* ==========================================================================
     DOM ELEMENTS
     ========================================================================== */
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const backToTopBtn = document.querySelector('.back-to-top');

  // Modal elements
  const specModal = document.getElementById('spec-modal');
  const specModalBody = document.getElementById('spec-modal-body');
  const specModalTitle = document.getElementById('spec-modal-title');
  const specModalClose = document.getElementById('spec-modal-close');
  const specModalCta = document.getElementById('spec-modal-cta');

  // Lightbox elements
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxClose = document.getElementById('lightbox-close');

  // Form elements
  const contactForm = document.getElementById('consultation-form');
  const serviceSelect = document.getElementById('form-service');
  const toast = document.getElementById('toast');

  let currentGalleryIndex = 0;
  let activeFilter = 'all';
  let filteredGalleryData = [...GALLERY_DATA];

  /* ==========================================================================
     STICKY HEADER & SCROLL SPY
     ========================================================================== */
  function handleScroll() {
    const scrollPos = window.scrollY;

    // Header styling
    if (scrollPos > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollPos > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Scroll Spy for nav links
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';

    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === '#' + currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ==========================================================================
     MOBILE DRAWER MENU
     ========================================================================== */
  function openMobileMenu() {
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const isOpen = menuToggle.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer when clicking a navigation link
  document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn').forEach((item) => {
    item.addEventListener('click', closeMobileMenu);
  });

  // Handle Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeSpecModal();
      closeLightbox();
    }
  });

  /* ==========================================================================
     SMOOTH SCROLLING & HASH NAVIGATION
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     PRODUCT SPECIFICATIONS MODAL
     ========================================================================== */
  function openSpecModal(productId) {
    const data = PRODUCTS_DATA[productId];
    if (!data) return;

    specModalTitle.textContent = data.title + ' — Specifications';

    let specsHtml = '';
    data.specs.forEach((item) => {
      specsHtml += `
        <tr>
          <th>${item.label}</th>
          <td>${item.value}</td>
        </tr>
      `;
    });

    let featuresHtml = '';
    data.features.forEach((feat) => {
      featuresHtml += `<li>✓ ${feat}</li>`;
    });

    specModalBody.innerHTML = `
      <div class="spec-detail-grid">
        <div>
          <img src="${data.image}" alt="${data.title}" class="modal-product-img">
          <div style="margin-top: 14px; text-align: center;">
            <span class="product-model-badge">${data.model}</span>
          </div>
        </div>
        <div>
          <h4 style="font-size: 1.35rem; margin-bottom: 8px;">${data.title}</h4>
          <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 18px;">${data.description}</p>
          <h5 style="font-size: 1rem; color: var(--accent-cyan); margin-bottom: 8px;">Key Capabilities:</h5>
          <ul style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 16px;">
            ${featuresHtml}
          </ul>
        </div>
      </div>

      <div class="spec-table-wrap">
        <h4 style="font-size: 1.15rem; color: #fff; margin-bottom: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
          Technical Specifications Table
        </h4>
        <table class="spec-table">
          <tbody>
            ${specsHtml}
          </tbody>
        </table>
      </div>

      <div class="spec-note">
        <strong>Technical Note:</strong> ${data.notes}
      </div>
    `;

    // Configure the Quote CTA in modal
    if (specModalCta) {
      specModalCta.onclick = function () {
        closeSpecModal();
        prefillContactForm(data.title + ' (' + data.model + ')');
        const contactSec = document.getElementById('contact');
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    specModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSpecModal() {
    if (specModal) {
      specModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Attach event listeners for product spec buttons
  document.querySelectorAll('[data-spec-target]').forEach((btn) => {
    btn.addEventListener('click', function () {
      const target = this.getAttribute('data-spec-target');
      openSpecModal(target);
    });
  });

  if (specModalClose) {
    specModalClose.addEventListener('click', closeSpecModal);
  }

  if (specModal) {
    specModal.addEventListener('click', function (e) {
      if (e.target === specModal) {
        closeSpecModal();
      }
    });
  }

  /* ==========================================================================
     CONTACT FORM & PRE-FILL
     ========================================================================== */
  function prefillContactForm(serviceOrProductName) {
    if (!serviceSelect) return;

    // Check if matching option exists or add it
    let matched = false;
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].text.toLowerCase().includes(serviceOrProductName.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const opt = document.createElement('option');
      opt.value = serviceOrProductName;
      opt.text = serviceOrProductName;
      opt.selected = true;
      serviceSelect.appendChild(opt);
    }

    const messageInput = document.getElementById('form-message');
    if (messageInput) {
      messageInput.value = `Hello SMK Technologies team,\n\nI am interested in inquiry & pricing details regarding: ${serviceOrProductName}. Please contact me with quotation, availability, and installation consultation.\n\nThank you.`;
    }
  }

  // Attach "Contact for Pricing" & Consultation buttons
  document.querySelectorAll('[data-quote-product]').forEach((btn) => {
    btn.addEventListener('click', function () {
      const product = this.getAttribute('data-quote-product');
      prefillContactForm(product);
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ==========================================================================
     INQUIRY FORM VALIDATION & STATIC MAILTO WORKFLOW
     ========================================================================== */
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const phoneInput = document.getElementById('form-phone');
      const messageInput = document.getElementById('form-message');

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('invalid');
        isValid = false;
      } else {
        nameInput.classList.remove('invalid');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        isValid = false;
      } else {
        emailInput.classList.remove('invalid');
      }

      // Validate phone
      if (!phoneInput.value.trim() || phoneInput.value.trim().length < 6) {
        phoneInput.classList.add('invalid');
        isValid = false;
      } else {
        phoneInput.classList.remove('invalid');
      }

      // Validate message
      if (!messageInput.value.trim()) {
        messageInput.classList.add('invalid');
        isValid = false;
      } else {
        messageInput.classList.remove('invalid');
      }

      if (!isValid) {
        showToast('⚠️ Please correct the highlighted fields.');
        return;
      }

      const clientName = nameInput.value.trim();
      const clientEmail = emailInput.value.trim();
      const clientPhone = phoneInput.value.trim();
      const selectedService = serviceSelect ? serviceSelect.value : 'General Security Consultation';
      const clientMsg = messageInput.value.trim();

      const subject = encodeURIComponent(`Security Consultation Request - ${selectedService} [${clientName}]`);
      const body = encodeURIComponent(
        `Customer Name: ${clientName}\n` +
        `Email: ${clientEmail}\n` +
        `Telephone: ${clientPhone}\n` +
        `Service / Product of Interest: ${selectedService}\n\n` +
        `Detailed Requirements:\n${clientMsg}\n\n` +
        `---\nInquiry initiated from SMK Technologies Web Portal`
      );

      const mailtoUrl = `mailto:info@smktechnologies.com?subject=${subject}&body=${body}`;

      // Show immediate clear feedback to the user
      showToast('✓ Opening your email client to dispatch inquiry to info@smktechnologies.com...');
      
      // Trigger the mailto client
      window.location.href = mailtoUrl;

      // Also copy text to clipboard as handy fallback for webmail users
      const plainText = 
        `To: info@smktechnologies.com\n` +
        `Subject: Security Consultation Request - ${selectedService}\n\n` +
        `Name: ${clientName}\nEmail: ${clientEmail}\nPhone: ${clientPhone}\nService: ${selectedService}\n\nMessage:\n${clientMsg}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(plainText).catch(() => {});
      }
    });
  }

  /* ==========================================================================
     GALLERY RENDERING, FILTERING & LIGHTBOX
     ========================================================================== */
  const galleryGrid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderGallery(items) {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `gallery-item ${index % 5 === 0 ? 'wide' : ''}`;
      card.setAttribute('data-index', index);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View ${item.title}`);

      card.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy">
        <div class="gallery-overlay">
          <div class="gallery-zoom-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <div class="gallery-info">
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
          </div>
        </div>
      `;

      card.addEventListener('click', function () {
        openLightbox(index);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });

      galleryGrid.appendChild(card);
    });
  }

  // Filter functionality
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      filterBtns.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      activeFilter = filter;

      if (filter === 'all') {
        filteredGalleryData = [...GALLERY_DATA];
      } else {
        filteredGalleryData = GALLERY_DATA.filter((item) => item.category === filter);
      }

      renderGallery(filteredGalleryData);
    });
  });

  // Lightbox functions
  function updateLightboxContent(index) {
    if (index < 0 || index >= filteredGalleryData.length) return;
    currentGalleryIndex = index;

    const item = filteredGalleryData[currentGalleryIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${filteredGalleryData.length}`;
  }

  function openLightbox(index) {
    updateLightboxContent(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function showNextImage() {
    let nextIdx = currentGalleryIndex + 1;
    if (nextIdx >= filteredGalleryData.length) {
      nextIdx = 0;
    }
    updateLightboxContent(nextIdx);
  }

  function showPrevImage() {
    let prevIdx = currentGalleryIndex - 1;
    if (prevIdx < 0) {
      prevIdx = filteredGalleryData.length - 1;
    }
    updateLightboxContent(prevIdx);
  }

  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          showNextImage();
        } else {
          showPrevImage();
        }
      }
    }
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });

  // Initial gallery render
  renderGallery(filteredGalleryData);

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ========================================================================== */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.fade-up').forEach((el) => {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    document.querySelectorAll('.fade-up').forEach((el) => {
      el.classList.add('visible');
    });
  }

  // Video fallback verification
  const productVideo = document.getElementById('hikvision-video');
  if (productVideo) {
    productVideo.addEventListener('error', function () {
      const container = document.querySelector('.video-player-container');
      if (container) {
        container.innerHTML = `
          <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
            <p style="font-size: 1.1rem; color: #fff; margin-bottom: 8px;">Video preview currently loading or unavailable.</p>
            <p style="font-size: 0.9rem;">Please check local media file <code style="color: var(--accent-cyan);">assets/video/hikvision-product.mp4</code></p>
          </div>
        `;
      }
    });
  }

})();
