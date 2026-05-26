const WHATSAPP_NUMBER = "5511999999999";
const DEFAULT_MESSAGE = "Olá. Vim pelo site holding.acsacontabilidade.com.br e gostaria de solicitar uma consultoria sobre holding patrimonial.";
const GA_MEASUREMENT_ID = "";
const ENABLE_ANALYTICS_DEBUG = false;

const debugAnalytics = (eventName, params) => {
  if (ENABLE_ANALYTICS_DEBUG) {
    console.info("[analytics]", eventName, params);
  }
};

const trackEvent = (eventName, params = {}) => {
  const payload = {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...params
  };

  debugAnalytics(eventName, payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }
};

window.siteAnalytics = {
  event: trackEvent
};

if (GA_MEASUREMENT_ID) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(tag);

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: true,
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
  });
}

const navToggle = document.querySelector(".nav-toggle");
const body = document.body;

const buildWhatsappUrl = (message = DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  link.setAttribute("href", buildWhatsappUrl());
});

navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  body.classList.toggle("menu-open");
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  });
});

document.querySelectorAll(".section, .signal-bar article, .benefit-card, .process-line article, .article-grid article").forEach((item) => {
  item.setAttribute("data-reveal", "");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll("[data-reveal]").forEach((item) => revealObserver.observe(item));

const animateCounter = (element) => {
  const target = Number(element.dataset.counter || 0);
  const duration = 900;
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = Math.floor(target * progress).toString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));

const trackedScrollDepths = new Set();
const trackScrollDepth = () => {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (documentHeight <= 0) {
    return;
  }

  const percent = Math.round((window.scrollY / documentHeight) * 100);

  [25, 50, 75, 90].forEach((depth) => {
    if (percent >= depth && !trackedScrollDepths.has(depth)) {
      trackedScrollDepths.add(depth);
      trackEvent("scroll_depth", {
        depth_percent: depth
      });
    }
  });
};

window.addEventListener("scroll", trackScrollDepth, { passive: true });

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  const button = event.target.closest("button");
  const target = link || button;

  if (!target) {
    return;
  }

  const label = target.textContent.trim().replace(/\s+/g, " ").slice(0, 120);
  const href = link ? link.href : "";

  if (target.classList.contains("whatsapp-link") || href.includes("wa.me")) {
    trackEvent("whatsapp_click", {
      click_text: label,
      click_url: href
    });
    return;
  }

  if (target.classList.contains("button") || target.classList.contains("nav-cta")) {
    trackEvent("cta_click", {
      click_text: label,
      click_url: href
    });
    return;
  }

  if (link && link.hostname && link.hostname !== window.location.hostname) {
    trackEvent("outbound_click", {
      click_text: label,
      click_url: href
    });
  }
});

document.querySelector("#leadForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const nome = formData.get("nome");
  const perfil = formData.get("perfil");
  const mensagem = formData.get("mensagem");
  const text = [
    "Olá. Vim pelo site holding.acsacontabilidade.com.br e gostaria de uma consultoria sobre holding patrimonial.",
    "",
    `Nome: ${nome}`,
    `Perfil: ${perfil}`,
    `Resumo: ${mensagem}`
  ].join("\n");

  trackEvent("lead_form_submit", {
    form_name: "holding_consultoria",
    lead_profile: perfil
  });

  window.open(buildWhatsappUrl(text), "_blank", "noopener");
});
