const WHATSAPP_NUMBER = "5511999999999";
const DEFAULT_MESSAGE = "Olá, Dr. Douglas Ribeiro. Vim pelo site e gostaria de solicitar uma consultoria sobre holding patrimonial.";

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

document.querySelector("#leadForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const nome = formData.get("nome");
  const perfil = formData.get("perfil");
  const mensagem = formData.get("mensagem");
  const text = [
    "Olá, Dr. Douglas Ribeiro. Vim pelo site e gostaria de uma consultoria sobre holding patrimonial.",
    "",
    `Nome: ${nome}`,
    `Perfil: ${perfil}`,
    `Resumo: ${mensagem}`
  ].join("\n");

  window.open(buildWhatsappUrl(text), "_blank", "noopener");
});
