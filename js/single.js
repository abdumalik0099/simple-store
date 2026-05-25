import { initTheme, navbarF } from "./theme.js";
import { footerF } from "./footer.js";

navbarF();
initTheme();
footerF();

const container = document.getElementById("single-container");
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

let likedProducts = JSON.parse(localStorage.getItem("liked")) || [];
let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];

function updateNavbar() {
  const likeEl = document.getElementById("like");
  const shopEl = document.getElementById("shop");

  if (likeEl) {
    likeEl.innerText = likedProducts.length;
    likeEl.style.display = likedProducts.length > 0 ? "flex" : "none";
  }

  if (shopEl) {
    shopEl.innerText = cartProducts.length;
    shopEl.style.display = cartProducts.length > 0 ? "flex" : "none";
  }
}

updateNavbar();

// Navbar navigatsiya (single.html html/ papkada turgani uchun)
document.getElementById("navHeart")?.addEventListener("click", () => {
  window.location.href = "./heart.html";
});

document.getElementById("navShop")?.addEventListener("click", () => {
  window.location.href = "./shop.html";
});

function renderError(message) {
  if (!container) return;
  container.innerHTML = `<p style="color: #94a3b8; font-size: 18px; padding-top: 20px;">${message}</p>`;
}

function starsMarkup(rate) {
  const safeRate = Number.isFinite(rate) ? Math.max(0, Math.min(5, rate)) : 0;
  const full = Math.round(safeRate);
  const empty = 5 - full;

  return [
    ...Array.from({ length: full }, () => `<i class="ri-star-fill"></i>`),
    ...Array.from({ length: empty }, () => `<i class="ri-star-line"></i>`),
  ].join("");
}

if (!container) {
  // single.html da container yo'q bo'lsa hech narsa qilmaymiz
} else if (!Number.isFinite(productId) || productId <= 0) {
  renderError("Mahsulot topilmadi (id yo'q).");
} else {
  fetch(`https://fakestoreapi.com/products/${encodeURIComponent(productId)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Fetch failed");
      return res.json();
    })
    .then((product) => {
      const { id, image, title, price, description, category, rating } = product;
      const isLiked = likedProducts.some((p) => p.id === id);
      const existingCartItem = cartProducts.find((p) => p.id === id);

      let quantity = Math.max(1, Number(existingCartItem?.quantity) || 1);

      document.title = title || "Product";

      container.innerHTML = `
        <a class="single-back" href="../index.html">
          <i class="ri-arrow-left-line"></i> Orqaga
        </a>

        <div class="single-layout">
          <div class="single-media">
            <img class="single-img" />
          </div>

          <div class="single-info">
            <div class="single-category"></div>
            <h1 class="single-title"></h1>

            <div class="single-rating">
              <div class="single-stars"></div>
              <div class="single-rating-text"></div>
            </div>

            <div class="single-price"></div>

            <div class="single-tabs" role="tablist">
              <button type="button" class="single-tab is-active" data-tab="description">Description</button>
              <button type="button" class="single-tab" data-tab="details">Details</button>
              <button type="button" class="single-tab" data-tab="shipping">Shipping</button>
            </div>

            <div class="single-panels">
              <div class="single-panel is-active" data-panel="description"></div>
              <div class="single-panel" data-panel="details"></div>
              <div class="single-panel" data-panel="shipping"></div>
            </div>

            <div class="single-qty-row">
              <div class="single-qty-label">Quantity</div>
              <div class="single-qty-controls">
                <button type="button" class="single-qty-btn" data-delta="-1">−</button>
                <span class="single-qty-value">1</span>
                <button type="button" class="single-qty-btn" data-delta="1">+</button>
              </div>
            </div>

            <div class="single-actions">
              <button type="button" class="single-add">
                <i class="ri-shopping-cart-line"></i>
                <span>Add to Cart</span>
              </button>
              <button type="button" class="single-like" aria-label="Like product">
                <i class="${isLiked ? "ri-poker-hearts-fill" : "ri-heart-line"}"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      const imgEl = container.querySelector(".single-img");
      imgEl.src = image;
      imgEl.alt = title;

      container.querySelector(".single-category").textContent = category || "product";
      container.querySelector(".single-title").textContent = title || "Product";

      const rate = Number(rating?.rate) || 0;
      const count = Number(rating?.count) || 0;
      container.querySelector(".single-stars").innerHTML = starsMarkup(rate);
      container.querySelector(".single-rating-text").textContent = `${rate.toFixed(1)} (${count} reviews)`;

      container.querySelector(".single-price").textContent = `$${Number(price).toFixed(2)}`;

      container.querySelector('[data-panel="description"]').textContent = description || "";
      container.querySelector('[data-panel="details"]').innerHTML = `
        <ul class="single-details">
          <li><strong>Category:</strong> ${category || "-"}</li>
          <li><strong>Product ID:</strong> ${id}</li>
          <li><strong>Returns:</strong> 14 days free return</li>
        </ul>
      `;
      container.querySelector('[data-panel="shipping"]').innerHTML = `
        <ul class="single-details">
          <li><strong>Shipping:</strong> Free shipping</li>
          <li><strong>Delivery:</strong> 1–3 business days</li>
        </ul>
      `;

      const qtyValueEl = container.querySelector(".single-qty-value");
      const updateQtyUI = () => {
        qtyValueEl.textContent = String(quantity);
      };
      updateQtyUI();

      container.querySelectorAll(".single-qty-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const delta = Number(btn.getAttribute("data-delta")) || 0;
          quantity = Math.max(1, quantity + delta);
          updateQtyUI();
        });
      });

      container.querySelectorAll(".single-tab").forEach((tabBtn) => {
        tabBtn.addEventListener("click", () => {
          const tab = tabBtn.getAttribute("data-tab");
          if (!tab) return;

          container.querySelectorAll(".single-tab").forEach((b) => b.classList.remove("is-active"));
          container.querySelectorAll(".single-panel").forEach((p) => p.classList.remove("is-active"));

          tabBtn.classList.add("is-active");
          container
            .querySelector(`.single-panel[data-panel="${tab}"]`)
            ?.classList.add("is-active");
        });
      });

      const likeBtn = container.querySelector(".single-like");
      likeBtn.addEventListener("click", () => {
        const index = likedProducts.findIndex((p) => p.id === id);
        if (index === -1) likedProducts.push(product);
        else likedProducts.splice(index, 1);

        localStorage.setItem("liked", JSON.stringify(likedProducts));
        updateNavbar();

        likeBtn.querySelector("i").className = likedProducts.some((p) => p.id === id)
          ? "ri-poker-hearts-fill"
          : "ri-heart-line";
      });

      const addBtn = container.querySelector(".single-add");
      const addBtnLabel = addBtn.querySelector("span");
      let addBtnTimeout;

      addBtn.addEventListener("click", () => {
        const existing = cartProducts.find((p) => p.id === id);
        if (existing) {
          existing.quantity = Math.max(1, Number(existing.quantity) || 1) + quantity;
        } else {
          cartProducts.push({ ...product, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cartProducts));
        updateNavbar();

        clearTimeout(addBtnTimeout);
        addBtnLabel.textContent = "Added";
        addBtnTimeout = setTimeout(() => {
          addBtnLabel.textContent = "Add to Cart";
        }, 900);
      });
    })
    .catch(() => {
      renderError("Mahsulotni yuklab bo'lmadi.");
    });
}
