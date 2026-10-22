/* ==========================================================================
   ARJIT | NEO-BRUTALIST PORTFOLIO LOGIC
   ========================================================================== */

(() => {
  "use strict";

  // --- 1. Custom Cursor (Enabled only on pointer: fine devices) ---
  const cursor = document.getElementById("cursor");
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursor && hasFinePointer) {
    let mouseX = -100;
    let mouseY = -100;
    let rafId = null;

    const updateCursorPosition = () => {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
      rafId = null;
    };

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursor.classList.contains("cursor-active")) {
        cursor.classList.add("cursor-active");
      }
      if (!rafId) {
        rafId = requestAnimationFrame(updateCursorPosition);
      }
    });

    document.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor-active");
    });

    document.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor-active");
    });

    // Hover effect delegation for buttons, links, inputs, and elements with .cursor-hover
    const interactiveSelector = ".cursor-hover, a, button, input, textarea, select, [role='button']";

    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest(interactiveSelector);
      if (target) {
        cursor.style.width = "48px";
        cursor.style.height = "48px";
        cursor.style.backgroundColor = "rgba(251, 255, 72, 0.4)";
        cursor.style.border = "2px solid #000000";
      }
    });

    document.addEventListener("mouseout", (e) => {
      const target = e.target.closest(interactiveSelector);
      if (target) {
        cursor.style.width = "24px";
        cursor.style.height = "24px";
        cursor.style.backgroundColor = "rgba(251, 255, 72, 0.75)";
        cursor.style.border = "2px solid #000000";
      }
    });
  }

  // --- 2. Scroll Progress Bar (Optimized with rAF) ---
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    let scrollRaf = null;
    const updateProgress = () => {
      const winScroll = window.pageYOffset || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = `${scrolled}%`;
      scrollRaf = null;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!scrollRaf) {
          scrollRaf = requestAnimationFrame(updateProgress);
        }
      },
      { passive: true }
    );
  }

  // --- 3. Scroll Reveal Observer (Unobserve once active for high performance) ---
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("active"));
  }

  // --- 4. Lazy Images with Graceful Fallback ---
  const lazyImages = document.querySelectorAll(".lazy-img");
  if ("IntersectionObserver" in window && lazyImages.length > 0) {
    const lazyImageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          observer.unobserve(img);

          const targetSrc = img.dataset.src;
          if (!targetSrc) return;

          const fallbackId = img.dataset.fallback;
          const revealFallback = () => {
            img.style.display = "none";
            if (fallbackId) {
              const fallbackEl = document.getElementById(fallbackId);
              if (fallbackEl) fallbackEl.style.display = "block";
            }
          };

          const timeoutTimer = setTimeout(revealFallback, 7000);
          img.addEventListener(
            "load",
            () => {
              clearTimeout(timeoutTimer);
            },
            { once: true }
          );
          img.addEventListener(
            "error",
            () => {
              clearTimeout(timeoutTimer);
              revealFallback();
            },
            { once: true }
          );

          img.src = targetSrc;
        });
      },
      { rootMargin: "250px 0px" }
    );

    lazyImages.forEach((img) => lazyImageObserver.observe(img));
  }

  // --- 5. Preloader Sequence ---
  const preloader = document.getElementById("preloader");
  const preloaderPercent = document.getElementById("preloaderPercent");
  const preloaderBar = document.getElementById("preloaderBar");
  const cyberText = document.getElementById("cyberText");
  const heroRevealElements = document.querySelectorAll(".hero-reveal, .hero-reveal-top");

  document.documentElement.classList.add("is-loading");

  const terminalLogs = [
    "INITIALIZING CORE...",
    "LOADING BRUTALIST UI...",
    "CONNECTING REPOSITORIES...",
    "STREAMING GITHUB MATRIX...",
    "OPTIMIZING GRAPHICS...",
    "SYSTEM ONLINE. READY.",
  ];

  // Snappy yet aesthetic duration (950ms)
  const minLoaderDuration = 950;
  const loaderStartTime = performance.now();
  let pageHasLoaded = document.readyState === "complete";

  if (!pageHasLoaded) {
    window.addEventListener("load", () => {
      pageHasLoaded = true;
    });
  }

  const finishPreloader = () => {
    document.documentElement.classList.remove("is-loading");
    document.documentElement.classList.add("is-loaded");

    if (preloader) {
      preloader.classList.add("preloader-exit");
    }

    heroRevealElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("active");
      }, 150 + index * 80);
    });

    setTimeout(() => {
      if (preloader) {
        preloader.style.display = "none";
      }
    }, 700);
  };

  const tickPreloader = () => {
    const elapsed = performance.now() - loaderStartTime;
    const timeProgress = Math.min(100, (elapsed / minLoaderDuration) * 100);
    const readyToFinish = pageHasLoaded && elapsed >= minLoaderDuration;
    const shown = readyToFinish ? 100 : Math.min(99, Math.floor(timeProgress));

    if (preloaderPercent) {
      preloaderPercent.textContent = `${String(shown).padStart(2, "0")}%`;
    }
    if (preloaderBar) {
      preloaderBar.style.width = `${shown}%`;
    }

    if (cyberText) {
      const logIndex = Math.min(
        terminalLogs.length - 1,
        Math.floor((shown / 100) * terminalLogs.length)
      );
      cyberText.textContent = terminalLogs[logIndex];
    }

    if (shown >= 100) {
      finishPreloader();
      return;
    }

    requestAnimationFrame(tickPreloader);
  };

  requestAnimationFrame(tickPreloader);

  // --- 6. Form Validation & ARIA Sync (Modern Web Guidance) ---
  const syncAriaInvalid = (el) => {
    if (!el || !("checkValidity" in el)) return;
    const isInvalid = el.matches(":user-invalid");
    el.setAttribute("aria-invalid", isInvalid ? "true" : "false");
  };

  document.addEventListener("blur", (e) => syncAriaInvalid(e.target), true);
  document.addEventListener("input", (e) => {
    if (e.target && e.target.hasAttribute("aria-invalid")) {
      syncAriaInvalid(e.target);
    }
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitBtn = contactForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "TRANSMITTING...";
      }

      setTimeout(() => {
        contactForm.innerHTML = `
          <div class="py-12 text-center" role="status" aria-live="polite">
            <div class="w-16 h-16 bg-neo-green border-4 border-black mx-auto mb-4 flex items-center justify-center shadow-hard">
              <i class="ri-checkbox-circle-fill text-4xl text-black"></i>
            </div>
            <h3 class="text-3xl font-black uppercase text-black mb-2">Transmission Received</h3>
            <p class="font-mono text-sm text-gray-700 max-w-sm mx-auto">
              System acknowledged. I will process your message and respond shortly.
            </p>
            <div class="mt-6">
              <span class="inline-block bg-neo-black text-white px-3 py-1 font-mono text-xs font-bold border border-black">
                STATUS: DISPATCHED_OK
              </span>
            </div>
          </div>
        `;
      }, 500);
    });
  }

  // --- 7. Dynamic Navigation Active Indicator (IntersectionObserver & Smooth Scroll) ---
  const navItems = document.querySelectorAll(".nav-item");
  const navTargets = ["about", "skills", "experience", "coding-stats", "projects", "contact"];

  const setActiveNav = (targetId) => {
    navItems.forEach((item) => {
      const href = item.getAttribute("href");
      if (targetId && href === `#${targetId}`) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  };

  let isClickScrolling = false;
  let clickScrollTimer = null;

  // Handle clicking navigation links
  navItems.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        e.preventDefault();
        setActiveNav(targetId);
        isClickScrolling = true;
        clearTimeout(clickScrollTimer);

        targetEl.scrollIntoView({ behavior: "smooth" });

        if (history.pushState) {
          history.pushState(null, null, `#${targetId}`);
        }

        clickScrollTimer = setTimeout(() => {
          isClickScrolling = false;
          determineActiveSection();
        }, 850);
      }
    });
  });

  // Handle clicking brand logo to scroll to top & clear active highlight
  const brandLogo = document.querySelector("nav a[href='#']");
  if (brandLogo) {
    brandLogo.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveNav(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (history.pushState) {
        history.pushState(null, null, window.location.pathname);
      }
    });
  }

  // Determine which section is currently active in the viewport
  const determineActiveSection = () => {
    // 1. Bottom of page check -> guarantees CONTACT is highlighted when user scrolls to bottom
    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight - scrollBottom <= 60) {
      setActiveNav("contact");
      return;
    }

    // 2. Top of page check -> clears active highlight when at the hero section
    const firstSection = document.getElementById("about");
    if (firstSection && window.scrollY < firstSection.offsetTop - window.innerHeight * 0.4) {
      setActiveNav(null);
      return;
    }

    // 3. Eye-level reading line check (35% from viewport top)
    let activeId = null;
    let closestDistance = Infinity;
    const eyeLevel = window.innerHeight * 0.35;

    navTargets.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      const rect = section.getBoundingClientRect();

      if (rect.top <= eyeLevel && rect.bottom >= eyeLevel) {
        activeId = id;
      } else if (!activeId) {
        const distance = Math.abs(rect.top - eyeLevel);
        if (distance < closestDistance) {
          closestDistance = distance;
          activeId = id;
        }
      }
    });

    if (activeId) {
      setActiveNav(activeId);
    }
  };

  // Efficient IntersectionObserver monitoring
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      () => {
        if (!isClickScrolling) {
          determineActiveSection();
        }
      },
      {
        root: null,
        rootMargin: "-25% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75],
      }
    );

    navTargets.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        navObserver.observe(section);
      }
    });
  }

  // Secondary scroll listener for top and bottom bounds with rAF
  let scrollThrottle = null;
  window.addEventListener(
    "scroll",
    () => {
      if (isClickScrolling) return;
      if (!scrollThrottle) {
        scrollThrottle = requestAnimationFrame(() => {
          determineActiveSection();
          scrollThrottle = null;
        });
      }
    },
    { passive: true }
  );

  // Initialize active navigation state on load
  const initNavState = () => {
    const hash = window.location.hash?.replace("#", "");
    if (hash && navTargets.includes(hash)) {
      setActiveNav(hash);
    } else {
      determineActiveSection();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavState);
  } else {
    initNavState();
  }
})();
