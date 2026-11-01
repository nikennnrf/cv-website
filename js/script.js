"use strict";

/* ===== Menu mobile ===== */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

/* ===== Tema terang / gelap ===== */
const themeBtn = document.getElementById("themeBtn");
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) { /* abaikan jika storage tidak tersedia */ }

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

/* ===== Efek mengetik ===== */
const phrases = [
  "Exploratory Data Analysis",
  "Machine Learning dengan Python",
  "Data Pipeline & SQL",
  "Insight bisnis dari data",
];
const typingEl = document.getElementById("typing");
let p = 0, c = 0, deleting = false;

function type() {
  const word = phrases[p];
  typingEl.textContent = word.slice(0, c);
  if (!deleting && c < word.length) c++;
  else if (deleting && c > 0) c--;
  else if (!deleting) { deleting = true; return setTimeout(type, 1400); }
  else { deleting = false; p = (p + 1) % phrases.length; }
  setTimeout(type, deleting ? 40 : 80);
}
type();

/* ===== Animasi muncul saat scroll ===== */
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add("visible");
      io.unobserve(en.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ===== Hitung angka statistik ===== */
const counters = document.querySelectorAll("[data-count]");
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const val = target * (1 - Math.pow(1 - t, 3));
      el.textContent = val.toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach((el) => countIO.observe(el));

/* ===== Menu aktif sesuai posisi scroll ===== */
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a[href^='#']");
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => spy.observe(s));

/* ===== Tombol kembali ke atas ===== */
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 500));
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ===== Salin email ===== */
document.getElementById("copyEmail").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  const email = document.getElementById("emailLink").textContent.trim();
  try {
    await navigator.clipboard.writeText(email);
    btn.textContent = "Tersalin ✓";
  } catch (err) {
    btn.textContent = "Gagal menyalin";
  }
  setTimeout(() => (btn.textContent = "Salin Email"), 1800);
});

/* ===== Validasi form kontak ===== */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
// Urutan pengiriman: 1) Formspree (jika diisi), 2) backend Flask (jika diisi), 3) aplikasi email (mailto).
// Formspree: daftar gratis di formspree.io, buat form, lalu tempel URL-nya, contoh "https://formspree.io/f/abcdwxyz"
const FORMSPREE_URL = "";
// Backend Flask, contoh lokal "http://127.0.0.1:5000/api/contact" atau URL hasil deploy
const API_URL = "";
const MAIL_TO = "nikennurfaizah792@gmail.com";

function setError(field, msg) {
  const input = form.elements[field];
  form.querySelector(`[data-for="${field}"]`).textContent = msg;
  input.classList.toggle("invalid", Boolean(msg));
  return !msg;
}

function validate() {
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const okName = setError("name", name.length < 3 ? "Nama minimal 3 karakter." : "");
  const okEmail = setError("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Format email tidak valid.");
  const okMsg = setError("message", message.length < 10 ? "Pesan minimal 10 karakter." : "");
  return okName && okEmail && okMsg;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.className = "form-status";
  statusEl.textContent = "";
  if (!validate()) return;

  const payload = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    message: form.elements.message.value.trim(),
  };

  const endpoint = FORMSPREE_URL || API_URL;

  // Tanpa layanan pengiriman: langsung buka aplikasi email dengan pesan yang sudah terisi
  if (!endpoint) return openMail(payload);

  statusEl.textContent = "Mengirim...";
  statusEl.classList.add("info");
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Server error");
    statusEl.className = "form-status ok";
    statusEl.textContent = "Terima kasih! Pesan Anda sudah terkirim.";
    form.reset();
  } catch (err) {
    openMail(payload);
  }
});

function openMail(payload) {
  const subject = encodeURIComponent("Pesan dari " + payload.name);
  const body = encodeURIComponent(payload.message + "\n\nDari: " + payload.email);
  statusEl.className = "form-status info";
  statusEl.textContent = "Membuka aplikasi email Anda untuk mengirim pesan. Jika tidak terbuka, kirim manual ke " + MAIL_TO + ".";
  window.location.href = `mailto:${MAIL_TO}?subject=${subject}&body=${body}`;
}

form.addEventListener("input", (e) => {
  if (e.target.name) setError(e.target.name, "");
});

/* ===== Tahun footer ===== */
document.getElementById("year").textContent = new Date().getFullYear();
