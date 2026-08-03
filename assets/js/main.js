(function () {
  "use strict";

  var isFine = window.matchMedia("(pointer: fine)").matches;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initPreloader() {
    var preloader = document.querySelector(".preloader");
    if (!preloader) return;
    var hide = function () {
      if (typeof gsap === "undefined") {
        preloader.remove();
        return;
      }
      gsap.to(preloader, {
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: function () {
          preloader.remove();
        }
      });
    };
    window.addEventListener("load", hide);
    setTimeout(hide, 3000);
  }

  function initSmoothScroll() {
    var lenis = null;
    if (typeof Lenis !== "undefined" && !reduced) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true, smoothTouch: true });
      if (typeof ScrollTrigger !== "undefined") {
        lenis.on("scroll", ScrollTrigger.update);
      }
      if (typeof gsap !== "undefined") {
        gsap.ticker.add(function (time) {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        (function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        })(0);
      }
    }

    var navInner = document.querySelector(".nav-inner");
    var baseOffset = (navInner ? navInner.offsetHeight : 74) + 16;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var hash = anchor.getAttribute("href");
        if (!hash || hash === "#") return;
        var target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -baseOffset, duration: 1.2 });
        } else {
          var y = target.getBoundingClientRect().top + window.scrollY - baseOffset;
          if (reduced) {
            document.documentElement.scrollTop = y;
            document.body.scrollTop = y;
          } else {
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }
        if (typeof closeMenu === "function") closeMenu();
      });
    });

    window.lenis = lenis;
  }

  function initNavbar() {
    var header = document.getElementById("site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initAnnounceBar() {
    var bar = document.getElementById("announce-bar");
    if (!bar) return;
    var KEY = "announceBarDismissed";
    var dismiss = function () {
      bar.classList.add("dismissed");
      document.documentElement.style.setProperty("--announce-h", "0px");
      try {
        localStorage.setItem(KEY, "1");
      } catch (e) {}
    };
    var closeBtn = bar.querySelector(".announce-close");
    if (closeBtn) closeBtn.addEventListener("click", dismiss);
    try {
      if (localStorage.getItem(KEY) === "1") dismiss();
    } catch (e) {}
  }

  function initMobileMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (!toggle || !menu) return;
    var icon = toggle.querySelector("i");
    window.openMenu = function () {
      menu.classList.add("open");
      document.body.style.overflow = "hidden";
      icon.className = "fa-solid fa-xmark";
      toggle.setAttribute("aria-expanded", "true");
    };
    window.closeMenu = function () {
      menu.classList.remove("open");
      document.body.style.overflow = "";
      icon.className = "fa-solid fa-bars";
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      menu.classList.contains("open") ? closeMenu() : openMenu();
    });
  }

  function initScrollSpy() {
    var sections = document.querySelectorAll("section[id]");
    var links = document.querySelectorAll(".nav-link[href^='#']");
    if (!links.length) return;
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  function initTyped() {
    if (typeof Typed === "undefined") return;
    var el = document.getElementById("typed-text");
    if (!el) return;
    new Typed("#typed-text", {
      strings: [
        "Senior Shopify Developer",
        "Shopify Expert",
        "Shopify Plus Specialist",
        "Liquid Specialist",
        "WordPress Developer",
        "API Integration Expert",
        "Speed Optimization Specialist"
      ],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1600,
      startDelay: 500,
      loop: true,
      smartBackspace: true,
      cursorChar: "|"
    });
  }

  function initAOS() {
    if (typeof AOS === "undefined") return;
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 80 });
  }

  function initCounters() {
    if (typeof gsap === "undefined") return;
    document.querySelectorAll(".counter").forEach(function (el) {
      var target = parseFloat(el.dataset.target || "0");
      var decimals = parseInt(el.dataset.decimals || "0", 10);
      var suffix = el.dataset.suffix || "";
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
        onUpdate: function () {
          el.textContent = obj.val.toFixed(decimals) + suffix;
        }
      });
    });
  }

  function initSkillRings() {
    document.querySelectorAll(".skill-ring").forEach(function (ring) {
      var circle = ring.querySelector(".ring-fg");
      var num = ring.querySelector(".skill-ring-num");
      var value = parseFloat(ring.dataset.value || "0");
      var length = circle.getTotalLength();
      circle.style.strokeDasharray = length;
      circle.style.strokeDashoffset = length;
      if (typeof gsap === "undefined") {
        circle.style.strokeDashoffset = length - (length * value) / 100;
        num.textContent = value + "%";
        return;
      }
      var obj = { v: 0 };
      gsap.to(obj, {
        v: value,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ring, start: "top 88%" },
        onUpdate: function () {
          circle.style.strokeDashoffset = length - (length * obj.v) / 100;
          num.textContent = Math.round(obj.v) + "%";
        }
      });
    });
  }

  function initSkillBars() {
    document.querySelectorAll(".skill-bar-fill").forEach(function (bar) {
      var width = bar.dataset.width || "0";
      if (typeof gsap === "undefined") {
        bar.style.width = width + "%";
        return;
      }
      gsap.to(bar, {
        width: width + "%",
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: bar, start: "top 92%" }
      });
    });
  }

  function initSwiper() {
    if (typeof Swiper === "undefined") return;
    new Swiper(".cert-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      grabCursor: true,
      autoplay: { delay: 3500, disableOnInteraction: false },
      pagination: { el: ".cert-swiper .swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".cert-swiper .swiper-button-next",
        prevEl: ".cert-swiper .swiper-button-prev"
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        992: { slidesPerView: 3 }
      }
    });

    var testimonial = document.querySelector(".testimonial-swiper");
    if (testimonial) {
      new Swiper(testimonial, {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        grabCursor: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: { el: testimonial.querySelector(".swiper-pagination"), clickable: true },
        breakpoints: {
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        }
      });
    }
  }

  function initCursor() {
    if (!isFine || reduced) return;
    document.body.classList.add("custom-cursor");
    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    var glow = document.querySelector(".cursor-glow");
    if (!ring && !dot) return;

    var mx = window.innerWidth / 2;
    var my = window.innerHeight / 2;
    var rx = mx;
    var ry = my;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (dot) dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      if (glow) glow.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring) ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();

    document
      .querySelectorAll("a, button, input, textarea, .tilt, .service-card, .project-card, .cert-card, .edu-card")
      .forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          if (ring) ring.classList.add("grow");
        });
        el.addEventListener("mouseleave", function () {
          if (ring) ring.classList.remove("grow");
        });
      });
  }

  function initMagnetic() {
    if (!isFine || reduced || typeof gsap === "undefined") return;
    document.querySelectorAll(".btn-magnetic").forEach(function (btn) {
      var strength = 22;
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: (x / rect.width) * strength, y: (y / rect.height) * strength, duration: 0.4, ease: "power3.out" });
      });
      btn.addEventListener("mouseleave", function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" });
      });
    });
  }

  function initTilt() {
    if (!isFine || reduced || typeof gsap === "undefined") return;
    document.querySelectorAll(".tilt").forEach(function (card) {
      var max = 8;
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotationY: px * max, rotationX: -py * max, transformPerspective: 800, duration: 0.4, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", function () {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power3.out" });
      });
    });
  }

  function initSpotlight() {
    document.querySelectorAll(".card-spotlight").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - rect.left + "px");
        card.style.setProperty("--my", e.clientY - rect.top + "px");
      });
    });
  }

  function initBlobParallax() {
    if (reduced || typeof gsap === "undefined") return;
    var blobs = document.querySelectorAll(".blob");
    window.addEventListener("mousemove", function (e) {
      var cx = e.clientX / window.innerWidth - 0.5;
      var cy = e.clientY / window.innerHeight - 0.5;
      blobs.forEach(function (blob, i) {
        var depth = (i + 1) * 34;
        gsap.to(blob, { x: cx * depth, y: cy * depth, duration: 1.2, ease: "power2.out" });
      });
    });
  }

  function initHeroParallax() {
    if (!isFine || reduced || typeof gsap === "undefined") return;
    var visual = document.querySelector(".hero-visual");
    if (!visual) return;
    visual.addEventListener("mousemove", function (e) {
      var rect = visual.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      visual.querySelectorAll(".float-chip, .float-stat").forEach(function (el, i) {
        var depth = ((i % 3) + 1) * 12;
        gsap.to(el, { x: x * depth, y: y * depth, duration: 0.6, ease: "power2.out" });
      });
      var frame = visual.querySelector(".photo-frame");
      if (frame) gsap.to(frame, { x: x * -10, y: y * -10, duration: 0.6, ease: "power2.out" });
    });
  }

  function initScrollUI() {
    var backToTop = document.getElementById("back-to-top");
    var progressBar = document.getElementById("scroll-progress-bar");
    var onScroll = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var percent = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (progressBar) progressBar.style.width = percent + "%";
      if (backToTop) backToTop.classList.toggle("show", window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backToTop) {
      backToTop.addEventListener("click", function () {
        if (window.lenis) {
          window.lenis.scrollTo(0, { duration: 1.6 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }
  }

  function initReveals() {
    if (reduced || typeof gsap === "undefined") return;
    var heroItems = document.querySelectorAll(".hero [data-reveal]");
    gsap.from(heroItems, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.35 });

    document.querySelectorAll(".timeline-item").forEach(function (item, i) {
      gsap.from(item, {
        opacity: 0,
        x: i % 2 === 0 ? -60 : 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 88%" }
      });
    });
  }

  function initTriggerRefresh() {
    if (typeof ScrollTrigger === "undefined") return;
    var refreshed = false;
    var refresh = function () {
      if (refreshed) return;
      refreshed = true;
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", refresh);
    if (document.readyState === "complete") refresh();
  }

  function initForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var subject = encodeURIComponent(data.get("subject") || "Portfolio Contact");
      var body = encodeURIComponent("Name: " + data.get("name") + "\nEmail: " + data.get("email") + "\n\n" + data.get("message"));
      window.location.href = "mailto:krupalisarvaiya1905@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  function initYear() {
    document.querySelectorAll(".js-year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function initIconLabels() {
    document.querySelectorAll(".social-icon, .whatsapp-float, .back-to-top").forEach(function (el) {
      if (el.hasAttribute("aria-label")) return;
      var i = el.querySelector("i");
      if (!i) return;
      var cls = i.className;
      var name = "";
      if (cls.indexOf("linkedin") > -1) name = "LinkedIn";
      else if (cls.indexOf("github") > -1) name = "GitHub";
      else if (cls.indexOf("envelope") > -1) name = "Email";
      else if (cls.indexOf("whatsapp") > -1) name = "Chat on WhatsApp";
      else if (cls.indexOf("arrow-up") > -1) name = "Back to top";
      if (name) el.setAttribute("aria-label", name);
    });
  }

  function init() {
    initPreloader();
    initSmoothScroll();
    initNavbar();
    initAnnounceBar();
    initMobileMenu();
    initScrollSpy();
    initTyped();
    initAOS();
    initCounters();
    initSkillRings();
    initSkillBars();
    initSwiper();
    initCursor();
    initMagnetic();
    initTilt();
    initSpotlight();
    initBlobParallax();
    initHeroParallax();
    initScrollUI();
    initReveals();
    initTriggerRefresh();
    initForm();
    initYear();
    initIconLabels();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
