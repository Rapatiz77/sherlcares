/* ====== À MODIFIER ====== */
const WHATSAPP = "50955105543"; // numéro WhatsApp pour te contacter (commandes, rendez-vous)
const WHATSAPP_AFFICHE = "+509 5510-5543";
const DEVISE = "Gourde";
const HERO_PHOTO = "logo.png"; // image affichée en haut de l'accueil (ton logo)
// price : null = "Prix sur demande" (ou mets un chiffre, ex. 10)
const HAIR = [
  { id: 1, name: "SHERL OIL Extra Pousse — 50 ml", shape: "", l1: "SHERL", l2: "OIL", l3: "EXTRA POUSSE", desc: "Hibiscus, gingembre, romarin, feuilles naturelles et huiles végétales. 2 fois par semaine, usage externe." },
  { id: 2, name: "Huile Coiffante — 50 ml", shape: "", l1: "SHERLCARE", l2: "HUILE", l3: "COIFFANTE", desc: "Huile naturelle pour la pousse des cheveux." },
  { id: 3, name: "Soin coiffant nourrissant — 300 ml", shape: "jar", l1: "SHERLCARE", l2: "SOIN", l3: "COIFFANT", desc: "Hydrate, nourrit et répare. Apporte brillance et protection." },
  { id: 4, name: "SHERL GEL Extra Pousse", shape: "jar", l1: "SHERL", l2: "GEL", l3: "EXTRA POUSSE", desc: "Hibiscus, gingembre, romarin et feuilles naturelles. Pour des cheveux plus longs et plus forts." },
  { id: 5, name: "SHERL POMMADE Extra Pousse — 120 g", shape: "jar", l1: "SHERL", l2: "POMMADE", l3: "EXTRA POUSSE", desc: "Persil, beurre de karité, beurre de cacao et huile d'olive." },
  { id: 6, name: "SHERL SHAMPOO", shape: "shampoo", l1: "SHERL", l2: "SHAMPOO", l3: "TOUS CHEVEUX", desc: "Pour des cheveux forts, sains et brillants. Convient à tous les types de cheveux." },
  { id: 7, name: "Shampoo spécial pour homme", shape: "shampoo", l1: "SHERL", l2: "SHAMPOO", l3: "POUR HOMME", desc: "Nettoie, fortifie et revitalise. Conçu pour les cheveux texturés." },
  { id: 8, name: "Après-shampooing", shape: "", l1: "SHERLCARE", l2: "APRÈS", l3: "SHAMPOOING", desc: "Soin démêlant et nourrissant au karité, à l'argan et aux protéines de soie." }
].map((p) => ({ ...p, cat: "Cheveux", price: null }));

const SOAPS = ["Carotte", "Citron", "Curcuma", "Avoine", "Riz", "Charbon actif", "Neem"].map((n, i) => ({
  id: 20 + i, name: "SHERL SOAP — " + n, cat: "Savons", price: null, shape: "soap",
  l1: "SHERL", l2: "SOAP", l3: n.toUpperCase(),
  desc: "Savon éclaircissant à base naturelle. Contre les taches, les acnés et les démangeaisons de la peau."
}));

const PRODUCTS = [...HAIR, ...SOAPS];

// Photos placées à côté d'index.html (id du produit -> nom du fichier, sans .jpg)
const IMAGES = {
  1: "sherl-oil", 2: "huile-coiffante", 3: "soin-coiffant", 4: "sherl-gel",
  5: "sherl-pommade", 6: "sherl-shampoo", 7: "shampoo-homme", 8: "apres-shampooing",
  20: "soap-carotte", 21: "soap-citron", 22: "soap-curcuma", 23: "soap-avoine",
  24: "soap-riz", 25: "soap-charbon", 26: "soap-neem"
};
PRODUCTS.forEach((p) => { p.img = IMAGES[p.id] ? IMAGES[p.id] + ".jpg" : ""; });

// LOGO : bande de logo sous l'en-tête. "" = désactivée (le logo est déjà dans la bannière)
const LOGO = "";

// VIDÉO PUB : envoie pub.mp4 dans le dépôt (25 Mo maximum depuis le navigateur),
// ou colle un lien YouTube de la forme https://www.youtube.com/embed/XXXX
const VIDEO = { youtube: "", file: "pub.mp4" };

// PAIEMENT : moncash = ton numéro MonCash (affiché dans le panier pour payer)
// natcash : ton numéro NatCash, "" si tu n'en as pas
// paypalUser : ton nom PayPal.me (la partie après paypal.me/), "" si tu n'en as pas
// rateHTG : combien de gourdes pour 1 USD (ex. 130) pour afficher le montant en gourdes. 0 = ne pas afficher
const PAY = { moncash: "+509 4767-8252", natcash: "", paypalUser: "", rateHTG: 0 };
/* ======================== */

const $ = (id) => document.getElementById(id);
const money = (n) => (n == null ? "Prix sur demande" : n.toFixed(2).replace(".", ",") + " " + DEVISE);
let cart = [];
try { cart = JSON.parse(localStorage.getItem("sherlcare-cart")) || []; } catch (e) {}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.id);
  toast.id = setTimeout(() => t.classList.remove("show"), 2200);
}

function wa(text) {
  window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text), "_blank", "noopener");
}

function renderProducts(filter = "Tous") {
  const list = PRODUCTS.filter((p) => filter === "Tous" || p.cat === filter);
  $("productGrid").innerHTML = list.length ? list
    .map((p) => `<article class="product-card">
      <div class="product-art${p.img ? " has-img" : ""}">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        ${p.img
          ? `<img src="${p.img}" alt="${p.name}" loading="lazy">`
          : `<div class="product-shape ${p.shape}"><span>${p.l1}</span><b>${p.l2}</b><small>${p.l3}</small></div>`}
      </div>
      <div class="product-info">
        <div class="product-category">${p.cat === "Cheveux" ? "Soins capillaires" : p.cat}</div>
        <h3>${p.name}</h3>
        <p class="product-description">${p.desc}</p>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add-button" data-add="${p.id}" aria-label="Ajouter ${p.name} au panier">+</button>
        </div>
        <a class="share-link" href="https://wa.me/?text=${encodeURIComponent("Découvre " + p.name + " chez SHERLCARE : " + location.href)}" target="_blank" rel="noopener">Partager</a>
      </div></article>`).join("")
    : '<p class="empty-cart">Bientôt disponible.</p>';
}

function cartSum() {
  const priced = cart.filter((i) => i.price != null);
  const sum = priced.reduce((s, i) => s + i.price * i.qty, 0);
  return { sum, unpriced: priced.length < cart.length, hasPriced: priced.length > 0 };
}

function totalText() {
  const { sum, unpriced, hasPriced } = cartSum();
  if (!hasPriced) return cart.length ? "Sur demande" : money(0);
  return money(sum) + (unpriced ? " + articles sur demande" : "");
}

function htgText(usd) {
  return PAY.rateHTG > 0 ? " (≈ " + Math.ceil(usd * PAY.rateHTG).toLocaleString("fr-FR") + " HTG)" : "";
}

function payMethods() {
  const m = [];
  if (PAY.moncash) m.push(["moncash", "MonCash"]);
  if (PAY.natcash) m.push(["natcash", "NatCash"]);
  if (PAY.paypalUser) m.push(["paypal", "PayPal"]);
  m.push(["cash", "Paiement à la livraison / en boutique"]);
  return m;
}

function renderPay() {
  const sel = $("payMethod");
  if (!sel) return;
  const m = sel.value;
  const { sum, unpriced, hasPriced } = cartSum();
  const exact = hasPriced && !unpriced;
  const amount = exact ? money(sum) + htgText(sum) : "le montant confirmé par WhatsApp";
  let h = "";
  if (m === "moncash") h = "Envoie " + amount + " au MonCash <b>" + PAY.moncash + "</b>, puis écris le code de transaction ci-dessous.";
  else if (m === "natcash") h = "Envoie " + amount + " au NatCash <b>" + PAY.natcash + "</b>, puis écris le code de transaction ci-dessous.";
  else if (m === "paypal") {
    h = exact
      ? '<a target="_blank" rel="noopener" href="https://www.paypal.me/' + PAY.paypalUser + "/" + sum.toFixed(2) + DEVISE + '">Payer ' + money(sum) + " avec PayPal</a>Ensuite, écris le code de transaction ci-dessous."
      : "Le montant doit d'abord être confirmé par WhatsApp avant de payer avec PayPal.";
  } else h = "Tu paies à la réception de ta commande ou en boutique.";
  $("payInfo").innerHTML = h;
  $("payRef").style.display = m === "cash" ? "none" : "block";
}

function renderCart() {
  $("cartItems").innerHTML = cart.length
    ? cart.map((i) => `<div class="cart-item">
        <div><b>${i.name}</b><small>${i.price == null ? "Prix sur demande" : money(i.price) + " l'unité"}</small>
          <div class="qty-controls">
            <button data-minus="${i.id}" aria-label="Retirer un">−</button><span>${i.qty}</span>
            <button data-plus="${i.id}" aria-label="Ajouter un">+</button>
          </div></div>
        <div><strong>${i.price == null ? "—" : money(i.price * i.qty)}</strong><br><button class="text-link" data-del="${i.id}" style="background:none;border:0;cursor:pointer;margin-top:8px">Supprimer</button></div>
      </div>`).join("")
    : '<p class="empty-cart">Votre panier est vide.</p>';
  $("cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
  $("cartTotal").textContent = totalText();
  try { localStorage.setItem("sherlcare-cart", JSON.stringify(cart)); } catch (e) {}
  renderPay();
}

function change(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function openCart(open) {
  document.body.classList.toggle("cart-open", open);
}

document.addEventListener("click", (e) => {
  const img = e.target.closest(".product-art img");
  if (img) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    box.onclick = () => box.remove();
    document.body.appendChild(box);
    return;
  }
  const b = e.target.closest("button");
  if (!b) return;
  const d = b.dataset;
  if (d.add) {
    const p = PRODUCTS.find((x) => x.id == d.add);
    const item = cart.find((i) => i.id === p.id);
    item ? item.qty++ : cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
    renderCart();
    toast(p.name + " ajouté au panier");
  }
  if (d.plus) change(+d.plus, 1);
  if (d.minus) change(+d.minus, -1);
  if (d.del) change(+d.del, -999);
  if (d.filter) {
    document.querySelectorAll(".filter").forEach((f) => f.classList.toggle("active", f === b));
    renderProducts(d.filter);
  }
});

$("cartOpen").onclick = () => openCart(true);
$("cartClose").onclick = () => openCart(false);
$("drawerBackdrop").onclick = () => openCart(false);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") openCart(false); });
$("menuToggle").onclick = () => $("mainNav").classList.toggle("open");
$("mainNav").onclick = (e) => { if (e.target.tagName === "A") $("mainNav").classList.remove("open"); };

$("checkoutBtn").onclick = () => {
  if (!cart.length) return toast("Votre panier est vide.");
  const lines = cart.map((i) => `• ${i.qty} x ${i.name} — ${i.price == null ? "prix à confirmer" : money(i.price * i.qty)}`).join("\n");
  let text = `Bonjour SHERLCARE, je souhaite commander :\n${lines}\n\nTotal estimé : ${totalText()}`;
  const sel = $("payMethod");
  if (sel) text += `\nPaiement : ${sel.options[sel.selectedIndex].text}`;
  const ref = $("payRef") ? $("payRef").value.trim() : "";
  if (ref) text += `\nCode de transaction : ${ref}`;
  wa(text);
};

$("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  wa(`Bonjour SHERLCARE, demande de rendez-vous :\nNom : ${f.name}\nTéléphone : ${f.phone}\nPrestation : ${f.service}\nDate : ${f.date} à ${f.time}\nMessage : ${f.message || "-"}`);
  toast("Demande prête à être envoyée sur WhatsApp");
  e.target.reset();
});

$("whatsappContact").href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Bonjour SHERLCARE, j'ai une question.");
$("year").textContent = new Date().getFullYear();

// Image d'accueil (ton logo) à la place des flacons dessinés
const heroCard = document.querySelector(".hero-card");
if (heroCard && HERO_PHOTO) {
  const hp = new Image();
  hp.alt = "SHERLCARE Cosmétiques - La beauté commence par le soin";
  hp.onload = () => {
    hp.style.objectFit = "contain";
    hp.style.objectPosition = "center";
    hp.style.background = "#0b1f12";
    heroCard.querySelectorAll(".bottle").forEach((b) => b.remove());
    heroCard.prepend(hp);
  };
  hp.src = HERO_PHOTO;
}

// Apparition douce des sections au défilement
const blocks = document.querySelectorAll(".trust-strip,.section,.care-banner,.newsletter");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.08 });
  blocks.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

// Ajouts : logo en bande (optionnel), espace vidéo, contact et paiement
function setupExtras() {
  const st = document.createElement("style");
  st.textContent =
    ".logo-band{display:flex;justify-content:center;padding:18px 16px;background:#12301a;border-bottom:2px solid #c9a227}" +
    ".logo-band img{width:min(380px,90%);height:auto;border-radius:16px;box-shadow:0 10px 32px #0009}" +
    ".inj-video{max-width:900px;margin:0 auto;padding:40px 16px}" +
    ".inj-video h2{margin:0 0 16px}" +
    ".inj-video video,.inj-video iframe{width:100%;aspect-ratio:16/9;border:0;border-radius:16px;background:#000;display:block}" +
    ".inj-ph{padding:40px 16px;text-align:center;border:2px dashed #c9a227;border-radius:16px}" +
    ".inj-contact{display:grid;grid-template-columns:1fr 1fr;gap:12px}" +
    "@media(max-width:560px){.inj-contact{grid-template-columns:1fr}}" +
    ".inj-box{padding:18px;border:1px solid #c9a227;border-radius:16px;text-align:center;background:#12301a;color:#fff}" +
    ".inj-box small{display:block;color:#c9a227;letter-spacing:2px;font-size:12px;margin-bottom:6px}" +
    ".inj-box b,.inj-box a{display:block;font-size:20px;color:#fff;text-decoration:none}" +
    ".inj-box span{display:block;margin-top:6px;font-size:13px;opacity:.85}" +
    ".inj-pay{margin:12px 0}" +
    ".inj-pay label{display:block;font-size:13px;opacity:.85}" +
    ".inj-pay select,.inj-pay input{width:100%;padding:12px;margin-top:8px;border:1px solid #d6cfae;border-radius:10px;background:#fff;color:#14210f;font:inherit}" +
    ".inj-info{margin-top:8px;padding:12px;border-radius:10px;background:#f4efdb;color:#14210f;font-size:14px}" +
    ".inj-info a{display:block;margin:0 0 8px;padding:12px;border-radius:10px;background:#c9a227;color:#14210f;text-align:center;font-weight:700;text-decoration:none}";
  document.head.appendChild(st);

  if (LOGO) {
    const im = new Image();
    im.alt = "SHERLCARE Cosmétiques";
    im.onload = () => {
      const band = document.createElement("div");
      band.className = "logo-band";
      band.appendChild(im);
      const h = document.querySelector("header");
      h ? h.after(band) : document.body.prepend(band);
    };
    im.src = LOGO;
  }

  const grid = $("productGrid");
  const host = grid ? (grid.closest("section") || grid.parentElement) : null;
  if (host) {
    const sec = document.createElement("section");
    sec.className = "inj-video";
    sec.innerHTML = "<h2>Nos produits en vidéo</h2><div id=\"videoBox\"></div>";
    host.after(sec);
    const box = sec.querySelector("#videoBox");
    if (VIDEO.youtube) {
      box.innerHTML = '<iframe src="' + VIDEO.youtube + '" title="Vidéo SHERLCARE" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>';
    } else if (VIDEO.file) {
      const v = document.createElement("video");
      v.src = VIDEO.file;
      v.controls = true;
      v.playsInline = true;
      v.preload = "metadata";
      v.onerror = () => { box.innerHTML = '<p class="inj-ph">Vidéo bientôt disponible</p>'; };
      box.appendChild(v);
    }
  }

  const info = document.createElement("section");
  info.className = "inj-video";
  let boxes = '<div class="inj-box"><small>NOUS CONTACTER</small><a href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener">WhatsApp ' + WHATSAPP_AFFICHE + "</a><span>Commandes, rendez-vous et questions</span></div>";
  if (PAY.moncash) boxes += '<div class="inj-box"><small>PAIEMENT</small><b>MonCash ' + PAY.moncash + "</b><span>Envoie le montant, puis le code de transaction</span></div>";
  info.innerHTML = "<h2>Contact et paiement</h2><div class=\"inj-contact\">" + boxes + "</div>";
  const ft = document.querySelector("footer");
  ft ? ft.before(info) : document.body.appendChild(info);

  const checkout = $("checkoutBtn");
  if (checkout) {
    const pay = document.createElement("div");
    pay.className = "inj-pay";
    pay.innerHTML =
      '<label for="payMethod">Paiement</label>' +
      '<select id="payMethod">' + payMethods().map(([k, n]) => '<option value="' + k + '">' + n + "</option>").join("") + "</select>" +
      '<div id="payInfo" class="inj-info"></div>' +
      '<input id="payRef" placeholder="Code de transaction (si tu as déjà payé)">';
    checkout.before(pay);
    $("payMethod").addEventListener("change", renderPay);
  }
}

setupExtras();
renderProducts();
renderCart();
