const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MESSAGE = "Olá, Dr. Douglas Ribeiro. Vim pelo site e gostaria de solicitar uma análise jurídica inicial.";

const navToggle = document.querySelector(".nav-toggle");
const body = document.body;

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

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  link.setAttribute("href", whatsappUrl);
});
