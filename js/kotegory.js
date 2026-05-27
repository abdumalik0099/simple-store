import { initTheme, navbarF } from "./theme.js";
import { footerF } from "./footer.js";
import { initNavPopovers } from "./navPopovers.js";
import initSingleRedirect from "./singleRedirect.js";

const categoryContainer = document.querySelector(".container");
const categoryButtons = document.querySelectorAll(".categoriyalar .categotyBtn");
const categoryMap = {
  Electronics: "electronics",
  Jewelery: "jewelery",
  "Men's Clothing": "men's clothing",
  "Women's Clothing": "women's clothing",
};
let cachedProducts = null;
let likedProducts = JSON.parse(localStorage.getItem("liked")) || [];
let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];

function updateNavbarCounts() {
  const likeEl = document.getElementById("like");
  const shopEl = document.getElementById("shop");

  if (likeEl) {
    likeEl.textContent = String(likedProducts.length);
    likeEl.style.display = likedProducts.length > 0 ? "flex" : "none";
  }

  if (shopEl) {
    shopEl.textContent = String(cartProducts.length);
    shopEl.style.display = cartProducts.length > 0 ? "flex" : "none";
  }
}

function createCategoryCard(product) {
  const { id, image, title, description, price } = product;
  const isLiked = likedProducts.some((item) => item.id === id);
  const isAddedToCart = cartProducts.some((item) => item.id === id);

  return `
    <div class="card">
      <div class="image-container">
        <img src="${image}" alt="${title}">
        <button class="heart-btn" data-id="${id}">
          <i class="${isLiked ? "ri-poker-hearts-fill" : "ri-heart-line"}"></i>
        </button>
        <div class="overlay">
          <button class="action-btn eye-btn" data-id="${id}">
            <i class="ri-eye-line"></i>
          </button>
          <button class="action-btn cart-add-btn" data-id="${id}">
            <i class="${isAddedToCart ? "ri-check-double-line" : "ri-shopping-cart-line"}"></i>
          </button>
        </div>
      </div>
      <div class="card-info">
        <h3 class="card-title">${title.length > 35 ? title.slice(0, 35) + "..." : title}</h3>
        <p class="card-desc">${description.length > 90 ? description.slice(0, 90) + "..." : description}</p>
        <span class="card-price">$${price.toFixed(2)}</span>
        <button class="add-to-cart-btn" data-id="${id}">Add to Cart</button>
      </div>
    </div>
  `;
}

function attachCardListeners() {
  if (!categoryContainer) return;

  categoryContainer.querySelectorAll(".heart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.getAttribute("data-id"));
      const productIndex = likedProducts.findIndex((item) => item.id === id);
      const icon = button.querySelector("i");

      if (productIndex === -1) {
        const product = cachedProducts?.find((item) => item.id === id);
        if (product) likedProducts.push(product);
        if (icon) icon.className = "ri-poker-hearts-fill";
      } else {
        likedProducts.splice(productIndex, 1);
        if (icon) icon.className = "ri-heart-line";
      }

      localStorage.setItem("liked", JSON.stringify(likedProducts));
      updateNavbarCounts();
    });
  });

  categoryContainer.querySelectorAll(".cart-add-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.getAttribute("data-id"));
      const productIndex = cartProducts.findIndex((item) => item.id === id);
      const icon = button.querySelector("i");

      if (productIndex === -1) {
        const product = cachedProducts?.find((item) => item.id === id);
        if (product) cartProducts.push(product);
        if (icon) icon.className = "ri-check-double-line";
      } else {
        cartProducts.splice(productIndex, 1);
        if (icon) icon.className = "ri-shopping-cart-line";
      }

      localStorage.setItem("cart", JSON.stringify(cartProducts));
      updateNavbarCounts();
    });
  });

  categoryContainer.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.getAttribute("data-id"));
      const productIndex = cartProducts.findIndex((item) => item.id === id);
      const cartIcon = button.closest(".card")?.querySelector(".cart-add-btn i");

      if (productIndex === -1) {
        const product = cachedProducts?.find((item) => item.id === id);
        if (product) cartProducts.push(product);
        if (cartIcon) cartIcon.className = "ri-check-double-line";
      } else {
        cartProducts.splice(productIndex, 1);
        if (cartIcon) cartIcon.className = "ri-shopping-cart-line";
      }

      localStorage.setItem("cart", JSON.stringify(cartProducts));
      updateNavbarCounts();
    });
  });
}

function renderCategoryProducts(products, categoryLabel) {
  if (!categoryContainer) return;
  if (!products || products.length === 0) {
    categoryContainer.innerHTML = `
      <div class="container1" style="padding: 2rem; text-align: center;">
        <p>"${categoryLabel}" kategoriyasiga mos mahsulot topilmadi.</p>
      </div>
    `;
    return;
  }

  categoryContainer.innerHTML = products.map(createCategoryCard).join("");
  attachCardListeners();
}

async function fetchProducts() {
  if (cachedProducts) return cachedProducts;
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error("Failed to load products");
    cachedProducts = await response.json();
    return cachedProducts;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function handleCategoryClick(event) {
  const button = event.currentTarget;
  const categoryCard = button.closest("div[id^='categ']");
  const heading = categoryCard?.querySelector("h1")?.textContent?.trim();
  const categoryKey = heading ? categoryMap[heading] : null;

  if (!categoryKey) return;

  const products = await fetchProducts();
  const filtered = products.filter((product) => product.category === categoryKey);
  renderCategoryProducts(filtered, heading);
}

function initCategoryButtons() {
  if (!categoryButtons.length) return;

  categoryButtons.forEach((button) => {
    button.addEventListener("click", handleCategoryClick);
  });
}

navbarF();
initTheme();
footerF();
initNavPopovers();
initSingleRedirect({ pagePath: "./single.html" });
initCategoryButtons();
updateNavbarCounts();