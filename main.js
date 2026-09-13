/**
 * Nikhil Chaudhary — Senior Web Developer & CMS Architect Portfolio
 * Interactive Features:
 *  - Dynamic Typewriter effect for developer titles
 *  - Interactive Code Studio Workstation (JSON, PHP, Liquid, JS)
 *  - Full Interactive Developer CLI Terminal (zsh-style with command history)
 *  - Mouse-tracking Spotlight Glow on cards
 *  - GitHub-style Contribution Heatmap Generator
 *  - Command Palette (Ctrl+K / ⌘K) quick navigation & actions
 *  - Theme switcher with localStorage persistence & system sync
 *  - Mobile hamburger navigation drawer with accessible ARIA management
 *  - Project category filtering with smooth transition animations
 *  - Collapsible secondary client deployments toggle
 *  - Interactive contact form with real-time validation & toast notifications
 *  - Clipboard copy for email, phone, and code snippets
 *  - Animated metric counters (IntersectionObserver)
 *  - Resume preview modal with Print to PDF support
 *  - Live local station clock (Meerut, India / IST)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTypewriter();
  initCodeStudio();
  initMouseSpotlight();
  initActivityHeatmap();
  initDeveloperTerminal();
  initCommandPalette();
  initProjectFilters();
  initMoreProjectsToggle();
  initCardHoverSliders();
  initContactForm();
  initClipboardActions();
  initStatsCounter();
  initClockwiseGridMetrics();
  initResumeModal();
  initLocalClock();
  initScrollSpy();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('nc_portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast('Theme Updated', `Switched to ${newTheme} mode.`);
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('nc_portfolio_theme', theme);
  }
}

/* --------------------------------------------------------------------------
   2. Responsive Navigation & Header Scroll State
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      toggleMobileMenu(!isExpanded);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });

    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !mobileMenuBtn.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
  }

  function toggleMobileMenu(open) {
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
    mobileMenuBtn.classList.toggle('active', open);
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
  }
}

/* --------------------------------------------------------------------------
   3. Dynamic Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const textEl = document.getElementById('typewriterText');
  if (!textEl) return;

  const roles = [
    'Web Developer',
    'WordPress & WooCommerce Specialist',
    'Shopify Liquid Architect',
    'ACF & Custom Post Types Engineer',
    'Core Web Vitals Speed Optimizer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      textEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      textEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1800; // Pause at completion
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   4. Interactive Code Studio Workstation
   -------------------------------------------------------------------------- */
function initCodeStudio() {
  const tabs = document.querySelectorAll('.code-tab');
  const panes = document.querySelectorAll('.code-tab-pane');
  const copyBtn = document.getElementById('copyCodeBtn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `pane-${targetTab}`) {
          pane.classList.add('active');
        }
      });
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activePane = document.querySelector('.code-tab-pane.active code');
      if (activePane) {
        // Strip line numbers for clean copy
        const lines = activePane.innerText.split('\n').map(line => line.replace(/^\d+\s*/, '')).join('\n');
        copyToClipboard(lines, () => {
          const statusSpan = copyBtn.querySelector('.btn-copy-status');
          if (statusSpan) {
            statusSpan.textContent = 'Copied!';
            setTimeout(() => { statusSpan.textContent = 'Copy'; }, 2000);
          }
          showToast('Code Snippet Copied', 'Active code copied cleanly without line numbers.');
        });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. Mouse Spotlight Glow on Cards
   -------------------------------------------------------------------------- */
function initMouseSpotlight() {
  const glowCards = document.querySelectorAll('.glow-card');

  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   6. GitHub-Style Contribution Heatmap Generator
   -------------------------------------------------------------------------- */
function initActivityHeatmap() {
  const container = document.getElementById('activityHeatmap');
  if (!container) return;

  // Generate 36 columns x 7 days = 252 activity cells with realistic distribution
  const totalCols = 36;
  const rows = 7;
  const totalCells = totalCols * rows;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';

    // Weighted random intensity
    const rand = Math.random();
    let level = 0;
    if (rand > 0.75) level = 4;
    else if (rand > 0.55) level = 3;
    else if (rand > 0.35) level = 2;
    else if (rand > 0.15) level = 1;

    cell.classList.add(`lvl-${level}`);

    const commits = level === 0 ? 0 : Math.floor(level * 2.5 + Math.random() * 3);
    cell.title = `${commits} production commits`;

    fragment.appendChild(cell);
  }

  container.appendChild(fragment);
}

/* --------------------------------------------------------------------------
   7. Full Interactive Developer CLI Terminal (zsh-style)
   -------------------------------------------------------------------------- */
function initDeveloperTerminal() {
  const form = document.getElementById('terminalForm');
  const input = document.getElementById('terminalInput');
  const consoleEl = document.getElementById('terminalConsole');
  const clearBtn = document.getElementById('clearTerminalBtn');
  const chips = document.querySelectorAll('.chip-cmd');

  if (!form || !input || !consoleEl) return;

  const history = [];
  let historyIdx = -1;

  // Available terminal commands
  const commands = {
    help: () => `Available Commands:
  <strong class="term-cmd-highlight">whoami</strong>       - Display developer summary & background
  <strong class="term-cmd-highlight">skills</strong>       - List categorized tech stack & frameworks
  <strong class="term-cmd-highlight">projects</strong>     - Display featured production deployments
  <strong class="term-cmd-highlight">education</strong>    - View academic degree credentials (MCA/BCA)
  <strong class="term-cmd-highlight">experience</strong>   - Work history at Smart Digital Wings & Appsquadz
  <strong class="term-cmd-highlight">contact</strong>      - Display phone, email, location & social links
  <strong class="term-cmd-highlight">sudo hire</strong>    - ⭐ Initiates hire workflow & direct contact
  <strong class="term-cmd-highlight">theme</strong>        - Toggle dark / light mode interface
  <strong class="term-cmd-highlight">date</strong>         - Current timestamp in Meerut, India (IST)
  <strong class="term-cmd-highlight">clear</strong>        - Clears the terminal screen`,

    whoami: () => `Nikhil Chaudhary — Senior Web Developer & CMS Architect
Location    : Meerut, UP, India
Experience  : 2+ Years of Production Engineering
Deliveries  : 60+ Live Websites & Stores Delivered
Focus       : Custom WordPress, Shopify Liquid, ACF, CPT, Core Web Vitals (90+)
Status      : ● Available for Immediate Full-Time & Freelance Roles`,

    skills: () => `<table class="term-table">
  <tr><td class="term-key">CMS & E-Commerce</td><td class="term-val">WordPress, WooCommerce, Shopify (Liquid), ACF, CPT</td></tr>
  <tr><td class="term-key">Languages</td><td class="term-val">HTML5, CSS3, JavaScript (ES6+), Core PHP, SQL (MySQL)</td></tr>
  <tr><td class="term-key">UI & Styling</td><td class="term-val">CSS Grid, Flexbox, Bootstrap, Mobile-First Design</td></tr>
  <tr><td class="term-key">Tools & Ops</td><td class="term-val">Git, GitHub, Chrome DevTools, Core Web Vitals, On-Page SEO</td></tr>
</table>`,

    projects: () => `Selected Production Deployments:
1. <strong>Tarun Goyal Classes</strong> (EdTech / WooCommerce) -> <a href="https://tarungoyalclasses.in/" target="_blank" style="color:#38bdf8;text-decoration:underline;">tarungoyalclasses.in</a>
2. <strong>Kainchi Dhaaga</strong> (Shopify D2C Fashion)      -> <a href="https://kainchidhaaga.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">kainchidhaaga.com</a>
3. <strong>Eris-Nexa Elevators</strong> (Corporate B2B)         -> <a href="https://erisnexa.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">erisnexa.com</a>
4. <strong>Anamta Footwear</strong> (WooCommerce Retail)       -> <a href="https://anamtafootwear.in/" target="_blank" style="color:#38bdf8;text-decoration:underline;">anamtafootwear.in</a>
5. <strong>BimaCafe</strong> (InsurTech Comparison)          -> <a href="https://bimacafe.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">bimacafe.com</a>
6. <strong>Magic Jaggery</strong> (Organic D2C 90+ Vitals)     -> <a href="https://magicjaggery.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">magicjaggery.com</a>
Type <strong class="term-cmd-highlight">projects --all</strong> to view all 11 client deployments.`,

    'projects --all': () => `All Production Deployments & Case Studies:
1.  <strong>Tarun Goyal Classes</strong> (EdTech / WooCommerce) -> <a href="https://tarungoyalclasses.in/" target="_blank" style="color:#38bdf8;text-decoration:underline;">tarungoyalclasses.in</a>
2.  <strong>Kainchi Dhaaga</strong> (Shopify D2C Fashion)      -> <a href="https://kainchidhaaga.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">kainchidhaaga.com</a>
3.  <strong>Eris-Nexa Elevators</strong> (Corporate B2B)         -> <a href="https://erisnexa.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">erisnexa.com</a>
4.  <strong>Anamta Footwear</strong> (WooCommerce Retail)       -> <a href="https://anamtafootwear.in/" target="_blank" style="color:#38bdf8;text-decoration:underline;">anamtafootwear.in</a>
5.  <strong>BimaCafe</strong> (InsurTech Comparison)          -> <a href="https://bimacafe.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">bimacafe.com</a>
6.  <strong>Magic Jaggery</strong> (Organic D2C 90+ Vitals)     -> <a href="https://magicjaggery.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">magicjaggery.com</a>
7.  <strong>Sumati Renewables</strong> (CleanTech & Solar)     -> <a href="https://sumatirenewables.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">sumatirenewables.com</a>
8.  <strong>Perfect Boxwala</strong> (Packaging E-Commerce)   -> <a href="https://perfectboxwala.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">perfectboxwala.com</a>
9.  <strong>TutorBoon</strong> (EdTech Marketplace)          -> <a href="https://tutorboon.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">tutorboon.com</a>
10. <strong>ATDS Conferences</strong> (Academic Conferences)   -> <a href="https://atdsconferences.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">atdsconferences.com</a>
11. <strong>Dilli Vibes</strong> (Hospitality & Dining)       -> <a href="https://dillivibes.com/" target="_blank" style="color:#38bdf8;text-decoration:underline;">dillivibes.com</a>`,

    education: () => `Academic Credentials:
• <strong>Master of Computer Applications (MCA)</strong> | 2021 – 2023
  Dewan Institute of Management Studies, AKTU
• <strong>Bachelor of Computer Applications (BCA)</strong> | 2018 – 2021
  Dewan Institute of Management Studies, CCSU`,

    experience: () => `Professional Trajectory:
• <strong>Web Developer</strong> @ Smart Digital Wings, Meerut (09/2024 – Present)
  - Delivered 50+ client web solutions using WordPress, ACF, and CPT.
  - Sub-2-second load times & payment gateway integrations.
• <strong>Java Intern</strong> @ Appsquadz Software Pvt. Ltd., Noida (10/2022 – 04/2023)
  - OOP programming, software defect remediation, and SQL optimization.`,

    contact: () => `Direct Communication Channels:
• Email    : <a href="mailto:nikhilchaudhary053@gmail.com" style="color:#38bdf8;">nikhilchaudhary053@gmail.com</a>
• Phone    : <a href="tel:+917078498217" style="color:#38bdf8;">+91-7078498217</a>
• Location : Meerut, Uttar Pradesh, India
• LinkedIn : <a href="https://www.linkedin.com/in/nikhilchaudhary-a4a1a1270" target="_blank" style="color:#38bdf8;">linkedin.com/in/nikhilchaudhary-a4a1a1270</a>`,

    'sudo hire': () => `<div class="term-special-box">
  🚀 <strong>ROOT ACCESS GRANTED!</strong>
  Nikhil Chaudhary is currently available for full-time engineering positions and freelance custom projects.
  <br><br>
  👉 <a href="#contact" style="color:#ffffff;font-weight:bold;text-decoration:underline;">Click here to jump straight to the Contact Form</a> or email directly at <strong>nikhilchaudhary053@gmail.com</strong>.
</div>`,

    theme: () => {
      const root = document.documentElement;
      const currentTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('nc_portfolio_theme', newTheme);
      return `Theme switched to ${newTheme} mode.`;
    },

    date: () => {
      const now = new Date();
      return `Local station time: ${now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;
    },

    clear: () => {
      consoleEl.innerHTML = '';
      return null;
    }
  };

  // Run command function
  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    history.push(rawCmd);
    historyIdx = history.length;

    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line term-cmd-line';
    userLine.innerHTML = `<span class="term-prompt"><span class="prompt-user">nikhil@station</span>:<span class="prompt-dir">~</span>$</span> ${escapeHtml(rawCmd)}`;
    consoleEl.appendChild(userLine);

    if (cmd === 'clear') {
      commands.clear();
      return;
    }

    // Process output
    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line terminal-log-entry';

    if (commands[cmd]) {
      const result = commands[cmd]();
      if (result) outputLine.innerHTML = `<div class="term-out-text">${result}</div>`;
    } else {
      outputLine.innerHTML = `<div class="term-out-text" style="color:#f87171;">zsh: command not found: ${escapeHtml(cmd)}. Type <strong class="term-cmd-highlight">help</strong> for a list of available commands.</div>`;
    }

    consoleEl.appendChild(outputLine);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  // Handle form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    executeCommand(val);
  });

  // History navigation with Arrow keys
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = '';
      }
    }
  });

  // Quick Chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
      input.focus();
    });
  });

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => commands.clear());
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }
}

/* --------------------------------------------------------------------------
   8. Quick Command Palette (Ctrl+K or ⌘K)
   -------------------------------------------------------------------------- */
function initCommandPalette() {
  const palette = document.getElementById('commandPalette');
  const trigger = document.getElementById('cmdPaletteTrigger');
  const input = document.getElementById('cmdInput');
  const items = document.querySelectorAll('.cmd-item');

  if (!palette || !input) return;

  function openPalette() {
    palette.classList.add('open');
    palette.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    input.value = '';
    filterItems('');
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (trigger) {
    trigger.addEventListener('click', openPalette);
  }

  // Keyboard shortcut: Ctrl+K or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && palette.classList.contains('open')) {
      closePalette();
    }
  });

  palette.addEventListener('click', (e) => {
    if (e.target === palette) closePalette();
  });

  // Search filtering
  input.addEventListener('input', () => {
    filterItems(input.value.trim().toLowerCase());
  });

  function filterItems(query) {
    items.forEach(item => {
      const label = item.querySelector('.cmd-item-label').textContent.toLowerCase();
      const hint = item.querySelector('.cmd-item-hint')?.textContent.toLowerCase() || '';
      const isMatch = !query || label.includes(query) || hint.includes(query);
      item.style.display = isMatch ? 'flex' : 'none';
    });
  }

  // Execute item action
  items.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closePalette();

      if (action === 'navigate') {
        const target = item.getAttribute('data-target');
        const targetEl = document.querySelector(target);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'resume') {
        const resumeModal = document.getElementById('resumeModal');
        if (resumeModal) {
          resumeModal.classList.add('open');
          resumeModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      } else if (action === 'copy-email') {
        const email = 'nikhilchaudhary053@gmail.com';
        copyToClipboard(email, () => showToast('Email Copied', email));
      } else if (action === 'toggle-theme') {
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('nc_portfolio_theme', newTheme);
        showToast('Theme Updated', `Switched to ${newTheme} mode.`);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Interactive Project Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      if (filterValue !== 'all') {
        const toggleBtn = document.getElementById('toggleMoreProjectsBtn');
        const secondaryGrid = document.getElementById('moreProjectsGrid');
        if (toggleBtn && secondaryGrid && (secondaryGrid.hasAttribute('hidden') || secondaryGrid.hidden)) {
          secondaryGrid.removeAttribute('hidden');
          secondaryGrid.hidden = false;
          toggleBtn.setAttribute('aria-expanded', 'true');
          const toggleText = toggleBtn.querySelector('.toggle-text');
          if (toggleText) toggleText.textContent = 'Collapse Client Deployments';
        }
      }

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        const isMatch = filterValue === 'all' || categories.includes(filterValue);

        if (isMatch) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   10. Collapsible Secondary Deployments
   -------------------------------------------------------------------------- */
function initMoreProjectsToggle() {
  const toggleBtn = document.getElementById('toggleMoreProjectsBtn');
  const secondaryGrid = document.getElementById('moreProjectsGrid');

  if (toggleBtn && secondaryGrid) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;

      toggleBtn.setAttribute('aria-expanded', String(nextState));

      if (nextState) {
        secondaryGrid.removeAttribute('hidden');
        secondaryGrid.hidden = false;
      } else {
        secondaryGrid.setAttribute('hidden', '');
        secondaryGrid.hidden = true;
        toggleBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const toggleText = toggleBtn.querySelector('.toggle-text');
      if (toggleText) {
        toggleText.textContent = nextState
          ? 'Collapse Client Deployments'
          : 'Explore More Client Deployments (6 More)';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   11. Interactive Card Hover Image Slider
   -------------------------------------------------------------------------- */
function initCardHoverSliders() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    const slides = card.querySelectorAll('.slider-slide');
    const dots = card.querySelectorAll('.slider-dot');
    if (slides.length <= 1) return;

    let currentIndex = 0;
    let hoverInterval = null;

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function startSlider() {
      stopSlider();
      hoverInterval = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 1400);
    }

    function stopSlider() {
      if (hoverInterval) {
        clearInterval(hoverInterval);
        hoverInterval = null;
      }
    }

    card.addEventListener('mouseenter', () => {
      startSlider();
    });

    card.addEventListener('mouseleave', () => {
      stopSlider();
      showSlide(0); // Reset cleanly to hero view
    });

    // Support interactive dot preview clicks and mouse events
    dots.forEach((dot, dotIdx) => {
      dot.style.pointerEvents = 'auto';
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        stopSlider();
        showSlide(dotIdx);
      });
      dot.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        showSlide(dotIdx);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. Interactive Contact Form with Validation
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      const errorSpan = input.parentElement.querySelector('.form-error');
      if (errorSpan) errorSpan.classList.remove('visible');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, 'Please enter your valid full name.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please provide a valid email address.');
      isValid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'Please provide a brief message (at least 10 characters).');
      isValid = false;
    }

    if (!isValid) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 850));
      showToast('Message Dispatched!', `Thank you, ${nameInput.value.trim()}! Nikhil will get back to you shortly.`);
      form.reset();
    } catch {
      showToast('Error', 'Unable to send message right now. Please email directly.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  function showError(inputElement, message) {
    inputElement.classList.add('is-invalid');
    const errorSpan = inputElement.parentElement.querySelector('.form-error');
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.classList.add('visible');
    }
  }
}

/* --------------------------------------------------------------------------
   12. Clipboard Actions & Brand Color Swatch Picker
   -------------------------------------------------------------------------- */
function initClipboardActions() {
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'nikhilchaudhary053@gmail.com';
      copyToClipboard(email, () => {
        const textSpan = btn.querySelector('.copy-text');
        if (textSpan) {
          const original = textSpan.textContent;
          textSpan.textContent = 'Copied!';
          setTimeout(() => { textSpan.textContent = original; }, 2000);
        }
        showToast('Copied to Clipboard', email);
      });
    });
  });

  // Interactive Brand Color Swatch Copy & Theme Preview
  const swatches = document.querySelectorAll('.color-swatch');
  const glow1 = document.querySelector('.glow-1');

  swatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = swatch.getAttribute('title') || '';
      const hexMatch = title.match(/#[a-fA-F0-9]{6}/);
      const hexCode = hexMatch ? hexMatch[0] : '#38bdf8';

      copyToClipboard(hexCode, () => {
        showToast('Brand Color Copied', `${hexCode} • ${title.split(':')[0] || 'Brand Color'}`);

        // Temporarily tint ambient glow to project's brand color
        if (glow1) {
          const originalBg = glow1.style.background;
          glow1.style.background = `radial-gradient(circle, ${hexCode}, transparent)`;
          glow1.style.opacity = '0.35';
          setTimeout(() => {
            glow1.style.background = originalBg;
            glow1.style.opacity = '';
          }, 3500);
        }
      });
    });
  });
}

function copyToClipboard(text, onSuccess) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(fallback);
  } else {
    fallback();
  }

  function fallback() {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
    document.body.removeChild(temp);
  }
}

/* --------------------------------------------------------------------------
   13. Animated Metric Counters
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          animateCount(counter, target);
        });
      }
    });
  }, { threshold: 0.15 });

  const ribbon = document.querySelector('.hero-stats-ribbon');
  if (ribbon) observer.observe(ribbon);

  function animateCount(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 40);
    const stepTime = 30;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = current;
      }
    }, stepTime);
  }
}

/* --------------------------------------------------------------------------
   13b. 2x4 Grid Clockwise (+1) Motion Engine
   -------------------------------------------------------------------------- */
function initClockwiseGridMetrics() {
  const stage = document.getElementById('statsStage');
  const btnStep = document.getElementById('btnGridStep');
  const btnPlayPause = document.getElementById('btnGridPlayPause');
  const playPauseIcon = document.getElementById('gridPlayPauseIcon');

  if (!stage) return;

  const slots = Array.from(stage.querySelectorAll('.grid-metric-slot'));
  if (slots.length === 0) return;

  let isAutoRotating = true;
  let isHovered = false;
  let isTransitioning = false;
  let autoTimer = null;
  const INTERVAL_MS = 3500;

  function stepClockwise() {
    if (isTransitioning) return;
    isTransitioning = true;

    // 1. Snapshot current layout bounding rects (FIRST)
    const firstRects = new Map();
    slots.forEach(slot => {
      firstRects.set(slot, slot.getBoundingClientRect());
    });

    // 2. Advance every card's slot clockwise: (slot + 1) % 8 (LAST state in DOM)
    slots.forEach(slot => {
      const currentSlot = parseInt(slot.getAttribute('data-slot') || '0', 10);
      const nextSlot = (currentSlot + 1) % slots.length;
      slot.setAttribute('data-slot', nextSlot);
    });

    // 3. Invert: calculate delta from old position to new position
    slots.forEach(slot => {
      const first = firstRects.get(slot);
      const last = slot.getBoundingClientRect();
      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;

      slot.style.transition = 'none';
      slot.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    // 4. Play: smoothly animate to new grid position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        slots.forEach(slot => {
          slot.style.transition = 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)';
          slot.style.transform = 'translate(0px, 0px)';
        });

        setTimeout(() => {
          slots.forEach(slot => {
            slot.style.transition = '';
            slot.style.transform = '';
          });
          isTransitioning = false;
        }, 670);
      });
    });
  }

  function startAutoCycle() {
    stopAutoCycle();
    autoTimer = setInterval(() => {
      if (isAutoRotating && !isHovered && !document.hidden) {
        stepClockwise();
      }
    }, INTERVAL_MS);
  }

  function stopAutoCycle() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Hover pauses rotation
  stage.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  stage.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Manual step button (+1)
  if (btnStep) {
    btnStep.addEventListener('click', () => {
      stepClockwise();
    });
  }

  // Play / pause toggle
  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      isAutoRotating = !isAutoRotating;
      if (playPauseIcon) {
        playPauseIcon.textContent = isAutoRotating ? '⏸' : '▶';
      }
      btnPlayPause.title = isAutoRotating ? 'Pause Rotation' : 'Resume Rotation';
      btnPlayPause.setAttribute('aria-label', isAutoRotating ? 'Pause clockwise rotation' : 'Resume clockwise rotation');
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoCycle();
    } else if (isAutoRotating) {
      startAutoCycle();
    }
  });

  startAutoCycle();
}

/* --------------------------------------------------------------------------
   14. Resume Preview & Download Modal
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const resumeModal = document.getElementById('resumeModal');
  const triggers = document.querySelectorAll('.open-resume-trigger');
  const closeBtn = document.getElementById('closeResumeModalBtn');
  const closeSecondaryBtn = document.getElementById('modalCloseSecondaryBtn');
  const printBtn = document.getElementById('printResumeBtn');

  if (!resumeModal) return;

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeSecondaryBtn) closeSecondaryBtn.addEventListener('click', closeModal);

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('open')) closeModal();
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  function openModal() {
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   15. Toast Notification System
   -------------------------------------------------------------------------- */
let toastTimeout;
function showToast(title, message, duration = 3800) {
  const container = document.getElementById('toastNotification');
  const titleEl = document.getElementById('toastTitle');
  const messageEl = document.getElementById('toastMessage');

  if (!container) return;

  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;

  container.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    container.classList.remove('show');
  }, duration);
}

/* --------------------------------------------------------------------------
   16. Local Time Indicator (Meerut, India)
   -------------------------------------------------------------------------- */
function initLocalClock() {
  const timeDisplay = document.getElementById('localTimeDisplay');
  if (!timeDisplay) return;

  function updateClock() {
    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      timeDisplay.textContent = `${formatter.format(new Date())} IST`;
    } catch {
      timeDisplay.textContent = new Date().toLocaleTimeString();
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   17. Active Nav Link ScrollSpy
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}
